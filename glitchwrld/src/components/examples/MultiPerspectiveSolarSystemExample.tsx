/**
 * Multi-Perspective Solar System Example
 * Demonstrates how to integrate the new multi-perspective popovers
 * with your existing solar system visualization
 */

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { PlanetWithMultiPerspective } from '../planets/PlanetWithMultiPerspective'
import { EmotionalVenus } from '../planets/EmotionalVenus'

export function MultiPerspectiveSolarSystemExample() {
  const [hoveredBody, setHoveredBody] = useState<string | null>(null)
  const [time, setTime] = useState(0)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000011' }}>
      <Canvas camera={{ position: [0, 20, 40], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
        <Stars radius={300} depth={50} count={5000} factor={4} fade />

        {/* Sun */}
        <PlanetWithMultiPerspective
          planetName="sun"
          hoveredBody={hoveredBody}
          tooltipOffset={3.5}
          defaultPerspective="mythological"
        >
          <mesh
            position={[0, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('sun')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshStandardMaterial
              color="#FDB813"
              emissive="#FDB813"
              emissiveIntensity={1.5}
            />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Mercury */}
        <PlanetWithMultiPerspective
          planetName="mercury"
          hoveredBody={hoveredBody}
          tooltipOffset={1.2}
          defaultPerspective="scientific"
        >
          <mesh
            position={[6, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('mercury')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color="#8C7853" roughness={0.8} />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Venus - Using EmotionalVenus with multi-perspective tooltip */}
        <PlanetWithMultiPerspective
          planetName="venus"
          hoveredBody={hoveredBody}
          tooltipOffset={2.5}
          defaultPerspective="poetic"
        >
          <EmotionalVenus
            position={[10, 0, 0]}
            size={0.9}
            time={time}
            isFocused={hoveredBody === 'venus'}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('venus')
            }}
            onPointerOut={() => setHoveredBody(null)}
            onClick={() => console.log('Venus clicked!')}
          />
        </PlanetWithMultiPerspective>

        {/* Earth */}
        <PlanetWithMultiPerspective
          planetName="earth"
          hoveredBody={hoveredBody}
          tooltipOffset={1.8}
          defaultPerspective="personal"
        >
          <mesh
            position={[14, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('earth')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#4A90E2" roughness={0.6} metalness={0.2} />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Mars */}
        <PlanetWithMultiPerspective
          planetName="mars"
          hoveredBody={hoveredBody}
          tooltipOffset={1.5}
          defaultPerspective="mythological"
        >
          <mesh
            position={[18, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('mars')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#CD5C5C" roughness={0.9} />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Jupiter */}
        <PlanetWithMultiPerspective
          planetName="jupiter"
          hoveredBody={hoveredBody}
          tooltipOffset={3.0}
          defaultPerspective="scientific"
        >
          <mesh
            position={[25, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('jupiter')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshStandardMaterial color="#C88B3A" roughness={0.5} />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Saturn */}
        <PlanetWithMultiPerspective
          planetName="saturn"
          hoveredBody={hoveredBody}
          tooltipOffset={2.8}
          defaultPerspective="poetic"
        >
          <group
            position={[32, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('saturn')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <mesh>
              <sphereGeometry args={[1.8, 32, 32]} />
              <meshStandardMaterial color="#F4E8C1" roughness={0.6} />
            </mesh>
            {/* Saturn's rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 3.2, 64]} />
              <meshStandardMaterial
                color="#D4C4A8"
                side={2}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        </PlanetWithMultiPerspective>

        {/* Uranus */}
        <PlanetWithMultiPerspective
          planetName="uranus"
          hoveredBody={hoveredBody}
          tooltipOffset={2.2}
          defaultPerspective="mythological"
        >
          <mesh
            position={[38, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('uranus')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[1.4, 32, 32]} />
            <meshStandardMaterial color="#4FD0E7" roughness={0.4} metalness={0.3} />
          </mesh>
        </PlanetWithMultiPerspective>

        {/* Neptune */}
        <PlanetWithMultiPerspective
          planetName="neptune"
          hoveredBody={hoveredBody}
          tooltipOffset={2.2}
          defaultPerspective="personal"
        >
          <mesh
            position={[44, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredBody('neptune')
            }}
            onPointerOut={() => setHoveredBody(null)}
          >
            <sphereGeometry args={[1.3, 32, 32]} />
            <meshStandardMaterial color="#4166F5" roughness={0.5} />
          </mesh>
        </PlanetWithMultiPerspective>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxDistance={100}
          minDistance={5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '15px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#87ceeb' }}>
          Multi-Perspective Solar System
        </h3>
        <p style={{ margin: '5px 0', fontSize: '13px' }}>
          🔬 Scientific • 📜 Mythological • ✨ Poetic • 🌱 Personal Growth
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.7 }}>
          Hover over planets to explore different perspectives
        </p>
        {hoveredBody && (
          <p style={{ margin: '10px 0 0 0', color: '#ffd700', fontWeight: 'bold' }}>
            Currently viewing: {hoveredBody.toUpperCase()}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontFamily: 'monospace',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          fontSize: '12px',
          textAlign: 'center'
        }}
      >
        Click the tabs in each popover to switch between perspectives
      </div>
    </div>
  )
}
