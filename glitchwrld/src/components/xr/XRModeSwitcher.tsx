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
      setSessionActive(state.session !== null && state.session !== undefined)

      // Track mode based on session existence
      // XR store doesn't expose session mode directly, so we track it via our own state
      if (!state.session) {
        setMode('desktop')
      }
    })

    return unsubscribe
  }, [setMode, setSessionActive])

  const enterVR = () => {
    if (supportsVR) {
      setMode('vr')
      xrStore.enterVR()
    }
  }

  const enterAR = () => {
    if (supportsAR) {
      setMode('ar')
      xrStore.enterAR()
    }
  }

  const exitXR = () => {
    setMode('desktop')
    const session = xrStore.getState().session
    if (session) {
      session.end()
    }
  }

  // Hide the popup if XR is not supported (instead of showing warning)
  if (!supportsVR && !supportsAR) {
    return null
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
