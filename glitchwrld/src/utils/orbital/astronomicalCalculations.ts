/**
 * Astronomical calculations for real-time planet positions
 * Based on simplified Keplerian orbital mechanics
 *
 * This calculates the actual position of planets in their orbits
 * based on the current date/time when the user visits the site.
 */

import { PLANET_DATA, PlanetOrbitalData } from './PlanetData'

/**
 * J2000 Epoch: January 1, 2000, 12:00 TT (Terrestrial Time)
 * This is the standard reference epoch for astronomical calculations
 */
const J2000_EPOCH = new Date('2000-01-01T12:00:00Z').getTime()

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate Julian Date from JavaScript Date object
 * Julian Date is the number of days since January 1, 4713 BCE
 */
export function getJulianDate(date: Date = new Date()): number {
  const time = date.getTime()
  // Convert milliseconds to days and add Julian Date at Unix epoch
  const unixEpochJD = 2440587.5 // Julian Date at Unix epoch (Jan 1, 1970)
  const daysSinceUnixEpoch = time / (1000 * 60 * 60 * 24)
  return unixEpochJD + daysSinceUnixEpoch
}

/**
 * Calculate days since J2000 epoch
 */
export function getDaysSinceJ2000(date: Date = new Date()): number {
  const j2000JD = 2451545.0 // Julian Date of J2000 epoch
  return getJulianDate(date) - j2000JD
}

/**
 * Calculate Mean Anomaly (position in orbit)
 * M = M0 + n * t
 * where:
 *   M0 = mean anomaly at epoch (we'll use 0 for simplicity)
 *   n = mean motion (2π / orbital period)
 *   t = time since epoch
 */
function calculateMeanAnomaly(
  orbitalPeriod: number,
  daysSinceEpoch: number,
  epochAnomaly: number = 0
): number {
  const meanMotion = (2 * Math.PI) / orbitalPeriod // radians per day
  const meanAnomaly = epochAnomaly + meanMotion * daysSinceEpoch

  // Normalize to 0-2π range
  return meanAnomaly % (2 * Math.PI)
}

/**
 * Solve Kepler's Equation to get Eccentric Anomaly
 * M = E - e * sin(E)
 * Uses Newton-Raphson iteration
 */
function solveKeplersEquation(
  meanAnomaly: number,
  eccentricity: number,
  tolerance: number = 1e-6
): number {
  let E = meanAnomaly // Initial guess
  let delta = 1
  let iterations = 0
  const maxIterations = 100

  while (Math.abs(delta) > tolerance && iterations < maxIterations) {
    const f = E - eccentricity * Math.sin(E) - meanAnomaly
    const fPrime = 1 - eccentricity * Math.cos(E)
    delta = f / fPrime
    E = E - delta
    iterations++
  }

  return E
}

/**
 * Calculate True Anomaly from Eccentric Anomaly
 * This gives us the actual angle of the planet in its orbit
 */
function calculateTrueAnomaly(
  eccentricAnomaly: number,
  eccentricity: number
): number {
  const tanHalfTrue = Math.sqrt((1 + eccentricity) / (1 - eccentricity)) *
                      Math.tan(eccentricAnomaly / 2)
  return 2 * Math.atan(tanHalfTrue)
}

/**
 * Calculate heliocentric distance (distance from Sun)
 * r = a * (1 - e * cos(E))
 */
function calculateHeliocentricDistance(
  semiMajorAxis: number,
  eccentricity: number,
  eccentricAnomaly: number
): number {
  return semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly))
}

/**
 * Calculate 3D position in orbital plane
 */
interface OrbitalPosition {
  x: number
  y: number
  z: number
  distance: number
  trueAnomaly: number
  meanAnomaly: number
}

/**
 * Calculate the actual position of a planet in 3D space
 * Returns position in Astronomical Units (AU)
 */
export function calculatePlanetPosition(
  planetData: PlanetOrbitalData,
  date: Date = new Date()
): OrbitalPosition {
  const daysSinceEpoch = getDaysSinceJ2000(date)

  // Step 1: Calculate Mean Anomaly
  const meanAnomaly = calculateMeanAnomaly(
    planetData.orbitalPeriod,
    daysSinceEpoch
  )

  // Step 2: Solve Kepler's equation for Eccentric Anomaly
  const eccentricAnomaly = solveKeplersEquation(
    meanAnomaly,
    planetData.eccentricity
  )

  // Step 3: Calculate True Anomaly
  const trueAnomaly = calculateTrueAnomaly(
    eccentricAnomaly,
    planetData.eccentricity
  )

  // Step 4: Calculate distance from Sun
  const distance = calculateHeliocentricDistance(
    planetData.semiMajorAxis,
    planetData.eccentricity,
    eccentricAnomaly
  )

  // Step 5: Calculate position in orbital plane
  // Add argument of perihelion to get correct orientation
  const longitudeInOrbit = trueAnomaly + degreesToRadians(planetData.argumentOfPerihelion)

  // Position in orbital plane (before applying inclination)
  const xOrbital = distance * Math.cos(longitudeInOrbit)
  const yOrbital = distance * Math.sin(longitudeInOrbit)

  // Step 6: Apply orbital inclination and longitude of ascending node
  const inclination = degreesToRadians(planetData.orbitalInclination)
  const ascendingNode = degreesToRadians(planetData.longitudeOfAscendingNode)

  // Rotation matrices to transform from orbital plane to ecliptic plane
  // This is simplified - for our visualization we keep it mostly in XZ plane
  const x = xOrbital * Math.cos(ascendingNode) - yOrbital * Math.sin(ascendingNode) * Math.cos(inclination)
  const y = yOrbital * Math.sin(inclination) // Vertical component (minimal for low inclinations)
  const z = xOrbital * Math.sin(ascendingNode) + yOrbital * Math.cos(ascendingNode) * Math.cos(inclination)

  return {
    x,
    y,
    z,
    distance,
    trueAnomaly,
    meanAnomaly
  }
}

/**
 * Calculate positions for all planets
 */
export function calculateAllPlanetPositions(date: Date = new Date()): Record<string, OrbitalPosition> {
  const positions: Record<string, OrbitalPosition> = {}

  for (const [key, planetData] of Object.entries(PLANET_DATA)) {
    positions[key] = calculatePlanetPosition(planetData, date)
  }

  return positions
}

/**
 * Calculate the orbital angle (0-2π) from position
 * This is used to initialize the animation at the correct point
 */
export function getOrbitalAngleFromPosition(position: OrbitalPosition): number {
  // Use the true anomaly plus argument of perihelion for the actual angle
  return position.trueAnomaly
}

/**
 * Format date for display
 */
export function formatAstronomicalDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0] + ' ' +
         date.toTimeString().split(' ')[0] + ' UTC'
}

/**
 * Get a human-readable summary of planetary positions
 */
export function getPlanetaryPositionSummary(date: Date = new Date()): string {
  const positions = calculateAllPlanetPositions(date)
  const daysSinceEpoch = getDaysSinceJ2000(date)

  let summary = `Planetary Positions at ${formatAstronomicalDate(date)}\n`
  summary += `(${daysSinceEpoch.toFixed(2)} days since J2000 epoch)\n\n`

  for (const [key, pos] of Object.entries(positions)) {
    const planet = PLANET_DATA[key]
    const angleInDegrees = (pos.trueAnomaly * 180 / Math.PI).toFixed(1)
    summary += `${planet.name}: ${angleInDegrees}° (${pos.distance.toFixed(3)} AU)\n`
  }

  return summary
}
