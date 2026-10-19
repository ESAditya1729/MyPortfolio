import { useRef, useCallback, useEffect } from 'react'

// Generates a gentle lo-fi ambient pad entirely in the Web Audio API —
// no external file to load or host. Three detuned oscillators create a
// soft, warm chord that loops seamlessly. Volume is deliberately very low
// so it reads as atmospheric background texture, not music.
//
// Browser autoplay policy prevents audio starting without a user gesture.
// We expose a `toggle()` so the SoundToggle button can start/stop it on click.
export function useAmbientSound() {
  const ctxRef   = useRef(null)
  const masterRef = useRef(null)
  const playingRef = useRef(false)

  // Build the audio graph lazily on first toggle
  const buildGraph = useCallback(() => {
    if (ctxRef.current) return

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    // Master gain — fades in on unmute, fades out on mute
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.connect(ctx.destination)
    masterRef.current = master

    // Three layers:
    //  1. Sustained pad — detuned triangle waves forming a minor-ish chord
    //  2. Sub-bass drone — very low sine, felt more than heard
    //  3. High shimmer — quiet high-frequency sine for air

    const padFreqs = [130.81, 155.56, 196.0, 246.94] // C3 Eb3 G3 B3 — Cmin maj7
    padFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq * (1 + (i % 2 === 0 ? 0.0008 : -0.0008)) // slight detune
      gain.gain.value = 0.022 - i * 0.003
      osc.connect(gain)
      gain.connect(master)
      osc.start()
    })

    // Sub bass
    const bass = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bass.type = 'sine'
    bass.frequency.value = 65.41 // C2
    bassGain.gain.value = 0.018
    bass.connect(bassGain)
    bassGain.connect(master)
    bass.start()

    // High shimmer
    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.value = 987.77 // B5
    shimmerGain.gain.value = 0.004
    shimmer.connect(shimmerGain)
    shimmerGain.connect(master)
    shimmer.start()

    // Gentle LFO on master gain — a slow 0.08 Hz amplitude swell (≈12s cycle)
    // gives the pad a breathing quality rather than a static drone
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 0.006
    lfo.connect(lfoGain)
    lfoGain.connect(master.gain)
    lfo.start()
  }, [])

  const toggle = useCallback(() => {
    buildGraph()
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    if (playingRef.current) {
      // Fade out over 1.5s then suspend (saves CPU)
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 1.5)
      setTimeout(() => ctx.suspend(), 1600)
      playingRef.current = false
    } else {
      // Fade in over 2s
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(0, now)
      master.gain.linearRampToValueAtTime(0.55, now + 2.0)
      playingRef.current = true
    }

    return playingRef.current
  }, [buildGraph])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.close()
    }
  }, [])

  return { toggle, isPlaying: () => playingRef.current }
}
