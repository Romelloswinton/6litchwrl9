/**
 * Galaxy Nebula Clouds
 *
 * Volumetric nebula clouds that add depth and color to the galaxy
 * Uses sprite-based billboards with gradient colors matching galaxy theme
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useHybridStore } from '../../stores/hybridStore'

interface NebulaCloud {
  position: THREE.Vector3
  size: number
  color: THREE.Color
  opacity: number
  rotationSpeed: number
  driftSpeed: THREE.Vector3
  pulseSpeed: number
  pulsePhase: number
}

interface GalaxyNebulaCloudsProps {
  /** Number of nebula clouds to generate */
  cloudCount?: number
  /** Enable animation */
  animate?: boolean
  /** Overall opacity multiplier */
  opacity?: number
}

export function GalaxyNebulaClouds({
  cloudCount = 30,
  animate = true,
  opacity = 0.4
}: GalaxyNebulaCloudsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Sprite[]>([])

  const {
    galaxyRadius,
    spiralArms,
    coreColor,
    armColor,
    dustColor,
    isAnimating
  } = useHybridStore()

  // Generate nebula clouds
  const clouds = useMemo(() => {
    const cloudData: NebulaCloud[] = []

    // Color palette based on galaxy colors
    const colors = [
      new THREE.Color(coreColor),      // Core - gold
      new THREE.Color(armColor),       // Arms - blue
      new THREE.Color(dustColor),      // Dust - brown
      new THREE.Color('#ff69b4'),      // Pink nebula
      new THREE.Color('#9370db'),      // Purple nebula
      new THREE.Color('#4169e1'),      // Deep blue
      new THREE.Color('#ff6347'),      // Red-orange nebula
    ]

    for (let i = 0; i < cloudCount; i++) {
      // Distribute clouds in spiral pattern similar to galaxy
      const armIndex = i % spiralArms
      const branchAngle = (armIndex / spiralArms) * Math.PI * 2

      // Distance from center (concentrated more towards middle)
      const distanceFactor = Math.pow(Math.random(), 1.5)
      const distance = galaxyRadius * 0.3 + galaxyRadius * 0.6 * distanceFactor

      // Spiral offset
      const spiralOffset = distance * 1.5 + (Math.random() - 0.5) * 2
      const angle = branchAngle + spiralOffset + (Math.random() - 0.5) * 0.8

      // Height variation (flatten towards galactic plane)
      const heightVariation = (Math.random() - 0.5) * galaxyRadius * 0.4

      const position = new THREE.Vector3(
        Math.cos(angle) * distance,
        heightVariation,
        Math.sin(angle) * distance
      )

      // Size variation (larger clouds towards core)
      const sizeFactor = 1.5 - distanceFactor * 0.8
      const size = (1 + Math.random() * 3) * sizeFactor * galaxyRadius * 0.3

      // Color selection (core clouds are warmer, outer clouds cooler)
      let colorIndex
      if (distanceFactor < 0.3) {
        // Core region - gold/pink/red
        colorIndex = Math.floor(Math.random() * 3) // 0, 1, 2 (gold, blue, brown)
        if (Math.random() > 0.5) colorIndex = 3 // pink
      } else if (distanceFactor < 0.6) {
        // Middle region - blue/purple
        colorIndex = Math.random() > 0.5 ? 1 : 4 // blue or purple
      } else {
        // Outer region - deep blue/purple
        colorIndex = Math.random() > 0.5 ? 5 : 4 // deep blue or purple
      }

      const color = colors[colorIndex].clone()

      // Opacity based on distance (more transparent at edges)
      const baseOpacity = 0.3 + (1 - distanceFactor) * 0.4

      cloudData.push({
        position,
        size,
        color,
        opacity: baseOpacity,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        driftSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.02
        ),
        pulseSpeed: 0.3 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2
      })
    }

    console.log(`🌫️ Generated ${cloudCount} nebula clouds with galaxy colors`)
    return cloudData
  }, [cloudCount, galaxyRadius, spiralArms, coreColor, armColor, dustColor])

  // Create cloud texture (radial gradient)
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)')
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  // Create sprite materials for each cloud
  useEffect(() => {
    if (!groupRef.current) return

    // Clear previous clouds
    cloudsRef.current.forEach(sprite => {
      sprite.material.dispose()
    })
    groupRef.current.clear()
    cloudsRef.current = []

    // Create new cloud sprites
    clouds.forEach(cloud => {
      const material = new THREE.SpriteMaterial({
        map: cloudTexture,
        color: cloud.color,
        transparent: true,
        opacity: cloud.opacity * opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false
      })

      const sprite = new THREE.Sprite(material)
      sprite.position.copy(cloud.position)
      sprite.scale.set(cloud.size, cloud.size, 1)

      // Store cloud data on sprite for animation
      sprite.userData = cloud

      groupRef.current?.add(sprite)
      cloudsRef.current.push(sprite)
    })
  }, [clouds, cloudTexture, opacity])

  // Animation loop
  useFrame((state, delta) => {
    if (!animate || !isAnimating) return

    const time = state.clock.elapsedTime

    cloudsRef.current.forEach((sprite, index) => {
      const cloud = sprite.userData as NebulaCloud

      // Rotation
      sprite.material.rotation += cloud.rotationSpeed * delta

      // Pulsing opacity
      const pulseFactor = Math.sin(time * cloud.pulseSpeed + cloud.pulsePhase) * 0.3 + 0.7
      sprite.material.opacity = cloud.opacity * opacity * pulseFactor

      // Gentle drift
      sprite.position.x += cloud.driftSpeed.x * delta
      sprite.position.y += cloud.driftSpeed.y * delta
      sprite.position.z += cloud.driftSpeed.z * delta

      // Wrap around bounds
      const maxDrift = galaxyRadius * 1.5
      if (Math.abs(sprite.position.x) > maxDrift) {
        sprite.position.x *= -0.9
      }
      if (Math.abs(sprite.position.y) > maxDrift * 0.5) {
        sprite.position.y *= -0.9
      }
      if (Math.abs(sprite.position.z) > maxDrift) {
        sprite.position.z *= -0.9
      }
    })

    // Subtle rotation of entire group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      cloudsRef.current.forEach(sprite => {
        sprite.material.dispose()
      })
      cloudTexture.dispose()
    }
  }, [cloudTexture])

  return <group ref={groupRef} name="galaxy-nebula-clouds" />
}

/**
 * Preset configurations for different nebula styles
 */
export const NebulaPresets = {
  subtle: {
    cloudCount: 20,
    opacity: 0.3
  },
  normal: {
    cloudCount: 30,
    opacity: 0.4
  },
  dense: {
    cloudCount: 50,
    opacity: 0.5
  },
  spectacular: {
    cloudCount: 80,
    opacity: 0.6
  }
}
