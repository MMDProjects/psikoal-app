import { FlatList, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Divider } from '@/core/components/atoms/Divider'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useRefresh } from '@/core/hooks'
import { useBlogListQuery, BlogCard } from '@/domains/blog'

export default function BlogFeedScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const blogsQuery = useBlogListQuery()
  const { data, isLoading, isError, refetch } = blogsQuery
  const { isRefreshing, onRefresh } = useRefresh(blogsQuery)
  const blogs = data?.data ?? []

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <FlatList
        data={!isLoading && !isError ? blogs : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={<ScreenTitle title="Psikoloji Blogu" />}
        ItemSeparatorComponent={() => <Divider spacing="none" className="mx-4" />}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="gap-3 px-4 py-4">
                    <Skeleton variant="rect" width="100%" height={190} borderRadius="xl" />
                    <Skeleton variant="line" width="40%" height={12} />
                    <Skeleton variant="line" width="80%" height={14} />
                    <Skeleton variant="line" width="100%" height={11} />
                    <Skeleton variant="line" width="90%" height={11} />
                  </View>
                  {i < 2 && <Divider spacing="none" className="mx-4" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState
              icon="WifiOff"
              title="Yüklenemedi"
              description="Blog yazıları alınamadı. Bağlantınızı kontrol edin."
              ctaLabel="Tekrar Dene"
              onCta={refetch}
            />
          ) : (
            <EmptyState
              icon="FileText"
              title="Henüz içerik yok"
              description="Yakında yeni yazılar eklenecek."
            />
          )
        }
        renderItem={({ item }) => (
          <BlogCard blog={item} onPress={() => router.push(`/blog/${item.slug}` as never)} />
        )}
      />
    </View>
  )
}
