import type { CategoryDetailSchema, CategorySchema } from '../schemas/category.schema'
import type { z } from 'zod'

export type Category = z.infer<typeof CategorySchema>
export type CategoryDetail = z.infer<typeof CategoryDetailSchema>
