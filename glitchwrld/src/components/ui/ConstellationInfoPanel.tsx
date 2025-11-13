/**
 * Constellation Info Panel
 *
 * Displays detailed information about the currently hovered constellation
 */

import { useState, useEffect } from 'react'
import type { Constellation } from '../../utils/data/constellationDatabase'

interface ConstellationInfoPanelProps {
  constellation: Constellation | null
}

export function ConstellationInfoPanel({ constellation }: ConstellationInfoPanelProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (constellation) {
      setVisible(true)
    } else {
      // Delay hiding to allow smooth transition
      const timeout = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [constellation])

  if (!visible && !constellation) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        maxWidth: '400px',
        background: 'rgba(0, 0, 17, 0.95)',
        border: `2px solid ${constellation?.accentColor || '#87ceeb'}`,
        borderRadius: '12px',
        padding: '20px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        zIndex: 900,
        opacity: constellation ? 1 : 0,
        transform: constellation ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: constellation ? 'auto' : 'none',
      }}
    >
      {constellation && (
        <>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: `1px solid ${constellation.accentColor}40`,
            paddingBottom: '12px'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                color: constellation.accentColor,
                textShadow: `0 0 10px ${constellation.accentColor}80`
              }}>
                {constellation.name}
              </h2>
              <div style={{
                fontSize: '12px',
                color: '#87ceeb',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: '600'
              }}>
                {constellation.tradition === 'western' && 'Western Mythology'}
                {constellation.tradition === 'eastern' && `Eastern • ${constellation.direction?.toUpperCase()} • ${constellation.season?.toUpperCase()}`}
                {constellation.tradition === 'zodiac' && 'Zodiac'}
              </div>
            </div>
          </div>

          {/* Star count and metadata */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#aaaaaa'
          }}>
            <div style={{
              background: 'rgba(135, 206, 235, 0.1)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(135, 206, 235, 0.2)'
            }}>
              ⭐ {constellation.stars.length} stars
            </div>
            {constellation.skyPosition && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                📍 RA: {constellation.skyPosition.ra}h, Dec: {constellation.skyPosition.dec}°
              </div>
            )}
          </div>

          {/* Mythology story */}
          <div style={{
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#dddddd',
            marginBottom: '16px',
            maxHeight: '180px',
            overflowY: 'auto',
            paddingRight: '8px',
            // Custom scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: `${constellation.accentColor} rgba(0,0,0,0.3)`
          }}>
            <div style={{
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Mythology
            </div>
            {constellation.mythology}
          </div>

          {/* Notable stars (if any have names) */}
          {constellation.stars.some(s => s.name) && (
            <div style={{
              background: 'rgba(135, 206, 235, 0.05)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(135, 206, 235, 0.15)',
              fontSize: '12px'
            }}>
              <div style={{
                fontWeight: '600',
                color: '#87ceeb',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Notable Stars
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                color: '#cccccc'
              }}>
                {constellation.stars
                  .filter(s => s.name)
                  .map((star, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      {star.name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Subtle hint */}
          <div style={{
            marginTop: '12px',
            fontSize: '11px',
            color: '#666666',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Hover over constellations to explore their stories
          </div>
        </>
      )}
    </div>
  )
}
