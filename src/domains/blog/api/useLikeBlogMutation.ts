import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { blogKeys } from '../blog.constants'

import { post } from '@/lib/api'

const LikeResponseSchema = z.object({ likeCount: z.number(), liked: z.boolean() })

type LikeParams = { slug: string }

export function useLikeBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slug }: LikeParams) => {
      const raw = await post(`/blogs/${slug}/like`, {})
      return LikeResponseSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
    },
  })
}
