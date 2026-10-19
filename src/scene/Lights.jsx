export default function Lights() {
  return (
    <>
      {/* Very dim ambient so the shadow areas read as near-black, not flat */}
      <ambientLight intensity={0.18} color="#1a1e2e" />

      {/* Key light: warm tungsten — simulates the desk lamp spilling onto the scene */}
      <directionalLight
        position={[1.8, 3.4, -1.4]}
        intensity={1.6}
        color="#ffd0a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-bias={-0.0004}
      />

      {/* Fill light: cool blue moonlight from the opposite side */}
      <directionalLight
        position={[-2.5, 2.4, 2.8]}
        intensity={0.28}
        color="#6699ff"
      />

      {/* Rim light: faint violet behind the scene for depth */}
      <directionalLight
        position={[0, 1.5, -3.5]}
        intensity={0.15}
        color="#9966ff"
      />

      {/* Warm upward bounce from the floor (faked radiosity) */}
      <pointLight
        position={[0, -0.8, 0.5]}
        intensity={0.22}
        color="#ff8844"
        distance={5}
      />

      {/* Monitor screen spill — cold blue glow */}
      <pointLight
        position={[0, 0.72, -0.1]}
        intensity={0.55}
        color="#4488ff"
        distance={1.8}
        decay={2}
      />
    </>
  )
}
