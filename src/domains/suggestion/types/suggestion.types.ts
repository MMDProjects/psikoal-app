import type { SuggestionSchema } from '../schemas/suggestion.schema'
import type { z } from 'zod'

export type Suggestion = z.infer<typeof SuggestionSchema>
export type SuggestionAudience = Suggestion['audience']
