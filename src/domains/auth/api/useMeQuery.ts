import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { authKeys, ME_STALE_TIME } from '../auth.constants'
import { AuthUserSchema } from '../schemas/auth.schema'
import { useAuthStore } from '../store/authStore'

import { get } from '@/lib/api'

/**
 * Oturum açıkken `GET /auth/me` ile kullanıcıyı tazeler ve auth store'a yazar.
 * Store diskte kalıcı olduğu için, bu çağrı olmadan admin onayı (isVerified)
 * gibi değişiklikler kullanıcı yeniden giriş yapana kadar görünmezdi.
 */
export function useMeQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const updateUser = useAuthStore((s) => s.updateUser)

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => AuthUserSchema.parse(await get('/auth/me')),
    staleTime: ME_STALE_TIME,
    enabled: isAuthenticated,
  })

  const { data } = query
  useEffect(() => {
    if (data) updateUser(data)
  }, [data, updateUser])

  return query
}
