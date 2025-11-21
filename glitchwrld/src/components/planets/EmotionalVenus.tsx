/*
  Emotional Venus - "Burning Love" Interior Design
  A uniquely designed Venus with passionate, emotional aesthetics
  Features: Pulsing heart core, lava-like flowing interior, layered atmosphere
*/

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface EmotionalVenusProps {
  position: [number, number, number]
  size: number
  onClick?: () => void
  onPointerOver?: (e: any) => void
  onPointerOut?: (e: any) => void
  isFocused?: boolean
  time: number
}

export function EmotionalVenus({
  position,
  size,
  onClick,
  onPointerOver,
  onPointerOut,
  isFocused = false,
  time
}: EmotionalVenusProps) {
  const venusGroupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const innerLavaRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const outerGlowRef = useRef<THREE.Mesh>(null)

  // Color palette for burning love
  const COLORS = {
    deepRed: new THREE.Color('#8B0000'),      // Deep crimson core
    passionRed: new THREE.Color('#DC143C'),    // Passionate red
    loveOrange: new THREE.Color('#FF4500'),    // Burning orange
    hotMagenta: new THREE.Color('#FF1493'),    // Hot pink/magenta
    warmGold: new THREE.Color('#FFD700'),      // Warm gold highlights
    venusYellow: new THREE.Color('#E6B87E'),   // Venus surface tone
  }

  // Custom shader for pulsing heart core
  const heartCoreShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      coreColor: { value: COLORS.deepRed },
      pulseColor: { value: COLORS.passionRed },
      intensity: { value: isFocused ? 2.0 : 1.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 coreColor;
      uniform vec3 pulseColor;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        // Pulsing heart effect - faster when focused
        float pulse = sin(time * 2.0) * 0.3 + 0.7;

        // Radial gradient from center
        float dist = length(vPosition);
        float radialGlow = 1.0 - smoothstep(0.0, 1.0, dist);

        // Combine colors with pulsing
        vec3 finalColor = mix(coreColor, pulseColor, pulse);
        float finalIntensity = (radialGlow + pulse) * intensity;

        gl_FragColor = vec4(finalColor * finalIntensity, 1.0);
      }
    `
  }), [isFocused, COLORS])

  // Custom shader for flowing lava interior
  const lavaShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      lavaColor1: { value: COLORS.loveOrange },
      lavaColor2: { value: COLORS.hotMagenta },
      accentColor: { value: COLORS.warmGold },
      flowSpeed: { value: isFocused ? 0.5 : 0.2 },
      intensity: { value: isFocused ? 1.5 : 1.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 lavaColor1;
      uniform vec3 lavaColor2;
      uniform vec3 accentColor;
      uniform float flowSpeed;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      // Noise function for organic lava flow
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }

      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;

        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        // Flowing lava patterns
        vec3 flowPos = vPosition + vec3(0.0, time * flowSpeed, 0.0);
        float lavaFlow = fbm(flowPos * 3.0);

        // Secondary flow for complexity
        vec3 flowPos2 = vPosition + vec3(time * flowSpeed * 0.5, 0.0, time * flowSpeed * 0.7);
        float lavaFlow2 = fbm(flowPos2 * 2.0);

        // Combine flows
        float combinedFlow = (lavaFlow + lavaFlow2) * 0.5;

        // Create veins of intense emotion
        float veins = smoothstep(0.4, 0.6, combinedFlow);

        // Mix colors based on flow
        vec3 lavaColor = mix(lavaColor1, lavaColor2, lavaFlow);
        lavaColor = mix(lavaColor, accentColor, veins * 0.5);

        // Fresnel effect for edge glow
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

        // Pulsing brightness
        float pulse = sin(time * 1.5) * 0.2 + 0.8;

        float finalIntensity = (combinedFlow + fresnel * 0.5) * intensity * pulse;

        gl_FragColor = vec4(lavaColor * finalIntensity, 0.85);
      }
    `
  }), [isFocused, COLORS])

  // Custom shader for atmosphere
  const atmosphereShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      atmosphereColor: { value: COLORS.venusYellow },
      glowColor: { value: COLORS.loveOrange },
      intensity: { value: isFocused ? 1.2 : 0.8 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 atmosphereColor;
      uniform vec3 glowColor;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        // Fresnel for atmospheric scattering
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

        // Subtle cloud movement
        float clouds = sin(vPosition.x * 3.0 + time * 0.3) *
                       cos(vPosition.y * 2.5 + time * 0.2) * 0.5 + 0.5;

        // Mix atmosphere and glow
        vec3 finalColor = mix(atmosphereColor, glowColor, fresnel * 0.6);
        float alpha = (fresnel * 0.7 + clouds * 0.2) * intensity;

        gl_FragColor = vec4(finalColor, alpha * 0.4);
      }
    `
  }), [isFocused, COLORS])

  // Update shader uniforms
  useFrame((state, delta) => {
    if (venusGroupRef.current) {
      // Gentle rotation
      venusGroupRef.current.rotation.y += delta * 0.1
    }

    // Update core shader
    if (coreRef.current && coreRef.current.material) {
      const material = coreRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = time
      material.uniforms.intensity.value = isFocused ? 2.5 : 1.0
    }

    // Update lava shader
    if (innerLavaRef.current && innerLavaRef.current.material) {
      const material = innerLavaRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = time
      material.uniforms.flowSpeed.value = isFocused ? 0.5 : 0.2
      material.uniforms.intensity.value = isFocused ? 1.8 : 1.0
    }

    // Update atmosphere shader
    if (atmosphereRef.current && atmosphereRef.current.material) {
      const material = atmosphereRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = time
      material.uniforms.intensity.value = isFocused ? 1.5 : 0.8
    }

    // Pulsing outer glow
    if (outerGlowRef.current && outerGlowRef.current.material) {
      const material = outerGlowRef.current.material as THREE.MeshBasicMaterial
      const pulse = Math.sin(time * 1.5) * 0.3 + 0.7
      material.opacity = (isFocused ? 0.3 : 0.15) * pulse
    }
  })

  return (
    <group ref={venusGroupRef} position={position}>
      {/* Layer 1: Pulsing Heart Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size * 0.5, 32, 32]} />
        <shaderMaterial
          uniforms={heartCoreShader.uniforms}
          vertexShader={heartCoreShader.vertexShader}
          fragmentShader={heartCoreShader.fragmentShader}
          transparent={false}
        />
      </mesh>

      {/* Layer 2: Flowing Lava Interior */}
      <mesh ref={innerLavaRef}>
        <sphereGeometry args={[size * 0.75, 32, 32]} />
        <shaderMaterial
          uniforms={lavaShader.uniforms}
          vertexShader={lavaShader.vertexShader}
          fragmentShader={lavaShader.fragmentShader}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Layer 3: Semi-transparent Surface */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onPointerOver?.(e)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onPointerOut?.(e)
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={COLORS.venusYellow}
          emissive={COLORS.loveOrange}
          emissiveIntensity={isFocused ? 0.6 : 0.3}
          transparent={true}
          opacity={0.6}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Layer 4: Atmospheric Haze */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[size * 1.15, 32, 32]} />
        <shaderMaterial
          uniforms={atmosphereShader.uniforms}
          vertexShader={atmosphereShader.vertexShader}
          fragmentShader={atmosphereShader.fragmentShader}
          transparent={true}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Layer 5: Outer Glow Ring */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[size * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.hotMagenta}
          transparent={true}
          opacity={isFocused ? 0.3 : 0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Particles for emotional energy */}
      {isFocused && (
        <EmotionalParticles size={size} color={COLORS.hotMagenta} time={time} />
      )}
    </group>
  )
}

// Emotional energy particles that appear when Venus is focused
function EmotionalParticles({
  size,
  color,
  time
}: {
  size: number
  color: THREE.Color
  time: number
}) {
  const particlesRef = useRef<THREE.Points>(null)

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(100 * 3)
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = size * (1.3 + Math.random() * 0.5)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return positions
  }, [size])

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.2
      particlesRef.current.rotation.x = Math.sin(time * 0.5) * 0.2
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
