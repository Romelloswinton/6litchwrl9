import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PlanetSurfaceShader, AtmosphereShader } from '../../utils/shaders/PlanetShaders'

interface RealisticPlanetProps {
  size: number
  colors: [string, string, string] // Low, Mid, High elevation colors
  atmosphereColor: string
  noiseScale?: number
  rotationSpeed?: number
  hasRings?: boolean
  ringColor?: string
  onClick?: (e: any) => void
  onPointerOver?: (e: any) => void
  onPointerOut?: (e: any) => void
}

export function RealisticPlanet({
  size,
  colors,
  atmosphereColor,
  noiseScale = 2.0,
  rotationSpeed = 0.005,
  hasRings = false,
  ringColor = '#ffffff',
  onClick,
  onPointerOver,
  onPointerOut
}: RealisticPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const lastUpdateTime = useRef(0)
  
  // Create shader materials
  const surfaceMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(colors[0]) },
        color2: { value: new THREE.Color(colors[1]) },
        color3: { value: new THREE.Color(colors[2]) },
        time: { value: 0 },
        noiseScale: { value: noiseScale },
        noiseStrength: { value: 0.5 }
      },
      vertexShader: PlanetSurfaceShader.vertexShader,
      fragmentShader: PlanetSurfaceShader.fragmentShader
    })
  }, [colors, noiseScale])

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(atmosphereColor) },
        intensity: { value: 0.5 },
        power: { value: 4.0 }
      },
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,  // Changed from AdditiveBlending
      transparent: true,
      depthWrite: false,
      depthTest: true  // Ensure depth testing is enabled
    })
  }, [atmosphereColor])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta

      // Only update shader time every ~100ms to reduce updates and flickering
      const currentTime = state.clock.elapsedTime
      if (currentTime - lastUpdateTime.current > 0.1) {
        const material = meshRef.current.material as THREE.ShaderMaterial
        material.uniforms.time.value = currentTime * 0.1
        lastUpdateTime.current = currentTime
      }
    }
  })

  return (
    <group>
      {/* Main Planet Surface */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <primitive object={surfaceMaterial} attach="material" />
      </mesh>

      {/* Atmosphere Halo */}
      <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[size, 32, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Optional Rings */}
      {hasRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
          <meshStandardMaterial 
            color={ringColor} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  )
}
