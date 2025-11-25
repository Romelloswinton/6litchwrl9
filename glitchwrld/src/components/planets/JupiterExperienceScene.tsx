/**
 * Jupiter Experience - "Wisdom Library"
 *
 * Theme: Expansion, Wisdom, Leadership, Abundance
 * Interactive knowledge exploration and big-picture thinking
 */

import { useState, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, Text, Html } from '@react-three/drei'
import { useHybridStore } from '../../stores/hybridStore'
import { AudioControls } from '../ui/AudioControls'
import { getAudioManager } from '../../utils/audio/AudioManager'
import * as THREE from 'three'
import './JupiterExperienceScene.css'

// Knowledge categories and topics
interface KnowledgeNode {
  id: string
  title: string
  category: 'philosophy' | 'science' | 'art' | 'technology' | 'nature' | 'wisdom'
  description: string
  insights: string[]
  connections: string[] // IDs of related nodes
  color: string
  icon: string
}

// Sample knowledge database
const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'stoicism',
    title: 'Stoicism',
    category: 'philosophy',
    description: 'Ancient philosophy of virtue, reason, and natural law',
    insights: [
      'Focus on what you can control',
      'Accept what you cannot change',
      'Live in accordance with nature',
      'Practice negative visualization'
    ],
    connections: ['meditation', 'philosophy-of-mind', 'virtue-ethics'],
    color: '#C88B3A',
    icon: '🏛️'
  },
  {
    id: 'systems-thinking',
    title: 'Systems Thinking',
    category: 'science',
    description: 'Understanding complex interconnected systems',
    insights: [
      'Everything is connected',
      'Feedback loops create patterns',
      'Small changes can have large effects',
      'Look for leverage points'
    ],
    connections: ['chaos-theory', 'ecology', 'complexity'],
    color: '#DAA520',
    icon: '🔄'
  },
  {
    id: 'creative-process',
    title: 'Creative Process',
    category: 'art',
    description: 'The journey from inspiration to manifestation',
    insights: [
      'Creativity requires both freedom and constraint',
      'Ideas need time to incubate',
      'Iteration improves everything',
      'Inspiration is everywhere'
    ],
    connections: ['flow-state', 'art-history', 'innovation'],
    color: '#FFD700',
    icon: '🎨'
  },
  {
    id: 'meditation',
    title: 'Meditation',
    category: 'wisdom',
    description: 'The practice of mindful awareness and presence',
    insights: [
      'Observe thoughts without judgment',
      'Return to the present moment',
      'Cultivate inner peace',
      'Awareness is transformative'
    ],
    connections: ['stoicism', 'neuroscience', 'mindfulness'],
    color: '#FFA500',
    icon: '🧘'
  },
  {
    id: 'quantum-physics',
    title: 'Quantum Physics',
    category: 'science',
    description: 'The strange and wonderful world of the very small',
    insights: [
      'Observer affects the observed',
      'Particles can be in multiple states',
      'Everything is probability waves',
      'Reality is more mysterious than it seems'
    ],
    connections: ['relativity', 'philosophy-of-mind', 'consciousness'],
    color: '#87CEEB',
    icon: '⚛️'
  },
  {
    id: 'biomimicry',
    title: 'Biomimicry',
    category: 'nature',
    description: 'Learning from and mimicking nature\'s strategies',
    insights: [
      'Nature has already solved most problems',
      '3.8 billion years of R&D',
      'Efficiency through evolution',
      'Sustainable by design'
    ],
    connections: ['ecology', 'innovation', 'systems-thinking'],
    color: '#00FF00',
    icon: '🌿'
  }
]

// Jupiter with moons visualization
function JupiterScene({ selectedNode }: { selectedNode: KnowledgeNode | null }) {
  return (
    <group>
      {/* Jupiter planet */}
      <Sphere args={[8, 32, 32]} position={[0, 0, -20]}>
        <meshStandardMaterial
          color="#C88B3A"
          roughness={0.6}
          emissive="#DAA520"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Great Red Spot */}
      <Sphere args={[1.5, 16, 16]} position={[6, 0, -20]}>
        <meshStandardMaterial
          color="#FF6B6B"
          roughness={0.4}
          emissive="#FF0000"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Knowledge nodes as orbiting moons */}
      {KNOWLEDGE_NODES.slice(0, 6).map((node, index) => {
        const angle = (index / 6) * Math.PI * 2
        const radius = 15 + index * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const isSelected = selectedNode?.id === node.id

        return (
          <group key={node.id} position={[x, 0, z - 20]}>
            <Sphere args={[isSelected ? 1.2 : 0.8, 16, 16]}>
              <meshStandardMaterial
                color={node.color}
                roughness={0.5}
                emissive={node.color}
                emissiveIntensity={isSelected ? 0.8 : 0.3}
              />
            </Sphere>
            {isSelected && (
              <Html>
                <div className="node-label-3d">
                  {node.icon} {node.title}
                </div>
              </Html>
            )}
          </group>
        )
      })}

      {/* 3D Title */}
      <Text
        position={[0, 8, 0]}
        fontSize={1.5}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        JUPITER WISDOM LIBRARY
      </Text>

      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#C88B3A"
        anchorX="center"
        anchorY="middle"
      >
        Expand Your Mind
      </Text>

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
    </group>
  )
}

// Knowledge card component
function KnowledgeCard({
  node,
  isSelected,
  onClick
}: {
  node: KnowledgeNode
  isSelected: boolean
  onClick: () => void
}) {
  const categoryLabels = {
    philosophy: 'Philosophy',
    science: 'Science',
    art: 'Art & Creativity',
    technology: 'Technology',
    nature: 'Nature',
    wisdom: 'Wisdom Traditions'
  }

  return (
    <div
      className={`knowledge-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ borderColor: node.color }}
    >
      <div className="knowledge-header">
        <span className="knowledge-icon">{node.icon}</span>
        <h3 style={{ color: node.color }}>{node.title}</h3>
      </div>
      <div className="knowledge-category" style={{ backgroundColor: node.color }}>
        {categoryLabels[node.category]}
      </div>
      <p className="knowledge-description">{node.description}</p>

      {isSelected && (
        <div className="knowledge-insights">
          <h4>Key Insights:</h4>
          <ul>
            {node.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Big Questions prompts
const BIG_QUESTIONS = [
  "What is the nature of consciousness?",
  "How do we define a meaningful life?",
  "What is the relationship between order and chaos?",
  "How do complex systems emerge from simple rules?",
  "What is the role of suffering in growth?",
  "How can we balance tradition and innovation?",
  "What does it mean to be wise?",
  "How do we know what we know?",
  "What is the connection between all things?",
  "How can we think in larger time scales?"
]

export function JupiterExperienceScene() {
  const { setSceneMode } = useHybridStore()
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(KNOWLEDGE_NODES[0])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [randomQuestion, setRandomQuestion] = useState(BIG_QUESTIONS[0])
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)

  // Initialize planet audio
  useEffect(() => {
    const audioManager = getAudioManager()
    const startAudio = async () => {
      if (audioStarted) return
      try {
        setAudioStarted(true)
        await audioManager.play('planet')
        console.log('🎵 Started planet ambient audio')
      } catch (error) {
        console.warn('Audio autoplay blocked. Click to enable.', error)
        setAudioStarted(false) // Allow retry on error
      }
    }
    startAudio()

    const handleClick = () => {
      if (!audioStarted) {
        startAudio()
        document.removeEventListener('click', handleClick)
      }
    }
    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [])

  const filteredNodes = useMemo(() => {
    if (categoryFilter === 'all') return KNOWLEDGE_NODES
    return KNOWLEDGE_NODES.filter(node => node.category === categoryFilter)
  }, [categoryFilter])

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * BIG_QUESTIONS.length)
    setRandomQuestion(BIG_QUESTIONS[randomIndex])
  }

  const connectedNodes = useMemo(() => {
    if (!selectedNode) return []
    return KNOWLEDGE_NODES.filter(node =>
      selectedNode.connections.includes(node.id)
    )
  }, [selectedNode])

  return (
    <div className="jupiter-experience">
      {/* Back button */}
      <button
        className="back-button jupiter-back"
        onClick={() => setSceneMode('solarSystem')}
      >
        ← Back to Solar System
      </button>

      {/* 3D Scene */}
      <div className={`jupiter-canvas-container ${isPanelCollapsed ? 'expanded' : ''}`}>
        <Canvas
          camera={{ position: [0, 10, 30], fov: 60 }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
          <directionalLight position={[-10, 10, 5]} intensity={0.8} color="#C88B3A" />

          <JupiterScene selectedNode={selectedNode} />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={15}
            maxDistance={50}
          />
        </Canvas>
      </div>

      {/* Panel Toggle Button */}
      <button
        className={`panel-toggle-btn ${isPanelCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        title={isPanelCollapsed ? 'Show Wisdom Panel' : 'Hide Wisdom Panel'}
      >
        {isPanelCollapsed ? '◀' : '▶'}
      </button>

      {/* Wisdom Panel */}
      <div className={`wisdom-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <h1>♃ Wisdom Library</h1>
          <p className="jupiter-quote">
            "The only true wisdom is in knowing you know nothing." - Socrates
          </p>
        </div>

        {/* Big Questions Section */}
        <div className="big-questions-section">
          <h2>Big Question of the Moment</h2>
          <div className="question-card">
            <p className="big-question">{randomQuestion}</p>
            <button onClick={getRandomQuestion} className="new-question-btn">
              🔄 New Question
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={categoryFilter === 'all' ? 'active' : ''}
            onClick={() => setCategoryFilter('all')}
          >
            All Topics
          </button>
          <button
            className={categoryFilter === 'philosophy' ? 'active' : ''}
            onClick={() => setCategoryFilter('philosophy')}
          >
            🏛️ Philosophy
          </button>
          <button
            className={categoryFilter === 'science' ? 'active' : ''}
            onClick={() => setCategoryFilter('science')}
          >
            🔬 Science
          </button>
          <button
            className={categoryFilter === 'art' ? 'active' : ''}
            onClick={() => setCategoryFilter('art')}
          >
            🎨 Art
          </button>
          <button
            className={categoryFilter === 'wisdom' ? 'active' : ''}
            onClick={() => setCategoryFilter('wisdom')}
          >
            🧘 Wisdom
          </button>
          <button
            className={categoryFilter === 'nature' ? 'active' : ''}
            onClick={() => setCategoryFilter('nature')}
          >
            🌿 Nature
          </button>
        </div>

        {/* Knowledge Tree */}
        <div className="knowledge-section">
          <h2>Knowledge Tree</h2>
          <div className="knowledge-grid">
            {filteredNodes.map(node => (
              <KnowledgeCard
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={() => setSelectedNode(node)}
              />
            ))}
          </div>
        </div>

        {/* Connected Knowledge */}
        {selectedNode && connectedNodes.length > 0 && (
          <div className="connections-section">
            <h3>🔗 Connected Topics</h3>
            <div className="connections-list">
              {connectedNodes.map(node => (
                <button
                  key={node.id}
                  className="connection-badge"
                  style={{
                    backgroundColor: `${node.color}33`,
                    borderColor: node.color
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  {node.icon} {node.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Jupiter Facts */}
        <div className="jupiter-facts">
          <h3>♃ Jupiter Facts</h3>
          <ul>
            <li><strong>Largest Planet:</strong> Could fit 1,300 Earths inside</li>
            <li><strong>Great Red Spot:</strong> Storm larger than Earth, 300+ years old</li>
            <li><strong>95 Moons:</strong> A cosmic family of diverse worlds</li>
            <li><strong>Fast Rotation:</strong> Day is only 10 hours long</li>
            <li><strong>King of Gods:</strong> Zeus in Greek, Jupiter in Roman mythology</li>
          </ul>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />
    </div>
  )
}
