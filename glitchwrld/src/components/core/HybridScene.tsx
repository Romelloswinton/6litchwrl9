import { Suspense, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Stars, Stats } from "@react-three/drei"
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing"
import { LayerManager, Layer } from "./LayerManager"
import { BaseGalaxy } from "../galaxy/BaseGalaxy"
import { SplineLayer } from "../spline/SplineLayer"
import { GalaxyControls } from "../GalaxyControls"
import { EnhancedStarfield } from "../EnhancedStarfield"
import { MultiLayerStarfield } from "../MultiLayerStarfield"
import { IllusoryPlanets } from "../IllusoryPlanets"
import { XRGalaxyWrapper } from "../xr/XRGalaxyWrapper"
import { useHybridStore } from "../../stores/hybridStore"
import { useXRStore } from "../../stores/xrStore"
import { SplineHelpers } from "../../utils/spline/splineHelpers"

import { usePerformanceMonitor } from '../../hooks/performance/usePerformanceMonitor'

function PerformanceMonitor() {
  usePerformanceMonitor()
  return null
}

function SceneContent() {
  const { cameraTarget, bloomIntensity, sceneMode } = useHybridStore()
  const { mode: xrMode, particleMultiplier } = useXRStore()

  // Safe fallback for bloomIntensity
  // Reduce bloom in XR modes for performance
  const safeBloomIntensity = xrMode !== 'desktop'
    ? (bloomIntensity ?? 1.0) * 0.5
    : (bloomIntensity ?? 1.0)

  console.log(
    "🎬 HybridScene SceneContent render - sceneMode:",
    sceneMode,
    "xrMode:",
    xrMode,
    "bloomIntensity:",
    bloomIntensity,
    "type:",
    typeof bloomIntensity,
    "safe:",
    safeBloomIntensity,
    "particleMultiplier:",
    particleMultiplier
  )

  const content = (
    <>
      {/* Lighting */}
      <ambientLight intensity={sceneMode === "solarSystem" ? 0.3 : 0.1} />
      <pointLight
        position={[0, 0, 0]}
        intensity={sceneMode === "solarSystem" ? 2.0 : 0.5}
        color="#ffd700"
      />

      {/* Enhanced Starfield with Gravitational Physics */}
      <EnhancedStarfield
        enableGravitationalWaves={true}
        enableOrbitalResonance={true}
        enableDarkMatter={sceneMode === "galaxy"}
        starCount={sceneMode === "solarSystem" ? 10000 : 50000}
      />

      {/* Multi-Layer Starfield with depth perception */}
      <MultiLayerStarfield />

      {/* Base Galaxy Layer (always in background) */}
      <BaseGalaxy />

      {/* Illusory Planets - Rendered in R3F layer for optical illusion */}
      <IllusoryPlanets
        planetCount={8}
        enableGentleRotation={true}
        enableOpticalIllusion={true}
        synchronizeWithStarfield={true}
      />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]}
      />

      {/* Environment */}
      <Environment preset="night" />

      {/* Post-processing Effects - Moved outside Suspense */}
      {safeBloomIntensity > 0 && (
        <EffectComposer multisampling={0} autoClear={true}>
          <Bloom
            intensity={safeBloomIntensity}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.025}
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      )}
    </>
  )

  // Wrap with XRGalaxyWrapper if in XR mode
  return xrMode !== 'desktop' ? (
    <XRGalaxyWrapper>{content}</XRGalaxyWrapper>
  ) : (
    content
  )
}

export function HybridScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { cameraPosition, setIsLoading, setSplineScene } = useHybridStore()

  // Initialize Spline scene URL from helpers
  useEffect(() => {
    if (SplineHelpers.DEFAULT_SPLINE_URLS.main) {
      setSplineScene(SplineHelpers.DEFAULT_SPLINE_URLS.main)
    }
  }, [setSplineScene])

  // WebGL context handlers
  const r3fContextLostHandler = useCallback((event: Event) => {
    console.warn("⚠️ R3F WebGL context lost!", event)
    event.preventDefault()
  }, [])

  const r3fContextRestoredHandler = useCallback((gl: any) => {
    console.log("✅ R3F WebGL context restored!")
    gl.setClearColor(0x000011, 1)
  }, [])

  // Container validation
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      console.log(
        "🖼️ HybridScene container dimensions:",
        offsetWidth,
        offsetHeight
      )

      if (offsetWidth === 0 || offsetHeight === 0) {
        console.warn("⚠️ Container has zero dimensions!")
        return
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hybrid-scene"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#000011",
        overflow: "hidden",
      }}
    >
      <LayerManager>
        {/* BASE LAYER: R3F Galaxy */}
        <Layer type="base">
          <Canvas
            camera={{
              position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              alpha: false,
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl, size }) => {
              console.log(
                "🎨 Base Canvas created:",
                size.width,
                "x",
                size.height
              )

              if (size.width === 0 || size.height === 0) {
                console.error("❌ Base Canvas has zero dimensions!")
                return
              }

              // Add WebGL context handlers
              const canvas = gl.domElement
              if (canvas) {
                canvas.addEventListener(
                  "webglcontextlost",
                  r3fContextLostHandler
                )
                canvas.addEventListener("webglcontextrestored", () =>
                  r3fContextRestoredHandler(gl)
                )
              }

              gl.setClearColor(0x000011, 1) // Dark space background
              setIsLoading(false)
            }}
          >
            <Stats />
            <PerformanceMonitor />
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </Canvas>
        </Layer>

        {/* SPLINE LAYER: Complex Models */}
        <Layer type="spline">
          <SplineLayer />
        </Layer>

        {/* UI LAYER: Controls */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <GalaxyControls />
        </div>
      </LayerManager>
    </div>
  )
}
