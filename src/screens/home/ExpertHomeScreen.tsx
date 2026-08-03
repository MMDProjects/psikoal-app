import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Chip } from '@/core/components/atoms/Chip'
import { Divider } from '@/core/components/atoms/Divider'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { HeroQuickActions } from '@/core/components/organisms/HeroQuickActions'
import { useRefresh } from '@/core/hooks'
import { useSuggestionsQuery, SuggestionSlide } from '@/domains/suggestion'
import { useAuthStore } from '@/domains/auth'
import { useMatchesQuery } from '@/domains/match'
import { useUnreadNotificationCount } from '@/domains/notification'
import { useExpertOffersQuery } from '@/domains/offer'
import {
  useListingListQuery,
  ListingCard,
  ListingFilterModal,
  ListingSortModal,
} from '@/domains/listing'

import { HomeHero } from './HomeHero'

import type { ListingListFilters, ListingSortValue } from '@/domains/listing'

export function ExpertHomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  const suggestionsQuery = useSuggestionsQuery('expert')
  const suggestions = suggestionsQuery.data

  const offersQuery = useExpertOffersQuery()
  const pendingOfferCount = offersQuery.data?.meta.pendingCount ?? 0

  const matchesQuery = useMatchesQuery()
  const activeMatchCount = matchesQuery.data?.meta.activeCount ?? 0
  const unreadCount = useUnreadNotificationCount()

  const [filters, setFilters] = useState<ListingListFilters>({})
  const [filterPriceLabels, setFilterPriceLabels] = useState<string[]>([])
  const [filterVisible, setFilterVisible] = useState(false)
  const [sort, setSort] = useState<ListingSortValue | undefined>(undefined)
  const [sortVisible, setSortVisible] = useState(false)

  const listingsQuery = useListingListQuery(filters, sort)
  const { isLoading, isError, refetch } = listingsQuery
  const listings = listingsQuery.data?.data ?? []
  const listingCount = listingsQuery.data?.meta.total ?? 0

  const { isRefreshing, onRefresh } = useRefresh(listingsQuery, offersQuery, matchesQuery, suggestionsQuery)

  const activeFilterCount = [
    (filters.specialization?.length ?? 0) > 0,
    (filters.sessionType?.length ?? 0) > 0,
    filterPriceLabels.length > 0,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
    setFilterPriceLabels([])
    setFilterVisible(false)
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          { icon: 'Bell', accessibilityLabel: 'Bildirimler', badgeCount: unreadCount, onPress: () => router.push('/notifications') },
        ]}
      />

      <FlatList
        data={(!isLoading && !isError) ? listings : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <HomeHero
              firstName={user?.firstName}
              subtitle="Bugün hangi fırsatı değerlendireceksiniz?"
              textRightInset={64}
              pages={[
                ...(suggestions ?? []).map((s) => <SuggestionSlide key={s.id} suggestion={s} />),
                <HeroQuickActions
                  key="quick-actions"
                  actions={[
                    {
                      icon: 'Briefcase',
                      label: 'Fırsatlar',
                      badge: listingCount,
                    },
                    {
                      icon: 'SendHorizonal',
                      label: 'Tekliflerim',
                      badge: pendingOfferCount,
                      onPress: () => router.push('/(tabs)/offers'),
                    },
                    {
                      icon: 'Users',
                      label: 'Eşleşmelerim',
                      badge: activeMatchCount,
                      onPress: () => router.push('/(tabs)/matches'),
                    },
                  ]}
                />,
              ]}
            />

            <View className="px-4 pb-3 pt-4">
              <View className="flex-row gap-2">
                <Chip
                  label="Filtrele"
                  variant="filter"
                  size="md"
                  isSelected={activeFilterCount > 0}
                  onPress={() => setFilterVisible(true)}
                  onRemove={activeFilterCount > 0 ? clearFilters : undefined}
                />
                <Chip
                  label="Sırala"
                  variant="filter"
                  size="md"
                  isSelected={sort !== undefined}
                  onPress={() => setSortVisible(true)}
                  onRemove={sort !== undefined ? () => setSort(undefined) : undefined}
                />
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <Divider spacing="none" className="mx-4" />}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="55%" height={12} />
                    <Skeleton variant="line" width="40%" height={12} />
                  </View>
                  {i < 3 && <Divider spacing="none" className="mx-4" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState
              icon="WifiOff"
              title="Yüklenemedi"
              description="İlanlar alınamadı. Bağlantınızı kontrol edin."
              ctaLabel="Tekrar Dene"
              onCta={refetch}
            />
          ) : (
            <EmptyState
              icon="FileText"
              title="İlan bulunamadı"
              description={
                activeFilterCount > 0
                  ? 'Bu filtreye uyan ilan yok. Filtreyi kaldırın.'
                  : 'Henüz açık ilan yok.'
              }
              ctaLabel={activeFilterCount > 0 ? 'Filtreleri Temizle' : undefined}
              onCta={activeFilterCount > 0 ? clearFilters : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            hideStatus
            onPress={() => router.push(`/listing/${item.id}`)}
          />
        )}
      />

      <ListingFilterModal
        visible={filterVisible}
        current={filters}
        currentPriceLabels={filterPriceLabels}
        onApply={({ filters: next, priceLabels }) => {
          setFilters(next)
          setFilterPriceLabels(priceLabels)
          setFilterVisible(false)
        }}
        onClear={clearFilters}
        onClose={() => setFilterVisible(false)}
      />

      <ListingSortModal
        visible={sortVisible}
        current={sort}
        onApply={(value) => {
          setSort(value)
          setSortVisible(false)
        }}
        onClear={() => {
          setSort(undefined)
          setSortVisible(false)
        }}
        onClose={() => setSortVisible(false)}
      />
    </View>
  )
}
