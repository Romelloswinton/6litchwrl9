import * as THREE from 'three'

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
    
    // Use same compression algorithm as SplineHelpers
    const actualDistance = auDistance * this.config.scale
    const maxSolarDistance = 30.1 * this.config.scale // Neptune's orbit
    
    // Logarithmic scaling: outer planets get compressed more than inner ones
    const compressionFactor = Math.log(actualDistance + 1) / Math.log(maxSolarDistance + 1)
    return compressionFactor * this.config.galaxyRadius * 0.9
  }

  private initializePlanets() {
    // Accurate solar system data (distances in AU, sizes relative to Earth)
    this.planets = [
      {
        name: 'Mercury',
        distance: this.compressSolarToGalactic(0.39),
        radius: 0.38,
        color: '#8c7853',
        orbitSpeed: 4.15, // relative to Earth
        rotationSpeed: 0.017,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
      },
      {
        name: 'Venus',
        distance: this.compressSolarToGalactic(0.72),
        radius: 0.95,
        color: '#ffc649',
        orbitSpeed: 1.63,
        rotationSpeed: -0.004, // retrograde rotation
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
      },
      {
        name: 'Earth',
        distance: this.compressSolarToGalactic(1.0),
        radius: 1.0,
        color: '#6b93d6',
        orbitSpeed: 1.0,
        rotationSpeed: 1.0,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
        moons: [{
          name: 'Moon',
          distance: this.compressSolarToGalactic(0.05),
          radius: 0.27,
          color: '#c0c0c0',
          orbitSpeed: 13.4,
          angle: 0,
          position: new THREE.Vector3(),
        }]
      },
      {
        name: 'Mars',
        distance: this.compressSolarToGalactic(1.52),
        radius: 0.53,
        color: '#cd5c5c',
        orbitSpeed: 0.53,
        rotationSpeed: 0.97,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
        moons: [
          {
            name: 'Phobos',
            distance: this.compressSolarToGalactic(0.015),
            radius: 0.01,
            color: '#8b7765',
            orbitSpeed: 100,
            angle: 0,
            position: new THREE.Vector3(),
          },
          {
            name: 'Deimos',
            distance: this.compressSolarToGalactic(0.025),
            radius: 0.006,
            color: '#8b7765',
            orbitSpeed: 35,
            angle: Math.PI,
            position: new THREE.Vector3(),
          }
        ]
      },
      {
        name: 'Jupiter',
        distance: this.compressSolarToGalactic(5.2),
        radius: 11.2,
        color: '#d8ca9d',
        orbitSpeed: 0.084,
        rotationSpeed: 2.4,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
        moons: [
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
      },
      {
        name: 'Saturn',
        distance: this.compressSolarToGalactic(9.5),
        radius: 9.4,
        color: '#fab97f',
        orbitSpeed: 0.034,
        rotationSpeed: 2.2,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
        moons: [
          {
            name: 'Titan',
            distance: this.compressSolarToGalactic(0.2),
            radius: 0.4,
            color: '#ffa500',
            orbitSpeed: 6,
            angle: 0,
            position: new THREE.Vector3(),
          }
        ]
      },
      {
        name: 'Uranus',
        distance: this.compressSolarToGalactic(19.2),
        radius: 4.0,
        color: '#4fd0e7',
        orbitSpeed: 0.012,
        rotationSpeed: 1.4,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
      },
      {
        name: 'Neptune',
        distance: this.compressSolarToGalactic(30.1),
        radius: 3.9,
        color: '#4169e1',
        orbitSpeed: 0.006,
        rotationSpeed: 1.5,
        position: new THREE.Vector3(),
        angle: Math.random() * Math.PI * 2,
      }
    ]
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