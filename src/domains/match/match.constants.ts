import type { MatchStatus } from './types/match.types'
import type { IconName } from '@/core/components/atoms/Icon'

export const matchKeys = {
  all: ['matches'] as const,
  list: (status?: string[]) => [...matchKeys.all, 'list', status ?? []] as const,
  active: () => [...matchKeys.all, 'active'] as const,
  detail: (id: string) => [...matchKeys.all, 'detail', id] as const,
} as const

export const MATCH_STATUS_CONFIG: Record<
  MatchStatus,
  { label: string; icon: IconName; iconColor: string }
> = {
  ACTIVE: { label: 'Aktif', icon: 'Zap', iconColor: '#0EA5E9' },
  COMPLETED: { label: 'Tamamlandı', icon: 'CheckCircle2', iconColor: '#16A34A' },
  RELEASED: { label: 'Sonlandırıldı', icon: 'CircleSlash', iconColor: '#737373' },
}
