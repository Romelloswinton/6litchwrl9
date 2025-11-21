// glitchwrld/src/components/spline/ExampleSplineModels.tsx

/**
 * Example Spline Models Component
 *
 * This is a ready-to-use example showing how to add multiple Spline models to your scene.
 *
 * To use this component:
 * 1. Replace the URLs with your own Spline .splinecode URLs
 * 2. Adjust positions, scales, and animations as needed
 * 3. Import and add <ExampleSplineModels /> to HybridScene.tsx
 *
 * Quick setup:
 * - Get Spline URLs from https://spline.design (Export → Code Export → Get URL)
 * - Add this component in HybridScene.tsx: <ExampleSplineModels />
 * - View in browser and use Leva controls to adjust
 */

import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { createSplinePreset } from '../../utils/spline/splineModelManager'

export function ExampleSplineModels() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // Example 1: Spaceship with orbital animation
    // Replace 'YOUR-SPACESHIP-ID' with your actual Spline scene ID
    registerModel({
      id: 'example-spaceship',
      name: 'Example Spaceship',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace this!
      position: [10, 5, -5],
      scale: 0.5,
      animation: {
        rotate: true,
        rotationSpeed: 0.5,
        orbit: true,
        orbitSpeed: 0.3,
      },
      interaction: {
        clickable: true,
        hoverable: true,
        onClick: (name) => {
          console.log('🚀 Clicked spaceship:', name)
          alert(`You clicked: ${name}`)
        },
      },
    })

    // Example 2: Using a preset for quick setup
    // Presets: 'spaceship', 'planet', 'asteroid', 'nebula', 'station'
    registerModel(
      createSplinePreset(
        'asteroid',
        'example-asteroid',
        'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace this!
        [-8, 2, 3]
      )
    )

    // Example 3: Space station with slow rotation
    registerModel({
      id: 'example-station',
      name: 'Space Station Alpha',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace this!
      position: [0, 10, 0],
      scale: 1.2,
      animation: {
        rotate: true,
        rotationSpeed: 0.1,
      },
      interaction: {
        clickable: true,
        onClick: (name) => {
          console.log('🛰️ Docking at:', name)
        },
      },
    })

    // Example 4: Nebula cloud (decorative, no interaction)
    registerModel(
      createSplinePreset(
        'nebula',
        'example-nebula',
        'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace this!
        [15, 5, -10]
      )
    )

    // Example 5: Planet aligned with solar system
    registerModel({
      id: 'example-planet',
      name: 'Custom Planet',
      url: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode', // Replace this!
      alignWithPlanets: true, // This will position it at a planet location
      scale: 1.0,
      animation: {
        rotate: true,
        rotationSpeed: 0.2,
        pulse: true,
        pulseSpeed: 0.5,
      },
    })

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up example Spline models')
    }
  }, [registerModel])

  return <MultiSplineScene />
}

/**
 * Minimal Example - Just one model
 * Use this if you only want to add a single Spline model
 */
export function MinimalSplineExample() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    registerModel({
      id: 'my-model',
      name: 'My First Model',
      url: 'https://prod.spline.design/YOUR-ID/scene.splinecode', // Replace this!
      position: [0, 0, 0],
      scale: 1.0,
      animation: {
        rotate: true,
        rotationSpeed: 0.5,
      },
    })
  }, [registerModel])

  return <MultiSplineScene />
}

/**
 * Preset Examples - Quick setup using presets
 */
export function PresetSplineExamples() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // Quick way to add models with sensible defaults
    registerModel(createSplinePreset('spaceship', 'ship-1', 'YOUR-URL', [5, 2, -3]))
    registerModel(createSplinePreset('asteroid', 'rock-1', 'YOUR-URL', [-5, 0, 2]))
    registerModel(createSplinePreset('station', 'station-1', 'YOUR-URL', [0, 8, 0]))
  }, [registerModel])

  return <MultiSplineScene />
}

/**
 * How to use this in HybridScene.tsx:
 *
 * 1. Import the component:
 *    import { ExampleSplineModels } from '../spline/ExampleSplineModels'
 *
 * 2. Add it to the SceneContent component (after AccurateSolarSystem):
 *    <ExampleSplineModels />
 *
 * 3. Optional: Add controls in GalaxyControls.tsx:
 *    import { SplineModelControls } from './SplineModelControls'
 *    // Then render: <SplineModelControls />
 *
 * 4. Run dev server:
 *    cd glitchwrld && npm run dev
 *
 * 5. Open http://localhost:5173 and see your models!
 */
