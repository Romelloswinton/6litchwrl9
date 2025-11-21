// glitchwrld/src/hooks/camera/useCameraPresets.ts

import { useCallback, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useHybridStore } from '../../stores/hybridStore'
import { CameraPreset, getCameraPreset } from '../../utils/camera/cameraPresets'
import { splineModelManager } from '../../utils/spline/splineModelManager'

/**
 * Hook for applying camera presets with smooth transitions
 */
export function useCameraPresets() {
  const { camera } = useThree()
  const setCameraPosition = useHybridStore((state) => state.setCameraPosition)
  const setCameraTarget = useHybridStore((state) => state.setCameraTarget)
  const setSceneMode = useHybridStore((state) => state.setSceneMode)
  const setBloomIntensity = useHybridStore((state) => state.setBloomIntensity)
  const setRotationSpeed = useHybridStore((state) => state.setRotationSpeed)
  const setEnableOrbitControls = useHybridStore((state) => state.setEnableOrbitControls)

  const animationRef = useRef<number | null>(null)

  /**
   * Apply a camera preset instantly (no animation)
   */
  const applyPresetInstant = useCallback(
    (presetId: string) => {
      const preset = getCameraPreset(presetId)
      if (!preset) {
        console.warn(`Camera preset "${presetId}" not found`)
        return false
      }

      // Update camera position
      const position = new THREE.Vector3(...preset.position)
      const target = new THREE.Vector3(...preset.target)

      camera.position.copy(position)
      setCameraPosition(position)
      setCameraTarget(target)

      // Update FOV if specified
      if (preset.fov && camera instanceof THREE.PerspectiveCamera) {
        camera.fov = preset.fov
        camera.updateProjectionMatrix()
      }

      // Apply scene mode if specified
      if (preset.sceneMode) {
        setSceneMode(preset.sceneMode)
      }

      // Apply settings
      if (preset.settings) {
        if (preset.settings.bloomIntensity !== undefined) {
          setBloomIntensity(preset.settings.bloomIntensity)
        }
        if (preset.settings.rotationSpeed !== undefined) {
          setRotationSpeed(preset.settings.rotationSpeed)
        }
        if (preset.settings.enableOrbitControls !== undefined) {
          setEnableOrbitControls(preset.settings.enableOrbitControls)
        }
      }

      // Show/hide models
      if (preset.showModels) {
        preset.showModels.forEach((id) => {
          splineModelManager.setModelVisibility(id, true)
        })
      }
      if (preset.hideModels) {
        preset.hideModels.forEach((id) => {
          splineModelManager.setModelVisibility(id, false)
        })
      }

      console.log(`📷 Applied camera preset: ${preset.name}`)
      return true
    },
    [
      camera,
      setCameraPosition,
      setCameraTarget,
      setSceneMode,
      setBloomIntensity,
      setRotationSpeed,
      setEnableOrbitControls,
    ]
  )

  /**
   * Apply a camera preset with smooth animation
   */
  const applyPresetAnimated = useCallback(
    (presetId: string, duration = 2000, easing: 'linear' | 'easeInOut' | 'easeOut' = 'easeInOut') => {
      const preset = getCameraPreset(presetId)
      if (!preset) {
        console.warn(`Camera preset "${presetId}" not found`)
        return false
      }

      // Cancel any ongoing animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

      const startPosition = camera.position.clone()
      const endPosition = new THREE.Vector3(...preset.position)
      const startTarget = new THREE.Vector3()
      const endTarget = new THREE.Vector3(...preset.target)

      const startFov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 65
      const endFov = preset.fov ?? startFov

      const startTime = performance.now()

      // Easing functions
      const easingFunctions = {
        linear: (t: number) => t,
        easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOut: (t: number) => t * (2 - t),
      }

      const ease = easingFunctions[easing]

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = ease(progress)

        // Interpolate position
        const newPosition = new THREE.Vector3().lerpVectors(
          startPosition,
          endPosition,
          easedProgress
        )
        camera.position.copy(newPosition)
        setCameraPosition(newPosition)

        // Interpolate target
        const newTarget = new THREE.Vector3().lerpVectors(
          startTarget,
          endTarget,
          easedProgress
        )
        setCameraTarget(newTarget)

        // Interpolate FOV
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = startFov + (endFov - startFov) * easedProgress
          camera.updateProjectionMatrix()
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete - apply final settings
          animationRef.current = null

          // Apply scene mode
          if (preset.sceneMode) {
            setSceneMode(preset.sceneMode)
          }

          // Apply settings
          if (preset.settings) {
            if (preset.settings.bloomIntensity !== undefined) {
              setBloomIntensity(preset.settings.bloomIntensity)
            }
            if (preset.settings.rotationSpeed !== undefined) {
              setRotationSpeed(preset.settings.rotationSpeed)
            }
            if (preset.settings.enableOrbitControls !== undefined) {
              setEnableOrbitControls(preset.settings.enableOrbitControls)
            }
          }

          // Show/hide models
          if (preset.showModels) {
            preset.showModels.forEach((id) => {
              splineModelManager.setModelVisibility(id, true)
            })
          }
          if (preset.hideModels) {
            preset.hideModels.forEach((id) => {
              splineModelManager.setModelVisibility(id, false)
            })
          }

          console.log(`📷 Camera animation complete: ${preset.name}`)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
      console.log(`📷 Animating to preset: ${preset.name}`)
      return true
    },
    [
      camera,
      setCameraPosition,
      setCameraTarget,
      setSceneMode,
      setBloomIntensity,
      setRotationSpeed,
      setEnableOrbitControls,
    ]
  )

  /**
   * Save current camera position as a preset
   */
  const saveCurrentAsPreset = useCallback(
    (id: string, name: string, description?: string): CameraPreset => {
      const position = camera.position.toArray() as [number, number, number]
      const target = useHybridStore.getState().cameraTarget.toArray() as [
        number,
        number,
        number
      ]
      const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 65

      const preset: CameraPreset = {
        id,
        name,
        position,
        target,
        fov,
        description,
      }

      console.log(`💾 Saved camera preset: ${name}`, preset)
      return preset
    },
    [camera]
  )

  /**
   * Cancel ongoing camera animation
   */
  const cancelAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      console.log('❌ Camera animation cancelled')
    }
  }, [])

  return {
    applyPresetInstant,
    applyPresetAnimated,
    saveCurrentAsPreset,
    cancelAnimation,
  }
}
