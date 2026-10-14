import { Alert } from 'react-native'

import { MutationCache, QueryClient } from '@tanstack/react-query'

import { ApiError, getErrorMessage } from './api'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /**
       * true: hata ekranda satır içinde gösteriliyor (form hataları) ya da
       * kullanıcıyı ilgilendirmiyor (arka plan kaydı) — global uyarı açılmaz.
       */
      suppressErrorAlert?: boolean
    }
  }
}

const SKIP_RETRY_STATUSES = new Set([401, 403, 404])

const ERROR_ALERT_TITLE = 'İşlem tamamlanamadı'

/**
 * Hiçbir mutation sessizce başarısız olmaz: hatayı kendisi göstermeyen her
 * mutation için Türkçe bir uyarı açılır. Oturum düşmesi (401) zaten giriş
 * ekranına yönlendirdiği için ayrıca uyarılmaz.
 */
export function handleMutationError(error: unknown, suppress: boolean | undefined): void {
  if (suppress) return
  if (error instanceof ApiError && error.status === 401) return
  Alert.alert(ERROR_ALERT_TITLE, getErrorMessage(error))
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      handleMutationError(error, mutation.meta?.suppressErrorAlert)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && SKIP_RETRY_STATUSES.has(error.status)) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
