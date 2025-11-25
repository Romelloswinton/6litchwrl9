import { Suspense } from 'react'
import { HybridScene } from './components/core/HybridScene'
import { PortfolioScene } from './components/portfolio/PortfolioScene'
import { MarsExperienceScene } from './components/planets/MarsExperienceScene'
import { JupiterExperienceScene } from './components/planets/JupiterExperienceScene'
import { SaturnExperienceScene } from './components/planets/SaturnExperienceScene'
import { BlackHoleExperienceScene } from './components/scenes/BlackHoleExperienceScene'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ErrorBoundary } from './components/core/ErrorBoundary'
import { XRModeSwitcher } from './components/xr/XRModeSwitcher'
import { useHybridStore } from './stores/hybridStore'
import './App.css'

function App() {
  const sceneMode = useHybridStore((state) => state.sceneMode)

  // Render planet-specific experiences
  if (sceneMode === 'earthSpline') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <PortfolioScene />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (sceneMode === 'marsExperience') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <MarsExperienceScene />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (sceneMode === 'jupiterExperience') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <JupiterExperienceScene />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (sceneMode === 'saturnExperience') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <SaturnExperienceScene />
        </Suspense>
      </ErrorBoundary>
    )
  }

  if (sceneMode === 'blackHoleExperience') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <BlackHoleExperienceScene />
        </Suspense>
      </ErrorBoundary>
    )
  }

  // Default: Solar System / Galaxy view
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
