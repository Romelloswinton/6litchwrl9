// glitchwrld/src/utils/spline/splineR3FHelpers.ts

import * as THREE from 'three'
import { compressSolarToGalactic } from '../galaxy/galaxyMath'
import { getSimplifiedPlanetData } from '../data/planetDatabase'
import { generateEvenlyDistributedSpiralPositions, generateSpiralPositions } from '../galaxy/spiralPositioning'

export class SplineR3FHelpers {
  /**
   * Generate positions for objects on spiral arms (R3F compatible)
   */
  static generatePlanetPositionsOnSpiralArms(
    count: number,
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    minDistance = 2
  ): Array<{ position: THREE.Vector3; armIndex: number; distance: number }> {
    return generateEvenlyDistributedSpiralPositions(count, {
      galaxyRadius,
      spiralArms,
      spiralTightness,
      minDistance,
      verticalVariationAmount: 0.3
    })
  }

  /**
   * Generate solar system positions in galaxy (R3F compatible)
   */
  static generateSolarSystemInGalaxy(
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    solarScale: number
  ): Array<{ name: string; position: THREE.Vector3; armIndex: number; distance: number }> {
    const solarSystemData = getSimplifiedPlanetData()

    // Calculate compressed distances for all planets
    const compressedDistances = solarSystemData.map(p =>
      compressSolarToGalactic(p.distance, solarScale, galaxyRadius)
    )

    // Use shared spiral positioning utility
    const spiralPositions = generateSpiralPositions(compressedDistances, {
      galaxyRadius,
      spiralArms,
      spiralTightness,
      minDistance: 0.2,
      verticalVariationAmount: 0.1
    })

    // Combine planet names with positions
    return solarSystemData.map((planet, index) => ({
      name: planet.name,
      position: spiralPositions[index].position,
      armIndex: spiralPositions[index].armIndex,
      distance: spiralPositions[index].distance
    }))
  }

  /**
   * Position Spline objects in R3F scene based on galaxy parameters
   * This works directly with Three.js Object3D instances
   * UPDATED: Aligns with IllusoryPlanets positioning for meshed appearance
   */
  static positionSplineObjectsInR3F(
    splineGroup: THREE.Group,
    galaxyParams: {
      particleCount: number
      galaxyRadius: number
      spiralArms: number
      spiralTightness: number
    },
    useSolarSystemData = true
  ): boolean {
    if (!splineGroup) {
      console.warn('No spline group provided')
      return false
    }

    try {
      let planetPositions: Array<{
        name?: string
        position: THREE.Vector3
        armIndex: number
        distance: number
        size: number
        color: string
      }>

      if (useSolarSystemData) {
        // Use real solar system data with EXACT same algorithm as IllusoryPlanets
        const solarSystemData = getSimplifiedPlanetData()
        const solarScale = galaxyParams.galaxyRadius * 0.5

        planetPositions = solarSystemData.map((planet, index) => {
          const compressedDistance = compressSolarToGalactic(
            planet.distance,
            solarScale,
            galaxyParams.galaxyRadius
          )

          // Use EXACT same positioning as IllusoryPlanets
          const armIndex = index % galaxyParams.spiralArms
          const branchAngle = (armIndex / galaxyParams.spiralArms) * Math.PI * 2
          const spinAngle = compressedDistance * galaxyParams.spiralTightness
          const angleVariation = (Math.random() - 0.5) * 0.3
          const radiusVariation = (Math.random() - 0.5) * 0.2
          const finalRadius = Math.max(0.5, compressedDistance + radiusVariation)
          const finalAngle = branchAngle + spinAngle + angleVariation

          const position = new THREE.Vector3(
            Math.cos(finalAngle) * finalRadius,
            (Math.random() - 0.5) * 0.2,
            Math.sin(finalAngle) * finalRadius
          )

          return {
            name: planet.name,
            position,
            armIndex,
            distance: finalRadius,
            size: planet.size * (galaxyParams.galaxyRadius / 8),
            color: planet.color
          }
        })

        console.log('🌟 Generated solar system planets in R3F galaxy (meshed with IllusoryPlanets):', planetPositions.length)
      } else {
        // Use generic spiral positioning
        const positions = this.generatePlanetPositionsOnSpiralArms(
          8,
          galaxyParams.galaxyRadius,
          galaxyParams.spiralArms,
          galaxyParams.spiralTightness,
          2
        )
        planetPositions = positions.map(p => ({
          ...p,
          size: 0.3,
          color: '#87ceeb'
        }))
        console.log('🌟 Generated spiral arm positions:', planetPositions)
      }

      // Traverse the spline group to find objects
      let objectIndex = 0
      const meshObjects: THREE.Object3D[] = []

      splineGroup.traverse((object: THREE.Object3D) => {
        if ((object.type === 'Mesh' || object.type === 'Group') && object.name) {
          meshObjects.push(object)
        }
      })

      // Position each mesh at a planet location
      meshObjects.forEach((object, idx) => {
        if (idx < planetPositions.length) {
          const planet = planetPositions[idx]

          // Apply position directly in 3D space (matches planet positions)
          object.position.copy(planet.position)

          // Scale based on planet size for consistency
          const baseScale = planet.size * 0.8
          object.scale.set(baseScale, baseScale, baseScale)

          // Set initial rotation
          object.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          )

          // Apply planet color if material exists
          object.traverse((child) => {
            if ((child as any).isMesh && (child as any).material) {
              const material = (child as any).material
              if (material.color) {
                material.color = new THREE.Color(planet.color)
              }
            }
          })

          console.log(`📍 Meshed ${object.name} with ${planet.name || 'planet'} at:`, {
            position: planet.position,
            armIndex: planet.armIndex,
            distance: planet.distance.toFixed(2),
            size: planet.size.toFixed(3)
          })

          objectIndex++
        }
      })

      console.log(`✅ Successfully meshed ${objectIndex} Spline objects with planetary alignment`)
      return objectIndex > 0
    } catch (error) {
      console.error('❌ Error positioning Spline objects in R3F:', error)
      return false
    }
  }

  /**
   * Find a Spline object by name in a group hierarchy
   */
  static findObjectByName(group: THREE.Group, name: string): THREE.Object3D | null {
    let found: THREE.Object3D | null = null

    group.traverse((object: THREE.Object3D) => {
      if (object.name === name && !found) {
        found = object
      }
    })

    return found
  }

  /**
   * Animate Spline objects with rotation and orbital motion
   */
  static animateSplineObjects(
    splineGroup: THREE.Group,
    rotationSpeed: number,
    deltaTime: number
  ): void {
    if (!splineGroup) return

    splineGroup.traverse((object: THREE.Object3D) => {
      if (object.type === 'Mesh' || object.type === 'Group') {
        // Rotate individual objects
        object.rotation.x += rotationSpeed * 0.01 * deltaTime
        object.rotation.y += rotationSpeed * 0.008 * deltaTime
        object.rotation.z += rotationSpeed * 0.005 * deltaTime

        // Gentle pulsing scale
        const pulseScale = 1 + Math.sin(Date.now() * 0.002) * 0.05
        object.scale.multiplyScalar(pulseScale)
      }
    })
  }

  /**
   * Apply XR-specific transformations to Spline objects
   */
  static applyXRTransform(
    splineGroup: THREE.Group,
    xrMode: 'desktop' | 'vr' | 'ar',
    targetScale: number
  ): void {
    if (!splineGroup) return

    // Scale the entire group based on XR mode
    const scale = xrMode === 'ar' ? 0.1 : xrMode === 'vr' ? 0.3 : 1.0
    splineGroup.scale.lerp(
      new THREE.Vector3(scale * targetScale, scale * targetScale, scale * targetScale),
      0.1
    )

    // Position adjustments for AR mode
    if (xrMode === 'ar') {
      // Lower the group for tabletop AR viewing
      splineGroup.position.y = -0.5
    } else {
      splineGroup.position.y = 0
    }
  }
}
