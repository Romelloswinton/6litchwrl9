/**
 * Celestial Tooltip - Displays astrological symbolism on hover
 * Beautiful, informative overlay for planets and moons
 */

import { Html } from '@react-three/drei'
import { CelestialSymbolism } from '../../utils/data/celestialSymbolism'
import './CelestialTooltip.css'

interface CelestialTooltipProps {
  symbolism: CelestialSymbolism
  position?: [number, number, number]
  visible: boolean
}

export function CelestialTooltip({ symbolism, position = [0, 0, 0], visible }: CelestialTooltipProps) {
  if (!visible) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease-in-out',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="celestial-tooltip">
        <div className="tooltip-header" style={{ borderColor: symbolism.color }}>
          <span className="tooltip-symbol" style={{ color: symbolism.color }}>
            {symbolism.symbol}
          </span>
          <div className="tooltip-title">
            <h3 className="tooltip-name">{symbolism.name}</h3>
            <p className="tooltip-archetype" style={{ color: symbolism.color }}>
              {symbolism.archetype}
            </p>
          </div>
        </div>

        <div className="tooltip-body">
          <div className="tooltip-essence">
            <span className="essence-label">Essence:</span>
            <span className="essence-value" style={{ color: symbolism.color }}>
              {symbolism.essence}
            </span>
          </div>

          <div className="tooltip-keywords">
            {symbolism.keywords.map((keyword, index) => (
              <span
                key={index}
                className="keyword-tag"
                style={{ borderColor: symbolism.color }}
              >
                {keyword}
              </span>
            ))}
          </div>

          <p className="tooltip-description">{symbolism.description}</p>

          {symbolism.mythologyNote && (
            <div className="tooltip-mythology">
              <span className="mythology-icon">📜</span>
              <p className="mythology-text">{symbolism.mythologyNote}</p>
            </div>
          )}
        </div>
      </div>
    </Html>
  )
}

/**
 * Compact Tooltip - Minimal version for quick info
 */
interface CompactTooltipProps {
  name: string
  symbol: string
  essence: string
  color: string
  position?: [number, number, number]
  visible: boolean
}

export function CompactCelestialTooltip({
  name,
  symbol,
  essence,
  color,
  position = [0, 0, 0],
  visible
}: CompactTooltipProps) {
  if (!visible) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease-in-out',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="celestial-tooltip-compact">
        <span className="compact-symbol" style={{ color }}>
          {symbol}
        </span>
        <div className="compact-info">
          <div className="compact-name">{name}</div>
          <div className="compact-essence" style={{ color }}>
            {essence}
          </div>
        </div>
      </div>
    </Html>
  )
}
