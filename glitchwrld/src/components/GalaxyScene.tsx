import { Suspense, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Galaxy } from './Galaxy'
import { SolarSystem } from './SolarSystem'
import { SplineOverlay } from './SplineOverlay'
import { GalaxyControls } from './GalaxyControls'
import { useHybridStore } from '../stores/hybridStore'
import { shallow } from 'zustand/shallow'

function SceneContent() {
  const cameraTarget = useHybridStore((state) => state.cameraTarget)
  const bloomIntensity = useHybridStore((state) => state.bloomIntensity)
  const sceneMode = useHybridStore((state) => state.sceneMode)
  
  console.log('🎬 SceneContent render - sceneMode:', sceneMode, 'bloomIntensity:', bloomIntensity)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={sceneMode === 'solarSystem' ? 0.3 : 0.1} />
      <pointLight position={[0, 0, 0]} intensity={sceneMode === 'solarSystem' ? 2.0 : 0.5} color="#ffd700" />
      
      {/* Background */}
      <Stars radius={300} depth={60} count={sceneMode === 'solarSystem' ? 5000 : 20000} factor={7} saturation={0} fade speed={1} />
      
      {/* Main Scene - Switch between Galaxy and Solar System */}
      {sceneMode === 'galaxy' && <Galaxy />}
      {sceneMode === 'solarSystem' && <SolarSystem />}
      
      {/* Note: Spline overlay rendered outside Canvas */}
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]}
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Post-processing effects */}
      <Suspense fallback={null}>
        {bloomIntensity != null && bloomIntensity > 0 && (
          <EffectComposer multisampling={0} autoClear={true}>
            <Bloom
              intensity={bloomIntensity}
              width={300}
              height={300}
              kernelSize={5}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.025}
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        )}
      </Suspense>
    </>
  )
}

export function GalaxyScene() {
  const cameraPosition = useHybridStore((state) => state.cameraPosition)
  const containerRef = useRef<HTMLDivElement>(null)

  // WebGL context event handlers
  const r3fContextLostHandler = useCallback((event: Event) => {
    console.warn('⚠️ R3F WebGL context lost!', event)
    event.preventDefault()
  }, [])

  const r3fContextRestoredHandler = useCallback((gl: any) => {
    console.log('✅ R3F WebGL context restored!')
    // Re-apply background color after context restore
    gl.setClearColor(0x000011, 1)
  }, [])

  // Canvas size validation to prevent WebGL errors
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      console.log('🖼️  Container dimensions:', offsetWidth, offsetHeight)
      
      if (offsetWidth === 0 || offsetHeight === 0) {
        console.warn('⚠️  Container has zero dimensions! This will cause WebGL errors.')
        return
      }
      
      if (offsetWidth < 100 || offsetHeight < 100) {
        console.warn('⚠️  Container dimensions are very small:', { offsetWidth, offsetHeight })
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      id="root-stage" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        background: '#000011',
        overflow: 'hidden'
      }}
    >
      {/* BACKGROUND (R3F) */}
      <Canvas
        id="background-canvas"
        camera={{
          position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl, size }) => { 
          console.log('🎨 R3F Canvas created with size:', size.width, 'x', size.height)
          if (size.width === 0 || size.height === 0) {
            console.error('❌ R3F Canvas has zero dimensions!')
            return
          }
          
          // Add WebGL context lost/restore handlers for R3F canvas
          const canvas = gl.domElement
          if (canvas) {
            canvas.addEventListener('webglcontextlost', r3fContextLostHandler)
            canvas.addEventListener('webglcontextrestored', () => r3fContextRestoredHandler(gl))
          }
          
          gl.setClearColor(0x000011, 1) // Dark space background
        }}
      >
        <SceneContent />
      </Canvas>
      
      {/* FOREGROUND (Spline) */}
      <div id="foreground-canvas-container">
        <SplineOverlay />
      </div>
      
      {/* UI OVERLAY */}
      <div id="ui-controls" style={{
        position: 'absolute',
        top: '20px',
        right: '20px'
      }}>
        <GalaxyControls />
      </div>
    </div>
  )
}