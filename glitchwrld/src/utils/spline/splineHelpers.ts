import * as THREE from 'three'
import { compressSolarToGalactic } from '../galaxy/galaxyMath'
import { getSimplifiedPlanetData } from '../data/planetDatabase'
import { generateEvenlyDistributedSpiralPositions, generateSpiralPositions } from '../galaxy/spiralPositioning'

export class SplineHelpers {
  // Your actual Spline scene URLs
  static readonly DEFAULT_SPLINE_URLS = {
    main: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
    // Add more scenes here as needed
    spaceship: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
    asteroid: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
    nebula: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
    planet: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
  }

  // Re-export shared utilities for backward compatibility
  static compressSolarToGalactic = compressSolarToGalactic

  static generatePlanetPositionsOnSpiralArms(
    count: number,
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    minDistance = 2
  ): Array<{ position: THREE.Vector3; armIndex: number; distance: number }> {
    // Use shared spiral positioning utility
    return generateEvenlyDistributedSpiralPositions(count, {
      galaxyRadius,
      spiralArms,
      spiralTightness,
      minDistance,
      verticalVariationAmount: 0.3
    })
  }

  static generateSolarSystemInGalaxy(
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    solarScale: number
  ): Array<{ name: string; position: THREE.Vector3; armIndex: number; distance: number }> {
    // Use unified planet database
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

  static convertGalaxyToSplineCoordinates(
    galaxyPosition: THREE.Vector3,
    canvasWidth: number,
    canvasHeight: number,
    cameraDistance = 15,
    galaxyScale = 1.0
  ): { x: number; y: number; z?: number } {
    // Project 3D galaxy coordinates to 2D screen coordinates for Spline
    // This assumes orthographic-like projection
    
    const screenX = (galaxyPosition.x / galaxyScale) * (canvasWidth / 20) + canvasWidth / 2
    const screenY = (galaxyPosition.z / galaxyScale) * (canvasHeight / 20) + canvasHeight / 2
    
    return {
      x: screenX,
      y: screenY,
      z: galaxyPosition.y * 10 // Optional depth for 3D Spline scenes
    }
  }

  static alignSplineObjectsWithGalaxy(
    splineApp: any,
    galaxyParams: {
      particleCount: number
      galaxyRadius: number
      spiralArms: number
      spiralTightness: number
    },
    canvasSize: { width: number; height: number },
    objectNames: string[] = [],
    useSolarSystemData = true
  ): boolean {
    if (!splineApp || !splineApp.findObjectByName) {
      console.warn('SplineApp or findObjectByName not available')
      return false
    }

    try {
      let planetPositions: Array<{ name?: string; position: THREE.Vector3; armIndex: number; distance: number }>
      
      if (useSolarSystemData) {
        // Use real solar system data with logarithmic compression
        const solarScale = galaxyParams.galaxyRadius * 0.5 // Current solar system scale factor
        planetPositions = this.generateSolarSystemInGalaxy(
          galaxyParams.galaxyRadius,
          galaxyParams.spiralArms,
          galaxyParams.spiralTightness,
          solarScale
        )
        console.log('🌟 Generated solar system planets in galaxy:', planetPositions)
      } else {
        // Use generic spiral positioning
        planetPositions = this.generatePlanetPositionsOnSpiralArms(
          objectNames.length || 8,
          galaxyParams.galaxyRadius,
          galaxyParams.spiralArms,
          galaxyParams.spiralTightness,
          2
        )
        console.log('🌟 Generated spiral arm positions:', planetPositions)
      }

      planetPositions.forEach((planet, index) => {
        // Use planet name if available, otherwise fall back to object names or default
        const objectName = planet.name || objectNames[index] || `Planet_${index + 1}`
        const splineObject = splineApp.findObjectByName(objectName)
        
        if (splineObject && splineObject.position) {
          // Enhanced positioning with better focus and scale
          const splineCoords = this.convertGalaxyToSplineCoordinates(
            planet.position,
            canvasSize.width,
            canvasSize.height,
            15,
            1.0
          )
          
          // Apply position with improved centering and scaling
          const centerX = canvasSize.width / 2
          const centerY = canvasSize.height / 2
          const scale = Math.min(canvasSize.width, canvasSize.height) / 1000 // Adaptive scaling
          
          splineObject.position.x = (splineCoords.x - centerX) * scale
          splineObject.position.y = (splineCoords.y - centerY) * scale
          if (splineCoords.z !== undefined) {
            splineObject.position.z = splineCoords.z * scale
          }
          
          // Ensure object is visible and properly scaled
          if (splineObject.scale) {
            const distanceScale = 1 + (planet.distance / galaxyParams.galaxyRadius) * 0.5
            splineObject.scale.x = distanceScale
            splineObject.scale.y = distanceScale
            splineObject.scale.z = distanceScale
          }
          
          // Set initial rotation for dynamic effect
          if (splineObject.rotation) {
            splineObject.rotation.x = Math.random() * Math.PI * 2
            splineObject.rotation.y = Math.random() * Math.PI * 2
            splineObject.rotation.z = Math.random() * Math.PI * 2
          }
          
          // Ensure visibility
          if (splineObject.visible !== undefined) {
            splineObject.visible = true
          }
          
          console.log(`📍 Enhanced positioning for ${objectName}:`, {
            originalDistance: useSolarSystemData ? `${((planet.distance / (galaxyParams.galaxyRadius * 0.5)) * 30.1).toFixed(1)} AU` : 'N/A',
            compressedDistance: planet.distance.toFixed(2),
            armIndex: planet.armIndex,
            galaxy: planet.position,
            splineScreen: splineCoords,
            finalPosition: splineObject.position,
            scale: splineObject.scale
          })
        } else {
          console.warn(`⚠️ Spline object "${objectName}" not found in scene`)
          
          // Try to find any object in the scene for debugging
          if (splineApp.scene && splineApp.scene.children) {
            const availableObjects = splineApp.scene.children.map((child: any) => child.name || 'unnamed').filter(Boolean)
            console.log('🔍 Available Spline objects:', availableObjects)
          }
        }
      })

      return true
    } catch (error) {
      console.error('❌ Error aligning Spline objects with galaxy:', error)
      return false
    }
  }
}