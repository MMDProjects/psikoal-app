import { Pressable } from 'react-native'

import type { IconName } from '@/core/components/atoms/Icon'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'

export type MenuRowProps = {
  icon: IconName
  label: string
  onPress: () => void
  value?: string
  danger?: boolean
  hasArrow?: boolean
}

export function MenuRow({
  icon,
  label,
  onPress,
  value,
  danger = false,
  hasArrow = true,
}: MenuRowProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-4 active:opacity-90"
    >
      <Icon name={icon} size={18} color={danger ? colors.error : colors.contentSecondary} />
      <Text
        variant="body"
        className={danger ? 'flex-1 text-red-600 dark:text-red-400' : 'flex-1 dark:text-[#F5F5F7]'}
      >
        {label}
      </Text>
      {value ? (
        <Text variant="caption" color="tertiary">
          {value}
        </Text>
      ) : null}
      {hasArrow && <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />}
    </Pressable>
  )
}
