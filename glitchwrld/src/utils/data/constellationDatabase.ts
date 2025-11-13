/**
 * Constellation Database
 *
 * Contains constellation patterns from both Western and Eastern astronomical traditions
 * Each constellation includes star positions, connections, and mythological stories
 */

import * as THREE from 'three'

export interface ConstellationStar {
  /** Position relative to constellation center */
  position: [number, number, number]
  /** Star brightness (0-1, where 1 is brightest) */
  magnitude: number
  /** Star name (optional) */
  name?: string
  /** Star color in hex */
  color?: string
}

export interface ConstellationLine {
  /** Index of first star */
  from: number
  /** Index of second star */
  to: number
}

export interface Constellation {
  /** Constellation identifier */
  id: string
  /** Display name */
  name: string
  /** Tradition origin */
  tradition: 'western' | 'eastern' | 'zodiac'
  /** Mythological story */
  mythology: string
  /** Stars in the constellation */
  stars: ConstellationStar[]
  /** Lines connecting stars */
  connections: ConstellationLine[]
  /** Overall constellation color theme */
  accentColor: string
  /** Season association (for eastern traditions) */
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  /** Direction association (for eastern traditions) */
  direction?: 'north' | 'south' | 'east' | 'west'
  /** Sky position hint (right ascension in hours, declination in degrees) */
  skyPosition?: { ra: number; dec: number }
}

/**
 * Western Constellations - Major recognizable patterns
 */
export const WESTERN_CONSTELLATIONS: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion the Hunter',
    tradition: 'western',
    mythology: 'Orion was a legendary Greek hunter of great strength and skill. After boasting he could kill any beast on Earth, the goddess Gaia sent a scorpion to humble him. Zeus placed both in the stars, forever chasing across the night sky.',
    accentColor: '#4da6ff',
    skyPosition: { ra: 5.5, dec: 5 },
    stars: [
      // Belt stars (most recognizable)
      { position: [0, 0, 0], magnitude: 1.0, name: 'Alnilam', color: '#b0e0e6' },
      { position: [-1.2, 0, 0], magnitude: 0.9, name: 'Alnitak', color: '#add8e6' },
      { position: [1.2, 0, 0], magnitude: 0.9, name: 'Mintaka', color: '#add8e6' },

      // Shoulders
      { position: [-1.5, 2.5, 0], magnitude: 0.95, name: 'Betelgeuse', color: '#ff6b6b' },
      { position: [1.8, 2.3, 0], magnitude: 0.85, name: 'Bellatrix', color: '#87ceeb' },

      // Feet
      { position: [-0.8, -2.2, 0], magnitude: 0.8, name: 'Rigel', color: '#b0e0e6' },
      { position: [0.9, -2.0, 0], magnitude: 0.7, name: 'Saiph', color: '#add8e6' },

      // Sword stars
      { position: [0, -0.8, 0], magnitude: 0.6, name: 'Orion Nebula', color: '#ff69b4' },
      { position: [0.2, -1.2, 0], magnitude: 0.5, color: '#dda0dd' },
    ],
    connections: [
      // Belt
      { from: 0, to: 1 },
      { from: 0, to: 2 },

      // Body outline
      { from: 1, to: 3 }, // Left shoulder to belt
      { from: 2, to: 4 }, // Right shoulder to belt
      { from: 1, to: 5 }, // Left belt to left foot
      { from: 2, to: 6 }, // Right belt to right foot
      { from: 3, to: 4 }, // Shoulders
      { from: 5, to: 6 }, // Feet

      // Sword
      { from: 0, to: 7 },
      { from: 7, to: 8 },
    ]
  },

  {
    id: 'ursa-major',
    name: 'Ursa Major - The Great Bear',
    tradition: 'western',
    mythology: 'Callisto, a beautiful nymph, caught Zeus\'s eye. To protect her from Hera\'s jealousy, Zeus transformed her into a bear. When her son Arcas nearly killed her while hunting, Zeus placed them both in the sky as Ursa Major and Ursa Minor.',
    accentColor: '#ffd700',
    skyPosition: { ra: 11, dec: 50 },
    stars: [
      // Big Dipper bowl
      { position: [0, 0, 0], magnitude: 0.9, name: 'Dubhe', color: '#ffd700' },
      { position: [1.5, 0, 0], magnitude: 0.85, name: 'Merak', color: '#ffd700' },
      { position: [1.8, -1.2, 0], magnitude: 0.8, name: 'Phecda', color: '#ffdf00' },
      { position: [0.3, -1.3, 0], magnitude: 0.75, name: 'Megrez', color: '#ffdf00' },

      // Handle
      { position: [-0.5, -2.0, 0], magnitude: 0.8, name: 'Alioth', color: '#ffd700' },
      { position: [-1.2, -3.2, 0], magnitude: 0.75, name: 'Mizar', color: '#ffd700' },
      { position: [-1.4, -4.2, 0], magnitude: 0.7, name: 'Alkaid', color: '#ffdf00' },

      // Body stars
      { position: [-1.5, 0.5, 0], magnitude: 0.5, color: '#ffd700' },
      { position: [-2.0, -1.0, 0], magnitude: 0.5, color: '#ffdf00' },
    ],
    connections: [
      // Dipper bowl
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },

      // Handle
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },

      // Bear body
      { from: 0, to: 7 },
      { from: 7, to: 8 },
    ]
  },

  {
    id: 'cassiopeia',
    name: 'Cassiopeia - The Vain Queen',
    tradition: 'western',
    mythology: 'Queen Cassiopeia boasted of her beauty, claiming to surpass even the sea nymphs. As punishment for her vanity, she was chained to her throne and placed in the heavens, condemned to circle the pole upside-down for eternity.',
    accentColor: '#ff69b4',
    skyPosition: { ra: 1, dec: 60 },
    stars: [
      // W shape
      { position: [0, 0, 0], magnitude: 0.9, name: 'Schedar', color: '#ff69b4' },
      { position: [1.2, -1.0, 0], magnitude: 0.85, name: 'Caph', color: '#ff69b4' },
      { position: [2.2, 0.2, 0], magnitude: 0.95, name: 'Gamma Cas', color: '#ffc0cb' },
      { position: [3.3, -0.8, 0], magnitude: 0.8, name: 'Ruchbah', color: '#ff69b4' },
      { position: [4.3, 0.3, 0], magnitude: 0.75, name: 'Segin', color: '#ffc0cb' },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ]
  },
]

/**
 * Zodiac Constellations - The celestial band through which Sun, Moon, and planets travel
 */
export const ZODIAC_CONSTELLATIONS: Constellation[] = [
  {
    id: 'leo',
    name: 'Leo the Lion',
    tradition: 'zodiac',
    mythology: 'Leo represents the Nemean Lion, a fearsome beast with impenetrable golden fur. Heracles defeated it as his first labor, strangling the beast with his bare hands when weapons proved useless.',
    accentColor: '#ffaa00',
    skyPosition: { ra: 10.5, dec: 15 },
    stars: [
      // Sickle (head)
      { position: [0, 2, 0], magnitude: 1.0, name: 'Regulus', color: '#ffaa00' },
      { position: [-0.5, 2.8, 0], magnitude: 0.7, name: 'Eta Leonis', color: '#ffbb33' },
      { position: [-0.8, 3.5, 0], magnitude: 0.6, name: 'Gamma Leonis', color: '#ffaa00' },
      { position: [-0.3, 4.0, 0], magnitude: 0.5, name: 'Zeta Leonis', color: '#ffbb33' },

      // Body
      { position: [1.8, 1.5, 0], magnitude: 0.75, name: 'Denebola', color: '#ffaa00' },
      { position: [1.0, 0.8, 0], magnitude: 0.65, name: 'Beta Leonis', color: '#ffbb33' },
      { position: [0.5, 0.2, 0], magnitude: 0.6, name: 'Delta Leonis', color: '#ffaa00' },
    ],
    connections: [
      // Sickle
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },

      // Body
      { from: 0, to: 6 },
      { from: 6, to: 5 },
      { from: 5, to: 4 },
    ]
  },

  {
    id: 'aries',
    name: 'Aries the Ram',
    tradition: 'zodiac',
    mythology: 'Aries represents the ram with the golden fleece, sent by Hermes to save Phrixus and Helle. The quest for this golden fleece became the legendary adventure of Jason and the Argonauts.',
    accentColor: '#ff4444',
    skyPosition: { ra: 2.5, dec: 20 },
    stars: [
      { position: [0, 0, 0], magnitude: 0.9, name: 'Hamal', color: '#ff4444' },
      { position: [1.5, -0.5, 0], magnitude: 0.75, name: 'Sheratan', color: '#ff6666' },
      { position: [2.2, 0.3, 0], magnitude: 0.65, name: 'Mesarthim', color: '#ff4444' },
      { position: [0.8, 0.8, 0], magnitude: 0.5, color: '#ff6666' },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 0, to: 3 },
    ]
  },
]

/**
 * Eastern Constellations - Chinese Four Symbols system
 */
export const EASTERN_CONSTELLATIONS: Constellation[] = [
  {
    id: 'azure-dragon',
    name: 'Azure Dragon (Qīng Lóng)',
    tradition: 'eastern',
    mythology: 'The Azure Dragon guards the East and represents spring, growth, and new beginnings. It consists of seven mansions that form the shape of a celestial dragon bringing rain and prosperity.',
    accentColor: '#00ced1',
    season: 'spring',
    direction: 'east',
    skyPosition: { ra: 10, dec: -20 },
    stars: [
      // Dragon head
      { position: [0, 0, 0], magnitude: 0.95, name: 'Spica (角宿)', color: '#00ced1' },
      { position: [0.8, 0.5, 0], magnitude: 0.7, color: '#00ffff' },

      // Neck
      { position: [1.5, 1.2, 0], magnitude: 0.75, name: '亢宿', color: '#00ced1' },
      { position: [2.0, 1.8, 0], magnitude: 0.65, color: '#40e0d0' },

      // Body segments
      { position: [2.5, 2.5, 0], magnitude: 0.8, name: '氐宿', color: '#00ced1' },
      { position: [3.2, 3.0, 0], magnitude: 0.7, name: 'Antares (心宿)', color: '#ff6347' },
      { position: [4.0, 3.2, 0], magnitude: 0.75, color: '#00ced1' },

      // Tail
      { position: [4.8, 3.0, 0], magnitude: 0.65, name: '尾宿', color: '#40e0d0' },
      { position: [5.5, 2.5, 0], magnitude: 0.6, name: '箕宿', color: '#00ced1' },
      { position: [6.0, 2.0, 0], magnitude: 0.5, color: '#40e0d0' },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
    ]
  },

  {
    id: 'vermilion-bird',
    name: 'Vermilion Bird (Zhū Què)',
    tradition: 'eastern',
    mythology: 'The Vermilion Bird soars in the South, embodying summer, fire, and transformation. This celestial phoenix represents rebirth and consists of seven mansions spreading its wings across the southern sky.',
    accentColor: '#ff4500',
    season: 'summer',
    direction: 'south',
    skyPosition: { ra: 18, dec: -30 },
    stars: [
      // Central body
      { position: [0, 0, 0], magnitude: 0.9, name: '星宿', color: '#ff4500' },
      { position: [0, -0.8, 0], magnitude: 0.8, color: '#ff6347' },

      // Left wing
      { position: [-1.5, 0.5, 0], magnitude: 0.75, name: '井宿', color: '#ff4500' },
      { position: [-2.5, 1.0, 0], magnitude: 0.65, color: '#ff6347' },
      { position: [-3.2, 1.3, 0], magnitude: 0.6, color: '#ff7f50' },

      // Right wing
      { position: [1.5, 0.5, 0], magnitude: 0.75, name: '柳宿', color: '#ff4500' },
      { position: [2.5, 1.0, 0], magnitude: 0.65, color: '#ff6347' },
      { position: [3.2, 1.3, 0], magnitude: 0.6, color: '#ff7f50' },

      // Tail feathers
      { position: [0, -1.8, 0], magnitude: 0.7, name: '張宿', color: '#ff4500' },
      { position: [0.5, -2.5, 0], magnitude: 0.6, color: '#ff6347' },
    ],
    connections: [
      // Body
      { from: 0, to: 1 },
      { from: 1, to: 8 },
      { from: 8, to: 9 },

      // Left wing
      { from: 0, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },

      // Right wing
      { from: 0, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
    ]
  },

  {
    id: 'white-tiger',
    name: 'White Tiger (Bái Hǔ)',
    tradition: 'eastern',
    mythology: 'The White Tiger prowls the West, guardian of autumn and keeper of cosmic balance. This celestial beast embodies strength and justice, with seven mansions forming its powerful frame.',
    accentColor: '#e8e8e8',
    season: 'autumn',
    direction: 'west',
    skyPosition: { ra: 4, dec: 10 },
    stars: [
      // Head
      { position: [0, 1.5, 0], magnitude: 0.85, name: '奎宿', color: '#ffffff' },
      { position: [0.5, 1.0, 0], magnitude: 0.75, color: '#f0f0f0' },

      // Body
      { position: [1.0, 0.5, 0], magnitude: 0.8, name: '婁宿', color: '#e8e8e8' },
      { position: [1.8, 0, 0], magnitude: 0.75, name: 'Pleiades (昴宿)', color: '#87ceeb' },
      { position: [2.5, -0.3, 0], magnitude: 0.7, name: '畢宿', color: '#e8e8e8' },

      // Legs
      { position: [0.8, -1.0, 0], magnitude: 0.65, color: '#f0f0f0' },
      { position: [2.0, -1.2, 0], magnitude: 0.65, color: '#f0f0f0' },

      // Tail
      { position: [3.2, 0.2, 0], magnitude: 0.6, name: '參宿', color: '#e8e8e8' },
      { position: [3.8, 0.5, 0], magnitude: 0.55, color: '#f0f0f0' },
    ],
    connections: [
      // Head to body
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 7 },
      { from: 7, to: 8 },

      // Legs
      { from: 2, to: 5 },
      { from: 4, to: 6 },
    ]
  },

  {
    id: 'black-tortoise',
    name: 'Black Tortoise (Xuán Wǔ)',
    tradition: 'eastern',
    mythology: 'The Black Tortoise dwells in the North, embodying winter, water, and wisdom. This ancient creature combines a tortoise and serpent, representing longevity and protection through seven northern mansions.',
    accentColor: '#1a1a2e',
    season: 'winter',
    direction: 'north',
    skyPosition: { ra: 20, dec: 20 },
    stars: [
      // Tortoise shell center
      { position: [0, 0, 0], magnitude: 0.8, name: '斗宿', color: '#4a4a6a' },

      // Shell outline
      { position: [-1.0, 0.8, 0], magnitude: 0.7, name: '女宿', color: '#3a3a5a' },
      { position: [1.0, 0.8, 0], magnitude: 0.7, name: '虛宿', color: '#3a3a5a' },
      { position: [-1.2, -0.8, 0], magnitude: 0.65, name: '危宿', color: '#4a4a6a' },
      { position: [1.2, -0.8, 0], magnitude: 0.65, name: '室宿', color: '#4a4a6a' },

      // Serpent (intertwined)
      { position: [-2.0, 0, 0], magnitude: 0.6, name: '壁宿', color: '#5a5a7a' },
      { position: [-1.5, -1.5, 0], magnitude: 0.6, color: '#5a5a7a' },
      { position: [1.5, -1.5, 0], magnitude: 0.6, name: '牛宿', color: '#5a5a7a' },
      { position: [2.0, 0, 0], magnitude: 0.6, color: '#5a5a7a' },
    ],
    connections: [
      // Shell
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 2 },
      { from: 3, to: 4 },

      // Serpent
      { from: 1, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 3 },
      { from: 2, to: 8 },
      { from: 8, to: 7 },
      { from: 7, to: 4 },
    ]
  },
]

/**
 * Get all constellations combined
 */
export function getAllConstellations(): Constellation[] {
  return [
    ...WESTERN_CONSTELLATIONS,
    ...ZODIAC_CONSTELLATIONS,
    ...EASTERN_CONSTELLATIONS,
  ]
}

/**
 * Get constellation by ID
 */
export function getConstellationById(id: string): Constellation | undefined {
  return getAllConstellations().find(c => c.id === id)
}

/**
 * Get constellations by tradition
 */
export function getConstellationsByTradition(tradition: 'western' | 'eastern' | 'zodiac'): Constellation[] {
  return getAllConstellations().filter(c => c.tradition === tradition)
}

/**
 * Calculate total star count across all constellations
 */
export function getTotalConstellationStars(): number {
  return getAllConstellations().reduce((total, constellation) => {
    return total + constellation.stars.length
  }, 0)
}
