import type { ReactNode } from 'react'

import { ActivityIndicator, Pressable } from 'react-native'

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import * as Haptics from 'expo-haptics'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'accent'
  | 'link'
  | 'success'
  | 'inverse'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export type ButtonProps = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  width?: number
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand border border-sky-400 active:bg-brand-hover dark:bg-sky-400 dark:border-sky-300 dark:active:bg-sky-300',
  secondary:
    'bg-brand-subtle border border-brand-border active:bg-brand-muted dark:bg-sky-950 dark:border-sky-800 dark:active:bg-sky-900',
  ghost:
    'border border-border active:bg-surface-sunken dark:border-dark-border dark:active:bg-dark-elevated',
  danger:
    'bg-semantic-error-light border border-semantic-error active:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:active:bg-red-900',
  accent: 'bg-accent border border-accent-border active:bg-accent-hover',
  link: 'px-0',
  success:
    'bg-green-600 border border-green-200 active:bg-green-700 dark:bg-green-600 dark:border-green-200 dark:active:bg-green-700',
  inverse: 'bg-white border border-white active:bg-sky-50',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-8  px-3   rounded-lg',
  sm: 'h-9  px-3.5 rounded-xl',
  md: 'h-11 px-5   rounded-xl',
  lg: 'h-13 px-6   rounded-xl',
}

const labelVariantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-brand-text',
  ghost: 'text-content-primary',
  danger: 'text-semantic-error-dark',
  accent: 'text-content-inverse',
  link: 'text-content-link underline',
  success: 'text-white',
  inverse: 'text-sky-700 dark:text-sky-700',
}

const labelSizeStyles: Record<ButtonSize, 'xs' | 'sm' | 'base' | 'base'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'base',
  lg: 'base',
}

const indicatorColor: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#0EA5E9',
  ghost: '#171717',
  danger: '#7F1D1D',
  accent: '#FFFFFF',
  link: '#0EA5E9',
  success: '#FFFFFF',
  inverse: '#0369A1',
}

const SPRING_CONFIG = { mass: 0.5, stiffness: 400, damping: 20 }

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  width,
  className,
}: ButtonProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.96, SPRING_CONFIG)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG)
  }

  const handlePress = () => {
    const hapticStyle =
      variant === 'ghost' || variant === 'link'
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    Haptics.impactAsync(hapticStyle).catch(() => undefined)
    onPress()
  }

  const disabled = isDisabled || isLoading

  return (
    <Animated.View
      style={[
        animatedStyle,
        fullWidth
          ? { width: '100%' }
          : width
            ? { width, alignSelf: 'center' as const }
            : { alignSelf: 'flex-start' as const },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, busy: isLoading }}
        className={cn(
          'flex-row items-center justify-center gap-2',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-40',
          fullWidth && 'w-full',
          className
        )}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={indicatorColor[variant]}
            accessibilityLabel="Loading"
          />
        ) : (
          <>
            {leftIcon}
            <Text
              variant="label"
              className={cn(labelVariantStyles[variant], `text-${labelSizeStyles[size]}`)}
            >
              {label}
            </Text>
            {rightIcon}
          </>
        )}
      </Pressable>
    </Animated.View>
  )
}
