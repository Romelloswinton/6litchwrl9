import { useCallback, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useHybridStore } from '../../stores/hybridStore'

interface CameraAnimationOptions {
  duration?: number
  easing?: 'linear' | 'easeInOut' | 'easeOut'
  onComplete?: () => void
}

/**
 * Hook for smooth camera animations
 * Works inside R3F Canvas
 */
export function useCameraAnimation() {
  const { camera } = useThree()
  const animationRef = useRef<number | null>(null)
  const { setCameraPosition, setCameraTarget } = useHybridStore()

  const cancelAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const animateToPosition = useCallback(
    (
      targetPosition: THREE.Vector3,
      targetLookAt: THREE.Vector3,
      options: CameraAnimationOptions = {}
    ) => {
      const {
        duration = 2000,
        easing = 'easeInOut',
        onComplete
      } = options

      // Cancel any ongoing animation
      cancelAnimation()

      const startPosition = camera.position.clone()
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

        // Interpolate camera position
        const newPosition = new THREE.Vector3().lerpVectors(
          startPosition,
          targetPosition,
          easedProgress
        )

        // Update camera directly
        camera.position.copy(newPosition)
        camera.lookAt(targetLookAt)

        // Update store so OrbitControls syncs
        setCameraPosition(newPosition)
        setCameraTarget(targetLookAt)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          animationRef.current = null
          onComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [camera, cancelAnimation, setCameraPosition, setCameraTarget]
  )

  return {
    animateToPosition,
    cancelAnimation,
  }
}
