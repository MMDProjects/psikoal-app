import { useQuery } from '@tanstack/react-query'

import { blogKeys, BLOG_STALE_TIME } from '../blog.constants'
import { BlogListResponseSchema } from '../schemas/blog.schema'

import { get } from '@/lib/api'

type BlogListParams = {
  category?: string
  limit?: number
}

export function useBlogListQuery(params: BlogListParams = {}) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: async () => {
      const raw = await get('/blogs', { params })
      const result = BlogListResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: BLOG_STALE_TIME,
  })
}
