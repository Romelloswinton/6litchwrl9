/**
 * Multi-Perspective Planet Data
 * Different lenses through which to view each celestial body
 * Users can choose their preferred perspective for learning
 */

export interface PlanetPerspective {
  perspective: 'scientific' | 'mythological' | 'poetic' | 'personal'
  title: string
  icon: string
  content: string
  highlights: string[]
}

export interface MultiPerspectivePlanet {
  name: string
  symbol: string
  color: string
  perspectives: PlanetPerspective[]
}

export const MULTI_PERSPECTIVE_PLANETS: Record<string, MultiPerspectivePlanet> = {
  sun: {
    name: 'Sun',
    symbol: '☉',
    color: '#FDB813',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'The Sun is a G-type main-sequence star (G2V) that formed approximately 4.6 billion years ago. It contains 99.86% of the solar system\'s mass and generates energy through nuclear fusion, converting 600 million tons of hydrogen into helium every second. Surface temperature: 5,778 K.',
        highlights: ['Main-sequence star', 'Nuclear fusion reactor', '1.4 million km diameter', '93 million miles from Earth']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Ra sailed across the sky in his solar barque, battling the serpent of chaos each night. Helios drove his golden chariot from east to west. Sol Invictus, the unconquered sun, represented imperial power. Cultures worldwide worshipped the Sun as the supreme deity—source of all life and cosmic order.',
        highlights: ['Ra (Egypt)', 'Helios (Greece)', 'Sol (Rome)', 'Amaterasu (Japan)']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'A burning heart at the center of everything, the Sun is the golden thread that weaves all life together. It rises each morning like a promise kept, spilling light across the darkness with reckless generosity. We are children of this star, made from its ancient fire, dancing in its warmth.',
        highlights: ['Cosmic heartbeat', 'Source of all energy', 'Daily resurrection', 'Life-giver']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'The Sun asks: Who are you when no one is watching? It represents your authentic self—the core identity beneath all masks and roles. When you shine your light without apology, you give others permission to do the same. Your Sun sign shows the hero\'s journey you came here to walk.',
        highlights: ['Authentic self', 'Creative expression', 'Life purpose', 'Conscious ego']
      }
    ]
  },

  mercury: {
    name: 'Mercury',
    symbol: '☿',
    color: '#8C7853',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Mercury is the smallest planet and closest to the Sun, with extreme temperature variations from 430°C (day) to -180°C (night). It has a large iron core comprising 75% of its radius, creating a magnetic field. One day on Mercury lasts 176 Earth days, while one year is only 88 Earth days.',
        highlights: ['Smallest planet', 'No atmosphere', '88-day orbit', 'Extreme temperatures']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Hermes, the quicksilver messenger, wore winged sandals and could traverse between mortal and divine realms. Psychopomp and trickster, he guided souls to the underworld, invented the lyre, and stole Apollo\'s cattle on his first day of life. Thoth, his Egyptian counterpart, invented writing and measured time.',
        highlights: ['Messenger god', 'Trickster archetype', 'Psychopomp', 'Inventor of language']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Swift-footed Mercury dances on the edge of the Sun\'s fire, a silver messenger carrying thoughts between worlds. Words are spells, and Mercury is the magician who transforms invisible ideas into language. The mind at play, forever curious, forever moving, never still.',
        highlights: ['Quicksilver mind', 'Bridge between worlds', 'Eternal student', 'Word-weaver']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Mercury reveals how you think, learn, and communicate. It\'s your internal dialogue and how you process the world. A strong Mercury brings wit, adaptability, and the gift of translation. Its lesson: Listen deeply before speaking. Your words shape reality—choose them with care.',
        highlights: ['Communication style', 'Learning method', 'Mental patterns', 'Curiosity']
      }
    ]
  },

  venus: {
    name: 'Venus',
    symbol: '♀',
    color: '#E6B87E',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Venus is Earth\'s sister planet with similar size but vastly different conditions. Its thick CO2 atmosphere creates a runaway greenhouse effect with surface temperatures of 462°C—hot enough to melt lead. Sulfuric acid clouds and crushing pressure (92 atm) make it the most inhospitable planet.',
        highlights: ['Hottest planet', 'Backwards rotation', '92 bar pressure', 'Sulfuric acid rain']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Born from sea foam where Uranus\'s severed genitals fell, Aphrodite emerged fully formed and irresistibly beautiful. Goddess of love, beauty, and desire, she could make gods and mortals fall helplessly in love. Yet beneath her beauty lay dangerous power—the force that starts wars and destroys kingdoms.',
        highlights: ['Born from sea foam', 'Goddess of love', 'Irresistible beauty', 'Passionate intensity']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Venus is the morning and evening star, the first light and last light, beauty bookending the day. She is the ache of longing, the magnetism of attraction, the pleasure that makes life worth living. A burning heart wrapped in clouds of desire. Love as both gift and wound.',
        highlights: ['Morning star', 'Magnetic attraction', 'Beauty incarnate', 'Sacred pleasure']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Venus shows what you value and how you love. She reveals your aesthetic sense, relationship style, and what brings you joy. Her lesson: You attract what you believe you deserve. Self-worth determines love-worth. Learn to receive as beautifully as you give.',
        highlights: ['Values & worth', 'Love language', 'Attraction patterns', 'Pleasure & beauty']
      }
    ]
  },

  earth: {
    name: 'Earth',
    symbol: '🜨',
    color: '#4A90E2',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Earth is the only known planet with liquid water oceans (71% surface coverage) and complex life. Its magnetic field shields life from solar radiation. The planet is 4.54 billion years old, with life emerging around 3.8 billion years ago. Atmosphere: 78% nitrogen, 21% oxygen.',
        highlights: ['Only known life', 'Liquid water', 'Magnetic shield', '365.25-day orbit']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Gaia, the primordial Mother Earth, birthed the sky, mountains, and sea from her own body. She is not a goddess who rules Earth—she IS Earth. Every stone, every tree, every creature is her flesh. Indigenous cultures worldwide recognize Earth as a living, conscious being deserving of reverence.',
        highlights: ['Gaia', 'Mother goddess', 'Living being', 'Sacred ground']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Blue marble spinning in infinite darkness, cradling billions of stories. Earth is where spirit learns to be matter, where consciousness discovers what it feels like to have skin and bones. Home. The only home we\'ve ever known, suspended on a sunbeam in the cosmic ocean.',
        highlights: ['Pale blue dot', 'Island of life', 'Conscious soil', 'Our only home']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Earth reminds you that you\'re not just in a body—you ARE a body. Grounding, presence, and working with physical reality are spiritual practices. The lesson: Honor your incarnation. Take care of your vessel. Tend the garden of your life with patience and presence.',
        highlights: ['Embodiment', 'Grounding', 'Physical presence', 'Manifestation']
      }
    ]
  },

  mars: {
    name: 'Mars',
    symbol: '♂',
    color: '#CD5C5C',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Mars is a cold desert world with iron oxide dust giving it the characteristic red color. Ancient riverbeds and polar ice caps suggest water once flowed on the surface. Atmosphere is 95% CO2 at 0.6% Earth\'s pressure. Home to Olympus Mons, the solar system\'s largest volcano (21 km high).',
        highlights: ['Red planet', 'Olympus Mons', 'Ancient water', '687-day orbit']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Ares/Mars, god of war, embodied both the savage fury and protective courage of battle. Born from Hera alone (no father), he represents primal masculine energy—aggressive, competitive, passionate. His affair with Aphrodite shows the eternal dance between war and love, conflict and desire.',
        highlights: ['God of war', 'Warrior archetype', 'Primal courage', 'Protective fury']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Red planet blazing in the night like a war drum, Mars is the fire in your belly that says "Yes!" or "No!" with absolute conviction. The courage to act, to fight for what you love, to defend your boundaries. Raw desire channeled into purposeful action.',
        highlights: ['Sacred anger', 'Warrior spirit', 'Life force', 'Boundary keeper']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Mars shows how you assert yourself, pursue desires, and handle conflict. It\'s your fighting spirit and sexual energy. The lesson: Anger is information about violated boundaries. Channel your Mars energy into protection and purpose, not destruction and ego.',
        highlights: ['Assertion', 'Desire', 'Courage', 'Healthy anger']
      }
    ]
  },

  jupiter: {
    name: 'Jupiter',
    symbol: '♃',
    color: '#C88B3A',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Jupiter is the largest planet (1,300 Earths could fit inside) and essentially a failed star—mostly hydrogen and helium. Its massive gravity shields inner planets from asteroids. The Great Red Spot is a storm twice Earth\'s size that\'s lasted 400+ years. It has 95 confirmed moons.',
        highlights: ['Largest planet', 'Gas giant', '95 moons', 'Cosmic protector']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Zeus/Jupiter, king of the gods, overthrew his father Cronos to rule from Mt. Olympus. Wielding thunder and lightning, he maintained cosmic order through justice (and occasional divine intervention). As sky father, he represents authority, expansion, and the higher law that governs all things.',
        highlights: ['King of gods', 'Sky father', 'Thunder wielder', 'Divine justice']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Jupiter is the great "Yes!" to life—the optimism that keeps you reaching for more. Jovial and generous, this giant planet expands everything it touches. Faith that the universe is fundamentally abundant and meaningful. The philosopher seeking truth in the vast cosmic library.',
        highlights: ['Great benefactor', 'Eternal optimist', 'Seeker of meaning', 'Expansive grace']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Jupiter reveals your philosophy, faith, and capacity for growth. It shows where life expands naturally and where you find meaning. The lesson: Abundance comes from generosity, not hoarding. Trust life\'s flow. Sometimes the biggest risk is not taking one.',
        highlights: ['Growth & expansion', 'Philosophy', 'Faith & optimism', 'Higher meaning']
      }
    ]
  },

  saturn: {
    name: 'Saturn',
    symbol: '♄',
    color: '#F4E8C1',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Saturn is the second-largest planet, famous for its stunning ring system made of ice particles and rocks (extending 282,000 km). With a density less than water, Saturn would float in a bathtub (if you could find one big enough!). It takes 29.5 years to orbit the Sun.',
        highlights: ['Iconic rings', 'Less dense than water', '146 moons', '29.5-year orbit']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Cronos/Saturn, titan of time and harvest, devoured his children to prevent prophecy. God of agriculture, he taught humans to work the land and respect cycles of planting and reaping. His sickle cuts away what must die so new growth can emerge. Father Time, showing mortality\'s wisdom.',
        highlights: ['Lord of Time', 'Harvest god', 'Devouring father', 'Cycles & seasons']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Ringed guardian of reality, Saturn is the stern teacher who shows you the gap between dream and discipline. Time\'s patient hand, carving away illusion until only what\'s real remains. Limitations aren\'t punishment—they\'re the structure that lets you build something lasting.',
        highlights: ['Wise teacher', 'Reality principle', 'Discipline & mastery', 'Time\'s sculptor']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Saturn reveals where you face limitations, fear failure, and must develop mastery through discipline. It\'s your inner authority and capacity for commitment. The lesson: Constraints liberate. Structure creates freedom. The master was once the struggling student.',
        highlights: ['Discipline', 'Responsibility', 'Mastery', 'Inner authority']
      }
    ]
  },

  uranus: {
    name: 'Uranus',
    symbol: '♅',
    color: '#4FD0E7',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Uranus is the only planet that rotates on its side (98° axial tilt), likely from a massive collision. This ice giant is made of water, methane, and ammonia ices over a rocky core. Its pale cyan color comes from methane. It takes 84 Earth years to complete one orbit.',
        highlights: ['Sideways rotation', 'Ice giant', 'Methane atmosphere', '84-year orbit']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Uranus, primordial sky god, was castrated by his son Cronos for imprisoning his children. From his severed genitals, Aphrodite was born. He represents the original patriarchy that must be overthrown for evolution to continue. Each generation must rebel against the previous one.',
        highlights: ['Sky father', 'Primordial deity', 'Overthrown by son', 'Generational revolution']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Electric blue lightning bolt splitting the sky, Uranus is the awakener—sudden insight that shatters everything you thought you knew. The rebel, the genius, the revolutionary who dares to be different. Freedom found by breaking free from convention\'s cage.',
        highlights: ['Lightning awakening', 'Revolutionary spirit', 'Genius breakthrough', 'Liberation']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Uranus shows where you need freedom, where you\'re unconventional, and where sudden change occurs. It governs innovation and awakening. The lesson: What patterns must you break to become authentically yourself? Sometimes you must destroy to create.',
        highlights: ['Freedom & rebellion', 'Innovation', 'Sudden change', 'Authentic uniqueness']
      }
    ]
  },

  neptune: {
    name: 'Neptune',
    symbol: '♆',
    color: '#4166F5',
    perspectives: [
      {
        perspective: 'scientific',
        title: 'Scientific View',
        icon: '🔬',
        content: 'Neptune is the windiest planet with supersonic winds reaching 2,100 km/h. This ice giant\'s blue color comes from methane absorption of red light. It radiates more energy than it receives from the Sun. Discovered mathematically before being observed, Neptune takes 165 years to orbit.',
        highlights: ['Supersonic winds', 'Deep blue', 'Mathematically discovered', '165-year orbit']
      },
      {
        perspective: 'mythological',
        title: 'Mythological View',
        icon: '📜',
        content: 'Poseidon/Neptune, god of the sea, ruled the vast oceanic depths with his trident. Temperamental and powerful, he could bless sailors or destroy ships with storms. He represents the unconscious realm where monsters and treasures both dwell—the boundary-less depths of emotion and imagination.',
        highlights: ['Sea god', 'Lord of depths', 'Temperamental power', 'Unconscious ruler']
      },
      {
        perspective: 'poetic',
        title: 'Poetic View',
        icon: '✨',
        content: 'Neptune dissolves all boundaries—between you and me, real and imagined, sacred and profane. The mystic planet of infinite compassion and beautiful illusion. Where ego melts into unity, where artists channel the divine, where the soul remembers it\'s made of starlight and dreams.',
        highlights: ['Boundary dissolution', 'Divine channel', 'Infinite compassion', 'Sacred dreams']
      },
      {
        perspective: 'personal',
        title: 'Personal Growth',
        icon: '🌱',
        content: 'Neptune reveals your spirituality, creativity, and capacity for transcendence. It shows where you might deceive yourself or escape reality. The lesson: Discernment is key. Compassion doesn\'t mean being a doormat. Channel your imagination into art, not delusion.',
        highlights: ['Spirituality', 'Imagination', 'Compassion', 'Transcendence']
      }
    ]
  }
}

/**
 * Get multi-perspective data for a planet
 */
export function getMultiPerspectivePlanet(name: string): MultiPerspectivePlanet | undefined {
  const lowerName = name.toLowerCase()
  return MULTI_PERSPECTIVE_PLANETS[lowerName]
}

/**
 * Get a specific perspective for a planet
 */
export function getPlanetPerspective(
  planetName: string,
  perspective: 'scientific' | 'mythological' | 'poetic' | 'personal'
): PlanetPerspective | undefined {
  const planet = getMultiPerspectivePlanet(planetName)
  return planet?.perspectives.find(p => p.perspective === perspective)
}
