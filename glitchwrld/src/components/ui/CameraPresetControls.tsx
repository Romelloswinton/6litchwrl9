// glitchwrld/src/components/ui/CameraPresetControls.tsx

import { useControls, folder, button } from 'leva'
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'
import {
  CameraPresets,
  getAllCameraPresets,
  getCameraCategories,
  addCameraPreset,
} from '../../utils/camera/cameraPresets'

/**
 * Leva-based UI controls for camera presets
 */
export function CameraPresetControls() {
  const { applyPresetInstant, applyPresetAnimated, saveCurrentAsPreset } =
    useCameraPresets()

  const categories = getCameraCategories()

  // Main camera controls
  useControls('Camera Presets', {
    Info: {
      value: `${getAllCameraPresets().length} presets available`,
      disabled: true,
    },
    'Animation Duration': {
      value: 2000,
      min: 500,
      max: 5000,
      step: 100,
    },
    Actions: folder({
      'Save Current View': button(() => {
        const timestamp = Date.now()
        const preset = saveCurrentAsPreset(
          `custom-${timestamp}`,
          `Custom View ${new Date().toLocaleTimeString()}`,
          'User-saved camera position'
        )
        addCameraPreset(preset)
        console.log('💾 Saved current camera view')
      }),
      'Export Presets': button(() => {
        const json = CameraPresets.exportPresets()
        console.log('📋 Camera Presets:', json)
        if (navigator.clipboard) {
          navigator.clipboard.writeText(json)
          console.log('✅ Copied to clipboard')
        }
      }),
    }),
  })

  // Overview category
  if (categories['Overview'].length > 0) {
    const overviewControls = categories['Overview'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Overview', overviewControls)
  }

  // Close-up category
  if (categories['Close-up'].length > 0) {
    const closeupControls = categories['Close-up'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Close-up', closeupControls)
  }

  // Solar System category
  if (categories['Solar System'].length > 0) {
    const solarControls = categories['Solar System'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Solar System', solarControls)
  }

  // Cinematic category
  if (categories['Cinematic'].length > 0) {
    const cinematicControls = categories['Cinematic'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Cinematic', cinematicControls)
  }

  // Model Focus category
  if (categories['Model Focus'].length > 0) {
    const modelControls = categories['Model Focus'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Model Focus', modelControls)
  }

  // Exploration category
  if (categories['Exploration'].length > 0) {
    const exploreControls = categories['Exploration'].reduce((acc, preset) => {
      acc[preset.name] = folder({
        Apply: button(() => applyPresetInstant(preset.id)),
        'Apply (Animated)': button(() => applyPresetAnimated(preset.id)),
        Description: {
          value: preset.description || 'No description',
          disabled: true,
        },
      })
      return acc
    }, {} as Record<string, any>)

    useControls('Camera: Exploration', exploreControls)
  }

  return null
}

/**
 * Compact camera preset controls (simplified for mobile)
 */
export function CompactCameraPresetControls() {
  const { applyPresetAnimated } = useCameraPresets()

  const presets = getAllCameraPresets()
  const quickPresets = presets.slice(0, 6) // Show only first 6 presets

  const controls = quickPresets.reduce((acc, preset) => {
    acc[preset.name] = button(() => applyPresetAnimated(preset.id, 1500))
    return acc
  }, {} as Record<string, any>)

  useControls('Quick Camera', controls)

  return null
}

/**
 * Camera preset buttons for specific use cases
 */
export function QuickCameraButtons() {
  const { applyPresetAnimated } = useCameraPresets()

  useControls('Quick Views', {
    'Wide View': button(() => applyPresetAnimated('overview-wide', 1500)),
    'Top Down': button(() => applyPresetAnimated('overview-top', 1500)),
    'Galaxy Core': button(() => applyPresetAnimated('closeup-center', 1500)),
    'Solar System': button(() => applyPresetAnimated('solar-overview', 1500)),
    'Cinematic': button(() => applyPresetAnimated('cinematic-orbit', 2000)),
  })

  return null
}
