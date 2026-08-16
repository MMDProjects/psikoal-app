import { z } from 'zod'

export const QuestionTypeSchema = z.enum(['single_choice', 'multiple_choice', 'scale'])

export const AnswerOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  value: z.number(),
})

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: QuestionTypeSchema,
  options: z.array(AnswerOptionSchema),
})

export const AssessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(QuestionSchema),
  estimatedMinutes: z.number(),
})

export const AssessmentAnswerSchema = z.object({
  questionId: z.string(),
  values: z.array(z.number()),
})

export const SubmitAssessmentSchema = z.object({
  assessmentId: z.string(),
  answers: z.array(AssessmentAnswerSchema),
  email: z.string().email().optional(),
})

export const AssessmentResultSchema = z.object({
  id: z.string(),
  score: z.number(),
  level: z.enum(['low', 'moderate', 'high']),
  summary: z.string(),
  suggestions: z.array(z.string()),
  createdAt: z.string().datetime(),
})

export const AssessmentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  estimatedMinutes: z.number(),
  questionCount: z.number(),
})

export const MyAssessmentResultSchema = AssessmentResultSchema.extend({
  assessmentId: z.string(),
  assessmentTitle: z.string(),
})
