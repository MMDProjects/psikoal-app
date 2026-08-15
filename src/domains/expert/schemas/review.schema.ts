import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  expertId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']).optional(),
  createdAt: z.string().datetime(),
  createdAtRelative: z.string().optional(),
})

export type Review = z.infer<typeof ReviewSchema>
