// glitchwrld/src/components/ui/CameraButtons.tsx

import { useState, useCallback } from 'react'
import { useCameraPresetsSimple } from '../../hooks/camera/useCameraPresetsSimple'

/**
 * Camera control buttons UI (outside Canvas)
 * This component renders HTML buttons for camera control
 */
export function CameraButtons() {
  const { applyPresetAnimated } = useCameraPresetsSimple()
  const [tourRunning, setTourRunning] = useState(false)

  // Quick camera switch
  const quickSwitch = useCallback(
    (presetId: string, name: string) => {
      console.log(`📷 Switching to: ${name}`)
      applyPresetAnimated(presetId, 1500, 'easeInOut')
    },
    [applyPresetAnimated]
  )

  // Automated camera tour
  const startCameraTour = useCallback(() => {
    setTourRunning(true)
    console.log('🎬 Starting camera tour...')

    const tourSequence = [
      { preset: 'your-scene-wide', duration: 2500, wait: 3500 },
      { preset: 'your-scene-front', duration: 2000, wait: 3000 },
      { preset: 'your-scene-closeup', duration: 2000, wait: 3000 },
      { preset: 'your-scene-side', duration: 2000, wait: 3000 },
      { preset: 'your-scene-top', duration: 2500, wait: 3500 },
      { preset: 'your-scene-diagonal', duration: 2500, wait: 3500 },
      { preset: 'your-scene-low', duration: 2500, wait: 3500 },
      { preset: 'your-scene-orbit', duration: 3000, wait: 4000 },
      { preset: 'your-scene-wide', duration: 2500, wait: 0 },
    ]

    let totalTime = 0

    tourSequence.forEach((stop, index) => {
      setTimeout(() => {
        console.log(`📷 Tour ${index + 1}/${tourSequence.length}: ${stop.preset}`)
        applyPresetAnimated(stop.preset, stop.duration, 'easeInOut')

        if (index === tourSequence.length - 1) {
          setTimeout(() => {
            setTourRunning(false)
            console.log('✅ Camera tour complete!')
          }, stop.duration)
        }
      }, totalTime)

      totalTime += stop.duration + stop.wait
    })
  }, [applyPresetAnimated])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '95vw',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={() => quickSwitch('your-scene-wide', 'Wide')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Wide establishing shot"
      >
        📷 Wide
      </button>

      <button
        onClick={() => quickSwitch('your-scene-front', 'Front')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Front view"
      >
        🎯 Front
      </button>

      <button
        onClick={() => quickSwitch('your-scene-closeup', 'Close-up')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Close-up detail"
      >
        🔍 Close
      </button>

      <button
        onClick={() => quickSwitch('your-scene-side', 'Side')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Side profile"
      >
        ↔️ Side
      </button>

      <button
        onClick={() => quickSwitch('your-scene-top', 'Top')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Top-down view"
      >
        ⬇️ Top
      </button>

      <button
        onClick={() => quickSwitch('your-scene-diagonal', 'Hero')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Diagonal hero shot"
      >
        ⭐ Hero
      </button>

      <button
        onClick={() => quickSwitch('your-scene-low', 'Drama')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Dramatic low angle"
      >
        🎭 Drama
      </button>

      <button
        onClick={() => quickSwitch('your-scene-orbit', 'Orbit')}
        style={buttonStyle}
        disabled={tourRunning}
        title="Cinematic orbit"
      >
        🎬 Orbit
      </button>

      <button
        onClick={startCameraTour}
        style={{
          ...buttonStyle,
          backgroundColor: tourRunning ? '#666' : '#4CAF50',
          minWidth: '120px',
          fontWeight: 'bold',
        }}
        disabled={tourRunning}
        title="Start automated camera tour"
      >
        {tourRunning ? '🎥 Tour Running...' : '▶️ Start Tour'}
      </button>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '13px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontWeight: '500',
  whiteSpace: 'nowrap',
}
