import type { BlogSchema, BlogListItemSchema, BlogAuthorSchema } from '../schemas/blog.schema'
import type { z } from 'zod'

export type Blog = z.infer<typeof BlogSchema>
export type BlogListItem = z.infer<typeof BlogListItemSchema>
export type BlogAuthor = z.infer<typeof BlogAuthorSchema>
