import { z } from 'zod'

export const PackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  sessionCount: z.number().int().min(3).max(20),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  unitPrice: z.number().positive(),
  discountPct: z.number().min(0).max(100),
  validDays: z.number().int().positive(),
  isPopular: z.boolean().optional(),
})

export const PurchasedPackageSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  packageName: z.string(),
  sessionCount: z.number().int(),
  usedSessions: z.number().int(),
  expiresAt: z.string().datetime(),
  purchasedAt: z.string().datetime(),
  isExpired: z.boolean(),
})

export const CheckoutSessionSchema = z.object({
  checkoutFormContent: z.string(),
  token: z.string(),
  paymentPageUrl: z.string().url(),
})

export const InitiateCheckoutSchema = z.object({
  packageId: z.string(),
})

export const WalletTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['credit', 'debit']),
  amount: z.number().positive(),
  description: z.string(),
  createdAt: z.string().datetime(),
})

export const WalletSchema = z.object({
  balance: z.number().min(0),
  currency: z.string().default('TRY'),
  transactions: z.array(WalletTransactionSchema),
})
