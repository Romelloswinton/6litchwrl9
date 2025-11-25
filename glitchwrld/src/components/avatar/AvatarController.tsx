import { Avatar } from "./Avatar"
import { useAvatarMovement } from "../../hooks/avatar/useAvatarMovement"
import { useCameraFollow } from "../../hooks/avatar/useCameraFollow"
import { useAvatarStore } from "../../stores/avatarStore"

/**
 * AvatarController Component
 * Wrapper component that manages avatar rendering, movement, and camera control
 * Only renders when game mode is enabled
 */
export function AvatarController() {
  const gameModeEnabled = useAvatarStore((state) => state.gameModeEnabled)

  // Initialize movement hook (handles input and physics)
  useAvatarMovement()

  // Initialize camera follow hook (handles camera positioning)
  useCameraFollow()

  // Only render avatar when game mode is active
  if (!gameModeEnabled) {
    return null
  }

  return <Avatar />
}
