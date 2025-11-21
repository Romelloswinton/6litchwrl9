/**
 * Planet With Tooltip - Wrapper component that adds hover tooltip to any planet mesh
 */

import { ReactNode } from 'react'
import { CelestialTooltip, CompactCelestialTooltip } from '../ui/CelestialTooltip'
import { getCelestialSymbolism } from '../../utils/data/celestialSymbolism'

interface PlanetWithTooltipProps {
  planetName: string
  children: ReactNode
  tooltipOffset?: number
  hoveredBody: string | null
  compact?: boolean
}

export function PlanetWithTooltip({
  planetName,
  children,
  tooltipOffset = 1.5,
  hoveredBody,
  compact = false
}: PlanetWithTooltipProps) {
  const symbolism = getCelestialSymbolism(planetName)
  const isHovered = hoveredBody === planetName.toLowerCase()

  return (
    <>
      {children}
      {isHovered && symbolism && (
        compact ? (
          <CompactCelestialTooltip
            name={symbolism.name}
            symbol={symbolism.symbol}
            essence={symbolism.essence}
            color={symbolism.color}
            position={[0, tooltipOffset, 0]}
            visible={true}
          />
        ) : (
          <CelestialTooltip
            symbolism={symbolism}
            position={[0, tooltipOffset, 0]}
            visible={true}
          />
        )
      )}
    </>
  )
}
