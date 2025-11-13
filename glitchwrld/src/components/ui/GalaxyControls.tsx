import { useControls, folder, Leva } from "leva"
import { useHybridStore } from "../../stores/hybridStore"
import { SplineHelpers } from "../../utils/spline/splineHelpers"

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
    constellations,
    nebulaClouds,
    planets,
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
    setConstellationEnabled,
    setConstellationShowLines,
    setConstellationShowLabels,
    setConstellationLineOpacity,
    setNebulaEnabled,
    setNebulaCloudCount,
    setNebulaOpacity,
    setShowInnerPlanets,
    setShowOuterPlanets,
  } = useHybridStore()

  useControls({
    // Scene Mode
    sceneMode: {
      value: sceneMode,
      label: "Scene Mode",
      options: {
        "Solar System": "solarSystem",
        Galaxy: "galaxy",
      },
      onChange: (value) => setSceneMode(value),
    },

    // Galaxy Settings Folder
    Galaxy: folder({
      particleCount: {
        value: particleCount,
        label: "Particles",
        min: 1000,
        max: 200000,
        step: 1000,
        onChange: (value) => setParticleCount(value),
      },
      galaxyRadius: {
        value: galaxyRadius,
        label: "Radius",
        min: 1,
        max: 20,
        step: 0.1,
        onChange: (value) => setGalaxyRadius(value),
      },
      spiralArms: {
        value: spiralArms,
        label: "Spiral Arms",
        min: 2,
        max: 8,
        step: 1,
        onChange: (value) => setSpiralArms(value),
      },
      spiralTightness: {
        value: spiralTightness,
        label: "Tightness",
        min: 0.5,
        max: 5,
        step: 0.1,
        onChange: (value) => setSpiralTightness(value),
      },
      coreSize: {
        value: coreSize,
        label: "Core Size",
        min: 0.5,
        max: 3,
        step: 0.1,
        onChange: (value) => setCoreSize(value),
      },
    }),

    // Colors Folder
    Colors: folder({
      coreColor: {
        value: coreColor,
        label: "Core",
        onChange: (value) => setCoreColor(value),
      },
      armColor: {
        value: armColor,
        label: "Arms",
        onChange: (value) => setArmColor(value),
      },
      dustColor: {
        value: dustColor,
        label: "Dust",
        onChange: (value) => setDustColor(value),
      },
    }),

    // Effects Folder
    Effects: folder({
      bloomIntensity: {
        value: bloomIntensity,
        label: "Bloom",
        min: 0,
        max: 3,
        step: 0.1,
        onChange: (value) => setBloomIntensity(value),
      },
      rotationSpeed: {
        value: rotationSpeed,
        label: "Rotation Speed",
        min: -0.01,
        max: 0.01,
        step: 0.0001,
        onChange: (value) => setRotationSpeed(value),
      },
      isAnimating: {
        value: isAnimating,
        label: "Animate",
        onChange: (value) => setIsAnimating(value),
      },
    }),

    // Constellations Folder
    Constellations: folder({
      constellationsEnabled: {
        value: constellations.enabled,
        label: "Show",
        onChange: (value) => setConstellationEnabled(value),
      },
      showLines: {
        value: constellations.showLines,
        label: "Lines",
        onChange: (value) => setConstellationShowLines(value),
      },
      showLabels: {
        value: constellations.showLabels,
        label: "Labels",
        onChange: (value) => setConstellationShowLabels(value),
      },
      lineOpacity: {
        value: constellations.lineOpacity,
        label: "Line Opacity",
        min: 0,
        max: 1,
        step: 0.05,
        onChange: (value) => setConstellationLineOpacity(value),
      },
    }),

    // Nebula Folder
    Nebula: folder({
      nebulaEnabled: {
        value: nebulaClouds.enabled,
        label: "Show Clouds",
        onChange: (value) => setNebulaEnabled(value),
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
    }),

    // Planets Folder
    Planets: folder({
      showInnerPlanets: {
        value: planets.showInnerPlanets,
        label: "Inner Planets (M-V-E-M)",
        onChange: (value) => setShowInnerPlanets(value),
      },
      showOuterPlanets: {
        value: planets.showOuterPlanets,
        label: "Outer Planets (J-S-U-N)",
        onChange: (value) => setShowOuterPlanets(value),
      },
    }),

    // Spline Models Folder
    "Spline Models": folder({
      splineScene: {
        value: splineScene || SplineHelpers.DEFAULT_SPLINE_URLS.main,
        label: "Model",
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
    }),
  })

  return <Leva hidden={false} collapsed={false} />
}
