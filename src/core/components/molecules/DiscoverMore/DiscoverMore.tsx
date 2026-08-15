import { Pressable, useColorScheme, View } from 'react-native'

import type { IconName } from '@/core/components/atoms/Icon'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type DiscoverMoreVariant = 'row' | 'tile'

export type DiscoverMoreProps = {
  onPress: () => void
  label?: string
  hint?: string
  tag?: string
  icon?: IconName
  variant?: DiscoverMoreVariant
  tileWidth?: number
  tileHeight?: number
  className?: string
}

export function DiscoverMore({
  onPress,
  label = 'Daha Fazlasını Keşfet',
  hint,
  tag = '#keşfet',
  icon,
  variant = 'row',
  tileWidth = 200,
  tileHeight = 113,
  className,
}: DiscoverMoreProps) {
  const isDark = useColorScheme() === 'dark'
  if (variant === 'tile') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{ width: tileWidth }}
        className={cn('gap-2 active:opacity-70', className)}
      >
        <View
          className="rounded-xl bg-neutral-200/70 dark:bg-white/5"
          style={{ height: tileHeight }}
        />

        <View className="gap-1">
          <Text variant="caption" className="font-semibold text-sky-500" numberOfLines={1}>
            {tag}
          </Text>
          <Text
            variant="body"
            numberOfLines={2}
            className="font-semibold leading-snug text-neutral-900 dark:text-[#F5F5F7]"
            style={{ fontSize: 13 }}
          >
            {label}
          </Text>
          {hint && (
            <Text variant="caption" color="tertiary" className="mt-0.5" numberOfLines={1}>
              {hint}
            </Text>
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn('flex-row items-center gap-3 px-4 py-4 active:opacity-80', className)}
    >
      {icon && <Icon name={icon} size={18} color={isDark ? '#38BDF8' : '#0EA5E9'} />}
      <View className="flex-1 gap-0.5">
        <Text variant="body" className="font-medium dark:text-[#F5F5F7]">
          {label}
        </Text>
        {hint && (
          <Text variant="caption" color="tertiary">
            {hint}
          </Text>
        )}
      </View>
    </Pressable>
  )
}
