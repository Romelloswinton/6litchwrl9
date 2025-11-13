/**
 * Real astronomical data for planets in our solar system
 * Data sourced from NASA JPL and IAU standards
 *
 * NOTE: This file is now primarily for type definitions.
 * Actual planet data is in utils/data/planetDatabase.ts
 */

export type PlanetType = 'rocky' | 'gas-giant' | 'ice-giant'
export type PlanetGroup = 'inner' | 'outer'

export interface PlanetOrbitalData {
  name: string
  type: PlanetType
  group: PlanetGroup

  // Orbital parameters
  semiMajorAxis: number      // AU (Astronomical Units)
  eccentricity: number        // 0 = circle, 0-1 = ellipse
  orbitalPeriod: number       // Earth days
  orbitalInclination: number  // degrees relative to ecliptic
  longitudeOfAscendingNode: number // degrees
  argumentOfPerihelion: number     // degrees

  // Physical parameters
  radius: number              // km
  mass: number                // kg
  rotationPeriod: number      // Earth days
  axialTilt: number          // degrees

  // Visual properties
  color: string
  hasRings: boolean
  moons: number
}

// Re-export shared constants for backward compatibility
export { PLANET_VISUAL_CONSTANTS as SCALE_FACTORS } from '../galaxy/galaxyMath'

// Real planetary data
export const PLANET_DATA: Record<string, PlanetOrbitalData> = {
  mercury: {
    name: 'Mercury',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 0.387,
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
    moons: 0
  },

  venus: {
    name: 'Venus',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 0.723,
    eccentricity: 0.007,
    orbitalPeriod: 224.70,
    orbitalInclination: 3.39,
    longitudeOfAscendingNode: 76.68,
    argumentOfPerihelion: 54.85,
    radius: 6051.8,
    mass: 4.8675e24,
    rotationPeriod: -243.02, // Retrograde rotation
    axialTilt: 177.36,
    color: '#FFC649',
    hasRings: false,
    moons: 0
  },

  earth: {
    name: 'Earth',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 1.000,
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
    moons: 1
  },

  mars: {
    name: 'Mars',
    type: 'rocky',
    group: 'inner',
    semiMajorAxis: 1.524,
    eccentricity: 0.093,
    orbitalPeriod: 686.98,
    orbitalInclination: 1.85,
    longitudeOfAscendingNode: 49.56,
    argumentOfPerihelion: 286.50,
    radius: 3389.5,
    mass: 6.4171e23,
    rotationPeriod: 1.026,
    axialTilt: 25.19,
    color: '#CD5C5C',
    hasRings: false,
    moons: 2
  },

  jupiter: {
    name: 'Jupiter',
    type: 'gas-giant',
    group: 'outer',
    semiMajorAxis: 5.203,
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
    moons: 95
  },

  saturn: {
    name: 'Saturn',
    type: 'gas-giant',
    group: 'outer',
    semiMajorAxis: 9.537,
    eccentricity: 0.054,
    orbitalPeriod: 10759.22,
    orbitalInclination: 2.49,
    longitudeOfAscendingNode: 113.66,
    argumentOfPerihelion: 339.39,
    radius: 58232,
    mass: 5.6834e26,
    rotationPeriod: 0.445,
    axialTilt: 26.73,
    color: '#DAA520',
    hasRings: true,
    moons: 146
  },

  uranus: {
    name: 'Uranus',
    type: 'ice-giant',
    group: 'outer',
    semiMajorAxis: 19.191,
    eccentricity: 0.047,
    orbitalPeriod: 30688.5,
    orbitalInclination: 0.77,
    longitudeOfAscendingNode: 74.01,
    argumentOfPerihelion: 96.99,
    radius: 25362,
    mass: 8.6810e25,
    rotationPeriod: -0.718, // Retrograde rotation
    axialTilt: 97.77,
    color: '#4FD0E0',
    hasRings: true,
    moons: 28
  },

  neptune: {
    name: 'Neptune',
    type: 'ice-giant',
    group: 'outer',
    semiMajorAxis: 30.069,
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
    moons: 16
  }
}

// Moon data for all planets with major moons
export interface MoonData {
  name: string
  parentPlanet: string
  semiMajorAxis: number // AU
  eccentricity: number
  orbitalPeriod: number // days
  radius: number // km
  mass: number // kg
  color: string
}

export const MOON_DATA: Record<string, MoonData> = {
  // Earth's Moon
  moon: {
    name: 'Moon',
    parentPlanet: 'earth',
    semiMajorAxis: 0.00257, // AU (384,400 km)
    eccentricity: 0.0549,
    orbitalPeriod: 27.32,
    radius: 1737.4,
    mass: 7.342e22,
    color: '#C0C0C0'
  },

  // Mars moons
  phobos: {
    name: 'Phobos',
    parentPlanet: 'mars',
    semiMajorAxis: 0.0000627, // 9,376 km
    eccentricity: 0.0151,
    orbitalPeriod: 0.319,
    radius: 11.1,
    mass: 1.0659e16,
    color: '#8B7355'
  },
  deimos: {
    name: 'Deimos',
    parentPlanet: 'mars',
    semiMajorAxis: 0.000157, // 23,460 km
    eccentricity: 0.0002,
    orbitalPeriod: 1.263,
    radius: 6.2,
    mass: 1.4762e15,
    color: '#A0826D'
  },

  // Jupiter's Galilean moons
  io: {
    name: 'Io',
    parentPlanet: 'jupiter',
    semiMajorAxis: 0.00282, // 421,800 km
    eccentricity: 0.0041,
    orbitalPeriod: 1.769,
    radius: 1821.6,
    mass: 8.9319e22,
    color: '#FFFF66'
  },
  europa: {
    name: 'Europa',
    parentPlanet: 'jupiter',
    semiMajorAxis: 0.00449, // 671,100 km
    eccentricity: 0.0094,
    orbitalPeriod: 3.551,
    radius: 1560.8,
    mass: 4.7998e22,
    color: '#D9D9D9'
  },
  ganymede: {
    name: 'Ganymede',
    parentPlanet: 'jupiter',
    semiMajorAxis: 0.00716, // 1,070,400 km
    eccentricity: 0.0013,
    orbitalPeriod: 7.155,
    radius: 2634.1,
    mass: 1.4819e23,
    color: '#C4B5A0'
  },
  callisto: {
    name: 'Callisto',
    parentPlanet: 'jupiter',
    semiMajorAxis: 0.01259, // 1,882,700 km
    eccentricity: 0.0074,
    orbitalPeriod: 16.689,
    radius: 2410.3,
    mass: 1.0759e23,
    color: '#7A6F5D'
  },

  // Saturn's major moons
  titan: {
    name: 'Titan',
    parentPlanet: 'saturn',
    semiMajorAxis: 0.00818, // 1,221,870 km
    eccentricity: 0.0288,
    orbitalPeriod: 15.945,
    radius: 2574.7,
    mass: 1.3452e23,
    color: '#FFA500'
  },
  rhea: {
    name: 'Rhea',
    parentPlanet: 'saturn',
    semiMajorAxis: 0.00352, // 527,108 km
    eccentricity: 0.0012,
    orbitalPeriod: 4.518,
    radius: 763.8,
    mass: 2.3065e21,
    color: '#E8E8E8'
  },

  // Uranus's major moons
  titania: {
    name: 'Titania',
    parentPlanet: 'uranus',
    semiMajorAxis: 0.00291, // 435,910 km
    eccentricity: 0.0011,
    orbitalPeriod: 8.706,
    radius: 788.4,
    mass: 3.527e21,
    color: '#D3D3D3'
  },
  oberon: {
    name: 'Oberon',
    parentPlanet: 'uranus',
    semiMajorAxis: 0.00390, // 583,520 km
    eccentricity: 0.0014,
    orbitalPeriod: 13.463,
    radius: 761.4,
    mass: 3.014e21,
    color: '#BEBEBE'
  },

  // Neptune's major moon
  triton: {
    name: 'Triton',
    parentPlanet: 'neptune',
    semiMajorAxis: 0.00237, // 354,759 km
    eccentricity: 0.000016,
    orbitalPeriod: 5.877,
    radius: 1353.4,
    mass: 2.14e22,
    color: '#F0E68C'
  }
}

// Helper functions
export function getPlanetsByGroup(group: PlanetGroup): PlanetOrbitalData[] {
  return Object.values(PLANET_DATA).filter(p => p.group === group)
}

export function getPlanetsByType(type: PlanetType): PlanetOrbitalData[] {
  return Object.values(PLANET_DATA).filter(p => p.type === type)
}

export function getInnerPlanets(): PlanetOrbitalData[] {
  return getPlanetsByGroup('inner')
}

export function getOuterPlanets(): PlanetOrbitalData[] {
  return getPlanetsByGroup('outer')
}
