import { z } from 'zod'

export const MatchStatusSchema = z.enum(['ACTIVE', 'COMPLETED', 'RELEASED'])

export const MatchSchema = z.object({
  id: z.string().uuid(),
  listingId: z.string().uuid(),
  acceptedOfferId: z.string().uuid(),
  clientId: z.string().uuid(),
  expertId: z.string().uuid(),
  status: MatchStatusSchema,
  createdAt: z.string().datetime(),
  createdAtRelative: z.string().optional(),
  clientReleasedAt: z.string().datetime().nullable().optional(),
  expertReleasedAt: z.string().datetime().nullable().optional(),
  client: z
    .object({
      id: z.string().uuid(),
      fullName: z.string(),
      initials: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().nullable().optional(),
    })
    .optional(),
  expert: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      title: z.string(),
      initials: z.string().optional(),
    })
    .optional(),
  listing: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().optional(),
      specialization: z.array(z.string()).default([]),
      budgetMin: z.number(),
      budgetMax: z.number(),
      budgetLabel: z.string().optional(),
      preferredSessionType: z.string(),
      status: z.string(),
      city: z.string().optional(),
    })
    .nullable()
    .optional(),
  offer: z
    .object({
      id: z.string().uuid(),
      price: z.number(),
      sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
      status: z.string(),
    })
    .nullable()
    .optional(),
})

const EmbeddedAssessmentResultSchema = z
  .object({
    id: z.string(),
    score: z.number(),
    level: z.enum(['low', 'moderate', 'high']),
    summary: z.string(),
    assessmentTitle: z.string(),
  })
  .optional()

const EmbeddedListingSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().optional(),
    specialization: z.array(z.string()).default([]),
    budgetMin: z.number(),
    budgetMax: z.number(),
    budgetLabel: z.string().optional(),
    preferredSessionType: z.string(),
    status: z.string(),
    city: z.string().optional(),
    assessmentResult: EmbeddedAssessmentResultSchema,
  })
  .optional()

const EmbeddedOfferSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().optional(),
    price: z.number(),
    description: z.string().default(''),
    sessionType: z.enum(['online', 'yüz_yüze', 'yüz_yüze_online']),
    status: z.string(),
  })
  .optional()

export const MatchDetailSchema = MatchSchema.extend({
  client: z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    initials: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().nullable().optional(),
    createdAt: z.string().datetime().optional(),
  }),
  listing: EmbeddedListingSchema,
  offer: EmbeddedOfferSchema,
})

export const ReleaseMatchBodySchema = z.object({
  matchId: z.string().uuid(),
  reason: z.string().max(500).optional(),
})
