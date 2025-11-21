# Visual Integration Guide

**Quick visual guide showing exactly where to add your Spline scene.**

---

## 📍 Step 1: Edit HybridScene.tsx

**File:** `src/components/core/HybridScene.tsx`

### A. Add Import (Top of File)

```typescript
// Line ~20, with other imports
import { Suspense, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats } from "@react-three/drei"
// ... other imports ...

// 👇 ADD THIS LINE
import { YourCustomSplineScene } from '../spline/YourCustomSplineScene'
```

### B. Add Component (Inside SceneContent)

```typescript
function SceneContent() {
  // ... existing code ...

  return (
    <XR store={xrStore}>
      {/* Keyboard Controls */}
      {xrMode === 'desktop' && <KeyboardControls />}

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#87ceeb" />
      {/* ... more lights ... */}

      {/* Multi-Layer Starfield */}
      <MultiLayerStarfield />

      {/* Constellation Layer */}
      {constellations.enabled && (
        <ConstellationLayer /* ... */ />
      )}

      {/* Galaxy Nebula Clouds */}
      {nebulaClouds.enabled && (
        <GalaxyNebulaClouds /* ... */ />
      )}

      {/* Accurate Solar System */}
      <AccurateSolarSystem timeScale={0.3} showOrbits={false} />

      {/* 👇 ADD YOUR SPLINE SCENE HERE */}
      <YourCustomSplineScene />

      {/* Camera Controls */}
      <OrbitControls /* ... */ />

      {/* Environment */}
      <color attach="background" args={["#000011"]} />

      {/* Post-processing Effects */}
      {/* ... */}
    </XR>
  )
}
```

---

## 📍 Step 2 (Optional): Add Leva Controls

**File:** `src/components/ui/GalaxyControls.tsx`

### Add Import and Component

```typescript
// At the top with other imports
import { useControls, folder } from 'leva'
import { useHybridStore } from '../../stores/hybridStore'
// ... other imports ...

// 👇 ADD THIS LINE
import { CameraPresetControls } from './CameraPresetControls'

export function GalaxyControls() {
  // ... existing code ...

  return (
    <>
      {/* Existing controls */}
      <ConstellationControls />
      <LayerControls />
      <NebulaControls />
      {/* ... other controls ... */}

      {/* 👇 ADD THIS LINE */}
      <CameraPresetControls />
    </>
  )
}
```

---

## 🎯 What Each File Does

```
YourCustomSplineScene.tsx
│
├─ Loads your Spline model
├─ Creates 8 camera angle presets
├─ Sets up automated camera tour
└─ Renders camera control buttons
```

```
HybridScene.tsx
│
├─ Main 3D scene container
├─ Renders all 3D objects
└─ You add: <YourCustomSplineScene />
```

```
GalaxyControls.tsx (Optional)
│
├─ UI control panel
├─ Leva controls
└─ You add: <CameraPresetControls />
```

---

## 🎬 Before and After

### BEFORE
```typescript
// HybridScene.tsx
<AccurateSolarSystem timeScale={0.3} showOrbits={false} />

{/* Camera Controls */}
<OrbitControls /* ... */ />
```

### AFTER
```typescript
// HybridScene.tsx
<AccurateSolarSystem timeScale={0.3} showOrbits={false} />

{/* Your Custom Spline Scene with Camera Control */}
<YourCustomSplineScene />

{/* Camera Controls */}
<OrbitControls /* ... */ />
```

---

## 📊 File Structure

```
glitchwrld/
├── src/
│   ├── components/
│   │   ├── core/
│   │   │   └── HybridScene.tsx          ← Edit Step 1
│   │   ├── spline/
│   │   │   └── YourCustomSplineScene.tsx ← Already created ✅
│   │   └── ui/
│   │       └── GalaxyControls.tsx       ← Edit Step 2 (optional)
│   └── ...
└── ...
```

---

## ✅ Verification

After editing, your import section should look like this:

```typescript
import { Suspense, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stats } from "@react-three/drei"
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing"
import { LayerManager, Layer } from "./LayerManager"
import { AccurateSolarSystem } from "../spline/AccurateSolarSystem"
import { GalaxyControls } from "../ui/GalaxyControls"
import { KeyboardHelp } from "../ui/KeyboardHelp"
import { ConstellationInfoPanel } from "../ui/ConstellationInfoPanel"
import { MultiLayerStarfield } from "../starfield/MultiLayerStarfield"
import { ConstellationLayer } from "../starfield/ConstellationLayer"
import { GalaxyNebulaClouds } from "../effects/GalaxyNebulaClouds"
import { useHybridStore } from "../../stores/hybridStore"
import { useXRStore } from "../../stores/xrStore"
import { SplineHelpers } from "../../utils/spline/splineHelpers"
import { XR } from "@react-three/xr"
import { xrStore } from "../xr/XRModeSwitcher"
import { usePerformanceMonitor } from "../../hooks/performance/usePerformanceMonitor"
import { useKeyboardControls } from "../../hooks/camera/useKeyboardControls"

// ✅ Your new import
import { YourCustomSplineScene } from '../spline/YourCustomSplineScene'
```

---

## 🚀 Quick Start Commands

```bash
# 1. Make sure you're in the right directory
cd glitchwrld

# 2. Install dependencies (if you haven't)
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
# Visit: http://localhost:5173
```

---

## 🎮 What You'll See

### In the Browser:

1. **Your Spline scene** rendered in the 3D galaxy
2. **Control buttons** at the bottom:
   - 📷 Wide
   - 🎯 Front
   - 🔍 Close
   - ↔️ Side
   - ⬇️ Top
   - ⭐ Hero
   - 🎭 Drama
   - 🎬 Orbit
   - ▶️ Start Tour

3. **Click any button** → Camera smoothly moves to that angle
4. **Click "Start Tour"** → Automatic tour through all 8 angles
5. **Click objects** in your Spline scene → Console logs the click

---

## 💡 Pro Tips

### Tip 1: Check Console
Open browser DevTools (F12) to see helpful logs:
- `✅ Your Spline scene and camera presets loaded!`
- `📷 Switching to: Wide`
- `🎬 Starting camera tour...`

### Tip 2: Adjust Live
While the scene is running:
1. Click a camera button
2. Use mouse to adjust the view
3. Press F12 → Console
4. Type: `window.camera.position` to see position
5. Update the preset with those coordinates

### Tip 3: Test Mobile
Open in mobile browser or use DevTools device emulation to test responsive buttons.

---

## 🔍 Line Numbers Reference

**HybridScene.tsx approximate line numbers:**
- Line 20: Add import
- Line 121: Add `<YourCustomSplineScene />`

**Note:** Your line numbers may vary slightly depending on your current code.

---

## 🎯 Success Criteria

After integration, you should have:
- ✅ No console errors
- ✅ Spline scene visible in galaxy
- ✅ Camera buttons at bottom
- ✅ Smooth camera transitions
- ✅ Tour button working
- ✅ ~60 FPS performance

---

**That's it!** Just those 2 simple edits and you're done! 🎉
