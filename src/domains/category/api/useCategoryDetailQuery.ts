import { useQuery } from '@tanstack/react-query'

import { categoryKeys, CATEGORY_STALE_TIME } from '../category.constants'
import { CategoryDetailSchema } from '../schemas/category.schema'

import { get } from '@/lib/api'

export function useCategoryDetailQuery(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const raw = await get(`/categories/${slug}`)
      const result = CategoryDetailSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: CATEGORY_STALE_TIME,
    enabled: Boolean(slug),
  })
}
