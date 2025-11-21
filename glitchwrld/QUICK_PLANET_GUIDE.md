# 🚀 Quick Planet Interaction Guide

## Try All 4 Inner Planets!

**Open:** http://localhost:5174

## Visual Map

```
                        ☀️ SUN
                    (Click to focus)

    ☿️         ♀️           🌍           🔴
  Mercury    Venus       Earth        Mars
  (Gray)    (Yellow)     (Blue)      (Red)

  Orbit 1   Orbit 2     Orbit 3     Orbit 4
  Closest   2nd from    3rd from    4th from
  to Sun      Sun         Sun         Sun
```

## Planet Finder

### ☿️ Mercury (Smallest, Closest to Sun)
- **Color:** Gray/Beige
- **Size:** Tiny (smallest planet)
- **Location:** Very close to the sun
- **Look for:** Small gray sphere near bright sun
- **Click:** Zooms in close (small planet needs close view)

### ♀️ Venus (The Bright One)
- **Color:** Yellowish/Cream
- **Size:** Similar to Earth
- **Location:** 2nd planet from sun
- **Look for:** Bright yellowish sphere
- **Click:** Medium distance view

### 🌍 Earth (The Blue Marble)
- **Color:** Blue with hints of green
- **Size:** Reference planet (0.5 units)
- **Location:** 3rd planet from sun
- **Look for:** Blue sphere with Moon nearby
- **Click:** Perfect view of Earth + Moon

### 🔴 Mars (The Red Planet)
- **Color:** Reddish-orange
- **Size:** Smaller than Earth
- **Location:** 4th planet from sun (last inner planet)
- **Look for:** Red/orange sphere with 2 tiny moons
- **Click:** Shows Mars + Phobos + Deimos

## Quick Actions

```
┌─────────────────────────────────────────────────┐
│  ACTION              RESULT                     │
├─────────────────────────────────────────────────┤
│  Hover Mercury       Cursor → Pointer ☝️        │
│  Click Mercury       Zoom to close-up view      │
│  Click Mercury again Zoom back to overview      │
│                                                 │
│  While focused on    Click Venus                │
│  Mercury             → Transition to Venus      │
│                                                 │
│  Any planet click    2.5s smooth animation      │
│  Any planet hover    Planet glows brighter      │
└─────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

Currently using **mouse only**, but could add:
- `1` → Focus Mercury
- `2` → Focus Venus
- `3` → Focus Earth
- `4` → Focus Mars
- `ESC` → Return to overview
- `←/→` → Cycle through planets

## Visual Feedback Guide

### Normal State
```
    ☿️  ♀️  🌍  🔴
  [Dim] [Dim] [Dim] [Dim]

  All planets have subtle glow
  Cursor: Default arrow
```

### Hovering Mercury
```
    ☿️  ♀️  🌍  🔴
  [Dim] [Dim] [Dim] [Dim]

  Cursor: Pointer ☝️
  (Ready to click)
```

### Mercury Focused
```
    ☿️  ♀️  🌍  🔴
[BRIGHT][Dim][Dim][Dim]

  Mercury: Emissive 0.4 (bright!)
  Others: Normal 0.1
  Camera: Close-up on Mercury
```

### Switching to Earth
```
    ☿️  ♀️  🌍  🔴
  [Dim][Dim][BRIGHT][Dim]

  Animation: 2.5s transition
  Mercury dims, Earth brightens
  Camera moves smoothly
```

## Console Messages

Watch your browser console (F12):

```javascript
// Clicking Mercury
☿️ Focused on mercury!

// Clicking back
☿️ Zoomed back to overview

// Clicking Venus
♀️ Focused on venus!

// Clicking Earth
🌍 Focused on earth!

// Clicking Mars
🔴 Focused on mars!
```

## Camera Positions

### Overview Mode
```
Camera: [0, 30, 70]
Looking at: [0, 0, 0]

View from above and behind
Shows entire inner solar system
```

### Mercury Focus
```
Camera: Mercury pos + [1.2, 0.8, 1.5]
Looking at: Mercury position

Close-up view (small planet)
```

### Venus Focus
```
Camera: Venus pos + [1.8, 1.2, 2.0]
Looking at: Venus position

Medium distance view
```

### Earth Focus
```
Camera: Earth pos + [2, 1.5, 2.5]
Looking at: Earth position

Shows Earth + Moon beautifully
```

### Mars Focus
```
Camera: Mars pos + [1.5, 1, 2]
Looking at: Mars position

Shows Mars + both tiny moons
```

## Tips for Best Experience

### Finding Planets
1. Start at **overview mode** (default)
2. Look for the **bright sun** in center
3. Inner planets are **close to sun**
4. Use planet **colors** to identify:
   - Gray = Mercury
   - Yellow = Venus
   - Blue = Earth
   - Red = Mars

### Best Views
- **Mercury:** Very close (it's tiny!)
- **Venus:** Medium distance (nice glow)
- **Earth:** Perfect to see Moon orbiting
- **Mars:** Can see both moons if you look carefully

### Smooth Navigation
- **Wait** for animation to complete
- **Click planets** directly (not empty space)
- **Hover** to confirm cursor changes
- **Use OrbitControls** to manually adjust view while focused

## Troubleshooting

### Can't Find a Planet?
- Make sure you're in **overview mode** (click any focused planet twice)
- Check that **inner planets are visible** (should be by default)
- Planets are **orbiting** - their positions change!
- Look **near the sun** - inner planets stay close

### Planet Not Clickable?
- Hover directly over the **sphere** (not near it)
- Cursor should change to **pointer**
- Make sure planet is **visible** (not behind sun)

### Animation Not Smooth?
- Check **FPS** (Stats panel, top-left)
- Should be **60 FPS**
- Close other browser tabs if laggy

### Stuck in Focused Mode?
- Click the **same planet** again to zoom out
- Or click **any other planet** to switch

## What You Should See

### Mercury Focus
```
        ☿️
  [Bright gray glow]

Small rocky surface
No moons
Close camera
```

### Venus Focus
```
        ♀️
  [Bright yellow glow]

Thick atmosphere
No moons
Medium distance
```

### Earth Focus
```
        🌍
  [Bright blue glow]

    🌑
  (Moon)

Blue oceans visible
Moon orbiting
Good distance
```

### Mars Focus
```
        🔴
  [Brightest red glow]

  🌑 🌑
(Phobos) (Deimos)

Red surface
Two tiny moons
Perfect view
```

## Fun Facts Visible

- **Mercury** has no moons (none visible)
- **Venus** has no moons (none visible)
- **Earth** has 1 moon (clearly visible)
- **Mars** has 2 tiny moons (look carefully!)
- All planets **rotate** on their axis
- All planets **orbit** the sun
- **Speeds vary** (inner planets faster)

## Next Steps

After trying all 4 inner planets:
- Try **outer planets** (coming soon!)
- Use **OrbitControls** to rotate view manually
- Watch planets **orbit** over time
- Try **different camera angles**

---

**Have fun exploring! 🚀**
