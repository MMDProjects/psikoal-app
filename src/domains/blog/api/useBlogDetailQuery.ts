import { useQuery } from '@tanstack/react-query'

import { blogKeys, BLOG_STALE_TIME } from '../blog.constants'
import { BlogSchema } from '../schemas/blog.schema'

import { get } from '@/lib/api'

export function useBlogDetailQuery(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const raw = await get(`/blogs/${slug}`)
      const result = BlogSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: BLOG_STALE_TIME,
    enabled: Boolean(slug),
  })
}
