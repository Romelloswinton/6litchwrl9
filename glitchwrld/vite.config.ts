import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three': 'three'
    },
    dedupe: ['three']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React and Three.js libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three'],
          'vendor-r3f': ['@react-three/fiber', '@react-three/drei'],
          'vendor-postprocessing': ['@react-three/postprocessing', 'postprocessing'],

          // XR and Spline
          'vendor-xr': ['@react-three/xr'],
          'vendor-spline': ['@splinetool/r3f-spline', '@splinetool/runtime'],

          // State management and utilities
          'vendor-utils': ['zustand', 'leva'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
  }
})
