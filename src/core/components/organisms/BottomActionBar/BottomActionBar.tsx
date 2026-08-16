import type { ReactNode } from 'react'

import { Pressable, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type BottomBarActionVariant = 'primary' | 'ghost' | 'danger' | 'inverse' | 'inverseGhost'

export type BottomBarAction = {
  label: string
  onPress: () => void
  variant?: BottomBarActionVariant
  isLoading?: boolean
  loadingLabel?: string
  isDisabled?: boolean
}

export type BottomActionBarProps = {
  actions?: BottomBarAction[]
  children?: ReactNode
}

const variantStyles: Record<BottomBarActionVariant, { button: string; text: string }> = {
  primary: {
    button: 'bg-brand active:bg-brand-hover',
    text: 'text-white font-semibold',
  },
  ghost: {
    button:
      'bg-neutral-100 border border-neutral-300 dark:bg-neutral-800 dark:border-dark-border2 active:bg-neutral-200 dark:active:bg-neutral-700',
    text: 'text-neutral-600 dark:text-neutral-400 font-medium',
  },
  danger: {
    button:
      'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-900 active:bg-red-100 dark:active:bg-red-900',
    text: 'text-red-600 dark:text-red-400 font-medium',
  },
  inverse: {
    button: 'bg-white active:bg-sky-50',
    text: 'text-sky-700 dark:text-sky-700 font-semibold',
  },
  inverseGhost: {
    button: 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800',
    text: 'text-white font-medium',
  },
}

export function BottomActionBar({ actions = [], children }: BottomActionBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ position: 'absolute', bottom: insets.bottom, left: 16, right: 16 }}>
      {children ?? (
        <View className={cn(actions.length > 1 && 'flex-row gap-3')}>
          {actions.map((action) => {
            const { button, text } = variantStyles[action.variant ?? 'primary']
            const busy = action.isLoading ?? false
            return (
              <Pressable
                key={action.label}
                onPress={busy || action.isDisabled ? undefined : action.onPress}
                disabled={busy || action.isDisabled}
                className={cn(
                  'h-14 items-center justify-center rounded-full',
                  actions.length > 1 && 'flex-1',
                  button,
                  action.isDisabled && 'opacity-40'
                )}
              >
                <Text variant="label" className={text}>
                  {busy ? (action.loadingLabel ?? action.label) : action.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}
