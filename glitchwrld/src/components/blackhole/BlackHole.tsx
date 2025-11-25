/**
 * Black Hole Component
 *
 * Combines Event Horizon and Accretion Disk into a unified black hole system
 * Features:
 * - Schwarzschild radius calculation based on mass
 * - Event horizon (point of no return)
 * - Accretion disk with orbital motion
 * - Temperature-based coloring
 * - Scientifically inspired visualization
 */

import { EventHorizon } from './EventHorizon'
import { AccretionDisk } from './AccretionDisk'

interface BlackHoleProps {
  position?: [number, number, number]
  mass?: number // Solar masses
  rotationSpeed?: number // For future Kerr implementation
}

export function BlackHole({
  position = [0, 0, 0],
  mass = 10, // Default: 10 solar masses
  rotationSpeed = 0
}: BlackHoleProps) {
  // Calculate Schwarzschild radius
  // Rs = 2GM/c² ≈ 3 km per solar mass
  // Scale to scene units (1 unit = ~1 km for visualization)
  const schwarzschildRadius = mass * 0.3 // Scaled for scene visibility

  // Accretion disk starts just outside event horizon
  const innerDiskRadius = schwarzschildRadius * 1.5 // Photon sphere
  const outerDiskRadius = schwarzschildRadius * 8 // Extended disk

  return (
    <group position={position}>
      {/* Event Horizon - The point of no return */}
      <EventHorizon
        radius={schwarzschildRadius}
        position={[0, 0, 0]}
      />

      {/* Accretion Disk - Swirling matter */}
      <AccretionDisk
        innerRadius={innerDiskRadius}
        outerRadius={outerDiskRadius}
        particleCount={5000}
        position={[0, 0, 0]}
      />

      {/* Ambient light to illuminate the scene */}
      <ambientLight intensity={0.1} />

      {/* Point light at center for subtle glow effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        distance={schwarzschildRadius * 10}
        color="#ff6600"
      />
    </group>
  )
}
