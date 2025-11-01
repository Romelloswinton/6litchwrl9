// glitchwrld/src/components/xr/XRModeSwitcher.tsx

import { useEffect } from 'react'
import { createXRStore } from '@react-three/xr'
import { useXRStore } from '../../stores/xrStore'
import './XRModeSwitcher.css'

// Create and export XR store instance
export const xrStore = createXRStore()

export function XRModeSwitcher() {
  const { mode, supportsVR, supportsAR, setXRSupported, setMode, setSessionActive } = useXRStore()

  // Check XR support on mount
  useEffect(() => {
    const checkXRSupport = async () => {
      if (!navigator.xr) {
        setXRSupported(false, false)
        return
      }

      try {
        const [vrSupported, arSupported] = await Promise.all([
          navigator.xr.isSessionSupported('immersive-vr'),
          navigator.xr.isSessionSupported('immersive-ar'),
        ])

        setXRSupported(vrSupported, arSupported)
      } catch (error) {
        console.warn('XR support check failed:', error)
        setXRSupported(false, false)
      }
    }

    checkXRSupport()
  }, [setXRSupported])

  // Listen to XR session state
  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      setSessionActive(state !== null)
      if (state === 'immersive-vr') {
        setMode('vr')
      } else if (state === 'immersive-ar') {
        setMode('ar')
      } else {
        setMode('desktop')
      }
    })

    return unsubscribe
  }, [setMode, setSessionActive])

  const enterVR = () => {
    if (supportsVR) {
      xrStore.enterVR()
    }
  }

  const enterAR = () => {
    if (supportsAR) {
      xrStore.enterAR()
    }
  }

  const exitXR = () => {
    xrStore.exit()
  }

  if (!supportsVR && !supportsAR) {
    return (
      <div className="xr-mode-switcher">
        <div className="xr-unsupported">
          <p>🚫 WebXR not supported on this device</p>
          <small>Try using a VR headset browser or AR-enabled mobile device</small>
        </div>
      </div>
    )
  }

  return (
    <div className="xr-mode-switcher">
      <div className="xr-buttons">
        {supportsVR && (
          <button
            className={`xr-btn vr-btn ${mode === 'vr' ? 'active' : ''}`}
            onClick={mode === 'vr' ? exitXR : enterVR}
            disabled={mode === 'ar'}
          >
            <span className="xr-icon">🥽</span>
            <span className="xr-label">{mode === 'vr' ? 'Exit VR' : 'Enter VR'}</span>
          </button>
        )}

        {supportsAR && (
          <button
            className={`xr-btn ar-btn ${mode === 'ar' ? 'active' : ''}`}
            onClick={mode === 'ar' ? exitXR : enterAR}
            disabled={mode === 'vr'}
          >
            <span className="xr-icon">📱</span>
            <span className="xr-label">{mode === 'ar' ? 'Exit AR' : 'Enter AR'}</span>
          </button>
        )}
      </div>

      {mode !== 'desktop' && (
        <div className="xr-status">
          <div className="xr-status-indicator active"></div>
          <span>{mode === 'vr' ? 'VR Mode Active' : 'AR Mode Active'}</span>
        </div>
      )}
    </div>
  )
}
