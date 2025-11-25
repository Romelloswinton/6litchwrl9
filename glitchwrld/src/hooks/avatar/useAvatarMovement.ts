import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useAvatarStore } from "../../stores/avatarStore"
import {
  AVATAR_CONFIG,
  isForwardKey,
  isBackwardKey,
  isLeftKey,
  isRightKey
} from "../../utils/avatar/avatarConfig"

/**
 * Hook to handle avatar movement via keyboard input
 * Manages input state, velocity calculations, and position updates
 */
export function useAvatarMovement() {
  const {
    gameModeEnabled,
    position,
    rotation,
    velocity,
    inputState,
    isGrounded,
    isSprinting,
    moveSpeed,
    sprintSpeed,
    gravity,
    jumpForce,
    updateInputState,
    setPosition,
    setVelocity,
    setAnimationState,
    setIsMoving,
    setIsJumping,
    setIsFalling,
    setRotation,
  } = useAvatarStore()

  // Track pressed keys
  const keysPressed = useRef<Set<string>>(new Set())

  // Handle keyboard input
  useEffect(() => {
    if (!gameModeEnabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      // Prevent default for arrow keys and space to avoid page scrolling
      if (
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === " "
      ) {
        e.preventDefault()
      }

      keysPressed.current.add(key)

      // Update input state
      if (isForwardKey(key)) {
        updateInputState("forward", true)
      } else if (isBackwardKey(key)) {
        updateInputState("backward", true)
      } else if (isLeftKey(key)) {
        updateInputState("left", true)
      } else if (isRightKey(key)) {
        updateInputState("right", true)
      } else if (key === AVATAR_CONFIG.KEYS.JUMP) {
        updateInputState("jump", true)
      } else if (key === AVATAR_CONFIG.KEYS.SPRINT) {
        updateInputState("sprint", true)
      } else if (key === AVATAR_CONFIG.KEYS.INTERACT) {
        updateInputState("interact", true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key
      keysPressed.current.delete(key)

      // Update input state
      if (isForwardKey(key)) {
        updateInputState("forward", false)
      } else if (isBackwardKey(key)) {
        updateInputState("backward", false)
      } else if (isLeftKey(key)) {
        updateInputState("left", false)
      } else if (isRightKey(key)) {
        updateInputState("right", false)
      } else if (key === AVATAR_CONFIG.KEYS.JUMP) {
        updateInputState("jump", false)
      } else if (key === AVATAR_CONFIG.KEYS.SPRINT) {
        updateInputState("sprint", false)
      } else if (key === AVATAR_CONFIG.KEYS.INTERACT) {
        updateInputState("interact", false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameModeEnabled, updateInputState])

  // Movement update loop
  useFrame((state, delta) => {
    if (!gameModeEnabled) return

    // Calculate movement direction
    const moveDirection = new THREE.Vector3()

    // Forward/backward movement
    if (inputState.forward) {
      moveDirection.z -= 1
    }
    if (inputState.backward) {
      moveDirection.z += 1
    }

    // Left/right rotation (not strafing)
    if (inputState.left) {
      const newRotation = rotation.clone()
      newRotation.y += AVATAR_CONFIG.ROTATION_SPEED
      setRotation(newRotation)
    }
    if (inputState.right) {
      const newRotation = rotation.clone()
      newRotation.y -= AVATAR_CONFIG.ROTATION_SPEED
      setRotation(newRotation)
    }

    // Normalize movement direction
    if (moveDirection.length() > 0) {
      moveDirection.normalize()
    }

    // Determine current speed
    const currentSpeed = inputState.sprint && isSprinting ? sprintSpeed : moveSpeed

    // Apply rotation to movement direction
    const rotatedDirection = moveDirection.applyEuler(rotation)

    // Calculate horizontal velocity
    const newVelocity = velocity.clone()
    newVelocity.x = rotatedDirection.x * currentSpeed
    newVelocity.z = rotatedDirection.z * currentSpeed

    // Apply gravity
    if (!isGrounded) {
      newVelocity.y += gravity
      // Clamp fall speed
      newVelocity.y = Math.max(newVelocity.y, AVATAR_CONFIG.MAX_FALL_SPEED)
    } else {
      newVelocity.y = 0
    }

    // Handle jumping
    if (inputState.jump && isGrounded) {
      newVelocity.y = jumpForce
      setIsJumping(true)
      setIsGrounded(false)
    }

    // Update velocity
    setVelocity(newVelocity)

    // Update position
    const newPosition = position.clone().add(newVelocity)

    // Simple ground collision (y = 2 is ground level for avatar height)
    if (newPosition.y <= 2) {
      newPosition.y = 2
      setIsGrounded(true)
      setIsJumping(false)
      setIsFalling(false)
    } else {
      if (newVelocity.y < 0) {
        setIsFalling(true)
      }
    }

    setPosition(newPosition)

    // Update animation state
    const horizontalSpeed = Math.sqrt(newVelocity.x ** 2 + newVelocity.z ** 2)

    if (!isGrounded) {
      if (newVelocity.y > 0) {
        setAnimationState("jumping")
      } else {
        setAnimationState("falling")
      }
    } else if (horizontalSpeed > AVATAR_CONFIG.RUN_THRESHOLD && isSprinting) {
      setAnimationState("running")
      setIsMoving(true)
    } else if (horizontalSpeed > AVATAR_CONFIG.WALK_THRESHOLD) {
      setAnimationState("walking")
      setIsMoving(true)
    } else {
      setAnimationState("idle")
      setIsMoving(false)
    }
  })

  return {
    inputState,
    position,
    rotation,
    velocity,
  }
}
