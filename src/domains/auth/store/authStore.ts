import { create } from 'zustand'

import type { AuthUser, UserRole } from '../types/auth.types'

import { mmkvStorage, persist } from '@/store/middleware'

type AuthState = {
  userId: string | null
  role: UserRole | null
  isAuthenticated: boolean
  user: AuthUser | null
}

type AuthActions = {
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (partial: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      userId: null,
      role: null,
      isAuthenticated: false,
      user: null,
      setAuth: (user, _accessToken, _refreshToken) =>
        set({ userId: user.id, role: user.role, isAuthenticated: true, user }),
      clearAuth: () => set({ userId: null, role: null, isAuthenticated: false, user: null }),
      updateUser: (partial) => {
        const current = get().user
        if (!current) return
        set({ user: { ...current, ...partial } })
      },
    }),
    {
      name: 'auth-storage',
      storage: mmkvStorage,
    }
  )
)
