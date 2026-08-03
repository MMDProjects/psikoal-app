import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'
import { cn } from '@/core/utils/cn'

import type { UserRole } from '../types/auth.types'

const ICON_ON_BRAND = '#FFFFFF'

export type RoleCardProps = {
  role: UserRole
  selected: boolean
  onPress: () => void
}

export function RoleCard({ role, selected, onPress }: RoleCardProps) {
  const colors = useThemeColors()
  const isExpert = role === 'expert'

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 rounded-xl p-5 items-center gap-3',
        selected
          ? 'bg-white dark:bg-white'
          : 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
      )}
    >
      <View
        className={cn(
          'w-14 h-14 rounded-full items-center justify-center',
          selected ? 'bg-sky-100' : 'bg-sky-700 dark:bg-sky-950'
        )}
      >
        <Icon
          name={isExpert ? 'Stethoscope' : 'User'}
          size={28}
          color={selected ? colors.brand : ICON_ON_BRAND}
        />
      </View>
      <View className="items-center gap-1">
        <Text
          variant="label"
          className={selected ? 'text-sky-700 dark:text-sky-700 font-bold' : 'text-white font-semibold'}
        >
          {isExpert ? 'Psikolog' : 'Danışan'}
        </Text>
        <Text
          variant="caption"
          align="center"
          className={selected ? 'text-neutral-500 dark:text-neutral-500' : 'text-sky-100'}
        >
          {isExpert
            ? 'İlanlara teklif verin, danışan edinin'
            : 'Psikolog bulun ve terapi alın'}
        </Text>
      </View>
    </Pressable>
  )
}
