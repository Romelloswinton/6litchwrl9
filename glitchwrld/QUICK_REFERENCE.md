# Quick Reference Card

One-page reference for Spline models and camera control.

## 🚀 Add a Spline Model (3 methods)

### Method 1: Instant (1 line)
```typescript
// HybridScene.tsx line 164
setSplineScene('https://prod.spline.design/YOUR-ID/scene.splinecode')
```

### Method 2: Preset (1 line)
```typescript
registerModel(createSplinePreset('spaceship', 'ship-1', 'YOUR-URL', [5, 2, -3]))
```

### Method 3: Custom
```typescript
registerModel({
  id: 'my-model',
  name: 'My Model',
  url: 'YOUR-URL',
  position: [x, y, z],
  scale: 1.0,
  animation: { rotate: true, rotationSpeed: 0.5 },
  interaction: { clickable: true, onClick: (name) => alert(name) }
})
```

## 📷 Camera Control (Quick)

### Apply Preset
```typescript
const { applyPresetAnimated } = useCameraPresets()
applyPresetAnimated('overview-wide', 2000) // 2 second transition
```

### Popular Presets
```typescript
'overview-wide'      // Wide view
'closeup-center'     // Galaxy core
'solar-overview'     // Solar system
'cinematic-orbit'    // Cinematic
'model-showcase'     // Model focus
```

### Camera Tour
```typescript
applyPresetAnimated('overview-wide', 2000)
setTimeout(() => applyPresetAnimated('closeup-center', 2000), 4000)
setTimeout(() => applyPresetAnimated('model-showcase', 2000), 8000)
```

## 🎨 Presets Available

| Type | ID | Description |
|------|-----|-------------|
| **Spaceship** | `spaceship` | Rotate + Orbit |
| **Planet** | `planet` | Rotate + Pulse |
| **Asteroid** | `asteroid` | Fast rotate |
| **Nebula** | `nebula` | Pulse only |
| **Station** | `station` | Slow rotate |

## 🎯 Common Positions

```typescript
Center:        [0, 0, 0]
Above:         [0, 10, 0]
Right:         [10, 0, 0]
In front:      [0, 0, -10]
Diagonal:      [5, 5, 5]
```

## ⚡ Quick Actions

### Model Management
```typescript
// Update
splineModelManager.updateModel('id', { scale: 2.0 })
splineModelManager.setModelPosition('id', [x, y, z])
splineModelManager.setModelVisibility('id', false)

// Animation
splineModelManager.enableAnimation('id', 'rotate', 0.5)
splineModelManager.enableAnimation('id', 'pulse', 1.0)
splineModelManager.enableAnimation('id', 'orbit', 0.3)
```

### Camera
```typescript
// Save current view
const preset = saveCurrentAsPreset('my-view', 'My View')
addCameraPreset(preset)

// Custom preset
addCameraPreset({
  id: 'custom', name: 'Custom',
  position: [x,y,z], target: [tx,ty,tz]
})
```

## 🎮 Add UI Controls

### Spline Controls
```typescript
// GalaxyControls.tsx
import { SplineModelControls } from './SplineModelControls'
<SplineModelControls />
```

### Camera Controls
```typescript
// GalaxyControls.tsx
import { CameraPresetControls } from './CameraPresetControls'
<CameraPresetControls />
```

### Quick Buttons
```typescript
import { QuickCameraButtons } from './CameraPresetControls'
<QuickCameraButtons />
```

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| Not visible | Check URL, visibility, position |
| Wrong size | Adjust `scale` (0.5-2.0) |
| No animation | Set `isAnimating: true` |
| Can't click | Set `clickable: true` |
| Camera stuck | Check `enableOrbitControls` |

## 📖 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | Start here |
| SPLINE_QUICK_START.md | 5-min setup |
| CAMERA_PRESETS_GUIDE.md | Camera guide |
| COMPLETE_FEATURES_SUMMARY.md | Full features |

## 🎬 Complete Example

```typescript
import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'
import { createSplinePreset } from '../../utils/spline/splineModelManager'

export function MyScene() {
  const { registerModel } = useSplineModels()
  const { applyPresetAnimated } = useCameraPresets()

  useEffect(() => {
    // Add model
    registerModel(createSplinePreset('spaceship', 'ship', 'URL', [10, 5, -5]))

    // Camera tour
    setTimeout(() => applyPresetAnimated('overview-wide', 2000), 1000)
    setTimeout(() => applyPresetAnimated('model-showcase', 2000), 5000)
  }, [])

  return <MultiSplineScene />
}
```

## 💻 Browser Console

```javascript
// Available in console:
generateSplineComponent(splinePresets.spaceFleet)  // Copy code
splinePresets  // View all presets
```

## ⌨️ Add to HybridScene.tsx

```typescript
// Import
import { MyScene } from '../examples/MyScene'
// or
import { SplineWithCameraExample } from '../examples/SplineWithCameraExample'

// Add in SceneContent() after AccurateSolarSystem:
<MyScene />
// or
<SplineWithCameraExample />
```

---

**Need more?** Read START_HERE.md
