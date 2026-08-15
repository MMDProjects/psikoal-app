import { Pressable } from 'react-native'

import { useBlogLike } from '../hooks/useBlogLike'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

type BlogLikeButtonProps = {
  slug: string
  liked: boolean
  likeCount: number
}

export function BlogLikeButton({
  slug,
  liked: initialLiked,
  likeCount: initialCount,
}: BlogLikeButtonProps) {
  const { liked, likeCount, toggleLike } = useBlogLike({
    slug,
    liked: initialLiked,
    likeCount: initialCount,
  })

  return (
    <Pressable
      onPress={toggleLike}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Beğeniyi geri al' : 'Beğen'}
      className={cn(
        'flex-row items-center gap-2 rounded-full border px-4 py-2.5 active:opacity-70',
        liked
          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
          : 'bg-neutral-50 dark:bg-dark-elevated border-neutral-200 dark:border-dark-border2'
      )}
    >
      <Icon name="Heart" size={18} color={liked ? '#EF4444' : '#A3A3A3'} />
      <Text
        variant="label"
        className={
          liked
            ? 'text-red-500 font-semibold'
            : 'text-neutral-500 dark:text-neutral-400 font-medium'
        }
      >
        {likeCount} Beğeni
      </Text>
    </Pressable>
  )
}
