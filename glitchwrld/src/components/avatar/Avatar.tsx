import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useAvatarStore } from "../../stores/avatarStore"
import { AVATAR_CONFIG } from "../../utils/avatar/avatarConfig"

/**
 * Avatar Component
 * Renders the visual representation of the player avatar as a simple astronaut-like capsule
 * Position and rotation are controlled by the avatar store
 */
export function Avatar() {
  const groupRef = useRef<THREE.Group>(null)
  const position = useAvatarStore((state) => state.position)
  const rotation = useAvatarStore((state) => state.rotation)
  const animationState = useAvatarStore((state) => state.animationState)

  // Simple bobbing animation for walking/running
  const bobOffset = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Update transform from store
    groupRef.current.position.copy(position)
    groupRef.current.rotation.copy(rotation)

    // Add simple head bobbing when moving
    if (animationState === "walking" || animationState === "running") {
      bobOffset.current += delta * 10 * (animationState === "running" ? 1.5 : 1)
      const bob = Math.sin(bobOffset.current) * 0.1
      groupRef.current.position.y += bob
    } else {
      bobOffset.current = 0
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body - Cylinder */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry
          args={[
            AVATAR_CONFIG.CAPSULE_RADIUS,
            AVATAR_CONFIG.CAPSULE_RADIUS,
            AVATAR_CONFIG.CAPSULE_HEIGHT,
            16,
          ]}
        />
        <meshStandardMaterial
          color={AVATAR_CONFIG.VISUAL.BODY_COLOR}
          emissive={AVATAR_CONFIG.VISUAL.EMISSIVE_COLOR}
          emissiveIntensity={AVATAR_CONFIG.VISUAL.EMISSIVE_INTENSITY}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head - Sphere (helmet) */}
      <mesh
        position={[0, AVATAR_CONFIG.CAPSULE_HEIGHT / 2 + AVATAR_CONFIG.HEAD_RADIUS, 0]}
        castShadow
      >
        <sphereGeometry args={[AVATAR_CONFIG.HEAD_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color={AVATAR_CONFIG.VISUAL.HEAD_COLOR}
          emissive={AVATAR_CONFIG.VISUAL.EMISSIVE_COLOR}
          emissiveIntensity={AVATAR_CONFIG.VISUAL.EMISSIVE_INTENSITY}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Visor - Dark front face indicator */}
      <mesh
        position={[
          0,
          AVATAR_CONFIG.CAPSULE_HEIGHT / 2 + AVATAR_CONFIG.HEAD_RADIUS,
          AVATAR_CONFIG.HEAD_RADIUS * 0.6,
        ]}
        castShadow
      >
        <sphereGeometry args={[AVATAR_CONFIG.HEAD_RADIUS * 0.4, 16, 16]} />
        <meshStandardMaterial
          color={AVATAR_CONFIG.VISUAL.VISOR_COLOR}
          metalness={0.9}
          roughness={0.1}
          emissive="#001133"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Point light to make avatar visible in dark space */}
      <pointLight
        position={[0, AVATAR_CONFIG.CAPSULE_HEIGHT / 2, 0]}
        intensity={0.5}
        distance={5}
        color={AVATAR_CONFIG.VISUAL.BODY_COLOR}
      />
    </group>
  )
}
