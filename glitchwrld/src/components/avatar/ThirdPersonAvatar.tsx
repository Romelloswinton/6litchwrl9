import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, Cylinder, Box } from '@react-three/drei'
import * as THREE from 'three'
import { useKeyboardControls } from '../../hooks/useKeyboardControls'

interface ThirdPersonAvatarProps {
  position?: [number, number, number]
  color?: string
  onPositionChange?: (position: THREE.Vector3) => void
}

export function ThirdPersonAvatar({
  position = [0, 1, 0],
  color = '#FF6B35',
  onPositionChange
}: ThirdPersonAvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const velocityRef = useRef(new THREE.Vector3())
  const directionRef = useRef(new THREE.Vector3())
  const { camera } = useThree()

  const keys = useKeyboardControls()

  // Movement parameters
  const moveSpeed = 5
  const sprintMultiplier = 1.8
  const rotationSpeed = 4
  const jumpForce = 8
  const gravity = -20
  const groundLevel = 1

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position)
    }
  }, [position])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const avatar = groupRef.current
    const velocity = velocityRef.current
    const direction = directionRef.current

    // Get camera forward and right directions (ignore Y component for horizontal movement)
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    cameraDirection.y = 0
    cameraDirection.normalize()

    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(camera.up, cameraDirection).normalize()

    // Calculate movement direction based on input
    direction.set(0, 0, 0)

    if (keys.forward) {
      direction.add(cameraDirection)
    }
    if (keys.backward) {
      direction.sub(cameraDirection)
    }
    if (keys.right) {
      direction.add(cameraRight)
    }
    if (keys.left) {
      direction.sub(cameraRight)
    }

    // Normalize to prevent faster diagonal movement
    if (direction.length() > 0) {
      direction.normalize()
    }

    // Apply movement speed
    const currentSpeed = keys.sprint ? moveSpeed * sprintMultiplier : moveSpeed
    velocity.x = direction.x * currentSpeed
    velocity.z = direction.z * currentSpeed

    // Apply gravity
    velocity.y += gravity * delta

    // Jump
    if (keys.jump && avatar.position.y <= groundLevel + 0.1) {
      velocity.y = jumpForce
    }

    // Update position
    avatar.position.x += velocity.x * delta
    avatar.position.y += velocity.y * delta
    avatar.position.z += velocity.z * delta

    // Ground collision
    if (avatar.position.y < groundLevel) {
      avatar.position.y = groundLevel
      velocity.y = 0
    }

    // Rotate avatar to face movement direction
    if (direction.length() > 0) {
      const targetRotation = Math.atan2(direction.x, direction.z)
      avatar.rotation.y = THREE.MathUtils.lerp(
        avatar.rotation.y,
        targetRotation,
        rotationSpeed * delta
      )
    }

    // Update camera to follow avatar (third-person)
    const cameraOffset = new THREE.Vector3(0, 4, 8)
    const cameraTarget = avatar.position.clone()

    // Apply offset relative to avatar's rotation
    const rotatedOffset = cameraOffset.clone()
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), avatar.rotation.y)

    const desiredCameraPosition = cameraTarget.clone().add(rotatedOffset)

    camera.position.lerp(desiredCameraPosition, 5 * delta)
    camera.lookAt(cameraTarget.clone().add(new THREE.Vector3(0, 2, 0)))

    // Notify position change
    if (onPositionChange) {
      onPositionChange(avatar.position.clone())
    }
  })

  return (
    <group ref={groupRef}>
      {/* Simple astronaut-like character */}

      {/* Body */}
      <Cylinder args={[0.4, 0.5, 1.2, 16]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Cylinder>

      {/* Head */}
      <Sphere args={[0.4, 32, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Visor (dark glass) */}
      <Sphere args={[0.35, 32, 32]} position={[0, 1.5, 0.2]}>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Backpack */}
      <Box args={[0.6, 0.8, 0.3]} position={[0, 0.8, -0.4]}>
        <meshStandardMaterial color="#2c3e50" roughness={0.6} metalness={0.4} />
      </Box>

      {/* Arms */}
      <Cylinder args={[0.15, 0.15, 0.8, 8]} position={[-0.55, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.8, 8]} position={[0.55, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Cylinder>

      {/* Legs */}
      <Cylinder args={[0.2, 0.18, 0.9, 8]} position={[-0.2, -0.45, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Cylinder>
      <Cylinder args={[0.2, 0.18, 0.9, 8]} position={[0.2, -0.45, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Cylinder>

      {/* Boots */}
      <Box args={[0.25, 0.15, 0.35]} position={[-0.2, -0.95, 0.05]}>
        <meshStandardMaterial color="#34495e" roughness={0.7} metalness={0.2} />
      </Box>
      <Box args={[0.25, 0.15, 0.35]} position={[0.2, -0.95, 0.05]}>
        <meshStandardMaterial color="#34495e" roughness={0.7} metalness={0.2} />
      </Box>

      {/* Shadow (plane below character) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
