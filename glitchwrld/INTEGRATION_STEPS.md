# Integration Steps for Your Spline Scene

Step-by-step guide to integrate your Spline scene with multiple camera angles.

**Your Spline URL:** `https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode`

---

## 🚀 Quick Integration (5 minutes)

### Step 1: Add to HybridScene.tsx

Open `src/components/core/HybridScene.tsx`

**Add this import** at the top (around line 20):
```typescript
import { YourCustomSplineScene } from '../spline/YourCustomSplineScene'
```

**Add the component** inside `SceneContent()` after `<AccurateSolarSystem />` (around line 121):
```typescript
{/* Accurate Solar System - All 8 planets with realistic proportions */}
<AccurateSolarSystem timeScale={0.3} showOrbits={false} />

{/* YOUR CUSTOM SPLINE SCENE - Add this line */}
<YourCustomSplineScene />
```

### Step 2: Run the Dev Server

```bash
cd glitchwrld
npm run dev
```

### Step 3: Open in Browser

Visit: **http://localhost:5173**

You should see:
- ✅ Your Spline scene in the galaxy
- ✅ Camera control buttons at the bottom
- ✅ Smooth camera transitions when you click buttons
- ✅ "Start Tour" button for automated tour

---

## 🎮 What You Get

### 8 Camera Angles

1. **📷 Wide** - Wide establishing shot (0, 30, 60)
2. **🎯 Front** - Straight-on front view (0, 5, 25)
3. **🔍 Close** - Close-up detail (5, 3, 10)
4. **↔️ Side** - Side profile (35, 8, 0)
5. **⬇️ Top** - Bird's eye view (0, 40, 0)
6. **⭐ Hero** - Diagonal hero shot (20, 15, 20)
7. **🎭 Drama** - Low angle dramatic (10, -5, 15)
8. **🎬 Orbit** - Cinematic orbit (25, 12, 18)

### Interactive Controls

- Click any button for smooth 1.5s camera transition
- "Start Tour" button runs automatic tour through all 8 angles
- Each view optimized for your Spline scene
- Click on objects in the scene for interaction

---

## 🎬 Automated Camera Tour

The tour runs automatically when you click "Start Tour":

1. **Wide View** → 3.5s pause
2. **Front View** → 3s pause
3. **Close Detail** → 3s pause
4. **Side Profile** → 3s pause
5. **Top Down** → 3.5s pause
6. **Diagonal Hero** → 3.5s pause
7. **Low Angle** → 3.5s pause
8. **Cinematic Orbit** → 4s pause
9. **Back to Wide** → End

**Total tour time:** ~30 seconds

---

## 🎨 Customization Options

### Adjust Camera Positions

Open `src/components/spline/YourCustomSplineScene.tsx` and find the `addCameraPreset()` calls.

**Example - Modify the Wide View:**
```typescript
addCameraPreset({
  id: 'your-scene-wide',
  name: 'Wide View',
  position: [0, 30, 60], // ← Change these numbers [x, y, z]
  target: [0, 0, 0],     // ← Where camera looks at
  fov: 70,               // ← Field of view (45-80)
  // ... rest of config
})
```

**Tips:**
- Increase Y for higher camera
- Increase Z for camera further back
- Decrease FOV for tighter shot (45-55)
- Increase FOV for wider shot (70-80)

### Adjust Tour Timing

Find the `tourSequence` array:
```typescript
const tourSequence = [
  { preset: 'your-scene-wide', duration: 2500, wait: 3500 },
  //                           ↑ transition  ↑ pause time
]
```

- `duration` - How long camera takes to move (milliseconds)
- `wait` - How long to pause at this angle (milliseconds)

### Change Button Appearance

Find `buttonStyle`:
```typescript
const buttonStyle = {
  backgroundColor: '#2196F3', // ← Change color
  fontSize: '13px',           // ← Change size
  padding: '10px 14px',       // ← Change padding
  // ...
}
```

### Remove UI Buttons

If you prefer using Leva controls instead of buttons:

1. Replace `<YourCustomSplineScene />` with `<YourCustomSplineSceneMinimal />`
2. Add Leva controls (see below)

---

## 🎛️ Add Leva UI Controls (Optional)

For a professional control panel instead of buttons:

### Step 1: Open GalaxyControls.tsx

File: `src/components/ui/GalaxyControls.tsx`

### Step 2: Add Import

```typescript
import { CameraPresetControls } from './CameraPresetControls'
```

### Step 3: Add Component

Inside the main component, add:
```typescript
<CameraPresetControls />
```

Now you'll have camera controls in the Leva panel on the right side!

---

## 🔧 Advanced Options

### Add More Camera Angles

Copy and modify a preset:
```typescript
addCameraPreset({
  id: 'my-custom-angle',      // ← Unique ID
  name: 'My Custom View',     // ← Display name
  position: [15, 10, 20],     // ← Camera position
  target: [0, 2, 0],          // ← Look at point
  fov: 60,                    // ← Field of view
  description: 'My custom camera angle',
  showModels: ['main-spline-scene'],
  settings: {
    bloomIntensity: 1.2,
    enableOrbitControls: true,
  },
})
```

Then add a button:
```typescript
<button
  onClick={() => quickSwitch('my-custom-angle', 'Custom')}
  style={buttonStyle}
>
  ✨ Custom
</button>
```

### Keyboard Shortcuts

Add this inside `useEffect`:
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
      case '1': quickSwitch('your-scene-wide', 'Wide'); break
      case '2': quickSwitch('your-scene-front', 'Front'); break
      case '3': quickSwitch('your-scene-closeup', 'Close'); break
      case '4': quickSwitch('your-scene-side', 'Side'); break
      case '5': quickSwitch('your-scene-top', 'Top'); break
      case 't': startCameraTour(); break
    }
  }

  window.addEventListener('keypress', handleKeyPress)
  return () => window.removeEventListener('keypress', handleKeyPress)
}, [quickSwitch, startCameraTour])
```

### Click Interactions

Objects in your Spline scene are clickable! Add custom actions:

```typescript
interaction: {
  clickable: true,
  onClick: (name) => {
    console.log('Clicked:', name)

    // Example: Switch camera when clicking specific object
    if (name === 'Spaceship') {
      quickSwitch('your-scene-closeup', 'Close')
    }

    // Example: Show alert
    alert(`You clicked: ${name}`)

    // Example: Open modal, play sound, etc.
  },
}
```

---

## 📱 Mobile Support

The camera controls work on mobile:
- Buttons automatically wrap on small screens
- Touch-friendly button sizes
- Responsive layout

For better mobile experience, you can:
1. Reduce number of buttons shown
2. Use Leva controls instead
3. Add swipe gestures (advanced)

---

## ❓ Troubleshooting

### Scene Not Visible

**Check:**
1. Spline URL is correct
2. Component is imported in HybridScene.tsx
3. Component is rendered inside `<SceneContent>`
4. Browser console for errors

**Fix:**
```typescript
// Verify this line exists:
<YourCustomSplineScene />
```

### Camera Doesn't Move

**Check:**
1. Buttons are clickable (not disabled)
2. Console shows camera logs
3. `enableOrbitControls` is true

**Fix:**
```typescript
settings: {
  enableOrbitControls: true, // ← Must be true
}
```

### Buttons Don't Appear

**Check:**
1. Using `YourCustomSplineScene` (not Minimal version)
2. Browser window is wide enough
3. Z-index isn't blocked

**Fix:**
Increase z-index in button container:
```typescript
zIndex: 9999, // ← Higher number
```

### Tour Won't Start

**Check:**
1. All preset IDs match in tour sequence
2. Console for errors
3. `tourRunning` state

**Debug:**
```typescript
console.log('Tour sequence:', tourSequence)
```

---

## 🎯 Testing Checklist

After integration, verify:

- [ ] Spline scene appears in galaxy
- [ ] All 8 camera buttons work
- [ ] Smooth transitions between angles
- [ ] "Start Tour" button works
- [ ] Tour completes full cycle
- [ ] Objects are clickable
- [ ] No console errors
- [ ] Works on mobile
- [ ] Performance is smooth

---

## 🚀 Next Steps

1. ✅ Integrate your scene (follow steps above)
2. ✅ Test all camera angles
3. ✅ Run the automated tour
4. ✅ Customize positions/timing if needed
5. ✅ (Optional) Add Leva controls
6. ✅ (Optional) Add keyboard shortcuts
7. ✅ Share your creation!

---

## 📞 Need Help?

Check these files:
- `YourCustomSplineScene.tsx` - Your scene implementation
- `CAMERA_PRESETS_GUIDE.md` - Complete camera guide
- `QUICK_REFERENCE.md` - Quick reference card
- Browser console - Debug logs

---

**Ready to go!** Just follow Step 1 and Step 2 above, and you'll have your Spline scene with 8 camera angles running in under 5 minutes! 🎬✨
