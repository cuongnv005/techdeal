import { defineEventHandler, setHeader } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')

  try {
    const apiUrl = process.env.VITE_API_URL || 'https://techdeal-worker.mdchannelvn.workers.dev/api'
    const appUrl = process.env.APP_URL || 'https://techdeal.io.vn/'

    // Fetch latest 50 posts
    const response = await axios.get(`${apiUrl}/posts`, {
      params: { limit: 50 }
    })

    const posts = response.data?.data?.items || []

    const feedItems = posts
      .map((post: any) => {
        const link = `${appUrl}blog/${post.slug}.${post.id}`
        const date = new Date(post.created_at).toUTCString()

        let summary = post.summary || ''
        if (!summary && post.content) {
          // Simple clean of BBCode tags if summary is empty
          summary =
            post.content
              .replace(/\[center\][\s\S]*?\[\/center\]/gi, '')
              .replace(/\[img\][\s\S]*?\[\/img\]/gi, '')
              .replace(/\[b\]/gi, '')
              .replace(/\[\/b\]/gi, '')
              .replace(/\[i\]/gi, '')
              .replace(/\[\/i\]/gi, '')
              .replace(/\[u\]/gi, '')
              .replace(/\[\/u\]/gi, '')
              .replace(/\[url=['"]?[^\]'"]+?['"]?\]([\s\S]*?)\[\/url\]/gi, '$1')
              .replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1')
              .replace(/\n+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .substring(0, 250) + '...'
        }

        const escapeXml = (unsafe: string) => {
          return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
              case '<':
                return '&lt;'
              case '>':
                return '&gt;'
              case '&':
                return '&amp;'
              case "'":
                return '&apos;'
              case '"':
                return '&quot;'
              default:
                return c
            }
          })
        }

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(summary)}</description>
      <pubDate>${date}</pubDate>
      <author>${escapeXml(post.author_name || 'TechDeal')}</author>
      <category>${escapeXml(post.category_name || 'Technology')}</category>
    </item>`
      })
      .join('')

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>TechDeal - Tin tức công nghệ, game và khuyến mãi</title>
  <link>${appUrl}</link>
  <description>Cập nhật tin tức công nghệ mới nhất, đánh giá game, khuyến mãi phần cứng và phần mềm.</description>
  <language>vi-vn</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${appUrl}rss.xml" rel="self" type="application/rss+xml" />
  ${feedItems}
</channel>
</rss>`

    return rssFeed
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>TechDeal - Tin tức công nghệ, game và khuyến mãi</title>
  <link>https://techdeal.io.vn/</link>
  <description>Error loading feed items.</description>
</channel>
</rss>`
  }
})
