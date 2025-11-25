/**
 * Event Horizon Component
 *
 * The point of no return - a perfect black sphere
 * No light escapes from within this radius
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface EventHorizonProps {
  radius: number // Schwarzschild radius
  position?: [number, number, number]
}

export function EventHorizon({ radius, position = [0, 0, 0] }: EventHorizonProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Subtle rotation for visual interest
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {/* Perfect sphere geometry */}
      <sphereGeometry args={[radius, 64, 64]} />

      {/* Completely black material - absorbs all light */}
      <meshBasicMaterial
        color="#000000"
        transparent={false}
      />

      {/* Subtle glow at the edge (photon sphere effect) */}
      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  )
}
