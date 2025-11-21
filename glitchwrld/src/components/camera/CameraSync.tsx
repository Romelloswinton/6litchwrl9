// glitchwrld/src/components/camera/CameraSync.tsx

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useHybridStore } from '../../stores/hybridStore'
import * as THREE from 'three'

/**
 * Syncs R3F camera with Zustand store
 * This component must be inside the Canvas
 */
export function CameraSync() {
  const { camera } = useThree()
  const lastPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())

  // Set initial camera position from store on mount
  useEffect(() => {
    const initialPosition = useHybridStore.getState().cameraPosition
    console.log('🎥 CameraSync: Setting initial camera position:', initialPosition.toArray())
    camera.position.copy(initialPosition)
    lastPositionRef.current.copy(initialPosition)
  }, [camera])

  // Use useFrame to check for store changes each frame, but only update if changed
  useFrame(() => {
    const cameraPosition = useHybridStore.getState().cameraPosition

    // Only update if position actually changed
    if (cameraPosition && !lastPositionRef.current.equals(cameraPosition)) {
      console.log('🎥 CameraSync: Updating R3F camera position:', cameraPosition.toArray())
      camera.position.copy(cameraPosition)
      lastPositionRef.current.copy(cameraPosition)
    }
  })

  return null
}
