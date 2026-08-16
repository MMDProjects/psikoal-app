export const SUGGESTION_STALE_TIME = 10 * 60 * 1000 // 10 dakika

export const suggestionKeys = {
  all: ['suggestions'] as const,
  list: (audience: string) => [...suggestionKeys.all, 'list', audience] as const,
} as const
