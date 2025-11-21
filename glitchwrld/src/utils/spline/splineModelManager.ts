// glitchwrld/src/utils/spline/splineModelManager.ts

import * as THREE from 'three'

/**
 * Configuration for a single Spline model
 */
export interface SplineModelConfig {
  /** Unique identifier for the model */
  id: string
  /** Display name */
  name: string
  /** Spline scene URL (.splinecode) */
  url: string
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Scale factor */
  scale?: number
  /** Whether to auto-position along galaxy spiral arms */
  autoPosition?: boolean
  /** Whether to align with solar system planets */
  alignWithPlanets?: boolean
  /** Whether model is currently visible */
  visible?: boolean
  /** Animation settings */
  animation?: {
    /** Enable rotation animation */
    rotate?: boolean
    /** Rotation speed multiplier */
    rotationSpeed?: number
    /** Enable pulsing scale animation */
    pulse?: boolean
    /** Pulse speed multiplier */
    pulseSpeed?: number
    /** Enable orbital motion around center */
    orbit?: boolean
    /** Orbital speed */
    orbitSpeed?: number
  }
  /** Interaction settings */
  interaction?: {
    /** Enable hover effects */
    hoverable?: boolean
    /** Enable click interaction */
    clickable?: boolean
    /** Click callback */
    onClick?: (objectName: string) => void
    /** Hover callback */
    onHover?: (objectName: string) => void
  }
  /** XR-specific settings */
  xr?: {
    /** Scale in AR mode */
    arScale?: number
    /** Scale in VR mode */
    vrScale?: number
    /** Position offset in AR mode */
    arPositionOffset?: [number, number, number]
  }
  /** Layer assignment */
  layer?: string
  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * Manager class for Spline models in the galaxy scene
 */
export class SplineModelManager {
  private models: Map<string, SplineModelConfig> = new Map()
  private loadedScenes: Map<string, any> = new Map()

  /**
   * Register a new Spline model
   */
  registerModel(config: SplineModelConfig): void {
    const fullConfig: SplineModelConfig = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      autoPosition: false,
      alignWithPlanets: false,
      visible: true,
      ...config,
      animation: {
        rotate: false,
        rotationSpeed: 1,
        pulse: false,
        pulseSpeed: 1,
        orbit: false,
        orbitSpeed: 1,
        ...config.animation,
      },
      interaction: {
        hoverable: true,
        clickable: true,
        ...config.interaction,
      },
      xr: {
        arScale: 0.1,
        vrScale: 0.3,
        arPositionOffset: [0, -0.5, 0],
        ...config.xr,
      },
    }

    this.models.set(config.id, fullConfig)
    console.log(`✅ Registered Spline model: ${config.name} (${config.id})`)
  }

  /**
   * Unregister a model
   */
  unregisterModel(id: string): void {
    this.models.delete(id)
    this.loadedScenes.delete(id)
    console.log(`🗑️ Unregistered Spline model: ${id}`)
  }

  /**
   * Get a model configuration
   */
  getModel(id: string): SplineModelConfig | undefined {
    return this.models.get(id)
  }

  /**
   * Get all registered models
   */
  getAllModels(): SplineModelConfig[] {
    return Array.from(this.models.values())
  }

  /**
   * Get models by layer
   */
  getModelsByLayer(layer: string): SplineModelConfig[] {
    return this.getAllModels().filter((model) => model.layer === layer)
  }

  /**
   * Get visible models
   */
  getVisibleModels(): SplineModelConfig[] {
    return this.getAllModels().filter((model) => model.visible)
  }

  /**
   * Update a model configuration
   */
  updateModel(id: string, updates: Partial<SplineModelConfig>): void {
    const existing = this.models.get(id)
    if (!existing) {
      console.warn(`⚠️ Model ${id} not found`)
      return
    }

    this.models.set(id, {
      ...existing,
      ...updates,
      animation: { ...existing.animation, ...updates.animation },
      interaction: { ...existing.interaction, ...updates.interaction },
      xr: { ...existing.xr, ...updates.xr },
    })

    console.log(`🔄 Updated Spline model: ${id}`)
  }

  /**
   * Set model visibility
   */
  setModelVisibility(id: string, visible: boolean): void {
    this.updateModel(id, { visible })
  }

  /**
   * Toggle model visibility
   */
  toggleModelVisibility(id: string): void {
    const model = this.getModel(id)
    if (model) {
      this.setModelVisibility(id, !model.visible)
    }
  }

  /**
   * Set model position
   */
  setModelPosition(id: string, position: [number, number, number]): void {
    this.updateModel(id, { position })
  }

  /**
   * Set model rotation
   */
  setModelRotation(id: string, rotation: [number, number, number]): void {
    this.updateModel(id, { rotation })
  }

  /**
   * Set model scale
   */
  setModelScale(id: string, scale: number): void {
    this.updateModel(id, { scale })
  }

  /**
   * Enable animation for a model
   */
  enableAnimation(
    id: string,
    type: 'rotate' | 'pulse' | 'orbit',
    speed = 1
  ): void {
    const model = this.getModel(id)
    if (!model) return

    const animation = { ...model.animation }
    animation[type] = true

    // Update the corresponding speed property
    if (type === 'rotate') {
      animation.rotationSpeed = speed
    } else if (type === 'pulse') {
      animation.pulseSpeed = speed
    } else if (type === 'orbit') {
      animation.orbitSpeed = speed
    }

    this.updateModel(id, { animation })
  }

  /**
   * Disable animation for a model
   */
  disableAnimation(id: string, type: 'rotate' | 'pulse' | 'orbit'): void {
    const model = this.getModel(id)
    if (!model) return

    const animation = { ...model.animation }
    animation[type] = false

    this.updateModel(id, { animation })
  }

  /**
   * Mark scene as loaded
   */
  markSceneLoaded(id: string, scene: any): void {
    this.loadedScenes.set(id, scene)
    console.log(`✅ Spline scene loaded: ${id}`)
  }

  /**
   * Check if scene is loaded
   */
  isSceneLoaded(id: string): boolean {
    return this.loadedScenes.has(id)
  }

  /**
   * Get loaded scene
   */
  getLoadedScene(id: string): any {
    return this.loadedScenes.get(id)
  }

  /**
   * Clear all models
   */
  clear(): void {
    this.models.clear()
    this.loadedScenes.clear()
    console.log('🗑️ Cleared all Spline models')
  }

  /**
   * Export models configuration as JSON
   */
  exportConfig(): string {
    return JSON.stringify(Array.from(this.models.values()), null, 2)
  }

  /**
   * Import models from JSON configuration
   */
  importConfig(json: string): void {
    try {
      const configs = JSON.parse(json) as SplineModelConfig[]
      configs.forEach((config) => this.registerModel(config))
      console.log(`✅ Imported ${configs.length} Spline models`)
    } catch (error) {
      console.error('❌ Failed to import Spline models:', error)
    }
  }

  /**
   * Create a quick model preset
   */
  static createPreset(
    type: 'spaceship' | 'planet' | 'asteroid' | 'nebula' | 'station',
    id: string,
    url: string,
    position?: [number, number, number]
  ): SplineModelConfig {
    const presets: Record<string, Partial<SplineModelConfig>> = {
      spaceship: {
        scale: 0.5,
        animation: {
          rotate: true,
          rotationSpeed: 0.5,
          orbit: true,
          orbitSpeed: 0.3,
        },
        xr: {
          arScale: 0.05,
          vrScale: 0.2,
        },
      },
      planet: {
        scale: 1.0,
        alignWithPlanets: true,
        animation: {
          rotate: true,
          rotationSpeed: 0.2,
          pulse: true,
          pulseSpeed: 0.5,
        },
        xr: {
          arScale: 0.1,
          vrScale: 0.3,
        },
      },
      asteroid: {
        scale: 0.3,
        autoPosition: true,
        animation: {
          rotate: true,
          rotationSpeed: 1.5,
        },
        xr: {
          arScale: 0.05,
          vrScale: 0.15,
        },
      },
      nebula: {
        scale: 2.0,
        animation: {
          pulse: true,
          pulseSpeed: 0.3,
        },
        interaction: {
          hoverable: false,
          clickable: false,
        },
        xr: {
          arScale: 0.3,
          vrScale: 0.5,
        },
      },
      station: {
        scale: 0.8,
        animation: {
          rotate: true,
          rotationSpeed: 0.1,
        },
        xr: {
          arScale: 0.1,
          vrScale: 0.25,
        },
      },
    }

    return {
      id,
      name: `${type.charAt(0).toUpperCase()}${type.slice(1)} ${id}`,
      url,
      position: position || [0, 0, 0],
      ...presets[type],
    }
  }
}

// Singleton instance
export const splineModelManager = new SplineModelManager()

// Export helper functions
export const registerSplineModel = (config: SplineModelConfig) =>
  splineModelManager.registerModel(config)

export const getSplineModel = (id: string) => splineModelManager.getModel(id)

export const getAllSplineModels = () => splineModelManager.getAllModels()

export const updateSplineModel = (id: string, updates: Partial<SplineModelConfig>) =>
  splineModelManager.updateModel(id, updates)

export const createSplinePreset = (
  type: 'spaceship' | 'planet' | 'asteroid' | 'nebula' | 'station',
  id: string,
  url: string,
  position?: [number, number, number]
) => SplineModelManager.createPreset(type, id, url, position)
