import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { cameraPath } from './cameraPath.js'

// Drives the camera along a smooth curve through cameraPath's keyframes,
// one keyframe per content section, based on scroll progress (0..1).
// An idle float animation is layered on top so the scene never reads as frozen.
export default function CameraRig() {
  const scroll = useScroll()

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

  useFrame(({ camera, clock }) => {
    const t = scroll.offset
    const time = clock.elapsedTime

    // Path position
    positionCurve.getPointAt(t, _pos)
    targetCurve.getPointAt(t, _tgt)

    // Idle float: gentle breathing motion layered onto the path position.
    // Amplitude is deliberately tiny so it feels like a handheld camera —
    // noticeable enough to read as "alive", invisible enough to not distract.
    const floatX = Math.sin(time * 0.38) * 0.012 + Math.sin(time * 0.71) * 0.006
    const floatY = Math.sin(time * 0.52) * 0.015 + Math.cos(time * 0.29) * 0.008
    const floatZ = Math.cos(time * 0.45) * 0.010

    camera.position.set(
      _pos.x + floatX,
      _pos.y + floatY,
      _pos.z + floatZ,
    )
    camera.lookAt(_tgt)
  })

  return null
}
