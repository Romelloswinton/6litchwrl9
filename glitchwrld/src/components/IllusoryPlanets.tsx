// glitchwrld/src/components/IllusoryPlanets.tsx

import { useRef, useMemo, ReactElement } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Group,
  AdditiveBlending,
} from "three"
import * as THREE from "three"
import { useShallow } from "zustand/react/shallow"
import { useHybridStore } from "../stores/hybridStore"
import { IllusionSettings, defaultIllusionSettings } from "../stores/illusionSlice"
import { IllusoryPlanetData } from "../types/galaxy"
import { SplineHelpers } from "../utils/spline/splineHelpers"

// --- Component Props ---
interface IllusoryPlanetsProps {
  planetCount?: number
  enableGentleRotation?: boolean
  enableOpticalIllusion?: boolean
  synchronizeWithStarfield?: boolean
}

// --- Refactored Planet Generation Logic ---
// (Can be moved to a separate utility file if used elsewhere)
function generateIllusoryPlanetDataInternal(
  galaxyRadius: number,
  spiralArms: number,
  spiralTightness: number,
  planetCount: number
): IllusoryPlanetData[] {
  const planets: IllusoryPlanetData[] = []
  const solarScale = galaxyRadius * 0.5

  // Keep the solarSystemData local to this generation function
  const solarSystemData = [
    {
      name: "Mercury",
      distance: 0.39,
      size: 0.03,
      color: "#8c7853",
      mass: 0.055,
    },
    {
      name: "Venus",
      distance: 0.72,
      size: 0.04,
      color: "#ffc649",
      mass: 0.815,
    },
    { name: "Earth", distance: 1.0, size: 0.04, color: "#6b93d6", mass: 1.0 },
    {
      name: "Mars",
      distance: 1.52,
      size: 0.035,
      color: "#cd5c5c",
      mass: 0.107,
    },
    {
      name: "Jupiter",
      distance: 5.2,
      size: 0.12,
      color: "#d8ca9d",
      mass: 317.8,
    },
    { name: "Saturn", distance: 9.5, size: 0.1, color: "#fab97f", mass: 95.2 },
    {
      name: "Uranus",
      distance: 19.2,
      size: 0.07,
      color: "#4fd0e7",
      mass: 14.5,
    },
    {
      name: "Neptune",
      distance: 30.1,
      size: 0.07,
      color: "#4169e1",
      mass: 17.1,
    },
  ]

  solarSystemData.slice(0, planetCount).forEach((planet, index) => {
    const compressedDistance = SplineHelpers.compressSolarToGalactic(
      planet.distance,
      solarScale,
      galaxyRadius
    )

    const armIndex = index % spiralArms
    const branchAngle = (armIndex / spiralArms) * Math.PI * 2
    const spinAngle = compressedDistance * spiralTightness
    const angleVariation = (Math.random() - 0.5) * 0.3
    const radiusVariation = (Math.random() - 0.5) * 0.2
    const finalRadius = Math.max(0.5, compressedDistance + radiusVariation)
    const finalAngle = branchAngle + spinAngle + angleVariation

    const basePosition = new THREE.Vector3(
      Math.cos(finalAngle) * finalRadius,
      (Math.random() - 0.5) * 0.2,
      Math.sin(finalAngle) * finalRadius
    )

    const baseColor = new THREE.Color(planet.color)
    const glowColor = baseColor.clone().multiplyScalar(1.5)

    const orbitalSpeed = 0.1 / Math.sqrt(finalRadius)
    const localRotationSpeed = 0.02 + Math.random() * 0.05
    const phase = Math.random() * Math.PI * 2

    planets.push({
      name: planet.name,
      originalPosition: basePosition.clone(),
      size: planet.size * (galaxyRadius / 8),
      color: baseColor,
      glowColor,
      mass: planet.mass,
      orbitalRadius: finalRadius,
      orbitalSpeed: orbitalSpeed * 0.1,
      rotationSpeed: localRotationSpeed * 0.5,
      phase,
      armIndex,
    })
  })
  return planets
}

export function IllusoryPlanets({
  planetCount = 8,
  enableGentleRotation = true,
  enableOpticalIllusion = true,
  synchronizeWithStarfield = true,
}: IllusoryPlanetsProps) {
  const groupRef = useRef<Group>(null!)
  const planetsRef = useRef<(Mesh | null)[]>([])
  const atmospheresRef = useRef<(Mesh | null)[]>([]) // Ref for atmospheres

  // Camera tracking refs
  const prevCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const smoothedCameraVelocity = useRef<THREE.Vector3>(new THREE.Vector3())

  // Pre-allocate vectors for useFrame
  const tempRawCameraVelocity = useMemo(() => new THREE.Vector3(), [])
  const tempCameraParallaxOffset = useMemo(() => new THREE.Vector3(), [])

  // Zustand state selectors with shallow comparison to prevent re-renders
  const {
    galaxyRadius,
    spiralArms,
    spiralTightness,
    rotationSpeed,
    isAnimating,
    sceneMode,
    illusionSettings,
  } = useHybridStore(
    useShallow((state) => ({
      galaxyRadius: state.galaxyRadius,
      spiralArms: state.spiralArms,
      spiralTightness: state.spiralTightness,
      rotationSpeed: state.rotationSpeed,
      isAnimating: state.isAnimating,
      sceneMode: state.sceneMode,
      illusionSettings: state.illusionSettings,
    }))
  )

  // Get scene reference
  const { scene } = useThree()

  // --- Planet Data Generation (Memoized, uses refactored function) ---
  const planetData = useMemo((): IllusoryPlanetData[] => {
    // console.log(`🪐 Generating ${planetCount} illusory planets...`);
    return generateIllusoryPlanetDataInternal(
      galaxyRadius,
      spiralArms,
      spiralTightness,
      planetCount
    )
  }, [galaxyRadius, spiralArms, spiralTightness, planetCount])

  // --- Create Meshes (Memoized) ---
  const planetMeshes = useMemo(() => {
    const meshes: ReactElement[] = []
    const atmosphereElements: ReactElement[] = []

    planetData.forEach((planet, index) => {
      // Main Planet Mesh
      meshes.push(
        <mesh
          key={`planet-${planet.name}-${index}`}
          ref={(el) => {
            planetsRef.current[index] = el
          }} // Assign to ref array
          position={planet.originalPosition}
          name={planet.name}
        >
          <sphereGeometry args={[planet.size, 16, 16]} />
          <meshBasicMaterial
            color={planet.color}
            transparent={true}
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      )

      // Simple Atmosphere Mesh
      atmosphereElements.push(
        <mesh
          key={`atmosphere-${planet.name}-${index}`}
          ref={(el) => {
            atmospheresRef.current[index] = el // Assign atmosphere ref
          }}
          position={planet.originalPosition} // Will follow planet in useFrame
          name={`${planet.name}-atmosphere`}
        >
          <sphereGeometry args={[planet.size * 1.25, 16, 16]} />
          <meshBasicMaterial
            color={planet.glowColor}
            transparent={true}
            opacity={0.15}
            side={THREE.BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )
    })

    return { meshes, atmosphereElements }
  }, [planetData]) // Recreate meshes if planetData changes

  // --- Animation Loop ---
  useFrame((state, delta) => {
    if (!groupRef.current || !isAnimating) return

    const time = state.clock.elapsedTime

    // --- Access Starfield Rotation Safely ---
    // Consider Zustand/Context if this becomes a performance bottleneck
    const starfieldObject = scene.getObjectByName("StarfieldGroup")
    const starfieldRotation = starfieldObject ? starfieldObject.rotation.y : 0

    // --- Access Illusion Settings from Zustand Store ---
    const settings = illusionSettings

    const baseGalaxyRotation = rotationSpeed * time * 50

    // --- Camera Velocity Calculation ---
    const currentCameraPosition = state.camera.position
    // Calculate raw velocity using pre-allocated vector
    tempRawCameraVelocity
      .copy(currentCameraPosition)
      .sub(prevCameraPosition.current)
      .divideScalar(delta > 0 ? delta : 0.016) // Avoid division by zero

    // Smooth the velocity
    const smoothingFactor = Math.max(
      0.01,
      Math.min(0.99, 1 - settings.parallaxSmoothness)
    )
    smoothedCameraVelocity.current.lerp(tempRawCameraVelocity, smoothingFactor)

    // Update previous camera position
    prevCameraPosition.current.copy(currentCameraPosition)

    // --- Update Planet Positions, Rotations, Scale ---
    planetData.forEach((planet, index) => {
      const mesh = planetsRef.current[index]
      const atmosphereMesh = atmospheresRef.current[index] // Use direct ref
      if (!mesh || !atmosphereMesh) return // Skip if refs not ready

      let finalX = planet.originalPosition.x
      let finalY = planet.originalPosition.y
      let finalZ = planet.originalPosition.z

      // --- Gentle Rotation Logic ---
      if (enableGentleRotation) {
        const orbitalMotion = planet.orbitalSpeed * time + planet.phase
        const currentRadius = planet.orbitalRadius

        finalX = Math.cos(orbitalMotion) * currentRadius
        finalZ = Math.sin(orbitalMotion) * currentRadius
        finalY = planet.originalPosition.y

        if (settings.verticalMotion > 0) {
          const verticalOscillation =
            Math.sin(time * 0.4 + planet.phase * 2) *
            0.05 *
            settings.verticalMotion
          finalY += verticalOscillation
        }

        const rotationVariation =
          1 + Math.sin(time * 0.1 + planet.phase) * settings.rotationVariation
        mesh.rotation.x += delta * planet.rotationSpeed * rotationVariation
        mesh.rotation.y +=
          delta * planet.rotationSpeed * 0.7 * rotationVariation
      }

      // --- Optical Illusion Logic ---
      if (enableOpticalIllusion && settings.enabled) {
        const syncAngle = synchronizeWithStarfield
          ? starfieldRotation * settings.synchronization
          : baseGalaxyRotation * settings.synchronization
        // Use current calculated position for angle, not originalPosition
        const currentAngle = Math.atan2(finalZ, finalX) // Angle based on orbital motion
        const combinedAngle = currentAngle + syncAngle

        const staticParallaxFactor =
          1 + (planet.orbitalRadius / galaxyRadius) * settings.parallaxStrength
        const parallaxRadius = planet.orbitalRadius * staticParallaxFactor

        finalX = Math.cos(combinedAngle) * parallaxRadius
        finalZ = Math.sin(combinedAngle) * parallaxRadius

        const depthFactor =
          (planet.orbitalRadius / galaxyRadius) * settings.depthSeparation
        // Use pre-allocated vector for parallax offset
        tempCameraParallaxOffset
          .copy(smoothedCameraVelocity.current)
          .multiplyScalar(settings.cameraParallaxStrength * depthFactor * 0.1)

        finalX += tempCameraParallaxOffset.x
        finalY += tempCameraParallaxOffset.y
        finalZ += tempCameraParallaxOffset.z

        const distanceFromCenter = Math.sqrt(finalX * finalX + finalZ * finalZ)
        let sizeMultiplier = 1
        if (settings.sizePulsing) {
          sizeMultiplier = 1 + Math.sin(time * 0.2 + planet.phase) * 0.15
        }
        const depthScale = Math.max(
          0.3,
          1 - distanceFromCenter / (galaxyRadius * 1.5)
        )
        mesh.scale.setScalar(sizeMultiplier * depthScale)
      } else {
        mesh.scale.setScalar(1.0) // Reset scale if illusion disabled
      }

      // --- Apply Final Position & Update Atmosphere ---
      mesh.position.set(finalX, finalY, finalZ)
      atmosphereMesh.position.copy(mesh.position)
      atmosphereMesh.scale.copy(mesh.scale)
    })
  })

  // --- Conditional Rendering ---
  if (sceneMode === "solarSystem") {
    return null
  }

  // --- Render JSX ---
  return (
    <group ref={groupRef} name="IllusoryPlanetsGroup">
      {planetMeshes.meshes}
      {planetMeshes.atmosphereElements}
    </group>
  )
}

// --- Optional Hook for External Use (Now uses refactored generator) ---
export function useIllusoryPlanetData(planetCount: number = 8) {
  const { galaxyRadius, spiralArms, spiralTightness } = useHybridStore(
    (state) => ({
      galaxyRadius: state.galaxyRadius,
      spiralArms: state.spiralArms,
      spiralTightness: state.spiralTightness,
    })
  )

  return useMemo(() => {
    // Now uses the same internal generation logic
    return generateIllusoryPlanetDataInternal(
      galaxyRadius,
      spiralArms,
      spiralTightness,
      planetCount
    )
    // Note: This still regenerates data separately from the component instance.
    // If exact instance data is needed, a different approach (e.g., store/context) is required.
  }, [galaxyRadius, spiralArms, spiralTightness, planetCount])
}
