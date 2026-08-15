import { View } from 'react-native'

import { useWalletQuery } from '../api/useWalletQuery'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type WalletBalanceProps = {
  compact?: boolean
  className?: string
}

export function WalletBalance({ compact = false, className }: WalletBalanceProps) {
  const { data: wallet, isLoading } = useWalletQuery()

  if (isLoading) {
    return <Skeleton variant="line" width={80} height={16} className={className} />
  }

  if (!wallet) return null

  if (compact) {
    return (
      <View className={cn('flex-row items-center gap-1.5', className)}>
        <Icon name="Wallet" size={14} color="#0369A1" />
        <Text variant="caption" className="font-semibold text-sky-700">
          ₺{wallet.balance.toLocaleString('tr-TR')}
        </Text>
      </View>
    )
  }

  return (
    <View className={cn('gap-1 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4', className)}>
      <View className="mb-1 flex-row items-center gap-2">
        <Icon name="Wallet" size={16} color="#0369A1" />
        <Text variant="caption" color="secondary">
          Bakiye
        </Text>
      </View>
      <Text variant="heading" className="text-2xl font-bold text-sky-700">
        ₺{wallet.balance.toLocaleString('tr-TR')}
      </Text>
      <Text variant="caption" color="secondary">
        {wallet.currency}
      </Text>
    </View>
  )
}
