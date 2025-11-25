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
export type SceneMode = "galaxy" | "solarSystem" | "earthSpline" | "marsExperience" | "jupiterExperience" | "saturnExperience" | "venusExperience" | "neptuneExperience" | "blackHoleExperience"

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
  enableOrbitControls: boolean

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
  earthSplineUrl: string | null

  // Interaction
  hoveredObject: string | null
  selectedObject: string | null

  // Performance monitoring
  fps: number
  renderTime: number

  // *** NEW: Illusion and Quantum Settings ***
  illusionSettings: IllusionSettings
  quantumSettings: QuantumSettings

  // Constellation settings
  constellations: {
    enabled: boolean
    showLines: boolean
    showLabels: boolean
    filter: 'all' | 'western' | 'eastern' | 'zodiac'
    lineOpacity: number
    scale: number
  }

  // Constellation interaction
  hoveredConstellation: any | null

  // Nebula clouds settings
  nebulaClouds: {
    enabled: boolean
    cloudCount: number
    opacity: number
    preset: 'subtle' | 'normal' | 'dense' | 'spectacular'
  }

  // Planet visibility settings
  planets: {
    showInnerPlanets: boolean  // Mercury, Venus, Earth, Mars
    showOuterPlanets: boolean  // Jupiter, Saturn, Uranus, Neptune
  }

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
  setEnableOrbitControls: (enable: boolean) => void

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
  setEarthSplineUrl: (url: string | null) => void

  // Interaction
  setHoveredObject: (object: string | null) => void
  setSelectedObject: (object: string | null) => void

  // Performance
  updateFPS: (fps: number) => void
  updateRenderTime: (time: number) => void

  // *** NEW: Illusion and Quantum Setters ***
  setIllusionSettings: (p: Partial<IllusionSettings>) => void
  setQuantumSettings: (p: Partial<QuantumSettings>) => void

  // Constellation setters
  setConstellationEnabled: (enabled: boolean) => void
  setConstellationShowLines: (showLines: boolean) => void
  setConstellationShowLabels: (showLabels: boolean) => void
  setConstellationFilter: (filter: 'all' | 'western' | 'eastern' | 'zodiac') => void
  setConstellationLineOpacity: (opacity: number) => void
  setConstellationScale: (scale: number) => void
  setHoveredConstellation: (constellation: any | null) => void

  // Nebula cloud setters
  setNebulaEnabled: (enabled: boolean) => void
  setNebulaCloudCount: (count: number) => void
  setNebulaOpacity: (opacity: number) => void
  setNebulaPreset: (preset: 'subtle' | 'normal' | 'dense' | 'spectacular') => void

  // Planet visibility setters
  setShowInnerPlanets: (show: boolean) => void
  setShowOuterPlanets: (show: boolean) => void

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
  cameraPosition: new THREE.Vector3(0, 30, 70),
  cameraTarget: new THREE.Vector3(0, 0, 0),
  enableOrbitControls: true,
  particleCount: 3000, // Default star count for optimal performance and visuals
  galaxyRadius: 20, // Increased from 8 to properly encompass the solar system
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
  earthSplineUrl: "https://prod.spline.design/2fkyMqdd8Dg45tKq/scene.splinecode",
  hoveredObject: null,
  selectedObject: null,
  fps: 60,
  renderTime: 0,
  // *** NEW: Add default settings to initial state ***
  illusionSettings: defaultIllusionSettings,
  quantumSettings: defaultQuantumSettings,
  constellations: {
    enabled: true,
    showLines: false, // Lines hidden by default, shown on hover
    showLabels: true, // Enable labels by default for better UX
    filter: 'all' as 'all' | 'western' | 'eastern' | 'zodiac',
    lineOpacity: 0.4,
    scale: 3
  },
  hoveredConstellation: null,
  nebulaClouds: {
    enabled: true,
    cloudCount: 20,
    opacity: 0.2, // Dimmed down to focus on planets
    preset: 'subtle' as 'subtle' | 'normal' | 'dense' | 'spectacular'
  },
  planets: {
    showInnerPlanets: true,
    showOuterPlanets: true
  }
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
      set((state) => {
        // Only update if position actually changed to prevent unnecessary re-renders
        if (state.cameraPosition.equals(position)) {
          return state
        }
        return { cameraPosition: position.clone() }
      }),
    setCameraTarget: (target: THREE.Vector3) =>
      set((state) => {
        // Only update if target actually changed to prevent unnecessary re-renders
        if (state.cameraTarget.equals(target)) {
          return state
        }
        return { cameraTarget: target.clone() }
      }),
    setEnableOrbitControls: (enable: boolean) =>
      set({ enableOrbitControls: enable }),

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
    setEarthSplineUrl: (url) => set({ earthSplineUrl: url }),

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

    // Constellation setters
    setConstellationEnabled: (enabled) =>
      set((state) => ({
        constellations: { ...state.constellations, enabled }
      })),
    setConstellationShowLines: (showLines) =>
      set((state) => ({
        constellations: { ...state.constellations, showLines }
      })),
    setConstellationShowLabels: (showLabels) =>
      set((state) => ({
        constellations: { ...state.constellations, showLabels }
      })),
    setConstellationFilter: (filter) =>
      set((state) => ({
        constellations: { ...state.constellations, filter }
      })),
    setConstellationLineOpacity: (lineOpacity) =>
      set((state) => ({
        constellations: { ...state.constellations, lineOpacity }
      })),
    setConstellationScale: (scale) =>
      set((state) => ({
        constellations: { ...state.constellations, scale }
      })),
    setHoveredConstellation: (constellation) =>
      set({ hoveredConstellation: constellation }),

    // Nebula cloud setters
    setNebulaEnabled: (enabled) =>
      set((state) => ({
        nebulaClouds: { ...state.nebulaClouds, enabled }
      })),
    setNebulaCloudCount: (cloudCount) =>
      set((state) => ({
        nebulaClouds: { ...state.nebulaClouds, cloudCount }
      })),
    setNebulaOpacity: (opacity) =>
      set((state) => ({
        nebulaClouds: { ...state.nebulaClouds, opacity }
      })),
    setNebulaPreset: (preset) =>
      set((state) => {
        // Apply preset values
        const presets = {
          subtle: { cloudCount: 20, opacity: 0.3 },
          normal: { cloudCount: 30, opacity: 0.4 },
          dense: { cloudCount: 50, opacity: 0.5 },
          spectacular: { cloudCount: 80, opacity: 0.6 }
        }
        const presetValues = presets[preset]
        return {
          nebulaClouds: { ...state.nebulaClouds, preset, ...presetValues }
        }
      }),

    // Planet visibility setters
    setShowInnerPlanets: (show) =>
      set((state) => ({
        planets: { ...state.planets, showInnerPlanets: show }
      })),
    setShowOuterPlanets: (show) =>
      set((state) => ({
        planets: { ...state.planets, showOuterPlanets: show }
      })),
  }))
)

// Optional: Export the combined state type if needed elsewhere
export type FullHybridState = HybridState
