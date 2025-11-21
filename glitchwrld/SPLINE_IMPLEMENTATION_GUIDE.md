# Spline Model Implementation Guide

This guide shows you how to add new Spline 3D models to your Galaxy visualization project.

## Quick Start: Adding a New Spline Model

### Step 1: Export Your Spline Scene

1. Go to [Spline](https://spline.design) and create or open your 3D model
2. Click **Export** → **Code Export** → **Get URL**
3. Copy the `.splinecode` URL (e.g., `https://prod.spline.design/YOUR-ID/scene.splinecode`)

### Step 2: Add the URL to Your Project

Open `src/utils/spline/splineHelpers.ts` and add your new URL:

```typescript
static readonly DEFAULT_SPLINE_URLS = {
  main: 'https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode',
  spaceship: 'https://prod.spline.design/YOUR-SPACESHIP-ID/scene.splinecode', // NEW
  asteroid: 'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',  // NEW
  // Add more scenes here
}
```

### Step 3: Load the Model in Your Scene

There are **two methods** to integrate Spline models:

#### Method A: R3F Integration (Recommended for AR/VR)

Use the existing `SplineR3FModels` component which automatically positions models:

```typescript
import { useHybridStore } from '../../stores/hybridStore'
import { SplineHelpers } from '../../utils/spline/splineHelpers'

// In your component or HybridScene.tsx
const { setSplineScene } = useHybridStore()

// Load your Spline scene
useEffect(() => {
  setSplineScene(SplineHelpers.DEFAULT_SPLINE_URLS.spaceship)
}, [])

// The SplineR3FModels component in HybridScene will automatically render it
```

#### Method B: Custom Component (For more control)

Create a custom component for specific Spline scenes:

```typescript
// src/components/spline/SpaceshipFleet.tsx
import { Suspense } from 'react'
import useSpline from '@splinetool/r3f-spline'
import { useHybridStore } from '../../stores/hybridStore'

function SpaceshipFleetContent() {
  const { nodes, materials } = useSpline('https://prod.spline.design/YOUR-ID/scene.splinecode')

  return (
    <group position={[5, 2, -3]}>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key]
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              name={key}
              geometry={node.geometry}
              material={materials[node.material?.name] || node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          )
        }
        return null
      })}
    </group>
  )
}

export function SpaceshipFleet() {
  const showSpaceships = useHybridStore((state) => state.layers.spline.visible)

  if (!showSpaceships) return null

  return (
    <Suspense fallback={null}>
      <SpaceshipFleetContent />
    </Suspense>
  )
}
```

Then add it to `HybridScene.tsx`:

```typescript
import { SpaceshipFleet } from '../spline/SpaceshipFleet'

// Inside SceneContent():
<SpaceshipFleet />
```

## Advanced: Multiple Spline Scenes

### Managing Multiple Models with Zustand

Extend the hybrid store to support multiple Spline scenes:

```typescript
// In hybridStore.ts
interface HybridState {
  // ... existing state
  splineScenes: {
    main: string | null
    spaceship: string | null
    asteroid: string | null
  }
  setSplineSceneByKey: (key: string, url: string | null) => void
}

// In store implementation:
splineScenes: {
  main: null,
  spaceship: null,
  asteroid: null
},
setSplineSceneByKey: (key, url) =>
  set((state) => ({
    splineScenes: { ...state.splineScenes, [key]: url }
  }))
```

### Creating a Multi-Scene Component

```typescript
// src/components/spline/MultiSplineManager.tsx
import { Suspense } from 'react'
import useSpline from '@splinetool/r3f-spline'
import { useHybridStore } from '../../stores/hybridStore'

interface SplineSceneProps {
  url: string
  position?: [number, number, number]
  scale?: number
}

function SplineSceneContent({ url, position = [0, 0, 0], scale = 1 }: SplineSceneProps) {
  const { nodes, materials } = useSpline(url)

  return (
    <group position={position} scale={scale}>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key]
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              name={key}
              geometry={node.geometry}
              material={materials[node.material?.name] || node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          )
        }
        return null
      })}
    </group>
  )
}

export function MultiSplineManager() {
  const splineScenes = useHybridStore((state) => state.splineScenes)
  const showSpline = useHybridStore((state) => state.layers.spline.visible)

  if (!showSpline) return null

  return (
    <>
      {splineScenes.main && (
        <Suspense fallback={null}>
          <SplineSceneContent url={splineScenes.main} position={[0, 0, 0]} />
        </Suspense>
      )}

      {splineScenes.spaceship && (
        <Suspense fallback={null}>
          <SplineSceneContent url={splineScenes.spaceship} position={[10, 5, -5]} scale={0.5} />
        </Suspense>
      )}

      {splineScenes.asteroid && (
        <Suspense fallback={null}>
          <SplineSceneContent url={splineScenes.asteroid} position={[-8, 2, 3]} scale={0.8} />
        </Suspense>
      )}
    </>
  )
}
```

## Positioning Strategies

### 1. Galaxy-Aligned Positioning (Automatic)

The default `SplineR3FModels` component automatically positions models along spiral arms:

```typescript
// This happens automatically in SplineR3FModels.tsx
SplineR3FHelpers.positionSplineObjectsInR3F(
  groupRef.current,
  galaxyParams,
  sceneMode === 'solarSystem' // Use solar system data
)
```

### 2. Manual Positioning

Position models manually at specific coordinates:

```typescript
<group position={[x, y, z]} rotation={[rx, ry, rz]} scale={scale}>
  {/* Your Spline content */}
</group>
```

### 3. Planet-Aligned Positioning

Align models with specific planets:

```typescript
import { getSimplifiedPlanetData } from '../../utils/data/planetDatabase'
import { compressSolarToGalactic } from '../../utils/galaxy/galaxyMath'

const planets = getSimplifiedPlanetData()
const earth = planets.find(p => p.name === 'Earth')

// Position at Earth's location
const galaxyRadius = useHybridStore(state => state.galaxyRadius)
const earthDistance = compressSolarToGalactic(earth.distance, galaxyRadius * 0.5, galaxyRadius)

<group position={[earthDistance, 0, 0]}>
  {/* Your model */}
</group>
```

## Animation & Interaction

### Adding Hover Effects

```typescript
import { useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'

const [hovered, setHovered] = useState(false)

<mesh
  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }}
  onPointerOut={() => setHovered(false)}
  scale={hovered ? 1.2 : 1.0}
>
  {/* mesh content */}
</mesh>
```

### Adding Click Handlers

```typescript
import { useHybridStore } from '../../stores/hybridStore'

const setSelectedObject = useHybridStore(state => state.setSelectedObject)

<mesh
  onClick={(e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setSelectedObject(e.object.name)
    console.log('Clicked:', e.object.name)
  }}
>
  {/* mesh content */}
</mesh>
```

### Frame-Based Animation

```typescript
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const meshRef = useRef<THREE.Mesh>(null)

useFrame((state, delta) => {
  if (!meshRef.current) return

  // Rotate
  meshRef.current.rotation.y += delta * 0.5

  // Pulse
  const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
  meshRef.current.scale.set(scale, scale, scale)
})

<mesh ref={meshRef}>
  {/* mesh content */}
</mesh>
```

## XR Support (AR/VR)

Spline models using R3F integration automatically support AR/VR:

```typescript
// XR transformations happen automatically in SplineR3FModels
SplineR3FHelpers.applyXRTransform(groupRef.current, xrMode, galaxyScale)
```

For custom components, add XR support:

```typescript
import { useXRStore } from '../../stores/xrStore'

const { mode: xrMode, galaxyScale } = useXRStore()

const scale = xrMode === 'ar' ? 0.1 : xrMode === 'vr' ? 0.3 : 1.0
const position = xrMode === 'ar' ? [0, -0.5, 0] : [0, 0, 0]

<group scale={scale * galaxyScale} position={position}>
  {/* Your content */}
</group>
```

## Performance Optimization

### 1. Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

const HeavySplineModel = lazy(() => import('./HeavySplineModel'))

<Suspense fallback={<LoadingPlaceholder />}>
  <HeavySplineModel />
</Suspense>
```

### 2. Conditional Rendering

```typescript
const showSpline = useHybridStore(state => state.layers.spline.visible)
const cameraDistance = useCameraDistance()

// Only render when visible and camera is close
if (!showSpline || cameraDistance > 100) return null
```

### 3. LOD (Level of Detail)

```typescript
import { Lod } from '@react-three/drei'

<Lod distances={[10, 20, 50]}>
  {/* High detail */}
  <SplineModelHigh />
  {/* Medium detail */}
  <SplineModelMedium />
  {/* Low detail */}
  <SplineModelLow />
</Lod>
```

## Naming Convention

When creating Spline models, use descriptive names for objects:

- **Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- **Spaceships**: Spaceship_01, Spaceship_02, etc.
- **Effects**: Nebula_Blue, Nebula_Red, AsteroidBelt, etc.

This allows automatic positioning to work correctly.

## Troubleshooting

### Model Not Appearing

1. Check the Spline URL is correct
2. Verify the model is visible in Spline editor
3. Check browser console for errors
4. Ensure `layers.spline.visible` is true
5. Check if model is positioned outside camera view

### Model Position Wrong

1. Use browser DevTools to inspect object positions
2. Check galaxy parameters (radius, arms, tightness)
3. Verify object names match expected names
4. Check scale - model might be too small/large

### Performance Issues

1. Reduce `particleCount` in galaxy settings
2. Disable bloom or reduce `bloomIntensity`
3. Use simpler Spline models with fewer polygons
4. Enable conditional rendering based on camera distance

## Examples

See these files for examples:
- `src/components/spline/SplineR3FModels.tsx` - R3F integration
- `src/components/spline/AccurateSolarSystem.tsx` - Solar system example
- `src/utils/spline/splineR3FHelpers.ts` - Positioning utilities
- `src/hooks/spline/useSplineIntegration.ts` - Integration hook

## Need Help?

- Check the [Spline documentation](https://docs.spline.design/)
- Check the [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber/)
- Review the existing components in `src/components/spline/`
