import { useCallback, useRef, useEffect } from 'react'
import Spline from '@splinetool/react-spline'
import { useHybridStore } from '../../stores/hybridStore'
import { SplineBlendingManager } from '../../utils/spline/blendingUtils'

export function SplineLayer() {
  const splineRef = useRef<any>(null)
  const blendingManagerRef = useRef<SplineBlendingManager | null>(null)
  
  const {
    splineScene,
    layers,
    setHoveredObject,
    setSelectedObject,
    registerSplineModel,
    unregisterSplineModel
  } = useHybridStore()
  
  const splineLayer = layers.spline
  
  console.log('🎭 SplineLayer render:', { 
    visible: splineLayer.visible, 
    opacity: splineLayer.opacity,
    scene: splineScene 
  })

  const onLoad = useCallback((splineApp: any) => {
    splineRef.current = splineApp
    console.log('✅ SplineLayer loaded:', splineApp)
    
    // Register the model
    registerSplineModel('main', splineApp)
    
    // Initialize blending manager for transparency
    blendingManagerRef.current = new SplineBlendingManager(splineApp)
    
    // Apply initial layer settings
    if (blendingManagerRef.current) {
      blendingManagerRef.current.updateBlending({
        opacity: splineLayer.opacity,
        blendMode: splineLayer.blendMode
      })
      blendingManagerRef.current.setTransparent(true)
    }
    
    console.log('🎨 SplineLayer configured for hybrid rendering')
  }, [registerSplineModel, splineLayer.opacity, splineLayer.blendMode])

  const onMouseDown = useCallback((e: any) => {
    if (e.target?.name) {
      setSelectedObject(e.target.name)
      console.log('🖱️ Spline object selected:', e.target.name)
    }
  }, [setSelectedObject])

  const onMouseMove = useCallback((e: any) => {
    if (e.target?.name) {
      setHoveredObject(e.target.name)
      document.body.style.cursor = 'pointer'
    } else {
      setHoveredObject(null)
      document.body.style.cursor = 'default'
    }
  }, [setHoveredObject])

  const onError = useCallback((error: any) => {
    console.error('❌ SplineLayer error:', error)
  }, [])

  // Update blending when layer properties change
  useEffect(() => {
    if (blendingManagerRef.current) {
      blendingManagerRef.current.updateBlending({
        opacity: splineLayer.opacity,
        blendMode: splineLayer.blendMode
      })
    }
  }, [splineLayer.opacity, splineLayer.blendMode])

  // Cleanup
  useEffect(() => {
    return () => {
      if (splineRef.current) {
        unregisterSplineModel('main')
      }
      if (blendingManagerRef.current) {
        blendingManagerRef.current.dispose()
        blendingManagerRef.current = null
      }
    }
  }, [unregisterSplineModel])

  if (!splineScene || !splineLayer.visible) {
    return null
  }

  return (
    <Spline
      scene={splineScene}
      onLoad={onLoad}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onError={onError}
      style={{
        width: '100%',
        height: '100%',
        opacity: splineLayer.opacity,
        pointerEvents: splineLayer.visible ? 'auto' : 'none'
      }}
    />
  )
}