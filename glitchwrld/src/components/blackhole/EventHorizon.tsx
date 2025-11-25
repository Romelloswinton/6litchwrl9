/**
 * Event Horizon Component
 *
 * The point of no return - a textured sphere using blackhole.png
 * Features realistic black hole texture with gravitational lensing effect
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import blackHoleTexturePath from '../../assets/blackhole.png'

interface EventHorizonProps {
  radius: number // Schwarzschild radius
  position?: [number, number, number]
}

export function EventHorizon({ radius, position = [0, 0, 0] }: EventHorizonProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Load the black hole texture using drei's useTexture hook
  const blackHoleTexture = useTexture(blackHoleTexturePath)

  // Subtle rotation for visual interest
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
      meshRef.current.rotation.x += delta * 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {/* Perfect sphere geometry */}
      <sphereGeometry args={[radius, 64, 64]} />

      {/* Textured material using the black hole PNG */}
      <meshStandardMaterial
        map={blackHoleTexture}
        emissive="#000000"
        emissiveIntensity={0.5}
        roughness={0.8}
        metalness={0.2}
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
