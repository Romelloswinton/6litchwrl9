/**
 * Audio Controls Component
 *
 * Provides UI controls for the audio system:
 * - Mute/unmute toggle
 * - Volume slider
 * - Minimalist design
 */

import { useState, useEffect } from 'react'
import { getAudioManager } from '../../utils/audio/AudioManager'
import './AudioControls.css'

export function AudioControls() {
  const audioManager = getAudioManager()
  const [settings, setSettings] = useState(audioManager.getSettings())
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Sync settings periodically
    const interval = setInterval(() => {
      setSettings(audioManager.getSettings())
    }, 500)

    return () => clearInterval(interval)
  }, [audioManager])

  const handleToggleMute = () => {
    const newMuted = audioManager.toggleMute()
    setSettings({ ...settings, isMuted: newMuted })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    audioManager.setVolume(volume)
    setSettings({ ...settings, masterVolume: volume })
  }

  return (
    <div className={`audio-controls ${isExpanded ? 'expanded' : ''}`}>
      {/* Mute/Unmute Button */}
      <button
        className="audio-toggle-btn"
        onClick={handleToggleMute}
        onMouseEnter={() => setIsExpanded(true)}
        title={settings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {settings.isMuted ? '🔇' : '🔊'}
      </button>

      {/* Volume Slider (appears on hover) */}
      <div
        className="audio-slider-container"
        onMouseLeave={() => setIsExpanded(false)}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.masterVolume}
          onChange={handleVolumeChange}
          className="audio-slider"
          disabled={settings.isMuted}
        />
        <span className="volume-label">
          {Math.round(settings.masterVolume * 100)}%
        </span>
      </div>
    </div>
  )
}
