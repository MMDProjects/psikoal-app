import { View } from 'react-native'

import { signedAmountLabel } from '../utils/creditLabels'

import type { CreditTransaction } from '../types/credit.types'

import { Text } from '@/core/components/atoms/Text'

export type CreditTransactionRowProps = {
  transaction: CreditTransaction
}

/** Kredi defteri satırı: tür etiketi, açıklama, göreli zaman ve işaretli miktar. */
export function CreditTransactionRow({ transaction }: CreditTransactionRowProps) {
  const isPositive = transaction.amount > 0

  return (
    <View
      testID={`credit-transaction-${transaction.id}`}
      className="flex-row items-start gap-3 px-4 py-4"
    >
      <View className="flex-1 gap-0.5">
        <Text variant="label" className="font-semibold">
          {transaction.typeLabel}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={2}>
          {transaction.description}
        </Text>
        <Text variant="caption" color="tertiary" className="mt-1">
          {transaction.timeLabel}
        </Text>
      </View>
      <Text
        variant="label"
        weight="bold"
        color={isPositive ? 'success' : 'error'}
        accessibilityLabel={`${signedAmountLabel(transaction.amount)} kredi`}
      >
        {signedAmountLabel(transaction.amount)}
      </Text>
    </View>
  )
}
