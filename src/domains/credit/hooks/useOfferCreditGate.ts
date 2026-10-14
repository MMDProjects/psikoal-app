import { useCreditBalanceQuery } from '../api/useCreditBalanceQuery'
import { INSUFFICIENT_CREDITS_MESSAGE } from '../credit.constants'
import { isInsufficientCreditsError, offerCostLabel } from '../utils/creditLabels'

type UseOfferCreditGateParams = {
  /** Son teklif gönderme denemesinin hatası (useSendOfferMutation().error). */
  submitError?: unknown
}

type UseOfferCreditGateReturn = {
  /** "Teklif başı 1 kredi" — bakiye henüz yüklenmediyse undefined. */
  costLabel?: string
  /** Backend'in hazır etiketi: "12 kredi". */
  balanceLabel?: string
  /** Gönder butonu kredi yüzünden kilitli mi? */
  isBlocked: boolean
  /** Bakiye yetmiyorsa ya da sunucu 422 INSUFFICIENT_CREDITS döndüyse gösterilecek düz metin. */
  insufficientMessage?: string
  isLoading: boolean
}

/**
 * Teklif ekranının kredi kapısı. Bakiye okunamazsa (ağ vb.) gönderim
 * engellenmez: son sözü backend söyler ve 422 aynı mesaja çevrilir.
 */
export function useOfferCreditGate({
  submitError,
}: UseOfferCreditGateParams = {}): UseOfferCreditGateReturn {
  const { data, isLoading } = useCreditBalanceQuery()

  const lacksCredits = data !== undefined && data.balance < data.offerCost
  const serverSaysInsufficient = isInsufficientCreditsError(submitError)

  return {
    costLabel: data ? offerCostLabel(data.offerCost) : undefined,
    balanceLabel: data?.balanceLabel,
    isBlocked: lacksCredits,
    insufficientMessage:
      lacksCredits || serverSaysInsufficient ? INSUFFICIENT_CREDITS_MESSAGE : undefined,
    isLoading,
  }
}
