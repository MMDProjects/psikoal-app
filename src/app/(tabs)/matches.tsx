import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { SegmentedControl } from '@/core/components/molecules/SegmentedControl'
import { useRefresh } from '@/core/hooks'
import { useAuthStore } from '@/domains/auth'
import { useMatchesQuery, MatchRow } from '@/domains/match'
import { useUnreadNotificationCount } from '@/domains/notification'

type MatchTab = 'active' | 'past'

const MATCH_TAB_STATUSES: Record<MatchTab, string[]> = {
  active: ['ACTIVE'],
  past: ['COMPLETED', 'RELEASED'],
}

export default function MatchesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const role = useAuthStore((s) => s.role)
  const isExpert = role === 'expert'
  const [tab, setTab] = useState<MatchTab>('active')

  const matchesQuery = useMatchesQuery(MATCH_TAB_STATUSES[tab])
  const { isLoading, isError, refetch } = matchesQuery
  const { isRefreshing, onRefresh } = useRefresh(matchesQuery)
  const displayed = matchesQuery.data?.data ?? []
  const unreadCount = useUnreadNotificationCount()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={
          isExpert
            ? [{ icon: 'Bell', accessibilityLabel: 'Bildirimler', badgeCount: unreadCount, onPress: () => router.push('/notifications') }]
            : [
                { icon: 'Bell', accessibilityLabel: 'Bildirimler', badgeCount: unreadCount, onPress: () => router.push('/notifications') },
                { icon: 'Plus', accessibilityLabel: 'Yeni İlan Oluştur', onPress: () => router.push('/listing/new') },
              ]
        }
      />

      <FlatList
        data={(!isLoading && !isError) ? displayed : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <Text variant="heading" className={isExpert ? 'mb-3 pr-13' : 'mb-3 pr-24'}>Eşleşmelerim</Text>
            <SegmentedControl
              options={[
                { key: 'active', label: 'Aktif'  },
                { key: 'past',   label: 'Geçmiş' },
              ]}
              value={tab}
              onChange={setTab}
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="45%" height={12} />
                  </View>
                  {i < 2 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState icon="WifiOff" title="Yüklenemedi" ctaLabel="Tekrar Dene" onCta={refetch} />
          ) : (
            <EmptyState
              icon="Link"
              title={tab === 'active' ? 'Aktif eşleşme yok' : 'Geçmiş eşleşme yok'}
              description={
                tab === 'active'
                  ? (isExpert
                    ? "Fırsatlar sekmesinden ilanları inceleyin ve teklif gönderin."
                    : "İlanlarınıza gelen teklifleri kabul ettiğinizde eşleşmeler burada görünür.")
                  : ''
              }
              ctaLabel={tab === 'active' ? (isExpert ? "İlan Feed'ine Git" : "İlanlarıma Git") : undefined}
              onCta={tab === 'active' ? () => router.push(isExpert ? '/' : '/offers') : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <MatchRow
            match={item}
            hideStatus={tab === 'active'}
            viewerRole={role ?? 'client'}
            onPress={() => router.push(`/match/${item.id}`)}
          />
        )}
      />
    </View>
  )
}
