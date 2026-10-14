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

// POST /experts/{id}/reviews gövdesi — CreateReviewDtoValidator ile aynı kurallar.
export const CreateReviewSchema = z.object({
  matchId: z.string().uuid(),
  rating: z
    .number()
    .int()
    .min(1, 'Lütfen 1-5 arası bir puan verin')
    .max(5, 'Lütfen 1-5 arası bir puan verin'),
  comment: z
    .string()
    .trim()
    .min(1, 'Lütfen kısa bir yorum yazın')
    .max(1000, 'Yorum en fazla 1000 karakter olabilir'),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']).nullable().optional(),
})

export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>
