# Avatar System Integration Instructions

## Files Created

The following files have been created for the avatar game mode system:

### Core Files
1. `src/stores/avatarStore.ts` - Zustand store for avatar state management
2. `src/utils/avatar/avatarConfig.ts` - Configuration constants for avatar physics and controls
3. `src/hooks/avatar/useAvatarMovement.ts` - Hook for handling arrow key input and movement
4. `src/hooks/avatar/useCameraFollow.ts` - Hook for third-person and first-person camera
5. `src/components/avatar/Avatar.tsx` - Visual avatar component (capsule mesh)
6. `src/components/avatar/AvatarController.tsx` - Controller wrapper component
7. `src/components/ui/AvatarControls.tsx` - Leva UI controls for avatar settings

## Integration Steps

To integrate the avatar system into HybridScene.tsx, follow these steps:

### Step 1: Add Imports

Add these imports to `src/components/core/HybridScene.tsx`:

```typescript
import { AvatarControls } from "../ui/AvatarControls"
import { AvatarController } from "../avatar/AvatarController"
import { useAvatarStore } from "../../stores/avatarStore"
```

### Step 2: Add Avatar Controller to Scene

In the `SceneContent` component, add the AvatarController after the AccurateSolarSystem:

```typescript
function SceneContent() {
  const {
    cameraTarget,
    bloomIntensity,
    sceneMode,
    enableOrbitControls,
    constellations,
    nebulaClouds
  } = useHybridStore()
  const { mode: xrMode, particleMultiplier } = useXRStore()

  return (
    <XR store={xrStore}>
      {/* ... existing content ... */}

      {/* Accurate Solar System */}
      <AccurateSolarSystem timeScale={0.3} showOrbits={false} />

      {/* ADD THIS: Avatar System */}
      <AvatarController />

      {/* Camera Controls */}
      <OrbitControls
        enabled={enableOrbitControls && xrMode === 'desktop'}
        /* ... rest of OrbitControls props ... */
      />

      {/* ... rest of scene ... */}
    </XR>
  )
}
```

### Step 3: Add Avatar UI Controls

In the HybridScene component's UI layer, add AvatarControls after GalaxyControls:

```typescript
export function HybridScene() {
  // ... existing code ...

  return (
    <div ref={containerRef} className="hybrid-scene" /* ... */>
      <LayerManager>
        <Layer type="base">
          <Canvas /* ... */>
            {/* ... */}
          </Canvas>
        </Layer>

        {/* UI LAYER */}
        <GalaxyControls />

        {/* ADD THIS: Avatar Controls */}
        <AvatarControls />

        <KeyboardHelp />
        <ConstellationInfoPanel constellation={hoveredConstellation} />
      </LayerManager>
    </div>
  )
}
```

### Step 4: Update KeyboardHelp (Optional)

Consider updating `src/components/ui/KeyboardHelp.tsx` to include avatar controls in the help text:

```
G - Toggle Game Mode
C - Cycle Camera Mode (Orbit/Third-Person/First-Person)
Arrow Keys or WASD - Move Avatar
Shift - Sprint
Space - Jump
```

## How to Use

1. **Enable Game Mode**:
   - Press `G` or use the Leva panel to enable "Game Mode"

2. **Move Avatar**:
   - Use Arrow Keys or WASD to move
   - Press Shift to sprint
   - Press Space to jump

3. **Change Camera**:
   - Press `C` to cycle between Orbit, Third-Person, and First-Person views
   - Or use the Leva controls panel

4. **Adjust Settings**:
   - Open the Leva panel (usually top-right)
   - Expand "Avatar & Game Mode" folder
   - Adjust movement speeds, camera settings, etc.

## Architecture Overview

```
GameMode Enabled
    ↓
AvatarController
    ├── useAvatarMovement (handles input → velocity → position)
    ├── useCameraFollow (camera follows avatar)
    └── Avatar (renders capsule mesh at avatar position)

Camera System:
- Orbit Mode: Free camera (OrbitControls enabled)
- Third-Person: Camera behind avatar (OrbitControls disabled)
- First-Person: Camera at avatar eyes (OrbitControls disabled)
```

## State Management

- **Avatar State**: `avatarStore.ts` - Position, velocity, input, animation state
- **Hybrid State**: `hybridStore.ts` - Camera position/target, orbit controls enable
- **Synchronization**: useCameraFollow updates hybrid store when in game mode

## Next Steps for Enhancement

1. **Add Collision Detection**: Integrate with planets/objects
2. **Add Animations**: Replace bobbing with proper skeletal animations
3. **Add Interactions**: "Press E to interact" when near objects
4. **Add Physics**: Use @react-three/rapier for realistic physics
5. **Replace Avatar Mesh**: Load a proper 3D model (astronaut, spaceship)
6. **Add Planet Landing**: Allow avatar to walk on planet surfaces

## Configuration

All avatar settings can be customized in `src/utils/avatar/avatarConfig.ts`:
- Movement speeds
- Jump force and gravity
- Camera distances and smoothness
- Visual appearance (colors, sizes)
- Key bindings
