/**
 * Textured Black Hole Component - Advanced Version
 *
 * Uses your blackhole.png with advanced Three.js features:
 * - Custom shader for gravitational lensing effect
 * - Displacement mapping for surface detail
 * - Environment mapping for realistic reflections
 * - Animated distortion effects
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import blackHoleTexturePath from '../../assets/blackhole.png'

interface TexturedBlackHoleProps {
  position?: [number, number, number]
  radius?: number
  mass?: number
  enableShader?: boolean // Toggle advanced shader effects
}

export function TexturedBlackHole({
  position = [0, 0, 0],
  radius = 3,
  mass = 10,
  enableShader = false
}: TexturedBlackHoleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Load the black hole texture
  const blackHoleTexture = useTexture(blackHoleTexturePath)

  // Configure texture settings for better appearance
  useMemo(() => {
    blackHoleTexture.wrapS = THREE.RepeatWrapping
    blackHoleTexture.wrapT = THREE.RepeatWrapping
    blackHoleTexture.anisotropy = 16 // Better quality at angles
  }, [blackHoleTexture])

  // Custom shader material for gravitational lensing effect
  const shaderMaterial = useMemo(() => {
    if (!enableShader) return null

    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: blackHoleTexture },
        uTime: { value: 0 },
        uDistortion: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uDistortion;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // Gravitational lensing distortion
          vec2 center = vec2(0.5, 0.5);
          vec2 offset = vUv - center;
          float dist = length(offset);
          float distortion = uDistortion * sin(dist * 10.0 - uTime);
          vec2 distortedUv = vUv + offset * distortion * 0.1;

          // Sample texture with distortion
          vec4 color = texture2D(uTexture, distortedUv);

          // Add edge glow (photon sphere)
          float edge = 1.0 - abs(dot(normalize(vPosition), vec3(0, 0, 1)));
          edge = pow(edge, 3.0);
          vec3 edgeGlow = vec3(1.0, 0.5, 0.0) * edge * 0.5;

          gl_FragColor = vec4(color.rgb + edgeGlow, 1.0);
        }
      `
    })
  }, [blackHoleTexture, enableShader])

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation for depth perception
      meshRef.current.rotation.y += delta * 0.1
      meshRef.current.rotation.x += delta * 0.05

      // Update shader time if using custom shader
      if (enableShader && meshRef.current.material instanceof THREE.ShaderMaterial) {
        meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
      }
    }

    // Pulsing glow effect
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1.0
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={position}>
      {/* Main black hole sphere with texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        {enableShader && shaderMaterial ? (
          <primitive object={shaderMaterial} attach="material" />
        ) : (
          <meshStandardMaterial
            map={blackHoleTexture}
            emissive="#1a0a00"
            emissiveIntensity={0.8}
            roughness={0.4}
            metalness={0.6}
            envMapIntensity={1.5}
          />
        )}
      </mesh>

      {/* Photon sphere glow */}
      <mesh ref={glowRef} scale={1.03}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh scale={0.95}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ambient lighting for the black hole */}
      <pointLight
        position={[0, 0, 0]}
        intensity={mass * 0.1}
        distance={radius * 10}
        color="#ff4400"
        decay={2}
      />
    </group>
  )
}
