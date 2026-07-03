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

  const apiUrl = process.env.VITE_API_URL || 'https://techdeal-worker.mdchannelvn.workers.dev/api'
  const dealsPages: any[] = []

  // Fetch dynamic deal lastmod for /deals/ios and /deals/android
  try {
    const [iosRes, androidRes] = await Promise.all([
      fetch(`${apiUrl}/posts/deals/ios`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${apiUrl}/posts/deals/android`)
        .then((r) => r.json())
        .catch(() => null)
    ])

    dealsPages.push({
      loc: '/deals/ios',
      changefreq: 'hourly',
      priority: 1.0,
      lastmod: iosRes?.data?.updated_at || iosRes?.data?.created_at || new Date().toISOString()
    })

    dealsPages.push({
      loc: '/deals/android',
      changefreq: 'hourly',
      priority: 1.0,
      lastmod:
        androidRes?.data?.updated_at || androidRes?.data?.created_at || new Date().toISOString()
    })
  } catch (err) {
    dealsPages.push(
      { loc: '/deals/ios', changefreq: 'hourly', priority: 1.0, lastmod: new Date().toISOString() },
      {
        loc: '/deals/android',
        changefreq: 'hourly',
        priority: 1.0,
        lastmod: new Date().toISOString()
      }
    )
  }

  try {
    const response = await fetch(`${apiUrl}/posts?limit=100`)
    const resData = await response.json()
    if (resData && resData.success && resData.data && Array.isArray(resData.data.items)) {
      const dynamicPages = resData.data.items
        // Bài chuyên mục "deals" được phục vụ tại /deals/{platform} (đã thêm ở trên) và
        // /blog/... của chúng bị 301 về đó — không submit bản /blog để tránh trùng lặp.
        .filter((post: any) => post.category_id !== 'deals')
        .map((post: any) => ({
          loc: `/blog/${post.slug}.${post.id}`,
          lastmod: post.updated_at || post.created_at
        }))
      return [...staticPages, ...dealsPages, ...dynamicPages]
    }
  } catch (error) {
    console.error('Error generating sitemap dynamic URLs:', error)
  }

  return [...staticPages, ...dealsPages]
})
