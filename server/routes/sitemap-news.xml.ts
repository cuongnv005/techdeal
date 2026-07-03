import axios from 'axios'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/xml; charset=utf-8')

  try {
    const apiUrl = process.env.VITE_API_URL || 'https://techdeal-worker.mdchannelvn.workers.dev/api'
    const appUrl = process.env.APP_URL || 'https://techdeal.io.vn/'

    // Fetch latest 100 posts to ensure we get all recent ones
    const response = await axios.get(`${apiUrl}/posts`, {
      params: { limit: 100 }
    })

    const posts = response.data?.data?.items || []

    // Filter posts published in the last 48 hours (Google News Sitemap rule).
    // Loại bài chuyên mục "deals": /blog của chúng bị 301 về /deals/{platform},
    // không đưa URL redirect vào News sitemap.
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const recentPosts = posts.filter(
      (post: any) => post.category_id !== 'deals' && new Date(post.created_at) >= fortyEightHoursAgo
    )

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

    const urlItems = recentPosts
      .map((post: any) => {
        // App URL should end with a slash, but check first
        const base = appUrl.endsWith('/') ? appUrl : `${appUrl}/`
        const link = `${base}blog/${post.slug}.${post.id}`
        // Format to ISO 8601 format without milliseconds (required by Google News)
        const isoDate = new Date(post.created_at).toISOString().replace(/\.\d+Z$/, 'Z')

        return `
  <url>
    <loc>${link}</loc>
    <news:news>
      <news:publication>
        <news:name>TechDeal</news:name>
        <news:language>vi</news:language>
      </news:publication>
      <news:publication_date>${isoDate}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`
      })
      .join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urlItems}
</urlset>`

    return sitemap
  } catch (error) {
    console.error('Error generating Google News Sitemap:', error)
    // Return empty valid sitemap on error
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`
  }
})
