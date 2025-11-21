// glitchwrld/src/hooks/camera/useCameraPresetsSimple.ts

import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { useHybridStore } from '../../stores/hybridStore'
import { CameraPreset, getCameraPreset } from '../../utils/camera/cameraPresets'
import { splineModelManager } from '../../utils/spline/splineModelManager'

/**
 * Simple camera presets hook that works outside Canvas
 * Uses Zustand store instead of R3F hooks
 */
export function useCameraPresetsSimple() {
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

      // Update camera position via store
      const position = new THREE.Vector3(...preset.position)
      const target = new THREE.Vector3(...preset.target)

      setCameraPosition(position)
      setCameraTarget(target)

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
   * Note: This version updates the store, the actual camera animation
   * happens in a component inside the Canvas that listens to store changes
   */
  const applyPresetAnimated = useCallback(
    (presetId: string, duration = 2000, easing: 'linear' | 'easeInOut' | 'easeOut' = 'easeInOut') => {
      const preset = getCameraPreset(presetId)
      if (!preset) {
        console.warn(`Camera preset "${presetId}" not found`)
        return false
      }

      // Get current positions from store
      const currentPosition = useHybridStore.getState().cameraPosition
      const startPosition = currentPosition.clone()
      const endPosition = new THREE.Vector3(...preset.position)
      const endTarget = new THREE.Vector3(...preset.target)

      const startTime = performance.now()

      // Easing functions
      const easingFunctions = {
        linear: (t: number) => t,
        easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOut: (t: number) => t * (2 - t),
      }

      const ease = easingFunctions[easing]

      // Cancel any ongoing animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

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

        console.log(`🎬 Animation frame: progress=${(progress * 100).toFixed(1)}%, position=${newPosition.toArray().map(v => v.toFixed(2))}`)

        // Update store (will only trigger re-render if position actually changed)
        setCameraPosition(newPosition)
        setCameraTarget(endTarget)

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
      setCameraPosition,
      setCameraTarget,
      setSceneMode,
      setBloomIntensity,
      setRotationSpeed,
      setEnableOrbitControls,
    ]
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
    cancelAnimation,
  }
}
