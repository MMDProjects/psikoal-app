import { useMutation } from '@tanstack/react-query'

import type { RegisterPushTokenBody } from '../types/notification.types'

import { post } from '@/lib/api'

export function useRegisterPushTokenMutation() {
  return useMutation({
    mutationFn: async (body: RegisterPushTokenBody) => post('/push-tokens', body),
  })
}
