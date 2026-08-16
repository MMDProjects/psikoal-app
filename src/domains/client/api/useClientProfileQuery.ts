import { useQuery } from '@tanstack/react-query'

import { clientKeys } from '../client.constants'
import { ClientSchema } from '../schemas/client.schema'

import { get } from '@/lib/api'

export function useClientProfileQuery(clientId: string) {
  return useQuery({
    queryKey: clientKeys.profile(clientId),
    queryFn: async () => {
      const raw = await get(`/clients/${clientId}`)
      return ClientSchema.parse(raw)
    },
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(clientId),
  })
}
