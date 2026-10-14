import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentResultSchema } from '../schemas/assessment.schema'

import type { SubmitAssessmentRequest } from '../types/assessment.types'

import { post } from '@/lib/api'

export function useSubmitAssessmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubmitAssessmentRequest) => {
      const raw = await post('/assessment/submit', data)
      return AssessmentResultSchema.parse(raw)
    },
    onSuccess: (result) => {
      queryClient.setQueryData(assessmentKeys.result(result.id), result)

      // "Sonuçlarım" listesi de tazelenmek ZORUNDA. staleTime 5 dakika olduğu
      // için tazelenmezse kullanıcı testi yeni bitirmiş olsa bile listeyi BOŞ
      // görüyor: ilan oluşturma formunun 3. adımı "Henüz tamamlanmış test
      // sonucun yok" diyor ve ana ekrandaki "Testlerim" rozeti 0'da kalıyor.
      // Yani "test çöz → sonucu ilanına ekle" akışı tam ortasından kopuyor.
      // Belirtisi hataya benzemiyor: sunucuda sonuç KAYITLI, yalnız istemci
      // eski önbelleği gösteriyor ve beş dakika sonra kendiliğinden düzeliyor.
      void queryClient.invalidateQueries({ queryKey: assessmentKeys.myResults() })
    },
  })
}
