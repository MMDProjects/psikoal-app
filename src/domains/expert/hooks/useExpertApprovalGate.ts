import { useExpertProfileQuery } from '../api/useExpertProfileQuery'

import { useAuthStore } from '@/domains/auth'

type UseExpertApprovalGateReturn = {
  /** Uzman profili admin onayı bekliyor mu? (yalnızca expert rolünde anlamlı) */
  isPendingApproval: boolean
  /** Uzman profili reddedilmiş mi? */
  isRejected: boolean
  /** Teklif gönderme gibi onay gerektiren aksiyonlar serbest mi? */
  canAct: boolean
  isLoading: boolean
}

export function useExpertApprovalGate(): UseExpertApprovalGateReturn {
  const role = useAuthStore((s) => s.role)
  const userId = useAuthStore((s) => s.userId)

  const { data: expert, isLoading } = useExpertProfileQuery(role === 'expert' ? (userId ?? '') : '')

  if (role !== 'expert') {
    return { isPendingApproval: false, isRejected: false, canAct: true, isLoading: false }
  }

  const status = expert?.status
  const isPendingApproval = status === 'pending'
  const isRejected = status === 'rejected'

  return {
    isPendingApproval,
    isRejected,
    // Profil yüklenemediyse aksiyonu engellemiyoruz; backend son sözü söyler.
    canAct: !isPendingApproval && !isRejected,
    isLoading,
  }
}
