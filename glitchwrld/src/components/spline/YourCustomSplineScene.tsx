// glitchwrld/src/components/spline/YourCustomSplineScene.tsx

/**
 * Custom Spline Scene with Multiple Camera Angles
 *
 * This component only handles the 3D Spline scene registration and camera presets.
 * UI buttons are in a separate component (CameraButtons.tsx) outside the Canvas.
 *
 * Your Spline URL: https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode
 */

import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'
import { addCameraPreset } from '../../utils/camera/cameraPresets'

export function YourCustomSplineScene() {
  const { registerModel } = useSplineModels()
  const { applyPresetAnimated } = useCameraPresets()

  useEffect(() => {
    // ===== REGISTER YOUR SPLINE MODEL =====
    registerModel({
      id: 'main-spline-scene',
      name: 'Main Scene',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
      position: [0, 0, 0],
      scale: 1.0,
      visible: true,
      animation: {
        rotate: true,
        rotationSpeed: 0.3,
      },
      interaction: {
        clickable: true,
        hoverable: true,
        onClick: (name) => {
          console.log('🎯 Clicked object:', name)
        },
        onHover: (name) => {
          console.log('👆 Hovering over:', name)
        },
      },
    })

    // ===== CREATE CUSTOM CAMERA PRESETS =====

    // Preset 1: Wide establishing shot
    addCameraPreset({
      id: 'your-scene-wide',
      name: 'Wide View',
      position: [0, 30, 60],
      target: [0, 0, 0],
      fov: 70,
      description: 'Wide angle establishing shot',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.2,
        enableOrbitControls: true,
      },
    })

    // Preset 2: Front view
    addCameraPreset({
      id: 'your-scene-front',
      name: 'Front View',
      position: [0, 5, 25],
      target: [0, 0, 0],
      fov: 60,
      description: 'Straight-on front view',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.0,
        enableOrbitControls: true,
      },
    })

    // Preset 3: Close-up detail
    addCameraPreset({
      id: 'your-scene-closeup',
      name: 'Close Detail',
      position: [5, 3, 10],
      target: [0, 0, 0],
      fov: 50,
      description: 'Close-up detail shot',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.3,
        enableOrbitControls: true,
      },
    })

    // Preset 4: Side profile
    addCameraPreset({
      id: 'your-scene-side',
      name: 'Side Profile',
      position: [35, 8, 0],
      target: [0, 0, 0],
      fov: 65,
      description: 'Side profile view',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.0,
        enableOrbitControls: true,
      },
    })

    // Preset 5: Top-down view
    addCameraPreset({
      id: 'your-scene-top',
      name: 'Top Down',
      position: [0, 40, 0],
      target: [0, 0, 0],
      fov: 75,
      description: 'Bird\'s eye view from above',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.1,
        enableOrbitControls: true,
      },
    })

    // Preset 6: Diagonal hero shot
    addCameraPreset({
      id: 'your-scene-diagonal',
      name: 'Diagonal Hero',
      position: [20, 15, 20],
      target: [0, 0, 0],
      fov: 65,
      description: 'Dramatic diagonal angle',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.4,
        enableOrbitControls: true,
      },
    })

    // Preset 7: Low angle dramatic
    addCameraPreset({
      id: 'your-scene-low',
      name: 'Low Angle',
      position: [10, -5, 15],
      target: [0, 3, 0],
      fov: 70,
      description: 'Dramatic low angle shot',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.5,
        enableOrbitControls: true,
      },
    })

    // Preset 8: Cinematic orbit
    addCameraPreset({
      id: 'your-scene-orbit',
      name: 'Cinematic Orbit',
      position: [25, 12, 18],
      target: [0, 2, 0],
      fov: 65,
      description: 'Cinematic orbital perspective',
      showModels: ['main-spline-scene'],
      settings: {
        bloomIntensity: 1.2,
        rotationSpeed: 0.001,
        enableOrbitControls: false,
      },
    })

    console.log('✅ Your Spline scene and camera presets loaded!')

    // Auto-start with wide view after 1 second
    setTimeout(() => {
      applyPresetAnimated('your-scene-wide', 2500, 'easeInOut')
    }, 1000)
  }, [registerModel, applyPresetAnimated])

  // Just render the Spline scene - no buttons here!
  return <MultiSplineScene />
}

/**
 * MINIMAL VERSION - Without auto-start camera
 */
export function YourCustomSplineSceneMinimal() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    registerModel({
      id: 'main-spline-scene',
      name: 'Main Scene',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
      position: [0, 0, 0],
      scale: 1.0,
      animation: {
        rotate: true,
        rotationSpeed: 0.3,
      },
    })
  }, [registerModel])

  return <MultiSplineScene />
}
