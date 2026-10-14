import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import MockAdapter from 'axios-mock-adapter'

import { assessmentKeys } from '../assessment.constants'

import { useSubmitAssessmentMutation } from './useSubmitAssessmentMutation'

import { axiosInstance } from '@/lib/api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiRemove: jest.fn(async () => undefined),
}))

const RESULT = {
  id: '3f1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  score: 21,
  level: 'high',
  summary: 'Belirgin belirtiler tespit edilmektedir.',
  suggestions: ['Bir uzmanla görüşün'],
  createdAt: '2026-08-21T22:22:14.704Z',
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSubmitAssessmentMutation', () => {
  let mock: MockAdapter
  let queryClient: QueryClient

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  })

  afterEach(() => {
    mock.restore()
    // unmount() ŞART, clear() yetmez: QueryClient kendi zamanlayıcılarını
    // (gcTime, refetch) canlı tutuyor ve jest süreci test bitse bile
    // kapanmıyor. CI'da belirti "testler geçti ama job asılı kaldı" olur.
    queryClient.unmount()
    queryClient.clear()
  })

  // "Sonuçlarım" listesi tazelenmezse kullanıcı testi YENİ bitirmiş olsa bile
  // listeyi boş görüyor: ilan formunun 3. adımı "Henüz tamamlanmış test sonucun
  // yok" diyor ve ana ekrandaki "Testlerim" rozeti 0'da kalıyor. staleTime 5
  // dakika olduğu için hata beş dakika sonra kendiliğinden "düzeliyor" — bu da
  // elle yakalamayı özellikle zorlaştırıyor. Sunucuda sonuç KAYITLI; kırık olan
  // yalnız istemci önbelleği.
  it('gönderim sonrası "sonuçlarım" listesini tazeler', async () => {
    mock.onPost('/assessment/submit').reply(200, RESULT)

    // Listeyi taze (stale olmayan) bir veriyle doldur: invalidate edilmezse
    // bu veri olduğu gibi kalır ve iddia kırmızıya döner.
    queryClient.setQueryData(assessmentKeys.myResults(), {
      data: [],
      meta: { page: 1, total: 0, perPage: 0 },
    })
    expect(queryClient.getQueryState(assessmentKeys.myResults())?.isInvalidated).toBe(false)

    const { result } = renderHook(() => useSubmitAssessmentMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({ assessmentId: 'a1', answers: [] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(queryClient.getQueryState(assessmentKeys.myResults())?.isInvalidated).toBe(true)
  })

  // Tekil sonuç önbelleğe yazılmaya devam etmeli: sonuç ekranı bu anahtardan
  // okuyor ve invalidate düzeltmesi yanlışlıkla bunu da düşürürse ekran
  // gereksiz bir ağ turu atar.
  it('tekil sonucu önbelleğe yazar', async () => {
    mock.onPost('/assessment/submit').reply(200, RESULT)

    const { result } = renderHook(() => useSubmitAssessmentMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({ assessmentId: 'a1', answers: [] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(queryClient.getQueryData(assessmentKeys.result(RESULT.id))).toMatchObject({
      id: RESULT.id,
      score: 21,
    })
  })
})
