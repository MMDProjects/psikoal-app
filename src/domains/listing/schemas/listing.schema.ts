import { z } from 'zod'

export const ListingStatusSchema = z.enum([
  'PENDING_APPROVAL',
  'OPEN',
  'MATCHED',
  'CLOSED',
  'EXPIRED',
  'REJECTED_BY_ADMIN',
])

export const ListingSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  // Eşleşme öncesi danışanın tam adı hiç gönderilmez (bkz. clientDisplayName) —
  // client nesnesi kasıtlı olarak yalnızca kimlik/initials/avatar taşır, fullName yoktur.
  client: z
    .object({
      id: z.string().uuid(),
      initials: z.string().optional(),
      avatarUrl: z.string().url().nullable().optional(),
      createdAt: z.string().datetime().optional(),
    })
    .optional(),
  clientDisplayName: z.string().optional(),
  rejectionReason: z.string().nullable().optional(),
  title: z.string().min(10).max(100),
  description: z.string().max(500),
  specialization: z.array(z.string()),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  preferredSessionType: z.preprocess(
    (v) => (v === 'fark_etmez' ? 'yüz_yüze_online' : v),
    z.enum(['online', 'yüz_yüze', 'yüz_yüze_online'])
  ),
  city: z.string().optional(),
  offerCount: z.number().int().min(0).default(0),
  status: ListingStatusSchema,
  budgetLabel: z.string(),
  expiresAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  createdAtRelative: z.string(),
  viewerHasOffered: z.boolean().optional(),
  viewerOfferId: z.string().uuid().optional(),
  assessmentResult: z
    .object({
      id: z.string(),
      score: z.number(),
      level: z.enum(['low', 'moderate', 'high']),
      summary: z.string(),
      assessmentTitle: z.string(),
    })
    .optional(),
})

export const CreateListingSchema = z
  .object({
    title: z
      .string()
      .min(10, 'En az 10 karakter giriniz')
      .max(100, 'En fazla 100 karakter giriniz'),
    description: z.string().max(500, 'En fazla 500 karakter giriniz').optional(),
    specialization: z.array(z.string()).min(1, 'En az 1 uzmanlık alanı seçiniz'),
    budgetMin: z.number({ error: 'Minimum bütçe giriniz' }).positive('Geçerli tutar giriniz'),
    budgetMax: z.number({ error: 'Maksimum bütçe giriniz' }).positive('Geçerli tutar giriniz'),
    preferredSessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
    city: z.string().optional(),
    assessmentResultId: z.string().optional(),
  })
  .refine((d) => d.budgetMax >= d.budgetMin, {
    message: 'Maksimum bütçe minimumdan küçük olamaz',
    path: ['budgetMax'],
  })
