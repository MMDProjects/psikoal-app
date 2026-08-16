import type {
  QuestionTypeSchema,
  AnswerOptionSchema,
  QuestionSchema,
  AssessmentSchema,
  AssessmentAnswerSchema,
  SubmitAssessmentSchema,
  AssessmentResultSchema,
  AssessmentListItemSchema,
  MyAssessmentResultSchema,
} from '../schemas/assessment.schema'
import type { z } from 'zod'

export type QuestionType = z.infer<typeof QuestionTypeSchema>
export type AnswerOption = z.infer<typeof AnswerOptionSchema>
export type Question = z.infer<typeof QuestionSchema>
export type Assessment = z.infer<typeof AssessmentSchema>
export type AssessmentAnswer = z.infer<typeof AssessmentAnswerSchema>
export type SubmitAssessmentRequest = z.infer<typeof SubmitAssessmentSchema>
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>
export type AssessmentListItem = z.infer<typeof AssessmentListItemSchema>
export type MyAssessmentResult = z.infer<typeof MyAssessmentResultSchema>
