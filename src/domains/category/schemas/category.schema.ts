import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  icon: z.string(),
  summary: z.string(),
  description: z.string(),
  blogTag: z.string(),
  assessmentCategory: z.string().nullable(),
})

export const CategoryDetailSchema = CategorySchema.extend({
  expertCount: z.number().int().min(0),
  completedMatchCount: z.number().int().min(0),
})
