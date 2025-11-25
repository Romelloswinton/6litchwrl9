/*
  Accurate Solar System with Real Proportions
  All 8 planets with scientifically accurate orbital distances and sizes
  + Major moons + Subtle background stars
*/

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_DATA, MOON_DATA, type MoonData } from '../../utils/orbital/PlanetData'
import { useHybridStore } from '../../stores/hybridStore'
import { useCameraAnimation } from '../../hooks/camera/useCameraAnimation'
import { EmotionalVenus } from '../planets/EmotionalVenus'
import { RealisticPlanet } from '../planets/RealisticPlanet'
import { CelestialTooltip, CompactCelestialTooltip } from '../ui/CelestialTooltip'
import { getCelestialSymbolism } from '../../utils/data/celestialSymbolism'
import {
  calculateAllPlanetPositions,
  getOrbitalAngleFromPosition,
  getPlanetaryPositionSummary
} from '../../utils/orbital/astronomicalCalculations'

interface SolarSystemProps {
  timeScale?: number
  showOrbits?: boolean
}

/*
  ACCURATE PLANETARY DISTANCES (from NASA/JPL):
  Mercury: 0.39 AU
  Venus:   0.72 AU
  Earth:   1.00 AU
  Mars:    1.52 AU
  Jupiter: 5.20 AU
  Saturn:  9.54 AU
  Uranus: 19.19 AU
  Neptune: 30.07 AU

  For desktop viewing, we use compressed scaling:
  - Inner planets (< 2 AU): Linear scale
  - Outer planets (> 2 AU): Logarithmic compression
*/

// Scene units per AU for moon calculations
const AU_TO_SCENE_UNITS = 5.0 // 1 AU = 5 units (matches innerPlanetScale)

// Desktop-optimized distance scaling with better visual separation
function calculateDisplayDistance(distanceAU: number): number {
  const innerPlanetScale = 5.0  // 1 AU = 5 units for inner planets
  const compressionFactor = 0.58 // Gentler compression for better outer planet separation
  const sunClearanceOffset = 3.0 // Minimum distance from sun center to prevent planet absorption

  if (distanceAU < 2.0) {
    // Linear scaling for inner planets (Mercury, Venus, Earth, Mars)
    // Add offset to ensure planets are outside the sun
    return (distanceAU * innerPlanetScale) + sunClearanceOffset
  } else {
    // Logarithmic compression for outer planets - push them further out
    const innerBoundary = (2.0 * innerPlanetScale) + sunClearanceOffset // Where inner planets end (~13)
    const excessDistance = distanceAU - 2.0
    const compressedDistance = Math.pow(excessDistance, compressionFactor) * innerPlanetScale * 3.5 // Increased multiplier
    return innerBoundary + compressedDistance
  }
}

// Logarithmic size scaling for realistic but visible planets
function calculateVisualSize(radiusKm: number): number {
  const earthRadius = 6371
  const baseSize = 0.5  // Earth will be 0.5 units
  const exponent = 0.35   // Logarithmic compression
  return baseSize * Math.pow(radiusKm / earthRadius, exponent)
}

// Calculate scaled distances for all planets
const PLANET_DISTANCES = {
  sun: 0,
  mercury: calculateDisplayDistance(0.387),
  venus: calculateDisplayDistance(0.723),
  earth: calculateDisplayDistance(1.000),
  mars: calculateDisplayDistance(1.524),
  jupiter: calculateDisplayDistance(5.203),
  saturn: calculateDisplayDistance(9.537),
  uranus: calculateDisplayDistance(19.191),
  neptune: calculateDisplayDistance(30.069),
}

console.log('🌍 Desktop-optimized planetary distances:', {
  mercury: `0.39 AU → ${PLANET_DISTANCES.mercury.toFixed(2)} units`,
  venus: `0.72 AU → ${PLANET_DISTANCES.venus.toFixed(2)} units`,
  earth: `1.00 AU → ${PLANET_DISTANCES.earth.toFixed(2)} units`,
  mars: `1.52 AU → ${PLANET_DISTANCES.mars.toFixed(2)} units`,
  jupiter: `5.20 AU → ${PLANET_DISTANCES.jupiter.toFixed(2)} units`,
  saturn: `9.54 AU → ${PLANET_DISTANCES.saturn.toFixed(2)} units`,
  uranus: `19.19 AU → ${PLANET_DISTANCES.uranus.toFixed(2)} units`,
  neptune: `30.07 AU → ${PLANET_DISTANCES.neptune.toFixed(2)} units`,
})

// Moon component for orbiting moons
function Moon({
  moonData,
  parentRef,
  time,
  timeScale,
  hoveredBody,
  setHoveredBody
}: {
  moonData: MoonData
  parentRef: React.RefObject<THREE.Group> | React.RefObject<THREE.Group | null>
  time: number
  timeScale: number
  hoveredBody: string | null
  setHoveredBody: (body: string | null) => void
}) {
  const moonRef = useRef<THREE.Group>(null)
  // Moons are scaled up to be clearly visible (3x the calculated size for better visibility)
  const size = calculateVisualSize(moonData.radius) * 3.0
  const moonName = moonData.name.toLowerCase()

  useFrame(() => {
    if (!moonRef.current || !parentRef.current) return

    // Scale moon orbits to be clearly visible and separate from parent planet
    // Moon distances are in AU but extremely small (0.00257 AU for Earth's moon, 0.0000627 for Phobos)
    // We scale them up dramatically so moons are clearly separated from their planets
    const moonDistance = moonData.semiMajorAxis * AU_TO_SCENE_UNITS * 300 // 300x larger orbits for clear separation!
    const moonSpeed = (2 * Math.PI) / (moonData.orbitalPeriod * timeScale)
    const moonAngle = time * moonSpeed

    // Moons orbit in the ecliptic plane (XZ plane), perpendicular to the sun's vertical axis (Y)
    // This keeps all planetary motion in the same horizontal plane for better visualization
    const moonLocalX = Math.cos(moonAngle) * moonDistance
    const moonLocalZ = Math.sin(moonAngle) * moonDistance
    const moonLocalY = 0 // No vertical component - orbit stays in ecliptic plane

    moonRef.current.position.set(
      parentRef.current.position.x + moonLocalX,
      parentRef.current.position.y + moonLocalY, // Stays in parent planet's orbital plane
      parentRef.current.position.z + moonLocalZ
    )
    moonRef.current.rotation.y = moonAngle
  })

  return (
    <group ref={moonRef}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredBody(moonName)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHoveredBody(null)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={moonData.color}
          emissive={moonData.color}
          emissiveIntensity={0.15} // Increased glow for better visibility
        />
      </mesh>
      {hoveredBody === moonName && getCelestialSymbolism(moonName) && (
        <CompactCelestialTooltip
          name={getCelestialSymbolism(moonName)!.name}
          symbol={getCelestialSymbolism(moonName)!.symbol}
          essence={getCelestialSymbolism(moonName)!.essence}
          color={getCelestialSymbolism(moonName)!.color}
          position={[0, size + 0.5, 0]}
          visible={true}
        />
      )}
    </group>
  )
}

// Subtle background stars component
function SubtleBackgroundStars() {
  const positions = useMemo(() => {
    const pos = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      const i3 = i * 3
      // Distribute stars in a large sphere around the solar system
      const distance = 50 + Math.random() * 150 // 50-200 units from center
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i3] = distance * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = distance * Math.cos(phi)
      pos[i3 + 2] = distance * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  const sizes = useMemo(() => {
    const s = new Float32Array(300)
    for (let i = 0; i < 300; i++) {
      s[i] = 0.3 + Math.random() * 0.7 // Subtle size variation
    }
    return s
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
        />
        <bufferAttribute
          args={[sizes, 1]}
          attach="attributes-size"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        color="#ffffff"
        transparent={true}
        opacity={0.6}
        alphaTest={0.001}
        depthWrite={false}
      />
    </points>
  )
}

export function AccurateSolarSystem({ timeScale = 0.2, showOrbits = false }: SolarSystemProps) {
  const [time, setTime] = useState(0)
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null)
  const [hoveredBody, setHoveredBody] = useState<string | null>(null)
  const { planets } = useHybridStore()
  const { animateToPosition } = useCameraAnimation()

  // Calculate real-time initial positions based on current date
  const initialPositions = useMemo(() => {
    const currentDate = new Date()
    const positions = calculateAllPlanetPositions(currentDate)

    console.log('🌍 Real-time planetary alignment initialized!')
    console.log(getPlanetaryPositionSummary(currentDate))

    // Convert positions to initial angles for each planet
    return {
      mercury: getOrbitalAngleFromPosition(positions.mercury),
      venus: getOrbitalAngleFromPosition(positions.venus),
      earth: getOrbitalAngleFromPosition(positions.earth),
      mars: getOrbitalAngleFromPosition(positions.mars),
      jupiter: getOrbitalAngleFromPosition(positions.jupiter),
      saturn: getOrbitalAngleFromPosition(positions.saturn),
      uranus: getOrbitalAngleFromPosition(positions.uranus),
      neptune: getOrbitalAngleFromPosition(positions.neptune),
    }
  }, []) // Only calculate once on mount

  // Planet refs
  const mercuryRef = useRef<THREE.Group>(null)
  const venusRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Group>(null)
  const marsRef = useRef<THREE.Group>(null)
  const jupiterRef = useRef<THREE.Group>(null)
  const saturnRef = useRef<THREE.Group>(null)
  const uranusRef = useRef<THREE.Group>(null)
  const neptuneRef = useRef<THREE.Group>(null)
  const sunRef = useRef<THREE.Mesh>(null)

  // Generic planet click handler
  const handlePlanetClick = (
    planetName: string,
    planetRef: React.RefObject<THREE.Group | null>,
    cameraOffset: THREE.Vector3,
    emoji: string
  ) => {
    return (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()

      if (!planetRef.current) return

      if (focusedPlanet === planetName) {
        // Already focused, zoom back out
        const overviewPosition = new THREE.Vector3(0, 30, 70)
        const overviewTarget = new THREE.Vector3(0, 0, 0)

        animateToPosition(overviewPosition, overviewTarget, {
          duration: 2500,
          easing: 'easeInOut',
          onComplete: () => {
            setFocusedPlanet(null)
            console.log(`${emoji} Zoomed back to overview`)
          }
        })
      } else {
        // Zoom into planet
        const planetPosition = planetRef.current.position.clone()
        const cameraPosition = planetPosition.clone().add(cameraOffset)

        animateToPosition(cameraPosition, planetPosition, {
          duration: 2500,
          easing: 'easeInOut',
          onComplete: () => {
            setFocusedPlanet(planetName)
            console.log(`${emoji} Focused on ${planetName}!`)
          }
        })
      }
    }
  }

  // Planet-specific click handlers with custom camera offsets
  const handleMercuryClick = handlePlanetClick(
    'mercury',
    mercuryRef,
    new THREE.Vector3(1.2, 0.8, 1.5), // Closer view for smaller planet
    '☿️'
  )

  const handleVenusClick = handlePlanetClick(
    'venus',
    venusRef,
    new THREE.Vector3(1.8, 1.2, 2.0), // Medium distance
    '♀️'
  )

  // Special handler for Earth - switches to Spline scene
  const handleEarthClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const { setSceneMode } = useHybridStore.getState()
    setSceneMode('earthSpline')
    console.log('🌍 Switching to Earth Spline scene')
  }

  // Special handler for Mars - switches to Mars Experience scene
  const handleMarsClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const { setSceneMode } = useHybridStore.getState()
    setSceneMode('marsExperience')
    console.log('🔴 Switching to Mars Experience scene')
  }

  // Calculate planet sizes (all properly scaled now)
  const sizes = {
    sun: calculateVisualSize(696000) * 1.2,      // Sun at 1.2x for better proportion (reduced from 2.5x)
    mercury: calculateVisualSize(2439.7),
    venus: calculateVisualSize(6051.8),
    earth: calculateVisualSize(6371.0),
    mars: calculateVisualSize(3389.5),
    jupiter: calculateVisualSize(69911),
    saturn: calculateVisualSize(58232),
    uranus: calculateVisualSize(25362),
    neptune: calculateVisualSize(24622),
  }

  console.log('🌍 Planet sizes:', {
    sun: sizes.sun.toFixed(3),
    mercury: sizes.mercury.toFixed(3),
    venus: sizes.venus.toFixed(3),
    earth: sizes.earth.toFixed(3),
    mars: sizes.mars.toFixed(3),
    jupiter: sizes.jupiter.toFixed(3),
    saturn: sizes.saturn.toFixed(3),
  })

  console.log('🌍 Solar System with', Object.keys(MOON_DATA).length, 'moons + 300 subtle stars')

  // Animation loop with desktop-optimized distances
  useFrame((state, delta) => {
    setTime(t => t + delta * timeScale)

    // Simplified circular orbits at fixed desktop-optimized distances
    // Each planet orbits at its calculated display distance
    // All orbits are in the ecliptic plane (XZ plane, Y=0) perpendicular to the sun's vertical axis
    // IMPORTANT: Now starting from real astronomical positions!

    // Mercury - Fast orbit (88 days)
    if (mercuryRef.current) {
      const mercurySpeed = (2 * Math.PI) / (PLANET_DATA.mercury.orbitalPeriod * timeScale)
      const mercuryAngle = initialPositions.mercury + (time * mercurySpeed)
      mercuryRef.current.position.set(
        Math.cos(mercuryAngle) * PLANET_DISTANCES.mercury,
        0, // Ecliptic plane (perpendicular to sun's vertical axis)
        Math.sin(mercuryAngle) * PLANET_DISTANCES.mercury
      )
      mercuryRef.current.rotation.y += delta * 0.02
    }

    // Venus - Retrograde rotation (225 days)
    if (venusRef.current) {
      const venusSpeed = (2 * Math.PI) / (PLANET_DATA.venus.orbitalPeriod * timeScale)
      const venusAngle = initialPositions.venus + (time * venusSpeed)
      venusRef.current.position.set(
        Math.cos(venusAngle) * PLANET_DISTANCES.venus,
        0,
        Math.sin(venusAngle) * PLANET_DISTANCES.venus
      )
      venusRef.current.rotation.y -= delta * 0.005 // Retrograde
    }

    // Earth - 1 year orbit (365 days)
    if (earthRef.current) {
      const earthSpeed = (2 * Math.PI) / (PLANET_DATA.earth.orbitalPeriod * timeScale)
      const earthAngle = initialPositions.earth + (time * earthSpeed)
      earthRef.current.position.set(
        Math.cos(earthAngle) * PLANET_DISTANCES.earth,
        0,
        Math.sin(earthAngle) * PLANET_DISTANCES.earth
      )
      earthRef.current.rotation.y += delta * 2.0
    }

    // Mars - 687 days
    if (marsRef.current) {
      const marsSpeed = (2 * Math.PI) / (PLANET_DATA.mars.orbitalPeriod * timeScale)
      const marsAngle = initialPositions.mars + (time * marsSpeed)
      marsRef.current.position.set(
        Math.cos(marsAngle) * PLANET_DISTANCES.mars,
        0,
        Math.sin(marsAngle) * PLANET_DISTANCES.mars
      )
      marsRef.current.rotation.y += delta * 1.8
    }

    // Jupiter - 11.9 years
    if (jupiterRef.current) {
      const jupiterSpeed = (2 * Math.PI) / (PLANET_DATA.jupiter.orbitalPeriod * timeScale)
      const jupiterAngle = initialPositions.jupiter + (time * jupiterSpeed)
      jupiterRef.current.position.set(
        Math.cos(jupiterAngle) * PLANET_DISTANCES.jupiter,
        0,
        Math.sin(jupiterAngle) * PLANET_DISTANCES.jupiter
      )
      jupiterRef.current.rotation.y += delta * 5.0
    }

    // Saturn - 29.5 years
    if (saturnRef.current) {
      const saturnSpeed = (2 * Math.PI) / (PLANET_DATA.saturn.orbitalPeriod * timeScale)
      const saturnAngle = initialPositions.saturn + (time * saturnSpeed)
      saturnRef.current.position.set(
        Math.cos(saturnAngle) * PLANET_DISTANCES.saturn,
        0,
        Math.sin(saturnAngle) * PLANET_DISTANCES.saturn
      )
      saturnRef.current.rotation.y += delta * 4.5
    }

    // Uranus - 84 years (retrograde rotation)
    if (uranusRef.current) {
      const uranusSpeed = (2 * Math.PI) / (PLANET_DATA.uranus.orbitalPeriod * timeScale)
      const uranusAngle = initialPositions.uranus + (time * uranusSpeed)
      uranusRef.current.position.set(
        Math.cos(uranusAngle) * PLANET_DISTANCES.uranus,
        0,
        Math.sin(uranusAngle) * PLANET_DISTANCES.uranus
      )
      uranusRef.current.rotation.y -= delta * 3.0 // Retrograde
    }

    // Neptune - 165 years
    if (neptuneRef.current) {
      const neptuneSpeed = (2 * Math.PI) / (PLANET_DATA.neptune.orbitalPeriod * timeScale)
      const neptuneAngle = initialPositions.neptune + (time * neptuneSpeed)
      neptuneRef.current.position.set(
        Math.cos(neptuneAngle) * PLANET_DISTANCES.neptune,
        0,
        Math.sin(neptuneAngle) * PLANET_DISTANCES.neptune
      )
      neptuneRef.current.rotation.y += delta * 2.5
    }

    // Sun rotation
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      {/* Subtle background stars - 300 stars */}
      <SubtleBackgroundStars />

      {/* Sun */}
      <group>
        <mesh
          ref={sunRef}
          position={[0, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredBody('sun')
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredBody(null)
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[sizes.sun, 64, 64]} />
          <meshStandardMaterial
            color="#FDB813"
            emissive="#FF8C00"
            emissiveIntensity={2.5}
          />
        </mesh>
        {hoveredBody === 'sun' && getCelestialSymbolism('sun') && (
          <CelestialTooltip
            symbolism={getCelestialSymbolism('sun')!}
            position={[0, sizes.sun + 2, 0]}
            visible={true}
          />
        )}
      </group>

      {/* Inner Planets */}
      {planets.showInnerPlanets && (
        <>
          {/* Mercury */}
          <group ref={mercuryRef}>
            <RealisticPlanet
              size={sizes.mercury}
              colors={['#4a4a4a', '#8c7c6e', '#b5a79b']}
              atmosphereColor="#a09080"
              noiseScale={3.0}
              onClick={handleMercuryClick}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('mercury')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'mercury' && getCelestialSymbolism('mercury') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('mercury')!}
                position={[0, sizes.mercury + 1, 0]}
                visible={true}
              />
            )}
          </group>

          {/* Venus */}
          <group ref={venusRef}>
            <RealisticPlanet
              size={sizes.venus}
              colors={['#e6b800', '#ffcc00', '#ff9900']}
              atmosphereColor="#ffddaa"
              noiseScale={2.5}
              onClick={() => handleVenusClick({} as any)}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('venus')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'venus' && getCelestialSymbolism('venus') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('venus')!}
                position={[0, sizes.venus + 1.5, 0]}
                visible={true}
              />
            )}
          </group>

          {/* Earth */}
          <group ref={earthRef}>
            <RealisticPlanet
              size={sizes.earth}
              colors={['#1a3c8e', '#2e8b57', '#ffffff']}
              atmosphereColor="#4ca6ff"
              noiseScale={2.0}
              onClick={handleEarthClick}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('earth')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'earth' && getCelestialSymbolism('earth') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('earth')!}
                position={[0, sizes.earth + 1, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.moon} parentRef={earthRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />

          {/* Mars */}
          <group ref={marsRef}>
            <RealisticPlanet
              size={sizes.mars}
              colors={['#8b4513', '#cd5c5c', '#e9967a']}
              atmosphereColor="#ff7f50"
              noiseScale={2.8}
              onClick={handleMarsClick}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('mars')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'mars' && getCelestialSymbolism('mars') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('mars')!}
                position={[0, sizes.mars + 1, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.phobos} parentRef={marsRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.deimos} parentRef={marsRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
        </>
      )}

      {/* Outer Planets */}
      {planets.showOuterPlanets && (
        <>
          {/* Jupiter */}
          <group ref={jupiterRef}>
            <RealisticPlanet
              size={sizes.jupiter}
              colors={['#8b7355', '#d2b48c', '#cd853f']}
              atmosphereColor="#f4a460"
              noiseScale={1.5}
              onClick={(e) => {
                e.stopPropagation()
                const { setSceneMode } = useHybridStore.getState()
                setSceneMode('jupiterExperience')
                console.log('♃ Switching to Jupiter Wisdom Library')
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('jupiter')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'jupiter' && getCelestialSymbolism('jupiter') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('jupiter')!}
                position={[0, sizes.jupiter + 2, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.io} parentRef={jupiterRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.europa} parentRef={jupiterRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.ganymede} parentRef={jupiterRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.callisto} parentRef={jupiterRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />

          {/* Saturn */}
          <group ref={saturnRef}>
            <RealisticPlanet
              size={sizes.saturn}
              colors={['#f4c2c2', '#f0e68c', '#eedd82']}
              atmosphereColor="#faebd7"
              noiseScale={1.8}
              hasRings={true}
              ringColor="#c4a76f"
              onClick={(e) => {
                e.stopPropagation()
                const { setSceneMode } = useHybridStore.getState()
                setSceneMode('saturnExperience')
                console.log('♄ Switching to Saturn Mastery System')
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('saturn')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'saturn' && getCelestialSymbolism('saturn') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('saturn')!}
                position={[0, sizes.saturn + 2.5, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.titan} parentRef={saturnRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.rhea} parentRef={saturnRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />

          {/* Uranus */}
          <group ref={uranusRef}>
            <RealisticPlanet
              size={sizes.uranus}
              colors={['#afeeee', '#40e0d0', '#00ced1']}
              atmosphereColor="#e0ffff"
              noiseScale={2.2}
              hasRings={true}
              ringColor="#afeeee"
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('uranus')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'uranus' && getCelestialSymbolism('uranus') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('uranus')!}
                position={[0, sizes.uranus + 1.5, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.titania} parentRef={uranusRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
          <Moon moonData={MOON_DATA.oberon} parentRef={uranusRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />

          {/* Neptune */}
          <group ref={neptuneRef}>
            <RealisticPlanet
              size={sizes.neptune}
              colors={['#000080', '#0000cd', '#4169e1']}
              atmosphereColor="#1e90ff"
              noiseScale={2.5}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredBody('neptune')
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                setHoveredBody(null)
                document.body.style.cursor = 'default'
              }}
            />
            {hoveredBody === 'neptune' && getCelestialSymbolism('neptune') && (
              <CelestialTooltip
                symbolism={getCelestialSymbolism('neptune')!}
                position={[0, sizes.neptune + 1.5, 0]}
                visible={true}
              />
            )}
          </group>
          <Moon moonData={MOON_DATA.triton} parentRef={neptuneRef} time={time} timeScale={timeScale} hoveredBody={hoveredBody} setHoveredBody={setHoveredBody} />
        </>
      )}

      {/* Black Hole Marker - Mysterious anomaly beyond Neptune */}
      <group position={[0, 0, -150]}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredBody('blackhole')
          }}
          onPointerOut={() => setHoveredBody(null)}
          onClick={(e) => {
            e.stopPropagation()
            const { setSceneMode } = useHybridStore.getState()
            setSceneMode('blackHoleExperience')
            console.log('⚫ Entering Black Hole Experience')
          }}
        >
          {/* Dark sphere with subtle glow */}
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#1a0a00"
            emissive="#ff6600"
            emissiveIntensity={0.3}
            roughness={0.8}
          />
        </mesh>

        {/* Pulsing ring effect */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.5, 32]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Tooltip */}
        {hoveredBody === 'blackhole' && (
          <CompactCelestialTooltip
            name="⚫ Anomaly Detected"
            symbol="⚫"
            essence="Unknown"
            color="#000000"
            position={[0, 3, 0]}
            visible={true}
          />
        )}
      </group>
    </group>
  )
}
