import * as THREE from 'three'

/**
 * Shared spiral arm positioning utilities
 * Consolidates duplicate positioning logic from multiple files
 */

export interface SpiralPositionConfig {
  galaxyRadius: number
  spiralArms: number
  spiralTightness: number
  minDistance?: number
  verticalVariationAmount?: number
}

export interface SpiralPosition {
  position: THREE.Vector3
  armIndex: number
  distance: number
}

/**
 * Generate positions along spiral arms with specified distribution
 *
 * @param distances - Array of radial distances from center
 * @param config - Spiral arm configuration
 * @returns Array of positions with metadata
 */
export function generateSpiralPositions(
  distances: number[],
  config: SpiralPositionConfig
): SpiralPosition[] {
  const {
    galaxyRadius,
    spiralArms,
    spiralTightness,
    minDistance = 0.5,
    verticalVariationAmount = 0.2
  } = config

  const positions: SpiralPosition[] = []

  distances.forEach((distance, index) => {
    // Distribute across spiral arms
    const armIndex = index % spiralArms
    const branchAngle = (armIndex / spiralArms) * Math.PI * 2

    // Calculate spiral angle based on distance
    const spinAngle = distance * spiralTightness

    // Add controlled variation to prevent perfect alignment
    const angleVariation = (Math.random() - 0.5) * 0.3
    const radiusVariation = (Math.random() - 0.5) * 0.2

    const finalRadius = Math.max(minDistance, distance + radiusVariation)
    const finalAngle = branchAngle + spinAngle + angleVariation

    const position = new THREE.Vector3(
      Math.cos(finalAngle) * finalRadius,
      (Math.random() - 0.5) * verticalVariationAmount,
      Math.sin(finalAngle) * finalRadius
    )

    positions.push({
      position,
      armIndex,
      distance: finalRadius
    })
  })

  return positions
}

/**
 * Generate evenly distributed positions along spiral arms
 *
 * @param count - Number of positions to generate
 * @param config - Spiral arm configuration
 * @returns Array of positions with metadata
 */
export function generateEvenlyDistributedSpiralPositions(
  count: number,
  config: SpiralPositionConfig
): SpiralPosition[] {
  const { galaxyRadius, minDistance = 2 } = config

  // Generate evenly distributed radii
  const distances = Array.from({ length: count }, (_, i) => {
    const normalizedPosition = i / count
    return minDistance + (galaxyRadius - minDistance) * Math.pow(normalizedPosition, 0.8)
  })

  return generateSpiralPositions(distances, config)
}

/**
 * Calculate spiral position for a single point
 *
 * @param distance - Radial distance from center
 * @param index - Index for spiral arm distribution
 * @param config - Spiral arm configuration
 * @returns Position with metadata
 */
export function calculateSpiralPosition(
  distance: number,
  index: number,
  config: SpiralPositionConfig
): SpiralPosition {
  const positions = generateSpiralPositions([distance], {
    ...config,
    spiralArms: config.spiralArms
  })

  // Override armIndex with provided index
  const position = positions[0]
  const armIndex = index % config.spiralArms
  const branchAngle = (armIndex / config.spiralArms) * Math.PI * 2
  const spinAngle = distance * config.spiralTightness
  const angleVariation = (Math.random() - 0.5) * 0.1

  const finalAngle = branchAngle + spinAngle + angleVariation

  return {
    position: new THREE.Vector3(
      Math.cos(finalAngle) * distance,
      (Math.random() - 0.5) * (config.verticalVariationAmount || 0.1),
      Math.sin(finalAngle) * distance
    ),
    armIndex,
    distance
  }
}
