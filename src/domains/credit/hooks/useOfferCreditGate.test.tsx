import type { ReactNode } from 'react'

import { AppState } from 'react-native'
import type { AppStateStatus } from 'react-native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import { creditKeys, INSUFFICIENT_CREDITS_MESSAGE } from '../credit.constants'

import { useCreditsForegroundRefresh } from './useCreditsForegroundRefresh'
import { useOfferCreditGate } from './useOfferCreditGate'

import { useAuthStore } from '@/domains/auth'
import { ApiError, axiosInstance } from '@/lib/api'

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

describe('useOfferCreditGate', () => {
  let mock: MockAdapter
  let queryClient: QueryClient

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    useAuthStore.getState().setAuth(EXPERT, 'a', 'r')
  })

  afterEach(() => {
    mock.restore()
    queryClient.unmount()
    queryClient.clear()
    useAuthStore.getState().clearAuth()
  })

  const balance = (b: number, offerCost: number) => ({
    data: { balance: b, offerCost, balanceLabel: `${b} kredi` },
  })

  it('bakiye yeterliyse gönderim serbest, maliyet ve bakiye etiketi döner', async () => {
    mock.onGet('/credits/me').reply(200, balance(12, 1))

    const { result } = renderHook(() => useOfferCreditGate(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toMatchObject({
      costLabel: 'Teklif başı 1 kredi',
      balanceLabel: '12 kredi',
      isBlocked: false,
      insufficientMessage: undefined,
    })
  })

  it('bakiye maliyete eşitse gönderim serbest', async () => {
    mock.onGet('/credits/me').reply(200, balance(2, 2))

    const { result } = renderHook(() => useOfferCreditGate(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.balanceLabel).toBe('2 kredi'))
    expect(result.current.isBlocked).toBe(false)
  })

  it('bakiye < maliyet ise gönderimi kilitler ve düz metni gösterir', async () => {
    mock.onGet('/credits/me').reply(200, balance(0, 1))

    const { result } = renderHook(() => useOfferCreditGate(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isBlocked).toBe(true))
    expect(result.current.insufficientMessage).toBe(INSUFFICIENT_CREDITS_MESSAGE)
  })

  it('mesaj bağlantı, adres, fiyat ya da uygulama içi satın alma içermez', () => {
    expect(INSUFFICIENT_CREDITS_MESSAGE).toBe(
      'Teklif göndermek için yeterli krediniz yok. Kredi yüklemek için web sitemizi ziyaret edin.'
    )
    expect(INSUFFICIENT_CREDITS_MESSAGE).not.toMatch(/https?:|www\.|\.com|₺|TL|satın al/i)
  })

  it('sunucu 422 INSUFFICIENT_CREDITS dönerse aynı mesajı gösterir', async () => {
    mock.onGet('/credits/me').reply(200, balance(5, 1))
    const submitError = new ApiError(
      'INSUFFICIENT_CREDITS',
      'Teklif göndermek için yeterli krediniz yok.',
      422
    )

    const { result } = renderHook(() => useOfferCreditGate({ submitError }), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.insufficientMessage).toBe(INSUFFICIENT_CREDITS_MESSAGE)
    // Ekrandaki bakiye yeterli görünüyor: buton kilitlenmez, tazelenen bakiye karar verir.
    expect(result.current.isBlocked).toBe(false)
  })

  it('başka bir 422 hatası kredi mesajına çevrilmez', async () => {
    mock.onGet('/credits/me').reply(200, balance(5, 1))
    const submitError = new ApiError('OFFER_ALREADY_EXISTS', 'Zaten teklif verdiniz.', 409)

    const { result } = renderHook(() => useOfferCreditGate({ submitError }), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.insufficientMessage).toBeUndefined()
  })

  it('bakiye okunamazsa gönderimi engellemez (son söz backend)', async () => {
    mock.onGet('/credits/me').networkError()

    const { result } = renderHook(() => useOfferCreditGate(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isBlocked).toBe(false)
    expect(result.current.costLabel).toBeUndefined()
  })
})

describe('useCreditsForegroundRefresh', () => {
  it('uygulama öne gelince kredi sorgularını bayat işaretler', () => {
    const queryClient = new QueryClient()
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries').mockResolvedValue()
    let listener: ((state: AppStateStatus) => void) | undefined
    const remove = jest.fn()
    const addListener = jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((_type, handler) => {
        listener = handler
        return { remove }
      })

    const { unmount } = renderHook(() => useCreditsForegroundRefresh(), {
      wrapper: createWrapper(queryClient),
    })

    act(() => listener?.('background'))
    expect(invalidate).not.toHaveBeenCalled()

    act(() => listener?.('active'))
    expect(invalidate).toHaveBeenCalledWith({ queryKey: creditKeys.all })

    unmount()
    expect(remove).toHaveBeenCalled()

    addListener.mockRestore()
    queryClient.clear()
  })

  it('enabled false iken dinleyici kurmaz', () => {
    const queryClient = new QueryClient()
    const addListener = jest.spyOn(AppState, 'addEventListener')

    renderHook(() => useCreditsForegroundRefresh(false), { wrapper: createWrapper(queryClient) })

    expect(addListener).not.toHaveBeenCalled()
    addListener.mockRestore()
    queryClient.clear()
  })
})
