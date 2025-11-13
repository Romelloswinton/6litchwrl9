/**
 * OrbitPath - Visualizes elliptical orbital paths
 * Shows the trajectory planets follow around the Sun
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { generateOrbitPath } from '../../utils/orbital/OrbitalMechanics'
import type { PlanetOrbitalData } from '../../utils/orbital/PlanetData'

interface OrbitPathProps {
  planetData: PlanetOrbitalData
  color?: string
  opacity?: number
  lineWidth?: number
  dashed?: boolean
  visible?: boolean
  segments?: number
}

export function OrbitPath({
  planetData,
  color,
  opacity = 0.3,
  lineWidth = 1,
  dashed = false,
  visible = true,
  segments = 360
}: OrbitPathProps) {
  // Generate orbit path points
  const points = useMemo(() => {
    const pathPoints = generateOrbitPath(planetData, segments)
    return pathPoints.map(p => new THREE.Vector3(p.x, p.y, p.z))
  }, [planetData, segments])

  // Use planet color if not specified
  const pathColor = color || planetData.color

  if (!visible) {
    return null
  }

  return (
    <Line
      points={points}
      color={pathColor}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={dashed ? 100 : undefined}
      gapSize={dashed ? 50 : undefined}
    />
  )
}

/**
 * OrbitPathGroup - Renders orbit paths for multiple planets
 */
interface OrbitPathGroupProps {
  planets: PlanetOrbitalData[]
  visible?: boolean
  innerPlanetsColor?: string
  outerPlanetsColor?: string
  innerOpacity?: number
  outerOpacity?: number
}

export function OrbitPathGroup({
  planets,
  visible = true,
  innerPlanetsColor = '#4A90E2',
  outerPlanetsColor = '#FAD5A5',
  innerOpacity = 0.4,
  outerOpacity = 0.3
}: OrbitPathGroupProps) {
  if (!visible) {
    return null
  }

  return (
    <group name="OrbitPaths">
      {planets.map((planet) => (
        <OrbitPath
          key={planet.name}
          planetData={planet}
          color={planet.group === 'inner' ? innerPlanetsColor : outerPlanetsColor}
          opacity={planet.group === 'inner' ? innerOpacity : outerOpacity}
          lineWidth={planet.group === 'inner' ? 2 : 1.5}
          visible={visible}
        />
      ))}
    </group>
  )
}
