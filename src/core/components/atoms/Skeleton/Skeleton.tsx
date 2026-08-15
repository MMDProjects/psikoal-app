import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { View } from 'react-native'
import type { DimensionValue } from 'react-native'

import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { cn } from '@/core/utils/cn'

export type SkeletonBorderRadius =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full'
export type SkeletonVariant = 'line' | 'circle' | 'rect'

export type SkeletonProps = {
  width?: number | string
  height?: number
  borderRadius?: SkeletonBorderRadius
  variant?: SkeletonVariant
  className?: string
}

export type SkeletonGroupProps = {
  children: ReactNode
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const radiusStyles: Record<SkeletonBorderRadius, string> = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
}

const variantDefaults: Record<SkeletonVariant, Partial<SkeletonProps>> = {
  line: { height: 16, borderRadius: 'sm' },
  circle: { height: 48, borderRadius: 'full' },
  rect: { height: 120, borderRadius: 'md' },
}

const gapStyles = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' } as const

const SHIMMER_BASE = '#E5E5E5'
const SHIMMER_HIGHLIGHT = '#F5F5F5'
const SHIMMER_STATIC = '#EFEFEF'

export function Skeleton({
  variant = 'rect',
  width,
  height,
  borderRadius,
  className,
}: SkeletonProps) {
  const reducedMotion = useReducedMotion()
  const progress = useSharedValue(0)

  const defaults = variantDefaults[variant]
  const resolvedHeight = height ?? defaults.height ?? 16
  const resolvedRadius = borderRadius ?? defaults.borderRadius ?? 'md'
  const resolvedWidth = variant === 'circle' ? resolvedHeight : width

  useEffect(() => {
    if (reducedMotion) return
    progress.value = withRepeat(withTiming(1, { duration: 900 }), -1, true)
    return () => cancelAnimation(progress)
  }, [reducedMotion, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: reducedMotion
      ? SHIMMER_STATIC
      : interpolateColor(progress.value, [0, 1], [SHIMMER_BASE, SHIMMER_HIGHLIGHT]),
  }))

  return (
    <Animated.View
      accessibilityRole="none"
      accessibilityLabel="Loading"
      style={[
        animatedStyle,
        {
          width: (resolvedWidth ?? '100%') as DimensionValue,
          height: resolvedHeight,
        },
      ]}
      className={cn(radiusStyles[resolvedRadius], className)}
    />
  )
}

export function SkeletonGroup({ children, gap = 'md', className }: SkeletonGroupProps) {
  return <View className={cn('flex-col', gapStyles[gap], className)}>{children}</View>
}
