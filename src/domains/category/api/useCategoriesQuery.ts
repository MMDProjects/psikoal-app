import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { categoryKeys, CATEGORY_STALE_TIME } from '../category.constants'
import { CategorySchema } from '../schemas/category.schema'

import { get } from '@/lib/api'

const CategoryListResponseSchema = z.object({
  data: z.array(CategorySchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const raw = await get('/categories')
      const result = CategoryListResponseSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data.data
    },
    staleTime: CATEGORY_STALE_TIME,
  })
}
