# Camera Presets Guide

Control different camera angles and create cinematic views for your Spline models!

## Quick Start

### Step 1: Add Camera Controls to Your Scene

Open `src/components/ui/GalaxyControls.tsx` and add:

```typescript
import { CameraPresetControls } from './CameraPresetControls'

// Inside the component:
<CameraPresetControls />
```

Or for a simpler mobile-friendly version:

```typescript
import { QuickCameraButtons } from './CameraPresetControls'

<QuickCameraButtons />
```

### Step 2: Use Camera Presets in Code

```typescript
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'

function MyComponent() {
  const { applyPresetAnimated } = useCameraPresets()

  // Apply a preset with smooth animation
  const showGalaxyCore = () => {
    applyPresetAnimated('closeup-center', 2000) // 2 second transition
  }

  return <button onClick={showGalaxyCore}>View Galaxy Core</button>
}
```

## Available Presets

### Overview Shots
- **Wide Overview** (`overview-wide`) - Wide angle view of entire galaxy
- **Top Down View** (`overview-top`) - Bird's eye view
- **Side Profile** (`overview-side`) - Side view showing thickness

### Close-up Views
- **Galaxy Core** (`closeup-center`) - Close view of galaxy center
- **Spiral Arm** (`closeup-arm`) - Close-up of a spiral arm

### Solar System Views
- **Solar System Overview** (`solar-overview`) - View of entire solar system
- **Inner Planets** (`solar-inner`) - Mercury, Venus, Earth, Mars
- **Outer Planets** (`solar-outer`) - Jupiter, Saturn, Uranus, Neptune

### Cinematic Angles
- **Low Angle Drama** (`cinematic-low`) - Dramatic low angle shot
- **Dutch Angle** (`cinematic-dutch`) - Tilted perspective
- **Orbital Perspective** (`cinematic-orbit`) - Perspective from orbit

### Model Focus
- **Model Showcase** (`model-showcase`) - Focused view for Spline models
- **Model Close-up** (`model-closeup`) - Close-up of specific model

### Exploration
- **Diagonal Explorer** (`explore-diagonal`) - Diagonal exploration view
- **Widescreen Vista** (`explore-widescreen`) - Wide cinematic view

## Using the Hook

### Apply Preset Instantly

```typescript
const { applyPresetInstant } = useCameraPresets()

// No animation, instant switch
applyPresetInstant('overview-wide')
```

### Apply Preset with Animation

```typescript
const { applyPresetAnimated } = useCameraPresets()

// 2 second smooth transition
applyPresetAnimated('closeup-center', 2000)

// With custom easing
applyPresetAnimated('cinematic-orbit', 3000, 'easeInOut')
// Options: 'linear', 'easeInOut', 'easeOut'
```

### Save Current View

```typescript
const { saveCurrentAsPreset } = useCameraPresets()

const preset = saveCurrentAsPreset(
  'my-custom-view',
  'My Awesome View',
  'Perfect angle for showcasing'
)

// Then add it to the system
import { addCameraPreset } from '../../utils/camera/cameraPresets'
addCameraPreset(preset)
```

## Creating Custom Presets

### Method 1: Code

```typescript
import { addCameraPreset } from '../../utils/camera/cameraPresets'

addCameraPreset({
  id: 'my-spaceship-view',
  name: 'Spaceship Showcase',
  position: [10, 5, 8],
  target: [10, 5, -5], // Look at spaceship position
  fov: 55,
  description: 'Perfect view of my spaceship',
  showModels: ['my-spaceship'], // Show specific models
  hideModels: ['asteroid-1'], // Hide others
  settings: {
    bloomIntensity: 1.2,
    enableOrbitControls: true,
  },
})
```

### Method 2: Save Current View (Runtime)

1. Position camera where you want
2. Use Leva controls: Camera Presets → Save Current View
3. Or in code:
   ```typescript
   const preset = saveCurrentAsPreset('custom-1', 'My View')
   addCameraPreset(preset)
   ```

## Preset Configuration

```typescript
interface CameraPreset {
  id: string                           // Unique ID
  name: string                         // Display name
  position: [number, number, number]   // Camera position [x, y, z]
  target: [number, number, number]     // Look-at target [x, y, z]
  fov?: number                         // Field of view (default: 65)
  description?: string                 // Description
  sceneMode?: 'galaxy' | 'solarSystem' // Scene mode
  showModels?: string[]                // Models to show
  hideModels?: string[]                // Models to hide
  settings?: {
    bloomIntensity?: number            // Bloom effect
    rotationSpeed?: number             // Galaxy rotation
    enableOrbitControls?: boolean      // Allow camera control
  }
}
```

## Examples with Spline Models

### Example 1: Showcase a Spaceship

```typescript
import { useEffect } from 'react'
import { useCameraPresets } from '../../hooks/camera/useCameraPresets'
import { useSplineModels } from '../spline/MultiSplineScene'
import { addCameraPreset } from '../../utils/camera/cameraPresets'

export function SpaceshipShowcase() {
  const { registerModel } = useSplineModels()
  const { applyPresetAnimated } = useCameraPresets()

  useEffect(() => {
    // Register spaceship
    registerModel({
      id: 'hero-ship',
      name: 'Hero Spaceship',
      url: 'YOUR-URL',
      position: [15, 5, -5],
      scale: 1.2,
    })

    // Create camera preset for this ship
    addCameraPreset({
      id: 'hero-ship-view',
      name: 'Hero Ship Close-up',
      position: [18, 6, -2],
      target: [15, 5, -5],
      fov: 50,
      showModels: ['hero-ship'],
      settings: {
        bloomIntensity: 1.3,
      },
    })

    // Automatically switch to this view after 1 second
    setTimeout(() => {
      applyPresetAnimated('hero-ship-view', 2500)
    }, 1000)
  }, [registerModel, applyPresetAnimated])

  return null
}
```

### Example 2: Tour Multiple Models

```typescript
export function ModelTour() {
  const { applyPresetAnimated } = useCameraPresets()

  useEffect(() => {
    // Define tour stops
    const tour = [
      { preset: 'overview-wide', duration: 3000 },
      { preset: 'model-showcase', duration: 4000 },
      { preset: 'closeup-center', duration: 3000 },
      { preset: 'solar-overview', duration: 4000 },
      { preset: 'cinematic-orbit', duration: 5000 },
    ]

    let currentIndex = 0

    const nextStop = () => {
      const stop = tour[currentIndex]
      applyPresetAnimated(stop.preset, 2000)

      currentIndex = (currentIndex + 1) % tour.length
      setTimeout(nextStop, stop.duration)
    }

    // Start tour after 2 seconds
    const timeoutId = setTimeout(nextStop, 2000)

    return () => clearTimeout(timeoutId)
  }, [applyPresetAnimated])

  return null
}
```

### Example 3: Interactive Button Tours

```typescript
export function CameraTourButtons() {
  const { applyPresetAnimated } = useCameraPresets()

  return (
    <div className="camera-tour-buttons">
      <button onClick={() => applyPresetAnimated('overview-wide', 2000)}>
        Overview
      </button>
      <button onClick={() => applyPresetAnimated('closeup-center', 2000)}>
        Galaxy Core
      </button>
      <button onClick={() => applyPresetAnimated('model-showcase', 2000)}>
        Show Models
      </button>
      <button onClick={() => applyPresetAnimated('cinematic-orbit', 3000)}>
        Cinematic
      </button>
    </div>
  )
}
```

## Combining with Spline Models

### Scene with Model-Specific Views

```typescript
import { useEffect } from 'react'
import { useSplineModels, MultiSplineScene } from './MultiSplineScene'
import { addCameraPreset } from '../../utils/camera/cameraPresets'

export function SpaceStationScene() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // Register space station
    registerModel({
      id: 'station-alpha',
      name: 'Station Alpha',
      url: 'YOUR-STATION-URL',
      position: [0, 10, 0],
      scale: 1.5,
    })

    // Register docked ships
    registerModel({
      id: 'docked-ship-1',
      name: 'Docked Ship 1',
      url: 'YOUR-SHIP-URL',
      position: [2, 10, 0],
      scale: 0.5,
    })

    // Create camera presets for this scene
    addCameraPreset({
      id: 'station-approach',
      name: 'Station Approach',
      position: [0, 15, 30],
      target: [0, 10, 0],
      fov: 60,
      description: 'Approaching the station',
      showModels: ['station-alpha', 'docked-ship-1'],
    })

    addCameraPreset({
      id: 'station-docking-bay',
      name: 'Docking Bay View',
      position: [3, 11, 2],
      target: [2, 10, 0],
      fov: 50,
      description: 'View of docking bay',
      showModels: ['station-alpha', 'docked-ship-1'],
      settings: {
        bloomIntensity: 1.1,
      },
    })
  }, [registerModel])

  return <MultiSplineScene />
}
```

## Animation Sequences

### Create a Camera Path

```typescript
export function CameraPath() {
  const { applyPresetAnimated } = useCameraPresets()

  const runCameraPath = useCallback(() => {
    const path = [
      { id: 'overview-wide', duration: 3000, wait: 2000 },
      { id: 'closeup-arm', duration: 2500, wait: 3000 },
      { id: 'closeup-center', duration: 2000, wait: 2500 },
      { id: 'cinematic-orbit', duration: 3000, wait: 4000 },
      { id: 'overview-top', duration: 2500, wait: 2000 },
    ]

    let totalTime = 0

    path.forEach((step) => {
      setTimeout(() => {
        applyPresetAnimated(step.id, step.duration)
      }, totalTime)

      totalTime += step.duration + step.wait
    })
  }, [applyPresetAnimated])

  return <button onClick={runCameraPath}>Start Camera Tour</button>
}
```

## Tips & Best Practices

### Camera Positioning
1. Start with overview, then zoom in
2. Use `target` to focus on specific objects
3. Keep FOV between 45-80 for natural perspective
4. Higher Y positions for better galaxy overview

### Animation Timing
- Quick cuts: 1000-1500ms
- Smooth transitions: 2000-3000ms
- Cinematic: 3000-5000ms

### Model Focus
1. Position model first
2. Create camera preset looking at model position
3. Use `showModels`/`hideModels` to control visibility
4. Adjust FOV for close-ups (45-55) or wide shots (70-80)

### Performance
- Disable orbit controls during automated tours
- Reduce bloom intensity for close-ups
- Use instant presets for UI responsiveness

## Keyboard Shortcuts (Optional)

Add to your app:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
      case '1': applyPresetAnimated('overview-wide', 1500); break
      case '2': applyPresetAnimated('closeup-center', 1500); break
      case '3': applyPresetAnimated('solar-overview', 1500); break
      case '4': applyPresetAnimated('cinematic-orbit', 2000); break
    }
  }

  window.addEventListener('keypress', handleKeyPress)
  return () => window.removeEventListener('keypress', handleKeyPress)
}, [applyPresetAnimated])
```

## Export/Import Presets

### Export

```typescript
import { CameraPresets } from '../../utils/camera/cameraPresets'

const json = CameraPresets.exportPresets()
console.log(json)
// Copy to clipboard
navigator.clipboard.writeText(json)
```

### Import

```typescript
const json = `[{"id":"custom-1", ...}]` // Your JSON
CameraPresets.importPresets(json)
```

## Integration Checklist

- [ ] Import camera preset controls in GalaxyControls.tsx
- [ ] Add `<CameraPresetControls />` or `<QuickCameraButtons />`
- [ ] Test presets in Leva panel
- [ ] Create custom presets for your Spline models
- [ ] (Optional) Add keyboard shortcuts
- [ ] (Optional) Create automated camera tours

## Complete Example

See `src/components/spline/ExampleSplineModels.tsx` for integration examples.

Happy filming! 🎬🚀
