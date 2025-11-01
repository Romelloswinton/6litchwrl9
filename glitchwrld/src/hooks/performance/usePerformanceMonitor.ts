import { useFrame } from "@react-three/fiber"
import { useHybridStore } from "../../stores/hybridStore"

let lastTime = performance.now()
let frameCount = 0

export const usePerformanceMonitor = () => {
  const updateFPS = useHybridStore((state) => state.updateFPS)
  const updateRenderTime = useHybridStore((state) => state.updateRenderTime)

  useFrame((state) => {
    const time = performance.now()
    frameCount++

    // Update render time
    updateRenderTime(time - state.clock.elapsedTime * 1000)

    // Update FPS every second
    if (time >= lastTime + 1000) {
      updateFPS(frameCount)
      frameCount = 0
      lastTime = time
    }
  })
}
