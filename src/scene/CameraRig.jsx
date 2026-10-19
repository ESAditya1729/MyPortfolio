import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { cameraPath } from './cameraPath.js'

const REVEAL_DURATION = 1.6 // seconds, eased

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

// Drives the camera along a smooth curve through cameraPath's keyframes,
// one keyframe per content section, based on scroll progress (0..1).
// An idle float animation is layered on top so the scene never reads as frozen.
//
// On top of that: an intro reveal. The camera holds at a wider, higher
// "establishing" pose while the loading overlay is up (invisible to the
// visitor either way), then eases down into the real hero position the
// instant loading finishes — so the first thing anyone sees is already a
// settling-in motion, not an instant pop-in.
export default function CameraRig() {
  const scroll = useScroll()
  const { progress } = useProgress()

  const { positionCurve, targetCurve } = useMemo(() => {
    const positionCurve = new THREE.CatmullRomCurve3(
      cameraPath.map(({ position }) => new THREE.Vector3(...position)),
    )
    const targetCurve = new THREE.CatmullRomCurve3(
      cameraPath.map(({ target }) => new THREE.Vector3(...target)),
    )
    return { positionCurve, targetCurve }
  }, [])

  const _pos = useMemo(() => new THREE.Vector3(), [])
  const _tgt = useMemo(() => new THREE.Vector3(), [])

  const introStart = useMemo(() => {
    const [hx, hy, hz] = cameraPath[0].position
    return new THREE.Vector3(hx, hy + 1.1, hz + 2.2)
  }, [])

  const revealStartTime = useRef(null)

  useFrame(({ camera, clock }) => {
    const time = clock.elapsedTime

    if (progress >= 100 && revealStartTime.current === null) {
      revealStartTime.current = time
    }

    const t = scroll.offset

    // Path position
    positionCurve.getPointAt(t, _pos)
    targetCurve.getPointAt(t, _tgt)

    // Idle float: gentle breathing motion layered onto the path position.
    // Amplitude is deliberately tiny so it feels like a handheld camera —
    // noticeable enough to read as "alive", invisible enough to not distract.
    const floatX = Math.sin(time * 0.38) * 0.012 + Math.sin(time * 0.71) * 0.006
    const floatY = Math.sin(time * 0.52) * 0.015 + Math.cos(time * 0.29) * 0.008
    const floatZ = Math.cos(time * 0.45) * 0.010

    const curvedX = _pos.x + floatX
    const curvedY = _pos.y + floatY
    const curvedZ = _pos.z + floatZ

    if (revealStartTime.current === null) {
      // Still loading — holding here is invisible, the loading overlay covers it
      camera.position.copy(introStart)
    } else {
      const elapsed = time - revealStartTime.current
      const reveal = elapsed >= REVEAL_DURATION ? 1 : easeOutCubic(elapsed / REVEAL_DURATION)
      camera.position.set(
        THREE.MathUtils.lerp(introStart.x, curvedX, reveal),
        THREE.MathUtils.lerp(introStart.y, curvedY, reveal),
        THREE.MathUtils.lerp(introStart.z, curvedZ, reveal),
      )
    }

    camera.lookAt(_tgt)
  })

  return null
}
