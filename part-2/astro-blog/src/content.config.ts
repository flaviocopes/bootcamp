import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    tags: z.array(z.string()),
  }),
})

export const collections = {
  posts: posts,
}
