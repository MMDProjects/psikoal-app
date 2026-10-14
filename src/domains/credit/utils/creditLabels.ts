import { INSUFFICIENT_CREDITS_CODE } from '../credit.constants'

import { ApiError } from '@/lib/api'

/** POST /offers'ın 422 INSUFFICIENT_CREDITS yanıtı mı? */
export function isInsufficientCreditsError(error: unknown): boolean {
  return error instanceof ApiError && error.code === INSUFFICIENT_CREDITS_CODE
}

/**
 * "Teklif başı 1 kredi". Backend offerCost için hazır etiket döndürmüyor; sayı
 * olduğu gibi gösterilir (hesaplama yok).
 */
export function offerCostLabel(offerCost: number): string {
  return `Teklif başı ${offerCost} kredi`
}

/**
 * Defter satırının işaretli miktarı: "+20" / "-1". Backend amount'u işaretli
 * tam sayı olarak verir; burada yalnız artı işareti eklenir.
 */
export function signedAmountLabel(amount: number): string {
  return amount > 0 ? `+${amount}` : String(amount)
}
