import { useState } from 'react'

import type { Assessment, AssessmentAnswer, Question } from '../types/assessment.types'

type UseAssessmentEngineReturn = {
  currentIndex: number
  currentQuestion: Question | undefined
  answers: AssessmentAnswer[]
  currentAnswer: AssessmentAnswer | undefined
  progress: number
  isFirst: boolean
  isLast: boolean
  canProceed: boolean
  selectOption: (value: number) => void
  goNext: () => void
  goPrev: () => void
  reset: () => void
}

export function useAssessmentEngine(assessment: Assessment | undefined): UseAssessmentEngineReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])

  const questions = assessment?.questions ?? []
  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex] as Question | undefined
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const progress = totalQuestions > 0 ? currentIndex / totalQuestions : 0
  const isFirst = currentIndex === 0
  const isLast = totalQuestions > 0 && currentIndex === totalQuestions - 1
  const canProceed = Boolean(currentAnswer && currentAnswer.values.length > 0)

  const selectOption = (value: number) => {
    if (!currentQuestion) return
    const { id, type } = currentQuestion
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === id)
      const filtered = prev.filter((a) => a.questionId !== id)
      if (type === 'multiple_choice') {
        const vals = existing?.values ?? []
        const updated = vals.includes(value) ? vals.filter((v) => v !== value) : [...vals, value]
        return [...filtered, { questionId: id, values: updated }]
      }
      return [...filtered, { questionId: id, values: [value] }]
    })
  }

  const goNext = () => {
    if (!isLast) setCurrentIndex((i) => i + 1)
  }

  const goPrev = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1)
  }

  const reset = () => {
    setCurrentIndex(0)
    setAnswers([])
  }

  return {
    currentIndex,
    currentQuestion,
    answers,
    currentAnswer,
    progress,
    isFirst,
    isLast,
    canProceed,
    selectOption,
    goNext,
    goPrev,
    reset,
  }
}
