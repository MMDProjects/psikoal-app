import { Pressable, View } from 'react-native'

import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { IconName } from '@/core/components/atoms/Icon'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

export type HeaderActionItem = {
  icon: IconName
  onPress: () => void
  accessibilityLabel: string
  badgeCount?: number
}

export type HeaderActionsProps = {
  actions: HeaderActionItem[]
}

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 }

export function HeaderActions({ actions }: HeaderActionsProps) {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        right: 16,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.accessibilityLabel}
          onPress={action.onPress}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={
            action.badgeCount
              ? `${action.accessibilityLabel}, ${action.badgeCount} okunmamış`
              : action.accessibilityLabel
          }
          className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-neutral-100 dark:bg-dark-elevated dark:active:bg-dark-control"
        >
          <Icon name={action.icon} size={20} color={iconColor} />
          {(action.badgeCount ?? 0) > 0 && (
            <View className="absolute -right-0.5 -top-0.5 h-[18px] min-w-[18px] items-center justify-center rounded-full border border-white bg-sky-500 px-1 dark:border-dark-elevated">
              <Text variant="caption" className="text-[10px] font-bold leading-none text-white">
                {(action.badgeCount ?? 0) > 9 ? '9+' : String(action.badgeCount)}
              </Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  )
}
