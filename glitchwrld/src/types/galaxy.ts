import * as THREE from 'three'

export interface GalaxyParticle {
  position: THREE.Vector3
  color: THREE.Color
  size: number
  velocity: THREE.Vector3
  age: number
}

export interface SpiralArmConfig {
  armIndex: number
  particleCount: number
  startAngle: number
  tightness: number
  width: number
}

export interface GalaxyConfig {
  particleCount: number
  radius: number
  spiralArms: number
  spiralTightness: number
  coreSize: number
  coreColor: string
  armColor: string
  dustColor: string
}

export interface SplineModelConfig {
  url: string
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  name: string
  interactive?: boolean
}

export type CameraPreset = {
  name: string
  position: THREE.Vector3
  target: THREE.Vector3
  fov?: number
}

export type AnimationMode = 'orbit' | 'flythrough' | 'static' | 'custom'

export interface IllusoryPlanetData {
  name: string
  originalPosition: THREE.Vector3 // Base position for reference
  size: number
  color: THREE.Color
  glowColor: THREE.Color
  mass: number
  orbitalRadius: number
  orbitalSpeed: number
  rotationSpeed: number
  phase: number // Orbital phase offset
  armIndex: number
}

export interface StarfieldLayer {
  name: string
  layerType: 'starfield-distant' | 'starfield-mid' | 'starfield-near' | 'starfield-close' | 'starfield-foreground'
  depthRange: [number, number] // [min, max] distance from center
  starCount: number
  starSizeRange: [number, number] // [min, max] star size
  parallaxStrength: number // How much this layer responds to camera movement
  rotationSpeed: number // Independent rotation speed
  color: THREE.Color
  brightness: number
}

// XR-specific types
export interface XRInteractionConfig {
  grabEnabled: boolean
  teleportEnabled: boolean
  scalingEnabled: boolean
  planetSelectionEnabled: boolean
  rotationEnabled: boolean
}

export type XRControllerMode = 'pointer' | 'grab' | 'teleport'

export interface XRGestureState {
  isGrabbing: boolean
  isPinching: boolean
  isTeleporting: boolean
  grabDistance: number
  pinchDistance: number
}

export interface ARPlacementConfig {
  minScale: number
  maxScale: number
  defaultScale: number
  snapToGrid: boolean
  showReticle: boolean
  requirePlaneDetection: boolean
}