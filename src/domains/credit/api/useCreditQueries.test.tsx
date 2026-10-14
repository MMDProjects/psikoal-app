import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import balanceResponse from '../schemas/__fixtures__/credit-balance.response.json'
import transactionsResponse from '../schemas/__fixtures__/credit-transactions.response.json'

import { useCreditBalanceQuery } from './useCreditBalanceQuery'
import { getNextCreditPage, useCreditTransactionsQuery } from './useCreditTransactionsQuery'

import { useAuthStore } from '@/domains/auth'
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

const EXPERT = {
  id: '3f1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  email: 'uzman@psikoal.test',
  firstName: 'Ayşe',
  lastName: 'Demir',
  role: 'expert' as const,
  isVerified: true,
  avatarUrl: null,
  createdAt: '2026-08-21T22:22:14.704Z',
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('kredi sorguları', () => {
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

  describe('useCreditBalanceQuery', () => {
    it('uzman için GET /credits/me yanıtının data alanını döner', async () => {
      useAuthStore.getState().setAuth(EXPERT, 'a', 'r')
      mock.onGet('/credits/me').reply(200, balanceResponse)

      const { result } = renderHook(() => useCreditBalanceQuery(), {
        wrapper: createWrapper(queryClient),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toEqual(balanceResponse.data)
    })

    it('danışan için istek atmaz (403 EXPERT_ROLE_REQUIRED)', () => {
      useAuthStore.getState().setAuth({ ...EXPERT, role: 'client' }, 'a', 'r')

      const { result } = renderHook(() => useCreditBalanceQuery(), {
        wrapper: createWrapper(queryClient),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mock.history.get).toHaveLength(0)
    })

    it('sözleşmeye uymayan yanıtta hata verir', async () => {
      useAuthStore.getState().setAuth(EXPERT, 'a', 'r')
      mock.onGet('/credits/me').reply(200, { data: { balance: '12' } })

      const { result } = renderHook(() => useCreditBalanceQuery(), {
        wrapper: createWrapper(queryClient),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })
  })

  describe('useCreditTransactionsQuery', () => {
    it('sayfa ve perPage parametreleriyle ister, sonraki sayfayı ekler', async () => {
      useAuthStore.getState().setAuth(EXPERT, 'a', 'r')
      const [first, second, third] = transactionsResponse.data
      mock.onGet('/credits/transactions', { params: { page: 1, perPage: 20 } }).reply(200, {
        data: [first, second],
        meta: { page: 1, total: 3, perPage: 2 },
      })
      mock.onGet('/credits/transactions', { params: { page: 2, perPage: 20 } }).reply(200, {
        data: [third],
        meta: { page: 2, total: 3, perPage: 2 },
      })

      const { result } = renderHook(() => useCreditTransactionsQuery(), {
        wrapper: createWrapper(queryClient),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.hasNextPage).toBe(true)

      await act(async () => {
        await result.current.fetchNextPage()
      })

      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
      expect(result.current.data?.pages.flatMap((p) => p.data.map((t) => t.id))).toEqual([
        first?.id,
        second?.id,
        third?.id,
      ])
      expect(result.current.hasNextPage).toBe(false)
    })

    it('danışan için istek atmaz', () => {
      useAuthStore.getState().setAuth({ ...EXPERT, role: 'client' }, 'a', 'r')

      const { result } = renderHook(() => useCreditTransactionsQuery(), {
        wrapper: createWrapper(queryClient),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(mock.history.get).toHaveLength(0)
    })
  })

  describe('getNextCreditPage', () => {
    it.each([
      [{ page: 1, perPage: 20, total: 0 }, undefined],
      [{ page: 1, perPage: 20, total: 20 }, undefined],
      [{ page: 1, perPage: 20, total: 21 }, 2],
      [{ page: 3, perPage: 10, total: 31 }, 4],
    ])('%o → %s', (meta, expected) => {
      expect(getNextCreditPage({ data: [], meta })).toBe(expected)
    })
  })
})
