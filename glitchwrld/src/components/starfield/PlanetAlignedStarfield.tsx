// glitchwrld/src/components/starfield/PlanetAlignedStarfield.tsx

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import * as THREE from 'three'
import { useHybridStore } from '../../stores/hybridStore'
import { getSimplifiedPlanetData } from '../../utils/data/planetDatabase'
import { compressSolarToGalactic } from '../../utils/galaxy/galaxyMath'

interface PlanetStarCluster {
  planetName: string
  planetPosition: THREE.Vector3
  planetColor: THREE.Color
  clusterRadius: number
  starCount: number
  orbitalSpeed: number
  phase: number
}

interface PlanetAlignedStarfieldProps {
  starsPerPlanet?: number
  clusterRadiusMultiplier?: number
  enableOrbitalMotion?: boolean
}

/**
 * Creates a starfield that aligns with and clusters around planet positions
 * This creates a visual connection between the starfield and planetary system
 */
export function PlanetAlignedStarfield({
  starsPerPlanet = 150,
  clusterRadiusMultiplier = 2.5,
  enableOrbitalMotion = true
}: PlanetAlignedStarfieldProps) {
  const {
    galaxyRadius,
    spiralArms,
    spiralTightness,
    isAnimating,
    rotationSpeed
  } = useHybridStore()

  const pointsRef = useRef<THREE.Points>(null)
  const clustersRef = useRef<PlanetStarCluster[]>([])

  // Generate planet-aligned star clusters
  const starfieldData = useMemo(() => {
    const solarSystemData = getSimplifiedPlanetData()
    const solarScale = galaxyRadius * 0.5
    const clusters: PlanetStarCluster[] = []

    // Calculate total stars needed
    const totalStars = solarSystemData.length * starsPerPlanet
    const positions = new Float32Array(totalStars * 3)
    const colors = new Float32Array(totalStars * 3)
    const sizes = new Float32Array(totalStars)
    const offsets = new Float32Array(totalStars * 3) // For orbital motion

    let starIndex = 0

    solarSystemData.forEach((planet, planetIndex) => {
      // Calculate planet position using spiral arm algorithm
      const compressedDistance = compressSolarToGalactic(
        planet.distance,
        solarScale,
        galaxyRadius
      )

      const armIndex = planetIndex % spiralArms
      const branchAngle = (armIndex / spiralArms) * Math.PI * 2
      const spinAngle = compressedDistance * spiralTightness
      const angleVariation = (Math.random() - 0.5) * 0.3
      const radiusVariation = (Math.random() - 0.5) * 0.2
      const finalRadius = Math.max(0.5, compressedDistance + radiusVariation)
      const finalAngle = branchAngle + spinAngle + angleVariation

      const planetPosition = new THREE.Vector3(
        Math.cos(finalAngle) * finalRadius,
        (Math.random() - 0.5) * 0.2,
        Math.sin(finalAngle) * finalRadius
      )

      const baseColor = new THREE.Color(planet.color)
      const clusterRadius = planet.size * (galaxyRadius / 8) * clusterRadiusMultiplier
      const orbitalSpeed = 0.1 / Math.sqrt(finalRadius)

      // Store cluster info for animation
      clusters.push({
        planetName: planet.name,
        planetPosition,
        planetColor: baseColor,
        clusterRadius,
        starCount: starsPerPlanet,
        orbitalSpeed: orbitalSpeed * 0.05,
        phase: Math.random() * Math.PI * 2
      })

      // Generate stars in a cluster around this planet
      for (let i = 0; i < starsPerPlanet; i++) {
        const i3 = starIndex * 3

        // Distribute stars in a spherical cluster with higher density near planet
        // Use a power distribution for natural clustering
        const clusterFactor = Math.pow(Math.random(), 1.5) // Concentrates stars near center
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const distance = clusterRadius * clusterFactor

        // Store offset from planet for orbital motion
        const offsetX = distance * Math.sin(phi) * Math.cos(theta)
        const offsetY = distance * Math.cos(phi) * 0.3 // Flatten vertically
        const offsetZ = distance * Math.sin(phi) * Math.sin(theta)

        offsets[i3] = offsetX
        offsets[i3 + 1] = offsetY
        offsets[i3 + 2] = offsetZ

        // Initial position (will be updated in useFrame)
        positions[i3] = planetPosition.x + offsetX
        positions[i3 + 1] = planetPosition.y + offsetY
        positions[i3 + 2] = planetPosition.z + offsetZ

        // Color: blend planet color with white based on distance from planet
        const colorBlend = 0.3 + clusterFactor * 0.7
        const starColor = baseColor.clone().lerp(new THREE.Color('#ffffff'), colorBlend)

        // Add subtle variation
        const colorVariation = (Math.random() - 0.5) * 0.2
        starColor.multiplyScalar(1 + colorVariation)

        colors[i3] = Math.min(1, starColor.r)
        colors[i3 + 1] = Math.min(1, starColor.g)
        colors[i3 + 2] = Math.min(1, starColor.b)

        // Size: smaller stars are further from planet
        const baseSize = 0.5 + Math.random() * 1.5
        const sizeScale = 1.2 - clusterFactor * 0.5 // Closer stars are slightly larger
        sizes[starIndex] = baseSize * sizeScale

        starIndex++
      }
    })

    clustersRef.current = clusters

    console.log(`🌟 Generated planet-aligned starfield: ${clusters.length} planet clusters with ${totalStars} total stars`)

    return {
      positions,
      colors,
      sizes,
      offsets,
      totalStars
    }
  }, [galaxyRadius, spiralArms, spiralTightness, starsPerPlanet, clusterRadiusMultiplier])

  // Animation: update star positions based on planet orbital motion
  useFrame((state, delta) => {
    if (!pointsRef.current || !isAnimating) return

    const time = state.clock.elapsedTime
    const geometry = pointsRef.current.geometry
    const positionAttribute = geometry.getAttribute('position')

    if (!positionAttribute) return

    let starIndex = 0

    clustersRef.current.forEach((cluster, clusterIndex) => {
      if (enableOrbitalMotion) {
        // Calculate planet's current orbital position
        const orbitalAngle = cluster.orbitalSpeed * time + cluster.phase
        const currentRadius = cluster.planetPosition.length()

        const planetX = Math.cos(orbitalAngle) * currentRadius
        const planetY = cluster.planetPosition.y + Math.sin(time * 0.4 + cluster.phase * 2) * 0.05
        const planetZ = Math.sin(orbitalAngle) * currentRadius

        // Update all stars in this cluster
        for (let i = 0; i < cluster.starCount; i++) {
          const i3 = starIndex * 3

          // Get stored offset
          const offsetX = starfieldData.offsets[i3]
          const offsetY = starfieldData.offsets[i3 + 1]
          const offsetZ = starfieldData.offsets[i3 + 2]

          // Add some rotation to the cluster itself
          const clusterRotation = time * 0.05
          const rotatedOffsetX = offsetX * Math.cos(clusterRotation) - offsetZ * Math.sin(clusterRotation)
          const rotatedOffsetZ = offsetX * Math.sin(clusterRotation) + offsetZ * Math.cos(clusterRotation)

          // Update position to follow planet with rotated offset
          positionAttribute.setXYZ(
            starIndex,
            planetX + rotatedOffsetX,
            planetY + offsetY,
            planetZ + rotatedOffsetZ
          )

          starIndex++
        }
      } else {
        starIndex += cluster.starCount
      }
    })

    positionAttribute.needsUpdate = true

    // Subtle pulsing effect
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      const pulseScale = 1 + Math.sin(time * 0.5) * 0.05
      pointsRef.current.scale.setScalar(pulseScale)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[starfieldData.positions, 3]}
          attach="attributes-position"
        />
        <bufferAttribute
          args={[starfieldData.colors, 3]}
          attach="attributes-color"
        />
        <bufferAttribute
          args={[starfieldData.sizes, 1]}
          attach="attributes-size"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
        alphaTest={0.001}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
