/**
 * Shared galaxy mathematics utilities
 * Consolidates duplicate algorithms from splineHelpers and solarSystemGenerator
 */

/**
 * Compress solar system distances to fit within galaxy bounds using logarithmic scaling
 *
 * This algorithm ensures outer planets are compressed more than inner ones,
 * creating a natural distribution within the galaxy visualization.
 *
 * @param auDistance - Distance in Astronomical Units
 * @param solarScale - Scale factor for the solar system
 * @param maxGalaxyRadius - Maximum radius of the galaxy
 * @returns Compressed distance suitable for galaxy visualization
 */
export function compressSolarToGalactic(
  auDistance: number,
  solarScale: number,
  maxGalaxyRadius: number
): number {
  const actualDistance = auDistance * solarScale
  const maxSolarDistance = 30.1 * solarScale // Neptune's orbit

  // Logarithmic scaling: outer planets get compressed more than inner ones
  const compressionFactor = Math.log(actualDistance + 1) / Math.log(maxSolarDistance + 1)
  return compressionFactor * maxGalaxyRadius * 0.9 // Use 90% of galaxy radius for padding
}

/**
 * Visual constants for planet rendering and scaling
 * Consolidates scattered constants from multiple files
 */
export const PLANET_VISUAL_CONSTANTS = {
  // Distance scaling
  AU_TO_UNITS: 8000,          // 1 AU = 8000 scene units

  // Planet size scaling (logarithmic for visibility)
  SIZE_SCALE: 0.15,           // Base scale multiplier
  SIZE_EXPONENT: 0.6,         // Logarithmic exponent (< 1 = compress size differences)

  // Time scaling
  YEAR_TO_SECONDS: 60,        // 1 Earth year = 60 seconds in animation
  TIME_MULTIPLIER: 1.0,       // Global speed multiplier

  // Visual enhancements
  MIN_PLANET_SIZE: 50,        // Minimum visual size in units
  MAX_PLANET_SIZE: 2000,      // Maximum visual size in units

  // Default solar system scale factor (used as galaxyRadius * SOLAR_SCALE_FACTOR)
  DEFAULT_SOLAR_SCALE_FACTOR: 0.5
}
