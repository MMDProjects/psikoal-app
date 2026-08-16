export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  profiles: () => [...clientKeys.all, 'profile'] as const,
  profile: (id: string) => [...clientKeys.profiles(), id] as const,
} as const

export const MATCH_STATUS_CONFIG = {
  FREE: { variant: 'neutral', label: 'Serbest' } as const,
  PENDING: { variant: 'warning', label: 'Onay Bekliyor' } as const,
  MATCHED: { variant: 'sky', label: 'Eşleşildi' } as const,
  RELEASED: { variant: 'neutral', label: 'Serbest Bırakıldı' } as const,
} as const

export const CLIENT_STALE_TIME = 2 * 60 * 1000
