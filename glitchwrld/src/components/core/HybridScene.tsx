import { Suspense, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats } from "@react-three/drei"
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing"
import { LayerManager, Layer } from "./LayerManager"
import { AccurateSolarSystem } from "../spline/AccurateSolarSystem"
import { GalaxyControls } from "../ui/GalaxyControls"
import { KeyboardHelp } from "../ui/KeyboardHelp"
import { ConstellationInfoPanel } from "../ui/ConstellationInfoPanel"
import { PlanetaryAlignmentInfo } from "../ui/PlanetaryAlignmentInfo"
import { MultiLayerStarfield } from "../starfield/MultiLayerStarfield"
import { ConstellationLayer } from "../starfield/ConstellationLayer"
import { GalaxyNebulaClouds } from "../effects/GalaxyNebulaClouds"
import { useHybridStore } from "../../stores/hybridStore"
import { useXRStore } from "../../stores/xrStore"
import { XR } from "@react-three/xr"
import { xrStore } from "../xr/XRModeSwitcher"

import { usePerformanceMonitor } from "../../hooks/performance/usePerformanceMonitor"
import { useKeyboardControls } from "../../hooks/camera/useKeyboardControls"

function PerformanceMonitor() {
  usePerformanceMonitor()
  return null
}

function KeyboardControls() {
  useKeyboardControls()
  return null
}

function SceneContent() {
  const {
    cameraTarget,
    bloomIntensity,
    sceneMode,
    enableOrbitControls,
    constellations,
    nebulaClouds
  } = useHybridStore()
  const { mode: xrMode, particleMultiplier } = useXRStore()

  // Safe fallback for bloomIntensity
  // Reduce bloom in XR modes for performance
  const safeBloomIntensity =
    xrMode !== "desktop" ? (bloomIntensity ?? 1.0) * 0.5 : bloomIntensity ?? 1.0

  return (
    <XR store={xrStore}>
      {/* Keyboard Controls - Only active in desktop mode */}
      {xrMode === 'desktop' && <KeyboardControls />}

      {/* Unified Lighting - Optimized for space atmosphere */}
      <ambientLight intensity={0.15} color="#87ceeb" />
      <pointLight
        position={[0, 0, 0]}
        intensity={2.5}
        distance={250}
        decay={1.8}
        color="#FFF8DC"
      />
      <directionalLight
        intensity={0.4}
        position={[15, 12, 10]}
        color="#ffffff"
      />
      {/* Subtle rim lighting for depth */}
      <pointLight
        position={[-20, 5, -20]}
        intensity={0.8}
        distance={150}
        decay={2}
        color="#4169e1"
      />

      {/* Multi-Layer Starfield - Single unified starfield with depth */}
      <MultiLayerStarfield />

      {/* Constellation Layer - Western and Eastern mythology */}
      {constellations.enabled && (
        <ConstellationLayer
          showLines={constellations.showLines}
          showLabels={constellations.showLabels}
          scale={constellations.scale}
          filter={constellations.filter}
          lineOpacity={constellations.lineOpacity}
          animate={true}
        />
      )}

      {/* Galaxy Nebula Clouds - Volumetric depth with galaxy colors */}
      {nebulaClouds.enabled && (
        <GalaxyNebulaClouds
          cloudCount={nebulaClouds.cloudCount}
          opacity={nebulaClouds.opacity}
          animate={true}
        />
      )}

      {/* Accurate Solar System - All 8 planets with realistic proportions */}
      <AccurateSolarSystem timeScale={0.3} showOrbits={false} />

      {/* Camera Controls - disabled in XR mode */}
      <OrbitControls
        enabled={enableOrbitControls && xrMode === 'desktop'}
        enablePan={enableOrbitControls && xrMode === 'desktop'}
        enableZoom={enableOrbitControls && xrMode === 'desktop'}
        enableRotate={enableOrbitControls && xrMode === 'desktop'}
        minDistance={5}
        maxDistance={300}
        target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]}
        makeDefault
      />

      {/* Environment - Using simple color instead of HDR preset to reduce bundle size */}
      <color attach="background" args={["#000011"]} />

      {/* Post-processing Effects - Optimized for performance and visuals */}
      {safeBloomIntensity > 0 && (
        <EffectComposer multisampling={4} autoClear={true}>
          <Bloom
            intensity={safeBloomIntensity * 1.2}
            width={400}
            height={400}
            kernelSize={3}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Noise opacity={0.015} premultiply />
          <Vignette eskil={false} offset={0.15} darkness={0.6} />
        </EffectComposer>
      )}
    </XR>
  )
}

export function HybridScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setIsLoading, hoveredConstellation } = useHybridStore()

  // WebGL context handlers
  const r3fContextLostHandler = useCallback((event: Event) => {
    console.warn("⚠️ R3F WebGL context lost!", event)
    event.preventDefault()
  }, [])

  const r3fContextRestoredHandler = useCallback((gl: any) => {
    console.log("✅ R3F WebGL context restored!")
    gl.setClearColor(0x000011, 1)
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
        {/* BASE LAYER: R3F Galaxy with integrated Spline */}
        <Layer type="base">
          <Canvas
            camera={{
              position: [0, 30, 70],
              fov: 65,
              near: 0.01,
              far: 2000,
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

        {/* UI LAYER: Single Unified Control Panel */}
        <GalaxyControls />

        {/* Keyboard Help Overlay */}
        <KeyboardHelp />

        {/* Constellation Info Panel */}
        <ConstellationInfoPanel constellation={hoveredConstellation} />

        {/* Planetary Alignment Info - Shows current date/time */}
        <PlanetaryAlignmentInfo visible={true} />
      </LayerManager>
    </div>
  )
}
