import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { getSectionOffset } from '../data/content.js'

// Clickable regions on the diorama that jump the scroll position straight to
// a section — turns the scene from purely decorative into actual navigation,
// borrowed from bruno-simon.com's interactive-points idea (scaled down to
// clicks instead of driving). Each hotspot is an invisible proxy mesh (easier
// and safer than wiring onClick onto the already-tuned detail geometry) plus
// a small pulsing ring that hints "this is clickable" without being UI clutter.
const HOTSPOTS = [
  // Monitor screen — showing ETL/pipeline code, maps to Experience
  { id: 'experience', position: [0, 0.78, -0.1], size: [0.7, 0.45, 0.3], ringPos: [0, 0.78, 0.02] },
  // Bookshelf — books as a stand-in for skills/knowledge
  { id: 'skills', position: [-1.9, 1.04, -0.6], size: [0.3, 0.9, 0.9], ringPos: [-1.75, 1.04, -0.6] },
  // Coffee mug — the casual/personal touch, maps to About
  { id: 'about', position: [-0.5, 0.49, 0.16], size: [0.25, 0.25, 0.25], ringPos: [-0.5, 0.56, 0.16] },
  // Framed art — "work on display", maps to Projects
  { id: 'projects', position: [-0.5, 1.65, -1.25], size: [0.5, 0.65, 0.3], ringPos: [-0.5, 1.65, -1.22] },
  // Window — looking outward, maps to Contact
  { id: 'contact', position: [1.1, 1.5, -1.2], size: [1.1, 1.6, 0.4], ringPos: [1.1, 1.5, -1.0] },
]

function Hotspot({ id, position, size, ringPos }) {
  const scroll = useScroll()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const pulse = 0.85 + Math.sin(clock.elapsedTime * 2.2) * 0.15
    const scale = hovered ? pulse * 1.18 : pulse
    ringRef.current.scale.setScalar(scale)
    ringRef.current.material.opacity = hovered ? 0.6 : 0.2
  })

  function handleClick(event) {
    event.stopPropagation()
    const el = scroll.el
    if (!el) return
    const offset = getSectionOffset(id)
    const scrollThreshold = el.scrollHeight - el.clientHeight
    el.scrollTo({ top: offset * scrollThreshold, behavior: 'smooth' })
  }

  function handlePointerOver(event) {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  function handlePointerOut(event) {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group>
      <mesh
        position={position}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={ringPos}>
        <ringGeometry args={[0.045, 0.058, 24]} />
        <meshBasicMaterial
          color="#f07340"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={2 /* THREE.AdditiveBlending */}
          side={2 /* THREE.DoubleSide */}
        />
      </mesh>
    </group>
  )
}

export default function Hotspots() {
  return (
    <>
      {HOTSPOTS.map((spot) => (
        <Hotspot key={spot.id} {...spot} />
      ))}
    </>
  )
}
