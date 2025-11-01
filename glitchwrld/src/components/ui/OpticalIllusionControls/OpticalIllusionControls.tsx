import { useHybridStore } from '../../../stores/hybridStore'
import { IllusionSettings } from '../../../stores/illusionSlice'
import './OpticalIllusionControls.css'

export function OpticalIllusionControls() {
  const sceneMode = useHybridStore((state) => state.sceneMode)
  const illusionSettings = useHybridStore((state) => state.illusionSettings)
  const setIllusionSettings = useHybridStore((state) => state.setIllusionSettings)

  const updateSetting = (key: keyof IllusionSettings, value: number | boolean) => {
    setIllusionSettings({ [key]: value })
  }

  // Don't show controls in solar system mode
  if (sceneMode === 'solarSystem') return null

  return (
    <div className="optical-illusion-controls">
      <div className="control-header">
        <h3>🌀 Optical Illusion</h3>
        <div className="status">
          {illusionSettings.enabled ? '✨ Active' : '⏸️ Disabled'}
        </div>
      </div>

      {/* Main Toggle */}
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={illusionSettings.enabled}
            onChange={(e) => updateSetting('enabled', e.target.checked)}
          />
          Enable Planet Illusion
        </label>
      </div>

      {illusionSettings.enabled && (
        <>
          {/* Synchronization Controls */}
          <div className="control-section">
            <h4>Motion Synchronization</h4>
            
            <div className="control-group">
              <label>Starfield Sync</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.synchronization}
                onChange={(e) => updateSetting('synchronization', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.synchronization * 100)}%</span>
            </div>

            <div className="control-group">
              <label>Gentle Motion</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.gentleMotion}
                onChange={(e) => updateSetting('gentleMotion', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.gentleMotion * 100)}%</span>
            </div>

            <div className="control-group">
              <label>Vertical Bobbing</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.verticalMotion}
                onChange={(e) => updateSetting('verticalMotion', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.verticalMotion * 100)}%</span>
            </div>
          </div>

          {/* Visual Effects */}
          <div className="control-section">
            <h4>Visual Effects</h4>

            <div className="control-group">
              <label>Parallax Strength</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={illusionSettings.parallaxStrength}
                onChange={(e) => updateSetting('parallaxStrength', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.parallaxStrength * 100)}%</span>
            </div>

            <div className="control-group">
              <label>Camera Parallax</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={illusionSettings.cameraParallaxStrength}
                onChange={(e) => updateSetting('cameraParallaxStrength', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.cameraParallaxStrength * 100)}%</span>
            </div>

            <div className="control-group">
              <label>Parallax Smoothness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.parallaxSmoothness}
                onChange={(e) => updateSetting('parallaxSmoothness', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.parallaxSmoothness * 100)}%</span>
            </div>

            <div className="control-group">
              <label>Depth Separation</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.depthSeparation}
                onChange={(e) => updateSetting('depthSeparation', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.depthSeparation * 100)}%</span>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={illusionSettings.sizePulsing}
                  onChange={(e) => updateSetting('sizePulsing', e.target.checked)}
                />
                Size Pulsing
              </label>
            </div>

            <div className="control-group">
              <label>Rotation Variation</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={illusionSettings.rotationVariation}
                onChange={(e) => updateSetting('rotationVariation', parseFloat(e.target.value))}
              />
              <span>{Math.round(illusionSettings.rotationVariation * 100)}%</span>
            </div>
          </div>

          {/* Illusion Presets */}
          <div className="control-section">
            <h4>Presets</h4>
            <div className="preset-buttons">
              <button
                onClick={() => {
                  setIllusionSettings({
                    synchronization: 0.9,
                    gentleMotion: 0.1,
                    parallaxStrength: 0.1,
                    cameraParallaxStrength: 0.1,
                    parallaxSmoothness: 0.8,
                    depthSeparation: 0.3,
                    rotationVariation: 0.2,
                    verticalMotion: 0.2
                  })
                }}
                className="preset-btn subtle"
              >
                Subtle
              </button>

              <button
                onClick={() => {
                  setIllusionSettings({
                    synchronization: 0.7,
                    gentleMotion: 0.5,
                    parallaxStrength: 0.3,
                    cameraParallaxStrength: 0.4,
                    parallaxSmoothness: 0.6,
                    depthSeparation: 0.6,
                    rotationVariation: 0.4,
                    verticalMotion: 0.6
                  })
                }}
                className="preset-btn dynamic"
              >
                Dynamic
              </button>

              <button
                onClick={() => {
                  setIllusionSettings({
                    synchronization: 0.5,
                    gentleMotion: 0.8,
                    parallaxStrength: 0.5,
                    cameraParallaxStrength: 0.7,
                    parallaxSmoothness: 0.4,
                    depthSeparation: 0.8,
                    rotationVariation: 0.7,
                    verticalMotion: 0.8
                  })
                }}
                className="preset-btn hypnotic"
              >
                Hypnotic
              </button>
            </div>
          </div>

          {/* Status Display */}
          <div className="illusion-status">
            <div className="status-row">
              <span>Effect Strength:</span>
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(illusionSettings.synchronization + illusionSettings.gentleMotion + illusionSettings.parallaxStrength) / 3 * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div className="status-row">
              <span>Motion Type:</span>
              <span>
                {illusionSettings.synchronization > 0.7 ? 'Synchronized' :
                 illusionSettings.gentleMotion > 0.7 ? 'Independent' : 'Balanced'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}