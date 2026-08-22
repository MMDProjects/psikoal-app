import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  expertId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  // .nullable() ZORUNLU: backend seans tipi girilmemis yorumda "sessionType": null
  // gonderiyor (Program.cs'te DefaultIgnoreCondition ayarli degil). Yalniz
  // .optional() olsaydi ReviewSchema.array().parse() firlar ve uzmanin TUM
  // yorum listesi bos gorunurdu. expert.schema.ts'teki kardes alanlar zaten
  // .nullable().optional() kullaniyor; buradaki eksiklik tutarsizliktan.
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']).nullable().optional(),
  createdAt: z.string().datetime(),
  createdAtRelative: z.string().optional(),
})

export type Review = z.infer<typeof ReviewSchema>
