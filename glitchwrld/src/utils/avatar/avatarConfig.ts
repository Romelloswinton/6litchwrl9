/**
 * Avatar Configuration Constants
 * Centralized configuration for avatar physics, movement, and visual properties
 */

export const AVATAR_CONFIG = {
  // Movement speeds (units per frame at 60fps)
  WALK_SPEED: 0.15,
  RUN_SPEED: 0.3,
  ROTATION_SPEED: 0.05, // radians per frame when turning

  // Physics
  JUMP_FORCE: 0.5,
  GRAVITY: -0.02,
  MAX_FALL_SPEED: -1.0,
  GROUND_CHECK_DISTANCE: 0.1,

  // Avatar mesh dimensions
  CAPSULE_HEIGHT: 2.0,
  CAPSULE_RADIUS: 0.4,
  HEAD_RADIUS: 0.3,

  // Collision
  COLLISION_RADIUS: 0.5,
  STEP_HEIGHT: 0.5, // How high the avatar can step up

  // Animation thresholds
  WALK_THRESHOLD: 0.01, // Minimum speed to trigger walk animation
  RUN_THRESHOLD: 0.2, // Speed at which walk becomes run animation

  // Camera settings for third-person view
  CAMERA: {
    DISTANCE: 8, // Distance behind avatar
    HEIGHT: 4, // Height above avatar
    LOOK_AT_HEIGHT: 1.5, // Height to look at on avatar
    SMOOTHNESS: 0.1, // Lerp factor for smooth camera follow (0-1)
    MIN_DISTANCE: 3,
    MAX_DISTANCE: 20,
    MIN_POLAR_ANGLE: Math.PI / 6, // 30 degrees
    MAX_POLAR_ANGLE: (Math.PI * 2) / 3, // 120 degrees
  },

  // First-person camera
  FIRST_PERSON: {
    EYE_HEIGHT: 1.7,
    MOUSE_SENSITIVITY: 0.002,
    MIN_PITCH: -Math.PI / 2,
    MAX_PITCH: Math.PI / 2,
  },

  // Visual settings
  VISUAL: {
    BODY_COLOR: "#4a9eff", // Bright blue astronaut
    HEAD_COLOR: "#6bb6ff", // Lighter blue for helmet
    VISOR_COLOR: "#1a4d80", // Dark blue for visor
    EMISSIVE_COLOR: "#2060a0",
    EMISSIVE_INTENSITY: 0.3,
    TRAIL_COLOR: "#4a9eff",
    TRAIL_OPACITY: 0.5,
  },

  // Input key bindings
  KEYS: {
    // Movement
    FORWARD_ARROW: "ArrowUp",
    BACKWARD_ARROW: "ArrowDown",
    LEFT_ARROW: "ArrowLeft",
    RIGHT_ARROW: "ArrowRight",
    FORWARD_WASD: "w",
    BACKWARD_WASD: "s",
    LEFT_WASD: "a",
    RIGHT_WASD: "d",

    // Actions
    JUMP: " ", // Spacebar
    SPRINT: "Shift",
    INTERACT: "e",

    // Camera
    TOGGLE_CAMERA: "c",
    TOGGLE_GAME_MODE: "g",
  },

  // Spawn position
  SPAWN_POSITION: {
    x: 0,
    y: 2,
    z: 0,
  },
} as const

// Helper to check if a key is a movement key
export function isMovementKey(key: string): boolean {
  return [
    AVATAR_CONFIG.KEYS.FORWARD_ARROW,
    AVATAR_CONFIG.KEYS.BACKWARD_ARROW,
    AVATAR_CONFIG.KEYS.LEFT_ARROW,
    AVATAR_CONFIG.KEYS.RIGHT_ARROW,
    AVATAR_CONFIG.KEYS.FORWARD_WASD,
    AVATAR_CONFIG.KEYS.BACKWARD_WASD,
    AVATAR_CONFIG.KEYS.LEFT_WASD,
    AVATAR_CONFIG.KEYS.RIGHT_WASD,
  ].includes(key)
}

// Helper to check if key is forward movement
export function isForwardKey(key: string): boolean {
  return [
    AVATAR_CONFIG.KEYS.FORWARD_ARROW,
    AVATAR_CONFIG.KEYS.FORWARD_WASD,
  ].includes(key)
}

// Helper to check if key is backward movement
export function isBackwardKey(key: string): boolean {
  return [
    AVATAR_CONFIG.KEYS.BACKWARD_ARROW,
    AVATAR_CONFIG.KEYS.BACKWARD_WASD,
  ].includes(key)
}

// Helper to check if key is left movement
export function isLeftKey(key: string): boolean {
  return [
    AVATAR_CONFIG.KEYS.LEFT_ARROW,
    AVATAR_CONFIG.KEYS.LEFT_WASD,
  ].includes(key)
}

// Helper to check if key is right movement
export function isRightKey(key: string): boolean {
  return [
    AVATAR_CONFIG.KEYS.RIGHT_ARROW,
    AVATAR_CONFIG.KEYS.RIGHT_WASD,
  ].includes(key)
}
