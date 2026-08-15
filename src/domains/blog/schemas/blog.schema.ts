import { z } from 'zod'

export const BlogAuthorSchema = z.object({
  name: z.string(),
  title: z.string(),
})

export const BlogSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  coverImage: z.string().url(),
  categories: z.array(z.string()),
  likeCount: z.number().int().min(0),
  liked: z.boolean().default(false),
  readingTime: z.number().int().positive(),
  publishedAt: z.string().datetime(),
  author: BlogAuthorSchema,
})

export const BlogListItemSchema = BlogSchema.omit({ content: true })
