import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useCityscapeTexture, useFloorTexture, useNamePlateTexture, useRugTexture, useScreenTexture, useWallTexture } from './textures.js'

// Animated floating particles above the monitor
function MonitorGlow() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 0.45 + Math.sin(clock.elapsedTime * 1.4) * 0.12
    }
  })
  return (
    <pointLight
      ref={ref}
      position={[0, 0.85, -0.05]}
      intensity={0.5}
      color="#60a5fa"
      distance={1.6}
      decay={2}
    />
  )
}

// Desk lamp bulb that flickers very subtly
function LampBulb({ position }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      const flicker = 0.85 + Math.sin(clock.elapsedTime * 3.7) * 0.06 + Math.sin(clock.elapsedTime * 11.2) * 0.04
      ref.current.intensity = flicker
    }
  })
  return (
    <pointLight
      ref={ref}
      position={position}
      intensity={0.85}
      color="#ffb060"
      distance={2.8}
      decay={2}
    />
  )
}

export default function Diorama() {
  const floorTexture = useFloorTexture()
  const rugTexture = useRugTexture()
  const screenTexture = useScreenTexture()
  const wallTexture = useWallTexture()
  const cityscapeTexture = useCityscapeTexture()
  // Real 1919 photograph (public domain) — a human face is exactly the kind
  // of content canvas-primitive drawing can't render convincingly, unlike
  // the abstract/patterned textures elsewhere in this scene.
  const ramanujanTexture = useTexture('/images/ramanujan-portrait.jpg')
  const namePlateTexture = useNamePlateTexture(
    'S. Ramanujan',
    '1887 — 1920',
    '"An equation has no meaning unless it expresses a thought of God."',
  )

  return (
    <group position={[0, 0, 0]}>

      {/* ── Floor ─────────────────────────────────────────────────────────── */}
      <mesh position={[0, -0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial map={floorTexture} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* ── Rug ───────────────────────────────────────────────────────────── */}
      <mesh position={[0, -0.03, 0.3]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshStandardMaterial map={rugTexture} roughness={0.92} />
      </mesh>

      {/* ── Back wall ─────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.1, -1.35]} receiveShadow>
        <boxGeometry args={[5.5, 2.6, 0.08]} />
        <meshStandardMaterial map={wallTexture} roughness={0.92} />
      </mesh>

      {/* ── Left side wall ────────────────────────────────────────────────── */}
      <mesh position={[-2.1, 1.1, -0.05]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 2.6, 0.08]} />
        <meshStandardMaterial map={wallTexture} roughness={0.92} />
      </mesh>

      {/* ── Right side wall (encloses the room so wide shots don't reveal an open edge) ── */}
      <mesh position={[2.3, 1.1, -0.05]} receiveShadow rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 2.6, 0.08]} />
        <meshStandardMaterial map={wallTexture} roughness={0.92} />
      </mesh>

      {/* ── Window on back wall ───────────────────────────────────────────── */}
      {/* Window frame */}
      <mesh position={[1.1, 1.5, -1.3]}>
        <boxGeometry args={[1.2, 1.5, 0.04]} />
        <meshStandardMaterial color="#141820" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Window glass — real night-skyline texture (moon, stars, lit buildings) */}
      <mesh position={[1.1, 1.5, -1.27]}>
        <planeGeometry args={[1.0, 1.3]} />
        <meshStandardMaterial
          map={cityscapeTexture}
          emissiveMap={cityscapeTexture}
          emissive="#ffffff"
          emissiveIntensity={0.9}
          toneMapped={false}
          roughness={0.05}
          metalness={0.0}
        />
      </mesh>
      {/* Window cross bar */}
      <mesh position={[1.1, 1.5, -1.26]}>
        <boxGeometry args={[1.04, 0.03, 0.02]} />
        <meshStandardMaterial color="#0e0f18" roughness={0.4} />
      </mesh>
      <mesh position={[1.1, 1.5, -1.26]}>
        <boxGeometry args={[0.03, 1.34, 0.02]} />
        <meshStandardMaterial color="#0e0f18" roughness={0.4} />
      </mesh>
      {/* Window light spill into scene */}
      <pointLight
        position={[1.1, 1.5, -1.0]}
        intensity={1.2}
        color="#4466bb"
        distance={3.5}
        decay={2}
      />

      {/* Glass specular streak — a soft diagonal highlight sells "glass" far
          more than a flat textured pane alone; orientation-agnostic (it's
          decorative, not physically directional) so there's no risk of it
          reading wrong. */}
      <mesh position={[1.25, 1.65, -1.255]} rotation={[0, 0, 0.35]}>
        <planeGeometry args={[0.16, 1.05]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          blending={2 /* THREE.AdditiveBlending */}
          depthWrite={false}
        />
      </mesh>

      {/* Soft window-light haze — a low-opacity glow blob rather than a
          directional beam, so it can't end up pointing the wrong way. Reads
          as diffused moonlight/city-glow pooling in that corner, especially
          once Bloom picks it up. */}
      <mesh position={[0.85, 1.35, -0.85]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshBasicMaterial
          color="#5577cc"
          transparent
          opacity={0.05}
          blending={2 /* THREE.AdditiveBlending */}
          depthWrite={false}
        />
      </mesh>

      {/* ── Baseboard / floor trim ────────────────────────────────────────── */}
      <mesh position={[0, -0.01, -1.33]}>
        <boxGeometry args={[5.5, 0.12, 0.05]} />
        <meshStandardMaterial color="#141620" roughness={0.6} />
      </mesh>
      <mesh position={[-2.08, -0.01, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 0.12, 0.05]} />
        <meshStandardMaterial color="#141620" roughness={0.6} />
      </mesh>
      <mesh position={[2.28, -0.01, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 0.12, 0.05]} />
        <meshStandardMaterial color="#141620" roughness={0.6} />
      </mesh>

      {/* ── Ceiling trim — softens the hard seam where walls meet the ceiling ── */}
      <mesh position={[0, 2.38, -1.33]}>
        <boxGeometry args={[5.4, 0.06, 0.12]} />
        <meshStandardMaterial color="#0e0f18" roughness={0.65} />
      </mesh>
      <mesh position={[-2.08, 2.38, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 0.06, 0.12]} />
        <meshStandardMaterial color="#0e0f18" roughness={0.65} />
      </mesh>
      <mesh position={[2.28, 2.38, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 0.06, 0.12]} />
        <meshStandardMaterial color="#0e0f18" roughness={0.65} />
      </mesh>

      {/* ── Desk ──────────────────────────────────────────────────────────── */}
      {/* Desk surface */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.055, 0.75]} />
        <meshStandardMaterial color="#3d2612" roughness={0.45} metalness={0.08} />
      </mesh>
      {/* Desk surface lip — tiny warm emissive glint so it catches the lamp light */}
      <mesh position={[0, 0.415, 0.38]}>
        <boxGeometry args={[1.55, 0.04, 0.02]} />
        <meshStandardMaterial color="#2e1c0c" roughness={0.5} emissive="#f07340" emissiveIntensity={0.04} />
      </mesh>
      {/* Desk legs */}
      {[-0.65, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.21, 0]} castShadow>
          <boxGeometry args={[0.055, 0.42, 0.62]} />
          <meshStandardMaterial color="#1e2130" roughness={0.55} metalness={0.35} />
        </mesh>
      ))}
      {/* Under-desk modesty panel */}
      <mesh position={[0, 0.22, -0.28]}>
        <boxGeometry args={[1.2, 0.3, 0.018]} />
        <meshStandardMaterial color="#1a1c28" roughness={0.7} />
      </mesh>

      {/* ── Monitor ───────────────────────────────────────────────────────── */}
      {/* Monitor body */}
      <mesh position={[0, 0.78, -0.22]} castShadow>
        <boxGeometry args={[0.72, 0.42, 0.025]} />
        <meshStandardMaterial color="#111318" roughness={0.35} metalness={0.45} />
      </mesh>
      {/* Bezel chamfer strips */}
      {[
        { pos: [0, 0.78 + 0.22, -0.208], rot: [0, 0, 0], size: [0.72, 0.012, 0.014] },
        { pos: [0, 0.78 - 0.22, -0.208], rot: [0, 0, 0], size: [0.72, 0.012, 0.014] },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#1a1d25" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Screen */}
      <mesh position={[0, 0.78, -0.206]}>
        <planeGeometry args={[0.64, 0.36]} />
        <meshStandardMaterial
          map={screenTexture}
          emissiveMap={screenTexture}
          emissive="#ffffff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      {/* Monitor stand neck */}
      <mesh position={[0, 0.57, -0.22]} castShadow>
        <boxGeometry args={[0.038, 0.18, 0.038]} />
        <meshStandardMaterial color="#111318" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Monitor stand base */}
      <mesh position={[0, 0.468, -0.22]} castShadow>
        <boxGeometry args={[0.22, 0.012, 0.12]} />
        <meshStandardMaterial color="#111318" roughness={0.3} metalness={0.55} />
      </mesh>
      {/* Animated monitor glow */}
      <MonitorGlow />

      {/* ── Keyboard ──────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.448, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.018, 0.15]} />
        <meshStandardMaterial color="#181a22" roughness={0.55} metalness={0.2} />
      </mesh>
      {/* Keyboard key rows (3 simplified rows) */}
      {[0, 1, 2].map((row) => (
        <mesh key={row} position={[0, 0.458, 0.025 + row * 0.044]} castShadow>
          <boxGeometry args={[0.38, 0.005, 0.034]} />
          <meshStandardMaterial color="#1d2030" roughness={0.7} />
        </mesh>
      ))}

      {/* ── Mouse ─────────────────────────────────────────────────────────── */}
      <mesh position={[0.32, 0.449, 0.1]} castShadow>
        <capsuleGeometry args={[0.022, 0.055, 8, 16]} />
        <meshStandardMaterial color="#181a22" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Mouse scroll wheel */}
      <mesh position={[0.32, 0.474, 0.093]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.014, 12]} />
        <meshStandardMaterial color="#2a2d40" roughness={0.4} />
      </mesh>

      {/* ── Mug ───────────────────────────────────────────────────────────── */}
      <mesh position={[-0.5, 0.462, 0.16]} castShadow>
        <cylinderGeometry args={[0.048, 0.042, 0.095, 20]} />
        <meshStandardMaterial color="#f07340" roughness={0.45} metalness={0.1} />
      </mesh>
      {/* Mug handle */}
      <mesh position={[-0.454, 0.462, 0.16]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.025, 0.006, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#d05820" roughness={0.5} />
      </mesh>
      {/* Coffee inside mug */}
      <mesh position={[-0.5, 0.507, 0.16]}>
        <circleGeometry args={[0.042, 20]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a0e06" roughness={0.2} />
      </mesh>

      {/* ── Pen holder ────────────────────────────────────────────────────── */}
      <mesh position={[-0.22, 0.47, 0.17]} castShadow>
        <cylinderGeometry args={[0.032, 0.03, 0.07, 16]} />
        <meshStandardMaterial color="#2a2d40" roughness={0.5} metalness={0.15} />
      </mesh>
      {[
        { dx: -0.01, dz: 0.005, rotZ: 0.08, color: '#e8e8ea' },
        { dx: 0.012, dz: -0.008, rotZ: -0.12, color: '#f07340' },
        { dx: 0.003, dz: 0.012, rotZ: 0.18, color: '#4ecdbe' },
      ].map((pen, i) => (
        <mesh
          key={i}
          position={[-0.22 + pen.dx, 0.545, 0.17 + pen.dz]}
          rotation={[0, 0, pen.rotZ]}
          castShadow
        >
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
          <meshStandardMaterial color={pen.color} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* ── Framed Ramanujan portrait — standing on the desk, beside the
          lamp, not out front where it competed with keyboard/mouse/mug.
          The wall placement (y=1.68) sat far above every cameraPath target
          (all ~0.55-0.65), so it never actually fell inside any shot. Desk
          height keeps it in the same low band as the monitor/mug/plant,
          which are confirmed visible throughout the whole scroll. ─────── */}
      <group position={[-0.4, 0.4475, -0.18]} rotation={[-0.32, 0, 0]}>
        {/* Outer wooden frame, pivoted at its bottom edge so it leans back
            like a real standing photo frame resting on the desk */}
        <mesh position={[0, 0.108, 0]} castShadow>
          <boxGeometry args={[0.17, 0.216, 0.014]} />
          <meshStandardMaterial color="#3a2008" roughness={0.55} metalness={0.05} />
        </mesh>
        {/* Inner mat */}
        <mesh position={[0, 0.108, 0.0075]}>
          <boxGeometry args={[0.145, 0.19, 0.005]} />
          <meshStandardMaterial color="#d8cba8" roughness={0.9} />
        </mesh>
        {/* The portrait itself — plane aspect matched to the real photo (250x333) */}
        <mesh position={[0, 0.108, 0.011]}>
          <planeGeometry args={[0.125, 0.167]} />
          <meshStandardMaterial map={ramanujanTexture} roughness={0.85} metalness={0.0} />
        </mesh>
      </group>
      {/* Small engraved brass name plate lying flat just in front of the frame —
          legible from the camera's typical elevated, slightly-downward angle */}
      <mesh position={[-0.4, 0.452, -0.145]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.03]} />
        <meshStandardMaterial map={namePlateTexture} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* ── Desk lamp ─────────────────────────────────────────────────────── */}
      <group position={[-0.62, 0.42, -0.28]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.018, 16]} />
          <meshStandardMaterial color="#1c1f2c" metalness={0.65} roughness={0.3} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, 0.22, 0]} castShadow rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.44, 8]} />
          <meshStandardMaterial color="#1c1f2c" metalness={0.65} roughness={0.3} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial color="#22263a" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Upper arm (angled) */}
        <mesh position={[0.1, 0.56, 0.04]} rotation={[0.4, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.26, 8]} />
          <meshStandardMaterial color="#1c1f2c" metalness={0.65} roughness={0.3} />
        </mesh>
        {/* Lamp shade */}
        <mesh position={[0.16, 0.48, 0.06]} rotation={[0, 0, -0.55]} castShadow>
          <coneGeometry args={[0.09, 0.16, 18, 1, true]} />
          <meshStandardMaterial color="#f07340" roughness={0.4} side={2} />
        </mesh>
        {/* Bulb rim */}
        <mesh position={[0.17, 0.42, 0.07]}>
          <torusGeometry args={[0.055, 0.006, 8, 24]} />
          <meshStandardMaterial color="#f07340" roughness={0.5} metalness={0.3} />
        </mesh>
        <LampBulb position={[0.18, 0.42, 0.08]} />
      </group>

      {/* ── Chair ─────────────────────────────────────────────────────────── */}
      {/* Seat */}
      <mesh position={[0, 0.32, 0.78]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.055, 0.48]} />
        <meshStandardMaterial color="#1e4d6b" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, 0.352, 0.78]} castShadow>
        <boxGeometry args={[0.44, 0.02, 0.44]} />
        <meshStandardMaterial color="#225580" roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.58, 1.0]} castShadow>
        <boxGeometry args={[0.48, 0.52, 0.055]} />
        <meshStandardMaterial color="#1e4d6b" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, 0.58, 0.972]} castShadow>
        <boxGeometry args={[0.44, 0.46, 0.02]} />
        <meshStandardMaterial color="#225580" roughness={0.7} />
      </mesh>
      {/* Chair legs */}
      {[
        [-0.2, 0.66],
        [0.2, 0.66],
        [-0.2, 0.9],
        [0.2, 0.9],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.32, 8]} />
          <meshStandardMaterial color="#1c1f2c" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      {/* Chair armrests */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.44, 0.78]} castShadow>
            <boxGeometry args={[0.025, 0.22, 0.025]} />
            <meshStandardMaterial color="#1c1f2c" metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[x, 0.565, 0.82]} castShadow>
            <boxGeometry args={[0.025, 0.018, 0.28]} />
            <meshStandardMaterial color="#1e4d6b" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Bookshelf on left wall ─────────────────────────────────────────── */}
      {/* Shelf board top */}
      <mesh position={[-1.9, 1.38, -0.6]} castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.0, 0.025, 0.2]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.55} />
      </mesh>
      {/* Shelf board bottom */}
      <mesh position={[-1.9, 0.7, -0.6]} castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.0, 0.025, 0.2]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.55} />
      </mesh>
      {/* Shelf side panels */}
      {[-1.1, -0.1].map((z, i) => (
        <mesh key={i} position={[-1.9, 1.04, z - 0.6 + 0.5]} castShadow rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.025, 0.68, 0.2]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.55} />
        </mesh>
      ))}
      {/* Books on shelf — varied heights and colors */}
      {[
        { z: -1.1, h: 0.22, color: '#c0633f' },
        { z: -1.0, h: 0.26, color: '#3f6b8a' },
        { z: -0.88, h: 0.2, color: '#8a7d3f' },
        { z: -0.77, h: 0.24, color: '#5a3f8a' },
        { z: -0.65, h: 0.21, color: '#3f8a5a' },
        { z: -0.54, h: 0.19, color: '#8a3f5a' },
        { z: -0.44, h: 0.25, color: '#7a6a2f' },
        { z: -0.33, h: 0.22, color: '#2f5a7a' },
        { z: -0.22, h: 0.2, color: '#6a3f2f' },
      ].map((book, i) => (
        <group key={i}>
          {/* Book body */}
          <mesh position={[-1.88, 0.72 + book.h / 2, book.z]} castShadow rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.095, book.h, 0.15]} />
            <meshStandardMaterial color={book.color} roughness={0.75} />
          </mesh>
          {/* Book spine stripe */}
          <mesh position={[-1.79, 0.72 + book.h / 2, book.z]} castShadow rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.002, book.h * 0.6, 0.145]} />
            <meshStandardMaterial color={`${book.color}88`} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Potted plant (on desk) ─────────────────────────────────────────── */}
      {/* Pot */}
      <mesh position={[0.62, 0.48, -0.25]} castShadow>
        <cylinderGeometry args={[0.065, 0.05, 0.1, 14]} />
        <meshStandardMaterial color="#3d2e22" roughness={0.75} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0.62, 0.535, -0.25]} castShadow>
        <torusGeometry args={[0.065, 0.007, 8, 20]} />
        <meshStandardMaterial color="#4a3828" roughness={0.65} />
      </mesh>
      {/* Plant stems */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              0.62 + Math.cos(angle) * 0.025,
              0.58 + i * 0.025,
              -0.25 + Math.sin(angle) * 0.025,
            ]}
            rotation={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
            castShadow
          >
            <cylinderGeometry args={[0.004, 0.004, 0.12, 6]} />
            <meshStandardMaterial color="#2d5a1a" roughness={0.7} />
          </mesh>
        )
      })}
      {/* Leaves */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const r = 0.06 + (i % 2) * 0.04
        return (
          <mesh
            key={i}
            position={[
              0.62 + Math.cos(angle) * r,
              0.64 + (i % 3) * 0.035,
              -0.25 + Math.sin(angle) * r,
            ]}
            rotation={[Math.sin(angle) * 0.4, angle, Math.cos(angle) * 0.3]}
            castShadow
          >
            <planeGeometry args={[0.09, 0.05]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#3a8a2a' : '#2d6a1e'} roughness={0.65} side={2} />
          </mesh>
        )
      })}

      {/* ── Floor plant (larger, beside desk) ─────────────────────────────── */}
      <mesh position={[-1.65, 0.22, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.45, 14]} />
        <meshStandardMaterial color="#4a3020" roughness={0.8} />
      </mesh>
      <mesh position={[-1.65, 0.58, 0.2]} castShadow>
        <icosahedronGeometry args={[0.26, 1]} />
        <meshStandardMaterial color="#2d7a3a" roughness={0.55} flatShading />
      </mesh>
      {/* Secondary spheres for volume */}
      {[0.18, -0.15, 0.06].map((dx, i) => (
        <mesh key={i} position={[-1.65 + dx, 0.62 + i * 0.04, 0.2 + (i - 1) * 0.12]} castShadow>
          <icosahedronGeometry args={[0.16 - i * 0.02, 0]} />
          <meshStandardMaterial color={['#37a04a', '#28703a', '#3d8a2a'][i]} roughness={0.6} flatShading />
        </mesh>
      ))}

      {/* ── Second frame — abstract cool (unchanged) ──────────────────────── */}
      <mesh position={[-1.0, 1.58, -1.3]} castShadow>
        <boxGeometry args={[0.32, 0.38, 0.022]} />
        <meshStandardMaterial color="#0e1018" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-1.0, 1.58, -1.288]}>
        <planeGeometry args={[0.24, 0.3]} />
        <meshStandardMaterial
          color="#0c1828"
          emissive="#4488ff"
          emissiveIntensity={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* ── Desk cable/wire (USB cable) ────────────────────────────────────── */}
      {/* Simple curved cable suggestion */}
      <mesh position={[0.1, 0.445, 0.0]} rotation={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.35, 6]} />
        <meshStandardMaterial color="#121418" roughness={0.7} />
      </mesh>

      {/* ── Small phone / tablet on desk ─────────────────────────────────── */}
      <mesh position={[0.42, 0.448, 0.22]} rotation={[-0.1, -0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.006, 0.14]} />
        <meshStandardMaterial color="#101218" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.42, 0.455, 0.22]} rotation={[-0.1, -0.2, 0]}>
        <planeGeometry args={[0.07, 0.13]} />
        <meshStandardMaterial
          color="#0d1825"
          emissive="#3366cc"
          emissiveIntensity={0.3}
          toneMapped={false}
          roughness={0.0}
        />
      </mesh>

      {/* ── Sticky notes on monitor bezel ─────────────────────────────────── */}
      {[
        { x: 0.28, y: 0.97, color: '#ffe066', rot: 0.1 },
        { x: -0.28, y: 0.96, color: '#aaf0cc', rot: -0.08 },
      ].map(({ x, y, color, rot }, i) => (
        <mesh key={i} position={[x, y, -0.193]} rotation={[0, 0, rot]} castShadow>
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.85} emissive={color} emissiveIntensity={0.12} />
        </mesh>
      ))}

      {/* ── Ceiling — subtle top surface ──────────────────────────────────── */}
      <mesh position={[0, 2.3, -0.3]} receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 3.2]} />
        <meshStandardMaterial color="#0c0e18" roughness={0.98} />
      </mesh>

      {/* ── Overhead light fixture ─────────────────────────────────────────── */}
      <mesh position={[0, 2.28, -0.4]}>
        <boxGeometry args={[0.45, 0.025, 0.15]} />
        <meshStandardMaterial color="#22243a" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 2.27, -0.4]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#c8dcff"
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 2.2, -0.4]} intensity={0.35} color="#c8dcff" distance={3.5} decay={2} />

    </group>
  )
}
