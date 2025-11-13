import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useHybridStore } from '../../stores/hybridStore'
import * as THREE from 'three'

export function useGalaxyAnimation() {
  const animationRef = useRef<{
    time: number
    phase: number
    intensity: number
  }>({
    time: 0,
    phase: 0,
    intensity: 1,
  })

  const {
    rotationSpeed,
    isAnimating,
    particleCount,
    galaxyRadius,
  } = useHybridStore()

  const updateAnimation = useCallback((delta: number) => {
    if (!isAnimating) return

    animationRef.current.time += delta
    animationRef.current.phase = (animationRef.current.time * rotationSpeed) % (Math.PI * 2)
    
    // Pulsing effect
    animationRef.current.intensity = 1 + Math.sin(animationRef.current.time * 2) * 0.1
  }, [rotationSpeed, isAnimating])

  useFrame((state, delta) => {
    updateAnimation(delta)
  })

  const getCurrentRotation = useCallback(() => {
    return animationRef.current.phase
  }, [])

  const getCurrentIntensity = useCallback(() => {
    return animationRef.current.intensity
  }, [])

  const resetAnimation = useCallback(() => {
    animationRef.current.time = 0
    animationRef.current.phase = 0
    animationRef.current.intensity = 1
  }, [])

  return {
    getCurrentRotation,
    getCurrentIntensity,
    resetAnimation,
    animationData: animationRef.current,
  }
}