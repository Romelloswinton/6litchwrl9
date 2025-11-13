import * as THREE from 'three'
import { compressSolarToGalactic, PLANET_VISUAL_CONSTANTS } from './galaxyMath'
import { getAllPlanets } from '../data/planetDatabase'

export interface Planet {
  name: string
  distance: number // AU from sun (1 AU = 149.6 million km)
  radius: number // relative size
  color: string
  orbitSpeed: number // relative orbital speed
  rotationSpeed: number
  position: THREE.Vector3
  angle: number // current orbital angle
  moons?: Moon[]
}

export interface Moon {
  name: string
  distance: number // distance from planet
  radius: number
  color: string
  orbitSpeed: number
  angle: number
  position: THREE.Vector3
}

export interface SolarSystemConfig {
  scale: number // overall scale factor
  showOrbits: boolean
  showMoons: boolean
  timeScale: number // animation speed multiplier
  useGalacticScale?: boolean // compress for galaxy view
  galaxyRadius?: number // max galaxy radius for compression
}

export class SolarSystemGenerator {
  private config: SolarSystemConfig
  private planets: Planet[] = []

  constructor(config: SolarSystemConfig = {
    scale: 0.1,
    showOrbits: true,
    showMoons: true,
    timeScale: 1.0,
    useGalacticScale: false,
    galaxyRadius: 8
  }) {
    this.config = config
    this.initializePlanets()
  }

  private compressSolarToGalactic(auDistance: number): number {
    if (!this.config.useGalacticScale || !this.config.galaxyRadius) {
      return auDistance * this.config.scale
    }

    // Use shared compression algorithm
    return compressSolarToGalactic(auDistance, this.config.scale, this.config.galaxyRadius)
  }

  private initializePlanets() {
    // Use unified planet database
    const planetDatabase = getAllPlanets()

    // Moon data (kept here as it's specific to this generator)
    const moonData: Record<string, Moon[]> = {
      'Earth': [{
        name: 'Moon',
        distance: this.compressSolarToGalactic(0.05),
        radius: 0.27,
        color: '#c0c0c0',
        orbitSpeed: 13.4,
        angle: 0,
        position: new THREE.Vector3(),
      }],
      'Jupiter': [
        {
          name: 'Io',
          distance: this.compressSolarToGalactic(0.08),
          radius: 0.29,
          color: '#ffff99',
          orbitSpeed: 20,
          angle: 0,
          position: new THREE.Vector3(),
        },
        {
          name: 'Europa',
          distance: this.compressSolarToGalactic(0.12),
          radius: 0.25,
          color: '#87ceeb',
          orbitSpeed: 15,
          angle: Math.PI / 2,
          position: new THREE.Vector3(),
        },
        {
          name: 'Ganymede',
          distance: this.compressSolarToGalactic(0.18),
          radius: 0.41,
          color: '#8b7765',
          orbitSpeed: 10,
          angle: Math.PI,
          position: new THREE.Vector3(),
        },
        {
          name: 'Callisto',
          distance: this.compressSolarToGalactic(0.25),
          radius: 0.38,
          color: '#696969',
          orbitSpeed: 7,
          angle: 3 * Math.PI / 2,
          position: new THREE.Vector3(),
        }
      ]
    }

    // Convert unified planet data to local Planet interface
    this.planets = planetDatabase.map(p => ({
      name: p.name,
      distance: this.compressSolarToGalactic(p.distanceAU),
      radius: p.visualSize * 25, // Scale for display (Earth visual size 0.04 * 25 = 1.0)
      color: p.color.toLowerCase(),
      orbitSpeed: 1.0 / Math.sqrt(p.distanceAU), // Kepler's third law approximation
      rotationSpeed: p.rotationPeriod > 0 ? p.rotationPeriod : -Math.abs(p.rotationPeriod),
      position: new THREE.Vector3(),
      angle: Math.random() * Math.PI * 2,
      moons: moonData[p.name] || undefined
    }))
  }

  updatePositions(deltaTime: number) {
    this.planets.forEach(planet => {
      // Update planet orbital position
      planet.angle += planet.orbitSpeed * deltaTime * this.config.timeScale * 0.001
      planet.position.x = Math.cos(planet.angle) * planet.distance
      planet.position.z = Math.sin(planet.angle) * planet.distance

      // Update moon positions
      if (planet.moons && this.config.showMoons) {
        planet.moons.forEach(moon => {
          moon.angle += moon.orbitSpeed * deltaTime * this.config.timeScale * 0.001
          moon.position.x = planet.position.x + Math.cos(moon.angle) * moon.distance
          moon.position.z = planet.position.z + Math.sin(moon.angle) * moon.distance
          moon.position.y = planet.position.y // Keep moons at planet's level
        })
      }
    })
  }

  getPlanets(): Planet[] {
    return this.planets
  }

  generateOrbitLines(): THREE.BufferGeometry[] {
    const orbitGeometries: THREE.BufferGeometry[] = []

    if (!this.config.showOrbits) return orbitGeometries

    this.planets.forEach(planet => {
      const points: THREE.Vector3[] = []
      const segments = 64
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(
          Math.cos(angle) * planet.distance,
          0,
          Math.sin(angle) * planet.distance
        ))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      orbitGeometries.push(geometry)
    })

    return orbitGeometries
  }

  createPlanetBufferAttributes() {
    const allObjects: (Planet | Moon)[] = []
    
    // Add planets
    this.planets.forEach(planet => {
      allObjects.push(planet)
      
      // Add moons if enabled
      if (planet.moons && this.config.showMoons) {
        planet.moons.forEach(moon => allObjects.push(moon))
      }
    })

    const positions = new Float32Array(allObjects.length * 3)
    const colors = new Float32Array(allObjects.length * 3)
    const sizes = new Float32Array(allObjects.length)

    allObjects.forEach((obj, index) => {
      const i3 = index * 3
      const color = new THREE.Color(obj.color)

      positions[i3] = obj.position.x
      positions[i3 + 1] = obj.position.y
      positions[i3 + 2] = obj.position.z

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Scale size appropriately for display
      sizes[index] = Math.max(0.02, obj.radius * 0.05)
    })

    return { positions, colors, sizes, count: allObjects.length }
  }

  updateConfig(newConfig: Partial<SolarSystemConfig>) {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.scale !== undefined) {
      this.initializePlanets() // Reinitialize with new scale
    }
  }

  getConfig(): SolarSystemConfig {
    return this.config
  }

  // Get planet by name for Spline integration
  getPlanet(name: string): Planet | undefined {
    return this.planets.find(p => p.name.toLowerCase() === name.toLowerCase())
  }

  // Get all celestial bodies (planets + moons) for interaction
  getAllCelestialBodies(): Array<Planet | Moon> {
    const bodies: Array<Planet | Moon> = [...this.planets]
    
    this.planets.forEach(planet => {
      if (planet.moons) {
        bodies.push(...planet.moons)
      }
    })
    
    return bodies
  }
}