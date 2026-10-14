export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
} as const

export const ME_STALE_TIME = 60 * 1000
