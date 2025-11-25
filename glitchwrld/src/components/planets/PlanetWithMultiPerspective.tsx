/**
 * Planet With Multi-Perspective Popover
 * Wrapper component that adds interactive multi-perspective tooltip to any planet mesh
 * Lets users explore planets from Scientific, Mythological, Poetic, and Personal Growth perspectives
 */

import { ReactNode } from 'react'
import { MultiPerspectivePopover, CompactMultiPerspectivePopover } from '../ui/MultiPerspectivePopover'
import { getMultiPerspectivePlanet } from '../../utils/data/planetPerspectives'

interface PlanetWithMultiPerspectiveProps {
  planetName: string
  children: ReactNode
  tooltipOffset?: number
  hoveredBody: string | null
  compact?: boolean
  defaultPerspective?: 'scientific' | 'mythological' | 'poetic' | 'personal'
}

export function PlanetWithMultiPerspective({
  planetName,
  children,
  tooltipOffset = 1.5,
  hoveredBody,
  compact = false,
  defaultPerspective = 'mythological'
}: PlanetWithMultiPerspectiveProps) {
  const planetData = getMultiPerspectivePlanet(planetName)
  const isHovered = hoveredBody === planetName.toLowerCase()

  if (!planetData) {
    // Fallback: render children without tooltip if planet data not found
    return <>{children}</>
  }

  return (
    <>
      {children}
      {isHovered && (
        compact ? (
          <CompactMultiPerspectivePopover
            planet={planetData}
            position={[0, tooltipOffset, 0]}
            visible={true}
            perspective={defaultPerspective}
          />
        ) : (
          <MultiPerspectivePopover
            planet={planetData}
            position={[0, tooltipOffset, 0]}
            visible={true}
            defaultPerspective={defaultPerspective}
          />
        )
      )}
    </>
  )
}

/**
 * Hook for managing multi-perspective state
 * Useful if you want to control the perspective from outside the component
 */
export function useMultiPerspectiveControl() {
  const [globalPerspective, setGlobalPerspective] =
    React.useState<'scientific' | 'mythological' | 'poetic' | 'personal'>('mythological')

  const cyclePerspective = () => {
    const perspectives: Array<'scientific' | 'mythological' | 'poetic' | 'personal'> =
      ['scientific', 'mythological', 'poetic', 'personal']
    const currentIndex = perspectives.indexOf(globalPerspective)
    const nextIndex = (currentIndex + 1) % perspectives.length
    setGlobalPerspective(perspectives[nextIndex])
  }

  return {
    globalPerspective,
    setGlobalPerspective,
    cyclePerspective
  }
}

// React import for hook
import React from 'react'
