import { QueryClient } from '@tanstack/react-query'

import { ApiError } from './api'

const SKIP_RETRY_STATUSES = new Set([401, 403, 404])

export const queryClient = new QueryClient({
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
