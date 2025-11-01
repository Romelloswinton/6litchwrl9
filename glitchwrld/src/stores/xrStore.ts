// glitchwrld/src/stores/xrStore.ts

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type XRMode = 'desktop' | 'vr' | 'ar'
export type XRQuality = 'high' | 'medium' | 'low'

interface XRState {
  // Mode and session state
  mode: XRMode
  isSessionActive: boolean
  isXRSupported: boolean
  supportsVR: boolean
  supportsAR: boolean

  // Scaling and positioning for AR/VR
  galaxyScale: number
  galaxyPosition: [number, number, number]

  // Performance settings
  quality: XRQuality
  particleMultiplier: number // Multiplier for particle count in XR mode

  // Interaction state
  leftControllerConnected: boolean
  rightControllerConnected: boolean
  handsTracking: boolean

  // AR-specific
  isPlaced: boolean // Has user placed the galaxy in AR?
  planeDetected: boolean

  // Actions
  setMode: (mode: XRMode) => void
  setSessionActive: (active: boolean) => void
  setXRSupported: (vr: boolean, ar: boolean) => void
  setGalaxyScale: (scale: number) => void
  setGalaxyPosition: (position: [number, number, number]) => void
  setQuality: (quality: XRQuality) => void
  setControllerConnected: (side: 'left' | 'right', connected: boolean) => void
  setHandsTracking: (enabled: boolean) => void
  setIsPlaced: (placed: boolean) => void
  setPlaneDetected: (detected: boolean) => void
  resetXRState: () => void
}

const initialState = {
  mode: 'desktop' as XRMode,
  isSessionActive: false,
  isXRSupported: false,
  supportsVR: false,
  supportsAR: false,
  galaxyScale: 1.0,
  galaxyPosition: [0, 0, 0] as [number, number, number],
  quality: 'high' as XRQuality,
  particleMultiplier: 1.0,
  leftControllerConnected: false,
  rightControllerConnected: false,
  handsTracking: false,
  isPlaced: false,
  planeDetected: false,
}

export const useXRStore = create<XRState>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setMode: (mode) => {
      set({ mode })

      // Automatically adjust quality and particle count based on mode
      if (mode === 'vr') {
        set({
          quality: 'medium',
          particleMultiplier: 0.5, // 50% particles in VR
          galaxyScale: 0.3, // Smaller scale for VR
        })
      } else if (mode === 'ar') {
        set({
          quality: 'medium',
          particleMultiplier: 0.3, // 30% particles in AR
          galaxyScale: 0.1, // Much smaller for AR (tabletop scale)
        })
      } else {
        set({
          quality: 'high',
          particleMultiplier: 1.0,
          galaxyScale: 1.0,
        })
      }
    },

    setSessionActive: (active) => set({ isSessionActive: active }),

    setXRSupported: (vr, ar) => set({
      supportsVR: vr,
      supportsAR: ar,
      isXRSupported: vr || ar,
    }),

    setGalaxyScale: (scale) => set({ galaxyScale: scale }),

    setGalaxyPosition: (position) => set({ galaxyPosition: position }),

    setQuality: (quality) => set({ quality }),

    setControllerConnected: (side, connected) => {
      if (side === 'left') {
        set({ leftControllerConnected: connected })
      } else {
        set({ rightControllerConnected: connected })
      }
    },

    setHandsTracking: (enabled) => set({ handsTracking: enabled }),

    setIsPlaced: (placed) => set({ isPlaced: placed }),

    setPlaneDetected: (detected) => set({ planeDetected: detected }),

    resetXRState: () => set(initialState),
  }))
)
