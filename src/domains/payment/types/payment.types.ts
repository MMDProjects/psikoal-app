import type {
  PackageSchema,
  PurchasedPackageSchema,
  CheckoutSessionSchema,
  InitiateCheckoutSchema,
  WalletSchema,
  WalletTransactionSchema,
} from '../schemas/payment.schema'
import type { z } from 'zod'

export type Package = z.infer<typeof PackageSchema>
export type PurchasedPackage = z.infer<typeof PurchasedPackageSchema>
export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>
export type InitiateCheckoutRequest = z.infer<typeof InitiateCheckoutSchema>
export type Wallet = z.infer<typeof WalletSchema>
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>
