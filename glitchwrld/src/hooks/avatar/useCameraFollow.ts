import { useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useAvatarStore } from "../../stores/avatarStore"
import { useHybridStore } from "../../stores/hybridStore"
import { AVATAR_CONFIG } from "../../utils/avatar/avatarConfig"

/**
 * Hook to make the camera follow the avatar in third-person or first-person mode
 * Smoothly interpolates camera position and rotation
 */
export function useCameraFollow() {
  const { camera } = useThree()
  const cameraMode = useAvatarStore((state) => state.cameraMode)
  const avatarPosition = useAvatarStore((state) => state.position)
  const avatarRotation = useAvatarStore((state) => state.rotation)
  const gameModeEnabled = useAvatarStore((state) => state.gameModeEnabled)

  const setEnableOrbitControls = useHybridStore((state) => state.setEnableOrbitControls)
  const setCameraPosition = useHybridStore((state) => state.setCameraPosition)
  const setCameraTarget = useHybridStore((state) => state.setCameraTarget)

  // Disable orbit controls when in game mode
  useEffect(() => {
    if (gameModeEnabled && (cameraMode === "thirdPerson" || cameraMode === "firstPerson")) {
      setEnableOrbitControls(false)
    } else {
      setEnableOrbitControls(true)
    }
  }, [gameModeEnabled, cameraMode, setEnableOrbitControls])

  // Camera follow logic
  useFrame(() => {
    if (!gameModeEnabled) return

    if (cameraMode === "thirdPerson") {
      // Third-person camera behind and above avatar
      const idealOffset = new THREE.Vector3(
        0,
        AVATAR_CONFIG.CAMERA.HEIGHT,
        AVATAR_CONFIG.CAMERA.DISTANCE
      )

      // Rotate offset by avatar rotation
      idealOffset.applyEuler(avatarRotation)

      // Calculate ideal camera position
      const idealPosition = avatarPosition.clone().add(idealOffset)

      // Smoothly lerp camera to ideal position
      camera.position.lerp(idealPosition, AVATAR_CONFIG.CAMERA.SMOOTHNESS)

      // Look at point slightly above avatar
      const lookAtPoint = avatarPosition.clone()
      lookAtPoint.y += AVATAR_CONFIG.CAMERA.LOOK_AT_HEIGHT

      camera.lookAt(lookAtPoint)

      // Update hybrid store (for other systems that might need camera position)
      setCameraPosition(camera.position.clone())
      setCameraTarget(lookAtPoint)

    } else if (cameraMode === "firstPerson") {
      // First-person camera at avatar eye height
      const eyePosition = avatarPosition.clone()
      eyePosition.y += AVATAR_CONFIG.FIRST_PERSON.EYE_HEIGHT

      // Smoothly move camera to eye position
      camera.position.lerp(eyePosition, AVATAR_CONFIG.CAMERA.SMOOTHNESS)

      // Look in the direction the avatar is facing
      const lookDirection = new THREE.Vector3(0, 0, -1)
      lookDirection.applyEuler(avatarRotation)
      const lookAtPoint = eyePosition.clone().add(lookDirection)

      camera.lookAt(lookAtPoint)

      // Update hybrid store
      setCameraPosition(camera.position.clone())
      setCameraTarget(lookAtPoint)
    }
  })

  return {
    cameraMode,
    isFollowing: gameModeEnabled && (cameraMode === "thirdPerson" || cameraMode === "firstPerson"),
  }
}
