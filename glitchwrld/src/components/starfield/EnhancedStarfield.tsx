import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointsMaterial, AdditiveBlending } from 'three'
import { useHybridStore } from '../../stores/hybridStore'
import { StarfieldGenerator, StarfieldConfig } from '../../utils/galaxy/starfieldGenerator'
import * as THREE from 'three'

interface EnhancedStarfieldProps {
  enableGravitationalWaves?: boolean
  enableOrbitalResonance?: boolean
  enableDarkMatter?: boolean
  starCount?: number
}

export function EnhancedStarfield({
  enableGravitationalWaves = true,
  enableOrbitalResonance = true,
  enableDarkMatter = true,
  starCount = 50000
}: EnhancedStarfieldProps) {
  const starfieldRef = useRef<Points>(null!)
  const darkMatterRef = useRef<Points>(null!)
  const materialRef = useRef<PointsMaterial>(null!)
  
  // Expose starfield reference for planet synchronization
  useEffect(() => {
    if (starfieldRef.current) {
      // Store reference globally for IllusoryPlanets to access
      (window as any).starfieldRef = starfieldRef.current
    }
  }, [starfieldRef])
  
  const {
    galaxyRadius,
    spiralArms,
    spiralTightness,
    particleCount,
    isAnimating
  } = useHybridStore()

  // Generate enhanced starfield with gravitational physics
  const starfieldGenerator = useMemo(() => {
    const config: StarfieldConfig = {
      galaxyRadius: galaxyRadius * 3, // Extend beyond main galaxy
      spiralArms,
      spiralTightness,
      starCount: Math.min(starCount, particleCount * 0.5), // Don't overwhelm main galaxy
      
      enableGravitationalWaves,
      centralBlackHoleMass: 4.1e6, // Sagittarius A*
      
      enableOrbitalResonance,
      resonanceHarmonics: [1, 2, 3, 5, 8, 13, 21], // Fibonacci sequence for natural resonances
      
      darkMatterDensity: 0.3,
      darkMatterNodes: enableDarkMatter ? 500 : 0,
      oscillationAmplitude: 0.05
    }
    
    console.log('🌌 Generating enhanced starfield with config:', config)
    const generator = new StarfieldGenerator(config)
    
    // Log gravitational wave spectrum
    if (enableGravitationalWaves) {
      const gwSpectrum = generator.getGravitationalWaveSpectrum()
      console.log(`🌊 Gravitational wave spectrum: ${gwSpectrum.length} frequencies from ${gwSpectrum[0]?.frequency.toFixed(3)}Hz to ${gwSpectrum[gwSpectrum.length-1]?.frequency.toFixed(3)}Hz`)
    }
    
    // Log orbital resonances
    if (enableOrbitalResonance) {
      const resonances = generator.getOrbitalResonances()
      console.log('🎵 Orbital resonances:', resonances.map(r => `${r.harmonic}: ${r.stars.length} stars`))
    }
    
    return generator
  }, [galaxyRadius, spiralArms, spiralTightness, starCount, enableGravitationalWaves, enableOrbitalResonance, enableDarkMatter, particleCount])

  // Create buffer data for stars
  const starBufferData = useMemo(() => {
    return starfieldGenerator.createStarBufferAttributes()
  }, [starfieldGenerator])

  // Create buffer data for dark matter visualization
  const darkMatterBufferData = useMemo(() => {
    if (!enableDarkMatter) {
      return { positions: new Float32Array(0), colors: new Float32Array(0), sizes: new Float32Array(0), count: 0 }
    }
    
    const nodes = starfieldGenerator.getDarkMatterNodes()
    const count = nodes.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    nodes.forEach((node, index) => {
      const i3 = index * 3
      
      positions[i3] = node.position.x
      positions[i3 + 1] = node.position.y
      positions[i3 + 2] = node.position.z
      
      // Dark matter visualization - deep purple/black
      const intensity = Math.min(1, node.density * 2)
      colors[i3] = 0.1 * intensity
      colors[i3 + 1] = 0.0
      colors[i3 + 2] = 0.2 * intensity
      
      sizes[index] = node.influenceRadius * 0.1
    })
    
    return { positions, colors, sizes, count }
  }, [starfieldGenerator, enableDarkMatter])

  // Animation loop for dark matter oscillations and gravitational effects
  useFrame((state, delta) => {
    if (!isAnimating) return

    const time = state.clock.elapsedTime
    
    // Update dark matter oscillations
    if (enableDarkMatter && darkMatterRef.current) {
      starfieldGenerator.updateDarkMatterOscillations(time)
      
      // Update dark matter visualization colors based on density oscillations
      const nodes = starfieldGenerator.getDarkMatterNodes()
      const colorAttribute = darkMatterRef.current.geometry.attributes.color
      
      if (colorAttribute) {
        nodes.forEach((node, index) => {
          const i3 = index * 3
          const intensity = Math.min(1, Math.abs(node.density) * 3)
          
          colorAttribute.array[i3] = 0.1 * intensity
          colorAttribute.array[i3 + 1] = 0.05 * intensity
          colorAttribute.array[i3 + 2] = 0.3 * intensity
        })
        
        colorAttribute.needsUpdate = true
      }
    }
    
    // Subtle rotation based on galactic dynamics
    if (starfieldRef.current) {
      starfieldRef.current.rotation.y += delta * 0.001 // Very slow rotation
    }
  })

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.blending = AdditiveBlending
      materialRef.current.transparent = true
      materialRef.current.opacity = 0.8
    }
  }, [])

  return (
    <group>
      {/* Main starfield with gravitational zones */}
      <points ref={starfieldRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[starBufferData.positions, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[starBufferData.colors, 3]}
            attach="attributes-color"
          />
          <bufferAttribute
            args={[starBufferData.sizes, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.01}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          alphaTest={0.001}
          depthWrite={false}
        />
      </points>

      {/* Dark matter halo visualization */}
      {enableDarkMatter && darkMatterBufferData.count > 0 && (
        <points ref={darkMatterRef}>
          <bufferGeometry>
            <bufferAttribute
              args={[darkMatterBufferData.positions, 3]}
              attach="attributes-position"
            />
            <bufferAttribute
              args={[darkMatterBufferData.colors, 3]}
              attach="attributes-color"
            />
            <bufferAttribute
              args={[darkMatterBufferData.sizes, 1]}
              attach="attributes-size"
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            sizeAttenuation={true}
            vertexColors={true}
            transparent={true}
            opacity={0.3}
            alphaTest={0.001}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      )}
    </group>
  )
}

// Export generator access for spline sound integration
export function useStarfieldData() {
  const {
    galaxyRadius,
    spiralArms,
    spiralTightness
  } = useHybridStore()

  const starfieldGenerator = useMemo(() => {
    const config: StarfieldConfig = {
      galaxyRadius: galaxyRadius * 3,
      spiralArms,
      spiralTightness,
      starCount: 10000, // Smaller set for data access
      enableGravitationalWaves: true,
      enableOrbitalResonance: true,
      centralBlackHoleMass: 4.1e6,
      resonanceHarmonics: [1, 2, 3, 5, 8, 13],
      darkMatterDensity: 0.3,
      darkMatterNodes: 100,
      oscillationAmplitude: 0.05
    }
    
    return new StarfieldGenerator(config)
  }, [galaxyRadius, spiralArms, spiralTightness])

  return {
    gravitationalWaveSpectrum: starfieldGenerator.getGravitationalWaveSpectrum(),
    orbitalResonances: starfieldGenerator.getOrbitalResonances(),
    darkMatterNodes: starfieldGenerator.getDarkMatterNodes(),
    starsByZone: {
      core: starfieldGenerator.getStarsByZone('core'),
      bulge: starfieldGenerator.getStarsByZone('bulge'), 
      disk: starfieldGenerator.getStarsByZone('disk'),
      halo: starfieldGenerator.getStarsByZone('halo')
    }
  }
}