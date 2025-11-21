/**
 * Celestial Body Symbolism Database
 * Astrological and mythological meanings for planets and moons
 */

export interface CelestialSymbolism {
  name: string
  symbol: string
  archetype: string
  essence: string
  keywords: string[]
  description: string
  mythologyNote?: string
  color: string
}

/**
 * Planetary Symbolism - With Unique Spice & Depth
 */
export const PLANET_SYMBOLISM: Record<string, CelestialSymbolism> = {
  sun: {
    name: 'Sun',
    symbol: '☉',
    archetype: 'The Self',
    essence: 'Identity & Life Force',
    keywords: ['vitality', 'ego', 'consciousness', 'creativity', 'will'],
    description: 'The Sun represents your core essence—who you are when stripped of all masks. It is your creative fire, your life force, and the conscious self you project to the world. Like a star burning at the center of your being, it illuminates your path and powers your existence.',
    mythologyNote: 'Ancient cultures worshipped the Sun as the ultimate deity—Ra in Egypt, Helios in Greece, Sol in Rome—recognizing it as the divine source of all life.',
    color: '#FDB813'
  },

  mercury: {
    name: 'Mercury',
    symbol: '☿',
    archetype: 'The Messenger',
    essence: 'Mind & Communication',
    keywords: ['intellect', 'communication', 'adaptability', 'wit', 'travel'],
    description: 'Mercury governs the realm of thought, language, and connection. It is the quicksilver messenger dancing between worlds, translating the invisible into words and ideas into action. Your Mercury shows how you think, learn, speak, and process the endless data stream of existence.',
    mythologyNote: 'Named for the Roman god of travelers and thieves, Mercury wore winged sandals and could move between mortal and divine realms—a perfect symbol for the mind that bridges heaven and earth.',
    color: '#8C7853'
  },

  venus: {
    name: 'Venus',
    symbol: '♀',
    archetype: 'The Lover',
    essence: 'Love & Values',
    keywords: ['love', 'beauty', 'pleasure', 'harmony', 'desire', 'worth'],
    description: 'Venus is the magnetic force of attraction—what you love, what you value, and what brings you pleasure. She governs romance, aesthetics, and the art of relating. Venus reveals your relationship with beauty, money, and the sweetness of being alive. She asks: What do you find worthy of love?',
    mythologyNote: 'Born from sea foam, Venus (Aphrodite) embodied irresistible beauty and desire. Her burning interior reflects the passionate intensity beneath love\'s beautiful surface.',
    color: '#E6B87E'
  },

  earth: {
    name: 'Earth',
    symbol: '🜨',
    archetype: 'The Ground',
    essence: 'Physical Reality & Embodiment',
    keywords: ['presence', 'grounding', 'manifestation', 'nature', 'body'],
    description: 'Earth is where spirit meets matter—the sacred stage where your soul takes form. It represents physical reality, the body as temple, and the miracle of being incarnated. Earth teaches presence, sustainability, and the wisdom of working with what is real and tangible.',
    mythologyNote: 'Gaia, the primordial Earth goddess, birthed all life from her body. She reminds us that we are not on Earth, but of Earth—made from stardust and belonging to the living web.',
    color: '#4A90E2'
  },

  mars: {
    name: 'Mars',
    symbol: '♂',
    archetype: 'The Warrior',
    essence: 'Will & Action',
    keywords: ['courage', 'desire', 'aggression', 'passion', 'drive', 'assertion'],
    description: 'Mars is your primal fire—raw desire, fighting spirit, and the courage to take action. It is the warrior archetype that defends what you love and pursues what you want. Mars shows how you assert yourself, compete, survive, and channel your animal vitality into purposeful action.',
    mythologyNote: 'The Roman god of war, Mars (Ares) embodied both the destructive fury and protective strength of combat. His red planet blazes in the night sky like a celestial war drum.',
    color: '#CD5C5C'
  },

  jupiter: {
    name: 'Jupiter',
    symbol: '♃',
    archetype: 'The King',
    essence: 'Expansion & Wisdom',
    keywords: ['growth', 'optimism', 'abundance', 'philosophy', 'luck', 'faith'],
    description: 'Jupiter is the great benefactor—the planet of expansion, luck, and higher meaning. It governs your search for truth, your capacity for faith, and your ability to see the bigger picture. Jupiter asks you to grow beyond your limits and trust that life is fundamentally abundant and meaningful.',
    mythologyNote: 'Jupiter (Zeus), king of the gods, ruled from Mt. Olympus with thunder and lightning. As the largest planet, Jupiter\'s massive gravity protects Earth from asteroids—our cosmic guardian.',
    color: '#C88B3A'
  },

  saturn: {
    name: 'Saturn',
    symbol: '♄',
    archetype: 'The Teacher',
    essence: 'Discipline & Mastery',
    keywords: ['structure', 'limits', 'responsibility', 'time', 'mastery', 'karma'],
    description: 'Saturn is the stern teacher who shows you the gap between where you are and where you could be. It governs discipline, limitation, and the passage of time. Through Saturn\'s trials, you discover your true strength. It teaches that freedom comes through structure, and wisdom through confronting reality.',
    mythologyNote: 'Saturn (Cronos), the god of time and harvest, reminds us that all things have their season. His rings symbolize the boundaries that define and protect what is valuable.',
    color: '#F4E8C1'
  },

  uranus: {
    name: 'Uranus',
    symbol: '♅',
    archetype: 'The Awakener',
    essence: 'Revolution & Innovation',
    keywords: ['rebellion', 'genius', 'innovation', 'freedom', 'awakening', 'electricity'],
    description: 'Uranus is the lightning bolt that shatters the status quo. It represents sudden awakening, revolutionary insight, and the genius that breaks free from convention. Uranus governs technology, rebellion, and the future. It asks: What patterns must you break to become truly free?',
    mythologyNote: 'Uranus, the primordial sky god, was overthrown by his son Saturn—symbolizing how each generation must break from the past. The planet rotates on its side, spinning uniquely among the planets.',
    color: '#4FD0E7'
  },

  neptune: {
    name: 'Neptune',
    symbol: '♆',
    archetype: 'The Mystic',
    essence: 'Dreams & Dissolution',
    keywords: ['illusion', 'imagination', 'spirituality', 'compassion', 'transcendence', 'unity'],
    description: 'Neptune dissolves all boundaries between self and other, real and imagined. It is the planet of dreams, mysticism, and infinite compassion. Neptune governs art, spirituality, and the longing to merge with something greater. It shows where you seek transcendence—and where you might deceive yourself.',
    mythologyNote: 'Neptune (Poseidon), god of the sea, ruled the vast unconscious depths where monsters and treasures both dwell. The planet\'s deep blue color reflects the mysterious oceanic realm it governs.',
    color: '#4166F5'
  }
}

/**
 * Moon Symbolism - Major Natural Satellites
 */
export const MOON_SYMBOLISM: Record<string, CelestialSymbolism> = {
  moon: {
    name: 'The Moon',
    symbol: '☽',
    archetype: 'The Mother',
    essence: 'Emotion & Subconscious',
    keywords: ['feelings', 'intuition', 'memory', 'nurturing', 'cycles', 'moods'],
    description: 'The Moon is your inner emotional landscape—the vast subconscious realm of feelings, memories, and instincts. She governs your needs, your past, and how you nurture yourself and others. The Moon reflects the light of the Sun, showing how you process and respond to life emotionally.',
    mythologyNote: 'Luna, Selene, Artemis—the Moon goddess has many faces, reflecting her ever-changing nature. She pulls the tides of the ocean and the tides of the human heart.',
    color: '#C0C0C0'
  },

  phobos: {
    name: 'Phobos',
    symbol: '🛡️',
    archetype: 'Fear',
    essence: 'Immediate Terror & Fight Response',
    keywords: ['panic', 'urgency', 'adrenaline', 'sprint', 'acute fear'],
    description: 'Phobos embodies the sharp edge of fear—the sudden panic, the fight-or-flight response that mobilizes you in the face of danger. Twin of Deimos, Phobos represents acute, immediate terror that propels rapid action. The sprinter energy of Mars.',
    mythologyNote: 'Phobos and Deimos were the twin sons of Ares (Mars) and Aphrodite (Venus), accompanying their father into battle to strike fear into enemy hearts.',
    color: '#A0522D'
  },

  deimos: {
    name: 'Deimos',
    symbol: '⚔️',
    archetype: 'Dread',
    essence: 'Sustained Terror & Endurance',
    keywords: ['dread', 'persistence', 'anxiety', 'marathon', 'chronic fear'],
    description: 'Deimos is the slow-burning dread—the sustained terror that tests your endurance. While Phobos is the sprint, Deimos is the marathon runner. He represents the fear that lingers, building pressure over time, demanding long-term courage and stamina.',
    mythologyNote: 'Twin brother of Phobos, Deimos personified the dread and terror felt before and during battle—the psychological warfare that weakens resolve.',
    color: '#8B4513'
  },

  io: {
    name: 'Io',
    symbol: '🌋',
    archetype: 'The Transformed',
    essence: 'Volcanic Passion & Metamorphosis',
    keywords: ['transformation', 'intensity', 'volcanic', 'jealousy', 'suffering into strength'],
    description: 'Io, the most volcanically active body in the solar system, represents transformation through intense pressure. She embodies the pain of unwanted change and the strength found through enduring what cannot be escaped. Beauty forged in fire.',
    mythologyNote: 'Io was transformed into a heifer by Zeus to hide their affair from Hera. Tormented by a gadfly sent by jealous Hera, she wandered the earth—her suffering a cosmic tale of transformation.',
    color: '#FFD700'
  },

  europa: {
    name: 'Europa',
    symbol: '🌊',
    archetype: 'The Hidden Depths',
    essence: 'Mystery & Potential',
    keywords: ['mystery', 'hidden depths', 'potential life', 'secrets', 'oceanic'],
    description: 'Beneath Europa\'s icy shell lies a vast ocean—perhaps harboring life. She represents the mysteries beneath the surface, the potential waiting to be discovered, and the secrets kept in cold, dark places. Europa asks: What hidden depths lie within you?',
    mythologyNote: 'Europa was abducted by Zeus disguised as a white bull, carried across the sea to Crete. Her icy moon may contain more water than all of Earth\'s oceans combined.',
    color: '#B0C4DE'
  },

  ganymede: {
    name: 'Ganymede',
    symbol: '👑',
    archetype: 'The Chosen One',
    essence: 'Divine Favor & Excess',
    keywords: ['beauty', 'favor', 'abundance', 'excess', 'chosen', 'fortune'],
    description: 'Ganymede, largest moon in the solar system, represents attracting good fortune and divine favor. The hero chosen by the gods, he embodies beauty that opens doors. But his shadow warns of excess, entitlement, and getting carried away by privilege.',
    mythologyNote: 'So beautiful that Zeus took him to Olympus to be cupbearer to the gods, Ganymede was made immortal. His eagle-borne ascent symbolizes sudden elevation to higher realms.',
    color: '#DAA520'
  },

  callisto: {
    name: 'Callisto',
    symbol: '🐻',
    archetype: 'The Wise One',
    essence: 'Ancient Wisdom & Sacrifice',
    keywords: ['wisdom', 'age', 'sacrifice', 'polar star', 'guidance', 'bear medicine'],
    description: 'Callisto embodies the wisdom earned through suffering and age. Connected to the bear and the North Star, she represents guidance through darkness and the fierce protective wisdom of the wounded healer. She is the crone, the wise woman who has survived and remembers.',
    mythologyNote: 'Callisto, a nymph of Artemis, was transformed into a bear and placed among the stars as Ursa Major. She became the constellation that points to the North Star—eternal guide for lost travelers.',
    color: '#8B7D6B'
  },

  titan: {
    name: 'Titan',
    symbol: '🪐',
    archetype: 'The Elder',
    essence: 'Primordial Power & Atmosphere',
    keywords: ['ancient power', 'atmosphere', 'methane lakes', 'primordial', 'elder wisdom'],
    description: 'Titan, Saturn\'s largest moon, is the only moon with a substantial atmosphere—a world unto itself. Named for the elder gods who preceded the Olympians, Titan represents ancient, primordial power and the wisdom of what came before. A pre-Earth Earth, showing what our world might have been.',
    mythologyNote: 'The Titans were the elder gods who ruled before Zeus and the Olympians. Titan\'s thick atmosphere and methane lakes create an alien world that mirrors early Earth.',
    color: '#FFA500'
  },

  rhea: {
    name: 'Rhea',
    symbol: '🤱',
    archetype: 'The Protector Mother',
    essence: 'Maternal Cunning & Protection',
    keywords: ['motherhood', 'protection', 'cunning', 'preservation', 'cycles'],
    description: 'Rhea represents the fierce protective intelligence of motherhood—the cunning required to save what you love from destruction. She is the mother who outsmarts the devouring father, preserving the future through wisdom and strategic action.',
    mythologyNote: 'Rhea, wife of Cronos (Saturn), saved her children from being devoured by their father. She hid baby Zeus and gave Cronos a stone wrapped in swaddling clothes instead.',
    color: '#D2B48C'
  },

  titania: {
    name: 'Titania',
    symbol: '👑',
    archetype: 'The Fairy Queen',
    essence: 'Magic & Sovereignty',
    keywords: ['magic', 'sovereignty', 'enchantment', 'queenship', 'otherworld'],
    description: 'Titania, queen of the fairies, represents magical sovereignty and the enchantment of the natural world. She governs the liminal spaces between worlds, the power of glamour and illusion, and the wild feminine that refuses to be tamed.',
    mythologyNote: 'Named for the fairy queen in Shakespeare\'s "A Midsummer Night\'s Dream," Titania rules the magical realm where logic dissolves and transformation is possible.',
    color: '#E6E6FA'
  },

  oberon: {
    name: 'Oberon',
    symbol: '🦋',
    archetype: 'The Fairy King',
    essence: 'Trickster Magic & Transformation',
    keywords: ['trickster', 'transformation', 'mischief', 'magic', 'illusion'],
    description: 'Oberon, king of the fairies, embodies the trickster\'s magic—transformation through mischief, wisdom through folly. He represents the shapeshifter who uses illusion and play to reveal deeper truths. The masculine magic that dances at the edge of chaos.',
    mythologyNote: 'Shakespeare\'s Oberon uses magic to test and transform lovers, proving that sometimes chaos and confusion are necessary for growth and true connection.',
    color: '#9370DB'
  },

  triton: {
    name: 'Triton',
    symbol: '🔱',
    archetype: 'The Retrograde',
    essence: 'Rebellion & Reversal',
    keywords: ['retrograde', 'rebellion', 'reversal', 'unconventional', 'captured'],
    description: 'Triton orbits Neptune backwards—a captured moon that defied convention. He represents rebellion, reversal of fortune, and the power found in going against the current. Triton embodies the beauty of the unconventional path and the strength of those who swim upstream.',
    mythologyNote: 'Triton, son of Poseidon (Neptune), was a merman who commanded the waves with his conch shell. His moon\'s retrograde orbit makes it unique among large moons.',
    color: '#48D1CC'
  }
}

/**
 * Get symbolism data for any celestial body
 */
export function getCelestialSymbolism(name: string): CelestialSymbolism | undefined {
  const lowerName = name.toLowerCase()
  return PLANET_SYMBOLISM[lowerName] || MOON_SYMBOLISM[lowerName]
}

/**
 * Get a random keyword for quick display
 */
export function getRandomKeyword(name: string): string {
  const symbolism = getCelestialSymbolism(name)
  if (!symbolism || symbolism.keywords.length === 0) return ''
  return symbolism.keywords[Math.floor(Math.random() * symbolism.keywords.length)]
}
