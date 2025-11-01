import * as THREE from 'three'
import type { GalaxyConfig, GalaxyParticle, SpiralArmConfig } from '../../types/galaxy'

export class GalaxyGenerator {
  private config: GalaxyConfig
  private particles: GalaxyParticle[] = []

  constructor(config: GalaxyConfig) {
    this.config = config
  }

  updateConfig(newConfig: Partial<GalaxyConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  generateSpiralArm(armConfig: SpiralArmConfig): GalaxyParticle[] {
    const particles: GalaxyParticle[] = []
    const { armIndex, particleCount, startAngle, tightness, width } = armConfig

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount
      const radius = progress * this.config.radius
      
      // Spiral equation
      const angle = startAngle + radius * tightness
      
      // Add some randomness
      const radiusVariation = (Math.random() - 0.5) * width
      const angleVariation = (Math.random() - 0.5) * 0.2
      const heightVariation = (Math.random() - 0.5) * 0.5 * (1 - progress)

      const finalRadius = radius + radiusVariation
      const finalAngle = angle + angleVariation

      const position = new THREE.Vector3(
        Math.cos(finalAngle) * finalRadius,
        heightVariation,
        Math.sin(finalAngle) * finalRadius
      )

      // Color based on distance from center
      const coreInfluence = Math.max(0, 1 - finalRadius / this.config.coreSize)
      const armInfluence = 1 - coreInfluence
      const dustInfluence = Math.pow(progress, 2) * 0.3

      const coreColor = new THREE.Color(this.config.coreColor)
      const armColor = new THREE.Color(this.config.armColor)
      const dustColor = new THREE.Color(this.config.dustColor)

      let finalColor = armColor.clone()
      if (coreInfluence > 0.1) {
        finalColor.lerp(coreColor, coreInfluence)
      }
      if (dustInfluence > 0.2) {
        finalColor.lerp(dustColor, dustInfluence * 0.5)
      }

      // Size based on core proximity and randomness
      const size = (coreInfluence * 2 + 0.5) * (0.5 + Math.random() * 0.5)

      // Velocity for animation
      const velocity = new THREE.Vector3(
        -Math.sin(finalAngle) * finalRadius * 0.001,
        0,
        Math.cos(finalAngle) * finalRadius * 0.001
      )

      particles.push({
        position,
        color: finalColor,
        size,
        velocity,
        age: Math.random() * 1000,
      })
    }

    return particles
  }

  generateGalaxy(): GalaxyParticle[] {
    this.particles = []
    const particlesPerArm = Math.floor(this.config.particleCount / this.config.spiralArms)
    const remainingParticles = this.config.particleCount % this.config.spiralArms

    // Generate spiral arms
    for (let arm = 0; arm < this.config.spiralArms; arm++) {
      const armConfig: SpiralArmConfig = {
        armIndex: arm,
        particleCount: particlesPerArm + (arm < remainingParticles ? 1 : 0),
        startAngle: (arm / this.config.spiralArms) * Math.PI * 2,
        tightness: this.config.spiralTightness,
        width: this.config.radius * 0.1,
      }

      const armParticles = this.generateSpiralArm(armConfig)
      this.particles.push(...armParticles)
    }

    // Add some random background stars
    const backgroundStars = Math.floor(this.config.particleCount * 0.1)
    for (let i = 0; i < backgroundStars; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * this.config.radius * 3,
        (Math.random() - 0.5) * this.config.radius * 2,
        (Math.random() - 0.5) * this.config.radius * 3
      )

      const color = new THREE.Color().setHSL(
        Math.random(),
        0.3 + Math.random() * 0.3,
        0.8 + Math.random() * 0.2
      )

      this.particles.push({
        position,
        color,
        size: 0.2 + Math.random() * 0.3,
        velocity: new THREE.Vector3(),
        age: Math.random() * 1000,
      })
    }

    return this.particles
  }

  getParticles(): GalaxyParticle[] {
    return this.particles
  }

  updateParticles(deltaTime: number, rotationSpeed: number = 0.001) {
    this.particles.forEach(particle => {
      // Update age
      particle.age += deltaTime

      // Rotate particles around the center
      const distance = Math.sqrt(particle.position.x ** 2 + particle.position.z ** 2)
      const angle = Math.atan2(particle.position.z, particle.position.x)
      const newAngle = angle + rotationSpeed * deltaTime * (1 + distance * 0.1)

      particle.position.x = Math.cos(newAngle) * distance
      particle.position.z = Math.sin(newAngle) * distance

      // Add slight vertical movement
      particle.position.y += Math.sin(particle.age * 0.001) * 0.001
    })
  }

  exportAsBufferAttributes() {
    const positions = new Float32Array(this.particles.length * 3)
    const colors = new Float32Array(this.particles.length * 3)
    const sizes = new Float32Array(this.particles.length)

    this.particles.forEach((particle, index) => {
      const i3 = index * 3

      positions[i3] = particle.position.x
      positions[i3 + 1] = particle.position.y
      positions[i3 + 2] = particle.position.z

      colors[i3] = particle.color.r
      colors[i3 + 1] = particle.color.g
      colors[i3 + 2] = particle.color.b

      sizes[index] = particle.size
    })

    return { positions, colors, sizes }
  }

  static createPreset(presetName: string): GalaxyConfig {
    const presets: Record<string, GalaxyConfig> = {
      milkyWay: {
        particleCount: 100000,
        radius: 10,
        spiralArms: 4,
        spiralTightness: 2.5,
        coreSize: 2,
        coreColor: '#ffd700',
        armColor: '#87ceeb',
        dustColor: '#8b4513',
      },
      andromeda: {
        particleCount: 150000,
        radius: 12,
        spiralArms: 2,
        spiralTightness: 3,
        coreSize: 1.8,
        coreColor: '#ff6b6b',
        armColor: '#4ecdc4',
        dustColor: '#45b7d1',
      },
      whirlpool: {
        particleCount: 80000,
        radius: 8,
        spiralArms: 2,
        spiralTightness: 4,
        coreSize: 1.2,
        coreColor: '#ff9ff3',
        armColor: '#54a0ff',
        dustColor: '#5f27cd',
      },
    }

    return presets[presetName] || presets.milkyWay
  }
}