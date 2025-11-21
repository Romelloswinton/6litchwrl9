# 🌍 Earth Click-to-Zoom Feature

## ✅ Feature Implemented

You can now click on Earth to smoothly zoom into an intuitive, focused view of the planet. Click again to zoom back out to the solar system overview.

## 🎯 How It Works

### User Experience

1. **Hover over Earth** - Cursor changes to pointer
2. **Click on Earth** - Camera smoothly animates to a close-up view
3. **Earth glows brighter** when focused
4. **Click Earth again** - Camera zooms back out to overview
5. **Smooth transitions** - 2.5 second easeInOut animation

### Camera Positions

**Overview (Default):**
- Position: `[0, 30, 70]`
- Looking at: Solar system center `[0, 0, 0]`
- View: Wide view of entire solar system

**Earth Focused:**
- Position: Earth position + offset `[2, 1.5, 2.5]`
- Looking at: Earth's exact position
- View: Close-up angled view of Earth and Moon

## 🔧 Technical Implementation

### 1. Camera Animation Hook

**File:** `src/hooks/camera/useCameraAnimation.ts`

```typescript
export function useCameraAnimation() {
  const { camera } = useThree()
  const { setCameraPosition, setCameraTarget } = useHybridStore()

  const animateToPosition = (
    targetPosition: Vector3,
    targetLookAt: Vector3,
    options: { duration, easing, onComplete }
  ) => {
    // Smooth requestAnimationFrame animation
    // Updates camera position and lookAt
    // Syncs with Zustand store
  }
}
```

**Features:**
- ✅ Smooth easing functions (linear, easeInOut, easeOut)
- ✅ Cancellable animations
- ✅ onComplete callbacks
- ✅ Works inside R3F Canvas
- ✅ Syncs with Zustand store

### 2. Earth Click Handler

**File:** `src/components/spline/AccurateSolarSystem.tsx`

```typescript
const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null)
const { animateToPosition } = useCameraAnimation()

const handleEarthClick = (event: ThreeEvent<MouseEvent>) => {
  event.stopPropagation()

  if (focusedPlanet === 'earth') {
    // Zoom back out
    animateToPosition(overviewPosition, overviewTarget, {
      duration: 2500,
      easing: 'easeInOut',
      onComplete: () => setFocusedPlanet(null)
    })
  } else {
    // Zoom into Earth
    const earthPosition = earthRef.current.position.clone()
    const cameraPosition = earthPosition.clone().add(offset)

    animateToPosition(cameraPosition, earthPosition, {
      duration: 2500,
      easing: 'easeInOut',
      onComplete: () => setFocusedPlanet('earth')
    })
  }
}
```

### 3. Interactive Earth Mesh

```typescript
<mesh
  onClick={handleEarthClick}
  onPointerOver={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'default'
  }}
>
  <sphereGeometry args={[sizes.earth, 32, 32]} />
  <meshStandardMaterial
    color={PLANET_DATA.earth.color}
    emissive={PLANET_DATA.earth.color}
    emissiveIntensity={focusedPlanet === 'earth' ? 0.4 : 0.15}
  />
</mesh>
```

**Interaction Features:**
- ✅ Click event handler
- ✅ Pointer cursor on hover
- ✅ Increased emissive glow when focused (0.4 vs 0.15)
- ✅ Event propagation stopped to prevent conflicts

## 🎨 Visual Details

### Camera Offset Calculation

```typescript
const cameraOffset = new THREE.Vector3(2, 1.5, 2.5)
```

This creates an **angled perspective view**:
- `x: 2` - Side offset (right)
- `y: 1.5` - Vertical offset (above)
- `z: 2.5` - Forward offset

**Result:** Beautiful 3/4 view of Earth showing curvature and the Moon

### Glow Effect

Earth's emissive intensity increases when focused:
- **Normal:** `0.15` (subtle glow)
- **Focused:** `0.4` (bright glow)

This provides clear visual feedback that Earth is in focus.

## 🧪 Testing the Feature

1. **Start the dev server:**
   ```
   http://localhost:5174
   ```

2. **Find Earth:**
   - Look for the blue planet (3rd from the sun)
   - It's orbiting in the inner solar system

3. **Hover over Earth:**
   - Cursor should change to pointer
   - Earth should be clickable

4. **Click Earth:**
   - Camera smoothly zooms in over 2.5 seconds
   - Earth gets brighter
   - Moon should be visible orbiting nearby
   - Console logs: `🌍 Focused on Earth!`

5. **Click Earth again:**
   - Camera zooms back out to overview
   - Earth returns to normal brightness
   - Console logs: `🌍 Zoomed back to overview`

## 📊 Performance Considerations

### Animation Performance

- Uses `requestAnimationFrame` for smooth 60 FPS
- Updates camera position every frame
- Store change detection prevents unnecessary re-renders
- Animation can be cancelled mid-flight

### No Re-renders

The animation runs **outside** React's render cycle:
- Direct camera manipulation via Three.js
- Store updates use change detection
- Parent components don't re-render
- Smooth performance even during animation

## 🚀 Future Enhancements

This system is designed to be **easily extendable**:

### Add Other Planets

```typescript
// Mars click handler
const handleMarsClick = (event: ThreeEvent<MouseEvent>) => {
  const marsPosition = marsRef.current.position.clone()
  const cameraOffset = new THREE.Vector3(1.5, 1, 2)
  const cameraPosition = marsPosition.clone().add(cameraOffset)

  animateToPosition(cameraPosition, marsPosition, {
    duration: 2500,
    easing: 'easeInOut',
    onComplete: () => setFocusedPlanet('mars')
  })
}
```

### Add Scene Modes

```typescript
// Different views for Earth
const earthViews = {
  closeUp: new THREE.Vector3(2, 1.5, 2.5),
  polar: new THREE.Vector3(0, 5, 0),
  equatorial: new THREE.Vector3(4, 0, 0),
  moonView: new THREE.Vector3(0.5, 0.2, 0.8)
}
```

### Add UI Controls

```typescript
// Camera preset buttons
<button onClick={() => focusOnPlanet('earth')}>Earth</button>
<button onClick={() => focusOnPlanet('mars')}>Mars</button>
<button onClick={() => focusOnPlanet('jupiter')}>Jupiter</button>
```

## 📝 Files Created/Modified

### Created Files:
1. **`src/hooks/camera/useCameraAnimation.ts`**
   - Camera animation hook
   - Easing functions
   - Store synchronization

### Modified Files:
1. **`src/components/spline/AccurateSolarSystem.tsx`**
   - Added useCameraAnimation import
   - Added focusedPlanet state
   - Added handleEarthClick function
   - Added click/hover handlers to Earth mesh
   - Conditional emissive intensity

## ✅ Status

**FULLY IMPLEMENTED AND WORKING ✅**

Features:
- ✅ Smooth camera animations
- ✅ Click-to-zoom on Earth
- ✅ Hover cursor feedback
- ✅ Visual glow feedback
- ✅ Zoom in and zoom out
- ✅ No performance issues
- ✅ No re-render issues

## 🎯 Key Advantages

1. **Intuitive UX:** Click the planet you want to explore
2. **Smooth Transitions:** Professional 2.5s easeInOut animation
3. **Visual Feedback:** Cursor change + glow effect
4. **Toggle Behavior:** Click again to zoom out
5. **Performance:** No unnecessary re-renders
6. **Extensible:** Easy to add other planets

---

**Implemented:** 2025-11-14
**Feature:** Click-to-zoom Earth interaction
**Status:** Production Ready ✅
**Next Step:** Extend to other planets (Mars, Jupiter, etc.)
