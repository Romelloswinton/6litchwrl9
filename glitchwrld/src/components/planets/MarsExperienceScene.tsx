/**
 * Mars Experience - "Mission Planner"
 *
 * Theme: Courage, Action, Exploration, Ambition
 * Interactive mission planning and goal tracking inspired by Mars exploration
 */

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Text, Sphere } from '@react-three/drei'
import { useHybridStore } from '../../stores/hybridStore'
import { ThirdPersonAvatar } from '../avatar/ThirdPersonAvatar'
import { AudioControls } from '../ui/AudioControls'
import { getAudioManager } from '../../utils/audio/AudioManager'
import './MarsExperienceScene.css'

// Mars surface component
function MarsSurface() {
  return (
    <group>
      {/* Mars ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#CD5C5C"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Mars planet in background */}
      <Sphere args={[15, 32, 32]} position={[0, 0, -40]}>
        <meshStandardMaterial
          color="#CD5C5C"
          roughness={0.8}
          emissive="#8B4513"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Ambient stars */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  )
}

// Goal card component
interface Goal {
  id: string
  title: string
  description: string
  completed: boolean
  category: 'exploration' | 'courage' | 'achievement' | 'learning'
}

function GoalCard({ goal, onToggle, onDelete }: {
  goal: Goal
  onToggle: () => void
  onDelete: () => void
}) {
  const categoryColors = {
    exploration: '#FF6B6B',
    courage: '#FFA500',
    achievement: '#FFD700',
    learning: '#87CEEB'
  }

  const categoryIcons = {
    exploration: '🚀',
    courage: '🦁',
    achievement: '🏆',
    learning: '📚'
  }

  return (
    <div className={`goal-card ${goal.completed ? 'completed' : ''}`}>
      <div className="goal-header">
        <span className="goal-icon">{categoryIcons[goal.category]}</span>
        <h3>{goal.title}</h3>
        <button onClick={onDelete} className="delete-btn">×</button>
      </div>
      <p className="goal-description">{goal.description}</p>
      <div className="goal-footer">
        <span
          className="goal-category"
          style={{ backgroundColor: categoryColors[goal.category] }}
        >
          {goal.category}
        </span>
        <button
          onClick={onToggle}
          className={`toggle-btn ${goal.completed ? 'completed' : ''}`}
        >
          {goal.completed ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  )
}

export function MarsExperienceScene() {
  const { setSceneMode } = useHybridStore()
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

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Launch a new project',
      description: 'Take the first step on your Mars mission',
      completed: false,
      category: 'exploration'
    },
    {
      id: '2',
      title: 'Face a fear',
      description: 'Channel your inner warrior',
      completed: false,
      category: 'courage'
    }
  ])
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDesc, setNewGoalDesc] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState<Goal['category']>('exploration')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDesc,
      completed: false,
      category: newGoalCategory
    }

    setGoals([...goals, newGoal])
    setNewGoalTitle('')
    setNewGoalDesc('')
    setShowAddForm(false)
  }

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    ))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const completedCount = goals.filter(g => g.completed).length
  const progressPercentage = goals.length > 0
    ? Math.round((completedCount / goals.length) * 100)
    : 0

  return (
    <div className="mars-experience">
      {/* Back button */}
      <button
        className="back-button"
        onClick={() => setSceneMode('solarSystem')}
      >
        ← Back to Solar System
      </button>

      {/* 3D Scene */}
      <div className="mars-canvas-container">
        <Canvas
          camera={{ position: [0, 5, 20], fov: 60 }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, 5]} intensity={0.6} color="#FFA500" />

          <MarsSurface />

          {/* Controllable Avatar */}
          <ThirdPersonAvatar
            position={[0, 1, 5]}
            color="#FF6B35"
          />

          {/* 3D Mission text */}
          <Text
            position={[0, 3, -5]}
            fontSize={1.5}
            color="#FF6B6B"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            MARS MISSION PLANNER
          </Text>

          <Text
            position={[0, 1.5, -5]}
            fontSize={0.4}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            Conquer Your Mountains
          </Text>
        </Canvas>

        {/* Controls hint */}
        <div className="controls-hint">
          <p>🎮 Use WASD or Arrow Keys to move</p>
          <p>⇧ Shift to sprint | Space to jump</p>
        </div>
      </div>

      {/* Mission Control Panel */}
      <div className="mission-control-panel">
        <div className="panel-header">
          <h1>🔴 Mission Control</h1>
          <p className="mars-quote">
            "The warrior who conquers himself is greater than the one who conquers a thousand men in battle."
          </p>
        </div>

        {/* Progress tracker */}
        <div className="progress-section">
          <h2>Mission Progress</h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-stats">
            <span>{completedCount} / {goals.length} missions completed</span>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
        </div>

        {/* Goals list */}
        <div className="goals-section">
          <div className="section-header">
            <h2>Active Missions</h2>
            <button
              className="add-mission-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : '+ New Mission'}
            </button>
          </div>

          {/* Add goal form */}
          {showAddForm && (
            <div className="add-goal-form">
              <input
                type="text"
                placeholder="Mission title..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="goal-input"
              />
              <textarea
                placeholder="Mission description..."
                value={newGoalDesc}
                onChange={(e) => setNewGoalDesc(e.target.value)}
                className="goal-textarea"
              />
              <div className="category-selector">
                <label>Category:</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value as Goal['category'])}
                  className="category-select"
                >
                  <option value="exploration">🚀 Exploration</option>
                  <option value="courage">🦁 Courage</option>
                  <option value="achievement">🏆 Achievement</option>
                  <option value="learning">📚 Learning</option>
                </select>
              </div>
              <button onClick={handleAddGoal} className="submit-goal-btn">
                Launch Mission 🚀
              </button>
            </div>
          )}

          {/* Goals list */}
          <div className="goals-list">
            {goals.length === 0 ? (
              <div className="empty-state">
                <p>🚀 No missions yet. Start your Mars journey!</p>
              </div>
            ) : (
              goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggle={() => toggleGoal(goal.id)}
                  onDelete={() => deleteGoal(goal.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Mars facts */}
        <div className="mars-facts">
          <h3>🔴 Mars Facts</h3>
          <ul>
            <li><strong>Distance from Sun:</strong> 228 million km</li>
            <li><strong>Day length:</strong> 24.6 hours (similar to Earth!)</li>
            <li><strong>Olympus Mons:</strong> Largest volcano in solar system</li>
            <li><strong>Future home:</strong> Most likely planet for human colony</li>
          </ul>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />
    </div>
  )
}
