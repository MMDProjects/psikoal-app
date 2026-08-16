import type { ReactNode } from 'react'

import { View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type BadgeVariant = 'sky' | 'sage' | 'warning' | 'error' | 'neutral' | 'success' | 'info'
export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  label: string
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  icon?: ReactNode
  className?: string
}

const containerVariantStyles: Record<BadgeVariant, string> = {
  sky: 'bg-sky-50 border border-sky-200 dark:bg-sky-950 dark:border-sky-800',
  sage: 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800',
  warning: 'bg-semantic-warning-light dark:bg-amber-950',
  error: 'bg-semantic-error-light dark:bg-red-950',
  neutral: 'bg-neutral-100 dark:bg-dark-control',
  success: 'bg-semantic-success-light dark:bg-emerald-950',
  info: 'bg-sky-50 border border-sky-200 dark:bg-sky-950 dark:border-sky-800',
}

const textVariantStyles: Record<BadgeVariant, string> = {
  sky: 'text-sky-700 dark:text-sky-400',
  sage: 'text-green-700 dark:text-emerald-400',
  warning: 'text-semantic-warning-dark dark:text-amber-400',
  error: 'text-semantic-error-dark dark:text-red-400',
  neutral: 'text-neutral-700 dark:text-neutral-300',
  success: 'text-semantic-success-dark dark:text-emerald-400',
  info: 'text-sky-700 dark:text-sky-400',
}

const dotVariantStyles: Record<BadgeVariant, string> = {
  sky: 'bg-sky-500',
  sage: 'bg-green-500',
  warning: 'bg-semantic-warning',
  error: 'bg-semantic-error',
  neutral: 'bg-neutral-500',
  success: 'bg-semantic-success',
  info: 'bg-sky-400',
}

const containerSizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 gap-1',
  md: 'px-2.5 py-1 gap-1.5',
}

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        'flex-row items-center self-start rounded-full',
        containerVariantStyles[variant],
        containerSizeStyles[size],
        className
      )}
      accessibilityRole="text"
    >
      {dot && (
        <View
          className={cn(
            'rounded-full',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotVariantStyles[variant]
          )}
        />
      )}
      {icon}
      <Text variant={size === 'sm' ? 'caption' : 'label'} className={textVariantStyles[variant]}>
        {label}
      </Text>
    </View>
  )
}
