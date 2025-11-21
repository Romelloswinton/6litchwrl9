# Spline Models Integration - Complete Package

This package provides everything you need to add Spline 3D models to your Galaxy visualization project.

## What's Included

### Documentation
1. **SPLINE_QUICK_START.md** - Get started in 5 minutes
2. **SPLINE_IMPLEMENTATION_GUIDE.md** - Comprehensive guide with examples
3. **This file** - Overview and file reference

### Core Files

#### Utilities
- **`src/utils/spline/splineModelManager.ts`** - Model management system
- **`src/utils/spline/splineR3FHelpers.ts`** - Positioning and XR utilities
- **`src/utils/spline/splineHelpers.ts`** - Legacy helpers and URL management
- **`src/utils/spline/generateSplineComponent.ts`** - Component code generator

#### Components
- **`src/components/spline/MultiSplineScene.tsx`** - Multi-model renderer
- **`src/components/spline/SplineR3FModels.tsx`** - R3F integration (existing)
- **`src/components/ui/SplineModelControls.tsx`** - Leva UI controls

#### Hooks
- **`src/hooks/spline/useSplineIntegration.ts`** - Integration hook (existing)

## Quick Reference

### Adding a Single Model (Easiest)

```typescript
// In HybridScene.tsx
setSplineScene('https://prod.spline.design/YOUR-ID/scene.splinecode')
```

### Adding Multiple Models (Recommended)

```typescript
// Create MyModels.tsx
import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { createSplinePreset } from '../../utils/spline/splineModelManager'

export function MyModels() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    registerModel(createSplinePreset(
      'spaceship',
      'my-ship',
      'YOUR-URL',
      [5, 2, -3]
    ))
  }, [registerModel])

  return <MultiSplineScene />
}

// Then add <MyModels /> to HybridScene.tsx
```

### Using the Component Generator

Open browser console in your running app:

```javascript
// Browser console
generateSplineComponent(splinePresets.spaceFleet)
```

This copies ready-to-use component code to your clipboard!

## File Organization

```
glitchwrld/
├── SPLINE_QUICK_START.md           ← Start here!
├── SPLINE_IMPLEMENTATION_GUIDE.md  ← Detailed guide
├── SPLINE_MODELS_README.md         ← This file
│
├── src/
│   ├── components/
│   │   ├── spline/
│   │   │   ├── MultiSplineScene.tsx      ← Multi-model renderer
│   │   │   ├── SplineR3FModels.tsx       ← Single scene renderer
│   │   │   └── AccurateSolarSystem.tsx   ← Solar system example
│   │   │
│   │   └── ui/
│   │       └── SplineModelControls.tsx   ← Leva controls
│   │
│   ├── hooks/
│   │   └── spline/
│   │       └── useSplineIntegration.ts   ← Integration hook
│   │
│   └── utils/
│       └── spline/
│           ├── splineModelManager.ts     ← Model management
│           ├── splineR3FHelpers.ts       ← Positioning utilities
│           ├── splineHelpers.ts          ← URL management
│           └── generateSplineComponent.ts ← Code generator
```

## Features

### Model Management
- ✅ Register/unregister models dynamically
- ✅ Update position, rotation, scale in real-time
- ✅ Toggle visibility
- ✅ Export/import configurations

### Animations
- ✅ Rotation (spin models)
- ✅ Pulse (breathing scale effect)
- ✅ Orbit (circular motion)
- ✅ Configurable speeds

### Positioning
- ✅ Manual positioning (x, y, z)
- ✅ Auto-position on spiral arms
- ✅ Align with solar system planets
- ✅ XR-aware scaling (AR/VR)

### Interaction
- ✅ Click handlers
- ✅ Hover effects
- ✅ Custom callbacks
- ✅ Object name detection

### UI Controls
- ✅ Leva-based real-time controls
- ✅ Position/rotation/scale sliders
- ✅ Animation toggles
- ✅ Visibility management
- ✅ Compact mobile view

### XR Support
- ✅ AR mode scaling
- ✅ VR mode scaling
- ✅ Position adjustments
- ✅ Automatic transformations

## Common Use Cases

### 1. Space Fleet Scene

```typescript
import { createSplinePreset } from '../../utils/spline/splineModelManager'

registerModel(createSplinePreset('spaceship', 'flagship', 'URL-1', [0, 2, 0]))
registerModel(createSplinePreset('spaceship', 'fighter', 'URL-2', [5, 1, -2]))
```

### 2. Asteroid Field

```typescript
registerModel(createSplinePreset('asteroid', 'rock-1', 'URL', [-8, 2, 3]))
registerModel(createSplinePreset('asteroid', 'rock-2', 'URL', [-5, -1, 5]))
registerModel(createSplinePreset('asteroid', 'rock-3', 'URL', [-10, 0, 2]))
```

### 3. Space Station

```typescript
registerModel({
  id: 'station-alpha',
  name: 'Station Alpha',
  url: 'YOUR-URL',
  position: [0, 10, 0],
  scale: 1.5,
  animation: {
    rotate: true,
    rotationSpeed: 0.1,
  },
  interaction: {
    clickable: true,
    onClick: (name) => {
      console.log('Docking at', name)
    },
  },
})
```

### 4. Nebula Clouds

```typescript
registerModel(createSplinePreset('nebula', 'nebula-1', 'URL', [15, 5, -10]))
registerModel(createSplinePreset('nebula', 'nebula-2', 'URL', [-12, -3, 8]))
```

### 5. Planet-Aligned Models

```typescript
registerModel({
  id: 'planet-model',
  name: 'Custom Planet',
  url: 'YOUR-URL',
  alignWithPlanets: true,  // Auto-positions at planet locations
  animation: {
    rotate: true,
    pulse: true,
  },
})
```

## API Quick Reference

### SplineModelManager

```typescript
import { splineModelManager } from './splineModelManager'

// Register
splineModelManager.registerModel(config)

// Get
const model = splineModelManager.getModel('model-id')

// Update
splineModelManager.updateModel('model-id', { scale: 2.0 })

// Visibility
splineModelManager.setModelVisibility('model-id', false)
splineModelManager.toggleModelVisibility('model-id')

// Position/Rotation/Scale
splineModelManager.setModelPosition('model-id', [x, y, z])
splineModelManager.setModelRotation('model-id', [rx, ry, rz])
splineModelManager.setModelScale('model-id', 1.5)

// Animation
splineModelManager.enableAnimation('model-id', 'rotate', 0.5)
splineModelManager.disableAnimation('model-id', 'pulse')

// Export/Import
const json = splineModelManager.exportConfig()
splineModelManager.importConfig(json)

// Clear
splineModelManager.clear()
```

### useSplineModels Hook

```typescript
import { useSplineModels } from './MultiSplineScene'

const {
  registerModel,
  unregisterModel,
  updateModel,
  toggleVisibility,
  setPosition,
  setScale,
  enableAnimation,
  disableAnimation,
  models,
  getModel,
} = useSplineModels()
```

### Presets

```typescript
import { createSplinePreset } from './splineModelManager'

const model = createSplinePreset(
  'spaceship', // or 'planet', 'asteroid', 'nebula', 'station'
  'my-id',
  'https://prod.spline.design/YOUR-ID/scene.splinecode',
  [x, y, z]
)

registerModel(model)
```

## Presets Reference

| Preset | Scale | Animations | XR Scale (AR/VR) |
|--------|-------|------------|------------------|
| `spaceship` | 0.5 | Rotate, Orbit | 0.05 / 0.2 |
| `planet` | 1.0 | Rotate, Pulse | 0.1 / 0.3 |
| `asteroid` | 0.3 | Rotate (fast) | 0.05 / 0.15 |
| `nebula` | 2.0 | Pulse | 0.3 / 0.5 |
| `station` | 0.8 | Rotate (slow) | 0.1 / 0.25 |

## Integration Checklist

### For Single Model
- [ ] Get Spline .splinecode URL
- [ ] Add URL to `HybridScene.tsx`
- [ ] Test in browser

### For Multiple Models
- [ ] Create new component file
- [ ] Import `MultiSplineScene` and `useSplineModels`
- [ ] Register models in `useEffect`
- [ ] Add component to `HybridScene.tsx`
- [ ] (Optional) Add `SplineModelControls` for UI

### For UI Controls
- [ ] Import `SplineModelControls` in `GalaxyControls.tsx`
- [ ] Render `<SplineModelControls />`
- [ ] Test controls in Leva panel

## Performance Tips

1. **Lazy load heavy models:**
   ```typescript
   const HeavyModel = lazy(() => import('./HeavyModel'))
   ```

2. **Conditional rendering:**
   ```typescript
   if (cameraDistance > 100) return null
   ```

3. **Reduce particle count** when using many Spline models

4. **Lower bloom intensity** for better performance

5. **Use simpler models** with fewer polygons

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not visible | Check URL, visibility, position, scale |
| Wrong position | Adjust x/y/z, check galaxy radius |
| No animation | Enable `isAnimating` in hybrid store |
| Can't click | Set `interaction.clickable: true` |
| Too small/large | Adjust `scale` property |
| Performance lag | Reduce models, particle count, bloom |

## Examples to Study

1. **AccurateSolarSystem.tsx** - Solar system with planets
2. **SplineR3FModels.tsx** - R3F integration
3. **MultiSplineScene.tsx** - Multi-model system

## Next Steps

1. Read **SPLINE_QUICK_START.md**
2. Create your first model component
3. Add UI controls
4. Experiment with animations
5. Try AR/VR mode
6. Share your creations!

## Resources

- [Spline Design](https://spline.design) - Create 3D models
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - R3F docs
- [Leva Controls](https://github.com/pmndrs/leva) - UI controls
- [Three.js](https://threejs.org/) - 3D library

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review example files
3. Check browser console for errors
4. Read the implementation guide

Happy coding! 🚀✨
