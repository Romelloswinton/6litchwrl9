import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import * as THREE from "three"

// --- Avatar Types ---
export type CameraMode = "orbit" | "thirdPerson" | "firstPerson"
export type AvatarAnimationState = "idle" | "walking" | "running" | "jumping" | "falling"
export type ControlScheme = "arrows" | "wasd" | "both"

// --- Avatar State Interface ---
export interface AvatarState {
  // Game Mode Control
  gameModeEnabled: boolean
  cameraMode: CameraMode

  // Avatar Physics & Transform
  position: THREE.Vector3
  rotation: THREE.Euler
  velocity: THREE.Vector3

  // Movement State
  isMoving: boolean
  isJumping: boolean
  isFalling: boolean
  isGrounded: boolean
  animationState: AvatarAnimationState

  // Movement Configuration
  moveSpeed: number
  sprintSpeed: number
  jumpForce: number
  gravity: number
  rotationSpeed: number
  isSprinting: boolean

  // Input State
  controlScheme: ControlScheme
  inputState: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    jump: boolean
    sprint: boolean
    interact: boolean
  }

  // Camera Follow Settings (for third-person)
  cameraDistance: number
  cameraHeight: number
  cameraLookAtHeight: number
  cameraSmoothness: number

  // Actions
  setGameModeEnabled: (enabled: boolean) => void
  setCameraMode: (mode: CameraMode) => void
  setPosition: (position: THREE.Vector3) => void
  setRotation: (rotation: THREE.Euler) => void
  setVelocity: (velocity: THREE.Vector3) => void
  setAnimationState: (state: AvatarAnimationState) => void
  setIsMoving: (moving: boolean) => void
  setIsJumping: (jumping: boolean) => void
  setIsFalling: (falling: boolean) => void
  setIsGrounded: (grounded: boolean) => void
  setIsSprinting: (sprinting: boolean) => void
  updateInputState: (key: keyof AvatarState["inputState"], value: boolean) => void
  updatePosition: (delta: THREE.Vector3) => void
  resetAvatar: () => void
}

// --- Initial State ---
const initialState = {
  gameModeEnabled: false,
  cameraMode: "orbit" as CameraMode,
  position: new THREE.Vector3(0, 2, 0),
  rotation: new THREE.Euler(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  isMoving: false,
  isJumping: false,
  isFalling: false,
  isGrounded: true,
  animationState: "idle" as AvatarAnimationState,
  moveSpeed: 0.15,
  sprintSpeed: 0.3,
  jumpForce: 0.5,
  gravity: -0.02,
  rotationSpeed: 0.05,
  isSprinting: false,
  controlScheme: "both" as ControlScheme,
  inputState: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    interact: false,
  },
  cameraDistance: 8,
  cameraHeight: 4,
  cameraLookAtHeight: 1.5,
  cameraSmoothness: 0.1,
}

// --- Store Creation ---
export const useAvatarStore = create<AvatarState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // --- Action Implementations ---
    setGameModeEnabled: (enabled: boolean) => {
      set({ gameModeEnabled: enabled })
      // When enabling game mode, default to third-person camera
      if (enabled && get().cameraMode === "orbit") {
        set({ cameraMode: "thirdPerson" })
      }
      // When disabling game mode, return to orbit
      if (!enabled) {
        set({ cameraMode: "orbit" })
      }
    },

    setCameraMode: (mode: CameraMode) => set({ cameraMode: mode }),

    setPosition: (position: THREE.Vector3) =>
      set((state) => {
        if (state.position.equals(position)) {
          return state
        }
        return { position: position.clone() }
      }),

    setRotation: (rotation: THREE.Euler) =>
      set({ rotation: rotation.clone() }),

    setVelocity: (velocity: THREE.Vector3) =>
      set({ velocity: velocity.clone() }),

    setAnimationState: (animationState: AvatarAnimationState) =>
      set({ animationState }),

    setIsMoving: (isMoving: boolean) => set({ isMoving }),
    setIsJumping: (isJumping: boolean) => set({ isJumping }),
    setIsFalling: (isFalling: boolean) => set({ isFalling }),
    setIsGrounded: (isGrounded: boolean) => set({ isGrounded }),
    setIsSprinting: (isSprinting: boolean) => set({ isSprinting }),

    updateInputState: (key, value) =>
      set((state) => ({
        inputState: { ...state.inputState, [key]: value },
      })),

    updatePosition: (delta: THREE.Vector3) =>
      set((state) => ({
        position: state.position.clone().add(delta),
      })),

    resetAvatar: () =>
      set({
        ...initialState,
        position: initialState.position.clone(),
        rotation: initialState.rotation.clone(),
        velocity: initialState.velocity.clone(),
      }),
  }))
)
