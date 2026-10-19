import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'

// Minimum time to hold the overlay so it never just flashes if everything
// (HDRI, fonts) happens to resolve near-instantly.
const MIN_VISIBLE_MS = 500

export default function LoadingOverlay() {
  const { progress } = useProgress()
  const [hidden, setHidden] = useState(false)
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    if (progress < 100) return
    const elapsed = Date.now() - mountedAt.current
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed)
    const timer = setTimeout(() => setHidden(true), delay)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`loading-overlay${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="loading-panel">
        <span className="loading-kicker">Aditya Mukherjee</span>
        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <span className="loading-percent">{Math.round(Math.min(progress, 100))}%</span>
      </div>
    </div>
  )
}
