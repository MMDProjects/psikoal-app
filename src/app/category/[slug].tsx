import { Pressable, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLocalSearchParams, useRouter } from 'expo-router'

import type { IconName } from '@/core/components/atoms/Icon'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useRefresh } from '@/core/hooks'
import { useAssessmentListQuery } from '@/domains/assessment'
import { useBlogListQuery, BlogCard } from '@/domains/blog'
import { useCategoryDetailQuery } from '@/domains/category'

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const categoryQuery = useCategoryDetailQuery(slug ?? '')
  const { data: category, isLoading: categoryLoading, isError: categoryError } = categoryQuery

  const assessmentsQuery = useAssessmentListQuery(category?.assessmentCategory ?? undefined)
  const assessments = assessmentsQuery.data
  const blogsQuery = useBlogListQuery({ category: category?.blogTag })
  const { isLoading: blogsLoading } = blogsQuery
  const blogs = blogsQuery.data?.data ?? []

  const { isRefreshing, onRefresh } = useRefresh(categoryQuery, assessmentsQuery, blogsQuery)

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {categoryLoading && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}>
          <View className="gap-4 px-4">
            <View className="flex-row items-center gap-3">
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="50%" height={16} />
              </View>
            </View>
            <Skeleton variant="line" width="80%" height={18} />
            <Skeleton variant="line" width="55%" height={11} />
          </View>
        </ScrollView>
      )}

      {(categoryError || (!categoryLoading && !category)) && (
        <EmptyState
          icon="AlertCircle"
          title="Kategori bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {category && (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 8,
              paddingBottom: bottomBarHeight + 16,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <ScreenTitle title="Destek Alın" />

            <View className="gap-4 px-4 py-5">
              <View className="flex-row items-center gap-3">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
                  <Icon name={category.icon as IconName} size={28} color="#0EA5E9" />
                </View>
                <View className="flex-1">
                  <Text variant="subheading" className="font-semibold leading-tight">
                    {category.name}
                  </Text>
                </View>
              </View>

              <Text variant="subheading" className="leading-snug">
                {category.summary}
              </Text>

              <View className="flex-row flex-wrap items-center gap-3">
                <View className="flex-row items-center gap-1.5">
                  <Icon name="Users" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">
                    {category.expertCount} uzman
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icon name="CheckCircle2" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">
                    {category.completedMatchCount} tamamlanan eşleşme
                  </Text>
                </View>
              </View>
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-2 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                {category.name} Hakkında
              </Text>
              <Text variant="body" color="secondary" className="leading-relaxed">
                {category.description}
              </Text>
            </View>

            {assessments && assessments.length > 0 && (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="px-4 pb-2 pt-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    İlgili Testler
                  </Text>
                </View>
                {assessments.map((a, i) => (
                  <View key={a.id}>
                    {i > 0 && <Divider spacing="none" className="mx-4" />}
                    <Pressable
                      onPress={() => router.push('/assessment/list' as never)}
                      className="flex-row items-center justify-between gap-3 px-4 py-4 active:opacity-80"
                    >
                      <View className="flex-1 gap-0.5">
                        <Text variant="body" className="font-medium dark:text-[#F5F5F7]">
                          {a.title}
                        </Text>
                        <Text variant="caption" color="tertiary">
                          Ücretsiz · {a.questionCount} soru · ~{a.estimatedMinutes} dk
                        </Text>
                      </View>
                      <Icon name="ChevronRight" size={16} color="#A3A3A3" />
                    </Pressable>
                  </View>
                ))}
              </>
            )}

            <Divider spacing="none" className="mx-4" />
            <View className="px-4 pb-2 pt-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                İlgili Bloglar
              </Text>
            </View>

            {blogsLoading ? (
              <View className="gap-3 px-4 py-4">
                <Skeleton variant="rect" width="100%" height={190} borderRadius="xl" />
                <Skeleton variant="line" width="40%" height={12} />
                <Skeleton variant="line" width="80%" height={14} />
              </View>
            ) : blogs.length > 0 ? (
              blogs.map((blog, i) => (
                <View key={blog.id}>
                  {i > 0 && <Divider spacing="none" className="mx-4" />}
                  <BlogCard
                    blog={blog}
                    onPress={() => router.push(`/blog/${blog.slug}` as never)}
                  />
                </View>
              ))
            ) : (
              <View className="items-center gap-2 px-4 py-6">
                <Icon name="FileText" size={28} color="#A3A3A3" />
                <Text variant="caption" color="secondary" align="center">
                  Bu konuyla ilgili henüz blog yazısı yok. Yakında eklenecek.
                </Text>
              </View>
            )}
          </ScrollView>

          <BottomActionBar
            actions={[
              {
                label: 'Destek Al',
                onPress: () =>
                  router.push(`/listing/new?spec=${encodeURIComponent(category.name)}` as never),
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
