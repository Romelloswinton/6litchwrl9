/**
 * Audio Manager
 *
 * Handles procedural audio generation for immersive space ambience
 * Features:
 * - Deep space drone sounds
 * - Cosmic reverb effects
 * - Dynamic volume control
 * - Scene-specific audio profiles
 */

export type AudioProfile = 'galaxy' | 'solarSystem' | 'blackHole' | 'planet'

interface AudioSettings {
  masterVolume: number
  isMuted: boolean
}

export class AudioManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private filters: BiquadFilterNode[] = []
  private audioElement: HTMLAudioElement | null = null
  private audioSourceNode: MediaElementAudioSourceNode | null = null
  private settings: AudioSettings = {
    masterVolume: 0.3,
    isMuted: false
  }
  private currentProfile: AudioProfile | null = null
  private isPlaying: boolean = false
  private usingFileAudio: boolean = false

  constructor() {
    // Initialize on first user interaction due to browser autoplay policies
    this.initialize()
  }

  /**
   * Initialize Web Audio API context
   */
  private initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = this.settings.isMuted ? 0 : this.settings.masterVolume
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  /**
   * Start playing ambient audio for a specific scene
   */
  async play(profile: AudioProfile) {
    if (!this.audioContext) {
      this.initialize()
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current audio if playing
    if (this.isPlaying) {
      this.stop()
    }

    this.currentProfile = profile
    this.isPlaying = true

    // Generate audio based on profile
    switch (profile) {
      case 'galaxy':
        this.createGalaxyAmbience()
        break
      case 'solarSystem':
        this.createSolarSystemAmbience()
        break
      case 'blackHole':
        this.createBlackHoleAmbience()
        break
      case 'planet':
        this.createPlanetAmbience()
        break
    }
  }

  /**
   * Play audio from a file (e.g., MP3)
   */
  async playFile(audioPath: string) {
    if (!this.audioContext) {
      this.initialize()
    }

    // Resume audio context if suspended
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current audio if playing
    if (this.isPlaying) {
      this.stop()
    }

    try {
      // Create audio element if it doesn't exist
      if (!this.audioElement) {
        this.audioElement = new Audio()
        this.audioElement.loop = true
        this.audioElement.volume = this.settings.isMuted ? 0 : this.settings.masterVolume
      }

      // Set the source
      this.audioElement.src = audioPath

      // Create source node if needed
      if (!this.audioSourceNode && this.audioContext && this.masterGain) {
        this.audioSourceNode = this.audioContext.createMediaElementSource(this.audioElement)
        this.audioSourceNode.connect(this.masterGain)
      }

      // Play the audio
      await this.audioElement.play()
      this.isPlaying = true
      this.usingFileAudio = true
      console.log('🎵 Playing audio file:', audioPath)
    } catch (error) {
      console.error('Failed to play audio file:', error)
      throw error
    }
  }

  /**
   * Stop all audio
   */
  stop() {
    // Stop oscillators
    this.oscillators.forEach(osc => {
      try {
        osc.stop()
        osc.disconnect()
      } catch (e) {
        // Oscillator may already be stopped
      }
    })
    this.filters.forEach(filter => filter.disconnect())
    this.oscillators = []
    this.filters = []

    // Stop audio file
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }

    this.isPlaying = false
    this.usingFileAudio = false
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    if (this.masterGain && !this.settings.isMuted) {
      this.masterGain.gain.setTargetAtTime(
        this.settings.masterVolume,
        this.audioContext!.currentTime,
        0.1
      )
    }
    // Also update audio element if using file audio
    if (this.audioElement && !this.settings.isMuted) {
      this.audioElement.volume = this.settings.masterVolume
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.settings.isMuted = !this.settings.isMuted
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.settings.isMuted ? 0 : this.settings.masterVolume,
        this.audioContext!.currentTime,
        0.1
      )
    }
    // Also update audio element if using file audio
    if (this.audioElement) {
      this.audioElement.volume = this.settings.isMuted ? 0 : this.settings.masterVolume
    }
    return this.settings.isMuted
  }

  /**
   * Get current settings
   */
  getSettings() {
    return { ...this.settings }
  }

  /**
   * Create galaxy ambience - ethereal, distant, mysterious
   */
  private createGalaxyAmbience() {
    if (!this.audioContext || !this.masterGain) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    // Deep bass drone (foundation)
    const bass = this.createOscillator(40, 'sine', 0.15, now)

    // Mid-range drone with slight detuning
    const mid1 = this.createOscillator(110, 'sine', 0.08, now)
    const mid2 = this.createOscillator(112, 'sine', 0.08, now) // Slight detune for beating effect

    // High ethereal tones
    const high1 = this.createOscillator(220, 'triangle', 0.04, now)
    const high2 = this.createOscillator(330, 'triangle', 0.03, now)

    // Add slow LFO modulation for evolving soundscape
    this.addLFOModulation(bass, 0.1, 5)
    this.addLFOModulation(mid1, 0.15, 8)
  }

  /**
   * Create solar system ambience - warmer, more present
   */
  private createSolarSystemAmbience() {
    if (!this.audioContext || !this.masterGain) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    // Warm foundation
    const bass = this.createOscillator(55, 'sine', 0.18, now)

    // Harmonic layers
    const mid1 = this.createOscillator(165, 'sine', 0.1, now)
    const mid2 = this.createOscillator(220, 'triangle', 0.06, now)

    // Subtle high sparkle
    const high = this.createOscillator(440, 'sine', 0.03, now)

    // Gentle modulation
    this.addLFOModulation(bass, 0.08, 3)
    this.addLFOModulation(high, 0.2, 12)
  }

  /**
   * Create black hole ambience - deep, ominous, powerful
   */
  private createBlackHoleAmbience() {
    if (!this.audioContext || !this.masterGain) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    // Very deep sub-bass (gravitational rumble)
    const subBass = this.createOscillator(30, 'sine', 0.25, now)

    // Dark mid-range
    const mid = this.createOscillator(80, 'sawtooth', 0.12, now, 0.3) // Heavy filtering

    // Unsettling high frequency
    const high1 = this.createOscillator(1200, 'sine', 0.02, now)
    const high2 = this.createOscillator(1800, 'sine', 0.015, now)

    // Aggressive modulation for tension
    this.addLFOModulation(subBass, 0.15, 2)
    this.addLFOModulation(mid, 0.25, 4)
    this.addLFOModulation(high1, 0.5, 7)
  }

  /**
   * Create planet ambience - calm, focused, grounded
   */
  private createPlanetAmbience() {
    if (!this.audioContext || !this.masterGain) return

    const ctx = this.audioContext
    const now = ctx.currentTime

    // Grounded bass
    const bass = this.createOscillator(60, 'sine', 0.16, now)

    // Harmonic mid layer
    const mid = this.createOscillator(180, 'triangle', 0.08, now)

    // Subtle atmosphere
    const high = this.createOscillator(360, 'sine', 0.04, now)

    // Slow, gentle modulation
    this.addLFOModulation(bass, 0.05, 2)
    this.addLFOModulation(high, 0.15, 6)
  }

  /**
   * Create an oscillator with envelope and filtering
   */
  private createOscillator(
    frequency: number,
    type: OscillatorType,
    volume: number,
    startTime: number,
    filterFreq?: number
  ): OscillatorNode {
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not initialized')
    }

    const ctx = this.audioContext
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.value = frequency

    // Optional low-pass filter for darker tones
    if (filterFreq) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = frequency * filterFreq
      filter.Q.value = 1
      osc.connect(filter)
      filter.connect(gain)
      this.filters.push(filter)
    } else {
      osc.connect(gain)
    }

    // Fade in
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(volume, startTime + 2)

    gain.connect(this.masterGain)

    osc.start(startTime)
    this.oscillators.push(osc)

    return osc
  }

  /**
   * Add LFO (Low Frequency Oscillator) modulation for evolving sound
   */
  private addLFOModulation(
    targetOscillator: OscillatorNode,
    depth: number,
    rate: number
  ) {
    if (!this.audioContext) return

    const ctx = this.audioContext
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    lfo.type = 'sine'
    lfo.frequency.value = rate
    lfoGain.gain.value = depth

    lfo.connect(lfoGain)
    lfoGain.connect(targetOscillator.frequency)

    lfo.start()
    this.oscillators.push(lfo)
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}
