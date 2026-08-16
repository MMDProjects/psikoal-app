import type { OfferStatusSchema, OfferSchema, SendOfferSchema } from '../schemas/offer.schema'
import type { z } from 'zod'

export type OfferStatus = z.infer<typeof OfferStatusSchema>
export type Offer = z.infer<typeof OfferSchema>
export type SendOfferRequest = z.infer<typeof SendOfferSchema>
