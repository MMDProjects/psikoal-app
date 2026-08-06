import { z } from 'zod'

export const OfferStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'])

export const OfferSchema = z.object({
  id:          z.string().uuid(),
  listingId:   z.string().uuid(),
  expertId:    z.string().uuid(),
  title:       z.string().max(100).optional(),
  price:       z.number().positive(),
  description: z.string().max(300).default(''),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
  status:      OfferStatusSchema,
  matchId:     z.string().uuid().optional(),
  createdAt:   z.string().datetime(),
  createdAtRelative: z.string().optional(),
  listing: z.object({
    id:       z.string().uuid(),
    title:    z.string(),
    clientId: z.string().uuid(),
    city:     z.string().optional(),
    clientDisplayName: z.string().optional(),
    // Eşleşme öncesi danışanın tam adı hiç gönderilmez — bkz. clientDisplayName.
    client: z.object({
      id:        z.string().uuid(),
      initials:  z.string().optional(),
      avatarUrl: z.string().url().nullable().optional(),
    }).optional(),
    assessmentResult: z.object({
      id:              z.string(),
      score:           z.number(),
      level:           z.enum(['low', 'moderate', 'high']),
      summary:         z.string(),
      assessmentTitle: z.string(),
    }).optional(),
  }).optional(),
  expert: z.object({
    id:        z.string().uuid(),
    name:      z.string(),
    title:     z.string(),
    initials:  z.string().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    rating:    z.number(),
  }).optional(),
})

export const SendOfferSchema = z.object({
  listingId:   z.string().uuid({ message: 'İlan seçiniz' }),
  title:       z.string().min(3, 'En az 3 karakter').max(100, 'En fazla 100 karakter').optional(),
  price:       z.number({ error: 'Fiyat giriniz' }).positive('Geçerli fiyat giriniz'),
  sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
  description: z.string().max(300, 'En fazla 300 karakter').optional(),
})
