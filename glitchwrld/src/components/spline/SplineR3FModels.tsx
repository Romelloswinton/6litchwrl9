// glitchwrld/src/components/spline/SplineR3FModels.tsx

import { useEffect, useRef, Suspense } from 'react'
import useSpline from '@splinetool/r3f-spline'
import { useHybridStore } from '../../stores/hybridStore'
import { useXRStore } from '../../stores/xrStore'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { SplineR3FHelpers } from '../../utils/spline/splineR3FHelpers'

/**
 * R3F-integrated Spline component for AR/VR compatibility
 * This replaces the overlay-based SplineOverlay component
 */
function SplineR3FContent({ url }: { url: string }) {
  const { nodes, materials } = useSpline(url)
  const setHoveredObject = useHybridStore((state) => state.setHoveredObject)
  const setSelectedObject = useHybridStore((state) => state.setSelectedObject)
  const sceneMode = useHybridStore((state) => state.sceneMode)
  const galaxyRadius = useHybridStore((state) => state.galaxyRadius)
  const spiralArms = useHybridStore((state) => state.spiralArms)
  const spiralTightness = useHybridStore((state) => state.spiralTightness)
  const particleCount = useHybridStore((state) => state.particleCount)
  const rotationSpeed = useHybridStore((state) => state.rotationSpeed)
  const isAnimating = useHybridStore((state) => state.isAnimating)

  const { mode: xrMode, galaxyScale } = useXRStore()
  const groupRef = useRef<THREE.Group>(null)
  const positionedRef = useRef(false)

  // Mouse event handlers
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.object?.name) {
      setSelectedObject(e.object.name)
      console.log('🖱️ Spline object clicked:', e.object.name)
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.object?.name) {
      setHoveredObject(e.object.name)
    }
  }

  const handlePointerOut = () => {
    setHoveredObject(null)
  }

  // Position objects on load
  useEffect(() => {
    if (groupRef.current && !positionedRef.current && Object.keys(nodes).length > 0) {
      const galaxyParams = {
        particleCount,
        galaxyRadius,
        spiralArms,
        spiralTightness
      }

      const success = SplineR3FHelpers.positionSplineObjectsInR3F(
        groupRef.current,
        galaxyParams,
        sceneMode === 'solarSystem'
      )

      if (success) {
        positionedRef.current = true
        console.log('✅ Spline objects positioned in R3F scene')
      }
    }
  }, [nodes, sceneMode, particleCount, galaxyRadius, spiralArms, spiralTightness])

  // Reposition when galaxy parameters change
  useEffect(() => {
    if (groupRef.current && positionedRef.current) {
      const galaxyParams = {
        particleCount,
        galaxyRadius,
        spiralArms,
        spiralTightness
      }

      SplineR3FHelpers.positionSplineObjectsInR3F(
        groupRef.current,
        galaxyParams,
        sceneMode === 'solarSystem'
      )
    }
  }, [galaxyRadius, spiralArms, spiralTightness, particleCount, sceneMode])

  // XR-aware scaling, positioning, and animation
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Apply XR transformations
    SplineR3FHelpers.applyXRTransform(groupRef.current, xrMode, galaxyScale)

    // Animate objects if enabled
    if (isAnimating) {
      SplineR3FHelpers.animateSplineObjects(groupRef.current, rotationSpeed, delta * 60)
    }
  })

  // Render all nodes from the Spline scene
  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
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
              name={key}
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

export function SplineR3FModels() {
  const splineScene = useHybridStore((state) => state.splineScene)
  const showSplineModels = useHybridStore((state) => state.layers.spline.visible)

  // Hide if disabled or no scene URL
  if (!splineScene || !showSplineModels) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <SplineR3FContent url={splineScene} />
    </Suspense>
  )
}

/**
 * Legacy fallback component for R3F
 * Provides placeholder objects when Spline scene is not available
 */
export function SplineR3FFallback() {
  const setHoveredObject = useHybridStore((state) => state.setHoveredObject)
  const setSelectedObject = useHybridStore((state) => state.setSelectedObject)

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.object?.name) {
      setHoveredObject(e.object.name)
    }
  }

  const handlePointerLeave = () => {
    setHoveredObject(null)
  }

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.object?.name) {
      setSelectedObject(e.object.name)
    }
  }

  return (
    <group>
      {/* Placeholder objects when Spline scene is not available */}
      <mesh
        name="placeholder-sphere"
        position={[0, 0, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ff2b2b"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh
        name="placeholder-cube"
        position={[3, 1, -2]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#4ecdc4"
          emissive="#2e8b8b"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh
        name="placeholder-cylinder"
        position={[-2.5, -1, 3]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial
          color="#ffd93d"
          emissive="#ffb000"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}
