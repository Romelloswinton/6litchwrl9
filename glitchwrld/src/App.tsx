import { Suspense } from 'react'
import { HybridScene } from './components/core/HybridScene'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ErrorBoundary } from './components/core/ErrorBoundary'
import { XRModeSwitcher } from './components/xr/XRModeSwitcher'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* XR Mode Switcher - VR/AR entry buttons */}
        <XRModeSwitcher />

        <Suspense fallback={<LoadingScreen />}>
          <HybridScene />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
