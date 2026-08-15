import { Pressable, View } from 'react-native'

import { useColorScheme } from 'nativewind'

import type { IconName } from '@/core/components/atoms/Icon'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

export type HeroQuickAction = {
  icon: IconName
  label: string
  badge?: number
  onPress?: () => void
}

export type HeroQuickActionsProps = {
  actions: HeroQuickAction[]
}

export function HeroQuickActions({ actions }: HeroQuickActionsProps) {
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#7DD3FC' : '#0EA5E9'

  return (
    <View className="flex-row gap-2.5">
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          disabled={!action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="flex-1 items-center gap-2 rounded-2xl bg-sky-100 px-1 py-3 active:opacity-80 dark:bg-sky-900"
        >
          <View>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-sky-950">
              <Icon name={action.icon} size={20} color={iconColor} />
            </View>
            {(action.badge ?? 0) > 0 && (
              <View
                className="absolute h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1"
                style={{ top: -4, right: -6 }}
              >
                <Text variant="caption" className="text-[10px] font-bold text-white">
                  {action.badge}
                </Text>
              </View>
            )}
          </View>

          <Text
            variant="caption"
            className="text-center font-semibold text-sky-800 dark:text-sky-100"
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
