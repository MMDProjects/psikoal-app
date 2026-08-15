import { Image, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { useBlogDetailQuery, BlogLikeButton } from '@/domains/blog'

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const blogQuery = useBlogDetailQuery(slug ?? '')
  const { data: blog, isLoading, isError } = blogQuery
  const { isRefreshing, onRefresh } = useRefresh(blogQuery)

  return (
    <View className="flex-1 bg-white dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View>
          {isLoading ? (
            <Skeleton variant="rect" width="100%" height={220} />
          ) : blog ? (
            <Image
              source={{ uri: blog.coverImage }}
              style={{ width: '100%', aspectRatio: 16 / 9 }}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {isLoading ? (
          <View className="gap-3 px-5 pt-5">
            <Skeleton variant="line" width="50%" height={12} />
            <Skeleton variant="line" width="85%" height={22} />
            <Skeleton variant="line" width="65%" height={22} />
            <View className="mt-3 gap-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="line" width={`${75 + (i % 3) * 10}%`} height={14} />
              ))}
            </View>
          </View>
        ) : isError || !blog ? (
          <View className="px-5 pt-10">
            <EmptyState
              icon="AlertCircle"
              title="Blog yazısı bulunamadı"
              description="İçerik yüklenemedi. Lütfen daha sonra tekrar deneyin."
              ctaLabel="Geri Dön"
              onCta={() => router.back()}
            />
          </View>
        ) : (
          <View className="gap-4 px-5 pt-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="caption" className="font-semibold text-sky-500">
                  {blog.author.name}
                </Text>
                <Text variant="caption" className="text-neutral-400 dark:text-neutral-500">
                  {blog.author.title}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon name="Clock" size={13} color="#A3A3A3" />
                <Text variant="caption" className="text-neutral-400 dark:text-neutral-500">
                  {blog.readingTime} dk okuma
                </Text>
              </View>
            </View>

            <Text
              variant="heading"
              className="font-bold leading-tight text-neutral-900 dark:text-[#F5F5F7]"
            >
              {blog.title}
            </Text>

            <View className="flex-row flex-wrap gap-x-2 gap-y-1">
              {blog.categories.map((cat) => (
                <Text key={cat} variant="caption" className="font-semibold text-sky-500">
                  #{cat}
                </Text>
              ))}
            </View>

            <View className="h-px bg-neutral-100 dark:bg-dark-border" />

            <View className="gap-4">
              {(blog.content ?? '').split('\n\n').map((paragraph, i) => (
                <Text
                  key={i}
                  variant="body"
                  className="leading-relaxed text-neutral-700 dark:text-neutral-300"
                >
                  {paragraph}
                </Text>
              ))}
            </View>

            <View className="h-px bg-neutral-100 dark:bg-dark-border" />

            <View className="flex-row items-center gap-3">
              <BlogLikeButton slug={blog.slug} liked={blog.liked} likeCount={blog.likeCount} />
              <Text variant="caption" className="text-neutral-400 dark:text-neutral-500">
                {formatDate(blog.publishedAt, 'long')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
