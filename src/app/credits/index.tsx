import { ActivityIndicator, FlatList, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useRefresh } from '@/core/hooks'
import { useThemeColors } from '@/core/theme'
import {
  CreditTransactionRow,
  offerCostLabel,
  useCreditBalanceQuery,
  useCreditTransactionsQuery,
} from '@/domains/credit'

/** /credits — uzmanın kredi bakiyesi ve defteri. Satın alma yolu yok (mağaza kuralı). */
export default function CreditHistoryScreen() {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()

  const balanceQuery = useCreditBalanceQuery()
  const transactionsQuery = useCreditTransactionsQuery()
  const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    transactionsQuery
  const transactions = data?.pages.flatMap((page) => page.data) ?? []

  const { isRefreshing, onRefresh } = useRefresh(balanceQuery, transactionsQuery)

  return (
    <View testID="screen-credits" className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <FlatList
        data={!isLoading && !isError ? transactions : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        contentContainerStyle={{ paddingTop: insets.top + 8 }}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
        }}
        ListHeaderComponent={
          <View>
            <ScreenTitle title="Kredilerim" />
            <View className="mx-4 mb-4 items-center gap-1 rounded-xl bg-white px-4 py-5 dark:bg-dark-card">
              {balanceQuery.isLoading ? (
                <Skeleton variant="line" width="35%" height={22} />
              ) : (
                <Text variant="subheading" className="font-bold">
                  {balanceQuery.data?.balanceLabel ?? '—'}
                </Text>
              )}
              {balanceQuery.data && (
                <Text variant="caption" color="secondary">
                  {offerCostLabel(balanceQuery.data.offerCost)}
                </Text>
              )}
            </View>
            <View className="px-4 pb-2">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Kredi Geçmişi
              </Text>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        renderItem={({ item }) => <CreditTransactionRow transaction={item} />}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <View key={i} className="gap-2 px-4 py-4">
                  <Skeleton variant="line" width="45%" height={13} />
                  <Skeleton variant="line" width="80%" height={12} />
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState
              icon="WifiOff"
              title="Yüklenemedi"
              description="Kredi geçmişi alınamadı. Bağlantınızı kontrol edin."
              ctaLabel="Tekrar Dene"
              onCta={() => void refetch()}
            />
          ) : (
            <EmptyState
              icon="Coins"
              title="Henüz kredi hareketi yok"
              description="Teklif gönderimleri ve bakiye değişiklikleri burada listelenir."
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator color={colors.brand} />
            </View>
          ) : null
        }
      />
    </View>
  )
}
