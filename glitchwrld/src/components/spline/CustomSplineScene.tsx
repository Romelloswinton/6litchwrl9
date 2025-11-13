/*
  Spline Scene with Keplerian Orbital Mechanics
  Integrates realistic planetary motion using Kepler's laws
*/

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import useSpline from "@splinetool/r3f-spline"
import { PLANET_DATA, MOON_DATA } from '../../utils/orbital/PlanetData'
import { calculateOrbitalPosition, calculatePlanetScale } from '../../utils/orbital/OrbitalMechanics'
import { OrbitPathGroup } from '../orbital/OrbitPath'
import * as THREE from 'three'

interface SceneProps {
  showOrbits?: boolean
  timeScale?: number
}

export default function Scene({ showOrbits = false, timeScale = 0.1, ...props }: SceneProps) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode"
  )

  // Debug: Log when scene loads
  console.log('🪐 Spline scene loaded:', {
    nodesCount: Object.keys(nodes || {}).length,
    nodes: nodes ? Object.keys(nodes) : 'none',
    materials: materials ? Object.keys(materials) : 'none'
  })

  // Refs for planet groups to update positions
  const moonRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Group>(null)
  const jupiterRef = useRef<THREE.Group>(null)
  const venusRef = useRef<THREE.Group>(null)
  const sunRef = useRef<THREE.Group>(null)

  // Time accumulator for orbital calculations
  const [time, setTime] = useState(0)

  // Scaling factor to convert AU to scene units
  // Reduced to match the galaxy scale (galaxyRadius is typically ~8-20)
  const SCENE_SCALE = 15 // 1 AU = 15 units in scene
  const SCALE_OVERRIDE = SCENE_SCALE / 8000 // Override the default AU_TO_UNITS = 8000

  // Animation loop using Kepler's laws
  useFrame((state, delta) => {
    // Update time (delta is in seconds, multiply for faster animation)
    setTime(t => t + delta * timeScale)

    // Calculate Venus position using Keplerian mechanics
    if (venusRef.current) {
      const venusOrbit = calculateOrbitalPosition(PLANET_DATA.venus, time)
      const x = venusOrbit.position.x * SCALE_OVERRIDE
      const y = venusOrbit.position.y * SCALE_OVERRIDE
      const z = venusOrbit.position.z * SCALE_OVERRIDE
      venusRef.current.position.set(x, y, z)

      // Debug log once every 5 seconds
      if (Math.floor(time) % 5 === 0 && Math.floor(time * 10) % 10 === 0) {
        console.log('♀️ Venus position:', { x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) })
      }

      // Rotate Venus on its axis (retrograde rotation)
      venusRef.current.rotation.y -= delta * 0.1
    }

    // Calculate Earth position using Keplerian mechanics
    if (earthRef.current) {
      const earthOrbit = calculateOrbitalPosition(PLANET_DATA.earth, time)
      earthRef.current.position.set(
        earthOrbit.position.x * SCALE_OVERRIDE,
        earthOrbit.position.y * SCALE_OVERRIDE,
        earthOrbit.position.z * SCALE_OVERRIDE
      )
      // Rotate Earth on its axis
      earthRef.current.rotation.y += delta * 2.0
    }

    // Calculate Moon's orbit around Earth
    if (moonRef.current && earthRef.current) {
      // Moon orbital parameters (relative to Earth)
      const moonDistance = MOON_DATA.moon.semiMajorAxis * SCENE_SCALE
      const moonSpeed = (2 * Math.PI) / (MOON_DATA.moon.orbitalPeriod * timeScale)
      const moonAngle = time * moonSpeed

      // Position moon relative to Earth
      const moonLocalX = Math.cos(moonAngle) * moonDistance
      const moonLocalZ = Math.sin(moonAngle) * moonDistance

      moonRef.current.position.set(
        earthRef.current.position.x + moonLocalX,
        earthRef.current.position.y,
        earthRef.current.position.z + moonLocalZ
      )
      // Rotate Moon on its axis (tidally locked)
      moonRef.current.rotation.y = moonAngle
    }

    // Calculate Jupiter position using Keplerian mechanics
    if (jupiterRef.current) {
      const jupiterOrbit = calculateOrbitalPosition(PLANET_DATA.jupiter, time)
      jupiterRef.current.position.set(
        jupiterOrbit.position.x * SCALE_OVERRIDE,
        jupiterOrbit.position.y * SCALE_OVERRIDE,
        jupiterOrbit.position.z * SCALE_OVERRIDE
      )
      // Rotate Jupiter on its axis (fast rotation)
      jupiterRef.current.rotation.y += delta * 5.0
    }

    // Rotate Sun on its axis
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.5
    }
  })

  // Calculate planet scales - Small but visible, no overlap
  const venusScale = 0.15
  const earthScale = 0.18
  const moonScale = 0.05
  const jupiterScale = 0.4
  const sunScale = 0.5

  console.log('🌍 Planet scales:', { venusScale, earthScale, moonScale, jupiterScale, sunScale })

  // Check if Spline meshes loaded
  const hasSplineMeshes = nodes && nodes.Mesh && nodes.Mesh1 && nodes.Mesh2 && nodes.Mesh3 && nodes.Mesh4

  return (
    <group {...props} dispose={null}>
      {/* Moon - orbits Earth */}
      <group ref={moonRef} name="Moon" scale={moonScale}>
        {hasSplineMeshes && nodes.Mesh ? (
          <mesh
            name="Mesh"
            geometry={nodes.Mesh.geometry}
            material={nodes.Mesh.material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        )}
      </group>

      {/* Earth - Keplerian orbit around Sun */}
      <group ref={earthRef} name="Earth" scale={earthScale}>
        {hasSplineMeshes && nodes.Mesh1 ? (
          <mesh
            name="Mesh1"
            geometry={nodes.Mesh1.geometry}
            material={nodes.Mesh1.material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#2233ff" emissive="#0088ff" emissiveIntensity={0.2} />
          </mesh>
        )}
      </group>

      {/* Jupiter - Keplerian orbit around Sun */}
      <group ref={jupiterRef} name="Jupiter" scale={jupiterScale}>
        {hasSplineMeshes && nodes.Mesh2 ? (
          <mesh
            name="Mesh2"
            geometry={nodes.Mesh2.geometry}
            material={nodes.Mesh2.material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#cc8844" emissive="#aa6622" emissiveIntensity={0.1} />
          </mesh>
        )}
      </group>

      {/* Venus - Keplerian orbit around Sun */}
      <group ref={venusRef} name="Venus" scale={venusScale}>
        {hasSplineMeshes && nodes.Mesh3 ? (
          <mesh
            name="Mesh3"
            geometry={nodes.Mesh3.geometry}
            material={nodes.Mesh3.material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ffcc77" emissive="#ff9933" emissiveIntensity={0.15} />
          </mesh>
        )}
      </group>

      {/* Sun - at the center (0,0,0) */}
      <group ref={sunRef} name="Sun" position={[0, 0, 0]} scale={sunScale}>
        {hasSplineMeshes && nodes.Mesh4 ? (
          <mesh
            name="Mesh4"
            geometry={nodes.Mesh4.geometry}
            material={nodes.Mesh4.material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffaa00" emissiveIntensity={2.0} />
          </mesh>
        )}
      </group>

      {/* Orbital Paths - Visualize elliptical orbits */}
      {showOrbits && (
        <OrbitPathGroup
          planets={[PLANET_DATA.venus, PLANET_DATA.earth, PLANET_DATA.jupiter]}
          visible={showOrbits}
          innerPlanetsColor="#4A90E2"
          outerPlanetsColor="#C88B3A"
          innerOpacity={0.5}
          outerOpacity={0.4}
        />
      )}
    </group>
  )
}

// Named export wrapper for HybridScene
export function CustomSplineSceneWrapper(props: Partial<SceneProps>) {
  return <Scene {...props} />
}
