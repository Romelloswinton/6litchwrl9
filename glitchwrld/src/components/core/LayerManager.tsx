import { useEffect, useRef, type ReactNode } from "react"
import { useHybridStore, type LayerType } from "../../stores/hybridStore"

interface LayerProps {
  type: LayerType
  children: ReactNode
  className?: string
}

interface LayerManagerProps {
  children: ReactNode
}

export function Layer({ type, children, className = "" }: LayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const { layers } = useHybridStore()
  const layerConfig = layers[type]

  useEffect(() => {
    if (!layerRef.current) return

    const element = layerRef.current

    // Apply layer configuration
    element.style.opacity = layerConfig.visible
      ? layerConfig.opacity.toString()
      : "0"
    element.style.zIndex = layerConfig.zIndex.toString()
    element.style.pointerEvents = layerConfig.visible ? "auto" : "none"

    // Apply blend modes
    switch (layerConfig.blendMode) {
      case "additive":
        element.style.mixBlendMode = "screen"
        break
      case "multiply":
        element.style.mixBlendMode = "multiply"
        break
      default:
        element.style.mixBlendMode = "normal"
    }

    // Smooth transitions
    element.style.transition = "opacity 0.3s ease-in-out"
  }, [layerConfig, type])

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: layerConfig.visible ? layerConfig.opacity : 0,
    zIndex: layerConfig.zIndex,
    pointerEvents: layerConfig.visible ? "auto" : "none",
    transition: "opacity 0.3s ease-in-out",
  }

  return (
    <div
      ref={layerRef}
      className={`layer layer-${type} ${className}`}
      style={layerStyle}
      data-layer-type={type}
    >
      {children}
    </div>
  )
}

export function LayerManager({ children }: LayerManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isLoading } = useHybridStore()

  useEffect(() => {
    if (!containerRef.current) return

    // Set up the layer container
    const container = containerRef.current
    container.style.position = "relative"
    container.style.width = "100%"
    container.style.height = "100%"
    container.style.overflow = "hidden"

    // Performance optimization: use transform3d to enable hardware acceleration
    container.style.transform = "translateZ(0)"
    container.style.backfaceVisibility = "hidden"

    console.log("🎭 LayerManager initialized")
  }, [])

  return (
    <div
      ref={containerRef}
      className="layer-manager"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000011",
        overflow: "hidden",
      }}
      data-loading={isLoading}
    >
      {children}
    </div>
  )
}
