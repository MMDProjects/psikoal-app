import { z } from 'zod'

export const OfferStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'])

export const OfferSchema = z.object({
  id: z.string().uuid(),
  listingId: z.string().uuid(),
  expertId: z.string().uuid(),
  title: z.string().max(100).nullable().optional(),
  price: z.number().positive(),
  description: z.string().max(300).default(''),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
  status: OfferStatusSchema,
  matchId: z.string().uuid().nullable().optional(),
  createdAt: z.string().datetime(),
  createdAtRelative: z.string().optional(),
  listing: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
      clientId: z.string().uuid(),
      city: z.string().nullable().optional(),
      clientDisplayName: z.string().nullable().optional(),
      // Eşleşme öncesi danışanın tam adı hiç gönderilmez — bkz. clientDisplayName.
      client: z
        .object({
          id: z.string().uuid(),
          initials: z.string().nullable().optional(),
          avatarUrl: z.string().url().nullable().optional(),
        })
        .nullable()
        .optional(),
      assessmentResult: z
        .object({
          id: z.string(),
          score: z.number(),
          level: z.enum(['low', 'moderate', 'high']),
          summary: z.string(),
          assessmentTitle: z.string(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
  expert: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      title: z.string(),
      initials: z.string().nullable().optional(),
      avatarUrl: z.string().url().nullable().optional(),
      rating: z.number(),
    })
    .nullable()
    .optional(),
})

/**
 * Boş bırakılan opsiyonel metin alanını YOK sayar.
 *
 * Form alanları `defaultValues` gereği boş string ile başlıyor ve `.optional()`
 * boş string'i geçirmiyor: `''` geçerli bir string olduğu için `.min(3)` yine
 * koşuyor ve düşüyor. Sonuç: "opsiyonel" etiketli alan boş bırakıldığında form
 * "En az 3 karakter" diyerek KİLİTLENİYOR ve kullanıcı, doldurması gerekmediği
 * söylenen bir alan yüzünden ilerleyemiyor.
 */
const optionalText = (schema: z.ZodString) =>
  z
    .string()
    .transform((value) => value.trim())
    .pipe(z.union([z.literal(''), schema]))
    .transform((value) => (value === '' ? undefined : value))
    .optional()

export const SendOfferSchema = z.object({
  listingId: z.string().uuid({ message: 'İlan seçiniz' }),
  title: optionalText(z.string().min(3, 'En az 3 karakter').max(100, 'En fazla 100 karakter')),
  price: z.number({ error: 'Fiyat giriniz' }).positive('Geçerli fiyat giriniz'),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
  description: optionalText(z.string().max(300, 'En fazla 300 karakter')),
})
