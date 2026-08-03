import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { useWalletQuery, WalletBalance } from '@/domains/payment'

export default function WalletScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const walletQuery = useWalletQuery()
  const { data: wallet, isLoading, isError } = walletQuery
  const { isRefreshing, onRefresh } = useRefresh(walletQuery)

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, gap: 16 }}>
          <View className="pt-2 pb-3 items-center">
            <Skeleton variant="line" width="30%" height={14} />
          </View>
          <Skeleton variant="rect" height={110} borderRadius="xl" />
          <Skeleton variant="line" width="40%" height={12} />
          <Skeleton variant="line" width="80%" height={14} />
          <Skeleton variant="line" width="70%" height={14} />
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Cüzdan yüklenemedi"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && wallet && (
        <>
          <ScrollView
            contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: bottomBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <ScreenTitle title="Cüzdanım" />

            <View className="px-4 pt-2">
              <WalletBalance />
            </View>

            <View className="px-4 pt-6 pb-2">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                İşlem Geçmişi
              </Text>
            </View>

            {wallet.transactions.length === 0 ? (
              <View className="items-center gap-2 py-6 px-4">
                <Icon name="ReceiptText" size={28} color="#A3A3A3" />
                <Text variant="caption" color="secondary" align="center">
                  Henüz işlem yok. Paket satın aldığınızda burada görünecek.
                </Text>
              </View>
            ) : (
              wallet.transactions.map((tx, index) => (
                <View key={tx.id}>
                  {index > 0 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                  <View className="flex-row items-center gap-3 px-4 py-3.5">
                    <View className={`w-9 h-9 rounded-full items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-50 dark:bg-red-950'}`}>
                      <Icon
                        name={tx.type === 'credit' ? 'ArrowDownLeft' : 'ArrowUpRight'}
                        size={16}
                        color={tx.type === 'credit' ? '#16A34A' : '#DC2626'}
                      />
                    </View>
                    <View className="flex-1 gap-0.5">
                      <Text variant="label" className="font-medium" numberOfLines={1}>{tx.description}</Text>
                      <Text variant="caption" color="tertiary">{formatDate(tx.createdAt, 'long')}</Text>
                    </View>
                    <Text
                      variant="label"
                      className={tx.type === 'credit' ? 'font-semibold text-green-700 dark:text-green-400' : 'font-semibold text-red-600 dark:text-red-400'}
                    >
                      {tx.type === 'credit' ? '+' : '-'}₺{tx.amount.toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <BottomActionBar
            actions={[{
              label: 'Seans Paketleri',
              onPress: () => router.push('/payment/packages' as never),
            }]}
          />
        </>
      )}
    </View>
  )
}
