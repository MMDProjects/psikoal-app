import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { blogKeys, BLOG_STALE_TIME } from '../blog.constants'
import { BlogListItemSchema } from '../schemas/blog.schema'

import { get } from '@/lib/api'

const BlogListResponseSchema = z.object({
  data: z.array(BlogListItemSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

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
