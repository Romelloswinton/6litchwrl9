/**
 * Simple keyboard navigation for desktop solar system viewing
 *
 * Controls:
 * - Arrow Keys / WASD: Rotate camera around solar system
 * - Q/E or -/+: Zoom in/out
 * - Spacebar: Reset camera to default position
 * - 1-8: Focus on specific planets (1=Mercury, 2=Venus, etc.)
 */

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useHybridStore } from '../../stores/hybridStore'
import * as THREE from 'three'

const ROTATION_SPEED = 0.05
const ZOOM_SPEED = 5
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 30, 70)

export function useKeyboardControls() {
  const { camera } = useThree()
  const { cameraPosition, setCameraPosition, cameraTarget, setCameraTarget } = useHybridStore()

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      const key = event.key.toLowerCase()
      const currentPos = camera.position.clone()
      const currentTarget = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z)

      // Calculate current distance from center
      const distance = currentPos.length()

      // Rotation around Y axis (left/right)
      if (key === 'arrowleft' || key === 'a') {
        const angle = ROTATION_SPEED
        const newX = currentPos.x * Math.cos(angle) - currentPos.z * Math.sin(angle)
        const newZ = currentPos.x * Math.sin(angle) + currentPos.z * Math.cos(angle)
        setCameraPosition(new THREE.Vector3(newX, currentPos.y, newZ))
      }

      if (key === 'arrowright' || key === 'd') {
        const angle = -ROTATION_SPEED
        const newX = currentPos.x * Math.cos(angle) - currentPos.z * Math.sin(angle)
        const newZ = currentPos.x * Math.sin(angle) + currentPos.z * Math.cos(angle)
        setCameraPosition(new THREE.Vector3(newX, currentPos.y, newZ))
      }

      // Vertical movement (up/down)
      if (key === 'arrowup' || key === 'w') {
        const newY = currentPos.y + ZOOM_SPEED * 0.5
        setCameraPosition(new THREE.Vector3(currentPos.x, newY, currentPos.z))
      }

      if (key === 'arrowdown' || key === 's') {
        const newY = currentPos.y - ZOOM_SPEED * 0.5
        setCameraPosition(new THREE.Vector3(currentPos.x, newY, currentPos.z))
      }

      // Zoom in/out (Q/E or -/+)
      if (key === 'q' || key === '-') {
        const zoomFactor = (distance + ZOOM_SPEED) / distance
        setCameraPosition(currentPos.multiplyScalar(zoomFactor))
      }

      if (key === 'e' || key === '=' || key === '+') {
        const zoomFactor = Math.max((distance - ZOOM_SPEED) / distance, 0.1)
        setCameraPosition(currentPos.multiplyScalar(zoomFactor))
      }

      // Reset camera (Spacebar)
      if (key === ' ') {
        event.preventDefault()
        setCameraPosition(DEFAULT_CAMERA_POSITION.clone())
        setCameraTarget(new THREE.Vector3(0, 0, 0))
        console.log('📷 Camera reset to default position')
      }

      // Planet focus shortcuts (1-8)
      const planetFocusPositions: Record<string, THREE.Vector3> = {
        '1': new THREE.Vector3(1.5, 10, 15),   // Mercury
        '2': new THREE.Vector3(3, 12, 18),     // Venus
        '3': new THREE.Vector3(4, 15, 20),     // Earth
        '4': new THREE.Vector3(6, 18, 25),     // Mars
        '5': new THREE.Vector3(16, 25, 40),    // Jupiter
        '6': new THREE.Vector3(22, 30, 50),    // Saturn
        '7': new THREE.Vector3(33, 35, 65),    // Uranus
        '8': new THREE.Vector3(41, 40, 80),    // Neptune
      }

      if (planetFocusPositions[key]) {
        setCameraPosition(planetFocusPositions[key])
        console.log(`🪐 Focused on planet ${key}`)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [camera, cameraPosition, cameraTarget, setCameraPosition, setCameraTarget])
}
