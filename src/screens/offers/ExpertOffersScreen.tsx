import { useState } from 'react'

import { FlatList, Pressable, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { OfferStatus } from '@/domains/offer'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { useUnreadNotificationCount } from '@/domains/notification'
import { useExpertOffersQuery, OFFER_STATUS_CONFIG } from '@/domains/offer'

const EXPERT_FILTERS: Array<{ label: string; value: OfferStatus }> = [
  { label: 'Beklemede', value: 'PENDING' },
  { label: 'Kabul', value: 'ACCEPTED' },
  { label: 'Reddedildi', value: 'REJECTED' },
  { label: 'Geri Çekildi', value: 'WITHDRAWN' },
]

export function ExpertOffersScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<OfferStatus | 'ALL'>('ALL')
  const offersQuery = useExpertOffersQuery(filter === 'ALL' ? undefined : filter)
  const { isLoading, isError, refetch } = offersQuery
  const { isRefreshing, onRefresh } = useRefresh(offersQuery)

  const offers = offersQuery.data?.data ?? []
  const offerCount = offersQuery.data?.meta.total ?? 0
  const unreadCount = useUnreadNotificationCount()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          {
            icon: 'Bell',
            accessibilityLabel: 'Bildirimler',
            badgeCount: unreadCount,
            onPress: () => router.push('/notifications'),
          },
        ]}
      />

      <FlatList
        data={!isLoading && !isError ? offers : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <View className="mb-3 flex-row items-center justify-between pr-13">
              <Text variant="heading">Tekliflerim</Text>
              <Text variant="caption" color="secondary">
                {offerCount} teklif
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              {EXPERT_FILTERS.map((item) => (
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
              {[1, 2, 3].map((i) => (
                <View key={i}>
                  <View className="gap-3 px-4 py-4">
                    <Skeleton variant="line" width="65%" height={14} />
                    <Skeleton variant="line" width="40%" height={12} />
                  </View>
                  {i < 3 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState icon="WifiOff" title="Yüklenemedi" ctaLabel="Tekrar Dene" onCta={refetch} />
          ) : (
            <EmptyState
              icon="SendHorizonal"
              title="Teklif bulunamadı"
              description={
                filter !== 'ALL'
                  ? 'Bu filtreye uygun teklif yok.'
                  : 'Fırsatlar sekmesinden bir ilana teklif gönderin.'
              }
              ctaLabel="İlan Feed'ine Git"
              onCta={() => router.push('/')}
            />
          )
        }
        renderItem={({ item }) => {
          const cfg = OFFER_STATUS_CONFIG[item.status]
          return (
            <Pressable
              onPress={() => router.push(`/offer/${item.id}`)}
              className="gap-3 px-4 py-4 active:opacity-90"
            >
              <View className="flex-row items-start justify-between gap-2">
                <Text
                  variant="label"
                  className="flex-1 font-semibold leading-snug text-neutral-900 dark:text-[#F5F5F7]"
                >
                  {item.listing?.title ?? 'İlan'}
                </Text>
                <View className="shrink-0 flex-row items-center gap-1">
                  <Icon name={cfg.icon} size={13} color={cfg.iconColor} />
                  <Text variant="caption" className="font-medium" style={{ color: cfg.iconColor }}>
                    {cfg.label}
                  </Text>
                </View>
              </View>

              {item.description ? (
                <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
                  {item.description}
                </Text>
              ) : null}

              <View className="flex-row flex-wrap gap-1.5">
                <Chip label={`₺${item.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
                <Chip
                  label={item.sessionType === 'online' ? 'Online' : 'Yüz yüze'}
                  variant="session"
                  isSelected
                />
              </View>

              <View className="flex-row items-center justify-between pt-1">
                {item.listing?.client ? (
                  <View className="flex-row items-center gap-2">
                    <Avatar
                      size="xs"
                      initials={item.listing.client.initials ?? ''}
                      src={item.listing.client.avatarUrl ?? undefined}
                    />
                    <Text variant="caption" color="secondary">
                      {item.listing.clientDisplayName ?? ''}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                <Text variant="caption" color="tertiary">
                  {formatDate(item.createdAt, 'dayMonth')}
                </Text>
              </View>
            </Pressable>
          )
        }}
      />
    </View>
  )
}
