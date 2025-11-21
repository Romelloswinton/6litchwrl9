// glitchwrld/src/components/examples/SplineWithCameraExample.tsx

/**
 * Complete example showing Spline models with camera presets
 *
 * This demonstrates:
 * - Multiple Spline models
 * - Custom camera presets for each model
 * - Automated camera tour
 * - Interactive buttons for camera control
 */

import { useEffect, useCallback, useState } from 'react'
import { MultiSplineScene, useSplineModels } from '../spline/MultiSplineScene'
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'
import { addCameraPreset } from '../../utils/camera/cameraPresets'
import { createSplinePreset } from '../../utils/spline/splineModelManager'

export function SplineWithCameraExample() {
  const { registerModel } = useSplineModels()
  const { applyPresetAnimated } = useCameraPresets()
  const [tourRunning, setTourRunning] = useState(false)

  useEffect(() => {
    // ===== STEP 1: Register Spline Models =====

    // Main spaceship (hero model)
    registerModel({
      id: 'hero-spaceship',
      name: 'Command Ship',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace!
      position: [15, 8, -10],
      scale: 1.5,
      animation: {
        rotate: true,
        rotationSpeed: 0.3,
      },
    })

    // Space station
    registerModel(
      createSplinePreset(
        'station',
        'orbital-station',
        'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace!
        [0, 12, 0]
      )
    )

    // Asteroid field
    registerModel(
      createSplinePreset(
        'asteroid',
        'asteroid-field',
        'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace!
        [-20, 3, 15]
      )
    )

    // ===== STEP 2: Create Custom Camera Presets =====

    // Preset 1: Overview of entire scene
    addCameraPreset({
      id: 'scene-overview',
      name: 'Scene Overview',
      position: [0, 40, 80],
      target: [0, 5, 0],
      fov: 70,
      description: 'Wide view of the entire scene',
      settings: {
        bloomIntensity: 1.2,
        enableOrbitControls: true,
      },
    })

    // Preset 2: Focus on command ship
    addCameraPreset({
      id: 'focus-command-ship',
      name: 'Command Ship Close-up',
      position: [18, 10, -7],
      target: [15, 8, -10],
      fov: 55,
      description: 'Close-up of the command ship',
      showModels: ['hero-spaceship'],
      settings: {
        bloomIntensity: 1.3,
        enableOrbitControls: true,
      },
    })

    // Preset 3: Focus on space station
    addCameraPreset({
      id: 'focus-station',
      name: 'Space Station View',
      position: [5, 15, 8],
      target: [0, 12, 0],
      fov: 60,
      description: 'View of the orbital station',
      showModels: ['orbital-station'],
      settings: {
        bloomIntensity: 1.1,
        enableOrbitControls: true,
      },
    })

    // Preset 4: Asteroid field
    addCameraPreset({
      id: 'focus-asteroids',
      name: 'Asteroid Field',
      position: [-15, 5, 18],
      target: [-20, 3, 15],
      fov: 65,
      description: 'Flying through the asteroid field',
      showModels: ['asteroid-field'],
      settings: {
        bloomIntensity: 0.9,
        enableOrbitControls: true,
      },
    })

    // Preset 5: Cinematic wide shot
    addCameraPreset({
      id: 'cinematic-wide',
      name: 'Cinematic Vista',
      position: [30, 25, 40],
      target: [0, 8, 0],
      fov: 75,
      description: 'Dramatic wide angle shot',
      settings: {
        bloomIntensity: 1.4,
        rotationSpeed: 0.001,
        enableOrbitControls: false,
      },
    })

    console.log('✅ Spline models and camera presets initialized')
  }, [registerModel])

  // ===== STEP 3: Create Automated Camera Tour =====

  const startCameraTour = useCallback(() => {
    setTourRunning(true)

    const tourStops = [
      { preset: 'scene-overview', duration: 2500, wait: 3000 },
      { preset: 'focus-command-ship', duration: 2000, wait: 3500 },
      { preset: 'focus-station', duration: 2000, wait: 3000 },
      { preset: 'focus-asteroids', duration: 2500, wait: 3500 },
      { preset: 'cinematic-wide', duration: 3000, wait: 4000 },
      { preset: 'scene-overview', duration: 2500, wait: 0 },
    ]

    let totalTime = 0

    tourStops.forEach((stop, index) => {
      setTimeout(() => {
        console.log(`📷 Tour stop ${index + 1}: ${stop.preset}`)
        applyPresetAnimated(stop.preset, stop.duration, 'easeInOut')

        // Tour complete
        if (index === tourStops.length - 1) {
          setTimeout(() => {
            setTourRunning(false)
            console.log('✅ Camera tour complete')
          }, stop.duration)
        }
      }, totalTime)

      totalTime += stop.duration + stop.wait
    })

    console.log('🎬 Starting camera tour...')
  }, [applyPresetAnimated])

  // ===== STEP 4: Quick Camera Buttons =====

  const quickView = useCallback(
    (presetId: string, name: string) => {
      console.log(`📷 Quick view: ${name}`)
      applyPresetAnimated(presetId, 1500)
    },
    [applyPresetAnimated]
  )

  // Auto-start tour on mount (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to auto-start tour:
      // startCameraTour()
    }, 2000)

    return () => clearTimeout(timer)
  }, [startCameraTour])

  return (
    <>
      {/* Render Spline models */}
      <MultiSplineScene />

      {/* Optional: UI Controls (comment out if using Leva) */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '90vw',
        }}
      >
        <button
          onClick={() => quickView('scene-overview', 'Overview')}
          style={buttonStyle}
          disabled={tourRunning}
        >
          📷 Overview
        </button>
        <button
          onClick={() => quickView('focus-command-ship', 'Command Ship')}
          style={buttonStyle}
          disabled={tourRunning}
        >
          🚀 Ship
        </button>
        <button
          onClick={() => quickView('focus-station', 'Station')}
          style={buttonStyle}
          disabled={tourRunning}
        >
          🛰️ Station
        </button>
        <button
          onClick={() => quickView('focus-asteroids', 'Asteroids')}
          style={buttonStyle}
          disabled={tourRunning}
        >
          🪨 Asteroids
        </button>
        <button
          onClick={() => quickView('cinematic-wide', 'Cinematic')}
          style={buttonStyle}
          disabled={tourRunning}
        >
          🎬 Cinematic
        </button>
        <button
          onClick={startCameraTour}
          style={{ ...buttonStyle, backgroundColor: tourRunning ? '#666' : '#4CAF50' }}
          disabled={tourRunning}
        >
          {tourRunning ? '🎥 Tour Running...' : '▶️ Start Tour'}
        </button>
      </div>
    </>
  )
}

// Simple button styling
const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '14px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
}

/**
 * Minimal example - just models and camera tour
 */
export function MinimalCameraTourExample() {
  const { registerModel } = useSplineModels()
  const { applyPresetAnimated } = useCameraPresets()

  useEffect(() => {
    // Register one model
    registerModel({
      id: 'my-model',
      name: 'My Model',
      url: 'YOUR-URL',
      position: [10, 5, 0],
    })

    // Create camera preset
    addCameraPreset({
      id: 'my-view',
      name: 'My View',
      position: [15, 7, 5],
      target: [10, 5, 0],
      fov: 60,
    })

    // Switch to this view after 1 second
    setTimeout(() => {
      applyPresetAnimated('my-view', 2000)
    }, 1000)
  }, [registerModel, applyPresetAnimated])

  return <MultiSplineScene />
}

/**
 * HOW TO USE THIS EXAMPLE:
 *
 * 1. Replace Spline URLs with your own models
 *
 * 2. Add to HybridScene.tsx:
 *    import { SplineWithCameraExample } from '../examples/SplineWithCameraExample'
 *
 *    // Inside SceneContent():
 *    <SplineWithCameraExample />
 *
 * 3. OR use Leva controls instead of buttons:
 *    - Import CameraPresetControls in GalaxyControls.tsx
 *    - Comment out the button UI in this file
 *
 * 4. Customize:
 *    - Adjust model positions
 *    - Create new camera presets
 *    - Modify tour timing
 *    - Add keyboard shortcuts
 */
