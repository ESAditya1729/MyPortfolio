import { useRef, useCallback, useEffect } from 'react'

// Generates a gentle lo-fi ambient pad entirely in the Web Audio API —
// no external file to load or host. Three detuned oscillators create a
// soft, warm chord that loops seamlessly.
//
// Browser autoplay policy prevents audio starting without a user gesture.
// We expose a `toggle()` so the SoundToggle button can start/stop it on click.
const FADE_IN = 2.0
const FADE_OUT = 1.5
const TARGET_GAIN = 0.9 // post-compressor, so this is safe to push fairly high

export function useAmbientSound() {
  const ctxRef = useRef(null)
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
    masterRef.current = master

    // A compressor sits between master and the speakers so we can mix the
    // oscillators at a level that's actually audible without worrying about
    // their peaks summing past 0dB and clipping.
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.knee.value = 12
    compressor.ratio.value = 4
    compressor.attack.value = 0.02
    compressor.release.value = 0.3

    master.connect(compressor)
    compressor.connect(ctx.destination)

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
      gain.gain.value = 0.09 - i * 0.01
      osc.connect(gain)
      gain.connect(master)
      osc.start()
    })

    // Sub bass
    const bass = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bass.type = 'sine'
    bass.frequency.value = 65.41 // C2
    bassGain.gain.value = 0.07
    bass.connect(bassGain)
    bassGain.connect(master)
    bass.start()

    // High shimmer
    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.value = 987.77 // B5
    shimmerGain.gain.value = 0.015
    shimmer.connect(shimmerGain)
    shimmerGain.connect(master)
    shimmer.start()

    // Gentle LFO on master gain — a slow 0.08 Hz amplitude swell (≈12s cycle)
    // gives the pad a breathing quality rather than a static drone
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 0.02
    lfo.connect(lfoGain)
    lfoGain.connect(master.gain)
    lfo.start()
  }, [])

  const fadeIn = useCallback((ctx, master) => {
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(TARGET_GAIN, now + FADE_IN)
    playingRef.current = true
  }, [])

  const toggle = useCallback(() => {
    buildGraph()
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    if (playingRef.current) {
      // Fade out over 1.5s then suspend (saves CPU)
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + FADE_OUT)
      setTimeout(() => ctx.suspend(), (FADE_OUT + 0.1) * 1000)
      playingRef.current = false
      return
    }

    // Starting: make sure the context is actually running before scheduling
    // the fade-in. Some browsers create a new AudioContext (or one left
    // suspended) in 'suspended' state even inside a click handler, and
    // resume() is async — scheduling against ctx.currentTime before it
    // resolves is what can make this read as "no sound at all".
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => fadeIn(ctx, master))
    } else {
      fadeIn(ctx, master)
    }
  }, [buildGraph, fadeIn])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.close()
    }
  }, [])

  return { toggle, isPlaying: () => playingRef.current }
}
