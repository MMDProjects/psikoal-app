export const CATEGORY_STALE_TIME = 10 * 60 * 1000 // 10 dakika

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
} as const
