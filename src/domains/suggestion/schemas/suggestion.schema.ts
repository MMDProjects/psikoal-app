import { z } from 'zod'

export const SuggestionSchema = z.object({
  id: z.string(),
  audience: z.enum(['client', 'expert', 'all']),
  category: z.string(),
  title: z.string(),
  body: z.string(),
})
