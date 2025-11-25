import { useRef, useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application, SPEObject } from '@splinetool/runtime'
import { useHybridStore } from '../../stores/hybridStore'
import './EarthSplineScene.css'

export function EarthSplineScene() {
  const { earthSplineUrl, setSceneMode } = useHybridStore()
  const splineRef = useRef<Application | null>(null)
  const ballRef = useRef<SPEObject | null>(null)
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())
  const animationFrameRef = useRef<number | null>(null)

  const handleBackClick = () => {
    setSceneMode('galaxy')
  }

  const onLoad = (splineApp: Application) => {
    console.log('🎮 Spline scene loaded!')
    splineRef.current = splineApp

    // CRITICAL: Disable Spline's built-in camera controls
    // This prevents the camera from responding to keyboard input
    if (splineApp._camera) {
      console.log('🎥 Disabling Spline camera controls...')
      splineApp._camera.enableZoom = false
      splineApp._camera.enableRotate = false
      splineApp._camera.enablePan = false
    }

    // Also disable orbit controls if they exist
    const canvas = splineApp.canvas
    if (canvas) {
      canvas.style.pointerEvents = 'auto' // Keep mouse events for other interactions
    }

    // Try to find the ball object - common names in Spline scenes
    const possibleNames = ['Sphere', 'Ball', 'sphere', 'ball', 'Circle', 'circle', 'Sphere 2']

    for (const name of possibleNames) {
      const obj = splineApp.findObjectByName(name)
      if (obj) {
        ballRef.current = obj
        console.log(`✅ Found ball object: "${name}"`)
        console.log('📍 Initial position:', { x: obj.position.x, y: obj.position.y, z: obj.position.z })
        break
      }
    }

    if (!ballRef.current) {
      console.warn('⚠️ Could not find ball object. Available objects:')
      // Log all objects to help debug
      const allObjects = splineApp.getAllObjects()
      allObjects.forEach((obj: SPEObject) => {
        console.log(`  - "${obj.name}" (type: ${obj.type})`)
      })
    }
  }

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        setKeysPressed(prev => {
          const next = new Set(prev)
          next.add(e.key)
          return next
        })

        console.log('🎮 Key pressed:', e.key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        setKeysPressed(prev => {
          const next = new Set(prev)
          next.delete(e.key)
          return next
        })

        console.log('🎮 Key released:', e.key)
      }
    }

    // Add listeners to window with capture phase to intercept before Spline
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('keyup', handleKeyUp, { capture: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('keyup', handleKeyUp, { capture: true })
    }
  }, [])

  // Movement loop using requestAnimationFrame for smoother updates
  useEffect(() => {
    const moveSpeed = 0.5 // Units per frame (reduced for finer control)

    const animate = () => {
      if (!ballRef.current || keysPressed.size === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const ball = ballRef.current

      // Get current position
      let newX = ball.position.x
      let newY = ball.position.y
      let newZ = ball.position.z

      // Apply movement based on pressed keys
      // Note: In 3D space, Y is typically up/down, X is left/right, Z is forward/back
      if (keysPressed.has('ArrowUp')) {
        newZ -= moveSpeed // Move forward (away from camera)
      }
      if (keysPressed.has('ArrowDown')) {
        newZ += moveSpeed // Move backward (toward camera)
      }
      if (keysPressed.has('ArrowLeft')) {
        newX -= moveSpeed // Move left
      }
      if (keysPressed.has('ArrowRight')) {
        newX += moveSpeed // Move right
      }

      // Update position
      ball.position.x = newX
      ball.position.y = newY
      ball.position.z = newZ

      console.log('⚽ Ball position:', { x: newX.toFixed(2), y: newY.toFixed(2), z: newZ.toFixed(2) })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [keysPressed])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  if (!earthSplineUrl) {
    return (
      <div className="earth-spline-scene">
        <div className="error-message">No Spline scene URL configured</div>
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Galaxy
        </button>
      </div>
    )
  }

  return (
    <div className="earth-spline-scene">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Galaxy
      </button>
      <div className="controls-hint">
        Use Arrow Keys to move the ball
      </div>
      <Spline
        scene={earthSplineUrl}
        onLoad={onLoad}
      />
    </div>
  )
}
