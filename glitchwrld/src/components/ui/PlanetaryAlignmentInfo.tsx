/**
 * Displays the current date/time for planetary alignment
 * Shows users that planets are positioned based on real astronomical data
 */

import { useState, useEffect } from 'react'
import { formatAstronomicalDate } from '../../utils/orbital/astronomicalCalculations'
import './PlanetaryAlignmentInfo.css'

interface PlanetaryAlignmentInfoProps {
  visible?: boolean
}

export function PlanetaryAlignmentInfo({ visible = true }: PlanetaryAlignmentInfoProps) {
  const [currentDate] = useState(new Date())
  const [isExpanded, setIsExpanded] = useState(false)

  if (!visible) return null

  return (
    <div className="planetary-alignment-info">
      <div
        className="alignment-header"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click for details"
      >
        <span className="alignment-icon">🌍</span>
        <span className="alignment-date">
          {currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <span className="alignment-toggle">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="alignment-details">
          <div className="detail-row">
            <span className="detail-label">Real-time Alignment</span>
          </div>
          <div className="detail-row">
            <span className="detail-value">{formatAstronomicalDate(currentDate)}</span>
          </div>
          <div className="detail-row detail-info">
            <span>✨ Planets positioned using real astronomical calculations</span>
          </div>
          <div className="detail-row detail-info">
            <span>🔭 Based on Keplerian orbital mechanics</span>
          </div>
        </div>
      )}
    </div>
  )
}
