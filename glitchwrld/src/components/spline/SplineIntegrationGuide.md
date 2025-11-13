# Spline Integration Guide

## Integrating Your Spline Export with the Meshed System

### Step 1: Understanding the Export

Your Spline export looks like this:
```tsx
import useSpline from '@splinetool/r3f-spline'

export default function Scene({ ...props }) {
  const { nodes, materials } = useSpline('https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode')
  return (
    <>
      <color attach="background" args={['#3f4b8e']} />
      <group {...props} dispose={null}>
        <scene name="Scene 1">
          <PerspectiveCamera ... />
          <group name="Moon" ... />
          {/* More objects */}
        </scene>
      </group>
    </>
  )
}
```

### Step 2: How We've Integrated It

We've created `CustomSplineScene.tsx` which:

1. **Loads your Spline scene** using the same URL
2. **Extracts nodes and materials** from `useSpline` hook
3. **Positions objects at planet locations** using the meshed positioning algorithm
4. **Animates objects** to orbit with their assigned planets
5. **Supports AR/VR** with automatic scaling

### Step 3: Object Mapping

Your Spline objects will be automatically assigned to planets:

```
Spline Object #1 → Mercury position
Spline Object #2 → Venus position
Spline Object #3 → Earth position
Spline Object #4 → Mars position
Spline Object #5 → Jupiter position
Spline Object #6 → Saturn position
Spline Object #7 → Uranus position
Spline Object #8 → Neptune position
```

### Step 4: Current Integration

In `HybridScene.tsx`, you can choose:

**Option A: Use Generic SplineR3FModels** (current)
```tsx
<SplineR3FModels />
```
- Works with any Spline scene
- Generic positioning and animation

**Option B: Use CustomSplineScene** (recommended for your scene)
```tsx
<CustomSplineSceneWrapper />
```
- Specifically tailored for your Spline export
- Better control over object mapping
- Optimized for planet alignment

### Step 5: Switching to Your Custom Scene

To use your custom Spline integration:

1. **Update HybridScene.tsx**:
```tsx
// Replace this:
import { SplineR3FModels } from "../spline/SplineR3FModels"

// With this:
import { CustomSplineSceneWrapper } from "../spline/CustomSplineScene"

// Then in the component:
// Replace:
<SplineR3FModels />

// With:
<CustomSplineSceneWrapper />
```

2. **Set the Spline URL** (already done in your setup):
```tsx
// The URL is already set in HybridScene.tsx:
setSplineScene('https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode')
```

### Step 6: Object Identification

If you want specific Spline objects at specific planets, you can modify the mapping:

```tsx
// In CustomSplineScene.tsx, find the useFrame section and add:

const objectPlanetMapping = {
  'Moon': 'Earth',      // Moon object goes to Earth
  'Satellite': 'Mars',  // Satellite goes to Mars
  'Spaceship': 'Jupiter', // etc.
}
```

### Step 7: Customizing Your Scene

#### Adjust Object Scales
```tsx
// In CustomSplineScene.tsx, find:
const baseScale = planet.size * 1.5

// Change to:
const baseScale = planet.size * 2.5  // Make objects larger
// or
const baseScale = planet.size * 0.8  // Make objects smaller
```

#### Adjust Rotation Speed
```tsx
// Find:
mesh.rotation.x += rotationSpeed * 0.01 * delta * 60

// Change multiplier:
mesh.rotation.x += rotationSpeed * 0.02 * delta * 60  // Faster rotation
```

#### Disable Background Color
Your Spline export includes:
```tsx
<color attach="background" args={['#3f4b8e']} />
```

We've removed this in CustomSplineScene so it doesn't override our galaxy background. If you want to use it, uncomment in the component.

### Step 8: Camera Handling

Your Spline scene includes a camera:
```tsx
<PerspectiveCamera
  name="Camera"
  makeDefault={true}
  far={100000}
  near={70}
  fov={45}
  position={[-10878.75, 7823.79, 33773.1]}
/>
```

We've filtered this out in CustomSplineScene to use our galaxy camera instead. This ensures:
- Consistent camera controls across the scene
- OrbitControls work properly
- AR/VR camera switching works

If you need the Spline camera for a specific view, you can:
1. Store its position as a preset
2. Use it for a "cinematic mode"
3. Interpolate between galaxy and Spline cameras

### Step 9: Testing

After integrating:

1. **Check Console**:
```
🪐 Generated planet positions for Spline objects: 8
🎨 Found X Spline objects to position
```

2. **Verify Positions**:
- Objects should appear at planet locations
- Objects should orbit with planets
- Star clusters should surround objects

3. **Test Interactions**:
- Click on Spline objects
- Hover over objects (should show pointer cursor)
- Try VR/AR mode

### Step 10: Advanced Integration

#### Add Object-Specific Behaviors

```tsx
// In CustomSplineScene.tsx, in useFrame:

meshRefs.current.forEach((mesh, index) => {
  // ... existing code ...

  // Add custom behavior based on object name
  if (mesh.name === 'Moon') {
    // Make moon spin faster
    mesh.rotation.y += delta * 2
  }

  if (mesh.name === 'Spaceship') {
    // Make spaceship bob up and down
    mesh.position.y += Math.sin(time * 2) * 0.1
  }
})
```

#### Add Trails/Effects

```tsx
// Create a trail for a specific object
if (mesh.name === 'Comet') {
  // Add particle trail effect
  // (Implement using THREE.Points or similar)
}
```

### Step 11: Performance Optimization

If your Spline scene is complex:

```tsx
// In CustomSplineScene.tsx, add LOD (Level of Detail):

const { mode: xrMode } = useXRStore()

// Simplify in XR
if (xrMode !== 'desktop') {
  // Reduce geometry detail
  // Skip certain objects
  // Use simpler materials
}
```

### Step 12: Debugging

Enable debug mode:
```tsx
// In CustomSplineScene.tsx:

console.log('Available nodes:', Object.keys(nodes))
console.log('Available materials:', Object.keys(materials))

// In useFrame:
console.log('Mesh positions:', meshRefs.current.map(m => m.position))
```

## Summary

Your Spline scene is now:
- ✅ Loaded using R3F integration
- ✅ Positioned at planet locations
- ✅ Orbiting with planets
- ✅ Color-coordinated with planet clusters
- ✅ AR/VR compatible
- ✅ Interactive (click/hover)
- ✅ Part of the meshed system

The key advantage: **Your Spline objects are now part of the unified galaxy visualization**, moving and interacting with the planet-aligned starfield system!
