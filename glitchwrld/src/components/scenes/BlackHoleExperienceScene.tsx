/**
 * Black Hole Experience Scene
 *
 * An immersive scene featuring a black hole with:
 * - Event horizon visualization
 * - Accretion disk with orbital motion
 * - Educational information panel
 * - Camera navigation controls
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useHybridStore } from '../../stores/hybridStore'
import { BlackHole } from '../blackhole/BlackHole'
import { AudioControls } from '../ui/AudioControls'
import { getAudioManager } from '../../utils/audio/AudioManager'
import './BlackHoleExperienceScene.css'

export function BlackHoleExperienceScene() {
  const { setSceneMode } = useHybridStore()
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  // Initialize black hole audio
  useEffect(() => {
    const audioManager = getAudioManager()

    const startAudio = async () => {
      try {
        await audioManager.play('blackHole')
        console.log('🎵 Started black hole ambient audio')
      } catch (error) {
        console.warn('Audio autoplay blocked. Click to enable.', error)
      }
    }

    startAudio()

    // Handle user interaction for autoplay policy
    const handleClick = () => {
      startAudio()
      document.removeEventListener('click', handleClick)
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className="blackhole-experience">
      {/* Back button */}
      <button
        className="back-button"
        onClick={() => setSceneMode('solarSystem')}
        title="Return to Solar System"
      >
        ← Back to Solar System
      </button>

      {/* Canvas container */}
      <div className={`blackhole-canvas-container ${isPanelCollapsed ? 'expanded' : ''}`}>
        <Canvas
          camera={{ position: [0, 8, 20], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            {/* Deep space environment */}
            <color attach="background" args={['#000000']} />
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade={true}
            />

            {/* Lighting */}
            <ambientLight intensity={0.1} />

            {/* Black Hole - positioned at center */}
            <BlackHole
              position={[0, 0, 0]}
              mass={10}
              rotationSpeed={0}
            />

            {/* Camera controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minDistance={8}
              maxDistance={50}
              target={[0, 0, 0]}
            />

            {/* Post-processing effects */}
            <EffectComposer>
              <Bloom
                intensity={2.0}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur={true}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Panel toggle button */}
      <button
        className={`panel-toggle-btn ${isPanelCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        title={isPanelCollapsed ? 'Show Info Panel' : 'Hide Info Panel'}
      >
        {isPanelCollapsed ? '◀' : '▶'}
      </button>

      {/* Information Panel */}
      <div className={`blackhole-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <h1>⚫ Black Hole</h1>
          <p className="panel-subtitle">Where spacetime breaks down</p>
        </div>

        <div className="panel-content">
          {/* Black Hole Info */}
          <div className="info-section">
            <h2>Properties</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Mass</div>
                <div className="info-value">10 M☉</div>
                <div className="info-description">Solar masses</div>
              </div>

              <div className="info-card">
                <div className="info-label">Event Horizon</div>
                <div className="info-value">30 km</div>
                <div className="info-description">Point of no return</div>
              </div>

              <div className="info-card">
                <div className="info-label">Escape Velocity</div>
                <div className="info-value">c</div>
                <div className="info-description">Speed of light</div>
              </div>

              <div className="info-card">
                <div className="info-label">Photon Sphere</div>
                <div className="info-value">45 km</div>
                <div className="info-description">Light orbits here</div>
              </div>
            </div>
          </div>

          {/* Educational Facts */}
          <div className="info-section">
            <h2>📚 Did You Know?</h2>
            <div className="fact-list">
              <div className="fact-item">
                <div className="fact-icon">🌌</div>
                <div className="fact-text">
                  <strong>Gravitational Lensing</strong>
                  <p>Black holes bend light around them, creating Einstein rings and distorting space itself.</p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon">⏱️</div>
                <div className="fact-text">
                  <strong>Time Dilation</strong>
                  <p>Time slows down near the event horizon. To an outside observer, you'd appear frozen in time.</p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon">🔥</div>
                <div className="fact-text">
                  <strong>Accretion Disk</strong>
                  <p>Matter spiraling into a black hole heats up to millions of degrees, glowing brilliantly.</p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon">🌀</div>
                <div className="fact-text">
                  <strong>Singularity</strong>
                  <p>At the center lies a point of infinite density where physics as we know it breaks down.</p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon">💫</div>
                <div className="fact-text">
                  <strong>Hawking Radiation</strong>
                  <p>Black holes slowly evaporate over time through quantum effects at the event horizon.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Hints */}
          <div className="info-section">
            <h2>🎮 Controls</h2>
            <div className="controls-list">
              <div className="control-item">
                <span className="control-key">Left Mouse + Drag</span>
                <span className="control-action">Rotate camera</span>
              </div>
              <div className="control-item">
                <span className="control-key">Right Mouse + Drag</span>
                <span className="control-action">Pan view</span>
              </div>
              <div className="control-item">
                <span className="control-key">Scroll Wheel</span>
                <span className="control-action">Zoom in/out</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <div className="warning-text">
              <strong>Cosmic Hazard</strong>
              <p>In reality, approaching a black hole would subject you to extreme tidal forces (spaghettification) and lethal radiation from the accretion disk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />
    </div>
  )
}
