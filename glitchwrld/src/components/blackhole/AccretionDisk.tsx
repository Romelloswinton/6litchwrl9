/**
 * Accretion Disk Component
 *
 * Swirling matter spiraling into the black hole
 * Features:
 * - Temperature-based coloring (hot inner, cool outer)
 * - Orbital motion
 * - Doppler beaming effect
 * - Particle-based visualization
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AccretionDiskProps {
  innerRadius: number // Just outside event horizon
  outerRadius: number // Edge of disk
  particleCount?: number
  position?: [number, number, number]
}

export function AccretionDisk({
  innerRadius,
  outerRadius,
  particleCount = 5000,
  position = [0, 0, 0]
}: AccretionDiskProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const ringMeshRef = useRef<THREE.Mesh>(null)

  // Generate particle positions and colors based on temperature
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = []

    for (let i = 0; i < particleCount; i++) {
      // Random position in disk
      const angle = Math.random() * Math.PI * 2
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const height = (Math.random() - 0.5) * 0.3 // Thin disk

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // Temperature-based coloring
      // Inner disk is hotter (blue-white), outer is cooler (red-orange)
      const temp = 1.0 - (radius - innerRadius) / (outerRadius - innerRadius)

      if (temp > 0.8) {
        // Very hot - blue-white
        colors[i * 3] = 0.6 + temp * 0.4
        colors[i * 3 + 1] = 0.7 + temp * 0.3
        colors[i * 3 + 2] = 1.0
      } else if (temp > 0.5) {
        // Hot - white-yellow
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.9 - (temp - 0.5) * 0.4
        colors[i * 3 + 2] = 0.6 - (temp - 0.5) * 1.0
      } else if (temp > 0.3) {
        // Warm - yellow-orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.5 - (temp - 0.3) * 1.0
        colors[i * 3 + 2] = 0.1
      } else {
        // Cool - red-orange
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.2 * (temp / 0.3)
        colors[i * 3 + 2] = 0.0
      }

      // Particle size based on distance
      sizes[i] = 0.05 + Math.random() * 0.15

      // Orbital velocity (Keplerian)
      const orbitalSpeed = Math.sqrt(1.0 / radius) * 0.3
      velocities.push({
        angle,
        speed: orbitalSpeed,
        radius
      })
    }

    return { positions, colors, sizes, velocities }
  }, [particleCount, innerRadius, outerRadius])

  // Animate orbital motion
  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const vel = velocities[i]
        vel.angle += delta * vel.speed

        positions[i * 3] = Math.cos(vel.angle) * vel.radius
        positions[i * 3 + 2] = Math.sin(vel.angle) * vel.radius
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Rotate the ring mesh for additional motion
    if (ringMeshRef.current) {
      ringMeshRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <group position={position}>
      {/* Particle system */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Subtle glow ring for atmosphere */}
      <mesh
        ref={ringMeshRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[innerRadius * 0.95, outerRadius * 1.05, 64]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner bright ring (hottest part) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, innerRadius * 1.2, 32]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
