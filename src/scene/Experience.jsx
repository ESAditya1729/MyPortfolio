import { ContactShadows, Environment, Stars, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing'
import Lights from './Lights.jsx'
import Diorama from './Diorama.jsx'
import CameraRig from './CameraRig.jsx'
import Hotspots from './Hotspots.jsx'

export default function Experience({ tier = 'high' }) {
  const isLow = tier === 'low'

  return (
    <>
      <color attach="background" args={['#080a10']} />
      <fog attach="fog" args={['#080a10', 6, 16]} />

      <CameraRig />
      <Lights tier={tier} />
      <Diorama />
      <Hotspots />

      {/* Ambient starfield visible at the edges of the scene — reduced on low tier */}
      <Stars
        radius={18}
        depth={12}
        count={isLow ? 350 : 1200}
        factor={0.6}
        saturation={0.4}
        fade
        speed={0.4}
      />

      {/* Floating dust motes / magical sparkles around the desk — skipped on low tier,
          particle systems add up fast on low-end mobile GPUs */}
      {!isLow && (
        <>
          <Sparkles
            count={55}
            position={[0, 0.8, 0]}
            scale={[3.5, 2, 3.5]}
            size={0.9}
            speed={0.18}
            noise={0.25}
            color="#ff9f5a"
            opacity={0.55}
          />
          <Sparkles
            count={30}
            position={[0, 1.0, 0]}
            scale={[2.5, 1.5, 2.5]}
            size={0.6}
            speed={0.12}
            noise={0.2}
            color="#7dd3fc"
            opacity={0.35}
          />
        </>
      )}

      <ContactShadows
        position={[0, -0.04, 0]}
        opacity={0.65}
        scale={7}
        blur={2.8}
        far={2.5}
        resolution={isLow ? 256 : 512}
        color="#000614"
      />

      {/* Night-apartment HDRI gives subtle reflections without blowing out the dark scene */}
      <Environment preset="night" background={false} environmentIntensity={0.35} />

      {/* Ties the scene's glowing elements (screen, window, lamp, ceiling light)
          into something that reads as photographed rather than flat-rendered.
          Skipped entirely on low tier — multi-pass post-processing is the single
          heaviest thing in this scene, same reasoning bruno-simon.com uses to
          drop bloom/DOF on its own low-quality tier. */}
      {!isLow && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.7}
            mipmapBlur
            radius={0.6}
          />
          <Vignette eskil={false} offset={0.18} darkness={0.75} />
          <Noise opacity={0.025} />
        </EffectComposer>
      )}
    </>
  )
}
