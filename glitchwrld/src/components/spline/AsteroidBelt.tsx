/**
 * Asteroid Belt Component
 *
 * Renders a simplified asteroid belt between Mars and Jupiter
 * Features:
 * - Small number of featured asteroids for clarity
 * - Varying sizes and irregular shapes
 * - Individual orbital motion
 * - Smooth and performant
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidBeltProps {
  innerRadius?: number // Distance from sun (inner edge)
  outerRadius?: number // Distance from sun (outer edge)
  asteroidCount?: number // Number of asteroids
  thickness?: number // Vertical thickness of belt
  color?: string
}

export function AsteroidBelt({
  innerRadius = 27, // Between Mars (~22) and Jupiter (~52)
  outerRadius = 40,
  asteroidCount = 15, // Just a few asteroids for simplicity
  thickness = 2,
  color = '#8B7355'
}: AsteroidBeltProps) {
  const asteroidGroupRef = useRef<THREE.Group>(null)

  // Orbital rotation
  useFrame((state, delta) => {
    if (asteroidGroupRef.current) {
      // Slow orbital rotation (asteroids orbit the sun)
      asteroidGroupRef.current.rotation.y += delta * 0.015
    }
  })

  return (
    <group ref={asteroidGroupRef}>
      {/* Featured asteroids evenly distributed */}
      {Array.from({ length: asteroidCount }).map((_, i) => {
        // Evenly space asteroids around the belt for smooth distribution
        const angle = (i / asteroidCount) * Math.PI * 2
        const radiusVariation = Math.random() * (outerRadius - innerRadius)
        const radius = innerRadius + radiusVariation
        const verticalOffset = (Math.random() - 0.5) * thickness
        const size = 0.2 + Math.random() * 0.4

        return (
          <Asteroid
            key={i}
            position={[
              Math.cos(angle) * radius,
              verticalOffset,
              Math.sin(angle) * radius
            ]}
            size={size}
            color={color}
          />
        )
      })}

      {/* Subtle dust ring to suggest more asteroids */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            innerRadius,
            outerRadius,
            64
          ]}
        />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Individual asteroid component with irregular shape
function Asteroid({
  position,
  size,
  color
}: {
  position: [number, number, number]
  size: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Create irregular shape
  const geometry = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(size, 0)

    // Deform vertices to make it irregular
    const positions = geo.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const randomFactor = 0.7 + Math.random() * 0.6
      positions.setXYZ(
        i,
        positions.getX(i) * randomFactor,
        positions.getY(i) * randomFactor,
        positions.getZ(i) * randomFactor
      )
    }
    positions.needsUpdate = true
    geo.computeVertexNormals()

    return geo
  }, [size])

  // Random rotation
  const rotationSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.005,
    y: (Math.random() - 0.5) * 0.005,
    z: (Math.random() - 0.5) * 0.005
  }), [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x
      meshRef.current.rotation.y += rotationSpeed.y
      meshRef.current.rotation.z += rotationSpeed.z
    }
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}
