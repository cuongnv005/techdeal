export default defineSitemapEventHandler(async () => {
  const staticPages = [
    { loc: '/' },
    { loc: '/about' },
    { loc: '/privacy' },
    { loc: '/terms' },
    { loc: '/android' },
    { loc: '/ios' },
    { loc: '/pc' },
    { loc: '/windows' },
    { loc: '/cong-nghe' },
    { loc: '/game' }
  ]

  try {
    const response = await fetch('https://techdeal-worker.mdchannelvn.workers.dev/api/posts')
    const resData = await response.json()
    if (resData && resData.success && Array.isArray(resData.data)) {
      const dynamicPages = resData.data.map((post: any) => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_at || post.created_at
      }))
      return [...staticPages, ...dynamicPages]
    }
  } catch (error) {
    console.error('Error generating sitemap dynamic URLs:', error)
  }

  return staticPages
})
