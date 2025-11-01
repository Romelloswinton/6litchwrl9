import * as THREE from 'three'
import type { SplineModelConfig, CameraPreset } from '../../types/galaxy'

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

  static createSplineModelConfig(
    name: string,
    url: string,
    position: [number, number, number] = [0, 0, 0],
    rotation: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
    interactive = true
  ): SplineModelConfig {
    return {
      name,
      url,
      position: new THREE.Vector3(...position),
      rotation: new THREE.Euler(...rotation),
      scale: new THREE.Vector3(...scale),
      interactive,
    }
  }

  static generateRandomSplinePositions(
    count: number,
    radius: number,
    minDistance = 2
  ): THREE.Vector3[] {
    const positions: THREE.Vector3[] = []
    const maxAttempts = count * 10

    for (let i = 0; i < count && positions.length < maxAttempts; i++) {
      let attempts = 0
      let validPosition = false
      let position: THREE.Vector3

      while (!validPosition && attempts < 100) {
        // Generate random position within galaxy bounds but outside core
        const angle = Math.random() * Math.PI * 2
        const distance = minDistance + Math.random() * (radius - minDistance)
        const height = (Math.random() - 0.5) * radius * 0.2

        position = new THREE.Vector3(
          Math.cos(angle) * distance,
          height,
          Math.sin(angle) * distance
        )

        // Check minimum distance from other positions
        validPosition = positions.every(existingPos => 
          position!.distanceTo(existingPos) >= minDistance
        )

        attempts++
      }

      if (validPosition) {
        positions.push(position!)
      }
    }

    return positions
  }

  static createCameraPresets(): CameraPreset[] {
    return [
      {
        name: 'Overview',
        position: new THREE.Vector3(0, 15, 20),
        target: new THREE.Vector3(0, 0, 0),
        fov: 75,
      },
      {
        name: 'Core View',
        position: new THREE.Vector3(0, 5, 8),
        target: new THREE.Vector3(0, 0, 0),
        fov: 60,
      },
      {
        name: 'Side Profile',
        position: new THREE.Vector3(25, 0, 0),
        target: new THREE.Vector3(0, 0, 0),
        fov: 45,
      },
      {
        name: 'Spiral Arm',
        position: new THREE.Vector3(8, 2, 8),
        target: new THREE.Vector3(0, 0, 0),
        fov: 90,
      },
      {
        name: 'Deep Space',
        position: new THREE.Vector3(0, 30, 30),
        target: new THREE.Vector3(0, 0, 0),
        fov: 30,
      },
    ]
  }

  static interpolateSplineEvent(
    eventName: string,
    startValue: any,
    endValue: any,
    progress: number
  ): any {
    if (typeof startValue === 'number' && typeof endValue === 'number') {
      return startValue + (endValue - startValue) * progress
    }
    
    if (startValue instanceof THREE.Vector3 && endValue instanceof THREE.Vector3) {
      return new THREE.Vector3().lerpVectors(startValue, endValue, progress)
    }
    
    if (startValue instanceof THREE.Color && endValue instanceof THREE.Color) {
      return new THREE.Color().lerpColors(startValue, endValue, progress)
    }
    
    // Default: return end value when progress >= 0.5
    return progress >= 0.5 ? endValue : startValue
  }

  static validateSplineUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return (
        urlObj.protocol === 'https:' &&
        (urlObj.hostname === 'prod.spline.design' || 
         urlObj.hostname === 'app.spline.design' ||
         urlObj.hostname.endsWith('.spline.design')) &&
        url.endsWith('.splinecode')
      )
    } catch {
      return false
    }
  }

  static async preloadSplineModel(url: string): Promise<boolean> {
    try {
      if (!this.validateSplineUrl(url)) {
        throw new Error('Invalid Spline URL')
      }

      // In a real implementation, you would preload the Spline model
      // For now, we'll simulate a network request
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Failed to preload Spline model:', error)
      return false
    }
  }

  static createSplineEventHandlers() {
    return {
      onLoad: (splineApp: any) => {
        console.log('Spline scene loaded:', splineApp)
      },
      
      onError: (error: any) => {
        console.error('Spline scene failed to load:', error)
      },
      
      onMouseEnter: (e: any) => {
        if (e.target?.name) {
          document.body.style.cursor = 'pointer'
        }
      },
      
      onMouseLeave: (e: any) => {
        document.body.style.cursor = 'default'
      },
      
      onClick: (e: any) => {
        if (e.target?.name) {
          console.log('Clicked Spline object:', e.target.name)
        }
      },
      
      onWheel: (e: any) => {
        // Handle wheel events if needed
      },
    }
  }

  static getOptimalSplineSettings() {
    return {
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
    }
  }

  static createSplineAnimationSequence(
    splineApp: any,
    animations: Array<{
      objectName: string
      property: string
      from: any
      to: any
      duration: number
      delay?: number
      easing?: string
    }>
  ) {
    animations.forEach((animation, index) => {
      const { objectName, property, from, to, duration, delay = 0 } = animation
      
      setTimeout(() => {
        const object = splineApp.findObjectByName(objectName)
        if (object) {
          const startTime = Date.now()
          const startValue = from
          const endValue = to
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            // Simple easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            
            const currentValue = SplineHelpers.interpolateSplineEvent(
              property,
              startValue,
              endValue,
              easeProgress
            )
            
            object[property] = currentValue
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          animate()
        }
      }, delay)
    })
  }

  // Galaxy alignment methods for planets
  static compressSolarToGalactic(
    auDistance: number, 
    solarScale: number,
    maxGalaxyRadius: number
  ): number {
    // Logarithmic compression to fit solar system within galaxy bounds
    const actualDistance = auDistance * solarScale
    const maxSolarDistance = 30.1 * solarScale // Neptune's orbit
    
    // Logarithmic scaling: outer planets get compressed more than inner ones
    const compressionFactor = Math.log(actualDistance + 1) / Math.log(maxSolarDistance + 1)
    return compressionFactor * maxGalaxyRadius * 0.9 // Use 90% of galaxy radius for padding
  }

  static generatePlanetPositionsOnSpiralArms(
    count: number,
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    minDistance = 2
  ): Array<{ position: THREE.Vector3; armIndex: number; distance: number }> {
    const planets: Array<{ position: THREE.Vector3; armIndex: number; distance: number }> = []
    
    for (let i = 0; i < count; i++) {
      const armIndex = i % spiralArms
      const branchAngle = (armIndex / spiralArms) * Math.PI * 2
      
      // Distribute planets along the spiral arm at strategic distances
      const normalizedPosition = i / count
      const baseRadius = minDistance + (galaxyRadius - minDistance) * Math.pow(normalizedPosition, 0.8)
      const spinAngle = baseRadius * spiralTightness
      
      // Add controlled variation to prevent perfect alignment
      const angleVariation = (Math.random() - 0.5) * 0.2
      const radiusVariation = (Math.random() - 0.5) * 0.5
      
      const finalRadius = Math.max(minDistance, baseRadius + radiusVariation)
      const finalAngle = branchAngle + spinAngle + angleVariation
      
      const position = new THREE.Vector3(
        Math.cos(finalAngle) * finalRadius,
        (Math.random() - 0.5) * 0.3, // Small vertical variation
        Math.sin(finalAngle) * finalRadius
      )
      
      planets.push({ position, armIndex, distance: finalRadius })
    }
    
    return planets
  }

  static generateSolarSystemInGalaxy(
    galaxyRadius: number,
    spiralArms: number,
    spiralTightness: number,
    solarScale: number
  ): Array<{ name: string; position: THREE.Vector3; armIndex: number; distance: number }> {
    // Real solar system data (distances in AU)
    const solarSystemData = [
      { name: 'Mercury', distance: 0.39 },
      { name: 'Venus', distance: 0.72 },
      { name: 'Earth', distance: 1.0 },
      { name: 'Mars', distance: 1.52 },
      { name: 'Jupiter', distance: 5.2 },
      { name: 'Saturn', distance: 9.5 },
      { name: 'Uranus', distance: 19.2 },
      { name: 'Neptune', distance: 30.1 }
    ]

    const planets: Array<{ name: string; position: THREE.Vector3; armIndex: number; distance: number }> = []
    
    solarSystemData.forEach((planet, index) => {
      // Compress solar system distances to fit within galaxy
      const compressedDistance = this.compressSolarToGalactic(
        planet.distance, 
        solarScale, 
        galaxyRadius
      )
      
      // Distribute planets across spiral arms (not all on same arm)
      const armIndex = index % spiralArms
      const branchAngle = (armIndex / spiralArms) * Math.PI * 2
      
      // Use compressed distance for spiral positioning
      const spinAngle = compressedDistance * spiralTightness
      
      // Add small variation to prevent perfect alignment
      const angleVariation = (Math.random() - 0.5) * 0.1
      const radiusVariation = (Math.random() - 0.5) * 0.1
      
      const finalRadius = Math.max(0.2, compressedDistance + radiusVariation)
      const finalAngle = branchAngle + spinAngle + angleVariation
      
      const position = new THREE.Vector3(
        Math.cos(finalAngle) * finalRadius,
        (Math.random() - 0.5) * 0.1, // Very small vertical variation for galaxy
        Math.sin(finalAngle) * finalRadius
      )
      
      planets.push({ 
        name: planet.name,
        position, 
        armIndex, 
        distance: finalRadius 
      })
    })
    
    return planets
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