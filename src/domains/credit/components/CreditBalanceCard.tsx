import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'

export type CreditBalanceCardProps = {
  balanceLabel?: string
  costLabel?: string
  isLoading?: boolean
  onPress: () => void
}

/** Uzman ana sayfasındaki kompakt bakiye kartı. Satın alma yolu yok (mağaza kuralı). */
export function CreditBalanceCard({
  balanceLabel,
  costLabel,
  isLoading = false,
  onPress,
}: CreditBalanceCardProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={balanceLabel ? `Kredilerim, ${balanceLabel}` : 'Kredilerim'}
      testID="credit-balance-card"
      className="flex-row items-center gap-3 rounded-xl bg-white px-4 py-3 active:opacity-80 dark:bg-dark-card"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900">
        <Icon name="Coins" size={18} color={colors.brand} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="caption" color="tertiary">
          Kredilerim
        </Text>
        {isLoading ? (
          <Skeleton variant="line" width="40%" height={14} />
        ) : (
          <Text variant="label" className="font-semibold">
            {balanceLabel ?? '—'}
          </Text>
        )}
      </View>
      {costLabel ? (
        <Text variant="caption" color="secondary">
          {costLabel}
        </Text>
      ) : null}
      <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
    </Pressable>
  )
}
