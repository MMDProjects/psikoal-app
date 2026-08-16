import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '../store/authStore'

import type { UpdateProfileRequest } from '../types/auth.types'

import { patch } from '@/lib/api'

export function useUpdateProfileMutation() {
  const { updateUser } = useAuthStore()

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return patch<UpdateProfileRequest>('/auth/me', data)
    },
    onSuccess: (updated) => {
      updateUser(updated)
    },
  })
}
