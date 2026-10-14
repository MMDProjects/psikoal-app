import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import { usePlayableAssessments } from './usePlayableAssessments'

import { axiosInstance } from '@/lib/api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiGet: jest.fn(async (keys: string[]) => keys.map((k) => [k, null])),
  multiRemove: jest.fn(async () => undefined),
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}))

const item = (id: string, title: string) => ({
  id,
  title,
  category: 'genel',
  estimatedMinutes: 5,
  questionCount: 9,
})

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('usePlayableAssessments', () => {
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
  })

  it('lists only the assessment that /assessment/active can actually play', async () => {
    mock.onGet('/assessment').reply(200, { data: [item('phq9', 'PHQ-9'), item('gad7', 'GAD-7')] })
    mock.onGet('/assessment/active').reply(200, {
      id: 'gad7',
      title: 'GAD-7',
      description: '',
      questions: [],
      estimatedMinutes: 5,
    })

    const { result } = renderHook(() => usePlayableAssessments(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data.map((a) => a.id)).toEqual(['gad7'])
  })

  it('shows nothing when there is no active assessment', async () => {
    mock.onGet('/assessment').reply(200, { data: [item('phq9', 'PHQ-9')] })
    mock.onGet('/assessment/active').reply(404, { code: 'NOT_FOUND', message: 'Yok' })

    const { result } = renderHook(() => usePlayableAssessments(), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual([])
  })
})
