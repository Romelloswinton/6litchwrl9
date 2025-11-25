# Black Hole Texture Implementation Guide

## Overview

Your `blackhole.png` texture has been integrated into the 3D scene using Three.js. Instead of converting PNG to GLB (which isn't applicable for images), we've applied the texture to a 3D sphere to create a realistic black hole visualization.

## Available Components

### 1. EventHorizon (Updated - Simple Textured Version)

**Location:** `src/components/blackhole/EventHorizon.tsx`

**Features:**
- Uses your blackhole.png as a texture map
- Standard material with realistic lighting
- Subtle rotation animation
- Photon sphere glow effect

**Usage:**
```tsx
import { EventHorizon } from './components/blackhole/EventHorizon'

<EventHorizon radius={3} position={[0, 0, 0]} />
```

### 2. TexturedBlackHole (NEW - Advanced Version)

**Location:** `src/components/blackhole/TexturedBlackHole.tsx`

**Features:**
- Custom shader for gravitational lensing distortion
- Animated texture distortion effects
- Multiple glow layers (photon sphere, inner core)
- Pulsing animation
- Two rendering modes: Standard and Shader

**Usage:**
```tsx
import { TexturedBlackHole } from './components/blackhole/TexturedBlackHole'

// Standard mode (recommended for performance)
<TexturedBlackHole
  radius={3}
  position={[0, 0, 0]}
  mass={10}
  enableShader={false}
/>

// Shader mode (advanced gravitational lensing effect)
<TexturedBlackHole
  radius={3}
  position={[0, 0, 0]}
  mass={10}
  enableShader={true}
/>
```

## How It Works

### Texture Loading
- Your PNG is imported as a Vite asset: `import blackHoleTexturePath from '../../assets/blackhole.png'`
- Loaded using `@react-three/drei`'s `useTexture` hook for optimal performance
- Automatically bundled and optimized during build (6MB → optimized)

### Material Properties

**Standard Material (EventHorizon):**
```tsx
<meshStandardMaterial
  map={blackHoleTexture}          // Your PNG texture
  emissive="#000000"               // Self-illumination
  emissiveIntensity={0.5}
  roughness={0.8}                  // Surface roughness
  metalness={0.2}                  // Metallic appearance
/>
```

**Advanced Material (TexturedBlackHole):**
- Custom GLSL shaders for gravitational lensing
- UV distortion based on distance from center
- Animated time-based effects
- Edge glow (photon sphere simulation)

## Customization Options

### Adjust Texture Appearance

**Change texture wrapping:**
```tsx
blackHoleTexture.wrapS = THREE.RepeatWrapping
blackHoleTexture.wrapT = THREE.MirroredRepeatWrapping
```

**Adjust texture quality:**
```tsx
blackHoleTexture.anisotropy = 16  // Higher = better quality (max: 16)
```

**Enable texture repetition:**
```tsx
blackHoleTexture.repeat.set(2, 2)  // Tile texture 2x2
```

### Modify Visual Effects

**Increase glow intensity:**
```tsx
// In EventHorizon.tsx, line 46-53
<meshBasicMaterial
  color="#ff8800"
  transparent
  opacity={0.3}  // Increase from 0.1 for brighter glow
  side={THREE.BackSide}
/>
```

**Change rotation speed:**
```tsx
// In useFrame, adjust delta multiplier
meshRef.current.rotation.y += delta * 0.2  // Faster rotation
```

## Integration with Existing Black Hole System

Update your `BlackHole.tsx` component to use the textured version:

```tsx
import { TexturedBlackHole } from './TexturedBlackHole'
import { AccretionDisk } from './AccretionDisk'

export function BlackHole({ position, mass }: BlackHoleProps) {
  const schwarzschildRadius = mass * 0.3

  return (
    <group position={position}>
      {/* Use textured black hole instead of EventHorizon */}
      <TexturedBlackHole
        radius={schwarzschildRadius}
        mass={mass}
        enableShader={true}  // Enable for advanced effects
      />

      {/* Keep the accretion disk */}
      <AccretionDisk
        innerRadius={schwarzschildRadius * 1.5}
        outerRadius={schwarzschildRadius * 8}
        particleCount={5000}
      />
    </group>
  )
}
```

## Performance Considerations

### Standard Mode (Recommended)
- Uses built-in Three.js materials
- GPU-optimized
- Works on all devices
- ~60 FPS on most hardware

### Shader Mode (Advanced)
- Custom GLSL shaders
- More GPU-intensive
- Best for high-end devices
- May reduce FPS on mobile (~30-45 FPS)

### Optimization Tips

1. **Reduce texture size** if needed:
   - Resize blackhole.png to 2048x2048 or 1024x1024
   - Use image compression tools

2. **Simplify geometry** for better performance:
   ```tsx
   <sphereGeometry args={[radius, 64, 64]} />  // Instead of 128
   ```

3. **Disable shader mode** on mobile:
   ```tsx
   const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
   <TexturedBlackHole enableShader={!isMobile} />
   ```

## Comparing to GLB Format

**Why we didn't convert to GLB:**
- GLB is for 3D models (meshes, animations, scenes)
- PNG is already perfect for textures
- Converting PNG → GLB would create unnecessary file bloat
- Three.js handles PNG textures natively and efficiently

**What we did instead:**
- Applied your PNG as a texture map (like wrapping paper on a sphere)
- Created custom shaders for advanced effects
- Added procedural glow and lighting
- Result: Better performance and more control than a static GLB

## Next Steps

### Experiment with Different Effects

1. **Try displacement mapping** to add 3D depth:
```tsx
<meshStandardMaterial
  map={blackHoleTexture}
  displacementMap={blackHoleTexture}
  displacementScale={0.2}
/>
```

2. **Add environment reflections**:
```tsx
import { Environment } from '@react-three/drei'

<Environment preset="night" />
<meshStandardMaterial
  map={blackHoleTexture}
  envMapIntensity={2.0}
/>
```

3. **Create multiple texture layers**:
```tsx
// Use blackhole.png for both color and emissive
<meshStandardMaterial
  map={blackHoleTexture}
  emissiveMap={blackHoleTexture}
  emissiveIntensity={1.5}
/>
```

## Troubleshooting

**Texture not loading:**
- Check the import path: `../../assets/blackhole.png`
- Verify file exists in `src/assets/` folder
- Check browser console for errors

**Texture appears stretched:**
- Adjust UV mapping: `blackHoleTexture.wrapS = THREE.ClampToEdgeWrapping`
- Increase sphere segments for better mapping

**Poor performance:**
- Disable shader mode: `enableShader={false}`
- Reduce sphere geometry: `args={[radius, 32, 32]}`
- Lower texture resolution

## Resources

- [Three.js Texture Documentation](https://threejs.org/docs/#api/en/textures/Texture)
- [React Three Fiber Materials](https://docs.pmnd.rs/react-three-fiber/api/objects#materials)
- [GLSL Shader Tutorial](https://thebookofshaders.com/)
