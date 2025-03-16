import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const blog = await getCollection('posts')
  return rss({
    title: 'Our nice blog',
    description: 'Very cool blog',
    site: 'http://oursite.com',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  })
}
