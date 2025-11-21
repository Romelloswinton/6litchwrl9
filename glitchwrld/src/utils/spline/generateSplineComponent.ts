// glitchwrld/src/utils/spline/generateSplineComponent.ts

/**
 * Helper utility to generate Spline component code
 * Usage: Copy the output and paste into a new .tsx file
 */

export interface ComponentGeneratorConfig {
  componentName: string
  models: Array<{
    id: string
    name: string
    url: string
    position?: [number, number, number]
    scale?: number
    preset?: 'spaceship' | 'planet' | 'asteroid' | 'nebula' | 'station'
    animation?: {
      rotate?: boolean
      rotationSpeed?: number
      pulse?: boolean
      pulseSpeed?: number
      orbit?: boolean
      orbitSpeed?: number
    }
    interaction?: {
      clickable?: boolean
      hoverable?: boolean
    }
  }>
}

export function generateSplineComponent(config: ComponentGeneratorConfig): string {
  const { componentName, models } = config

  const imports = `import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { createSplinePreset } from '../../utils/spline/splineModelManager'
`

  const modelRegistrations = models
    .map((model) => {
      if (model.preset) {
        // Use preset
        const position = model.position
          ? `[${model.position.join(', ')}]`
          : '[0, 0, 0]'
        return `    // ${model.name}
    registerModel(
      createSplinePreset(
        '${model.preset}',
        '${model.id}',
        '${model.url}',
        ${position}
      )
    )`
      } else {
        // Custom configuration
        const lines = []
        lines.push(`    // ${model.name}`)
        lines.push(`    registerModel({`)
        lines.push(`      id: '${model.id}',`)
        lines.push(`      name: '${model.name}',`)
        lines.push(`      url: '${model.url}',`)

        if (model.position) {
          lines.push(`      position: [${model.position.join(', ')}],`)
        }

        if (model.scale !== undefined) {
          lines.push(`      scale: ${model.scale},`)
        }

        if (model.animation) {
          lines.push(`      animation: {`)
          if (model.animation.rotate !== undefined) {
            lines.push(`        rotate: ${model.animation.rotate},`)
          }
          if (model.animation.rotationSpeed !== undefined) {
            lines.push(`        rotationSpeed: ${model.animation.rotationSpeed},`)
          }
          if (model.animation.pulse !== undefined) {
            lines.push(`        pulse: ${model.animation.pulse},`)
          }
          if (model.animation.pulseSpeed !== undefined) {
            lines.push(`        pulseSpeed: ${model.animation.pulseSpeed},`)
          }
          if (model.animation.orbit !== undefined) {
            lines.push(`        orbit: ${model.animation.orbit},`)
          }
          if (model.animation.orbitSpeed !== undefined) {
            lines.push(`        orbitSpeed: ${model.animation.orbitSpeed},`)
          }
          lines.push(`      },`)
        }

        if (model.interaction) {
          lines.push(`      interaction: {`)
          if (model.interaction.clickable !== undefined) {
            lines.push(`        clickable: ${model.interaction.clickable},`)
          }
          if (model.interaction.hoverable !== undefined) {
            lines.push(`        hoverable: ${model.interaction.hoverable},`)
          }
          if (model.interaction.clickable) {
            lines.push(
              `        onClick: (name) => console.log('Clicked:', name),`
            )
          }
          lines.push(`      },`)
        }

        lines.push(`    })`)
        return lines.join('\n')
      }
    })
    .join('\n\n')

  const component = `
export function ${componentName}() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
${modelRegistrations}

    // Cleanup on unmount
    return () => {
      // Models are automatically cleaned up
    }
  }, [registerModel])

  return <MultiSplineScene />
}
`

  return imports + component
}

/**
 * Generate component and copy to clipboard
 */
export async function generateAndCopyComponent(
  config: ComponentGeneratorConfig
): Promise<void> {
  const code = generateSplineComponent(config)

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code)
      console.log(`✅ Component code copied to clipboard!`)
      console.log(`\nCreate a new file: src/components/spline/${config.componentName}.tsx`)
      console.log(`Then paste the code and import it in HybridScene.tsx\n`)
    } else {
      console.log('📋 Component code:\n')
      console.log(code)
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    console.log('📋 Component code:\n')
    console.log(code)
  }
}

/**
 * Quick preset templates
 */
export const PRESET_TEMPLATES = {
  spaceFleet: {
    componentName: 'SpaceFleet',
    models: [
      {
        id: 'flagship',
        name: 'Command Ship',
        url: 'https://prod.spline.design/YOUR-SHIP-ID/scene.splinecode',
        preset: 'spaceship' as const,
        position: [0, 2, 0] as [number, number, number],
      },
      {
        id: 'fighter-1',
        name: 'Fighter Squadron',
        url: 'https://prod.spline.design/YOUR-FIGHTER-ID/scene.splinecode',
        preset: 'spaceship' as const,
        position: [5, 1, -2] as [number, number, number],
      },
    ],
  },

  asteroidField: {
    componentName: 'AsteroidField',
    models: [
      {
        id: 'asteroid-1',
        name: 'Large Asteroid',
        url: 'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',
        preset: 'asteroid' as const,
        position: [-8, 2, 3] as [number, number, number],
      },
      {
        id: 'asteroid-2',
        name: 'Medium Asteroid',
        url: 'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',
        preset: 'asteroid' as const,
        position: [-5, -1, 5] as [number, number, number],
      },
      {
        id: 'asteroid-3',
        name: 'Small Asteroid',
        url: 'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',
        preset: 'asteroid' as const,
        position: [-10, 0, 2] as [number, number, number],
      },
    ],
  },

  spaceStation: {
    componentName: 'SpaceStation',
    models: [
      {
        id: 'station',
        name: 'Main Station',
        url: 'https://prod.spline.design/YOUR-STATION-ID/scene.splinecode',
        preset: 'station' as const,
        position: [0, 5, 0] as [number, number, number],
      },
    ],
  },

  nebulaClouds: {
    componentName: 'NebulaClouds',
    models: [
      {
        id: 'nebula-1',
        name: 'Blue Nebula',
        url: 'https://prod.spline.design/YOUR-NEBULA-ID/scene.splinecode',
        preset: 'nebula' as const,
        position: [15, 5, -10] as [number, number, number],
      },
      {
        id: 'nebula-2',
        name: 'Red Nebula',
        url: 'https://prod.spline.design/YOUR-NEBULA-ID/scene.splinecode',
        preset: 'nebula' as const,
        position: [-12, -3, 8] as [number, number, number],
      },
    ],
  },

  customScene: {
    componentName: 'CustomScene',
    models: [
      {
        id: 'custom-model',
        name: 'My Custom Model',
        url: 'https://prod.spline.design/YOUR-MODEL-ID/scene.splinecode',
        position: [0, 0, 0] as [number, number, number],
        scale: 1.0,
        animation: {
          rotate: true,
          rotationSpeed: 0.5,
        },
        interaction: {
          clickable: true,
          hoverable: true,
        },
      },
    ],
  },
}

/**
 * Example usage:
 *
 * ```typescript
 * import { generateAndCopyComponent, PRESET_TEMPLATES } from './generateSplineComponent'
 *
 * // Use a preset
 * generateAndCopyComponent(PRESET_TEMPLATES.spaceFleet)
 *
 * // Or create custom
 * generateAndCopyComponent({
 *   componentName: 'MySpaceScene',
 *   models: [
 *     {
 *       id: 'my-ship',
 *       name: 'Enterprise',
 *       url: 'https://prod.spline.design/YOUR-ID/scene.splinecode',
 *       position: [0, 0, 0],
 *       scale: 1.5,
 *       animation: {
 *         rotate: true,
 *         rotationSpeed: 0.3,
 *       },
 *     },
 *   ],
 * })
 * ```
 */

// Make it easy to use from browser console
if (typeof window !== 'undefined') {
  ;(window as any).generateSplineComponent = generateAndCopyComponent
  ;(window as any).splinePresets = PRESET_TEMPLATES
  console.log('💡 Spline Component Generator loaded!')
  console.log('   Usage: generateSplineComponent(splinePresets.spaceFleet)')
  console.log('   Available presets:', Object.keys(PRESET_TEMPLATES))
}
