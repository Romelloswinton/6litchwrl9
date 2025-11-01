import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointsMaterial, Line, LineBasicMaterial, AdditiveBlending } from 'three'
import { useHybridStore } from '../stores/hybridStore'
import { SolarSystemGenerator } from '../utils/galaxy/solarSystemGenerator'
import * as THREE from 'three'

export function SolarSystem() {
  const planetsRef = useRef<Points>(null!)
  const orbitsRef = useRef<THREE.Group>(null!)
  const sunRef = useRef<Points>(null!)
  const materialRef = useRef<PointsMaterial>(null!)
  
  const {
    particleCount,
    galaxyRadius,
    sceneMode,
    coreColor,
    armColor,
    dustColor,
    rotationSpeed,
    isAnimating,
  } = useHybridStore()

  // Initialize solar system generator
  const solarSystemGenerator = useMemo(() => {
    return new SolarSystemGenerator({
      scale: galaxyRadius * 0.5, // Use galaxy radius as scale factor
      showOrbits: true,
      showMoons: true,
      timeScale: Math.abs(rotationSpeed) * 1000,
      useGalacticScale: sceneMode === 'galaxy', // Compress when in galaxy view
      galaxyRadius: galaxyRadius
    })
  }, [galaxyRadius, rotationSpeed, sceneMode])

  // Generate solar system data
  const { planetData, orbitLines, sunData } = useMemo(() => {
    const generator = solarSystemGenerator
    
    // Create sun at center
    const sunData = {
      position: new Float32Array([0, 0, 0]),
      color: new Float32Array([1.0, 1.0, 0.8]), // Yellowish white
      size: new Float32Array([0.2]) // Large sun
    }

    // Generate orbit lines
    const orbitGeometries = generator.generateOrbitLines()

    // Initial planet positions
    const { positions, colors, sizes, count } = generator.createPlanetBufferAttributes()

    return {
      planetData: { positions, colors, sizes, count },
      orbitLines: orbitGeometries,
      sunData
    }
  }, [solarSystemGenerator])

  // Background stars (fewer than galaxy)
  const backgroundStars = useMemo(() => {
    const starCount = Math.floor(particleCount * 0.05) // Much fewer background stars
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      
      // Place stars far from solar system
      positions[i3] = (Math.random() - 0.5) * galaxyRadius * 10
      positions[i3 + 1] = (Math.random() - 0.5) * galaxyRadius * 5
      positions[i3 + 2] = (Math.random() - 0.5) * galaxyRadius * 10
      
      // Various star colors
      const starColor = new THREE.Color().setHSL(
        Math.random() * 0.2 + 0.15, // Mostly white-blue-yellow stars
        0.2 + Math.random() * 0.3,
        0.7 + Math.random() * 0.3
      )
      
      colors[i3] = starColor.r
      colors[i3 + 1] = starColor.g
      colors[i3 + 2] = starColor.b
      
      sizes[i] = 0.1 + Math.random() * 0.2
    }
    
    return { positions, colors, sizes, count: starCount }
  }, [particleCount, galaxyRadius])

  // Animation loop
  useFrame((state, delta) => {
    if (!isAnimating) return

    // Update planet positions
    solarSystemGenerator.updatePositions(delta * 1000)
    
    // Update planet buffer attributes
    if (planetsRef.current) {
      const { positions, colors } = solarSystemGenerator.createPlanetBufferAttributes()
      const positionAttribute = planetsRef.current.geometry.attributes.position
      const colorAttribute = planetsRef.current.geometry.attributes.color
      
      if (positionAttribute && colorAttribute) {
        positionAttribute.array.set(positions)
        colorAttribute.array.set(colors)
        positionAttribute.needsUpdate = true
        colorAttribute.needsUpdate = true
      }
    }

    // Rotate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += rotationSpeed * delta * 100
    }

    // Slowly rotate orbit lines for visual effect
    if (orbitsRef.current) {
      orbitsRef.current.rotation.y += rotationSpeed * delta * 10
    }
  })

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.blending = AdditiveBlending
    }
  }, [])

  return (
    <group>
      {/* Sun */}
      <points ref={sunRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[sunData.position, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[sunData.color, 3]}
            attach="attributes-color"
          />
          <bufferAttribute
            args={[sunData.size, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          alphaTest={0.001}
          depthWrite={false}
        />
      </points>

      {/* Orbital paths */}
      <group ref={orbitsRef}>
        {orbitLines.map((geometry, index) => (
          <line key={`orbit-${index}`}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial
              attach="material"
              color={new THREE.Color(armColor).multiplyScalar(0.3)}
              transparent={true}
              opacity={0.2}
            />
          </line>
        ))}
      </group>

      {/* Planets and Moons */}
      <points ref={planetsRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[planetData.positions, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[planetData.colors, 3]}
            attach="attributes-color"
          />
          <bufferAttribute
            args={[planetData.sizes, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.05}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          alphaTest={0.001}
          depthWrite={false}
        />
      </points>

      {/* Background stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[backgroundStars.positions, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[backgroundStars.colors, 3]}
            attach="attributes-color"
          />
          <bufferAttribute
            args={[backgroundStars.sizes, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          alphaTest={0.001}
          depthWrite={false}
          opacity={0.6}
        />
      </points>
    </group>
  )
}