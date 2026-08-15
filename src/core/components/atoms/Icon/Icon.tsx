import type { ComponentType } from 'react'

import * as LucideIcons from 'lucide-react-native'

import type { SvgProps } from 'react-native-svg'

type LucideIconProps = Pick<SvgProps, 'stroke'> & { size?: number; strokeWidth?: number }

export type IconName = keyof typeof LucideIcons

export type IconProps = {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 20, color = '#171717', strokeWidth = 1.75 }: IconProps) {
  const LucideIcon = (LucideIcons as unknown as Record<string, ComponentType<LucideIconProps>>)[
    name as string
  ]

  if (!LucideIcon) return null

  return <LucideIcon size={size} stroke={color} strokeWidth={strokeWidth} />
}
