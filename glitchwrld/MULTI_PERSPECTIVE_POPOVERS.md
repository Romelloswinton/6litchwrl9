# Multi-Perspective Planet Popovers

A beautiful, interactive tooltip system that lets users explore planets from different perspectives. Each planet can be viewed through **four unique lenses**:

## 🌟 The Four Perspectives

### 🔬 Scientific View
Hard facts, measurements, and astronomical data. Perfect for the curious mind that wants to understand the physics and chemistry of celestial bodies.

**Example (Venus):**
- Temperature: 462°C (hot enough to melt lead)
- Atmosphere: 92 bar pressure, sulfuric acid clouds
- Rotation: Backwards (retrograde)

### 📜 Mythological View
Ancient stories, cultural meanings, and archetypal symbolism. Connect with humanity's timeless relationship with the cosmos.

**Example (Venus):**
- Aphrodite born from sea foam
- Goddess of love and beauty
- Irresistible attraction and passionate intensity

### ✨ Poetic View
Artistic, metaphorical, and emotionally resonant descriptions. Experience planets as living symbols and sources of inspiration.

**Example (Venus):**
- "Morning and evening star, beauty bookending the day"
- "The ache of longing, the magnetism of attraction"
- "A burning heart wrapped in clouds of desire"

### 🌱 Personal Growth View
Psychological insights, life lessons, and self-development wisdom. Discover what each planet teaches about being human.

**Example (Venus):**
- Shows what you value and how you love
- Reveals your aesthetic sense and relationship style
- Lesson: "You attract what you believe you deserve"

---

## 🚀 How to Use

### Basic Integration

Wrap any planet mesh with the `PlanetWithMultiPerspective` component:

```tsx
import { PlanetWithMultiPerspective } from './components/planets/PlanetWithMultiPerspective'

function YourSolarSystem() {
  const [hoveredBody, setHoveredBody] = useState<string | null>(null)

  return (
    <PlanetWithMultiPerspective
      planetName="venus"
      hoveredBody={hoveredBody}
      tooltipOffset={2.0}
      defaultPerspective="mythological"
    >
      <mesh
        onPointerOver={() => setHoveredBody('venus')}
        onPointerOut={() => setHoveredBody(null)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#E6B87E" />
      </mesh>
    </PlanetWithMultiPerspective>
  )
}
```

### Compact Mode

For mobile or less screen space:

```tsx
<PlanetWithMultiPerspective
  planetName="mars"
  hoveredBody={hoveredBody}
  compact={true}
  defaultPerspective="scientific"
>
  {/* Your planet mesh */}
</PlanetWithMultiPerspective>
```

### Using the Direct Popover Component

For more control:

```tsx
import { MultiPerspectivePopover } from './components/ui/MultiPerspectivePopover'
import { getMultiPerspectivePlanet } from './utils/data/planetPerspectives'

const venusData = getMultiPerspectivePlanet('venus')

<MultiPerspectivePopover
  planet={venusData}
  position={[0, 3, 0]}
  visible={isVisible}
  defaultPerspective="poetic"
/>
```

---

## 📦 Available Planets

Currently supported planets with full multi-perspective data:

- ☉ **Sun** - The Self, Identity & Life Force
- ☿ **Mercury** - The Messenger, Mind & Communication
- ♀ **Venus** - The Lover, Love & Values
- 🜨 **Earth** - The Ground, Physical Reality & Embodiment
- ♂ **Mars** - The Warrior, Will & Action
- ♃ **Jupiter** - The King, Expansion & Wisdom
- ♄ **Saturn** - The Teacher, Discipline & Mastery
- ♅ **Uranus** - The Awakener, Revolution & Innovation
- ♆ **Neptune** - The Mystic, Dreams & Dissolution

---

## 🎨 Customization

### Styling

All styles are in `MultiPerspectivePopover.css`. Key CSS variables you can override:

```css
.multi-perspective-popover {
  --popover-bg: linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(20, 20, 50, 0.95) 100%);
  --popover-border: 2px solid;
  --popover-radius: 16px;
  /* ... */
}
```

### Adding New Planets

Edit `glitchwrld/src/utils/data/planetPerspectives.ts`:

```typescript
export const MULTI_PERSPECTIVE_PLANETS: Record<string, MultiPerspectivePlanet> = {
  // ... existing planets

  pluto: {
    name: 'Pluto',
    symbol: '♇',
    color: '#B87333',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Your scientific description...',
        highlights: ['Dwarf planet', 'Kuiper Belt', 'Eccentric orbit', 'Five moons']
      },
      // ... add other perspectives
    ]
  }
}
```

---

## 🎯 Features

✅ **Interactive Tabs** - Click to switch between perspectives
✅ **Smooth Animations** - Beautiful fade and slide transitions
✅ **Responsive Design** - Works on mobile and desktop
✅ **Accessible** - Keyboard navigation and focus states
✅ **Space Theme** - Cosmic colors and glow effects
✅ **Highlight Tags** - Quick-scan key facts for each perspective
✅ **Auto-positioning** - Tooltips follow planets in 3D space
✅ **Compact Mode** - Minimal version for quick info

---

## 💡 User Experience Tips

1. **Default Perspective**: Start with `mythological` or `poetic` for emotional engagement, then let users explore scientific facts
2. **Tooltip Offset**: Adjust based on planet size - larger planets need more offset
3. **Mobile**: Use `compact={true}` for better mobile experience
4. **Hover Delay**: Consider adding a small delay before showing tooltip to prevent accidental triggers

---

## 🔮 Future Enhancements

Potential additions to consider:

- **Audio narration** for each perspective
- **Deep-dive modal** for expanded content
- **User preference memory** (remember which perspective they prefer)
- **Comparison mode** (compare two planets side by side)
- **Astrological charts** integration for personal readings
- **Educational quizzes** based on planet facts
- **Share functionality** to share favorite perspectives

---

## 🤝 Integration with Existing Systems

### Works with existing tooltip system

You can use both the original `CelestialTooltip` and new `MultiPerspectivePopover`:

```tsx
// Use old system for moons
import { PlanetWithTooltip } from './components/planets/PlanetWithTooltip'

// Use new system for main planets
import { PlanetWithMultiPerspective } from './components/planets/PlanetWithMultiPerspective'
```

### State Management

The popover manages its own internal state for perspective switching, but you can control it globally:

```tsx
import { useMultiPerspectiveControl } from './components/planets/PlanetWithMultiPerspective'

function App() {
  const { globalPerspective, setGlobalPerspective, cyclePerspective } = useMultiPerspectiveControl()

  // Now you can control all popovers from one place
  // Or add keyboard shortcuts to cycle perspectives
}
```

---

## 📚 Educational Value

This system makes astronomy **accessible and engaging** by offering:

- **Multiple entry points** - Users can start with what interests them
- **Depth without overwhelm** - Information is organized and bite-sized
- **Cultural context** - Connects science with human meaning
- **Personal relevance** - Shows how cosmic principles apply to life

Perfect for **educational apps**, **planetariums**, **meditation apps**, or any **cosmic visualization** that wants to deepen user engagement.

---

**Enjoy exploring the cosmos from every angle!** 🌌✨
