import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import listingOffersResponse from '../schemas/__fixtures__/listing-offers.response.json'

import { useSendOfferMutation } from './useSendOfferMutation'

import { creditKeys } from '@/domains/credit'
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

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const offer = listingOffersResponse.data[0]
const request = {
  listingId: offer?.listingId ?? '',
  price: 1100,
  sessionType: 'online' as const,
}

describe('useSendOfferMutation — kredi', () => {
  let mock: MockAdapter
  let queryClient: QueryClient

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  })

  afterEach(() => {
    mock.restore()
    queryClient.clear()
  })

  it('başarılı tekliften sonra kredi sorgularını bayat işaretler', async () => {
    mock.onPost('/offers').reply(200, offer)
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useSendOfferMutation(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.mutateAsync(request)
    })

    expect(invalidate).toHaveBeenCalledWith({ queryKey: creditKeys.all })
  })

  it('422 INSUFFICIENT_CREDITS hatasını taşır ve bakiyeyi tazeler', async () => {
    mock.onPost('/offers').reply(422, {
      code: 'INSUFFICIENT_CREDITS',
      message: 'Teklif göndermek için yeterli krediniz yok.',
    })
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useSendOfferMutation(), {
      wrapper: createWrapper(queryClient),
    })

    act(() => result.current.mutate(request))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toMatchObject({ code: 'INSUFFICIENT_CREDITS', status: 422 })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: creditKeys.balance() })
    expect(invalidate).not.toHaveBeenCalledWith({ queryKey: creditKeys.all })
  })
})
