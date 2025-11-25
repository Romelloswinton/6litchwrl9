# Constellation Hover-to-Reveal Feature

## Overview

Constellation lines are now **hidden by default** and only appear when users **hover over** a constellation. This creates a cleaner, less cluttered visual experience while still allowing users to discover and explore constellation patterns interactively.

## Implementation Summary

### Changes Made

#### 1. Updated Default State (`hybridStore.ts`)
**Line 248**: Changed `showLines` default from `true` to `false`

```typescript
constellations: {
  enabled: true,
  showLines: false, // Lines hidden by default, shown on hover
  showLabels: true,
  filter: 'all',
  lineOpacity: 0.4,
  scale: 3
}
```

#### 2. Modified Constellation Rendering Logic (`ConstellationLayer.tsx`)

**Lines 92-107**: Removed `showLines` dependency from line generation
- Lines are now **always generated** (for performance)
- Visibility is controlled at render time instead

**Lines 210-221**: Updated line rendering condition
```typescript
{/* Show lines when hovered OR when global showLines is true */}
{(isHovered || showLines) && lines.map(line => (
  <Line
    key={line.key}
    points={line.points}
    color={line.color}
    lineWidth={isHovered ? 2.5 : 1.5}
    transparent
    opacity={isHovered ? lineOpacity * 1.5 : lineOpacity}
    dashed={false}
  />
))}
```

## User Experience

### Default State (No Hover)
- ✅ Constellation **stars** are visible
- ✅ Constellation **labels** are visible (name + tradition)
- ❌ Constellation **lines** are hidden
- Result: Clean, minimal starfield with labeled star groupings

### Hover State
- ✅ Constellation **stars** brighten (opacity 1.0)
- ✅ Constellation **lines** appear with glow effect
- ✅ Line thickness increases (1.5 → 2.5)
- ✅ Line opacity increases (0.4 → 0.6)
- ✅ HTML tooltip appears with mythology info
- Result: Rich, interactive experience revealing constellation patterns

### Manual Override
Users can still **force all lines to show** via Leva controls:
- Open controls panel
- Navigate to "Constellations" folder
- Toggle "Lines" to **ON**
- All constellation lines become permanently visible

## Technical Details

### Hover Detection

The hover system uses React Three Fiber's pointer events:

```typescript
<group
  onPointerOver={(e) => {
    e.stopPropagation()
    setLocalHovered(true)
    onHover(constellation)
  }}
  onPointerOut={(e) => {
    e.stopPropagation()
    setLocalHovered(false)
    onHover(null)
  }}
>
```

### State Synchronization

Hover state flows through multiple layers:

1. **Local Component State**: `localHovered` (individual constellation)
2. **Layer State**: `localHoveredConstellation` (ConstellationLayer)
3. **Global Store**: `hoveredConstellation` (hybridStore)
4. **UI Panel**: ConstellationInfoPanel displays mythology

### Performance Optimization

**Before** (original implementation):
- Lines regenerated on every `showLines` change
- `useMemo` dependency on `showLines` caused recalculation

**After** (optimized):
- Lines generated **once** and cached
- Only visibility toggled (no geometry regeneration)
- Better performance on hover/unhover

## Visual Effects on Hover

| Property | Default | Hovered |
|----------|---------|---------|
| Star Opacity | 0.95 | 1.0 |
| Line Width | 1.5 | 2.5 |
| Line Opacity | 0.4 | 0.6 (lineOpacity × 1.5) |
| Label Opacity | 0.7 | 1.0 |
| HTML Tooltip | Hidden | Visible |

## User Controls

### Leva Panel: Constellations Folder

Users have full control over constellation display:

- **Show**: Enable/disable all constellations
- **Lines**: Force show all lines (overrides hover)
- **Labels**: Show/hide constellation names
- **Line Opacity**: Adjust line brightness (0.0 - 1.0)
- **Filter**: Choose tradition (All, Western, Eastern, Zodiac)

## Testing the Feature

### Visual Test
1. Load the page at `http://localhost:5173/`
2. Look at the starfield
3. **Expected**: Stars and labels visible, NO lines visible
4. Hover over a constellation (move cursor over star groupings)
5. **Expected**: Lines appear connecting the stars in that constellation
6. Move cursor away
7. **Expected**: Lines disappear smoothly

### Interactive Test
1. Hover over multiple constellations in sequence
2. **Expected**: Only the hovered constellation shows lines
3. Lines should appear/disappear smoothly
4. No flickering or performance issues

### Manual Override Test
1. Open Leva controls
2. Navigate to "Constellations" → "Lines"
3. Toggle **ON**
4. **Expected**: All constellation lines become visible
5. Hover still works (lines brighten on hover)
6. Toggle **OFF**
7. **Expected**: Back to hover-only mode

### Performance Test
1. Open browser DevTools → Performance tab
2. Record while hovering over 5-10 constellations
3. **Expected**: No frame drops, smooth 60 FPS
4. Memory usage should remain stable

## Code Flow Diagram

```
User Hovers Over Constellation
         ↓
onPointerOver event fires
         ↓
setLocalHovered(true)
         ↓
setLocalHoveredConstellation(constellation)
         ↓
useEffect syncs to global store
         ↓
setHoveredConstellation(constellation)
         ↓
Component re-renders with isHovered=true
         ↓
Conditional render: (isHovered || showLines)
         ↓
Lines rendered with enhanced styling
         ↓
User sees constellation pattern!
```

## Benefits

### UX Benefits
✅ **Cleaner default view** - Less visual clutter
✅ **Interactive discovery** - Encourages exploration
✅ **Progressive disclosure** - Information revealed on demand
✅ **Better focus** - Planets and stars more visible
✅ **Maintains accessibility** - Labels still visible by default

### Performance Benefits
✅ **Fewer rendered objects** - Lines only when needed
✅ **Optimized re-renders** - Line data cached, not regenerated
✅ **Smooth interactions** - No lag on hover
✅ **Mobile-friendly** - Reduced GPU load

### Developer Benefits
✅ **Simple implementation** - Single condition change
✅ **Backward compatible** - Manual override still works
✅ **Maintainable** - Clear separation of concerns
✅ **Well-documented** - Code comments explain logic

## Edge Cases Handled

### Multiple Rapid Hovers
- ✅ `stopPropagation()` prevents event bubbling
- ✅ State updates are batched by React
- ✅ No memory leaks or state corruption

### Constellation Overlaps
- ✅ Pointer events prioritize closest object
- ✅ Only one constellation hovered at a time
- ✅ Clear visual hierarchy

### Performance on Low-End Devices
- ✅ Lines pre-generated (not created on hover)
- ✅ Minimal CPU/GPU impact
- ✅ Tested on mobile browsers

## Future Enhancements

Potential improvements:
1. **Fade transition** - Smooth fade in/out of lines
2. **Constellation tracing** - Animated line drawing effect
3. **Sound effects** - Subtle audio feedback on hover
4. **Touch support** - Tap to toggle on mobile
5. **Keyboard navigation** - Tab through constellations
6. **History tracking** - Remember discovered constellations

## Comparison: Before vs After

### Before
```
Page Load → All constellation lines visible
           → Cluttered appearance
           → Harder to see planets
           → No interaction needed
```

### After
```
Page Load → Constellation lines hidden
           → Clean, minimal view
           → Planets clearly visible
           → Hover reveals patterns
           → Interactive exploration
```

## Console Messages

When constellations load, you should see:
```
⭐ Loaded 88 constellations with 1234 total stars
   Western: 48
   Eastern: 28
   Zodiac: 12
```

(Actual numbers depend on your constellation database)

## Troubleshooting

### Lines Don't Appear on Hover
**Solution**:
- Check browser console for errors
- Verify `constellations.enabled` is `true` in Leva
- Try toggling "Lines" ON then OFF in Leva

### Lines Appear Immediately
**Solution**:
- Check `hybridStore.ts` line 248: should be `showLines: false`
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache

### Hover Doesn't Trigger
**Solution**:
- Ensure you're hovering over star groups (not empty space)
- Check that constellation scale is appropriate
- Verify `enabled: true` in constellation settings

### Performance Issues
**Solution**:
- Reduce particle count in Leva controls
- Disable nebula clouds if enabled
- Lower bloom intensity
- Check GPU usage in browser DevTools

## Related Files

- `src/stores/hybridStore.ts` - Default state
- `src/components/starfield/ConstellationLayer.tsx` - Rendering logic
- `src/components/ui/ConstellationInfoPanel.tsx` - Hover tooltip
- `src/utils/data/constellationDatabase.ts` - Constellation data

## Summary

This feature creates a more elegant, interactive constellation experience by:
1. **Hiding lines by default** for cleaner visuals
2. **Revealing lines on hover** for interactive discovery
3. **Maintaining user control** via Leva panel
4. **Optimizing performance** with smart caching

The result is a more engaging, exploratory user experience that encourages curiosity while maintaining visual clarity.
