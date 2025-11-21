// glitchwrld/src/components/ui/SplineModelControls.tsx

import { useEffect, useState } from 'react'
import { useControls, folder, button } from 'leva'
import { splineModelManager } from '../../utils/spline/splineModelManager'
import { useHybridStore } from '../../stores/hybridStore'

/**
 * Leva-based UI controls for managing Spline models
 */
export function SplineModelControls() {
  const [models, setModels] = useState(splineModelManager.getAllModels())
  const showSplineLayer = useHybridStore((state) => state.layers.spline.visible)
  const setLayerVisible = useHybridStore((state) => state.setLayerVisible)

  // Refresh models list periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(splineModelManager.getAllModels())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Main Spline layer control
  useControls(
    'Spline Models',
    {
      'Layer Visibility': {
        value: showSplineLayer,
        onChange: (value) => setLayerVisible('spline', value),
      },
      'Model Count': {
        value: models.length,
        disabled: true,
      },
      'Visible Models': {
        value: models.filter((m) => m.visible).length,
        disabled: true,
      },
      Actions: folder({
        'Export Config': button(() => {
          const config = splineModelManager.exportConfig()
          console.log('Spline Models Configuration:', config)
          // Copy to clipboard if available
          if (navigator.clipboard) {
            navigator.clipboard.writeText(config)
            console.log('✅ Configuration copied to clipboard')
          }
        }),
        'Clear All': button(() => {
          if (confirm('Are you sure you want to clear all Spline models?')) {
            splineModelManager.clear()
            setModels([])
          }
        }),
      }),
    },
    [showSplineLayer, models]
  )

  // Individual model controls
  models.forEach((model) => {
    useControls(
      `Spline: ${model.name}`,
      {
        Visible: {
          value: model.visible ?? true,
          onChange: (value) => {
            splineModelManager.setModelVisibility(model.id, value)
            setModels([...splineModelManager.getAllModels()])
          },
        },
        Position: folder({
          X: {
            value: model.position?.[0] ?? 0,
            min: -50,
            max: 50,
            step: 0.5,
            onChange: (value) => {
              const pos = model.position || [0, 0, 0]
              splineModelManager.setModelPosition(model.id, [
                value,
                pos[1],
                pos[2],
              ])
            },
          },
          Y: {
            value: model.position?.[1] ?? 0,
            min: -50,
            max: 50,
            step: 0.5,
            onChange: (value) => {
              const pos = model.position || [0, 0, 0]
              splineModelManager.setModelPosition(model.id, [
                pos[0],
                value,
                pos[2],
              ])
            },
          },
          Z: {
            value: model.position?.[2] ?? 0,
            min: -50,
            max: 50,
            step: 0.5,
            onChange: (value) => {
              const pos = model.position || [0, 0, 0]
              splineModelManager.setModelPosition(model.id, [
                pos[0],
                pos[1],
                value,
              ])
            },
          },
        }),
        Rotation: folder({
          'Rotate X': {
            value: model.rotation?.[0] ?? 0,
            min: 0,
            max: Math.PI * 2,
            step: 0.1,
            onChange: (value) => {
              const rot = model.rotation || [0, 0, 0]
              splineModelManager.setModelRotation(model.id, [
                value,
                rot[1],
                rot[2],
              ])
            },
          },
          'Rotate Y': {
            value: model.rotation?.[1] ?? 0,
            min: 0,
            max: Math.PI * 2,
            step: 0.1,
            onChange: (value) => {
              const rot = model.rotation || [0, 0, 0]
              splineModelManager.setModelRotation(model.id, [
                rot[0],
                value,
                rot[2],
              ])
            },
          },
          'Rotate Z': {
            value: model.rotation?.[2] ?? 0,
            min: 0,
            max: Math.PI * 2,
            step: 0.1,
            onChange: (value) => {
              const rot = model.rotation || [0, 0, 0]
              splineModelManager.setModelRotation(model.id, [
                rot[0],
                rot[1],
                value,
              ])
            },
          },
        }),
        Scale: {
          value: model.scale ?? 1,
          min: 0.1,
          max: 5,
          step: 0.1,
          onChange: (value) => {
            splineModelManager.setModelScale(model.id, value)
          },
        },
        Animation: folder({
          Rotate: {
            value: model.animation?.rotate ?? false,
            onChange: (value) => {
              if (value) {
                splineModelManager.enableAnimation(
                  model.id,
                  'rotate',
                  model.animation?.rotationSpeed ?? 1
                )
              } else {
                splineModelManager.disableAnimation(model.id, 'rotate')
              }
              setModels([...splineModelManager.getAllModels()])
            },
          },
          'Rotation Speed': {
            value: model.animation?.rotationSpeed ?? 1,
            min: 0.1,
            max: 5,
            step: 0.1,
            disabled: !model.animation?.rotate,
            onChange: (value) => {
              splineModelManager.enableAnimation(model.id, 'rotate', value)
              setModels([...splineModelManager.getAllModels()])
            },
          },
          Pulse: {
            value: model.animation?.pulse ?? false,
            onChange: (value) => {
              if (value) {
                splineModelManager.enableAnimation(
                  model.id,
                  'pulse',
                  model.animation?.pulseSpeed ?? 1
                )
              } else {
                splineModelManager.disableAnimation(model.id, 'pulse')
              }
              setModels([...splineModelManager.getAllModels()])
            },
          },
          'Pulse Speed': {
            value: model.animation?.pulseSpeed ?? 1,
            min: 0.1,
            max: 5,
            step: 0.1,
            disabled: !model.animation?.pulse,
            onChange: (value) => {
              splineModelManager.enableAnimation(model.id, 'pulse', value)
              setModels([...splineModelManager.getAllModels()])
            },
          },
          Orbit: {
            value: model.animation?.orbit ?? false,
            onChange: (value) => {
              if (value) {
                splineModelManager.enableAnimation(
                  model.id,
                  'orbit',
                  model.animation?.orbitSpeed ?? 1
                )
              } else {
                splineModelManager.disableAnimation(model.id, 'orbit')
              }
              setModels([...splineModelManager.getAllModels()])
            },
          },
          'Orbit Speed': {
            value: model.animation?.orbitSpeed ?? 1,
            min: 0.1,
            max: 5,
            step: 0.1,
            disabled: !model.animation?.orbit,
            onChange: (value) => {
              splineModelManager.enableAnimation(model.id, 'orbit', value)
              setModels([...splineModelManager.getAllModels()])
            },
          },
        }),
        Actions: folder({
          Remove: button(() => {
            if (confirm(`Remove ${model.name}?`)) {
              splineModelManager.unregisterModel(model.id)
              setModels([...splineModelManager.getAllModels()])
            }
          }),
        }),
      },
      [model]
    )
  })

  return null
}

/**
 * Simplified Spline controls for mobile/compact view
 */
export function CompactSplineControls() {
  const showSplineLayer = useHybridStore((state) => state.layers.spline.visible)
  const setLayerVisible = useHybridStore((state) => state.setLayerVisible)
  const [models, setModels] = useState(splineModelManager.getAllModels())

  useEffect(() => {
    const interval = setInterval(() => {
      setModels(splineModelManager.getAllModels())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useControls(
    'Spline',
    {
      Enabled: {
        value: showSplineLayer,
        onChange: (value) => setLayerVisible('spline', value),
      },
      Models: folder(
        models.reduce((acc, model) => {
          acc[model.name] = {
            value: model.visible ?? true,
            onChange: (value: boolean) => {
              splineModelManager.setModelVisibility(model.id, value)
              setModels([...splineModelManager.getAllModels()])
            },
          }
          return acc
        }, {} as Record<string, any>)
      ),
    },
    [showSplineLayer, models]
  )

  return null
}

/**
 * Quick add Spline model dialog (for runtime model addition)
 */
export function QuickAddSplineModel() {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [models, setModels] = useState(splineModelManager.getAllModels())

  useControls(
    'Add Spline Model',
    {
      'Model Name': {
        value: name,
        onChange: setName,
      },
      'Spline URL': {
        value: url,
        onChange: setUrl,
      },
      Type: {
        value: 'spaceship',
        options: ['spaceship', 'planet', 'asteroid', 'nebula', 'station'],
      },
      'Add Model': button(() => {
        if (!url || !name) {
          alert('Please provide both name and URL')
          return
        }

        const id = `model-${Date.now()}`
        splineModelManager.registerModel({
          id,
          name,
          url,
          position: [0, 0, 0],
          scale: 1,
          visible: true,
        })

        setModels([...splineModelManager.getAllModels()])
        setUrl('')
        setName('')
        console.log(`✅ Added Spline model: ${name}`)
      }),
    },
    [url, name]
  )

  return null
}
