import { Image, Pressable, ScrollView, View } from 'react-native'

import type { BlogListItem } from '../types/blog.types'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { DiscoverMore } from '@/core/components/molecules/DiscoverMore'

const CARD_W = 200
const IMAGE_H = 113 // 16:9

export type BlogCarouselProps = {
  blogs: BlogListItem[]
  isLoading: boolean
  onPressBlog: (slug: string) => void
  onPressAll: () => void
}

export function BlogCarousel({ blogs, isLoading, onPressBlog, onPressAll }: BlogCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 12 }}
    >
      {isLoading
        ? [1, 2, 3].map((i) => (
            <View key={i} style={{ width: CARD_W }} className="gap-2">
              <Skeleton variant="rect" width={CARD_W} height={IMAGE_H} borderRadius="xl" />
              <Skeleton variant="line" width="45%" height={10} />
              <Skeleton variant="line" width="90%" height={13} />
            </View>
          ))
        : blogs.map((blog) => (
            <Pressable
              key={blog.id}
              style={{ width: CARD_W }}
              onPress={() => onPressBlog(blog.slug)}
              className="gap-2 active:opacity-85"
            >
              <Image
                source={{ uri: blog.coverImage }}
                style={{ width: CARD_W, height: IMAGE_H, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View className="gap-1">
                {blog.categories[0] && (
                  <Text variant="caption" className="font-semibold text-sky-500" numberOfLines={1}>
                    #{blog.categories[0]}
                  </Text>
                )}
                <Text
                  variant="body"
                  numberOfLines={2}
                  className="font-semibold leading-snug text-neutral-900 dark:text-[#F5F5F7]"
                  style={{ fontSize: 13 }}
                >
                  {blog.title}
                </Text>
                <View className="mt-0.5 flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <Icon name="Heart" size={11} color="#A3A3A3" />
                    <Text variant="caption" color="tertiary">
                      {blog.likeCount}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Icon name="Clock" size={11} color="#A3A3A3" />
                    <Text variant="caption" color="tertiary">
                      {blog.readingTime} dk
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}

      {!isLoading && blogs.length > 0 && (
        <DiscoverMore
          variant="tile"
          onPress={onPressAll}
          tileWidth={CARD_W}
          tileHeight={IMAGE_H}
          tag="#keşfet"
          hint="Tüm blog yazıları"
        />
      )}
    </ScrollView>
  )
}
