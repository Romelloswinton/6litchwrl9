/**
 * Orbital Mechanics - Implementation of Kepler's Laws
 * For realistic elliptical planetary orbits
 */

import { SCALE_FACTORS } from './PlanetData'
import type { PlanetOrbitalData } from './PlanetData'

export interface OrbitalPosition {
  x: number
  y: number
  z: number
}

export interface OrbitalState {
  position: OrbitalPosition
  velocity: OrbitalPosition
  trueAnomaly: number // Current angle in orbit (radians)
  meanAnomaly: number  // Average angle
  eccentricAnomaly: number // Intermediate calculation
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calculate Mean Anomaly from time
 *
 * Kepler's Laws:
 * - Mean Anomaly (M) = 2π * t / T
 * where t = time elapsed, T = orbital period
 */
export function calculateMeanAnomaly(time: number, orbitalPeriod: number): number {
  const T = orbitalPeriod * (SCALE_FACTORS.YEAR_TO_SECONDS / 365.26) // Convert to animation time
  return (2 * Math.PI * time / T) % (2 * Math.PI)
}

/**
 * Solve Kepler's Equation for Eccentric Anomaly
 *
 * M = E - e * sin(E)
 *
 * We solve for E using Newton-Raphson iteration
 */
export function solveKeplerEquation(
  meanAnomaly: number,
  eccentricity: number,
  tolerance: number = 1e-6,
  maxIterations: number = 20
): number {
  let E = meanAnomaly // Initial guess
  let iterations = 0

  while (iterations < maxIterations) {
    const f = E - eccentricity * Math.sin(E) - meanAnomaly
    const fPrime = 1 - eccentricity * Math.cos(E)
    const delta = f / fPrime

    E = E - delta

    if (Math.abs(delta) < tolerance) {
      break
    }

    iterations++
  }

  return E
}

/**
 * Calculate True Anomaly from Eccentric Anomaly
 *
 * tan(ν/2) = sqrt((1+e)/(1-e)) * tan(E/2)
 */
export function calculateTrueAnomaly(eccentricAnomaly: number, eccentricity: number): number {
  const term = Math.sqrt((1 + eccentricity) / (1 - eccentricity))
  const trueAnomaly = 2 * Math.atan(term * Math.tan(eccentricAnomaly / 2))
  return trueAnomaly
}

/**
 * Calculate orbital radius at given true anomaly
 *
 * r = a(1 - e²) / (1 + e*cos(ν))
 *
 * This is the ellipse equation in polar form
 */
export function calculateOrbitalRadius(
  semiMajorAxis: number,
  eccentricity: number,
  trueAnomaly: number
): number {
  const numerator = semiMajorAxis * (1 - eccentricity * eccentricity)
  const denominator = 1 + eccentricity * Math.cos(trueAnomaly)
  return numerator / denominator
}

/**
 * Calculate 3D position in orbit
 *
 * Converts from orbital plane (2D) to 3D space coordinates
 * accounting for orbital inclination and orientation
 */
export function calculateOrbitalPosition(
  planetData: PlanetOrbitalData,
  time: number
): OrbitalState {
  // Step 1: Calculate Mean Anomaly
  const M = calculateMeanAnomaly(time * SCALE_FACTORS.TIME_MULTIPLIER, planetData.orbitalPeriod)

  // Step 2: Solve for Eccentric Anomaly
  const E = solveKeplerEquation(M, planetData.eccentricity)

  // Step 3: Calculate True Anomaly
  const nu = calculateTrueAnomaly(E, planetData.eccentricity)

  // Step 4: Calculate orbital radius
  const a = planetData.semiMajorAxis * SCALE_FACTORS.AU_TO_UNITS
  const r = calculateOrbitalRadius(planetData.semiMajorAxis, planetData.eccentricity, nu) * SCALE_FACTORS.AU_TO_UNITS

  // Step 5: Convert to 3D coordinates
  // First, calculate position in orbital plane
  const argPerihelion = degToRad(planetData.argumentOfPerihelion)
  const inclination = degToRad(planetData.orbitalInclination)
  const ascendingNode = degToRad(planetData.longitudeOfAscendingNode)

  // Angle in orbit (true anomaly + argument of perihelion)
  const theta = nu + argPerihelion

  // Position in orbital plane
  const xOrbital = r * Math.cos(theta)
  const yOrbital = r * Math.sin(theta)

  // Rotate to account for inclination and ascending node
  // Using 3D rotation matrices
  const x = xOrbital * (Math.cos(ascendingNode) * Math.cos(argPerihelion) - Math.sin(ascendingNode) * Math.sin(argPerihelion) * Math.cos(inclination)) -
            yOrbital * (Math.cos(ascendingNode) * Math.sin(argPerihelion) + Math.sin(ascendingNode) * Math.cos(argPerihelion) * Math.cos(inclination))

  const z = xOrbital * (Math.sin(ascendingNode) * Math.cos(argPerihelion) + Math.cos(ascendingNode) * Math.sin(argPerihelion) * Math.cos(inclination)) -
            yOrbital * (Math.sin(ascendingNode) * Math.sin(argPerihelion) - Math.cos(ascendingNode) * Math.cos(argPerihelion) * Math.cos(inclination))

  const y = xOrbital * (Math.sin(argPerihelion) * Math.sin(inclination)) +
            yOrbital * (Math.cos(argPerihelion) * Math.sin(inclination))

  return {
    position: { x, y, z },
    velocity: { x: 0, y: 0, z: 0 }, // Can be calculated if needed
    trueAnomaly: nu,
    meanAnomaly: M,
    eccentricAnomaly: E
  }
}

/**
 * Calculate planet scale based on real radius
 * Uses logarithmic scaling to keep smaller planets visible
 */
export function calculatePlanetScale(radiusKm: number): number {
  const { SIZE_SCALE, SIZE_EXPONENT, MIN_PLANET_SIZE, MAX_PLANET_SIZE } = SCALE_FACTORS

  // Logarithmic scaling
  const scale = SIZE_SCALE * Math.pow(radiusKm, SIZE_EXPONENT)

  // Clamp to min/max
  return Math.max(MIN_PLANET_SIZE, Math.min(MAX_PLANET_SIZE, scale))
}

/**
 * Generate points along an elliptical orbit path
 * Useful for visualization/debugging
 */
export function generateOrbitPath(
  planetData: PlanetOrbitalData,
  numPoints: number = 360
): OrbitalPosition[] {
  const points: OrbitalPosition[] = []

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI
    const r = calculateOrbitalRadius(planetData.semiMajorAxis, planetData.eccentricity, angle) * SCALE_FACTORS.AU_TO_UNITS

    const argPerihelion = degToRad(planetData.argumentOfPerihelion)
    const inclination = degToRad(planetData.orbitalInclination)
    const ascendingNode = degToRad(planetData.longitudeOfAscendingNode)

    const theta = angle + argPerihelion

    const xOrbital = r * Math.cos(theta)
    const yOrbital = r * Math.sin(theta)

    const x = xOrbital * (Math.cos(ascendingNode) * Math.cos(argPerihelion) - Math.sin(ascendingNode) * Math.sin(argPerihelion) * Math.cos(inclination)) -
              yOrbital * (Math.cos(ascendingNode) * Math.sin(argPerihelion) + Math.sin(ascendingNode) * Math.cos(argPerihelion) * Math.cos(inclination))

    const z = xOrbital * (Math.sin(ascendingNode) * Math.cos(argPerihelion) + Math.cos(ascendingNode) * Math.sin(argPerihelion) * Math.cos(inclination)) -
              yOrbital * (Math.sin(ascendingNode) * Math.sin(argPerihelion) - Math.cos(ascendingNode) * Math.cos(argPerihelion) * Math.cos(inclination))

    const y = xOrbital * (Math.sin(argPerihelion) * Math.sin(inclination)) +
              yOrbital * (Math.cos(argPerihelion) * Math.sin(inclination))

    points.push({ x, y, z })
  }

  return points
}

/**
 * Kepler's Third Law: T² = a³
 * Verify orbital period matches semi-major axis
 */
export function verifyKeplersThirdLaw(semiMajorAxisAU: number, orbitalPeriodDays: number): number {
  const a3 = Math.pow(semiMajorAxisAU, 3)
  const T2 = Math.pow(orbitalPeriodDays / 365.26, 2)
  const ratio = T2 / a3

  // For our solar system, this should be very close to 1.0
  return ratio
}
