import { useMutation, useQueryClient } from '@tanstack/react-query'

import { matchKeys } from '../match.constants'
import { MatchSchema } from '../schemas/match.schema'

import type { ReleaseMatchBody } from '../types/match.types'

import { post } from '@/lib/api'

export function useReleaseMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: ReleaseMatchBody) => {
      const raw = await post(`/match/${body.matchId}/release`, body)
      return MatchSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
    },
  })
}
