/**
 * Constellation Layer Component
 *
 * Renders constellations with their star patterns and connecting lines
 * Supports both Western and Eastern astronomical traditions
 */

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Line, Text, Html } from '@react-three/drei'
import { useHybridStore } from '../../stores/hybridStore'
import {
  getAllConstellations,
  getConstellationById,
  getTotalConstellationStars,
  type Constellation
} from '../../utils/data/constellationDatabase'

interface ConstellationLayerProps {
  /** Whether to show constellation lines */
  showLines?: boolean
  /** Whether to show constellation labels */
  showLabels?: boolean
  /** Scale factor for constellation size */
  scale?: number
  /** Which constellations to show ('all', 'western', 'eastern', 'zodiac') */
  filter?: 'all' | 'western' | 'eastern' | 'zodiac'
  /** Opacity of constellation lines */
  lineOpacity?: number
  /** Enable subtle animation */
  animate?: boolean
}

/**
 * Individual constellation renderer
 */
function ConstellationGroup({
  constellation,
  showLines,
  showLabels,
  scale,
  lineOpacity,
  position,
  animate,
  onHover,
  isHovered
}: {
  constellation: Constellation
  showLines: boolean
  showLabels: boolean
  scale: number
  lineOpacity: number
  position: THREE.Vector3
  animate: boolean
  onHover: (constellation: Constellation | null) => void
  isHovered: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const [localHovered, setLocalHovered] = useState(false)
  const { camera } = useThree()

  // Generate star positions and colors
  const starData = useMemo(() => {
    const positions = new Float32Array(constellation.stars.length * 3)
    const colors = new Float32Array(constellation.stars.length * 3)
    const sizes = new Float32Array(constellation.stars.length)

    constellation.stars.forEach((star, index) => {
      const i3 = index * 3

      // Apply scale to positions
      positions[i3] = star.position[0] * scale
      positions[i3 + 1] = star.position[1] * scale
      positions[i3 + 2] = star.position[2] * scale

      // Star color (use individual or accent color)
      const color = new THREE.Color(star.color || constellation.accentColor)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Star size based on magnitude (brighter = larger)
      sizes[index] = star.magnitude * 2.5
    })

    return { positions, colors, sizes }
  }, [constellation, scale])

  // Generate connection lines
  const lines = useMemo(() => {
    // Always generate line data, but we'll control visibility separately
    return constellation.connections.map((conn, index) => {
      const start = constellation.stars[conn.from].position
      const end = constellation.stars[conn.to].position

      return {
        key: `${constellation.id}-line-${index}`,
        points: [
          new THREE.Vector3(start[0] * scale, start[1] * scale, start[2] * scale),
          new THREE.Vector3(end[0] * scale, end[1] * scale, end[2] * scale)
        ],
        color: new THREE.Color(constellation.accentColor)
      }
    })
  }, [constellation, scale])

  // Calculate label position (center of constellation)
  const labelPosition = useMemo(() => {
    if (constellation.stars.length === 0) return new THREE.Vector3(0, 0, 0)

    const center = new THREE.Vector3()
    constellation.stars.forEach(star => {
      center.x += star.position[0]
      center.y += star.position[1]
      center.z += star.position[2]
    })
    center.divideScalar(constellation.stars.length)
    center.multiplyScalar(scale)

    // Offset label slightly above constellation
    center.y += scale * 0.8

    return center
  }, [constellation, scale])

  // Get tradition label for display
  const traditionLabel = useMemo(() => {
    switch (constellation.tradition) {
      case 'western': return 'Western'
      case 'eastern': return 'Eastern'
      case 'zodiac': return 'Zodiac'
      default: return ''
    }
  }, [constellation.tradition])

  // Get additional info based on tradition
  const additionalInfo = useMemo(() => {
    if (constellation.tradition === 'eastern' && constellation.direction) {
      return `${constellation.direction.toUpperCase()} • ${constellation.season?.toUpperCase()}`
    }
    return traditionLabel
  }, [constellation, traditionLabel])

  // Animate constellation group with subtle motion
  useFrame((state) => {
    if (!groupRef.current || !animate) return

    const time = state.clock.elapsedTime

    // Gentle rotation based on tradition
    if (constellation.tradition === 'eastern') {
      // Eastern constellations rotate slowly with their season
      groupRef.current.rotation.y = time * 0.01
    } else {
      // Western constellations have subtle tilting motion
      groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.02
    }

    // Subtle pulsing of stars
    if (pointsRef.current && pointsRef.current.material instanceof THREE.PointsMaterial) {
      const pulseScale = 1 + Math.sin(time * 0.5) * 0.1
      pointsRef.current.material.size = 0.03 * pulseScale
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
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
      {/* Constellation stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[starData.positions, 3]}
            attach="attributes-position"
          />
          <bufferAttribute
            args={[starData.colors, 3]}
            attach="attributes-color"
          />
          <bufferAttribute
            args={[starData.sizes, 1]}
            attach="attributes-size"
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={isHovered ? 1.0 : 0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Constellation lines - Show only when hovered OR when global showLines is true */}
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

      {/* 3D Text Label */}
      {showLabels && (
        <group position={labelPosition}>
          <Text
            fontSize={scale * 0.15}
            color={constellation.accentColor}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.02}
            outlineColor="#000000"
            fillOpacity={isHovered ? 1.0 : 0.7}
          >
            {constellation.name}
          </Text>
          <Text
            position={[0, -scale * 0.12, 0]}
            fontSize={scale * 0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="top"
            outlineWidth={0.01}
            outlineColor="#000000"
            fillOpacity={isHovered ? 0.9 : 0.5}
          >
            {additionalInfo}
          </Text>
        </group>
      )}

      {/* Subtle HTML tooltip on hover */}
      {isHovered && (
        <Html
          position={labelPosition}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 17, 0.9)',
              border: `2px solid ${constellation.accentColor}`,
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'sans-serif',
              maxWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              color: constellation.accentColor,
              fontSize: '16px'
            }}>
              {constellation.name}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#87ceeb',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {additionalInfo} • {constellation.stars.length} stars
            </div>
            <div style={{
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#cccccc'
            }}>
              {constellation.mythology.substring(0, 150)}...
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * Main constellation layer component
 */
export function ConstellationLayer({
  showLines = true,
  showLabels = false,
  scale = 3,
  filter = 'all',
  lineOpacity = 0.4,
  animate = true
}: ConstellationLayerProps) {
  const { galaxyRadius, isAnimating, setHoveredConstellation } = useHybridStore()
  const [localHoveredConstellation, setLocalHoveredConstellation] = useState<Constellation | null>(null)

  // Sync local hover state with global store
  useEffect(() => {
    setHoveredConstellation(localHoveredConstellation)
  }, [localHoveredConstellation, setHoveredConstellation])

  // Filter constellations based on tradition
  const constellations = useMemo(() => {
    const allConstellations = getAllConstellations()

    if (filter === 'all') {
      return allConstellations
    }

    return allConstellations.filter(c => c.tradition === filter)
  }, [filter])

  // Position constellations in 3D space around the galaxy
  const constellationPositions = useMemo(() => {
    const positions: Map<string, THREE.Vector3> = new Map()
    const radius = galaxyRadius * 2.5 // Place constellations outside main galaxy

    constellations.forEach((constellation, index) => {
      let position: THREE.Vector3

      if (constellation.tradition === 'eastern' && constellation.direction) {
        // Position eastern constellations by their cardinal direction
        const directionAngles: Record<string, number> = {
          east: 0,
          south: Math.PI / 2,
          west: Math.PI,
          north: 3 * Math.PI / 2
        }

        const angle = directionAngles[constellation.direction]
        const height = (constellation.season === 'spring' ? 1 :
                       constellation.season === 'summer' ? 0.5 :
                       constellation.season === 'autumn' ? -0.5 : -1) * radius * 0.3

        position = new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        )
      } else if (constellation.skyPosition) {
        // Use sky position (RA/Dec) to calculate spherical coordinates
        const ra = constellation.skyPosition.ra * (Math.PI / 12) // Convert hours to radians
        const dec = constellation.skyPosition.dec * (Math.PI / 180) // Convert degrees to radians

        position = new THREE.Vector3(
          Math.cos(dec) * Math.cos(ra) * radius,
          Math.sin(dec) * radius,
          Math.cos(dec) * Math.sin(ra) * radius
        )
      } else {
        // Default: distribute evenly in a sphere
        const theta = (index / constellations.length) * Math.PI * 2
        const phi = Math.acos(2 * (index / constellations.length) - 1)

        position = new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      }

      positions.set(constellation.id, position)
    })

    return positions
  }, [constellations, galaxyRadius])

  // Log constellation info
  useEffect(() => {
    const totalStars = getTotalConstellationStars()
    console.log(`⭐ Loaded ${constellations.length} constellations with ${totalStars} total stars`)
    console.log('   Western:', constellations.filter(c => c.tradition === 'western').length)
    console.log('   Eastern:', constellations.filter(c => c.tradition === 'eastern').length)
    console.log('   Zodiac:', constellations.filter(c => c.tradition === 'zodiac').length)
  }, [constellations])

  return (
    <group name="constellation-layer">
      {constellations.map(constellation => {
        const position = constellationPositions.get(constellation.id)
        if (!position) return null

        return (
          <ConstellationGroup
            key={constellation.id}
            constellation={constellation}
            showLines={showLines}
            showLabels={showLabels}
            scale={scale}
            lineOpacity={lineOpacity}
            position={position}
            animate={animate && isAnimating}
            onHover={setLocalHoveredConstellation}
            isHovered={localHoveredConstellation?.id === constellation.id}
          />
        )
      })}
    </group>
  )
}

/**
 * Export constellation info for UI controls
 */
export function useConstellationInfo() {
  const allConstellations = getAllConstellations()
  const totalStars = getTotalConstellationStars()

  return {
    totalConstellations: allConstellations.length,
    totalStars,
    byTradition: {
      western: allConstellations.filter(c => c.tradition === 'western').length,
      eastern: allConstellations.filter(c => c.tradition === 'eastern').length,
      zodiac: allConstellations.filter(c => c.tradition === 'zodiac').length
    },
    allConstellations
  }
}
