# Spline Models - Quick Start Guide

Get your Spline 3D models into the galaxy in 5 minutes!

## Step 1: Get Your Spline URL (2 minutes)

1. Go to [spline.design](https://spline.design)
2. Create or open your 3D model
3. Click **Export** → **Code Export** → **Get URL**
4. Copy the `.splinecode` URL

Example URL: `https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode`

## Step 2: Choose Your Method

### Method A: Quick & Easy (Single Model)

**Use this if you just want to load one Spline scene quickly.**

1. Open `src/components/core/HybridScene.tsx`
2. Find this line (around line 164):
   ```typescript
   if (SplineHelpers.DEFAULT_SPLINE_URLS.main) {
     setSplineScene(SplineHelpers.DEFAULT_SPLINE_URLS.main)
   }
   ```
3. Replace `main` with your URL:
   ```typescript
   setSplineScene('https://prod.spline.design/YOUR-ID/scene.splinecode')
   ```

That's it! Your model will appear in the scene.

### Method B: Multiple Models with Management (Recommended)

**Use this if you want multiple models with animations and controls.**

#### 2.1: Register Your Models

Create or edit `src/components/spline/MySplineModels.tsx`:

```typescript
import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'
import { createSplinePreset } from '../../utils/spline/splineModelManager'

export function MySplineModels() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // Spaceship with orbital animation
    registerModel({
      id: 'my-spaceship',
      name: 'Battle Cruiser',
      url: 'https://prod.spline.design/YOUR-SPACESHIP-ID/scene.splinecode',
      position: [10, 5, -5],
      scale: 0.8,
      animation: {
        rotate: true,
        rotationSpeed: 0.5,
        orbit: true,
        orbitSpeed: 0.3,
      },
    })

    // Or use presets for quick setup
    registerModel(
      createSplinePreset(
        'asteroid',
        'my-asteroid',
        'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',
        [-8, 2, 3]
      )
    )
  }, [registerModel])

  return <MultiSplineScene />
}
```

#### 2.2: Add to Your Scene

Open `src/components/core/HybridScene.tsx` and add:

```typescript
// At the top
import { MySplineModels } from '../spline/MySplineModels'

// Inside SceneContent(), add this line after AccurateSolarSystem:
<MySplineModels />
```

#### 2.3: Add UI Controls (Optional)

Open `src/components/ui/GalaxyControls.tsx` and add:

```typescript
// At the top
import { SplineModelControls } from './SplineModelControls'

// Inside the component:
<SplineModelControls />
```

## Step 3: Position Your Models

### Automatic Positioning

Models are automatically positioned if you use:

```typescript
registerModel({
  // ... other config
  autoPosition: true, // Positions on spiral arms
  alignWithPlanets: true, // Positions at planet locations
})
```

### Manual Positioning

```typescript
position: [x, y, z]  // X: left/right, Y: up/down, Z: forward/back
```

**Common positions:**
- Center: `[0, 0, 0]`
- In front: `[0, 0, -10]`
- To the right: `[10, 0, 0]`
- Above: `[0, 10, 0]`
- Around Earth (approx): `[1, 0, 0]`

## Step 4: Add Animations

### Built-in Animations

```typescript
animation: {
  rotate: true,        // Spin the model
  rotationSpeed: 0.5,  // How fast (0.1-5)

  pulse: true,         // Breathing scale effect
  pulseSpeed: 1.0,     // How fast (0.1-5)

  orbit: true,         // Circle around center
  orbitSpeed: 0.3,     // How fast (0.1-5)
}
```

### Example Combinations

**Slow rotating station:**
```typescript
animation: {
  rotate: true,
  rotationSpeed: 0.1,
}
```

**Fast spinning asteroid:**
```typescript
animation: {
  rotate: true,
  rotationSpeed: 2.5,
  pulse: true,
  pulseSpeed: 0.8,
}
```

**Orbiting spaceship:**
```typescript
animation: {
  rotate: true,
  rotationSpeed: 0.5,
  orbit: true,
  orbitSpeed: 0.3,
}
```

## Step 5: Add Interactivity

### Click Handler

```typescript
interaction: {
  clickable: true,
  onClick: (objectName) => {
    console.log('Clicked:', objectName)
    // Your code here - open modal, play sound, etc.
  },
}
```

### Hover Handler

```typescript
interaction: {
  hoverable: true,
  onHover: (objectName) => {
    console.log('Hovering:', objectName)
    // Your code here - show tooltip, highlight, etc.
  },
}
```

## Complete Example

Here's a complete working example with 3 models:

```typescript
// src/components/spline/SpaceFleet.tsx
import { useEffect } from 'react'
import { MultiSplineScene, useSplineModels } from './MultiSplineScene'

export function SpaceFleet() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // 1. Command Ship (center, slow rotation)
    registerModel({
      id: 'command-ship',
      name: 'USS Enterprise',
      url: 'https://prod.spline.design/SHIP1-ID/scene.splinecode',
      position: [0, 2, 0],
      scale: 1.5,
      animation: {
        rotate: true,
        rotationSpeed: 0.1,
      },
      interaction: {
        clickable: true,
        onClick: (name) => alert(`Welcome aboard the ${name}!`),
      },
    })

    // 2. Fighter (orbiting)
    registerModel({
      id: 'fighter-1',
      name: 'X-Wing Fighter',
      url: 'https://prod.spline.design/FIGHTER-ID/scene.splinecode',
      position: [5, 0, 0],
      scale: 0.5,
      animation: {
        rotate: true,
        rotationSpeed: 1.0,
        orbit: true,
        orbitSpeed: 0.5,
      },
    })

    // 3. Asteroid Field (pulsing)
    registerModel({
      id: 'asteroids',
      name: 'Asteroid Belt',
      url: 'https://prod.spline.design/ASTEROID-ID/scene.splinecode',
      position: [-10, 1, 5],
      scale: 2.0,
      animation: {
        rotate: true,
        rotationSpeed: 0.3,
        pulse: true,
        pulseSpeed: 0.5,
      },
    })

    // Cleanup on unmount
    return () => {
      // Models are automatically cleaned up
    }
  }, [registerModel])

  return <MultiSplineScene />
}
```

Then in `HybridScene.tsx`:

```typescript
import { SpaceFleet } from '../spline/SpaceFleet'

// Inside SceneContent():
<SpaceFleet />
```

## Using Presets (Fastest Method)

The quickest way to add models:

```typescript
import { createSplinePreset } from '../../utils/spline/splineModelManager'

// Just one line per model!
registerModel(createSplinePreset('spaceship', 'ship-1', 'YOUR-URL', [5, 2, -3]))
registerModel(createSplinePreset('asteroid', 'rock-1', 'YOUR-URL', [-5, 0, 2]))
registerModel(createSplinePreset('planet', 'world-1', 'YOUR-URL', [0, 0, 0]))
```

Available presets:
- `spaceship` - Rotating, orbiting
- `planet` - Rotating, pulsing, aligned with planets
- `asteroid` - Fast rotating
- `nebula` - Pulsing effect, no interaction
- `station` - Slow rotation

## Testing Your Models

1. **Run the dev server:**
   ```bash
   cd glitchwrld
   npm run dev
   ```

2. **Open http://localhost:5173**

3. **Press `H` to show keyboard help**

4. **Use Leva controls (right side) to adjust:**
   - Spline layer visibility
   - Individual model settings
   - Position, rotation, scale
   - Animation speeds

## Troubleshooting

### Model doesn't appear
- Check the URL is correct (should end in `.splinecode`)
- Verify `layers.spline.visible` is `true`
- Check console for errors
- Try adjusting position - model might be outside view

### Model is too small/large
- Adjust `scale` property (try 0.1 to 5.0)
- Check if XR mode is active (changes scale)

### Animation not working
- Verify `isAnimating` is `true` in hybrid store
- Check animation speeds aren't too slow
- Make sure the model has `visible: true`

### Can't click on model
- Set `interaction.clickable: true`
- Verify event handlers are attached
- Check if another object is blocking clicks

## Next Steps

- Read the full guide: `SPLINE_IMPLEMENTATION_GUIDE.md`
- Check the API docs in the code comments
- Explore `SplineModelManager` for advanced features
- Try AR/VR mode with your models!

## Need Help?

Check the example files:
- `src/components/spline/MultiSplineScene.tsx`
- `src/components/spline/SplineR3FModels.tsx`
- `src/utils/spline/splineModelManager.ts`
