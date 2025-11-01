import { useControls, button } from "leva"
import { useHybridStore } from "../stores/hybridStore"
import { LayerControls } from "./ui/LayerControls"
import { SplineSoundControls } from "./ui/SplineSoundControls/SplineSoundControls"
import { OpticalIllusionControls } from "./ui/OpticalIllusionControls/OpticalIllusionControls"
import { SplineFocusControls } from "./ui/SplineFocusControls/SplineFocusControls"
import { SplineHelpers } from "../utils/spline/splineHelpers"

export function GalaxyControls() {
  const {
    particleCount,
    galaxyRadius,
    spiralArms,
    spiralTightness,
    coreSize,
    coreColor,
    armColor,
    dustColor,
    bloomIntensity,
    rotationSpeed,
    isAnimating,
    splineScene,
    sceneMode,
    layers,
    setParticleCount,
    setGalaxyRadius,
    setSpiralArms,
    setSpiralTightness,
    setCoreSize,
    setCoreColor,
    setArmColor,
    setDustColor,
    setBloomIntensity,
    setRotationSpeed,
    setIsAnimating,
    setSplineScene,
    setSceneMode,
    resetScene,
    setLayerVisible,
  } = useHybridStore()

  const controls = useControls("Galaxy Controls", {
    // Scene Mode
    sceneMode: {
      value: sceneMode,
      options: {
        "Solar System": "solarSystem",
        Galaxy: "galaxy",
      },
      onChange: (value) => setSceneMode(value),
    },

    // Galaxy Structure
    particleCount: {
      value: particleCount,
      min: 1000,
      max: 200000,
      step: 1000,
      onChange: (value) => setParticleCount(value),
    },
    galaxyRadius: {
      value: galaxyRadius,
      min: 1,
      max: 20,
      step: 0.1,
      onChange: (value) => setGalaxyRadius(value),
    },
    spiralArms: {
      value: spiralArms,
      min: 2,
      max: 8,
      step: 1,
      onChange: (value) => setSpiralArms(value),
    },
    spiralTightness: {
      value: spiralTightness,
      min: 0.5,
      max: 5,
      step: 0.1,
      onChange: (value) => setSpiralTightness(value),
    },
    coreSize: {
      value: coreSize,
      min: 0.5,
      max: 3,
      step: 0.1,
      onChange: (value) => setCoreSize(value),
    },

    // Colors
    coreColor: {
      value: coreColor,
      onChange: (value) => setCoreColor(value),
    },
    armColor: {
      value: armColor,
      onChange: (value) => setArmColor(value),
    },
    dustColor: {
      value: dustColor,
      onChange: (value) => setDustColor(value),
    },

    // Effects - CRITICAL FIX
    bloomIntensity: {
      value: bloomIntensity,
      min: 0,
      max: 3,
      step: 0.1,
      onChange: (value) => setBloomIntensity(value),
    },

    // Animation
    rotationSpeed: {
      value: rotationSpeed,
      min: -0.01,
      max: 0.01,
      step: 0.0001,
      onChange: (value) => setRotationSpeed(value),
    },
    isAnimating: {
      value: isAnimating,
      onChange: (value) => setIsAnimating(value),
    },

    // Spline Models
    splineScene: {
      value: splineScene || SplineHelpers.DEFAULT_SPLINE_URLS.main,
      options: {
        None: null,
        "Main Scene": SplineHelpers.DEFAULT_SPLINE_URLS.main,
        Spaceship: SplineHelpers.DEFAULT_SPLINE_URLS.spaceship,
        Asteroid: SplineHelpers.DEFAULT_SPLINE_URLS.asteroid,
        Nebula: SplineHelpers.DEFAULT_SPLINE_URLS.nebula,
        Planet: SplineHelpers.DEFAULT_SPLINE_URLS.planet,
      },
      onChange: (value) => setSplineScene(value),
    },

    // Actions
    resetScene: button(() => resetScene()),
    toggleSpline: button(() => {
      setLayerVisible("spline", !layers.spline.visible)
    }),
  })

  // Remove ALL useEffect hooks - they're causing the race condition

  return (
    <>
      <LayerControls />
      <SplineFocusControls />
      <OpticalIllusionControls />
      <SplineSoundControls />
    </>
  )
}
