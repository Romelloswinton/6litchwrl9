// src/stores/illusionSlice.ts
import { StateCreator } from "zustand"

export interface IllusionSettings {
  enabled: boolean
  synchronization: number
  gentleMotion: number
  parallaxStrength: number
  cameraParallaxStrength: number
  parallaxSmoothness: number
  depthSeparation: number
  rotationVariation: number
  sizePulsing: boolean
  verticalMotion: number
}

export interface QuantumSettings {
  enabled: boolean
  baseUncertainty: number // baseline positional spread
  observerCoupling: number // how much camera velocity amplifies uncertainty
  collapseOnHover: boolean // pointer "measurement" collapses spread
  collapseRecovery: number // seconds to re-spread after collapse
  entanglementPairs: [number, number][] // indices of paired planets
  interferenceK: number // spatial frequency for sin^2 interference
  decoherence: number // 0..1 how fast interference fades with env sync
}

export const defaultIllusionSettings: IllusionSettings = {
  enabled: true,
  synchronization: 0.8,
  gentleMotion: 0.3,
  parallaxStrength: 0.2,
  cameraParallaxStrength: 0.3,
  parallaxSmoothness: 0.7,
  depthSeparation: 0.5,
  rotationVariation: 0.3,
  sizePulsing: true,
  verticalMotion: 0.4,
}

export const defaultQuantumSettings: QuantumSettings = {
  enabled: true,
  baseUncertainty: 0.06,
  observerCoupling: 0.7,
  collapseOnHover: true,
  collapseRecovery: 2.0,
  entanglementPairs: [
    [0, 1],
    [2, 3],
  ],
  interferenceK: 2.4,
  decoherence: 0.35,
}

export interface IllusionSlice {
  illusionSettings: IllusionSettings
  quantumSettings: QuantumSettings
  setIllusionSettings: (p: Partial<IllusionSettings>) => void
  setQuantumSettings: (p: Partial<QuantumSettings>) => void
}

export const createIllusionSlice: StateCreator<any, [], [], IllusionSlice> = (
  set,
  get
) => ({
  illusionSettings: defaultIllusionSettings,
  quantumSettings: defaultQuantumSettings,
  setIllusionSettings: (p) =>
    set({
      illusionSettings: { ...get().illusionSettings, ...p },
    }),
  setQuantumSettings: (p) =>
    set({
      quantumSettings: { ...get().quantumSettings, ...p },
    }),
})
