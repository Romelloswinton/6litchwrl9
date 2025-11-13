/**
 * Nebula Controls
 *
 * UI controls for nebula cloud settings
 */

import { useControls } from "leva"
import { useHybridStore } from "../../stores/hybridStore"

export function NebulaControls() {
  const {
    nebulaClouds,
    setNebulaEnabled,
    setNebulaCloudCount,
    setNebulaOpacity,
    setNebulaPreset
  } = useHybridStore()

  useControls("Nebula Clouds", {
    enabled: {
      value: nebulaClouds.enabled,
      label: "Show Nebula Clouds",
      onChange: (value) => setNebulaEnabled(value),
    },

    preset: {
      value: nebulaClouds.preset,
      label: "Preset",
      options: {
        "Subtle": 'subtle',
        "Normal": 'normal',
        "Dense": 'dense',
        "Spectacular": 'spectacular'
      },
      onChange: (value) => setNebulaPreset(value as 'subtle' | 'normal' | 'dense' | 'spectacular'),
    },

    cloudCount: {
      value: nebulaClouds.cloudCount,
      label: "Cloud Count",
      min: 10,
      max: 100,
      step: 5,
      onChange: (value) => setNebulaCloudCount(value),
    },

    opacity: {
      value: nebulaClouds.opacity,
      label: "Opacity",
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => setNebulaOpacity(value),
    },

    info: {
      value: "Volumetric clouds with galaxy colors",
      label: "Description",
      editable: false
    }
  })

  return null
}
