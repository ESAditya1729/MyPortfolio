import { useState } from 'react'
import { useAmbientSound } from '../hooks/useAmbientSound.js'

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

export default function SoundToggle() {
  const [playing, setPlaying] = useState(false)
  const { toggle } = useAmbientSound()

  function handleClick() {
    toggle()
    setPlaying((p) => !p)
  }

  return (
    <button
      className="sound-toggle"
      onClick={handleClick}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      title={playing ? 'Mute' : 'Ambient sound'}
    >
      <span className="sound-toggle-icon">
        {playing ? <SoundOnIcon /> : <SoundOffIcon />}
      </span>
      <span className="sound-toggle-label">{playing ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
