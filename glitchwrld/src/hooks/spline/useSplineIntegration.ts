import { useState, useCallback, useRef } from 'react'
import { useHybridStore } from '../../stores/hybridStore'
import type { SplineModelConfig } from '../../types/galaxy'

export function useSplineIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadedModels, setLoadedModels] = useState<Map<string, any>>(new Map())
  const splineRef = useRef<any>(null)

  const {
    splineScene,
    setSplineScene,
    layers,
    setLayerVisible,
    setHoveredObject,
    setSelectedObject,
  } = useHybridStore()

  const loadSplineScene = useCallback(async (url: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, you would load the Spline scene here
      // For now, we'll just set the URL
      setSplineScene(url)
      setLayerVisible('spline', true)

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error('Failed to load Spline scene:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [setSplineScene, setLayerVisible])

  const unloadSplineScene = useCallback(() => {
    setSplineScene(null)
    setLayerVisible('spline', false)
    setLoadedModels(new Map())
  }, [setSplineScene, setLayerVisible])

  const handleSplineReady = useCallback((splineApp: any) => {
    splineRef.current = splineApp
    console.log('Spline scene loaded successfully:', splineApp)
    
    // The Spline app object provides methods to interact with the scene
    // Events are handled through the Spline component props, not individual objects
  }, [])

  const findSplineObject = useCallback((name: string) => {
    if (!splineRef.current) return null
    return splineRef.current.findObjectByName ? splineRef.current.findObjectByName(name) : null
  }, [])

  const updateSplineObject = useCallback((name: string, properties: Record<string, any>) => {
    const object = findSplineObject(name)
    if (!object) return false

    try {
      Object.keys(properties).forEach(key => {
        if (object[key] !== undefined) {
          object[key] = properties[key]
        }
      })
      return true
    } catch (error) {
      console.error(`Failed to update Spline object ${name}:`, error)
      return false
    }
  }, [findSplineObject])

  const getSplineObject = useCallback((name: string) => {
    if (!splineRef.current) return null
    return splineRef.current.findObjectByName(name)
  }, [])

  const animateSplineObject = useCallback((
    name: string,
    properties: Record<string, any>,
    duration = 1000
  ) => {
    const object = getSplineObject(name)
    if (!object) return

    // Animate object properties (position, rotation, scale, etc.)
    const startTime = Date.now()
    const startValues: Record<string, any> = {}
    
    Object.keys(properties).forEach(key => {
      startValues[key] = object[key]
    })

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      Object.keys(properties).forEach(key => {
        if (typeof startValues[key] === 'number' && typeof properties[key] === 'number') {
          object[key] = startValues[key] + (properties[key] - startValues[key]) * easeProgress
        }
      })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [getSplineObject])

  const setSplineObjectVisibility = useCallback((name: string, visible: boolean) => {
    const object = getSplineObject(name)
    if (object) {
      object.visible = visible
    }
  }, [getSplineObject])

  const triggerSplineEvent = useCallback((eventName: string, data?: any) => {
    if (splineRef.current && splineRef.current.emitEvent) {
      splineRef.current.emitEvent(eventName, data)
    }
  }, [])

  const preloadSplineModels = useCallback(async (configs: SplineModelConfig[]) => {
    setIsLoading(true)
    const loadPromises = configs.map(async (config) => {
      try {
        // In a real implementation, preload the models
        // For now, just store the config
        setLoadedModels(prev => new Map(prev.set(config.name, config)))
        return config
      } catch (error) {
        console.error(`Failed to preload model ${config.name}:`, error)
        return null
      }
    })

    const results = await Promise.all(loadPromises)
    setIsLoading(false)
    
    return results.filter(Boolean)
  }, [])

  return {
    isLoading,
    loadedModels,
    splineRef,
    loadSplineScene,
    unloadSplineScene,
    handleSplineReady,
    findSplineObject,
    updateSplineObject,
    getSplineObject,
    animateSplineObject,
    setSplineObjectVisibility,
    triggerSplineEvent,
    preloadSplineModels,
  }
}