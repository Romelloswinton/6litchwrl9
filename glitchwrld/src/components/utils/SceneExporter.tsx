import { useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { GLTFExporter } from 'three-stdlib'

export function SceneExporter() {
  const { scene } = useThree()

  const exportScene = useCallback(() => {
    const exporter = new GLTFExporter()
    
    console.log('📦 Starting GLB export...')
    
    // Options for the exporter
    const options = {
      binary: true,
      onlyVisible: true,
      maxTextureSize: 4096,
    }

    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'application/octet-stream' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'galaxy-scene.glb'
          link.click()
          URL.revokeObjectURL(url)
          console.log('✅ Export complete!')
        } else {
          console.error('❌ Export failed: Result was not an ArrayBuffer')
        }
      },
      (error) => {
        console.error('❌ An error happened during export:', error)
      },
      options
    )
  }, [scene])

  // This component doesn't render anything visible, 
  // but it exposes the export function to the window for easy access if needed,
  // or we can use a store/context to trigger it.
  // For now, let's attach it to the window for debugging/easy access
  // @ts-ignore
  window.exportGLB = exportScene

  return null
}
