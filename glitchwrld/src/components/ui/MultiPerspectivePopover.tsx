/**
 * Multi-Perspective Popover
 * Interactive tooltip that lets users explore planets from different viewpoints
 * Scientific, Mythological, Poetic, and Personal Growth perspectives
 */

import { useState } from 'react'
import { Html } from '@react-three/drei'
import { MultiPerspectivePlanet, PlanetPerspective } from '../../utils/data/planetPerspectives'
import './MultiPerspectivePopover.css'

interface MultiPerspectivePopoverProps {
  planet: MultiPerspectivePlanet
  position?: [number, number, number]
  visible: boolean
  defaultPerspective?: 'scientific' | 'mythological' | 'poetic' | 'personal'
}

export function MultiPerspectivePopover({
  planet,
  position = [0, 0, 0],
  visible,
  defaultPerspective = 'mythological'
}: MultiPerspectivePopoverProps) {
  const [activePerspective, setActivePerspective] = useState<string>(defaultPerspective)

  if (!visible) return null

  const currentPerspective = planet.perspectives.find(
    p => p.perspective === activePerspective
  ) || planet.perspectives[0]

  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      style={{
        pointerEvents: 'auto',
        transition: 'opacity 0.3s ease-in-out',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="multi-perspective-popover" style={{ borderColor: planet.color }}>
        {/* Header with planet name and symbol */}
        <div className="popover-header" style={{ borderColor: planet.color }}>
          <span className="popover-symbol" style={{ color: planet.color }}>
            {planet.symbol}
          </span>
          <h3 className="popover-planet-name" style={{ color: planet.color }}>
            {planet.name}
          </h3>
        </div>

        {/* Perspective Tab Selector */}
        <div className="perspective-tabs">
          {planet.perspectives.map((perspective) => (
            <button
              key={perspective.perspective}
              className={`perspective-tab ${
                activePerspective === perspective.perspective ? 'active' : ''
              }`}
              onClick={() => setActivePerspective(perspective.perspective)}
              style={{
                borderColor: activePerspective === perspective.perspective ? planet.color : 'transparent',
                color: activePerspective === perspective.perspective ? planet.color : '#aaa'
              }}
            >
              <span className="tab-icon">{perspective.icon}</span>
              <span className="tab-label">{perspective.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="perspective-content">
          <div className="content-header">
            <span className="content-icon">{currentPerspective.icon}</span>
            <h4 className="content-title" style={{ color: planet.color }}>
              {currentPerspective.title}
            </h4>
          </div>

          <p className="content-description">{currentPerspective.content}</p>

          {/* Highlight Tags */}
          <div className="content-highlights">
            {currentPerspective.highlights.map((highlight, index) => (
              <span
                key={index}
                className="highlight-tag"
                style={{
                  borderColor: planet.color,
                  backgroundColor: `${planet.color}15`
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="popover-footer">
          <span className="footer-hint">Click tabs to explore different perspectives</span>
        </div>
      </div>
    </Html>
  )
}

/**
 * Compact version for smaller screens or quick info
 */
interface CompactMultiPerspectivePopoverProps {
  planet: MultiPerspectivePlanet
  position?: [number, number, number]
  visible: boolean
  perspective: 'scientific' | 'mythological' | 'poetic' | 'personal'
}

export function CompactMultiPerspectivePopover({
  planet,
  position = [0, 0, 0],
  visible,
  perspective
}: CompactMultiPerspectivePopoverProps) {
  if (!visible) return null

  const currentPerspective = planet.perspectives.find(
    p => p.perspective === perspective
  ) || planet.perspectives[0]

  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease-in-out',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="compact-multi-perspective-popover" style={{ borderColor: planet.color }}>
        <div className="compact-header">
          <span className="compact-symbol" style={{ color: planet.color }}>
            {planet.symbol}
          </span>
          <span className="compact-planet-name">{planet.name}</span>
          <span className="compact-icon">{currentPerspective.icon}</span>
        </div>
        <div className="compact-content">
          <p className="compact-description">
            {currentPerspective.content.slice(0, 120)}...
          </p>
        </div>
      </div>
    </Html>
  )
}
