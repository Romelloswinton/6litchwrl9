import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import * as THREE from "three"

// Import types and defaults from the illusion slice definition
import {
  IllusionSettings,
  QuantumSettings,
  defaultIllusionSettings,
  defaultQuantumSettings,
} from "./illusionSlice" // Assuming illusionSlice.ts is in the same directory

// --- Existing Types ---
export type LayerType =
  | "base"
  | "spline"
  | "effects"
  | "starfield-distant"
  | "starfield-mid"
  | "starfield-near"
  | "starfield-close"
  | "starfield-foreground"
export type SceneMode = "galaxy" | "solarSystem"

interface LayerConfig {
  visible: boolean
  opacity: number
  zIndex: number
  blendMode: "normal" | "additive" | "multiply"
}

// --- Updated HybridState Interface ---
interface HybridState {
  // Scene coordination
  sceneMode: SceneMode
  isLoading: boolean

  // Layer management
  layers: Record<LayerType, LayerConfig>

  // Camera controls (unified)
  cameraPosition: THREE.Vector3
  cameraTarget: THREE.Vector3

  // Galaxy properties (base layer)
  particleCount: number
  galaxyRadius: number
  spiralArms: number
  spiralTightness: number
  coreSize: number

  // Colors and effects
  coreColor: string
  armColor: string
  dustColor: string
  bloomIntensity: number

  // Animation
  rotationSpeed: number
  isAnimating: boolean

  // Spline integration
  splineScene: string | null
  splineModels: Record<string, any>

  // Interaction
  hoveredObject: string | null
  selectedObject: string | null

  // Performance monitoring
  fps: number
  renderTime: number

  // *** NEW: Illusion and Quantum Settings ***
  illusionSettings: IllusionSettings
  quantumSettings: QuantumSettings

  // Actions
  setSceneMode: (mode: SceneMode) => void
  setIsLoading: (loading: boolean) => void

  // Layer controls
  setLayerVisible: (layer: LayerType, visible: boolean) => void
  setLayerOpacity: (layer: LayerType, opacity: number) => void
  setLayerBlendMode: (layer: LayerType, mode: LayerConfig["blendMode"]) => void

  // Camera
  setCameraPosition: (position: THREE.Vector3) => void
  setCameraTarget: (target: THREE.Vector3) => void

  // Galaxy
  setParticleCount: (count: number) => void
  setGalaxyRadius: (radius: number) => void
  setSpiralArms: (arms: number) => void
  setSpiralTightness: (tightness: number) => void
  setCoreSize: (size: number) => void
  setCoreColor: (color: string) => void
  setArmColor: (color: string) => void
  setDustColor: (color: string) => void
  setBloomIntensity: (intensity: number) => void
  setRotationSpeed: (speed: number) => void
  setIsAnimating: (animating: boolean) => void

  // Spline
  setSplineScene: (scene: string | null) => void
  registerSplineModel: (id: string, model: any) => void
  unregisterSplineModel: (id: string) => void

  // Interaction
  setHoveredObject: (object: string | null) => void
  setSelectedObject: (object: string | null) => void

  // Performance
  updateFPS: (fps: number) => void
  updateRenderTime: (time: number) => void

  // *** NEW: Illusion and Quantum Setters ***
  setIllusionSettings: (p: Partial<IllusionSettings>) => void
  setQuantumSettings: (p: Partial<QuantumSettings>) => void

  // Utilities
  resetScene: () => void
}

// --- Existing Initial Layer Config ---
const initialLayerConfig: LayerConfig = {
  visible: true,
  opacity: 1.0,
  zIndex: 0,
  blendMode: "normal",
}

// --- Updated Initial State ---
const initialState = {
  sceneMode: "galaxy" as SceneMode,
  isLoading: false,
  layers: {
    base: { ...initialLayerConfig, zIndex: 1 },
    spline: { ...initialLayerConfig, zIndex: 5, opacity: 0.8 },
    effects: { ...initialLayerConfig, zIndex: 6 },
    "starfield-distant": {
      ...initialLayerConfig,
      zIndex: 0,
      opacity: 0.6,
      blendMode: "additive" as const,
    },
    "starfield-mid": {
      ...initialLayerConfig,
      zIndex: 2,
      opacity: 0.7,
      blendMode: "additive" as const,
    },
    "starfield-near": {
      ...initialLayerConfig,
      zIndex: 4,
      opacity: 0.9,
      blendMode: "additive" as const,
    },
    "starfield-close": {
      ...initialLayerConfig,
      zIndex: 7,
      opacity: 0.8,
      blendMode: "additive" as const,
    },
    "starfield-foreground": {
      ...initialLayerConfig,
      zIndex: 8,
      opacity: 0.4,
      blendMode: "additive" as const,
    },
  },
  cameraPosition: new THREE.Vector3(0, 10, 15),
  cameraTarget: new THREE.Vector3(0, 0, 0),
  particleCount: 100000,
  galaxyRadius: 8,
  spiralArms: 4,
  spiralTightness: 2,
  coreSize: 1.5,
  coreColor: "#ffd700",
  armColor: "#87ceeb",
  dustColor: "#8b4513",
  bloomIntensity: 1.0,
  rotationSpeed: 0.001,
  isAnimating: true,
  splineScene: null,
  splineModels: {},
  hoveredObject: null,
  selectedObject: null,
  fps: 60,
  renderTime: 0,
  // *** NEW: Add default settings to initial state ***
  illusionSettings: defaultIllusionSettings,
  quantumSettings: defaultQuantumSettings,
}

// --- Updated Store Creation ---
export const useHybridStore = create<HybridState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // --- Existing Setters ---
    setSceneMode: (mode) => set({ sceneMode: mode }),
    setIsLoading: (loading) => set({ isLoading: loading }),

    setLayerVisible: (layer, visible) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [layer]: { ...state.layers[layer], visible },
        },
      })),
    setLayerOpacity: (layer, opacity) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [layer]: {
            ...state.layers[layer],
            opacity: Math.max(0, Math.min(1, opacity)), // Clamped opacity
          },
        },
      })),
    setLayerBlendMode: (layer, blendMode) =>
      set((state) => ({
        layers: {
          ...state.layers,
          [layer]: { ...state.layers[layer], blendMode },
        },
      })),

    setCameraPosition: (position: THREE.Vector3) =>
      set({ cameraPosition: position.clone() }),
    setCameraTarget: (target: THREE.Vector3) =>
      set({ cameraTarget: target.clone() }),

    setParticleCount: (count) => set({ particleCount: count }),
    setGalaxyRadius: (radius) => set({ galaxyRadius: radius }),
    setSpiralArms: (arms) => set({ spiralArms: arms }),
    setSpiralTightness: (tightness) => set({ spiralTightness: tightness }),
    setCoreSize: (size) => set({ coreSize: size }),
    setCoreColor: (color) => set({ coreColor: color }),
    setArmColor: (color) => set({ armColor: color }),
    setDustColor: (color) => set({ dustColor: color }),
    setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
    setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
    setIsAnimating: (animating) => set({ isAnimating: animating }),

    setSplineScene: (scene) => set({ splineScene: scene }),
    registerSplineModel: (id, model) =>
      set((state) => ({
        splineModels: { ...state.splineModels, [id]: model },
      })),
    unregisterSplineModel: (id) =>
      set((state) => {
        const { [id]: removed, ...rest } = state.splineModels
        return { splineModels: rest }
      }),

    setHoveredObject: (object) => set({ hoveredObject: object }),
    setSelectedObject: (object) => set({ selectedObject: object }),

    updateFPS: (fps) => set({ fps }),
    updateRenderTime: (time) => set({ renderTime: time }),

    resetScene: () =>
      set({
        ...initialState,
        cameraPosition: initialState.cameraPosition.clone(),
        cameraTarget: initialState.cameraTarget.clone(),
        // *** Ensure illusion/quantum settings are also reset if needed ***
        // (They are part of initialState, so they will reset automatically here)
      }),

    // *** NEW: Add setters for Illusion and Quantum settings ***
    setIllusionSettings: (p) =>
      set((state) => ({
        illusionSettings: { ...state.illusionSettings, ...p },
      })),
    setQuantumSettings: (p) =>
      set((state) => ({
        quantumSettings: { ...state.quantumSettings, ...p },
      })),
  }))
)

// Optional: Export the combined state type if needed elsewhere
export type FullHybridState = HybridState
