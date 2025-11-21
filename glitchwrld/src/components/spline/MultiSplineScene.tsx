// glitchwrld/src/components/spline/MultiSplineScene.tsx

import { Suspense, useEffect, useRef } from 'react'
import useSpline from '@splinetool/r3f-spline'
import { useHybridStore } from '../../stores/hybridStore'
import { useXRStore } from '../../stores/xrStore'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import {
  splineModelManager,
  SplineModelConfig,
} from '../../utils/spline/splineModelManager'

/**
 * Single Spline Model Component
 * Renders one Spline scene with all its features
 */
interface SplineModelProps {
  config: SplineModelConfig
}

function SplineModelContent({ config }: SplineModelProps) {
  const { nodes, materials } = useSpline(config.url)
  const groupRef = useRef<THREE.Group>(null)
  const { mode: xrMode, galaxyScale } = useXRStore()
  const setHoveredObject = useHybridStore((state) => state.setHoveredObject)
  const setSelectedObject = useHybridStore((state) => state.setSelectedObject)
  const isAnimating = useHybridStore((state) => state.isAnimating)

  // Mark scene as loaded
  useEffect(() => {
    if (Object.keys(nodes).length > 0) {
      splineModelManager.markSceneLoaded(config.id, { nodes, materials })
    }
  }, [nodes, materials, config.id])

  // Mouse event handlers
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!config.interaction?.clickable) return
    e.stopPropagation()

    if (e.object?.name) {
      setSelectedObject(e.object.name)
      config.interaction?.onClick?.(e.object.name)
      console.log(`🖱️ Clicked ${config.name}:`, e.object.name)
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!config.interaction?.hoverable) return
    e.stopPropagation()

    if (e.object?.name) {
      setHoveredObject(e.object.name)
      config.interaction?.onHover?.(e.object.name)
    }
  }

  const handlePointerOut = () => {
    if (!config.interaction?.hoverable) return
    setHoveredObject(null)
  }

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current || !isAnimating) return

    const group = groupRef.current
    const anim = config.animation

    // Rotation animation
    if (anim?.rotate) {
      group.rotation.x += delta * 0.1 * (anim.rotationSpeed ?? 1)
      group.rotation.y += delta * 0.15 * (anim.rotationSpeed ?? 1)
      group.rotation.z += delta * 0.05 * (anim.rotationSpeed ?? 1)
    }

    // Pulse animation
    if (anim?.pulse) {
      const pulseScale =
        1 + Math.sin(state.clock.elapsedTime * (anim.pulseSpeed ?? 1)) * 0.1
      const baseScale = config.scale ?? 1
      group.scale.setScalar(baseScale * pulseScale)
    }

    // Orbital animation
    if (anim?.orbit) {
      const orbitRadius = 5
      const orbitSpeed = state.clock.elapsedTime * (anim.orbitSpeed ?? 1)
      const x = Math.cos(orbitSpeed) * orbitRadius
      const z = Math.sin(orbitSpeed) * orbitRadius
      group.position.x = (config.position?.[0] ?? 0) + x
      group.position.z = (config.position?.[2] ?? 0) + z
    }
  })

  // Calculate position and scale based on XR mode
  const position = new THREE.Vector3(
    ...(config.position || [0, 0, 0])
  ).toArray()

  // Apply XR position offset for AR mode
  if (xrMode === 'ar' && config.xr?.arPositionOffset) {
    position[0] += config.xr.arPositionOffset[0]
    position[1] += config.xr.arPositionOffset[1]
    position[2] += config.xr.arPositionOffset[2]
  }

  // Calculate scale based on XR mode
  let finalScale = config.scale ?? 1
  if (xrMode === 'ar') {
    finalScale *= (config.xr?.arScale ?? 0.1) * galaxyScale
  } else if (xrMode === 'vr') {
    finalScale *= (config.xr?.vrScale ?? 0.3) * galaxyScale
  }

  const rotation = config.rotation || [0, 0, 0]

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={finalScale}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {Object.keys(nodes).map((key) => {
        const node = nodes[key]
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              name={`${config.id}_${key}`}
              geometry={node.geometry}
              material={materials[node.material?.name] || node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          )
        }
        return null
      })}
    </group>
  )
}

/**
 * Wrapper component for a single model with Suspense
 */
function SplineModel({ config }: SplineModelProps) {
  if (!config.visible) return null

  return (
    <Suspense fallback={null}>
      <SplineModelContent config={config} />
    </Suspense>
  )
}

/**
 * Multi-Spline Scene Manager
 * Renders all registered Spline models
 */
export function MultiSplineScene() {
  const showSpline = useHybridStore((state) => state.layers.spline.visible)
  const models = splineModelManager.getVisibleModels()

  if (!showSpline) return null

  return (
    <>
      {models.map((config) => (
        <SplineModel key={config.id} config={config} />
      ))}
    </>
  )
}

/**
 * Hook to easily register and manage Spline models
 */
export function useSplineModels() {
  const registerModel = (config: SplineModelConfig) => {
    splineModelManager.registerModel(config)
  }

  const unregisterModel = (id: string) => {
    splineModelManager.unregisterModel(id)
  }

  const updateModel = (id: string, updates: Partial<SplineModelConfig>) => {
    splineModelManager.updateModel(id, updates)
  }

  const toggleVisibility = (id: string) => {
    splineModelManager.toggleModelVisibility(id)
  }

  const setPosition = (id: string, position: [number, number, number]) => {
    splineModelManager.setModelPosition(id, position)
  }

  const setScale = (id: string, scale: number) => {
    splineModelManager.setModelScale(id, scale)
  }

  const enableAnimation = (
    id: string,
    type: 'rotate' | 'pulse' | 'orbit',
    speed?: number
  ) => {
    splineModelManager.enableAnimation(id, type, speed)
  }

  const disableAnimation = (id: string, type: 'rotate' | 'pulse' | 'orbit') => {
    splineModelManager.disableAnimation(id, type)
  }

  return {
    registerModel,
    unregisterModel,
    updateModel,
    toggleVisibility,
    setPosition,
    setScale,
    enableAnimation,
    disableAnimation,
    models: splineModelManager.getAllModels(),
    getModel: (id: string) => splineModelManager.getModel(id),
  }
}

/**
 * Example usage component showing how to register models
 */
export function ExampleSplineSetup() {
  const { registerModel } = useSplineModels()

  useEffect(() => {
    // Example 1: Simple spaceship
    registerModel({
      id: 'spaceship-01',
      name: 'Scout Ship',
      url: 'https://prod.spline.design/YOUR-SPACESHIP-ID/scene.splinecode',
      position: [10, 5, -5],
      scale: 0.5,
      animation: {
        rotate: true,
        rotationSpeed: 0.5,
        orbit: true,
        orbitSpeed: 0.3,
      },
    })

    // Example 2: Asteroid with pulse
    registerModel({
      id: 'asteroid-01',
      name: 'Asteroid Belt',
      url: 'https://prod.spline.design/YOUR-ASTEROID-ID/scene.splinecode',
      position: [-8, 2, 3],
      scale: 0.8,
      animation: {
        rotate: true,
        rotationSpeed: 1.5,
        pulse: true,
        pulseSpeed: 0.8,
      },
    })

    // Example 3: Space station (static)
    registerModel({
      id: 'station-01',
      name: 'Space Station Alpha',
      url: 'https://prod.spline.design/YOUR-STATION-ID/scene.splinecode',
      position: [0, 10, 0],
      scale: 1.2,
      animation: {
        rotate: true,
        rotationSpeed: 0.1,
      },
      interaction: {
        hoverable: true,
        clickable: true,
        onClick: (name) => {
          console.log('Space station clicked:', name)
        },
      },
    })

    // Cleanup on unmount
    return () => {
      splineModelManager.clear()
    }
  }, [registerModel])

  return null
}
