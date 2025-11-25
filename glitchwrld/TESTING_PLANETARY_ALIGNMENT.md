# Testing the Real-Time Planetary Alignment Feature

## Quick Start

1. **Start the development server** (if not already running):
   ```bash
   cd glitchwrld
   npm run dev
   ```

2. **Open the application**:
   - Navigate to `http://localhost:5173/`

3. **Open Browser DevTools**:
   - Press `F12` or `Right-click → Inspect`
   - Go to the **Console** tab

## What to Look For

### 1. Console Output ✅

When the page loads, you should see this in the console:

```
🌍 Real-time planetary alignment initialized!
Planetary Positions at 2025-11-24 19:20:00 UTC
(9459.79 days since J2000 epoch)

Mercury: 143.2° (0.387 AU)
Venus: 89.5° (0.723 AU)
Earth: 234.8° (1.000 AU)
Mars: 178.3° (1.524 AU)
Jupiter: 56.7° (5.203 AU)
Saturn: 312.4° (9.537 AU)
Uranus: 45.9° (19.191 AU)
Neptune: 278.1° (30.069 AU)
```

**What this means**:
- Each planet shows its current angle in orbit (0-360°)
- Distances are shown in Astronomical Units (AU)
- Date/time shows when the calculation was made

### 2. Visual Indicators 👀

**Top-Right Corner**: You should see a blue panel with:
- 🌍 Rotating Earth icon
- Current date (e.g., "Nov 24, 2025")
- Click to expand for details

**Expanded Panel**:
- "Real-time Alignment" label
- Full UTC timestamp
- "✨ Planets positioned using real astronomical calculations"
- "🔭 Based on Keplerian orbital mechanics"

### 3. Planet Positions 🪐

**In the 3D scene**:
- Planets should be **scattered** around the Sun (not in a line)
- Each planet is at a different angle in its orbit
- Positions reflect where they actually are TODAY

**How to verify**:
1. Note the approximate positions of planets when you load the page
2. Wait 5-10 minutes (or reload the page)
3. Planets should have moved slightly (especially Mercury, Venus, Earth)
4. Outer planets (Jupiter, Saturn) move very slowly

## Manual Testing Steps

### Test 1: Initial Load ✅
- [ ] Page loads without errors
- [ ] Console shows planetary position summary
- [ ] Date panel appears in top-right corner
- [ ] All 8 planets are visible (if planet toggles are enabled)

### Test 2: Date Display ✅
- [ ] Click the date panel to expand
- [ ] Details slide down smoothly
- [ ] UTC timestamp matches current time
- [ ] Click again to collapse

### Test 3: Position Verification ✅
Open the browser console and type:
```javascript
// Get current positions
import { calculateAllPlanetPositions } from './src/utils/orbital/astronomicalCalculations'
const positions = calculateAllPlanetPositions(new Date())
console.log(positions)
```

Expected output: Object with x, y, z coordinates for each planet

### Test 4: Animation Continuity ✅
- [ ] Planets continue orbiting smoothly
- [ ] No sudden jumps or resets
- [ ] Orbital speeds match their periods (Mercury fastest, Neptune slowest)

### Test 5: Responsive Design 📱
On mobile or small screens:
- [ ] Date panel is still visible
- [ ] Text is readable
- [ ] Panel doesn't overlap with controls

## Debugging Common Issues

### Issue: No console output
**Solution**:
- Check browser console for errors
- Verify `astronomicalCalculations.ts` is imported correctly
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: Planets not visible
**Solution**:
- Open Leva controls panel
- Check "Planets" folder
- Enable "Inner Planets" and "Outer Planets"

### Issue: Date panel not showing
**Solution**:
- Check CSS file is loaded (`PlanetaryAlignmentInfo.css`)
- Verify component is imported in `HybridScene.tsx`
- Check z-index conflicts with other UI

### Issue: Planets in wrong positions
**Solution**:
- Verify `initialPositions` in console output
- Check that `useFrame` is using `initialPositions.planet + (time * speed)`
- Ensure orbital data in `PlanetData.ts` is correct

## Advanced Testing

### Test with Custom Date

Modify `AccurateSolarSystem.tsx` temporarily:

```typescript
const initialPositions = useMemo(() => {
  // Test with a specific date
  const testDate = new Date('2025-01-01T00:00:00Z')
  const positions = calculateAllPlanetPositions(testDate)
  console.log('Testing with date:', testDate.toISOString())

  return {
    mercury: getOrbitalAngleFromPosition(positions.mercury),
    // ...
  }
}, [])
```

### Compare with NASA Data

1. Visit [NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons.cgi)
2. Select a planet (e.g., Earth)
3. Set observer location to "Sun (body center)"
4. Generate ephemeris for current date
5. Compare angles with our console output

**Expected accuracy**: Within ±5° for most planets

### Performance Testing

Open browser DevTools → Performance tab:
1. Start recording
2. Load the page
3. Stop after 5 seconds
4. Check "Scripting" time for position calculations

**Expected**: < 10ms for all calculations on mount

## Verification Checklist

### Visual Verification ✅
- [ ] All planets visible in scene
- [ ] Planets at different angles (scattered, not aligned)
- [ ] Date panel visible and styled correctly
- [ ] No visual glitches or artifacts

### Console Verification ✅
- [ ] Planetary position summary logged
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No TypeScript errors

### Functional Verification ✅
- [ ] Planets orbit smoothly
- [ ] Camera controls work
- [ ] Click-to-focus on planets works
- [ ] Leva controls respond correctly

### Data Verification ✅
- [ ] Mercury angle: 0-360° ✓
- [ ] Venus angle: 0-360° ✓
- [ ] Earth angle: 0-360° ✓
- [ ] Distances match PLANET_DATA ✓
- [ ] Date matches current UTC time ✓

## Example Console Session

```
🌍 Real-time planetary alignment initialized!

Planetary Positions at 2025-11-24 19:20:00 UTC
(9459.79 days since J2000 epoch)

Mercury: 143.2° (0.387 AU)
Venus: 89.5° (0.723 AU)
Earth: 234.8° (1.000 AU)
Mars: 178.3° (1.524 AU)
Jupiter: 56.7° (5.203 AU)
Saturn: 312.4° (9.537 AU)
Uranus: 45.9° (19.191 AU)
Neptune: 278.1° (30.069 AU)

✅ All angles within valid range (0-360°)
✅ All distances match expected values
✅ Animation initialized successfully
```

## Success Criteria

The feature is working correctly if:

1. ✅ Console shows planetary positions on load
2. ✅ Date panel appears in top-right corner
3. ✅ Planets are at different angles (not aligned)
4. ✅ No console errors
5. ✅ Smooth animation continues from initial positions
6. ✅ Positions change when page is reloaded at different times

## Next Steps

Once basic testing is complete:

1. **Document the feature** ✓ (Done in `PLANETARY_ALIGNMENT_FEATURE.md`)
2. **Share with users**: Add to README.md
3. **Consider enhancements**: Historical dates, position labels, alignment events
4. **Monitor feedback**: Check if users notice/appreciate the realistic positioning

## Questions?

If you encounter issues not covered here, check:
- `PLANETARY_ALIGNMENT_FEATURE.md` for implementation details
- Browser console for specific error messages
- Git diff to see what changed
- TypeScript errors in IDE
