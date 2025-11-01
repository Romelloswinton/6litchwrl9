import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, NormalBlending, MultiplyBlending } from 'three'
import * as THREE from 'three'
import { useHybridStore } from '../stores/hybridStore'
import { StarfieldLayer } from '../types/galaxy'

export function MultiLayerStarfield() {
  const {
    particleCount,
    galaxyRadius,
    isAnimating,
    rotationSpeed,
    layers
  } = useHybridStore()

  // Refs for each starfield layer
  const layerRefs = useRef<Record<string, THREE.Points | null>>({
    distant: null,
    mid: null,
    near: null,
    close: null,
    foreground: null
  })

  // Camera tracking for dynamic parallax
  const prevCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const smoothedCameraVelocity = useRef<THREE.Vector3>(new THREE.Vector3())

  // Define starfield layers with different depth characteristics
  const starfieldLayers: StarfieldLayer[] = useMemo(() => [
    {
      name: 'distant',
      layerType: 'starfield-distant',
      depthRange: [galaxyRadius * 10, galaxyRadius * 20],
      starCount: Math.floor(particleCount * 0.4), // 40% distant stars
      starSizeRange: [0.5, 1.5],
      parallaxStrength: 0.05, // Minimal parallax
      rotationSpeed: 0.001,
      color: new THREE.Color('#87ceeb'), // Cool blue
      brightness: 0.6
    },
    {
      name: 'mid',
      layerType: 'starfield-mid',
      depthRange: [galaxyRadius * 5, galaxyRadius * 10],
      starCount: Math.floor(particleCount * 0.25), // 25% mid-range stars
      starSizeRange: [1.0, 2.5],
      parallaxStrength: 0.15,
      rotationSpeed: 0.002,
      color: new THREE.Color('#ffffff'), // White
      brightness: 0.7
    },
    {
      name: 'near',
      layerType: 'starfield-near',
      depthRange: [galaxyRadius * 2, galaxyRadius * 5],
      starCount: Math.floor(particleCount * 0.2), // 20% near stars - SPLINE LAYER
      starSizeRange: [1.5, 3.0],
      parallaxStrength: 0.3, // Medium parallax for Spline integration
      rotationSpeed: 0.003,
      color: new THREE.Color('#fff8dc'), // Warm white
      brightness: 0.9
    },
    {
      name: 'close',
      layerType: 'starfield-close',
      depthRange: [galaxyRadius * 1, galaxyRadius * 2],
      starCount: Math.floor(particleCount * 0.1), // 10% close stars
      starSizeRange: [2.0, 4.0],
      parallaxStrength: 0.5, // Strong parallax
      rotationSpeed: 0.004,
      color: new THREE.Color('#ffd700'), // Warm yellow
      brightness: 0.8
    },
    {
      name: 'foreground',
      layerType: 'starfield-foreground',
      depthRange: [galaxyRadius * 0.5, galaxyRadius * 1],
      starCount: Math.floor(particleCount * 0.05), // 5% foreground particles
      starSizeRange: [3.0, 6.0],
      parallaxStrength: 0.8, // Maximum parallax
      rotationSpeed: 0.005,
      color: new THREE.Color('#ff6b6b'), // Subtle red dust
      brightness: 0.4
    }
  ], [particleCount, galaxyRadius])

  // Generate star data for each layer
  const layerData = useMemo(() => {
    const data: Record<string, { positions: Float32Array; colors: Float32Array; sizes: Float32Array; count: number }> = {}

    starfieldLayers.forEach(layer => {
      const positions = new Float32Array(layer.starCount * 3)
      const colors = new Float32Array(layer.starCount * 3)
      const sizes = new Float32Array(layer.starCount)

      for (let i = 0; i < layer.starCount; i++) {
        const i3 = i * 3

        // Generate random spherical distribution within depth range
        const distance = layer.depthRange[0] + Math.random() * (layer.depthRange[1] - layer.depthRange[0])
        const theta = Math.random() * Math.PI * 2 // Azimuth
        const phi = Math.acos(2 * Math.random() - 1) // Polar angle for uniform sphere distribution

        positions[i3] = distance * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = distance * Math.cos(phi)
        positions[i3 + 2] = distance * Math.sin(phi) * Math.sin(theta)

        // Color variation based on layer characteristics
        const colorVariation = (Math.random() - 0.5) * 0.3
        const layerColor = layer.color.clone()
        layerColor.multiplyScalar(layer.brightness + colorVariation)

        colors[i3] = Math.min(1, layerColor.r)
        colors[i3 + 1] = Math.min(1, layerColor.g)
        colors[i3 + 2] = Math.min(1, layerColor.b)

        // Size variation
        sizes[i] = layer.starSizeRange[0] + Math.random() * (layer.starSizeRange[1] - layer.starSizeRange[0])
      }

      data[layer.name] = { positions, colors, sizes, count: layer.starCount }
    })

    console.log(`🌟 Generated ${starfieldLayers.length} starfield layers with total ${Object.values(data).reduce((sum, d) => sum + d.count, 0)} stars`)
    return data
  }, [starfieldLayers])

  // Animation loop with multi-layer parallax
  useFrame((state, delta) => {
    if (!isAnimating) return

    const time = state.clock.elapsedTime
    
    // Camera velocity tracking for dynamic parallax
    const currentCameraPosition = state.camera.position.clone()
    const cameraVelocity = currentCameraPosition.clone().sub(prevCameraPosition.current).divideScalar(delta)
    
    // Smooth camera velocity
    const smoothingFactor = 0.8
    smoothedCameraVelocity.current.lerp(cameraVelocity, 1 - smoothingFactor)
    
    // Update each layer with different parallax strengths
    starfieldLayers.forEach(layer => {
      const points = layerRefs.current[layer.name]
      if (!points) return

      // Base rotation
      points.rotation.y += rotationSpeed * layer.rotationSpeed * delta * 100

      // Apply layer-specific parallax based on camera movement
      const parallaxOffset = smoothedCameraVelocity.current.clone()
        .multiplyScalar(layer.parallaxStrength * 0.01)
      
      points.position.x = parallaxOffset.x
      points.position.y = parallaxOffset.y * 0.5 // Reduce vertical parallax
      points.position.z = parallaxOffset.z

      // Subtle pulsing effect for depth perception
      const pulseScale = 1 + Math.sin(time * 0.5 + layer.parallaxStrength) * 0.02
      points.scale.setScalar(pulseScale)
    })

    // Store current position for next frame
    prevCameraPosition.current.copy(currentCameraPosition)
  })

  // Get blend mode for layer
  const getBlendMode = (blendModeString: string) => {
    switch (blendModeString) {
      case 'additive': return AdditiveBlending
      case 'multiply': return MultiplyBlending
      default: return NormalBlending
    }
  }

  // Store reference to near layer for Spline integration
  useEffect(() => {
    const nearLayer = layerRefs.current.near
    if (nearLayer) {
      // Expose near layer globally for Spline positioning
      ;(window as any).starfieldNearLayer = nearLayer
      console.log('🎯 Exposed starfield near layer for Spline integration')
    }
  }, [layerRefs.current.near])

  return (
    <group>
      {starfieldLayers.map(layer => {
        const layerConfig = layers[layer.layerType]
        const data = layerData[layer.name]
        
        if (!layerConfig?.visible || !data) return null

        return (
          <points
            key={layer.name}
            ref={(ref) => { layerRefs.current[layer.name] = ref as THREE.Points | null }}
            visible={layerConfig.visible}
          >
            <bufferGeometry>
              <bufferAttribute
                args={[data.positions, 3]}
                attach="attributes-position"
              />
              <bufferAttribute
                args={[data.colors, 3]}
                attach="attributes-color"
              />
              <bufferAttribute
                args={[data.sizes, 1]}
                attach="attributes-size"
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.02}
              sizeAttenuation={true}
              vertexColors={true}
              transparent={true}
              opacity={layerConfig.opacity}
              alphaTest={0.001}
              depthWrite={false}
              blending={getBlendMode(layerConfig.blendMode)}
            />
          </points>
        )
      })}
    </group>
  )
}

// Export layer information for Spline integration
export const SPLINE_LAYER_INFO = {
  name: 'near',
  layerType: 'starfield-near' as const,
  parallaxStrength: 0.3,
  depthRange: [2, 5] // Relative to galaxyRadius
}