import type {
  CreditBalanceSchema,
  CreditTransactionListResponseSchema,
  CreditTransactionSchema,
  CreditTransactionTypeSchema,
} from '../schemas/credit.schema'
import type { z } from 'zod'

export type CreditBalance = z.infer<typeof CreditBalanceSchema>
export type CreditTransactionType = z.infer<typeof CreditTransactionTypeSchema>
export type CreditTransaction = z.infer<typeof CreditTransactionSchema>
export type CreditTransactionPage = z.infer<typeof CreditTransactionListResponseSchema>
