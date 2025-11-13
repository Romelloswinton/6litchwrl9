# Constellation Information Features

## Overview

Enhanced the constellation system with **subtle, informative displays** that educate users about each constellation's mythology, tradition, and astronomical details.

## Features Added

### 1. 3D Text Labels ✨

**Location**: Floating above each constellation in 3D space

**Content**:
- **Main Label**: Constellation name in accent color (e.g., "Orion the Hunter")
- **Subtitle**: Tradition and additional info
  - Western: "Western"
  - Eastern: "EAST • SPRING" (direction and season)
  - Zodiac: "Zodiac"

**Visual Design**:
- Font size scales with constellation scale (adjustable)
- Text outline for better readability against starfield
- Positioned at constellation center, slightly elevated
- Opacity: 70% default, 100% on hover
- Smooth fade animations

**Toggle**: Via "Show 3D Labels" control in Leva panel (enabled by default)

---

### 2. Interactive Hover Tooltips 💡

**Location**: Appears directly above hovered constellation

**Triggered**: When user hovers mouse over any constellation

**Content**:
- **Constellation Name** (large, color-coded)
- **Tradition/Direction/Season** metadata
- **Star count** (e.g., "9 stars")
- **First 150 characters of mythology** with ellipsis

**Visual Design**:
- Dark translucent background (rgba(0, 0, 17, 0.9))
- Border color matches constellation accent
- Rounded corners (8px)
- Drop shadow and backdrop blur
- Max width: 300px
- Non-interactive (pointer-events: none)

**Example**: Hovering over Orion shows:
```
Orion the Hunter
WESTERN • 9 STARS

Orion was a legendary Greek hunter of great strength
and skill. After boasting he could kill any beast on
Earth, the goddess Gaia sent...
```

---

### 3. Persistent Info Panel 📖

**Location**: Bottom-left corner of screen (fixed position)

**Triggered**: Automatically appears when hovering over any constellation

**Content**:
- **Header Section**:
  - Constellation name (large, glowing with accent color)
  - Tradition badge (e.g., "Eastern • EAST • SPRING")

- **Metadata Badges**:
  - Star count with ⭐ icon
  - Sky coordinates (RA/Dec) with 📍 icon

- **Full Mythology Story**:
  - Complete text (scrollable if needed)
  - Max height: 180px with custom scrollbar

- **Notable Stars Section** (if applicable):
  - Named stars displayed as chips
  - Examples: Betelgeuse, Rigel, Alnitak, etc.

- **Subtle Hint**:
  - "Hover over constellations to explore their stories"

**Visual Design**:
- Sophisticated dark theme (rgba(0, 0, 17, 0.95))
- Border matches constellation accent color
- Smooth slide-in animation (300ms ease-in-out)
- Backdrop blur effect (20px)
- z-index: 900 (below controls, above scene)
- Max width: 400px

**Animation**:
- Slides up from bottom when showing
- Slides down when hiding
- Opacity fade in/out
- Delayed hide (300ms) for smooth transitions

---

## User Interaction Flow

```
1. User loads scene
   → Sees all constellations with 3D labels (if enabled)

2. User hovers over "Azure Dragon"
   → 3D label brightens (70% → 100% opacity)
   → Constellation lines thicken (1.5px → 2.5px)
   → Inline tooltip appears above constellation
   → Info panel slides in from bottom-left

3. Info panel shows:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Azure Dragon (Qīng Lóng)
   EASTERN • EAST • SPRING
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   ⭐ 10 stars  📍 RA: 10h, Dec: -20°

   Mythology
   The Azure Dragon guards the East and
   represents spring, growth, and new
   beginnings. It consists of seven mansions
   that form the shape of a celestial dragon
   bringing rain and prosperity.

   Notable Stars
   [Spica (角宿)] [亢宿] [氐宿] [Antares (心宿)]

   Hover over constellations to explore...
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. User moves to another constellation
   → Previous panel fades out
   → New panel slides in with new info
   → Smooth transition (300ms)

5. User moves mouse away
   → Tooltip disappears
   → Info panel slides down and fades
   → 3D labels return to 70% opacity
```

---

## Technical Implementation

### State Management
```typescript
// Global store (Zustand)
hoveredConstellation: Constellation | null

// Constellation Layer (local state)
const [localHoveredConstellation, setLocalHoveredConstellation] = useState<Constellation | null>(null)

// Synced to global store via useEffect
useEffect(() => {
  setHoveredConstellation(localHoveredConstellation)
}, [localHoveredConstellation])
```

### Hover Detection
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

### Visual Enhancement on Hover
```typescript
// Stars
<pointsMaterial opacity={isHovered ? 1.0 : 0.95} />

// Lines
<Line lineWidth={isHovered ? 2.5 : 1.5} />

// Labels
<Text fillOpacity={isHovered ? 1.0 : 0.7} />
```

---

## Files Created/Modified

### New Files
1. **`src/components/ui/ConstellationInfoPanel.tsx`**
   - Persistent info panel component
   - Full mythology display
   - Metadata and star information

### Modified Files
1. **`src/components/starfield/ConstellationLayer.tsx`**
   - Added 3D Text labels
   - Added hover detection
   - Added inline HTML tooltips
   - Integrated with global state

2. **`src/stores/hybridStore.ts`**
   - Added `hoveredConstellation` state
   - Added `setHoveredConstellation` setter

3. **`src/components/core/HybridScene.tsx`**
   - Imported and rendered ConstellationInfoPanel
   - Connected to global hover state

4. **`src/components/ui/ConstellationControls.tsx`**
   - Updated label toggle text ("Show 3D Labels")

---

## Control Settings

Available in Leva "Constellations" panel:

| Control | Default | Description |
|---------|---------|-------------|
| Show Constellations | ✓ | Toggle entire layer on/off |
| Tradition | All | Filter by Western/Eastern/Zodiac |
| Show Pattern Lines | ✓ | Display connecting lines |
| Line Opacity | 0.4 | Adjust line visibility |
| Constellation Size | 3 | Scale constellations (1-10x) |
| **Show 3D Labels** | **✓** | **Display floating text labels** |

---

## Examples by Constellation Type

### Western Example: Cassiopeia
```
Cassiopeia - The Vain Queen
WESTERN • 5 STARS

Queen Cassiopeia boasted of her beauty, claiming
to surpass even the sea nymphs. As punishment for
her vanity, she was chained to her throne and
placed in the heavens...

Notable Stars:
[Schedar] [Caph] [Gamma Cas] [Ruchbah] [Segin]
```

### Eastern Example: Vermilion Bird
```
Vermilion Bird (Zhū Què)
EASTERN • SOUTH • SUMMER • 10 STARS

The Vermilion Bird soars in the South, embodying
summer, fire, and transformation. This celestial
phoenix represents rebirth and consists of seven
mansions spreading its wings...

Notable Stars:
[星宿] [井宿] [柳宿] [張宿]
```

### Zodiac Example: Leo
```
Leo the Lion
ZODIAC • 7 STARS
RA: 10.5h, Dec: 15°

Leo represents the Nemean Lion, a fearsome beast
with impenetrable golden fur. Heracles defeated
it as his first labor, strangling the beast with
his bare hands...

Notable Stars:
[Regulus] [Eta Leonis] [Gamma Leonis] [Denebola]
```

---

## Design Philosophy

**Subtlety**: Information appears only on interaction, not cluttering the view

**Education**: Full mythology stories teach astronomical history

**Cultural Diversity**: Equal representation of Western and Eastern traditions

**Visual Hierarchy**:
- 3D labels for quick identification
- Tooltips for brief context
- Info panel for deep dive

**Accessibility**:
- High contrast text
- Readable fonts
- Clear visual feedback
- Smooth animations

---

## Performance Considerations

- **Conditional Rendering**: Info panel only renders when constellation hovered
- **Smooth Animations**: CSS transitions (300ms) instead of JS animations
- **Lazy State Updates**: 300ms delay before hiding panel reduces flicker
- **Minimal Re-renders**: Local state synced to global only when needed
- **Event Propagation**: `stopPropagation()` prevents multiple hovers

---

## User Benefits

1. **Discovery**: Users naturally explore constellations through hover
2. **Learning**: Full mythology stories provide educational value
3. **Context**: Tradition labels explain cultural origins
4. **Navigation**: Sky coordinates help locate real constellations
5. **Immersion**: 3D labels enhance spatial awareness
6. **Engagement**: Interactive tooltips encourage exploration

---

## Future Enhancements

- [ ] Sound effects on hover (celestial chimes)
- [ ] Animation showing constellation formation
- [ ] Search functionality to find specific constellations
- [ ] "Story Mode" that auto-cycles through constellations
- [ ] Connection lines to planets when aligned
- [ ] Seasonal visibility toggle (show/hide based on time of year)
- [ ] Voice narration of mythology stories
- [ ] AR mode with phone compass to find real constellations

---

## Summary

The constellation info system provides **three layers of information density**:

1. **Glance**: 3D labels show name and tradition
2. **Hover**: Tooltips provide quick context
3. **Focus**: Info panel offers full mythology and details

This progressive disclosure pattern ensures users can **explore at their own pace** while maintaining a clean, immersive experience. The system successfully **educates users about which constellation represents what** through subtle, well-designed interactions! ⭐✨
