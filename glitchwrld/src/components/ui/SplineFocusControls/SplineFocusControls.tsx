import { useState, useCallback } from 'react'
import { useHybridStore } from '../../../stores/hybridStore'
import * as THREE from 'three'
import './SplineFocusControls.css'

interface FocusTarget {
  name: string
  position: { x: number; y: number; z: number }
  distance: number
  isVisible: boolean
}

export function SplineFocusControls() {
  const [focusTargets, setFocusTargets] = useState<FocusTarget[]>([])
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [cameraDistance, setCameraDistance] = useState(15)
  const { sceneMode, setCameraPosition, setCameraTarget } = useHybridStore()

  // Scan for available Spline objects
  const scanSplineObjects = useCallback(() => {
    const splineApp = (window as any).splineRef
    if (!splineApp) {
      console.warn('No Spline app reference found')
      return
    }

    const targets: FocusTarget[] = []
    
    // Try to find objects in the Spline scene
    if (splineApp.scene && splineApp.scene.children) {
      splineApp.scene.traverse((child: any) => {
        if (child.name && child.position) {
          targets.push({
            name: child.name,
            position: { x: child.position.x, y: child.position.y, z: child.position.z },
            distance: Math.sqrt(child.position.x ** 2 + child.position.y ** 2 + child.position.z ** 2),
            isVisible: child.visible !== false
          })
        }
      })
    }
    
    // Also check rotation data
    const rotationData = (window as any).splineRotationData
    if (rotationData) {
      rotationData.forEach((data: any) => {
        if (data.object && data.name) {
          const exists = targets.find(t => t.name === data.name)
          if (!exists) {
            targets.push({
              name: data.name,
              position: data.originalPosition || { x: 0, y: 0, z: 0 },
              distance: Math.sqrt(
                (data.originalPosition?.x || 0) ** 2 + 
                (data.originalPosition?.y || 0) ** 2 + 
                (data.originalPosition?.z || 0) ** 2
              ),
              isVisible: true
            })
          }
        }
      })
    }

    setFocusTargets(targets.sort((a, b) => a.distance - b.distance))
    console.log(`🎯 Found ${targets.length} focusable Spline objects:`, targets)
  }, [])

  // Focus camera on selected Spline object
  const focusOnObject = useCallback((targetName: string) => {
    const target = focusTargets.find(t => t.name === targetName)
    if (!target) return

    setSelectedTarget(targetName)
    
    // Convert Spline coordinates to R3F camera coordinates
    // This is an approximation - you may need to adjust based on your coordinate systems
    const cameraOffset = cameraDistance
    const cameraPos = {
      x: target.position.x + cameraOffset * 0.5,
      y: target.position.y + cameraOffset * 0.3,
      z: target.position.z + cameraOffset
    }
    
    setCameraPosition(new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z))
    setCameraTarget(new THREE.Vector3(target.position.x, target.position.y, target.position.z))
    
    console.log(`🎯 Focusing on ${targetName} at position:`, target.position)
  }, [focusTargets, cameraDistance, setCameraPosition, setCameraTarget])

  // Reset to galaxy overview
  const resetToOverview = useCallback(() => {
    setSelectedTarget(null)
    setCameraPosition(new THREE.Vector3(0, 10, 15))
    setCameraTarget(new THREE.Vector3(0, 0, 0))
  }, [setCameraPosition, setCameraTarget])

  // Auto-scan on component mount
  useState(() => {
    setTimeout(() => scanSplineObjects(), 2000) // Delay to allow Spline to load
  })

  if (sceneMode === 'solarSystem') return null

  return (
    <div className="spline-focus-controls">
      <div className="control-header">
        <h3>🎯 Planet Focus</h3>
        <button onClick={scanSplineObjects} className="scan-btn">
          📡 Scan
        </button>
      </div>

      {focusTargets.length === 0 ? (
        <div className="no-targets">
          <p>No Spline objects detected</p>
          <p>Click "Scan" to refresh</p>
        </div>
      ) : (
        <>
          {/* Camera Distance Control */}
          <div className="control-group">
            <label>Camera Distance</label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={cameraDistance}
              onChange={(e) => setCameraDistance(parseInt(e.target.value))}
            />
            <span>{cameraDistance}</span>
          </div>

          {/* Quick Actions */}
          <div className="action-buttons">
            <button onClick={resetToOverview} className="overview-btn">
              🌌 Overview
            </button>
          </div>

          {/* Target List */}
          <div className="target-list">
            <h4>Available Planets ({focusTargets.length})</h4>
            {focusTargets.map((target, index) => (
              <div
                key={target.name}
                className={`target-item ${selectedTarget === target.name ? 'selected' : ''}`}
                onClick={() => focusOnObject(target.name)}
              >
                <div className="target-info">
                  <span className="target-name">{target.name}</span>
                  <span className="target-distance">
                    {target.distance.toFixed(1)} units
                  </span>
                </div>
                <div className="target-status">
                  <span className={`visibility ${target.isVisible ? 'visible' : 'hidden'}`}>
                    {target.isVisible ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Target Details */}
          {selectedTarget && (
            <div className="selected-details">
              <h4>🎯 Focused: {selectedTarget}</h4>
              {focusTargets.find(t => t.name === selectedTarget) && (
                <div className="target-coords">
                  <div>X: {focusTargets.find(t => t.name === selectedTarget)!.position.x.toFixed(2)}</div>
                  <div>Y: {focusTargets.find(t => t.name === selectedTarget)!.position.y.toFixed(2)}</div>
                  <div>Z: {focusTargets.find(t => t.name === selectedTarget)!.position.z.toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}