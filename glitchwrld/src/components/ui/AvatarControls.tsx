import { useControls, folder } from "leva"
import { useAvatarStore } from "../../stores/avatarStore"
import { useEffect } from "react"

/**
 * Avatar Controls Component
 * Provides Leva UI panel for controlling avatar and game mode settings
 */
export function AvatarControls() {
  const {
    gameModeEnabled,
    cameraMode,
    moveSpeed,
    sprintSpeed,
    jumpForce,
    gravity,
    cameraDistance,
    cameraHeight,
    cameraSmoothness,
    setGameModeEnabled,
    setCameraMode,
  } = useAvatarStore()

  // Create Leva controls
  const controls = useControls("Avatar & Game Mode", {
    // --- Game Mode Section ---
    "Game Mode": folder({
      gameModeEnabled: {
        value: gameModeEnabled,
        label: "Enable Game Mode",
        hint: "Press G to toggle",
      },
      cameraMode: {
        value: cameraMode,
        options: {
          "Orbit (Free Cam)": "orbit",
          "Third Person": "thirdPerson",
          "First Person": "firstPerson",
        },
        label: "Camera Mode",
        hint: "Press C to cycle",
      },
    }),

    // --- Movement Settings ---
    "Movement": folder({
      moveSpeed: {
        value: moveSpeed,
        min: 0.05,
        max: 0.5,
        step: 0.05,
        label: "Walk Speed",
      },
      sprintSpeed: {
        value: sprintSpeed,
        min: 0.1,
        max: 1.0,
        step: 0.05,
        label: "Sprint Speed",
      },
      jumpForce: {
        value: jumpForce,
        min: 0.1,
        max: 1.5,
        step: 0.1,
        label: "Jump Force",
      },
      gravity: {
        value: gravity,
        min: -0.1,
        max: -0.005,
        step: 0.005,
        label: "Gravity",
      },
    }),

    // --- Camera Settings ---
    "Camera Follow": folder({
      cameraDistance: {
        value: cameraDistance,
        min: 3,
        max: 20,
        step: 0.5,
        label: "Distance",
        hint: "Third-person camera distance",
      },
      cameraHeight: {
        value: cameraHeight,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Height",
        hint: "Third-person camera height",
      },
      cameraSmoothness: {
        value: cameraSmoothness,
        min: 0.01,
        max: 0.5,
        step: 0.01,
        label: "Smoothness",
        hint: "Camera follow damping",
      },
    }),

    // --- Controls Reference ---
    "Controls": folder({
      controls: {
        value: "Arrow Keys or WASD: Move\nShift: Sprint\nSpace: Jump\nG: Toggle Game Mode\nC: Cycle Camera",
        label: "Keyboard Controls",
        editable: false,
        rows: 5,
      },
    }),
  })

  // Sync control values to store
  useEffect(() => {
    setGameModeEnabled(controls.gameModeEnabled)
  }, [controls.gameModeEnabled, setGameModeEnabled])

  useEffect(() => {
    setCameraMode(controls.cameraMode as "orbit" | "thirdPerson" | "firstPerson")
  }, [controls.cameraMode, setCameraMode])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle game mode with G key
      if (e.key === "g" || e.key === "G") {
        setGameModeEnabled(!gameModeEnabled)
      }

      // Cycle camera mode with C key
      if (e.key === "c" || e.key === "C") {
        if (cameraMode === "orbit") {
          setCameraMode("thirdPerson")
        } else if (cameraMode === "thirdPerson") {
          setCameraMode("firstPerson")
        } else {
          setCameraMode("orbit")
        }
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [gameModeEnabled, cameraMode, setGameModeEnabled, setCameraMode])

  return null // Leva controls are rendered separately
}
