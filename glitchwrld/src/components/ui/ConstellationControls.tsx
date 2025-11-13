/**
 * Constellation Controls
 *
 * UI controls for constellation layer settings
 */

import { useControls } from "leva"
import { useHybridStore } from "../../stores/hybridStore"
import { useConstellationInfo } from "../starfield/ConstellationLayer"

export function ConstellationControls() {
  const {
    constellations,
    setConstellationEnabled,
    setConstellationShowLines,
    setConstellationShowLabels,
    setConstellationFilter,
    setConstellationLineOpacity,
    setConstellationScale
  } = useHybridStore()

  const constellationInfo = useConstellationInfo()

  useControls("Constellations", {
    enabled: {
      value: constellations.enabled,
      label: "Show Constellations",
      onChange: (value) => setConstellationEnabled(value),
    },

    filter: {
      value: constellations.filter,
      label: "Tradition",
      options: {
        "All Traditions": 'all',
        "Western (Greek/Roman)": 'western',
        "Eastern (Chinese)": 'zodiac',
        "Zodiac": 'zodiac'
      },
      onChange: (value) => setConstellationFilter(value),
    },

    showLines: {
      value: constellations.showLines,
      label: "Show Pattern Lines",
      onChange: (value) => setConstellationShowLines(value),
    },

    lineOpacity: {
      value: constellations.lineOpacity,
      label: "Line Opacity",
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => setConstellationLineOpacity(value),
    },

    scale: {
      value: constellations.scale,
      label: "Constellation Size",
      min: 1,
      max: 10,
      step: 0.5,
      onChange: (value) => setConstellationScale(value),
    },

    showLabels: {
      value: constellations.showLabels,
      label: "Show 3D Labels",
      onChange: (value) => setConstellationShowLabels(value),
    },

    // Info display (read-only)
    info: {
      value: `${constellationInfo.totalConstellations} constellations, ${constellationInfo.totalStars} stars`,
      label: "Loaded",
      editable: false
    }
  })

  return null
}
