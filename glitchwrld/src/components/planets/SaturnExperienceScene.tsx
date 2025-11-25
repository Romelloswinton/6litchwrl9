/**
 * Saturn Experience - "The Master Builder"
 *
 * Theme: Discipline, Structure, Mastery, Time Management
 * Interactive habit tracking and skill mastery system
 */

import { useState, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, Text, Torus, Html } from '@react-three/drei'
import { useHybridStore } from '../../stores/hybridStore'
import { AudioControls } from '../ui/AudioControls'
import { getAudioManager } from '../../utils/audio/AudioManager'
import * as THREE from 'three'
import './SaturnExperienceScene.css'

// Skill/Habit tracking interface
interface Skill {
  id: string
  name: string
  category: 'physical' | 'mental' | 'creative' | 'social' | 'spiritual'
  level: number // 0-100
  dailyGoal: number // minutes per day
  streak: number // days in a row
  totalTime: number // total minutes practiced
  icon: string
  color: string
  milestones: {
    hours: number
    label: string
    achieved: boolean
  }[]
}

interface DailyLog {
  skillId: string
  minutes: number
  date: string
  notes: string
}

// Sample skills database
const SAMPLE_SKILLS: Skill[] = [
  {
    id: 'meditation',
    name: 'Meditation',
    category: 'spiritual',
    level: 0,
    dailyGoal: 20,
    streak: 0,
    totalTime: 0,
    icon: '🧘',
    color: '#9B59B6',
    milestones: [
      { hours: 10, label: 'Novice', achieved: false },
      { hours: 50, label: 'Practitioner', achieved: false },
      { hours: 100, label: 'Adept', achieved: false },
      { hours: 500, label: 'Master', achieved: false },
      { hours: 1000, label: 'Grand Master', achieved: false }
    ]
  },
  {
    id: 'coding',
    name: 'Programming',
    category: 'mental',
    level: 0,
    dailyGoal: 60,
    streak: 0,
    totalTime: 0,
    icon: '💻',
    color: '#3498DB',
    milestones: [
      { hours: 20, label: 'Beginner', achieved: false },
      { hours: 100, label: 'Intermediate', achieved: false },
      { hours: 500, label: 'Advanced', achieved: false },
      { hours: 1000, label: 'Expert', achieved: false },
      { hours: 10000, label: 'Master', achieved: false }
    ]
  },
  {
    id: 'exercise',
    name: 'Physical Training',
    category: 'physical',
    level: 0,
    dailyGoal: 30,
    streak: 0,
    totalTime: 0,
    icon: '💪',
    color: '#E74C3C',
    milestones: [
      { hours: 10, label: 'Active', achieved: false },
      { hours: 50, label: 'Fit', achieved: false },
      { hours: 100, label: 'Athletic', achieved: false },
      { hours: 500, label: 'Elite', achieved: false },
      { hours: 1000, label: 'Champion', achieved: false }
    ]
  },
  {
    id: 'art',
    name: 'Creative Arts',
    category: 'creative',
    level: 0,
    dailyGoal: 45,
    streak: 0,
    totalTime: 0,
    icon: '🎨',
    color: '#F39C12',
    milestones: [
      { hours: 10, label: 'Dabbler', achieved: false },
      { hours: 50, label: 'Artist', achieved: false },
      { hours: 100, label: 'Skilled', achieved: false },
      { hours: 500, label: 'Professional', achieved: false },
      { hours: 1000, label: 'Virtuoso', achieved: false }
    ]
  },
  {
    id: 'reading',
    name: 'Reading & Study',
    category: 'mental',
    level: 0,
    dailyGoal: 30,
    streak: 0,
    totalTime: 0,
    icon: '📚',
    color: '#1ABC9C',
    milestones: [
      { hours: 10, label: 'Reader', achieved: false },
      { hours: 50, label: 'Scholar', achieved: false },
      { hours: 100, label: 'Learned', achieved: false },
      { hours: 500, label: 'Sage', achieved: false },
      { hours: 1000, label: 'Philosopher', achieved: false }
    ]
  },
  {
    id: 'social',
    name: 'Social Connection',
    category: 'social',
    level: 0,
    dailyGoal: 15,
    streak: 0,
    totalTime: 0,
    icon: '👥',
    color: '#E91E63',
    milestones: [
      { hours: 10, label: 'Friendly', achieved: false },
      { hours: 50, label: 'Social', achieved: false },
      { hours: 100, label: 'Connected', achieved: false },
      { hours: 500, label: 'Community Leader', achieved: false },
      { hours: 1000, label: 'Social Master', achieved: false }
    ]
  }
]

// Saturn 3D scene with rings
function SaturnScene({ selectedSkill }: { selectedSkill: Skill | null }) {
  return (
    <group>
      {/* Saturn planet */}
      <Sphere args={[6, 32, 32]} position={[0, 0, -15]}>
        <meshStandardMaterial
          color="#E3C48E"
          roughness={0.7}
          metalness={0.3}
          emissive="#D4AF6A"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Saturn's iconic rings */}
      <group position={[0, 0, -15]} rotation={[Math.PI / 3, 0, 0]}>
        <Torus args={[8, 0.3, 16, 100]}>
          <meshStandardMaterial
            color="#C9A961"
            transparent
            opacity={0.8}
            roughness={0.6}
            emissive="#D4AF6A"
            emissiveIntensity={0.3}
          />
        </Torus>
        <Torus args={[9.5, 0.4, 16, 100]}>
          <meshStandardMaterial
            color="#B89A5B"
            transparent
            opacity={0.7}
            roughness={0.6}
            emissive="#C9A961"
            emissiveIntensity={0.25}
          />
        </Torus>
        <Torus args={[11, 0.2, 16, 100]}>
          <meshStandardMaterial
            color="#A78A4F"
            transparent
            opacity={0.6}
            roughness={0.7}
            emissive="#B89A5B"
            emissiveIntensity={0.2}
          />
        </Torus>
      </group>

      {/* Orbiting skill markers */}
      {SAMPLE_SKILLS.map((skill, index) => {
        const angle = (index / SAMPLE_SKILLS.length) * Math.PI * 2
        const radius = 18
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const isSelected = selectedSkill?.id === skill.id
        const size = isSelected ? 1 : 0.6

        return (
          <group key={skill.id} position={[x, 0, z - 15]}>
            <Sphere args={[size, 16, 16]}>
              <meshStandardMaterial
                color={skill.color}
                roughness={0.4}
                emissive={skill.color}
                emissiveIntensity={isSelected ? 0.8 : 0.4}
              />
            </Sphere>
            {isSelected && (
              <Html>
                <div className="skill-label-3d">
                  {skill.icon} {skill.name}
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
        color="#E3C48E"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        SATURN MASTERY SYSTEM
      </Text>

      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#D4AF6A"
        anchorX="center"
        anchorY="middle"
      >
        Build Discipline Through Time
      </Text>

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.2}
      />
    </group>
  )
}

export function SaturnExperienceScene() {
  const { setSceneMode } = useHybridStore()
  const [skills, setSkills] = useState<Skill[]>(SAMPLE_SKILLS)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(SAMPLE_SKILLS[0])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [logMinutes, setLogMinutes] = useState<number>(30)
  // const [showAddSkill, setShowAddSkill] = useState(false) // TODO: Implement custom skill addition feature
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

  // Filter skills by category
  const filteredSkills = useMemo(() => {
    if (categoryFilter === 'all') return skills
    return skills.filter(skill => skill.category === categoryFilter)
  }, [skills, categoryFilter])

  // Calculate level based on total time
  const calculateLevel = (totalMinutes: number): number => {
    // 1000 hours (60,000 minutes) = level 100
    return Math.min(100, Math.floor((totalMinutes / 60000) * 100))
  }

  // Log practice time
  const logPractice = () => {
    if (!selectedSkill || logMinutes <= 0) return

    const updatedSkills = skills.map(skill => {
      if (skill.id === selectedSkill.id) {
        const newTotalTime = skill.totalTime + logMinutes
        const newLevel = calculateLevel(newTotalTime)

        // Update milestones
        const updatedMilestones = skill.milestones.map(milestone => ({
          ...milestone,
          achieved: (newTotalTime / 60) >= milestone.hours
        }))

        // Increment streak (simplified - would need date logic in production)
        const newStreak = skill.streak + 1

        return {
          ...skill,
          totalTime: newTotalTime,
          level: newLevel,
          streak: newStreak,
          milestones: updatedMilestones
        }
      }
      return skill
    })

    setSkills(updatedSkills)
    setSelectedSkill(updatedSkills.find(s => s.id === selectedSkill.id) || null)
    setLogMinutes(30)
  }

  // Get next milestone
  const getNextMilestone = (skill: Skill) => {
    const currentHours = skill.totalTime / 60
    return skill.milestones.find(m => !m.achieved)
  }

  // Get current rank
  const getCurrentRank = (skill: Skill) => {
    const achieved = skill.milestones.filter(m => m.achieved)
    return achieved.length > 0 ? achieved[achieved.length - 1].label : 'Beginner'
  }

  return (
    <div className="saturn-experience">
      {/* Back button */}
      <button
        className="back-button saturn-back"
        onClick={() => setSceneMode('solarSystem')}
      >
        ← Back to Solar System
      </button>

      {/* 3D Scene */}
      <div className="saturn-canvas-container">
        <Canvas camera={{ position: [0, 10, 25], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[15, 15, 15]} intensity={1.2} color="#E3C48E" />
          <directionalLight position={[-10, 10, 5]} intensity={0.6} color="#D4AF6A" />

          <SaturnScene selectedSkill={selectedSkill} />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={15}
            maxDistance={50}
          />
        </Canvas>
      </div>

      {/* Mastery Panel */}
      <div className="mastery-panel">
        <div className="panel-header">
          <h1>♄ Mastery System</h1>
          <p className="saturn-quote">
            "Time is the wisest counselor of all." - Pericles
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={categoryFilter === 'all' ? 'active' : ''}
            onClick={() => setCategoryFilter('all')}
          >
            All Skills
          </button>
          <button
            className={categoryFilter === 'physical' ? 'active' : ''}
            onClick={() => setCategoryFilter('physical')}
          >
            💪 Physical
          </button>
          <button
            className={categoryFilter === 'mental' ? 'active' : ''}
            onClick={() => setCategoryFilter('mental')}
          >
            🧠 Mental
          </button>
          <button
            className={categoryFilter === 'creative' ? 'active' : ''}
            onClick={() => setCategoryFilter('creative')}
          >
            🎨 Creative
          </button>
          <button
            className={categoryFilter === 'social' ? 'active' : ''}
            onClick={() => setCategoryFilter('social')}
          >
            👥 Social
          </button>
          <button
            className={categoryFilter === 'spiritual' ? 'active' : ''}
            onClick={() => setCategoryFilter('spiritual')}
          >
            🧘 Spiritual
          </button>
        </div>

        {/* Selected Skill Detail */}
        {selectedSkill && (
          <div className="skill-detail-section">
            <div className="skill-detail-header">
              <span className="skill-icon-large">{selectedSkill.icon}</span>
              <div>
                <h2 style={{ color: selectedSkill.color }}>{selectedSkill.name}</h2>
                <div className="skill-rank">{getCurrentRank(selectedSkill)}</div>
              </div>
            </div>

            <div className="skill-stats">
              <div className="stat-box">
                <div className="stat-label">Level</div>
                <div className="stat-value" style={{ color: selectedSkill.color }}>
                  {selectedSkill.level}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Streak</div>
                <div className="stat-value" style={{ color: selectedSkill.color }}>
                  {selectedSkill.streak} days
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Total Time</div>
                <div className="stat-value" style={{ color: selectedSkill.color }}>
                  {Math.floor(selectedSkill.totalTime / 60)}h
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-section">
              <div className="progress-label">
                <span>Progress to Level {selectedSkill.level + 1}</span>
                <span>{selectedSkill.level}%</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${selectedSkill.level}%`,
                    backgroundColor: selectedSkill.color
                  }}
                />
              </div>
            </div>

            {/* Log Practice */}
            <div className="log-practice-section">
              <h3>Log Practice Session</h3>
              <div className="log-input-group">
                <label>Minutes Practiced:</label>
                <input
                  type="number"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(parseInt(e.target.value) || 0)}
                  min="1"
                  max="480"
                />
              </div>
              <button
                className="log-button"
                onClick={logPractice}
                style={{ borderColor: selectedSkill.color }}
              >
                + Log {logMinutes} Minutes
              </button>
            </div>

            {/* Milestones */}
            <div className="milestones-section">
              <h3>Mastery Milestones</h3>
              <div className="milestones-list">
                {selectedSkill.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`milestone-item ${milestone.achieved ? 'achieved' : ''}`}
                  >
                    <div className="milestone-icon">
                      {milestone.achieved ? '✓' : '○'}
                    </div>
                    <div className="milestone-info">
                      <div className="milestone-label">{milestone.label}</div>
                      <div className="milestone-hours">{milestone.hours} hours</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="skills-section">
          <h2>Your Skills Journey</h2>
          <div className="skills-grid">
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                className={`skill-card ${selectedSkill?.id === skill.id ? 'selected' : ''}`}
                onClick={() => setSelectedSkill(skill)}
                style={{ borderColor: skill.color }}
              >
                <div className="skill-card-header">
                  <span className="skill-icon">{skill.icon}</span>
                  <h3 style={{ color: skill.color }}>{skill.name}</h3>
                </div>
                <div className="skill-card-level">Level {skill.level}</div>
                <div className="skill-card-streak">🔥 {skill.streak} day streak</div>
                <div className="skill-card-time">
                  {Math.floor(skill.totalTime / 60)}h {skill.totalTime % 60}m
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saturn Facts */}
        <div className="saturn-facts">
          <h3>♄ Saturn Facts</h3>
          <ul>
            <li><strong>Ring System:</strong> Most spectacular in the solar system</li>
            <li><strong>Titan:</strong> Moon with atmosphere and liquid methane lakes</li>
            <li><strong>Time:</strong> 29.5 Earth years to orbit the Sun</li>
            <li><strong>Density:</strong> Less dense than water, would float!</li>
            <li><strong>Lord of Time:</strong> Saturn represents discipline and structure</li>
          </ul>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />
    </div>
  )
}
