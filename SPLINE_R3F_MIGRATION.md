# Spline R3F Migration Summary

## Overview

This project has been successfully migrated from using standalone Spline overlays (`@splinetool/react-spline`) to R3F-integrated Spline models (`@splinetool/r3f-spline`). This migration enables full AR/VR support through React Three Fiber and `@react-three/xr`.

## What Changed

### Before (Overlay Approach)
- **Component**: `SplineOverlay.tsx` - Rendered Spline in a separate canvas layer
- **Integration**: Spline ran in its own WebGL context, overlaid on top of the R3F scene
- **XR Support**: ❌ Not compatible with AR/VR due to separate rendering contexts
- **Performance**: Two separate WebGL contexts consuming resources

### After (R3F Integration)
- **Component**: `SplineR3FModels.tsx` - Renders Spline objects directly in the R3F scene
- **Integration**: Spline models are part of the unified R3F scene graph
- **XR Support**: ✅ Full AR/VR support via `@react-three/xr`
- **Performance**: Single WebGL context, better performance

## Key Components

### 1. SplineR3FModels.tsx
- Main component that loads Spline models using the `useSpline` hook
- Renders nodes and materials from Spline scenes as R3F meshes
- Handles XR-aware scaling and positioning
- Supports click and hover interactions

### 2. SplineR3FHelpers.ts
- Utility functions for positioning Spline objects in 3D space
- Galaxy-aligned positioning using spiral arm algorithms
- Solar system data integration
- XR transformation helpers

### 3. HybridScene.tsx
- Updated to use `<XR>` wrapper directly in SceneContent
- Integrates `SplineR3FModels` as part of the scene graph
- Removed separate Spline layer

### 4. XRModeSwitcher.tsx
- Fixed XR store API compatibility
- Proper session management for AR/VR modes

## How to Use

### Basic Usage

```tsx
import { SplineR3FModels } from './components/spline/SplineR3FModels'

// In your R3F scene:
<Canvas>
  <XR>
    {/* Your other 3D content */}
    <Galaxy />

    {/* Spline models integrated in the scene */}
    <SplineR3FModels />
  </XR>
</Canvas>
```

### Setting a Spline Scene URL

```tsx
import { useHybridStore } from './stores/hybridStore'

const setSplineScene = useHybridStore((state) => state.setSplineScene)

// Set your Spline export URL
setSplineScene('https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode')
```

### Controlling Visibility

```tsx
const setLayerVisible = useHybridStore((state) => state.setLayerVisible)

// Show/hide Spline models
setLayerVisible('spline', true)  // Show
setLayerVisible('spline', false) // Hide
```

## AR/VR Features

### Automatic XR Scaling
- **Desktop**: Normal scale (1.0)
- **VR**: Scaled down to 0.3 for comfortable viewing
- **AR**: Scaled down to 0.1 for tabletop AR experience

### XR-Aware Interactions
- Click and hover events work in both desktop and XR modes
- Objects automatically adjust position and scale based on XR mode
- Integrated with the unified XR store

### Entering AR/VR

Users can enter AR/VR mode using the `XRModeSwitcher` component:
- **VR Button**: Enters immersive VR mode
- **AR Button**: Enters immersive AR mode (on compatible devices)
- **Exit Button**: Returns to desktop mode

## Migration Notes

### Deprecated Components

The following components have been deprecated and renamed with `.deprecated` extension:
- `SplineOverlay.tsx.deprecated` - Old overlay-based Spline component
- `SplineModels.tsx.deprecated` - Old standalone Spline models component

These are kept for reference but should not be used in new code.

### Spline Helper Functions

The old `SplineHelpers.ts` class has been supplemented with:
- `SplineR3FHelpers.ts` - R3F-specific helper functions
- Both work with the same positioning algorithms and solar system data
- R3F helpers work directly with Three.js Object3D instances

### Package Dependencies

**Required packages** (already installed):
- `@splinetool/r3f-spline`: ^1.0.2 - R3F Spline loader hook
- `@react-three/xr`: ^6.6.27 - XR support for R3F
- `@react-three/fiber`: ^9.4.0 - React renderer for Three.js
- `@react-three/drei`: ^10.7.6 - R3F helpers

**Deprecated (can be removed in future cleanup)**:
- `@splinetool/react-spline`: ^4.1.0 - Old standalone Spline component
- `@splinetool/runtime`: ^1.10.56 - Runtime for standalone Spline

## Testing

### Build Test
```bash
cd glitchwrld
npm run build
```
✅ Build succeeded with no TypeScript errors

### Development
```bash
cd glitchwrld
npm run dev
```

Access the app and test:
1. **Desktop Mode**: Verify Spline models render correctly
2. **VR Mode**: Click "Enter VR" and verify models scale appropriately
3. **AR Mode**: Click "Enter AR" on compatible devices and test placement

## Performance Considerations

### Single WebGL Context
- The migration to R3F integration means all rendering happens in one WebGL context
- This reduces memory usage and improves performance
- Especially beneficial for XR where resources are more constrained

### XR Optimizations
- Particle count automatically reduced in XR modes (via `particleMultiplier`)
- Bloom effects reduced by 50% in XR
- OrbitControls disabled in XR modes

## Future Enhancements

1. **Dynamic Spline Model Loading**: Support multiple Spline scenes that can be switched at runtime
2. **Hand Tracking**: Add hand tracking support for more natural XR interactions
3. **AR Plane Detection**: Implement surface detection for better AR placement
4. **Physics Integration**: Add physics to Spline objects using Cannon.js or Rapier

## Troubleshooting

### Spline Models Not Appearing
- Check that `splineScene` URL is set in the hybrid store
- Verify `layers.spline.visible` is set to `true`
- Check browser console for loading errors

### XR Mode Not Working
- Ensure you're using HTTPS (required for WebXR)
- Check device compatibility with WebXR
- Verify XR permissions are granted

### Performance Issues
- Reduce particle count in XR modes
- Lower bloom intensity
- Disable post-processing effects in XR

## References

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/xr Documentation](https://github.com/pmndrs/xr)
- [Spline for React Three Fiber](https://github.com/splinetool/r3f-spline)
- [WebXR Device API](https://www.w3.org/TR/webxr/)
