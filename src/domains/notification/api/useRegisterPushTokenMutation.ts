import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'

import type { RegisterPushTokenBody } from '../types/notification.types'

export function useRegisterPushTokenMutation() {
  return useMutation({
    mutationFn: async (body: RegisterPushTokenBody) => post('/push-tokens', body),
  })
}
