export const expertKeys = {
  all: ['experts'] as const,
  lists: () => [...expertKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...expertKeys.lists(), filters] as const,
  profiles: () => [...expertKeys.all, 'profile'] as const,
  profile: (id: string) => [...expertKeys.profiles(), id] as const,
  reviews: (id: string) => [...expertKeys.profile(id), 'reviews'] as const,
} as const

export const EXPERT_STALE_TIME = 5 * 60 * 1000 // 5 dakika
export const EXPERT_LIST_PAGE_SIZE = 20
