import { useState } from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Chip } from '@/core/components/atoms/Chip'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { useRefresh } from '@/core/hooks'
import { useMyListingsQuery, ListingCard } from '@/domains/listing'
import { useUnreadNotificationCount } from '@/domains/notification'

import type { ListingStatus } from '@/domains/listing'

const CLIENT_LISTING_FILTERS: Array<{ label: string; value: ListingStatus }> = [
  { label: 'Onay Bekliyor', value: 'PENDING_APPROVAL'  },
  { label: 'Açık',          value: 'OPEN'              },
  { label: 'Eşleşildi',     value: 'MATCHED'           },
  { label: 'Kapalı',        value: 'CLOSED'            },
  { label: 'Süresi Doldu',  value: 'EXPIRED'           },
  { label: 'Reddedildi',    value: 'REJECTED_BY_ADMIN' },
]

export function ClientListingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<ListingStatus | 'ALL'>('ALL')

  const myListingsQuery = useMyListingsQuery(filter === 'ALL' ? undefined : filter)
  const { isLoading } = myListingsQuery
  const { isRefreshing, onRefresh } = useRefresh(myListingsQuery)

  const listings = myListingsQuery.data?.data ?? []
  const unreadCount = useUnreadNotificationCount()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          { icon: 'Bell', accessibilityLabel: 'Bildirimler', badgeCount: unreadCount, onPress: () => router.push('/notifications') },
          { icon: 'Plus', accessibilityLabel: 'Yeni İlan Oluştur', onPress: () => router.push('/listing/new') },
        ]}
      />

      <FlatList
        data={!isLoading ? listings : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <Text variant="heading" className="mb-3 pr-24">İlanlarım</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
              {CLIENT_LISTING_FILTERS.map((item) => (
                <Chip
                  key={item.value}
                  label={item.label}
                  variant="filter"
                  size="md"
                  isSelected={filter === item.value}
                  onPress={() => setFilter(item.value)}
                  onRemove={filter === item.value ? () => setFilter('ALL') : undefined}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="50%" height={12} />
                  </View>
                  {i < 2 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="FileText"
              title={filter !== 'ALL' ? 'İlan bulunamadı' : 'Henüz ilan yok'}
              description={filter !== 'ALL' ? 'Bu filtreye uygun ilan yok.' : 'İlan oluşturun, uzmanlar size teklif göndersin.'}
              ctaLabel={filter === 'ALL' ? 'İlan Oluştur' : undefined}
              onCta={filter === 'ALL' ? () => router.push('/listing/new') : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push(`/listing/${item.id}`)}
          />
        )}
      />
    </View>
  )
}
