/**
 * Perspective Controls
 * Keyboard shortcuts and UI controls for switching perspectives globally
 * Enhances accessibility and power-user experience
 */

import { useEffect, useState } from 'react'
import './PerspectiveControls.css'

type Perspective = 'scientific' | 'mythological' | 'poetic' | 'personal'

interface PerspectiveControlsProps {
  onPerspectiveChange?: (perspective: Perspective) => void
  showUI?: boolean
  enableKeyboardShortcuts?: boolean
}

const PERSPECTIVES: Array<{
  key: Perspective
  label: string
  icon: string
  color: string
  shortcut: string
}> = [
  { key: 'scientific', label: 'Scientific', icon: '🔬', color: '#4A90E2', shortcut: '1' },
  { key: 'mythological', label: 'Mythological', icon: '📜', color: '#C88B3A', shortcut: '2' },
  { key: 'poetic', label: 'Poetic', icon: '✨', color: '#E6B87E', shortcut: '3' },
  { key: 'personal', label: 'Personal Growth', icon: '🌱', color: '#87ceeb', shortcut: '4' },
]

export function PerspectiveControls({
  onPerspectiveChange,
  showUI = true,
  enableKeyboardShortcuts = true
}: PerspectiveControlsProps) {
  const [activePerspective, setActivePerspective] = useState<Perspective>('mythological')
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const perspective = PERSPECTIVES.find(p => p.shortcut === e.key)
      if (perspective) {
        e.preventDefault()
        setActivePerspective(perspective.key)
        onPerspectiveChange?.(perspective.key)
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 2000)
      }

      // Tab key to cycle through perspectives
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault()
        const currentIndex = PERSPECTIVES.findIndex(p => p.key === activePerspective)
        const nextIndex = (currentIndex + 1) % PERSPECTIVES.length
        const nextPerspective = PERSPECTIVES[nextIndex].key
        setActivePerspective(nextPerspective)
        onPerspectiveChange?.(nextPerspective)
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePerspective, enableKeyboardShortcuts, onPerspectiveChange])

  const handlePerspectiveClick = (perspective: Perspective) => {
    setActivePerspective(perspective)
    onPerspectiveChange?.(perspective)
  }

  if (!showUI) return null

  return (
    <>
      {/* Keyboard Shortcut Tooltip */}
      {showTooltip && (
        <div className="perspective-change-notification">
          <span className="notification-icon">
            {PERSPECTIVES.find(p => p.key === activePerspective)?.icon}
          </span>
          <span className="notification-text">
            {PERSPECTIVES.find(p => p.key === activePerspective)?.label} Perspective
          </span>
        </div>
      )}

      {/* UI Controls */}
      <div className="perspective-controls-panel">
        <div className="controls-header">
          <span className="controls-title">View Perspective</span>
          <button
            className="controls-info-btn"
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Show keyboard shortcuts"
          >
            ?
          </button>
        </div>

        <div className="perspective-buttons">
          {PERSPECTIVES.map((perspective) => (
            <button
              key={perspective.key}
              className={`perspective-button ${
                activePerspective === perspective.key ? 'active' : ''
              }`}
              onClick={() => handlePerspectiveClick(perspective.key)}
              style={{
                borderColor: activePerspective === perspective.key
                  ? perspective.color
                  : 'transparent',
                backgroundColor: activePerspective === perspective.key
                  ? `${perspective.color}20`
                  : 'transparent'
              }}
            >
              <span className="button-icon">{perspective.icon}</span>
              <span className="button-label">{perspective.label}</span>
              <span className="button-shortcut">{perspective.shortcut}</span>
            </button>
          ))}
        </div>

        {enableKeyboardShortcuts && (
          <div className="keyboard-hints">
            <span className="hint-item">
              <kbd>1-4</kbd> Switch perspective
            </span>
            <span className="hint-item">
              <kbd>Shift+Tab</kbd> Cycle
            </span>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Minimal floating version for less screen real estate
 */
export function MinimalPerspectiveControls({
  onPerspectiveChange,
  enableKeyboardShortcuts = true
}: Omit<PerspectiveControlsProps, 'showUI'>) {
  const [activePerspective, setActivePerspective] = useState<Perspective>('mythological')
  const [isExpanded, setIsExpanded] = useState(false)

  const handlePerspectiveClick = (perspective: Perspective) => {
    setActivePerspective(perspective)
    onPerspectiveChange?.(perspective)
    setIsExpanded(false)
  }

  const activePerspectiveData = PERSPECTIVES.find(p => p.key === activePerspective)

  return (
    <div className={`minimal-perspective-controls ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="minimal-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ color: activePerspectiveData?.color }}
      >
        <span className="toggle-icon">{activePerspectiveData?.icon}</span>
        <span className="toggle-label">{activePerspectiveData?.label}</span>
      </button>

      {isExpanded && (
        <div className="minimal-dropdown">
          {PERSPECTIVES.map((perspective) => (
            <button
              key={perspective.key}
              className={`minimal-option ${
                activePerspective === perspective.key ? 'active' : ''
              }`}
              onClick={() => handlePerspectiveClick(perspective.key)}
              style={{
                color: activePerspective === perspective.key
                  ? perspective.color
                  : 'white'
              }}
            >
              <span>{perspective.icon}</span>
              <span>{perspective.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
