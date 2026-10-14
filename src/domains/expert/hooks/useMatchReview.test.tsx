import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import { useMatchReview } from './useMatchReview'

import { axiosInstance } from '@/lib/api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiGet: jest.fn(async (keys: string[]) => keys.map((k) => [k, null])),
  multiRemove: jest.fn(async () => undefined),
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => 'token'),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}))

const EXPERT_ID = '11111111-1111-4111-8111-111111111111'
const MATCH_ID = '22222222-2222-4222-8222-222222222222'

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useMatchReview', () => {
  let mock: MockAdapter
  let queryClient: QueryClient

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  })

  afterEach(() => {
    mock.restore()
    queryClient.unmount()
    queryClient.clear()
  })

  const render = () =>
    renderHook(() => useMatchReview({ expertId: EXPERT_ID, matchId: MATCH_ID }), {
      wrapper: createWrapper(queryClient),
    })

  it('posts the review and marks it done', async () => {
    mock.onPost(`/experts/${EXPERT_ID}/reviews`).reply(200, {
      id: '33333333-3333-4333-8333-333333333333',
      expertId: EXPERT_ID,
      rating: 5,
      comment: 'Çok yardımcı oldu',
      sessionType: null,
      createdAt: '2026-10-14T10:00:00Z',
    })
    const { result } = render()

    act(() => result.current.submit(5, '  Çok yardımcı oldu  '))

    await waitFor(() => expect(result.current.isDone).toBe(true))
    expect(JSON.parse(mock.history.post[0]?.data ?? '{}')).toMatchObject({
      matchId: MATCH_ID,
      rating: 5,
      comment: 'Çok yardımcı oldu',
    })
  })

  it('treats REVIEW_ALREADY_EXISTS as already reviewed, not as an error', async () => {
    mock.onPost(`/experts/${EXPERT_ID}/reviews`).reply(409, {
      code: 'REVIEW_ALREADY_EXISTS',
      message: 'Bu eşleşme için değerlendirmenizi zaten bıraktınız.',
      errors: [],
    })
    const { result } = render()

    act(() => result.current.submit(4, 'İyi'))

    await waitFor(() => expect(result.current.isDone).toBe(true))
    expect(result.current.doneMessage).toBe('Bu eşleşme için değerlendirmenizi zaten bıraktınız.')
    expect(result.current.errorMessage).toBeNull()
  })

  it('shows a Turkish validation message without calling the API', async () => {
    const { result } = render()

    act(() => result.current.submit(0, 'Yorum'))

    await waitFor(() => expect(result.current.errorMessage).toBe('Lütfen 1-5 arası bir puan verin'))
    expect(mock.history.post).toHaveLength(0)
  })
})
