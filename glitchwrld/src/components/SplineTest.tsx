import Spline from '@splinetool/react-spline'

// Simple test component to verify Spline URL and integration
export function SplineTest() {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      <Spline 
        scene="https://prod.spline.design/U7veJdshBfn0p7uX/scene.splinecode"
        onLoad={(splineApp) => console.log('✅ Spline Test: Scene loaded successfully!', splineApp)}
        onError={(error) => console.error('❌ Spline Test: Loading failed:', error)}
        onMouseDown={(e) => console.log('🖱️ Spline Test: Mouse down:', e)}
      />
    </div>
  )
}