import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, Points } from 'three'
import { useHybridStore } from '../stores/hybridStore'
import * as THREE from 'three'

interface PlanetSync {
  planetMesh: THREE.Mesh
  starfield: THREE.Points
  baseRotationRate: number
  phaseOffset: number
  orbitalDeviation: number
}

interface StarfieldPlanetSyncProps {
  starfieldRef?: React.RefObject<Points>
  planetsRef?: React.RefObject<Group>
  illusion?: {
    enabled: boolean
    depthLayering: boolean
    rotationSync: number // 0-1, how much to sync with starfield
    gentleMotion: number // 0-1, amount of independent gentle motion
  }
}

export function StarfieldPlanetSync({ 
  starfieldRef,
  planetsRef,
  illusion = {
    enabled: true,
    depthLayering: true,
    rotationSync: 0.8,
    gentleMotion: 0.3
  }
}: StarfieldPlanetSyncProps) {
  const syncRef = useRef<PlanetSync[]>([])
  const { isAnimating, rotationSpeed } = useHybridStore()

  // Calculate optical depth layers for illusion
  const depthLayers = useMemo(() => {
    if (!illusion.depthLayering) return []
    
    return [
      { depth: 0.9, opacity: 1.0, size: 1.0, speed: 1.0 }, // Foreground planets
      { depth: 0.7, opacity: 0.8, size: 0.8, speed: 0.8 }, // Mid-ground  
      { depth: 0.5, opacity: 0.6, size: 0.6, speed: 0.6 }, // Background
      { depth: 0.3, opacity: 0.4, size: 0.4, speed: 0.4 }  // Far background
    ]
  }, [illusion.depthLayering])

  // Synchronization algorithm
  const synchronizeMotion = useCallback((planet: THREE.Mesh, starfield: THREE.Points, time: number) => {
    if (!illusion.enabled) return

    const baseRotation = rotationSpeed * time * 60
    const starfieldRotation = starfield.rotation.y || 0
    
    // Calculate synchronized rotation with gentle deviation
    const syncedRotation = starfieldRotation * illusion.rotationSync
    const gentleDeviation = Math.sin(time * 0.5) * illusion.gentleMotion * 0.1
    
    // Apply combined rotation to planet's orbital position
    const totalRotation = syncedRotation + gentleDeviation
    
    // Get planet's distance from center for orbital calculation
    const distance = Math.sqrt(planet.position.x ** 2 + planet.position.z ** 2)
    
    // Calculate new synchronized position
    const newX = Math.cos(totalRotation) * distance
    const newZ = Math.sin(totalRotation) * distance
    const newY = planet.position.y + Math.sin(time * 0.3) * 0.02 // Gentle vertical motion
    
    planet.position.set(newX, newY, newZ)
    
    // Individual planet rotation (spinning on axis)
    planet.rotation.x += Math.sin(time * 0.2) * 0.005
    planet.rotation.y += Math.cos(time * 0.15) * 0.003
    
  }, [illusion, rotationSpeed])

  // Main animation loop
  useFrame((state, delta) => {
    if (!isAnimating || !starfieldRef?.current || !planetsRef?.current) return

    const time = state.clock.elapsedTime
    const starfield = starfieldRef.current
    
    // Apply optical illusion synchronization to each planet
    planetsRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        synchronizeMotion(child, starfield, time)
        
        // Apply depth-based effects
        if (illusion.depthLayering) {
          const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2)
          const normalizedDistance = distance / 10 // Normalize to 0-1 range
          
          // Find appropriate depth layer
          const layer = depthLayers.find(l => normalizedDistance <= l.depth) || depthLayers[depthLayers.length - 1]
          
          // Apply depth-based scaling and opacity
          child.scale.setScalar(layer.size)
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = layer.opacity
            child.material.transparent = true
          }
        }
      }
    })

    // Subtle group rotation to enhance the illusion
    if (planetsRef.current && illusion.enabled) {
      const groupRotation = (starfield.rotation.y || 0) * 0.05 // Very subtle
      planetsRef.current.rotation.y = groupRotation
    }
  })

  return null // This is a logic-only component
}

// Hook for creating synchronized planet positions
export function useSynchronizedPlanetPositions(
  planetCount: number = 8,
  syncMode: 'starfield' | 'orbital' | 'hybrid' = 'hybrid'
) {
  const { galaxyRadius, spiralArms, spiralTightness, rotationSpeed } = useHybridStore()
  
  return useMemo(() => {
    const positions: Array<{
      position: THREE.Vector3
      rotation: THREE.Euler
      scale: number
      color: THREE.Color
      syncParams: {
        orbitalRadius: number
        baseSpeed: number
        phaseOffset: number
        depthLayer: number
      }
    }> = []

    for (let i = 0; i < planetCount; i++) {
      const armIndex = i % spiralArms
      const branchAngle = (armIndex / spiralArms) * Math.PI * 2
      
      // Distribute planets at different distances for depth illusion
      const normalizedPosition = i / planetCount
      const baseRadius = 1 + (galaxyRadius - 1) * Math.pow(normalizedPosition, 0.6)
      const spinAngle = baseRadius * spiralTightness
      
      // Add controlled randomization
      const angleVariation = (Math.random() - 0.5) * 0.2
      const radiusVariation = (Math.random() - 0.5) * 0.3
      
      const finalRadius = Math.max(0.8, baseRadius + radiusVariation)
      const finalAngle = branchAngle + spinAngle + angleVariation
      
      const position = new THREE.Vector3(
        Math.cos(finalAngle) * finalRadius,
        (Math.random() - 0.5) * 0.15,
        Math.sin(finalAngle) * finalRadius
      )
      
      // Calculate sync parameters based on mode
      let baseSpeed = 0.01
      let phaseOffset = Math.random() * Math.PI * 2
      
      switch (syncMode) {
        case 'starfield':
          baseSpeed = Math.abs(rotationSpeed) * (0.8 + Math.random() * 0.4)
          break
        case 'orbital':
          baseSpeed = 0.1 / Math.sqrt(finalRadius) // Kepler's laws
          break
        case 'hybrid':
          const starfieldComponent = Math.abs(rotationSpeed) * 0.6
          const orbitalComponent = (0.05 / Math.sqrt(finalRadius)) * 0.4
          baseSpeed = starfieldComponent + orbitalComponent
          break
      }
      
      // Color based on distance (temperature gradient)
      const hue = Math.max(0, Math.min(0.15, 0.15 - (finalRadius / galaxyRadius) * 0.1))
      const color = new THREE.Color().setHSL(hue, 0.7, 0.6 + Math.random() * 0.3)
      
      // Depth layer for optical effects
      const depthLayer = Math.floor((finalRadius / galaxyRadius) * 4) / 4
      
      positions.push({
        position,
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        scale: 0.8 + Math.random() * 0.4,
        color,
        syncParams: {
          orbitalRadius: finalRadius,
          baseSpeed,
          phaseOffset,
          depthLayer
        }
      })
    }
    
    return positions
  }, [galaxyRadius, spiralArms, spiralTightness, planetCount, syncMode, rotationSpeed])
}

// Advanced optical illusion effects
export function createOpticalIllusionMaterial(
  baseColor: THREE.Color,
  depthLayer: number,
  time: number
): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({
    color: baseColor.clone(),
    transparent: true,
    opacity: 0.7 + depthLayer * 0.3,
  })
  
  // Add subtle color shifting based on depth
  const hueShift = Math.sin(time * 0.1 + depthLayer * Math.PI) * 0.02
  material.color.offsetHSL(hueShift, 0, 0)
  
  return material
}