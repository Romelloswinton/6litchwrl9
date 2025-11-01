import { useState, useEffect, useMemo, useCallback } from "react"
import { useHybridStore } from "../stores/hybridStore"
import { useStarfieldData } from "../components/EnhancedStarfield"

export interface SplineSoundConfig {
  enabled: boolean
  masterVolume: number
  gravitationalWaveGain: number
  orbitalResonanceGain: number
  darkMatterGain: number
  frequencyRange: [number, number]
}

export interface GravitationalWaveData {
  frequency: number
  amplitude: number
  zone: "core" | "bulge" | "disk" | "halo"
}

export interface OrbitalResonanceData {
  harmonic: number
  frequency: number
  amplitude: number
  starCount: number
}

export interface DarkMatterOscillation {
  frequency: number // Low frequency oscillation
  amplitude: number
  position: [number, number, number]
  density: number
}

export function useSplineSound(
  config: SplineSoundConfig = {
    enabled: false,
    masterVolume: 0.5,
    gravitationalWaveGain: 0.3,
    orbitalResonanceGain: 0.4,
    darkMatterGain: 0.1,
    frequencyRange: [20, 2000],
  }
) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [masterGain, setMasterGain] = useState<GainNode | null>(null)

  // Get real-time starfield physics data
  const starfieldData = useStarfieldData()

  // Initialize Web Audio API
  useEffect(() => {
    if (config.enabled && !audioContext) {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
      const gain = ctx.createGain()
      gain.gain.value = config.masterVolume
      gain.connect(ctx.destination)

      setAudioContext(ctx)
      setMasterGain(gain)

      console.log("🔊 Spline Sound: Audio context initialized")
    }

    return () => {
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close()
        setAudioContext(null)
        setMasterGain(null)
      }
    }
  }, [config.enabled])

  // Process gravitational wave frequencies
  const gravitationalWaves = useMemo((): GravitationalWaveData[] => {
    if (!starfieldData.gravitationalWaveSpectrum.length) return []

    return starfieldData.gravitationalWaveSpectrum
      .filter(
        (wave) =>
          wave.frequency >= config.frequencyRange[0] &&
          wave.frequency <= config.frequencyRange[1]
      )
      .slice(0, 20) // Limit to prevent audio overload
      .map((wave, index) => {
        // Determine zone based on frequency (higher mass = lower frequency = inner zones)
        let zone: "core" | "bulge" | "disk" | "halo"
        if (wave.frequency < 50) zone = "core" // Supermassive objects
        else if (wave.frequency < 200) zone = "bulge" // Massive stars
        else if (wave.frequency < 800) zone = "disk" // Main sequence stars
        else zone = "halo" // Low mass stars

        return {
          frequency: wave.frequency,
          amplitude: Math.min(
            0.1,
            wave.amplitude * config.gravitationalWaveGain
          ),
          zone,
        }
      })
  }, [
    starfieldData.gravitationalWaveSpectrum,
    config.frequencyRange,
    config.gravitationalWaveGain,
  ])

  // Process orbital resonance harmonics
  const orbitalResonances = useMemo((): OrbitalResonanceData[] => {
    return starfieldData.orbitalResonances
      .map((resonance) => {
        // Convert harmonic to frequency based on galactic rotation
        const baseFreq = 110 // A2 note as fundamental
        const frequency = baseFreq * resonance.harmonic

        // Amplitude based on number of stars in resonance
        const amplitude = Math.min(
          0.05,
          (resonance.stars.length / 1000) * config.orbitalResonanceGain
        )

        return {
          harmonic: resonance.harmonic,
          frequency: Math.min(frequency, config.frequencyRange[1]),
          amplitude,
          starCount: resonance.stars.length,
        }
      })
      .filter((res) => res.frequency >= config.frequencyRange[0])
  }, [
    starfieldData.orbitalResonances,
    config.orbitalResonanceGain,
    config.frequencyRange,
  ])

  // Process dark matter oscillations
  const darkMatterOscillations = useMemo((): DarkMatterOscillation[] => {
    return starfieldData.darkMatterNodes
      .slice(0, 10) // Limit for performance
      .map((node) => ({
        frequency: node.oscillationFreq * 1000, // Convert to audible range
        amplitude: node.density * config.darkMatterGain * 0.02,
        position: [node.position.x, node.position.y, node.position.z] as [
          number,
          number,
          number
        ],
        density: node.density,
      }))
      .filter(
        (osc) =>
          osc.frequency >= config.frequencyRange[0] &&
          osc.frequency <= config.frequencyRange[1]
      )
  }, [
    starfieldData.darkMatterNodes,
    config.darkMatterGain,
    config.frequencyRange,
  ])

  // Create and manage oscillators for gravitational waves
  const createGravitationalWaveOscillators = useCallback(() => {
    if (!audioContext || !masterGain) return []

    return gravitationalWaves.map((wave) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine" // Pure tones for gravitational waves
      oscillator.frequency.setValueAtTime(
        wave.frequency,
        audioContext.currentTime
      )

      gainNode.gain.setValueAtTime(wave.amplitude, audioContext.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(masterGain)

      return { oscillator, gainNode, data: wave }
    })
  }, [audioContext, masterGain, gravitationalWaves])

  // Create and manage oscillators for orbital resonances
  const createOrbitalResonanceOscillators = useCallback(() => {
    if (!audioContext || !masterGain) return []

    return orbitalResonances.map((resonance) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sawtooth" // Harmonic-rich for resonances
      oscillator.frequency.setValueAtTime(
        resonance.frequency,
        audioContext.currentTime
      )

      gainNode.gain.setValueAtTime(
        resonance.amplitude,
        audioContext.currentTime
      )

      oscillator.connect(gainNode)
      gainNode.connect(masterGain)

      return { oscillator, gainNode, data: resonance }
    })
  }, [audioContext, masterGain, orbitalResonances])

  // Create low-frequency oscillators for dark matter
  const createDarkMatterOscillators = useCallback(() => {
    if (!audioContext || !masterGain) return []

    return darkMatterOscillations.map((osc) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      oscillator.type = "square" // Quantum-like oscillations
      oscillator.frequency.setValueAtTime(
        osc.frequency,
        audioContext.currentTime
      )

      // Low-pass filter for dark matter "mystery"
      filter.type = "lowpass"
      filter.frequency.setValueAtTime(
        osc.frequency * 2,
        audioContext.currentTime
      )
      filter.Q.setValueAtTime(5, audioContext.currentTime)

      gainNode.gain.setValueAtTime(osc.amplitude, audioContext.currentTime)

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(masterGain)

      return { oscillator, gainNode, filter, data: osc }
    })
  }, [audioContext, masterGain, darkMatterOscillations])

  // Start spline sound generation
  const startSplineSound = useCallback(async () => {
    if (!audioContext || !masterGain) return

    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume()
      }

      console.log("🎵 Starting Spline Sound Generation...")
      console.log(
        `   Gravitational Waves: ${gravitationalWaves.length} frequencies`
      )
      console.log(
        `   Orbital Resonances: ${orbitalResonances.length} harmonics`
      )
      console.log(
        `   Dark Matter Oscillations: ${darkMatterOscillations.length} nodes`
      )

      // Create and start all oscillators
      const gwOscillators = createGravitationalWaveOscillators()
      const orOscillators = createOrbitalResonanceOscillators()
      const dmOscillators = createDarkMatterOscillators()

      const currentTime = audioContext.currentTime

      // Start gravitational wave oscillators
      gwOscillators.forEach(({ oscillator }) => {
        oscillator.start(currentTime)
      })

      // Start orbital resonance oscillators
      orOscillators.forEach(({ oscillator }) => {
        oscillator.start(currentTime)
      })

      // Start dark matter oscillators
      dmOscillators.forEach(({ oscillator }) => {
        oscillator.start(currentTime)
      })

      setIsPlaying(true)

      // Store oscillators for cleanup
      const allOscillators = [
        ...gwOscillators,
        ...orOscillators,
        ...dmOscillators,
      ]

      // Auto-stop after 30 seconds to prevent infinite audio
      setTimeout(() => {
        allOscillators.forEach((osc) => {
          if ("oscillator" in osc) {
            osc.oscillator.stop()
          }
        })
        setIsPlaying(false)
      }, 30000)
    } catch (error) {
      console.error("❌ Spline Sound Error:", error)
      setIsPlaying(false)
    }
  }, [
    audioContext,
    masterGain,
    gravitationalWaves,
    orbitalResonances,
    darkMatterOscillations,
    createGravitationalWaveOscillators,
    createOrbitalResonanceOscillators,
    createDarkMatterOscillators,
  ])

  // Stop all sound generation
  const stopSplineSound = useCallback(() => {
    if (audioContext) {
      // Note: In a real implementation, we'd track active oscillators
      // For now, we'll just suspend the audio context
      audioContext.suspend()
      setIsPlaying(false)
      console.log("🔇 Spline Sound Stopped")
    }
  }, [audioContext])

  // Update master volume
  useEffect(() => {
    if (masterGain) {
      masterGain.gain.setValueAtTime(
        config.masterVolume,
        audioContext?.currentTime || 0
      )
    }
  }, [config.masterVolume, masterGain, audioContext])

  return {
    // Audio state
    isInitialized: !!audioContext,
    isPlaying,

    // Audio controls
    start: startSplineSound,
    stop: stopSplineSound,

    // Physics data for visualization
    gravitationalWaves,
    orbitalResonances,
    darkMatterOscillations,

    // Statistics
    stats: {
      totalFrequencies:
        gravitationalWaves.length +
        orbitalResonances.length +
        darkMatterOscillations.length,
      frequencyRange: config.frequencyRange,
      starCount: starfieldData.gravitationalWaveSpectrum.length,
      resonanceCount: starfieldData.orbitalResonances.length,
      darkMatterNodes: starfieldData.darkMatterNodes.length,
    },
  }
}
