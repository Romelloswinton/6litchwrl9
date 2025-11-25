/**
 * Black Hole Comparison Component
 *
 * Side-by-side comparison of different black hole rendering techniques
 * Use this to experiment and choose your preferred style
 */

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { BlackHole } from './BlackHole'
import { TexturedBlackHole } from './TexturedBlackHole'

type BlackHoleType = 'original' | 'textured-standard' | 'textured-shader'

export function BlackHoleComparison() {
  const [currentType, setCurrentType] = useState<BlackHoleType>('textured-standard')

  const renderBlackHole = () => {
    switch (currentType) {
      case 'original':
        return <BlackHole position={[0, 0, 0]} mass={10} />
      case 'textured-standard':
        return (
          <TexturedBlackHole
            position={[0, 0, 0]}
            radius={3}
            mass={10}
            enableShader={false}
          />
        )
      case 'textured-shader':
        return (
          <TexturedBlackHole
            position={[0, 0, 0]}
            radius={3}
            mass={10}
            enableShader={true}
          />
        )
      default:
        return null
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Control panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          fontFamily: 'monospace'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0' }}>Black Hole Renderer</h3>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <input
              type="radio"
              value="original"
              checked={currentType === 'original'}
              onChange={(e) => setCurrentType(e.target.value as BlackHoleType)}
              style={{ marginRight: '8px' }}
            />
            Original (Procedural)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <input
              type="radio"
              value="textured-standard"
              checked={currentType === 'textured-standard'}
              onChange={(e) => setCurrentType(e.target.value as BlackHoleType)}
              style={{ marginRight: '8px' }}
            />
            Textured (Standard Material) ⭐
          </label>

          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              value="textured-shader"
              checked={currentType === 'textured-shader'}
              onChange={(e) => setCurrentType(e.target.value as BlackHoleType)}
              style={{ marginRight: '8px' }}
            />
            Textured (Advanced Shader) 🔥
          </label>
        </div>

        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>Current:</strong> {currentType}
          <br />
          <strong>Features:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {currentType === 'original' && (
              <>
                <li>Procedural event horizon</li>
                <li>Accretion disk particles</li>
                <li>Basic lighting</li>
              </>
            )}
            {currentType === 'textured-standard' && (
              <>
                <li>Your blackhole.png texture</li>
                <li>Realistic material properties</li>
                <li>Photon sphere glow</li>
                <li>Best performance</li>
              </>
            )}
            {currentType === 'textured-shader' && (
              <>
                <li>Custom GLSL shader</li>
                <li>Gravitational lensing</li>
                <li>Animated distortion</li>
                <li>Pulsing effects</li>
                <li>Higher GPU usage</li>
              </>
            )}
          </ul>
        </div>

        <div style={{
          marginTop: '10px',
          fontSize: '11px',
          color: '#aaa'
        }}>
          💡 Use mouse to orbit • Scroll to zoom
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000011']} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
        <Environment preset="night" />

        {/* Black Hole */}
        {renderBlackHole()}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  )
}
