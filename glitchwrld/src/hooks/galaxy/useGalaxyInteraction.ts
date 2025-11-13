import { useRef, useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useHybridStore } from '../../stores/hybridStore'
import * as THREE from 'three'

export function useGalaxyInteraction() {
  const { camera, raycaster, mouse } = useThree()
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionRef = useRef<{
    startPosition: THREE.Vector2
    startCameraPosition: THREE.Vector3
    isDragging: boolean
  }>({
    startPosition: new THREE.Vector2(),
    startCameraPosition: new THREE.Vector3(),
    isDragging: false,
  })

  const {
    setHoveredObject,
    setSelectedObject,
    setCameraPosition,
    setCameraTarget,
  } = useHybridStore()

  const handlePointerDown = useCallback((event: THREE.Event) => {
    setIsInteracting(true)
    interactionRef.current.isDragging = true
    interactionRef.current.startPosition.set(mouse.x, mouse.y)
    interactionRef.current.startCameraPosition.copy(camera.position)
  }, [camera.position, mouse])

  const handlePointerMove = useCallback((event: THREE.Event) => {
    if (!interactionRef.current.isDragging) return

    // Calculate camera movement based on mouse delta
    const deltaX = mouse.x - interactionRef.current.startPosition.x
    const deltaY = mouse.y - interactionRef.current.startPosition.y

    // Update camera position with smooth movement
    const newPosition = interactionRef.current.startCameraPosition.clone()
    newPosition.x -= deltaX * 10
    newPosition.y += deltaY * 10

    setCameraPosition(newPosition)
  }, [mouse, setCameraPosition])

  const handlePointerUp = useCallback(() => {
    setIsInteracting(false)
    interactionRef.current.isDragging = false
  }, [])

  const handleObjectHover = useCallback((object: THREE.Object3D | null) => {
    if (object && object.userData.name) {
      setHoveredObject(object.userData.name)
      document.body.style.cursor = 'pointer'
    } else {
      setHoveredObject(null)
      document.body.style.cursor = 'default'
    }
  }, [setHoveredObject])

  const handleObjectClick = useCallback((object: THREE.Object3D | null) => {
    if (object && object.userData.name) {
      setSelectedObject(object.userData.name)
      
      // Animate camera to focus on the selected object
      const targetPosition = object.position.clone()
      targetPosition.add(new THREE.Vector3(5, 5, 5))
      
      setCameraPosition(targetPosition)
      setCameraTarget(object.position)
    } else {
      setSelectedObject(null)
    }
  }, [setSelectedObject, setCameraPosition, setCameraTarget])

  const animateCameraTo = useCallback((
    targetPosition: THREE.Vector3,
    targetLookAt?: THREE.Vector3,
    duration = 2000
  ) => {
    const startPosition = camera.position.clone()
    const startLookAt = new THREE.Vector3(0, 0, 0) // Current look-at target
    const endLookAt = targetLookAt || new THREE.Vector3(0, 0, 0)
    
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      // Interpolate position
      const currentPosition = new THREE.Vector3().lerpVectors(startPosition, targetPosition, easeProgress)
      setCameraPosition(currentPosition)
      
      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, easeProgress)
      setCameraTarget(currentLookAt)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [camera.position, setCameraPosition, setCameraTarget])

  const getIntersections = useCallback((event: MouseEvent) => {
    // Update mouse coordinates
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Update raycaster
    raycaster.setFromCamera(mouse, camera)
    
    // Return intersected objects (you'll need to provide the scene objects)
    return []
  }, [mouse, raycaster, camera])

  return {
    isInteracting,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleObjectHover,
    handleObjectClick,
    animateCameraTo,
    getIntersections,
  }
}