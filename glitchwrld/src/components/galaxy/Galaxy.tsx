import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointsMaterial, AdditiveBlending } from 'three'
import { useHybridStore } from '../../stores/hybridStore'
import * as THREE from 'three'
import { shallow } from 'zustand/shallow'

export function Galaxy() {
  const pointsRef = useRef<Points>(null!)
  const materialRef = useRef<PointsMaterial>(null!)
  
  // Use selective state subscription to prevent unnecessary re-renders
  const particleCount = useHybridStore((state) => state.particleCount)
  const galaxyRadius = useHybridStore((state) => state.galaxyRadius)
  const spiralArms = useHybridStore((state) => state.spiralArms)
  const spiralTightness = useHybridStore((state) => state.spiralTightness)
  const coreSize = useHybridStore((state) => state.coreSize)
  const coreColor = useHybridStore((state) => state.coreColor)
  const armColor = useHybridStore((state) => state.armColor)
  const dustColor = useHybridStore((state) => state.dustColor)
  const rotationSpeed = useHybridStore((state) => state.rotationSpeed)
  const isAnimating = useHybridStore((state) => state.isAnimating)

  const galaxyData = useMemo(() => {
    console.log('🌌 Regenerating galaxy with:', { particleCount, galaxyRadius, spiralArms, spiralTightness })
    
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    
    const coreColorObj = new THREE.Color(coreColor)
    const armColorObj = new THREE.Color(armColor)
    const dustColorObj = new THREE.Color(dustColor)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Create spiral galaxy structure
      const radius = Math.random() * galaxyRadius
      const spinAngle = radius * spiralTightness
      const branchAngle = (i % spiralArms) / spiralArms * Math.PI * 2
      
      // Add randomness to create more natural distribution
      const randomX = Math.pow(Math.random(), 0.75) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius
      const randomY = (Math.random() - 0.5) * 0.5 * radius * Math.pow((galaxyRadius - radius) / galaxyRadius, 2)
      const randomZ = Math.pow(Math.random(), 0.75) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius
      
      // Calculate final positions
      const x = Math.cos(branchAngle + spinAngle) * radius + randomX
      const y = randomY
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      // Color based on distance from center
      const normalizedRadius = radius / galaxyRadius
      const coreInfluence = Math.pow(1 - Math.min(normalizedRadius / coreSize, 1), 2)
      const dustInfluence = Math.pow(normalizedRadius, 1.5) * 0.3
      
      let finalColor = armColorObj.clone()
      
      if (coreInfluence > 0.1) {
        finalColor = finalColor.lerp(coreColorObj, coreInfluence)
      }
      
      if (dustInfluence > 0.2) {
        finalColor = finalColor.lerp(dustColorObj, dustInfluence * 0.5)
      }
      
      colors[i3] = finalColor.r
      colors[i3 + 1] = finalColor.g
      colors[i3 + 2] = finalColor.b
      
      // Size based on core proximity and randomness
      scales[i] = (coreInfluence * 2 + 0.5) * (0.5 + Math.random() * 0.5)
    }
    
    return { positions, colors, scales }
  }, [particleCount, galaxyRadius, spiralArms, spiralTightness, coreSize, coreColor, armColor, dustColor])

  useFrame((state, delta) => {
    if (pointsRef.current && isAnimating) {
      pointsRef.current.rotation.y += rotationSpeed * delta * 100
    }
  })

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.blending = AdditiveBlending
    }
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[galaxyData.positions, 3]}
          attach="attributes-position"
        />
        <bufferAttribute
          args={[galaxyData.colors, 3]}
          attach="attributes-color"
        />
        <bufferAttribute
          args={[galaxyData.scales, 1]}
          attach="attributes-scale"
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        alphaTest={0.001}
        depthWrite={false}
      />
    </points>
  )
}