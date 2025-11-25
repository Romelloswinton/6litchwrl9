import { useEffect, useState } from 'react'

export interface KeyboardControls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  sprint: boolean
}

/**
 * Hook to track keyboard input for character movement
 * Supports both WASD and Arrow keys
 */
export function useKeyboardControls(): KeyboardControls {
  const [keys, setKeys] = useState<KeyboardControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: true }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: true }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: true }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: true }))
          break
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: true }))
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys((prev) => ({ ...prev, sprint: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((prev) => ({ ...prev, forward: false }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setKeys((prev) => ({ ...prev, backward: false }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((prev) => ({ ...prev, left: false }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setKeys((prev) => ({ ...prev, right: false }))
          break
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: false }))
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys((prev) => ({ ...prev, sprint: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}
