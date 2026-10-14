export const creditKeys = {
  all: ['credits'] as const,
  balance: () => [...creditKeys.all, 'balance'] as const,
  transactions: () => [...creditKeys.all, 'transactions'] as const,
} as const

export const CREDIT_STALE_TIME = 30 * 1000

/** Backend varsayılanı 20, üst sınırı 50 (CreditFieldLimits). */
export const CREDIT_TRANSACTIONS_PER_PAGE = 20

/** POST /offers → 422 { code: 'INSUFFICIENT_CREDITS' } */
export const INSUFFICIENT_CREDITS_CODE = 'INSUFFICIENT_CREDITS'

/**
 * App Store 3.1.1 / Google Play ödeme politikası: uygulama içinde satın alma
 * butonu, bağlantı, adres, fiyat ya da "uygulamada al" yönlendirmesi YOKTUR.
 * Yalnız bu düz metin gösterilir (backend docs/PAYMENTS.md).
 */
export const INSUFFICIENT_CREDITS_MESSAGE =
  'Teklif göndermek için yeterli krediniz yok. Kredi yüklemek için web sitemizi ziyaret edin.'
