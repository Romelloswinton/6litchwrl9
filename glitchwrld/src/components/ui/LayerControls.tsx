import { useControls, folder } from 'leva'
import { useHybridStore, LayerType } from '../../stores/hybridStore'

export function LayerControls() {
  const {
    layers,
    setLayerVisible,
    setLayerOpacity,
    setLayerBlendMode
  } = useHybridStore()

  // Create Leva controls for layer management
  useControls({
    'Layer Control': folder({
      'Base Galaxy': folder({
        'Visible': {
          value: layers.base.visible,
          onChange: (value: boolean) => setLayerVisible('base', value)
        },
        'Opacity': {
          value: layers.base.opacity,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) => setLayerOpacity('base', value)
        },
        'Blend Mode': {
          value: layers.base.blendMode,
          options: ['normal', 'additive', 'multiply'],
          onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('base', value)
        }
      }),
      
      'Spline Models': folder({
        'Visible': {
          value: layers.spline.visible,
          onChange: (value: boolean) => setLayerVisible('spline', value)
        },
        'Opacity': {
          value: layers.spline.opacity,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) => setLayerOpacity('spline', value)
        },
        'Blend Mode': {
          value: layers.spline.blendMode,
          options: ['normal', 'additive', 'multiply'],
          onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('spline', value)
        }
      }),
      
      'Effects': folder({
        'Visible': {
          value: layers.effects.visible,
          onChange: (value: boolean) => setLayerVisible('effects', value)
        },
        'Opacity': {
          value: layers.effects.opacity,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) => setLayerOpacity('effects', value)
        },
        'Blend Mode': {
          value: layers.effects.blendMode,
          options: ['normal', 'additive', 'multiply'],
          onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('effects', value)
        }
      }),

      'Multi-Layer Starfield': folder({
        'Distant Stars': folder({
          'Visible': {
            value: layers['starfield-distant'].visible,
            onChange: (value: boolean) => setLayerVisible('starfield-distant', value)
          },
          'Opacity': {
            value: layers['starfield-distant'].opacity,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (value: number) => setLayerOpacity('starfield-distant', value)
          },
          'Blend Mode': {
            value: layers['starfield-distant'].blendMode,
            options: ['normal', 'additive', 'multiply'],
            onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('starfield-distant', value)
          }
        }),

        'Mid-Range Stars': folder({
          'Visible': {
            value: layers['starfield-mid'].visible,
            onChange: (value: boolean) => setLayerVisible('starfield-mid', value)
          },
          'Opacity': {
            value: layers['starfield-mid'].opacity,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (value: number) => setLayerOpacity('starfield-mid', value)
          },
          'Blend Mode': {
            value: layers['starfield-mid'].blendMode,
            options: ['normal', 'additive', 'multiply'],
            onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('starfield-mid', value)
          }
        }),

        'Near Stars (Spline Layer)': folder({
          'Visible': {
            value: layers['starfield-near'].visible,
            onChange: (value: boolean) => setLayerVisible('starfield-near', value)
          },
          'Opacity': {
            value: layers['starfield-near'].opacity,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (value: number) => setLayerOpacity('starfield-near', value)
          },
          'Blend Mode': {
            value: layers['starfield-near'].blendMode,
            options: ['normal', 'additive', 'multiply'],
            onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('starfield-near', value)
          }
        }),

        'Close Stars': folder({
          'Visible': {
            value: layers['starfield-close'].visible,
            onChange: (value: boolean) => setLayerVisible('starfield-close', value)
          },
          'Opacity': {
            value: layers['starfield-close'].opacity,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (value: number) => setLayerOpacity('starfield-close', value)
          },
          'Blend Mode': {
            value: layers['starfield-close'].blendMode,
            options: ['normal', 'additive', 'multiply'],
            onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('starfield-close', value)
          }
        }),

        'Foreground Particles': folder({
          'Visible': {
            value: layers['starfield-foreground'].visible,
            onChange: (value: boolean) => setLayerVisible('starfield-foreground', value)
          },
          'Opacity': {
            value: layers['starfield-foreground'].opacity,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (value: number) => setLayerOpacity('starfield-foreground', value)
          },
          'Blend Mode': {
            value: layers['starfield-foreground'].blendMode,
            options: ['normal', 'additive', 'multiply'],
            onChange: (value: 'normal' | 'additive' | 'multiply') => setLayerBlendMode('starfield-foreground', value)
          }
        })
      })
    })
  })

  return null // Leva handles the UI
}