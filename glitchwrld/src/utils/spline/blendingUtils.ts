import * as THREE from 'three'

export interface BlendingConfig {
  opacity: number
  blendMode: 'normal' | 'additive' | 'multiply'
  clearColor: THREE.Color
  clearAlpha: number
}

export class SplineBlendingManager {
  private renderer: THREE.WebGLRenderer | null = null
  private canvas: HTMLCanvasElement | null = null
  
  constructor(splineApp: any) {
    if (splineApp?.renderer) {
      this.renderer = splineApp.renderer
      this.canvas = splineApp.renderer.domElement
      this.initializeBlending()
    }
  }
  
  private initializeBlending(): void {
    if (!this.renderer || !this.canvas) return
    
    console.log('🎨 Initializing Spline blending for transparency')
    
    try {
      // Enable transparency in renderer
      this.renderer.setClearColor(0x000000, 0) // Black with 0 alpha
      this.renderer.setClearAlpha(0)
      this.renderer.autoClear = true
      this.renderer.sortObjects = true
      
      // Configure WebGL context for proper blending
      const gl = this.renderer.getContext()
      if (gl && !gl.isContextLost()) {
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0) // Transparent clear color
      }
      
      // Style canvas for transparency
      this.canvas.style.background = 'transparent'
      this.canvas.style.backgroundColor = 'transparent'
      this.canvas.style.mixBlendMode = 'normal'
      
      // Ensure proper z-index ordering
      this.canvas.style.position = 'absolute'
      this.canvas.style.top = '0'
      this.canvas.style.left = '0'
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      
      console.log('✅ Spline blending initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Spline blending:', error)
    }
  }
  
  updateBlending(config: Partial<BlendingConfig>): void {
    if (!this.renderer || !this.canvas) return
    
    try {
      // Update renderer settings
      if (config.clearColor !== undefined && config.clearAlpha !== undefined) {
        this.renderer.setClearColor(config.clearColor, config.clearAlpha)
      }
      
      // Update canvas opacity
      if (config.opacity !== undefined) {
        this.canvas.style.opacity = config.opacity.toString()
      }
      
      // Update blend mode
      if (config.blendMode) {
        switch (config.blendMode) {
          case 'additive':
            this.canvas.style.mixBlendMode = 'screen'
            break
          case 'multiply':
            this.canvas.style.mixBlendMode = 'multiply'
            break
          default:
            this.canvas.style.mixBlendMode = 'normal'
        }
      }
      
      console.log('🎨 Spline blending updated:', config)
    } catch (error) {
      console.error('❌ Failed to update Spline blending:', error)
    }
  }
  
  setTransparent(transparent: boolean): void {
    if (!this.canvas) return
    
    if (transparent) {
      this.updateBlending({
        clearColor: new THREE.Color(0x000000),
        clearAlpha: 0,
        opacity: 0.8
      })
    } else {
      this.updateBlending({
        clearColor: new THREE.Color(0x000011),
        clearAlpha: 1,
        opacity: 1.0
      })
    }
  }
  
  dispose(): void {
    // Cleanup if needed
    this.renderer = null
    this.canvas = null
    console.log('🧹 SplineBlendingManager disposed')
  }
}

export function createBlendingConfig(overrides: Partial<BlendingConfig> = {}): BlendingConfig {
  return {
    opacity: 0.8,
    blendMode: 'normal',
    clearColor: new THREE.Color(0x000000),
    clearAlpha: 0,
    ...overrides
  }
}