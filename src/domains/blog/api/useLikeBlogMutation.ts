import { useMutation, useQueryClient } from '@tanstack/react-query'

import { blogKeys } from '../blog.constants'
import { BlogLikeResponseSchema } from '../schemas/blog.schema'

import { post } from '@/lib/api'

type LikeParams = { slug: string }

export function useLikeBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slug }: LikeParams) => {
      const raw = await post(`/blogs/${slug}/like`, {})
      return BlogLikeResponseSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
    },
  })
}
