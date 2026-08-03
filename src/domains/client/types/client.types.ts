import type { z } from 'zod'
import type { ClientSchema, MatchStatusSchema } from '../schemas/client.schema'

export type Client = z.infer<typeof ClientSchema>
export type MatchStatus = z.infer<typeof MatchStatusSchema>
