# Galaxy Nebula Clouds System

## Overview

A beautiful volumetric nebula cloud system that adds **depth and color** to the galaxy visualization. The clouds use **galaxy-themed colors** (gold core, blue arms, brown dust, plus cosmic pinks and purples) to create a rich, immersive space environment.

## Visual Features

### 🌈 Color Palette

The nebula clouds use a **7-color cosmic palette** that adapts based on position:

**Core Region** (inner 30%):
- 🟡 **Gold** (from galaxy core color)
- 🔵 **Blue** (from galaxy arm color)
- 🟤 **Brown** (from galaxy dust color)
- 💗 **Pink** (nebula accent)

**Middle Region** (30-60%):
- 🔵 **Blue** (cooler tones)
- 💜 **Purple** (cosmic nebula)

**Outer Region** (60-100%):
- 🔷 **Deep Blue** (far space)
- 💜 **Purple** (distant nebula)

This creates a **natural color gradient** from warm core colors to cool outer space colors!

### ✨ Visual Effects

**Volumetric Appearance**:
- Sprite-based billboards with radial gradient texture
- Soft, cloud-like appearance
- Additive blending for luminous glow

**Size Variation**:
- Larger clouds near galaxy core (1.5x multiplier)
- Smaller clouds at outer edges
- Random size variation (1-4x galaxy radius scale)

**Opacity Layering**:
- More opaque clouds near center (70% base)
- Transparent clouds at edges (30% base)
- Creates depth perception

### 🎬 Animations

**Pulsing Effect**:
- Each cloud pulses individually
- Sine wave oscillation (±30% opacity)
- Random phase offsets for natural variation
- Speed: 0.3-0.8 Hz

**Gentle Drift**:
- Slow random movement in 3D space
- X/Z drift: ±0.02 units/second
- Y drift: ±0.01 units/second (slower vertical)
- Wraps around when reaching bounds

**Rotation**:
- Individual cloud sprite rotation
- Speed: ±0.2 radians/second
- Creates swirling effect

**Group Rotation**:
- Entire cloud layer rotates slowly
- 0.01 radians/second
- Simulates galactic rotation

## Distribution Algorithm

### Spiral Pattern
```
For each cloud:
1. Select spiral arm (modulo of cloud count)
2. Calculate distance from center (power distribution for concentration)
3. Apply spiral offset based on distance
4. Add random variation (±0.8 radians)
5. Position in 3D space with height variation
```

**Distance Distribution**:
- Uses `Math.pow(random, 1.5)` for concentration near middle
- Range: 30% to 90% of galaxy radius
- Creates natural clustering

**Height Variation**:
- Random height: ±40% of galaxy radius
- Flattens towards galactic plane
- Creates 3D depth

## Presets

Four quality presets available:

| Preset | Cloud Count | Opacity | Use Case |
|--------|------------|---------|----------|
| **Subtle** | 20 | 0.3 | Minimal, performance-focused |
| **Normal** | 30 | 0.4 | Balanced (default) |
| **Dense** | 50 | 0.5 | Rich detail |
| **Spectacular** | 80 | 0.6 | Maximum visual impact |

## UI Controls

New **"Nebula Clouds"** panel in Leva:

### Show Nebula Clouds
- **Type**: Toggle
- **Default**: ✓ Enabled
- **Effect**: Show/hide entire nebula layer

### Preset
- **Type**: Dropdown
- **Options**: Subtle / Normal / Dense / Spectacular
- **Default**: Normal
- **Effect**: Applies preset cloud count and opacity

### Cloud Count
- **Type**: Slider
- **Range**: 10 - 100
- **Step**: 5
- **Default**: 30
- **Effect**: Number of nebula clouds

### Opacity
- **Type**: Slider
- **Range**: 0.0 - 1.0
- **Step**: 0.05
- **Default**: 0.4
- **Effect**: Overall cloud transparency

### Description
- **Type**: Info text
- **Value**: "Volumetric clouds with galaxy colors"

## Technical Implementation

### Component Structure
```typescript
<GalaxyNebulaClouds
  cloudCount={30}
  opacity={0.4}
  animate={true}
/>
```

### Cloud Data Structure
```typescript
interface NebulaCloud {
  position: THREE.Vector3      // 3D location
  size: number                 // Billboard size
  color: THREE.Color           // From palette
  opacity: number              // Base opacity
  rotationSpeed: number        // Sprite rotation
  driftSpeed: THREE.Vector3    // Movement vector
  pulseSpeed: number           // Oscillation frequency
  pulsePhase: number           // Phase offset
}
```

### Texture Generation
```javascript
// Radial gradient for soft cloud appearance
const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')    // Center
gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)')
gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)')    // Edge
```

### Material Settings
```typescript
new THREE.SpriteMaterial({
  map: cloudTexture,
  color: cloud.color,           // Tint with galaxy colors
  transparent: true,
  opacity: cloud.opacity,
  blending: THREE.AdditiveBlending,  // Glowing effect
  depthWrite: false,            // Prevent z-fighting
  fog: false                    // Independent of scene fog
})
```

## Performance Optimizations

✅ **Sprite-Based Rendering**:
- Single quad per cloud (2 triangles)
- Much faster than volumetric shaders

✅ **Texture Reuse**:
- Single 256x256 gradient texture
- Shared across all clouds
- Minimal VRAM usage

✅ **Efficient Updates**:
- Only updates when animating
- Simple opacity/rotation calculations
- No heavy physics computations

✅ **Conditional Rendering**:
- Disabled via toggle for performance mode
- No overhead when hidden

✅ **Bounded Drift**:
- Wraps clouds instead of spawning new ones
- Constant cloud count

## Integration with Galaxy

### Color Synchronization
- Reads `coreColor`, `armColor`, `dustColor` from store
- Updates when galaxy colors change
- Creates cohesive visual theme

### Spatial Coordination
- Uses `galaxyRadius` and `spiralArms` for distribution
- Matches galaxy spiral pattern
- Positioned relative to galaxy center

### Animation Sync
- Respects `isAnimating` global flag
- Pauses when scene animation disabled
- Consistent with other animated elements

## Files Created/Modified

### New Files
1. **`src/components/effects/GalaxyNebulaClouds.tsx`**
   - Main nebula cloud component
   - Cloud generation and animation
   - Preset configurations

2. **`src/components/ui/NebulaControls.tsx`**
   - Leva UI panel
   - Control bindings

3. **`NEBULA_CLOUDS_SYSTEM.md`**
   - This documentation

### Modified Files
1. **`src/stores/hybridStore.ts`**
   - Added `nebulaClouds` state
   - Added 4 nebula setter methods
   - Added preset logic

2. **`src/components/core/HybridScene.tsx`**
   - Imported GalaxyNebulaClouds
   - Integrated into scene
   - Conditional rendering

3. **`src/components/ui/GalaxyControls.tsx`**
   - Added NebulaControls to UI

## Visual Examples

### Core Region Clouds
```
Position: (2, 0.5, 1.5) - near center
Size: Large (4.5 units)
Color: Gold (#ffd700) or Pink (#ff69b4)
Opacity: 70%
Effect: Warm, glowing core nebula
```

### Arm Region Clouds
```
Position: (8, -1.2, 6.8) - spiral arm
Size: Medium (2.8 units)
Color: Blue (#87ceeb) or Purple (#9370db)
Opacity: 50%
Effect: Cool spiral nebula lanes
```

### Outer Region Clouds
```
Position: (14, 2.1, -11.3) - outer edge
Size: Small (1.2 units)
Color: Deep Blue (#4169e1) or Purple (#9370db)
Opacity: 30%
Effect: Distant cosmic haze
```

## Usage Tips

### For Performance
- Use **"Subtle"** preset (20 clouds)
- Lower opacity to 0.2-0.3
- Disable animation if needed

### For Beauty
- Use **"Spectacular"** preset (80 clouds)
- Increase opacity to 0.5-0.6
- Ensure animations enabled

### For Screenshots
- Temporarily set to "Spectacular"
- Pause rotation (can add toggle)
- Adjust camera for best angle

## Future Enhancements

- [ ] Custom color palette selection
- [ ] Color cycling animation
- [ ] Particle emission from clouds
- [ ] Star formation regions (brighter clusters)
- [ ] Dark nebula (absorptive, not emissive)
- [ ] Interactive clouds (respond to mouse)
- [ ] Parallax with camera movement
- [ ] Sound effects (cosmic ambience)
- [ ] VR-specific optimizations

## Summary

The Galaxy Nebula Clouds system adds **stunning depth and color** to the visualization by:

✨ Using **7 galaxy-themed colors** that transition from warm core to cool edges

✨ Creating **volumetric appearance** with sprite billboards and radial gradients

✨ Adding **life through animation** (pulsing, drifting, rotating)

✨ Providing **flexible controls** (presets + manual adjustment)

✨ Maintaining **excellent performance** (sprite-based, efficient updates)

The result is a **rich, colorful, immersive galaxy** that feels alive and dynamic! 🌌✨
