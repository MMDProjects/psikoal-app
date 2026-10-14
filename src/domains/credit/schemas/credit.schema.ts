import { z } from 'zod'

// Sözleşme: backend docs/PAYMENTS.md + Dtos/Credit/*. Etiketler (balanceLabel,
// typeLabel, description, timeLabel) backend'de Türkçe hazırlanır; uygulama yalnız gösterir.

/** GET /credits/me → data */
export const CreditBalanceSchema = z.object({
  balance: z.number().int().min(0),
  offerCost: z.number().int().min(0),
  balanceLabel: z.string(),
})

export const CreditBalanceResponseSchema = z.object({
  data: CreditBalanceSchema,
})

export const CreditTransactionTypeSchema = z.enum(['PURCHASE', 'OFFER_SPEND', 'ADMIN_ADJUST'])

/** GET /credits/transactions → data[] */
export const CreditTransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().int(),
  balanceAfter: z.number().int().min(0),
  type: CreditTransactionTypeSchema,
  typeLabel: z.string(),
  description: z.string(),
  // Backend `Guid?` yazar: teklif dışı satırlarda null gelir (alan hiç düşmez).
  offerId: z.string().uuid().nullable(),
  // DateTimeOffset ofsetli yazılır ("+00:00"); `offset: true` olmadan düşer.
  createdAt: z.string().datetime({ offset: true }),
  timeLabel: z.string(),
})

export const CreditTransactionListResponseSchema = z.object({
  data: z.array(CreditTransactionSchema),
  meta: z.object({
    page: z.number().int().min(1),
    total: z.number().int().min(0),
    perPage: z.number().int().min(1),
  }),
})
