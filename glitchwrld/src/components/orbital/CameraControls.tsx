/**
 * Camera Controls - Preset camera angles and transitions
 * For viewing the solar system from different perspectives
 */

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type CameraPreset = 'top' | 'side' | 'angle' | 'close' | 'far' | 'follow'

interface CameraPresetConfig {
  position: [number, number, number]
  target: [number, number, number]
  description: string
}

// Camera preset configurations
export const CAMERA_PRESETS: Record<CameraPreset, CameraPresetConfig> = {
  top: {
    position: [0, 100000, 0],
    target: [0, 0, 0],
    description: 'Top-down view of the solar system'
  },
  side: {
    position: [0, 0, 100000],
    target: [0, 0, 0],
    description: 'Side view showing orbital planes'
  },
  angle: {
    position: [70000, 50000, 70000],
    target: [0, 0, 0],
    description: 'Angled view (default)'
  },
  close: {
    position: [20000, 15000, 30000],
    target: [0, 0, 0],
    description: 'Close-up of inner planets'
  },
  far: {
    position: [150000, 100000, 150000],
    target: [0, 0, 0],
    description: 'Wide view of entire system'
  },
  follow: {
    position: [0, 5000, 10000], // Will be updated to follow a planet
    target: [0, 0, 0],
    description: 'Follow a planet'
  }
}

interface SmoothCameraProps {
  preset?: CameraPreset
  followTarget?: THREE.Object3D
  transitionDuration?: number
  autoRotate?: boolean
  rotationSpeed?: number
}

export function SmoothCamera({
  preset = 'angle',
  followTarget,
  transitionDuration = 2.0,
  autoRotate = false,
  rotationSpeed = 0.0005
}: SmoothCameraProps) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  const transitionProgress = useRef(1) // 0 to 1
  const rotationAngle = useRef(0)

  // Set target based on preset or follow mode
  useEffect(() => {
    if (followTarget && preset === 'follow') {
      // Following a specific planet
      return // Will be handled in useFrame
    } else {
      // Use preset
      const config = CAMERA_PRESETS[preset]
      targetPosition.current.set(...config.position)
      targetLookAt.current.set(...config.target)
      transitionProgress.current = 0 // Start transition
    }
  }, [preset, followTarget])

  // Smooth camera transition
  useFrame((state, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    // Find OrbitControls if available
    const controls = state.controls as OrbitControlsImpl | undefined

    // Handle follow mode
    if (followTarget && preset === 'follow') {
      const followPos = followTarget.position.clone()
      const offset = new THREE.Vector3(0, 5000, 10000)

      // Rotate offset around the planet
      if (autoRotate) {
        rotationAngle.current += rotationSpeed
        const rotatedOffset = offset.clone().applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          rotationAngle.current
        )
        targetPosition.current.copy(followPos).add(rotatedOffset)
      } else {
        targetPosition.current.copy(followPos).add(offset)
      }

      targetLookAt.current.copy(followPos)
      transitionProgress.current = 0 // Always smooth when following
    }

    // Auto-rotate camera around target
    if (autoRotate && preset !== 'follow') {
      rotationAngle.current += rotationSpeed
      const config = CAMERA_PRESETS[preset]
      const basePos = new THREE.Vector3(...config.position)

      // Rotate around Y axis
      const rotatedPos = new THREE.Vector3(
        basePos.x * Math.cos(rotationAngle.current) - basePos.z * Math.sin(rotationAngle.current),
        basePos.y,
        basePos.x * Math.sin(rotationAngle.current) + basePos.z * Math.cos(rotationAngle.current)
      )

      targetPosition.current.copy(rotatedPos)
    }

    // Smooth transition
    if (transitionProgress.current < 1) {
      transitionProgress.current = Math.min(1, transitionProgress.current + delta / transitionDuration)

      // Ease-in-out
      const t = transitionProgress.current
      const eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2

      // Interpolate position
      camera.position.lerp(targetPosition.current, eased)

      // Interpolate look-at
      currentLookAt.current.lerp(targetLookAt.current, eased)

      // Update OrbitControls target to match our look-at point
      if (controls) {
        controls.target.copy(currentLookAt.current)
        controls.update()
      }

      camera.lookAt(currentLookAt.current)
    } else {
      // At target, update OrbitControls to maintain position
      if (controls) {
        controls.target.copy(targetLookAt.current)
        controls.update()
      }
      camera.lookAt(targetLookAt.current)
    }
  })

  return null
}

/**
 * Camera preset selector component
 * Can be used in UI to switch between camera views
 */
export function useCameraPreset() {
  const [currentPreset, setCurrentPreset] = React.useState<CameraPreset>('angle')
  const [autoRotate, setAutoRotate] = React.useState(false)

  return {
    currentPreset,
    setCurrentPreset,
    autoRotate,
    setAutoRotate,
    presets: CAMERA_PRESETS
  }
}

// Import React for useState
import React from 'react'
