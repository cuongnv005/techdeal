import { defineEventHandler, readBody, getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const bypassToken =
    config.vercelBypassToken ||
    process.env.VERCEL_BYPASS_TOKEN ||
    'techdeal-revalidate-secret-token'

  const body = (await readBody<{ paths?: string[]; path?: string }>(event).catch(() => ({}))) || {}
  const rawPaths: string[] = body.paths || (body.path ? [body.path] : [])

  if (!rawPaths || rawPaths.length === 0) {
    return {
      success: false,
      message: 'No paths specified for revalidation'
    }
  }

  const reqUrl = getRequestURL(event)
  const origin = reqUrl.origin || 'https://techdeal.io.vn'

  const results = await Promise.allSettled(
    rawPaths.map(async (pathStr) => {
      const normalizedPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`
      const targetUrl = `${origin}${normalizedPath}`

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'x-prerender-revalidate': bypassToken
        }
      })

      return {
        path: normalizedPath,
        status: response.status,
        revalidated: response.ok
      }
    })
  )

  const revalidationSummary = results.map((res, index) => {
    if (res.status === 'fulfilled') {
      return res.value
    }
    return {
      path: rawPaths[index],
      status: 500,
      error: (res.reason as Error)?.message || 'Unknown error'
    }
  })

  return {
    success: true,
    results: revalidationSummary
  }
})
