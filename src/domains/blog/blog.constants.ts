export const BLOG_STALE_TIME = 5 * 60 * 1000 // 5 dakika

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params?: unknown) => [...blogKeys.lists(), params ?? {}] as const,
  detail: (slug: string) => [...blogKeys.all, 'detail', slug] as const,
} as const
