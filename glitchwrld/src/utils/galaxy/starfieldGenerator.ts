import * as THREE from 'three'

export type StarType = 'main_sequence' | 'giant' | 'supergiant' | 'white_dwarf' | 'neutron_star' | 'black_hole'
export type GravitationalZone = 'core' | 'bulge' | 'disk' | 'halo' | 'dark_matter'

export interface StarData {
  position: THREE.Vector3
  mass: number // Solar masses
  luminosity: number // Solar luminosities  
  color: THREE.Color
  size: number
  type: StarType
  gravitationalZone: GravitationalZone
  frequency: number // Gravitational wave frequency contribution
  resonanceHarmonic: number // Orbital resonance harmonic
}

export interface DarkMatterNode {
  position: THREE.Vector3
  density: number // Relative density
  oscillationFreq: number // Low-frequency oscillation
  influenceRadius: number
}

export interface StarfieldConfig {
  galaxyRadius: number
  spiralArms: number
  spiralTightness: number
  starCount: number
  
  // Gravitational wave parameters
  enableGravitationalWaves: boolean
  centralBlackHoleMass: number // Solar masses
  
  // Orbital resonance parameters
  enableOrbitalResonance: boolean
  resonanceHarmonics: number[]
  
  // Dark matter parameters
  darkMatterDensity: number
  darkMatterNodes: number
  oscillationAmplitude: number
}

export class StarfieldGenerator {
  private config: StarfieldConfig
  private stars: StarData[] = []
  private darkMatterNodes: DarkMatterNode[] = []

  constructor(config: StarfieldConfig) {
    // Define defaults first, then merge with config (config takes precedence)
    const defaults: StarfieldConfig = {
      galaxyRadius: 8,
      spiralArms: 4,
      spiralTightness: 2,
      starCount: 50000,
      enableGravitationalWaves: true,
      centralBlackHoleMass: 4.1e6, // Sagittarius A* mass
      enableOrbitalResonance: true,
      resonanceHarmonics: [1, 2, 3, 5, 8, 13], // Fibonacci resonances
      darkMatterDensity: 0.3, // 30% of visible matter
      darkMatterNodes: 200,
      oscillationAmplitude: 0.1,
    }

    this.config = { ...defaults, ...config }

    this.generateStarfield()
    this.generateDarkMatterHalo()
  }

  private generateStarfield() {
    this.stars = []
    
    for (let i = 0; i < this.config.starCount; i++) {
      const star = this.generateStar(i)
      this.stars.push(star)
    }
    
    console.log(`🌌 Generated ${this.stars.length} stars across gravitational zones`)
  }

  private generateStar(index: number): StarData {
    // Determine gravitational zone based on galactic structure
    const zoneRandom = Math.random()
    let zone: GravitationalZone
    let radius: number
    let mass: number
    let type: StarType
    
    if (zoneRandom < 0.05) {
      // Central core - supermassive black holes, neutron stars
      zone = 'core'
      radius = Math.random() * this.config.galaxyRadius * 0.1
      mass = 1.5 + Math.random() * 50 // 1.5-50 solar masses
      type = Math.random() < 0.1 ? 'black_hole' : 'neutron_star'
    } else if (zoneRandom < 0.25) {
      // Galactic bulge - old, massive stars
      zone = 'bulge'
      radius = this.config.galaxyRadius * 0.1 + Math.random() * this.config.galaxyRadius * 0.3
      mass = 0.8 + Math.random() * 8 // 0.8-8 solar masses
      type = Math.random() < 0.3 ? 'giant' : 'main_sequence'
    } else if (zoneRandom < 0.85) {
      // Galactic disk - spiral arms with main sequence stars
      zone = 'disk'
      radius = this.generateSpiralArmRadius(index)
      mass = 0.1 + Math.random() * 2 // 0.1-2 solar masses (sun-like)
      type = 'main_sequence'
    } else {
      // Galactic halo - old, low-mass stars
      zone = 'halo'
      radius = this.config.galaxyRadius * 0.8 + Math.random() * this.config.galaxyRadius * 1.2
      mass = 0.08 + Math.random() * 0.5 // 0.08-0.5 solar masses
      type = Math.random() < 0.2 ? 'white_dwarf' : 'main_sequence'
    }

    // Calculate position using spiral arm mathematics for disk stars
    const position = zone === 'disk' ? 
      this.generateSpiralPosition(radius, index) : 
      this.generateSphericalPosition(radius)

    // Calculate gravitational wave frequency contribution
    const frequency = this.calculateGravitationalWaveFreq(mass, radius)
    
    // Calculate orbital resonance harmonic
    const resonanceHarmonic = this.calculateOrbitalResonance(radius, index)
    
    // Determine color and luminosity based on stellar type and mass
    const { color, luminosity, size } = this.getStarProperties(type, mass)

    return {
      position,
      mass,
      luminosity,
      color,
      size,
      type,
      gravitationalZone: zone,
      frequency,
      resonanceHarmonic
    }
  }

  private generateSpiralArmRadius(index: number): number {
    // Distribute stars preferentially along spiral arms
    const armIndex = index % this.config.spiralArms
    const armDensity = 0.7 // 70% of stars in arms, 30% between
    
    if (Math.random() < armDensity) {
      // Star is in spiral arm
      const baseRadius = Math.random() * this.config.galaxyRadius * 0.8
      return baseRadius + (Math.random() - 0.5) * 0.3 // Small deviation
    } else {
      // Star is between arms
      return Math.random() * this.config.galaxyRadius
    }
  }

  private generateSpiralPosition(radius: number, index: number): THREE.Vector3 {
    // Use same spiral mathematics as galaxy particles
    const armIndex = index % this.config.spiralArms
    const branchAngle = (armIndex / this.config.spiralArms) * Math.PI * 2
    const spinAngle = radius * this.config.spiralTightness
    
    // Add stellar formation clustering
    const clusterFactor = Math.random() < 0.3 ? 0.1 : 1.0 // 30% form in tight clusters
    const randomX = Math.pow(Math.random(), 0.75) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius * clusterFactor
    const randomY = (Math.random() - 0.5) * 0.1 * radius // Thin galactic disk
    const randomZ = Math.pow(Math.random(), 0.75) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius * clusterFactor

    return new THREE.Vector3(
      Math.cos(branchAngle + spinAngle) * radius + randomX,
      randomY,
      Math.sin(branchAngle + spinAngle) * radius + randomZ
    )
  }

  private generateSphericalPosition(radius: number): THREE.Vector3 {
    // Spherical distribution for halo, bulge, and core
    const theta = Math.random() * Math.PI * 2 // Azimuthal angle
    const phi = Math.acos(2 * Math.random() - 1) // Polar angle (uniform on sphere)
    
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    )
  }

  private calculateGravitationalWaveFreq(mass: number, radius: number): number {
    // Simplified gravitational wave frequency from orbital motion
    // f ≈ (1/π) * sqrt(GM/r³) for circular orbits
    const G = 6.674e-11 // Gravitational constant (m³/kg·s²)
    const M_sun = 1.989e30 // Solar mass (kg)
    const pc = 3.086e16 // Parsec to meters
    
    // Convert to SI units
    const massKg = mass * M_sun
    const radiusM = radius * 1000 * pc // Assume galaxy radius is in kpc
    
    // Calculate orbital frequency (Hz)
    const frequency = (1 / Math.PI) * Math.sqrt(G * massKg / Math.pow(radiusM, 3))
    
    // Convert to audible range for spline sound (0.1 Hz - 1000 Hz)
    return Math.max(0.1, Math.min(1000, frequency * 1e12)) // Scale factor for audibility
  }

  private calculateOrbitalResonance(radius: number, index: number): number {
    // Calculate which harmonic this star contributes to based on position
    if (!this.config.enableOrbitalResonance) return 1
    
    const normalizedRadius = radius / this.config.galaxyRadius
    const harmonicIndex = Math.floor(normalizedRadius * this.config.resonanceHarmonics.length)
    
    return this.config.resonanceHarmonics[Math.min(harmonicIndex, this.config.resonanceHarmonics.length - 1)]
  }

  private getStarProperties(type: StarType, mass: number): { color: THREE.Color; luminosity: number; size: number } {
    switch (type) {
      case 'main_sequence':
        // Mass-luminosity relation: L ∝ M^3.5
        const luminosity = Math.pow(mass, 3.5)
        // Main sequence color based on temperature/mass
        const hue = Math.max(0.0, Math.min(0.15, 0.15 - (mass - 0.5) * 0.05)) // Red to blue
        return {
          color: new THREE.Color().setHSL(hue, 0.8, 0.7),
          luminosity,
          size: Math.pow(mass, 0.8) * 0.02
        }
        
      case 'giant':
        return {
          color: new THREE.Color().setHSL(0.05, 0.9, 0.6), // Orange-red
          luminosity: mass * 100,
          size: mass * 0.08
        }
        
      case 'supergiant':
        return {
          color: new THREE.Color().setHSL(0.02, 1.0, 0.5), // Deep red
          luminosity: mass * 10000,
          size: mass * 0.15
        }
        
      case 'white_dwarf':
        return {
          color: new THREE.Color().setHSL(0.6, 0.3, 0.9), // White-blue
          luminosity: 0.001,
          size: 0.005
        }
        
      case 'neutron_star':
        return {
          color: new THREE.Color().setHSL(0.75, 1.0, 0.8), // Bright blue
          luminosity: 0.1,
          size: 0.002
        }
        
      case 'black_hole':
        return {
          color: new THREE.Color().setHSL(0.8, 0.5, 0.1), // Dark purple
          luminosity: 0, // No visible light
          size: mass * 0.001 // Schwarzschild radius representation
        }
        
      default:
        return {
          color: new THREE.Color().setHSL(0.1, 0.7, 0.7),
          luminosity: 1,
          size: 0.02
        }
    }
  }

  private generateDarkMatterHalo() {
    this.darkMatterNodes = []
    
    for (let i = 0; i < this.config.darkMatterNodes; i++) {
      // Dark matter follows NFW (Navarro-Frenk-White) profile
      const radius = this.generateNFWRadius()
      const position = this.generateSphericalPosition(radius)
      
      // Density decreases with radius (simplified NFW)
      const density = this.config.darkMatterDensity / (1 + Math.pow(radius / this.config.galaxyRadius, 2))
      
      // Low-frequency oscillations (dark matter physics)
      const oscillationFreq = 0.001 + Math.random() * 0.01 // 1mHz - 10mHz range
      
      // Influence radius based on density
      const influenceRadius = density * this.config.galaxyRadius * 0.1
      
      this.darkMatterNodes.push({
        position,
        density,
        oscillationFreq,
        influenceRadius
      })
    }
    
    console.log(`🌑 Generated ${this.darkMatterNodes.length} dark matter nodes`)
  }

  private generateNFWRadius(): number {
    // Simplified NFW profile sampling
    // More dark matter at intermediate radii, less at center and edge
    const u = Math.random()
    const scaleRadius = this.config.galaxyRadius * 0.2
    
    // Inverse transform sampling for NFW-like distribution
    return scaleRadius * Math.pow(u / (1 - u), 1/3) * 2
  }

  // Public methods for accessing data
  getStars(): StarData[] {
    return this.stars
  }

  getDarkMatterNodes(): DarkMatterNode[] {
    return this.darkMatterNodes
  }

  getStarsByZone(zone: GravitationalZone): StarData[] {
    return this.stars.filter(star => star.gravitationalZone === zone)
  }

  getGravitationalWaveSpectrum(): { frequency: number; amplitude: number }[] {
    // Combine all gravitational wave sources
    const spectrum = this.stars
      .filter(star => star.frequency > 0)
      .map(star => ({
        frequency: star.frequency,
        amplitude: star.mass / 10 // Amplitude proportional to mass
      }))
      .sort((a, b) => a.frequency - b.frequency)
    
    return spectrum
  }

  getOrbitalResonances(): { harmonic: number; stars: StarData[] }[] {
    // Group stars by resonance harmonic
    const resonanceMap = new Map<number, StarData[]>()
    
    this.stars.forEach(star => {
      const harmonic = star.resonanceHarmonic
      if (!resonanceMap.has(harmonic)) {
        resonanceMap.set(harmonic, [])
      }
      resonanceMap.get(harmonic)!.push(star)
    })
    
    return Array.from(resonanceMap.entries()).map(([harmonic, stars]) => ({
      harmonic,
      stars
    }))
  }

  // Create buffer attributes for Three.js rendering
  createStarBufferAttributes(): {
    positions: Float32Array
    colors: Float32Array
    sizes: Float32Array
    count: number
  } {
    const count = this.stars.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    this.stars.forEach((star, index) => {
      const i3 = index * 3
      
      positions[i3] = star.position.x
      positions[i3 + 1] = star.position.y
      positions[i3 + 2] = star.position.z
      
      colors[i3] = star.color.r
      colors[i3 + 1] = star.color.g
      colors[i3 + 2] = star.color.b
      
      sizes[index] = star.size
    })
    
    return { positions, colors, sizes, count }
  }

  // Update dark matter oscillations (for animation)
  updateDarkMatterOscillations(time: number) {
    this.darkMatterNodes.forEach(node => {
      // Oscillate density based on time and frequency
      const baseDensity = node.density
      const oscillation = Math.sin(time * node.oscillationFreq * Math.PI * 2) * this.config.oscillationAmplitude
      node.density = baseDensity + oscillation
    })
  }
}