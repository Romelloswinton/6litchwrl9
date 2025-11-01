import { useState } from "react"
import "./SplineSoundControls.css"
import {
  useSplineSound,
  type SplineSoundConfig,
} from "../../../hooks/useSplineSound"

export function SplineSoundControls() {
  const [config, setConfig] = useState<SplineSoundConfig>({
    enabled: false,
    masterVolume: 0.3,
    gravitationalWaveGain: 0.2,
    orbitalResonanceGain: 0.3,
    darkMatterGain: 0.1,
    frequencyRange: [40, 1000],
  })

  const splineSound = useSplineSound(config)

  const updateConfig = (updates: Partial<SplineSoundConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="spline-sound-controls">
      <div className="control-header">
        <h3>🔊 Spline Sound</h3>
        <div className="status">
          {splineSound.isInitialized
            ? splineSound.isPlaying
              ? "🎵 Playing"
              : "⏸️ Ready"
            : "❌ Disabled"}
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
          />
          Enable Spline Sound
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Main Controls */}
          <div className="control-group">
            <label>Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.masterVolume}
              onChange={(e) =>
                updateConfig({ masterVolume: parseFloat(e.target.value) })
              }
            />
            <span>{(config.masterVolume * 100).toFixed(0)}%</span>
          </div>

          <div className="control-row">
            <button
              onClick={splineSound.start}
              disabled={splineSound.isPlaying || !splineSound.isInitialized}
              className="play-button"
            >
              ▶️ Play Galaxy
            </button>
            <button
              onClick={splineSound.stop}
              disabled={!splineSound.isPlaying}
              className="stop-button"
            >
              ⏹️ Stop
            </button>
          </div>

          {/* Physics Layer Controls */}
          <div className="physics-controls">
            <h4>Physics Layers</h4>

            <div className="control-group">
              <label>Gravitational Waves</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.gravitationalWaveGain}
                onChange={(e) =>
                  updateConfig({
                    gravitationalWaveGain: parseFloat(e.target.value),
                  })
                }
              />
              <span>{splineSound.gravitationalWaves.length} sources</span>
            </div>

            <div className="control-group">
              <label>Orbital Resonances</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.orbitalResonanceGain}
                onChange={(e) =>
                  updateConfig({
                    orbitalResonanceGain: parseFloat(e.target.value),
                  })
                }
              />
              <span>{splineSound.orbitalResonances.length} harmonics</span>
            </div>

            <div className="control-group">
              <label>Dark Matter</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.02"
                value={config.darkMatterGain}
                onChange={(e) =>
                  updateConfig({ darkMatterGain: parseFloat(e.target.value) })
                }
              />
              <span>{splineSound.darkMatterOscillations.length} nodes</span>
            </div>
          </div>

          {/* Statistics Display */}
          <div className="stats-display">
            <h4>Galaxy Audio Stats</h4>
            <div className="stat-row">
              <span>Total Frequencies:</span>
              <span>{splineSound.stats.totalFrequencies}</span>
            </div>
            <div className="stat-row">
              <span>Frequency Range:</span>
              <span>
                {config.frequencyRange[0]}-{config.frequencyRange[1]} Hz
              </span>
            </div>
            <div className="stat-row">
              <span>Stars Analyzed:</span>
              <span>{splineSound.stats.starCount.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span>Resonance Groups:</span>
              <span>{splineSound.stats.resonanceCount}</span>
            </div>
            <div className="stat-row">
              <span>Dark Matter Nodes:</span>
              <span>{splineSound.stats.darkMatterNodes}</span>
            </div>
          </div>

          {/* Frequency Breakdown */}
          {splineSound.isInitialized && (
            <div className="frequency-breakdown">
              <h4>Active Frequencies</h4>
              <div className="frequency-zones">
                {splineSound.gravitationalWaves.slice(0, 5).map((wave, i) => (
                  <div key={i} className={`freq-bar zone-${wave.zone}`}>
                    <span>{wave.frequency.toFixed(1)}Hz</span>
                    <div
                      className="bar"
                      style={{ width: `${wave.amplitude * 1000}%` }}
                    ></div>
                    <span>{wave.zone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
