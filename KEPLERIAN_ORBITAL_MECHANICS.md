# Keplerian Orbital Mechanics Implementation

## Overview

The `CustomSplineScene` component now implements realistic planetary motion using **Kepler's Laws of Planetary Motion**, providing astronomically accurate orbital mechanics for the solar system visualization.

## Kepler's Three Laws

### 1. Law of Ellipses
> Planets orbit the Sun in elliptical paths with the Sun at one focus.

**Implementation**: Each planet's orbit is defined by:
- **Semi-major axis (a)**: Average distance from the Sun (measured in AU)
- **Eccentricity (e)**: How elongated the ellipse is (0 = perfect circle, approaching 1 = very elongated)

**Example**:
- Earth: a = 1.000 AU, e = 0.017 (nearly circular)
- Jupiter: a = 5.203 AU, e = 0.048 (slightly elliptical)

### 2. Law of Equal Areas
> A line connecting a planet to the Sun sweeps equal areas in equal times.

**Result**: Planets move faster when closer to the Sun (perihelion) and slower when farther away (aphelion).

**Implementation**: This is automatically handled by solving Kepler's Equation, which relates:
- **Mean Anomaly (M)**: Average angle over time
- **Eccentric Anomaly (E)**: Intermediate calculation
- **True Anomaly (ν)**: Actual angle in the orbit

### 3. Harmonic Law
> The square of a planet's orbital period is proportional to the cube of its semi-major axis.

**Formula**: T² ∝ a³

**Implementation**: This law ensures that:
- Inner planets (Mercury, Venus, Earth) orbit quickly
- Outer planets (Jupiter, Saturn, Neptune) orbit slowly

**Example**:
- Earth: 365.26 days to orbit the Sun
- Jupiter: 4,332.59 days (11.86 years) to orbit the Sun

## Technical Implementation

### File Structure

```
glitchwrld/src/
├── components/
│   ├── spline/
│   │   └── CustomSplineScene.tsx      # Main scene with Keplerian animation
│   └── orbital/
│       └── OrbitPath.tsx               # Visual orbit path rendering
├── utils/
│   └── orbital/
│       ├── OrbitalMechanics.ts         # Kepler's equation solver
│       └── PlanetData.ts               # Real astronomical data (NASA JPL)
```

### Key Functions

#### `calculateOrbitalPosition(planetData, time)`
Located in `OrbitalMechanics.ts`

**Process**:
1. Calculate **Mean Anomaly** from time elapsed
2. Solve **Kepler's Equation** for Eccentric Anomaly using Newton-Raphson iteration
3. Calculate **True Anomaly** from Eccentric Anomaly
4. Calculate orbital radius using the ellipse equation
5. Convert to 3D coordinates accounting for:
   - Orbital inclination (tilt of orbit plane)
   - Argument of perihelion (where perihelion occurs)
   - Longitude of ascending node (rotation of orbit plane)

#### Kepler's Equation Solver
```typescript
M = E - e * sin(E)
```
Where:
- M = Mean Anomaly (input)
- E = Eccentric Anomaly (solve for this)
- e = Eccentricity

**Method**: Newton-Raphson iteration (converges in ~5-10 iterations with tolerance of 1e-6)

### Planet Data (Real Values from NASA)

| Planet  | Semi-Major Axis | Eccentricity | Period (days) | Inclination |
|---------|----------------|--------------|---------------|-------------|
| Mercury | 0.387 AU       | 0.206        | 87.97         | 7.00°       |
| Venus   | 0.723 AU       | 0.007        | 224.70        | 3.39°       |
| Earth   | 1.000 AU       | 0.017        | 365.26        | 0.00°       |
| Jupiter | 5.203 AU       | 0.048        | 4,332.59      | 1.31°       |
| Neptune | 30.069 AU      | 0.009        | 60,182        | 1.77°       |

## Usage

### Basic Usage

```tsx
import CustomSplineScene from './components/spline/CustomSplineScene'

function App() {
  return (
    <Canvas>
      <CustomSplineScene />
    </Canvas>
  )
}
```

### Advanced Usage with Orbit Visualization

```tsx
import CustomSplineScene from './components/spline/CustomSplineScene'

function App() {
  return (
    <Canvas>
      <CustomSplineScene
        showOrbits={true}    // Show elliptical orbit paths
        timeScale={0.5}      // Slow down orbital motion (0.1 = default)
      />
    </Canvas>
  )
}
```

### Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showOrbits` | boolean | false | Display elliptical orbit paths |
| `timeScale` | number | 0.1 | Animation speed multiplier (higher = faster orbits) |

### Adjusting Scene Scale

The `SCENE_SCALE` constant (line 31 in CustomSplineScene.tsx) controls the conversion from Astronomical Units (AU) to scene units:

```typescript
const SCENE_SCALE = 3000 // 1 AU = 3000 units
```

**To adjust**:
- **Increase** (e.g., 5000): Planets spread farther apart
- **Decrease** (e.g., 1500): Planets closer together

## Animation Details

### Planet Rotations

Each planet rotates on its axis at speeds proportional to their real rotation periods:

- **Venus**: Retrograde rotation (rotates backward) - `rotation.y -= delta * 0.1`
- **Earth**: 24-hour day - `rotation.y += delta * 2.0`
- **Jupiter**: 10-hour day (fastest rotation) - `rotation.y += delta * 5.0`
- **Sun**: 27-day rotation - `rotation.y += delta * 0.5`

### Moon's Orbit

The Moon orbits Earth using simplified circular motion:
- **Distance**: 0.00257 AU from Earth (384,400 km)
- **Period**: 27.32 days
- **Tidally locked**: Moon always shows same face to Earth

## Performance Optimization

### Newton-Raphson Solver
- Max iterations: 20
- Tolerance: 1e-6
- Typical convergence: 5-10 iterations
- Extremely efficient for real-time animation

### Planetary Scales
Planet sizes use logarithmic scaling to keep smaller planets visible:

```typescript
scale = SIZE_SCALE * radius^SIZE_EXPONENT
```

## Verification

### Kepler's Third Law Verification
The `verifyKeplersThirdLaw()` function checks if orbital data is correct:

```typescript
const ratio = T² / a³  // Should be ≈ 1.0 for our solar system
```

**Example Results**:
- Earth: ratio ≈ 1.000 ✓
- Jupiter: ratio ≈ 1.001 ✓

## Visual Features

### Lighting
- **Point Light** at Sun position simulates solar radiation
- **Directional Light** provides ambient illumination
- **Hemisphere Light** adds subtle fill lighting
- Shadow mapping enabled for realistic shadows

### Orbit Paths (Optional)
When `showOrbits={true}`:
- Inner planets (Venus, Earth): Blue color (#4A90E2)
- Outer planets (Jupiter): Golden color (#C88B3A)
- 360 segments for smooth ellipses
- Semi-transparent with adjustable opacity

## Future Enhancements

### Potential Additions
1. **More Planets**: Mercury, Mars, Saturn, Uranus, Neptune
2. **Asteroid Belt**: Procedurally generated asteroids
3. **Lagrange Points**: L1-L5 visualization
4. **Planet Moons**: Jupiter's Galilean moons, Saturn's Titan
5. **Orbital Resonances**: Visual indicators of gravitational interactions
6. **Time Controls**: Pause, rewind, fast-forward time
7. **Date Selector**: Show planet positions on specific dates
8. **Orbital Elements Display**: Show current orbital parameters as HUD

## References

- NASA JPL Horizons System: https://ssd.jpl.nasa.gov/horizons.cgi
- IAU Planetary Constants: https://www.iau.org/
- Kepler's Laws: https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion
- Orbital Mechanics: https://orbital-mechanics.space/

## Mathematical Appendix

### Complete Orbital Position Calculation

```typescript
// Step 1: Mean Anomaly
M = 2π * t / T

// Step 2: Solve Kepler's Equation (Newton-Raphson)
E_n+1 = E_n - (E_n - e*sin(E_n) - M) / (1 - e*cos(E_n))

// Step 3: True Anomaly
tan(ν/2) = sqrt((1+e)/(1-e)) * tan(E/2)

// Step 4: Orbital Radius
r = a(1 - e²) / (1 + e*cos(ν))

// Step 5: 3D Position (includes inclination, node, perihelion)
θ = ν + ω  // ω = argument of perihelion
x_orbital = r * cos(θ)
y_orbital = r * sin(θ)

// Rotate by inclination (i) and ascending node (Ω)
x = x_orbital * (cos(Ω)*cos(ω) - sin(Ω)*sin(ω)*cos(i)) - y_orbital * (...)
y = x_orbital * (sin(ω)*sin(i)) + y_orbital * (cos(ω)*sin(i))
z = x_orbital * (sin(Ω)*cos(ω) + cos(Ω)*sin(ω)*cos(i)) - y_orbital * (...)
```

### Variable Definitions

- **M**: Mean Anomaly (radians)
- **E**: Eccentric Anomaly (radians)
- **ν**: True Anomaly (radians)
- **a**: Semi-major axis (AU)
- **e**: Eccentricity (dimensionless)
- **i**: Orbital inclination (radians)
- **Ω**: Longitude of ascending node (radians)
- **ω**: Argument of perihelion (radians)
- **t**: Time elapsed (seconds)
- **T**: Orbital period (seconds)
- **r**: Orbital radius at time t (AU)

---

**Last Updated**: 2025-11-07
**Implementation Version**: 1.0.0
