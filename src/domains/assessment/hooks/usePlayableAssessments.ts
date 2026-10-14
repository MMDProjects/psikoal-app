import { useCallback, useMemo } from 'react'

import { useAssessmentListQuery } from '../api/useAssessmentListQuery'
import { useAssessmentQuery } from '../api/useAssessmentQuery'

import type { AssessmentListItem } from '../types/assessment.types'

type UsePlayableAssessmentsReturn = {
  data: AssessmentListItem[]
  isLoading: boolean
  refetch: () => Promise<unknown>
}

/**
 * Yalnız gerçekten ÇÖZÜLEBİLEN testleri döner.
 *
 * Backend'de test oynatma ucu tek: `GET /assessment/active` (id ile test getiren
 * uç yok). `GET /assessment` ise tüm testleri listeliyor; her satır aynı aktif
 * teste açıldığı için kullanıcı başka bir teste tıklayıp farklı bir testi
 * çözüyordu. Liste, aktif testin kimliğine göre süzülür.
 */
export function usePlayableAssessments(category?: string): UsePlayableAssessmentsReturn {
  const listQuery = useAssessmentListQuery(category)
  const activeQuery = useAssessmentQuery()
  const activeId = activeQuery.data?.id

  const data = useMemo(
    () => (activeId ? (listQuery.data ?? []).filter((item) => item.id === activeId) : []),
    [activeId, listQuery.data]
  )

  const { refetch: refetchList } = listQuery
  const { refetch: refetchActive } = activeQuery
  const refetch = useCallback(
    () => Promise.all([refetchList(), refetchActive()]),
    [refetchList, refetchActive]
  )

  return { data, isLoading: listQuery.isLoading || activeQuery.isLoading, refetch }
}
