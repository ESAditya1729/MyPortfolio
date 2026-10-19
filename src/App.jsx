import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import Experience from './scene/Experience.jsx'
import { cameraPath } from './scene/cameraPath.js'
import { TOTAL_PAGES } from './data/content.js'
import ContentSections from './components/ContentSections.jsx'
import './App.css'

function App() {
  return (
    <Canvas
      className="scene-canvas"
      shadows
      camera={{ position: cameraPath[0].position, fov: 35 }}
    >
      <Suspense fallback={null}>
        <ScrollControls pages={TOTAL_PAGES} damping={0.25}>
          <Experience />
          <Scroll html style={{ width: '100%' }}>
            <ContentSections />
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}

export default App
