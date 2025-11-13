import { PlanetOrbitalData } from '../orbital/PlanetData'

/**
 * Unified planet database - single source of truth for all planet data
 * Combines orbital, physical, and visual properties
 */

export interface UnifiedPlanetData extends PlanetOrbitalData {
  // Visual properties for rendering
  visualSize: number      // Relative size for rendering (Earth = 1.0)
  visualMass: number      // Relative mass for calculations (Earth = 1.0)
  distanceAU: number      // Simplified AU distance for quick access
}

/**
 * SINGLE SOURCE OF TRUTH: All planet data in one place
 * After recent cleanup: Mercury, Earth, Jupiter, Neptune only
 */
export const PLANET_DATABASE: Record<string, UnifiedPlanetData> = {
  mercury: {
    name: 'Mercury',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 0.387,
    distanceAU: 0.39,
    eccentricity: 0.206,
    orbitalPeriod: 87.97,
    orbitalInclination: 7.00,
    longitudeOfAscendingNode: 48.33,
    argumentOfPerihelion: 29.12,
    radius: 2439.7,
    mass: 3.3011e23,
    rotationPeriod: 58.65,
    axialTilt: 0.034,
    color: '#8C7853',
    hasRings: false,
    moons: 0,
    visualSize: 0.03,
    visualMass: 0.055
  },

  earth: {
    name: 'Earth',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 1.000,
    distanceAU: 1.0,
    eccentricity: 0.017,
    orbitalPeriod: 365.26,
    orbitalInclination: 0.00,
    longitudeOfAscendingNode: -11.26,
    argumentOfPerihelion: 114.21,
    radius: 6371.0,
    mass: 5.9724e24,
    rotationPeriod: 0.997,
    axialTilt: 23.44,
    color: '#4A90E2',
    hasRings: false,
    moons: 1,
    visualSize: 0.04,
    visualMass: 1.0
  },

  jupiter: {
    name: 'Jupiter',
    type: 'gas-giant',
    group: 'outer',
    semiMajorAxis: 5.203,
    distanceAU: 5.2,
    eccentricity: 0.048,
    orbitalPeriod: 4332.59,
    orbitalInclination: 1.31,
    longitudeOfAscendingNode: 100.46,
    argumentOfPerihelion: 273.87,
    radius: 69911,
    mass: 1.8982e27,
    rotationPeriod: 0.414,
    axialTilt: 3.13,
    color: '#C88B3A',
    hasRings: true,
    moons: 95,
    visualSize: 0.12,
    visualMass: 317.8
  },

  neptune: {
    name: 'Neptune',
    type: 'ice-giant',
    group: 'outer',
    semiMajorAxis: 30.069,
    distanceAU: 30.1,
    eccentricity: 0.009,
    orbitalPeriod: 60182,
    orbitalInclination: 1.77,
    longitudeOfAscendingNode: 131.78,
    argumentOfPerihelion: 276.34,
    radius: 24622,
    mass: 1.02413e26,
    rotationPeriod: 0.671,
    axialTilt: 28.32,
    color: '#4166F5',
    hasRings: true,
    moons: 16,
    visualSize: 0.07,
    visualMass: 17.1
  }
}

/**
 * Helper: Get all planets as array
 */
export function getAllPlanets(): UnifiedPlanetData[] {
  return Object.values(PLANET_DATABASE)
}

/**
 * Helper: Get planet by name (case-insensitive)
 */
export function getPlanetByName(name: string): UnifiedPlanetData | undefined {
  return Object.values(PLANET_DATABASE).find(
    p => p.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Helper: Get planets ordered by distance from sun
 */
export function getPlanetsOrderedByDistance(): UnifiedPlanetData[] {
  return getAllPlanets().sort((a, b) => a.distanceAU - b.distanceAU)
}

/**
 * Helper: Get simplified planet data for rendering (backward compatibility)
 */
export function getSimplifiedPlanetData(): Array<{
  name: string
  distance: number
  size: number
  color: string
  mass: number
}> {
  return getAllPlanets().map(p => ({
    name: p.name,
    distance: p.distanceAU,
    size: p.visualSize,
    color: p.color,
    mass: p.visualMass
  }))
}
