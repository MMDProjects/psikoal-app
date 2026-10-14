import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import { useAuthStore } from '../store/authStore'

import { useMeQuery } from './useMeQuery'

import { axiosInstance } from '@/lib/api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
  multiGet: jest.fn(async (keys: string[]) => keys.map((k) => [k, null])),
  multiRemove: jest.fn(async () => undefined),
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => 'token'),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}))

const USER = {
  id: '3f1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  email: 'zeynep@psikoal.test',
  firstName: 'Zeynep',
  lastName: 'Yılmaz',
  role: 'client' as const,
  isVerified: false,
  avatarUrl: null,
  createdAt: '2026-08-21T22:22:14.704Z',
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useMeQuery', () => {
  let mock: MockAdapter
  let queryClient: QueryClient

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  afterEach(() => {
    mock.restore()
    queryClient.unmount()
    queryClient.clear()
    useAuthStore.getState().clearAuth()
  })

  it('refreshes the persisted user with the server copy', async () => {
    useAuthStore.getState().setAuth(USER, 'a', 'r')
    mock.onGet('/auth/me').reply(200, { ...USER, isVerified: true, firstName: 'Zeynep Nur' })

    const { result } = renderHook(() => useMeQuery(), { wrapper: createWrapper(queryClient) })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await waitFor(() => expect(useAuthStore.getState().user?.isVerified).toBe(true))
    expect(useAuthStore.getState().user?.firstName).toBe('Zeynep Nur')
  })

  it('does not call the API when logged out', () => {
    const { result } = renderHook(() => useMeQuery(), { wrapper: createWrapper(queryClient) })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mock.history.get).toHaveLength(0)
  })
})
