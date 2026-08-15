import type { ClientSchema, MatchStatusSchema } from '../schemas/client.schema'
import type { z } from 'zod'

export type Client = z.infer<typeof ClientSchema>
export type MatchStatus = z.infer<typeof MatchStatusSchema>
