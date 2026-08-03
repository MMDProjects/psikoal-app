import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { DiscoverMore } from '@/core/components/molecules/DiscoverMore'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { HeroQuickActions } from '@/core/components/organisms/HeroQuickActions'
import { useRefresh } from '@/core/hooks'
import { useThemeColors } from '@/core/theme'
import { useSuggestionsQuery, SuggestionSlide } from '@/domains/suggestion'
import { useAssessmentListQuery, useMyAssessmentResultsQuery } from '@/domains/assessment'
import { useAuthStore } from '@/domains/auth'
import { useCategoriesQuery } from '@/domains/category'
import { useMyListingsQuery } from '@/domains/listing'
import { useUnreadNotificationCount } from '@/domains/notification'
import { useBlogListQuery, BlogCarousel } from '@/domains/blog'

import { HomeHero } from './HomeHero'

import type { IconName } from '@/core/components/atoms/Icon'

export function ClientHomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const colors = useThemeColors()

  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data

  const goToNewListing = (spec?: string) => {
    const url = spec ? `/listing/new?spec=${encodeURIComponent(spec)}` : '/listing/new'
    router.push(url as never)
  }

  const suggestionsQuery = useSuggestionsQuery('client')
  const suggestions = suggestionsQuery.data

  const assessmentsQuery = useAssessmentListQuery()
  const assessmentList = assessmentsQuery.data
  const myResultsQuery = useMyAssessmentResultsQuery()
  const myResultCount = myResultsQuery.data?.meta.total ?? 0
  const lastResult = myResultsQuery.data?.data[0]

  const myListingsQuery = useMyListingsQuery()
  const activeListingCount = myListingsQuery.data?.meta.activeCount ?? 0

  const blogsQuery = useBlogListQuery({ limit: 3 })
  const blogs = blogsQuery.data?.data ?? []
  const unreadCount = useUnreadNotificationCount()

  const { isRefreshing, onRefresh } = useRefresh(
    categoriesQuery,
    suggestionsQuery,
    assessmentsQuery,
    myResultsQuery,
    myListingsQuery,
    blogsQuery,
  )

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          { icon: 'Bell', accessibilityLabel: 'Bildirimler', badgeCount: unreadCount, onPress: () => router.push('/notifications') },
          { icon: 'Plus', accessibilityLabel: 'Yeni İlan Oluştur', onPress: () => goToNewListing() },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <HomeHero
          firstName={user?.firstName}
          subtitle="Bugün nasıl hissediyorsunuz?"
          textRightInset={108}
          pages={[
            ...(suggestions ?? []).map((s) => <SuggestionSlide key={s.id} suggestion={s} />),
            <HeroQuickActions
              key="quick-actions"
              actions={[
                {
                  icon: 'Brain',
                  label: 'Testlerim',
                  badge: myResultCount,
                  onPress: () => router.push(lastResult ? '/assessment/list' : '/assessment'),
                },
                {
                  icon: 'FileText',
                  label: 'İlanlarım',
                  badge: activeListingCount,
                  onPress: () => router.push('/(tabs)/offers'),
                },
                {
                  icon: 'PlusCircle',
                  label: 'Yeni İlan',
                  onPress: () => goToNewListing(),
                },
                {
                  icon: 'ClipboardList',
                  label: 'Test Çöz',
                  onPress: () => router.push('/assessment'),
                },
              ]}
            />,
          ]}
        />

        <View className="pt-2">
          {assessmentList?.map((t, i) => (
            <View key={t.id}>
              {i > 0 && <Divider spacing="none" className="mx-4" />}
              <Pressable
                onPress={() => router.push('/assessment')}
                className="px-4 py-4 flex-row items-center justify-between gap-3 active:opacity-80"
              >
                <View className="flex-1 gap-0.5">
                  <Text variant="body" className="font-medium dark:text-[#F5F5F7]">{t.title}</Text>
                  <Text variant="caption" color="tertiary">
                    Ücretsiz · {t.questionCount} soru · ~{t.estimatedMinutes} dk · Kayıt gerekmez
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
              </Pressable>
            </View>
          ))}

          <Divider spacing="none" className="mx-4" />
          <DiscoverMore
            onPress={() => router.push('/assessment/list')}
            hint="Tüm testler ve geçmiş sonuçlarınız"
          />
        </View>

        <View className="mt-4">
          <BlogCarousel
            blogs={blogs}
            isLoading={blogsQuery.isLoading}
            onPressBlog={(slug) => router.push(`/blog/${slug}`)}
            onPressAll={() => router.push('/blog')}
          />
        </View>

        <View className="mt-2">
          <DiscoverMore
            icon="HeartHandshake"
            label="Desteğe mi ihtiyacınız var?"
            onPress={() => goToNewListing()}
          />
          {categories?.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => router.push(`/category/${category.slug}`)}
              className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
            >
              {/* REASON: icon adı backend'den düz string olarak gelir, IconName union'ına eşlenir */}
              <Icon name={(category.icon as IconName) ?? 'Circle'} size={18} color={colors.contentSecondary} />
              <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{category.name}</Text>
              <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
