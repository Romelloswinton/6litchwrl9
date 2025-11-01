// glitchwrld/src/components/xr/XRGalaxyWrapper.tsx

import { ReactNode } from 'react'
import { XR } from '@react-three/xr'
import { useXRStore } from '../../stores/xrStore'
import { xrStore } from './XRModeSwitcher'

interface XRGalaxyWrapperProps {
  children: ReactNode
}

/**
 * Unified XR wrapper that handles both VR and AR modes
 * Wraps the galaxy scene with XR functionality
 */
export function XRGalaxyWrapper({ children }: XRGalaxyWrapperProps) {
  const galaxyScale = useXRStore((state) => state.galaxyScale)

  return (
    <XR store={xrStore}>
      {/* Scale the entire galaxy for XR viewing */}
      <group scale={[galaxyScale, galaxyScale, galaxyScale]}>
        {children}
      </group>
    </XR>
  )
}
