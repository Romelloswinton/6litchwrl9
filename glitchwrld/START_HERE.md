# 🚀 Spline Models for 3D Galaxy - START HERE

Welcome! This package adds powerful Spline 3D model integration to your Galaxy visualization.

## 📚 What You Get

- **Complete model management system** with animations, interactions, and XR support
- **4 comprehensive guides** covering everything from quick start to advanced usage
- **5 new components** ready to use in your project
- **3 utility modules** for model management and code generation
- **Full TypeScript support** with type safety

## ⚡ Quick Start (5 minutes)

### Step 1: Get Your Spline Model

1. Go to [spline.design](https://spline.design)
2. Create or open a 3D model
3. Export → Code Export → Get URL
4. Copy the `.splinecode` URL

### Step 2: Add to Your Scene

**Option A - Fastest (Single Model):**

Open `src/components/core/HybridScene.tsx` and change line 164:

```typescript
// Replace this line:
setSplineScene(SplineHelpers.DEFAULT_SPLINE_URLS.main)

// With your URL:
setSplineScene('https://prod.spline.design/YOUR-ID/scene.splinecode')
```

**Option B - Recommended (Multiple Models):**

1. Open `src/components/spline/ExampleSplineModels.tsx`
2. Replace the example URLs with yours
3. Open `src/components/core/HybridScene.tsx`
4. Add after line 121:
   ```typescript
   import { ExampleSplineModels } from '../spline/ExampleSplineModels'

   // Inside SceneContent(), after <AccurateSolarSystem />:
   <ExampleSplineModels />
   ```

### Step 3: Run & View

```bash
cd glitchwrld
npm run dev
```

Open http://localhost:5173 - Your model should appear!

## 📖 Documentation

Read in this order:

1. **SPLINE_QUICK_START.md** ← Read this first!
   - 5-minute setup guide
   - Copy-paste examples
   - Common patterns

2. **CAMERA_PRESETS_GUIDE.md** ← NEW! Camera control
   - 15+ camera angle presets
   - Smooth transitions
   - Automated tours
   - Model showcase views

3. **SPLINE_IMPLEMENTATION_GUIDE.md**
   - Detailed explanations
   - Advanced features
   - Positioning strategies
   - Animation & interaction

4. **SPLINE_MODELS_README.md**
   - API reference
   - File organization
   - Complete feature list

5. **SPLINE_IMPLEMENTATION_SUMMARY.md**
   - What was created
   - Checklist
   - Troubleshooting

## 🎯 What Can You Do?

### Animations
- ✅ Rotate models (spin)
- ✅ Pulse effect (breathing)
- ✅ Orbital motion (circle around)
- ✅ Custom combinations

### Positioning
- ✅ Manual (x, y, z coordinates)
- ✅ Auto-position on spiral arms
- ✅ Align with planets
- ✅ XR-aware (AR/VR scaling)

### Interactions
- ✅ Click handlers
- ✅ Hover effects
- ✅ Custom callbacks
- ✅ Visual feedback

### Management
- ✅ Add/remove models dynamically
- ✅ Real-time control via Leva UI
- ✅ Export/import configurations
- ✅ Preset templates

### Camera Control (NEW!)
- ✅ 15+ camera angle presets
- ✅ Smooth animated transitions
- ✅ Model-focused views
- ✅ Automated camera tours
- ✅ Save custom camera positions

## 🎨 Example: Add a Spaceship

```typescript
import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'

export function MySpaceship() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    registerModel({
      id: 'my-spaceship',
      name: 'USS Enterprise',
      url: 'https://prod.spline.design/YOUR-ID/scene.splinecode',
      position: [10, 5, -5],
      scale: 0.8,
      animation: {
        rotate: true,
        rotationSpeed: 0.5,
        orbit: true,
        orbitSpeed: 0.3,
      },
      interaction: {
        clickable: true,
        onClick: (name) => alert('Welcome aboard!'),
      },
    })
  }, [registerModel])

  return <MultiSplineScene />
}
```

Then add `<MySpaceship />` to HybridScene.tsx!

## 🛠️ Available Presets

Quick setup with sensible defaults:

```typescript
import { createSplinePreset } from '../../utils/spline/splineModelManager'

// Just one line per model!
registerModel(createSplinePreset('spaceship', 'ship-1', 'YOUR-URL', [5, 2, -3]))
registerModel(createSplinePreset('asteroid', 'rock-1', 'YOUR-URL', [-5, 0, 2]))
registerModel(createSplinePreset('station', 'base-1', 'YOUR-URL', [0, 8, 0]))
```

Available: `spaceship`, `planet`, `asteroid`, `nebula`, `station`

## 🎮 UI Controls

Add real-time controls:

1. Open `src/components/ui/GalaxyControls.tsx`
2. Import:
   ```typescript
   import { SplineModelControls } from './SplineModelControls'
   ```
3. Add inside the component:
   ```typescript
   <SplineModelControls />
   ```

Now you can adjust position, rotation, scale, and animations in real-time!

## 📷 Camera Presets (NEW!)

Control camera angles and create cinematic views:

```typescript
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'

const { applyPresetAnimated } = useCameraPresets()

// Smooth camera transition to galaxy overview
applyPresetAnimated('overview-wide', 2000)

// Close-up of galaxy core
applyPresetAnimated('closeup-center', 2000)

// Cinematic orbital view
applyPresetAnimated('cinematic-orbit', 3000)
```

**Available Presets:**
- Overview shots (wide, top-down, side)
- Close-ups (galaxy core, spiral arms)
- Solar system views
- Cinematic angles
- Model focus views

**Add Camera Controls:**
```typescript
// In GalaxyControls.tsx
import { CameraPresetControls } from './CameraPresetControls'
<CameraPresetControls />
```

See **CAMERA_PRESETS_GUIDE.md** for complete guide!

## 🧪 Test Your Setup

1. Start dev server: `npm run dev`
2. Open browser: http://localhost:5173
3. Press `H` for keyboard help
4. Use Leva panel (right side) to control models
5. Click models to interact

## 📁 Files Created

### Documentation (6 files)
- `START_HERE.md` ← You are here
- `SPLINE_QUICK_START.md`
- `CAMERA_PRESETS_GUIDE.md` ← NEW!
- `SPLINE_IMPLEMENTATION_GUIDE.md`
- `SPLINE_MODELS_README.md`
- `SPLINE_IMPLEMENTATION_SUMMARY.md`

### Components (6 files)
- `src/components/spline/MultiSplineScene.tsx`
- `src/components/spline/ExampleSplineModels.tsx`
- `src/components/examples/SplineWithCameraExample.tsx` ← NEW!
- `src/components/ui/SplineModelControls.tsx`
- `src/components/ui/CameraPresetControls.tsx` ← NEW!

### Utilities (4 files)
- `src/utils/spline/splineModelManager.ts`
- `src/utils/spline/generateSplineComponent.ts`
- `src/utils/camera/cameraPresets.ts` ← NEW!
- `src/hooks/camera/useCameraPresets.ts` ← NEW!

## ❓ Common Questions

**Q: Model not visible?**
A: Check URL, visibility settings, and position. Try `[0, 0, 0]` first.

**Q: Model too small/large?**
A: Adjust `scale` property. Try values between 0.5 - 2.0.

**Q: Animations not working?**
A: Ensure `isAnimating: true` in hybrid store and check animation speeds.

**Q: Can't click model?**
A: Set `interaction.clickable: true` in your model config.

**Q: Want multiple models?**
A: Use `MultiSplineScene` component and register multiple models.

**Q: Need UI controls?**
A: Add `<SplineModelControls />` to GalaxyControls.tsx.

## 🚀 Next Steps

1. ✅ Read SPLINE_QUICK_START.md
2. ✅ Try ExampleSplineModels.tsx
3. ✅ Add your own Spline URLs
4. ✅ Enable UI controls
5. ✅ Experiment with animations
6. ✅ Try AR/VR mode!

## 💡 Pro Tips

- Start simple with one model
- Use presets for quick setup
- Enable Leva controls for easy tweaking
- Check browser console for helpful logs
- Use code generator for complex setups
- Test on mobile devices

## 🔗 Resources

- [Spline Design](https://spline.design) - Create models
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - R3F docs
- [Three.js](https://threejs.org/) - 3D library
- Project examples in `src/components/spline/`

## 🎉 You're Ready!

Everything is set up and ready to use. Start with **SPLINE_QUICK_START.md** and you'll have your first model in the scene within 5 minutes!

Need help? All files are heavily commented with examples and explanations.

Happy creating! ✨🌌
