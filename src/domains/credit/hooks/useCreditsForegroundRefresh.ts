import { useCallback, useEffect } from 'react'

import { AppState } from 'react-native'

import { useQueryClient } from '@tanstack/react-query'

import { creditKeys } from '../credit.constants'

type UseCreditsForegroundRefreshReturn = {
  /** Kredi sorgularını bayat işaretler; aktif olanlar hemen yeniden çekilir. */
  invalidateCredits: () => Promise<void>
}

/**
 * Kredi web sitesinden yüklenir: uzman tarayıcıdan dönüp uygulamayı öne
 * getirdiğinde bakiye tazelenmeli. `enabled` false iken (danışan) dinleyici
 * kurulmaz.
 */
export function useCreditsForegroundRefresh(enabled = true): UseCreditsForegroundRefreshReturn {
  const queryClient = useQueryClient()

  const invalidateCredits = useCallback(
    () => queryClient.invalidateQueries({ queryKey: creditKeys.all }),
    [queryClient]
  )

  useEffect(() => {
    if (!enabled) return
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void invalidateCredits()
    })
    return () => subscription.remove()
  }, [enabled, invalidateCredits])

  return { invalidateCredits }
}
