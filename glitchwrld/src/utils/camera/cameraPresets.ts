// glitchwrld/src/utils/camera/cameraPresets.ts

import * as THREE from 'three'

/**
 * Camera preset configuration
 */
export interface CameraPreset {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Camera position in 3D space */
  position: [number, number, number]
  /** Camera look-at target */
  target: [number, number, number]
  /** Field of view (optional, defaults to current) */
  fov?: number
  /** Description of the view */
  description?: string
  /** Associated scene mode */
  sceneMode?: 'galaxy' | 'solarSystem'
  /** Suggested Spline models to show */
  showModels?: string[]
  /** Suggested Spline models to hide */
  hideModels?: string[]
  /** Custom settings for this view */
  settings?: {
    bloomIntensity?: number
    rotationSpeed?: number
    enableOrbitControls?: boolean
  }
}

/**
 * Pre-defined camera presets for different views
 */
export class CameraPresets {
  private static presets: Map<string, CameraPreset> = new Map()

  /**
   * Default camera presets
   */
  static readonly DEFAULT_PRESETS: CameraPreset[] = [
    // Overview shots
    {
      id: 'overview-wide',
      name: 'Wide Overview',
      position: [0, 50, 100],
      target: [0, 0, 0],
      fov: 65,
      description: 'Wide angle view of the entire galaxy',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.2,
        enableOrbitControls: true,
      },
    },
    {
      id: 'overview-top',
      name: 'Top Down View',
      position: [0, 80, 0],
      target: [0, 0, 0],
      fov: 75,
      description: 'Bird\'s eye view looking down at the galaxy',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.0,
        enableOrbitControls: true,
      },
    },
    {
      id: 'overview-side',
      name: 'Side Profile',
      position: [120, 10, 0],
      target: [0, 0, 0],
      fov: 60,
      description: 'Side view showing galaxy thickness',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.3,
        enableOrbitControls: true,
      },
    },

    // Close-up views
    {
      id: 'closeup-center',
      name: 'Galaxy Core',
      position: [0, 5, 15],
      target: [0, 0, 0],
      fov: 50,
      description: 'Close view of the galaxy center',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.5,
        enableOrbitControls: true,
      },
    },
    {
      id: 'closeup-arm',
      name: 'Spiral Arm',
      position: [15, 3, 8],
      target: [10, 0, 5],
      fov: 55,
      description: 'Close-up of a spiral arm',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.2,
        enableOrbitControls: true,
      },
    },

    // Solar system views
    {
      id: 'solar-overview',
      name: 'Solar System Overview',
      position: [0, 30, 50],
      target: [0, 0, 0],
      fov: 65,
      description: 'View of the entire solar system',
      sceneMode: 'solarSystem',
      settings: {
        bloomIntensity: 0.8,
        enableOrbitControls: true,
      },
    },
    {
      id: 'solar-inner',
      name: 'Inner Planets',
      position: [0, 10, 15],
      target: [0, 0, 0],
      fov: 60,
      description: 'Focus on Mercury, Venus, Earth, Mars',
      sceneMode: 'solarSystem',
      settings: {
        bloomIntensity: 0.9,
        enableOrbitControls: true,
      },
    },
    {
      id: 'solar-outer',
      name: 'Outer Planets',
      position: [0, 15, 40],
      target: [0, 0, 0],
      fov: 70,
      description: 'Focus on Jupiter, Saturn, Uranus, Neptune',
      sceneMode: 'solarSystem',
      settings: {
        bloomIntensity: 0.7,
        enableOrbitControls: true,
      },
    },

    // Cinematic angles
    {
      id: 'cinematic-low',
      name: 'Low Angle Drama',
      position: [20, -10, 30],
      target: [0, 5, 0],
      fov: 75,
      description: 'Dramatic low angle shot',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.4,
        enableOrbitControls: true,
      },
    },
    {
      id: 'cinematic-dutch',
      name: 'Dutch Angle',
      position: [30, 20, 40],
      target: [0, 0, 0],
      fov: 60,
      description: 'Tilted perspective for dynamic feel',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.3,
        enableOrbitControls: true,
      },
    },
    {
      id: 'cinematic-orbit',
      name: 'Orbital Perspective',
      position: [40, 15, 25],
      target: [0, 0, 0],
      fov: 65,
      description: 'Perspective from orbit',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.1,
        rotationSpeed: 0.002,
        enableOrbitControls: false,
      },
    },

    // Spline model focused views
    {
      id: 'model-showcase',
      name: 'Model Showcase',
      position: [8, 4, 12],
      target: [5, 2, -3],
      fov: 55,
      description: 'Focused view for showcasing Spline models',
      settings: {
        bloomIntensity: 1.0,
        enableOrbitControls: true,
      },
    },
    {
      id: 'model-closeup',
      name: 'Model Close-up',
      position: [6, 3, 8],
      target: [5, 2, -3],
      fov: 45,
      description: 'Close-up of a specific model',
      settings: {
        bloomIntensity: 0.9,
        enableOrbitControls: true,
      },
    },

    // Exploration views
    {
      id: 'explore-diagonal',
      name: 'Diagonal Explorer',
      position: [50, 30, 50],
      target: [0, 0, 0],
      fov: 70,
      description: 'Diagonal view for exploring the scene',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.1,
        enableOrbitControls: true,
      },
    },
    {
      id: 'explore-widescreen',
      name: 'Widescreen Vista',
      position: [0, 20, 70],
      target: [0, 0, 0],
      fov: 80,
      description: 'Wide cinematic view',
      sceneMode: 'galaxy',
      settings: {
        bloomIntensity: 1.0,
        enableOrbitControls: true,
      },
    },
  ]

  /**
   * Initialize default presets
   */
  static initialize(): void {
    this.DEFAULT_PRESETS.forEach((preset) => {
      this.presets.set(preset.id, preset)
    })
    console.log(`✅ Initialized ${this.presets.size} camera presets`)
  }

  /**
   * Get a preset by ID
   */
  static getPreset(id: string): CameraPreset | undefined {
    return this.presets.get(id)
  }

  /**
   * Get all presets
   */
  static getAllPresets(): CameraPreset[] {
    return Array.from(this.presets.values())
  }

  /**
   * Get presets by scene mode
   */
  static getPresetsByMode(mode: 'galaxy' | 'solarSystem'): CameraPreset[] {
    return this.getAllPresets().filter((p) => p.sceneMode === mode)
  }

  /**
   * Add a custom preset
   */
  static addPreset(preset: CameraPreset): void {
    this.presets.set(preset.id, preset)
    console.log(`✅ Added camera preset: ${preset.name}`)
  }

  /**
   * Remove a preset
   */
  static removePreset(id: string): void {
    this.presets.delete(id)
    console.log(`🗑️ Removed camera preset: ${id}`)
  }

  /**
   * Create a preset from current camera position
   */
  static createFromCamera(
    id: string,
    name: string,
    camera: THREE.Camera,
    target: THREE.Vector3,
    description?: string
  ): CameraPreset {
    const position = camera.position.toArray() as [number, number, number]
    const targetArray = target.toArray() as [number, number, number]
    const fov = (camera as THREE.PerspectiveCamera).fov

    const preset: CameraPreset = {
      id,
      name,
      position,
      target: targetArray,
      fov,
      description,
    }

    this.addPreset(preset)
    return preset
  }

  /**
   * Export presets as JSON
   */
  static exportPresets(): string {
    return JSON.stringify(this.getAllPresets(), null, 2)
  }

  /**
   * Import presets from JSON
   */
  static importPresets(json: string): void {
    try {
      const presets = JSON.parse(json) as CameraPreset[]
      presets.forEach((preset) => this.addPreset(preset))
      console.log(`✅ Imported ${presets.length} camera presets`)
    } catch (error) {
      console.error('❌ Failed to import presets:', error)
    }
  }

  /**
   * Get preset categories
   */
  static getCategories(): Record<string, CameraPreset[]> {
    const categories: Record<string, CameraPreset[]> = {
      'Overview': [],
      'Close-up': [],
      'Solar System': [],
      'Cinematic': [],
      'Model Focus': [],
      'Exploration': [],
      'Custom': [],
    }

    this.getAllPresets().forEach((preset) => {
      if (preset.id.startsWith('overview-')) {
        categories['Overview'].push(preset)
      } else if (preset.id.startsWith('closeup-')) {
        categories['Close-up'].push(preset)
      } else if (preset.id.startsWith('solar-')) {
        categories['Solar System'].push(preset)
      } else if (preset.id.startsWith('cinematic-')) {
        categories['Cinematic'].push(preset)
      } else if (preset.id.startsWith('model-')) {
        categories['Model Focus'].push(preset)
      } else if (preset.id.startsWith('explore-')) {
        categories['Exploration'].push(preset)
      } else {
        categories['Custom'].push(preset)
      }
    })

    return categories
  }
}

// Initialize default presets
CameraPresets.initialize()

// Export helper functions
export const getCameraPreset = (id: string) => CameraPresets.getPreset(id)
export const getAllCameraPresets = () => CameraPresets.getAllPresets()
export const addCameraPreset = (preset: CameraPreset) => CameraPresets.addPreset(preset)
export const getCameraCategories = () => CameraPresets.getCategories()
