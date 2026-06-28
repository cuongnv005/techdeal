export const parseBBCode = (bbcode: string): string => {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML tags to prevent XSS during preview
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Parse [prebreak]...[/prebreak] to render as normal text without the box
  html = html.replace(/\[prebreak\]([\s\S]*?)\[\/prebreak\]/gi, '$1')

  // Remove [similar] tags completely from raw html output inside main layout content body
  // because it will be processed and rendered at the bottom in the "Related Posts" section
  html = html.replace(/\[similar\]([\s\S]*?)\[\/similar\]/gi, '')

  // Basic tags
  html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
  html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
  html = html.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
  html = html.replace(/\[strike\]([\s\S]*?)\[\/strike\]/gi, '<s>$1</s>')
  html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<s>$1</s>')

  // Lists [LIST] and [*]
  html = html.replace(
    /\[list(?:=([^\]]+))?\]([\s\S]*?)\[\/list\]/gi,
    (match: string, type: string | undefined, listContent: string) => {
      const items = listContent.split(/\[\*\]/)
      const listItems = items
        .slice(1)
        .map(
          (item: string) =>
            `<li style="list-style: inherit;" data-xf-list-type="${type ? 'ol' : 'ul'}">${item.trim()}</li>`
        )
        .join('')
      const tag = type ? 'ol' : 'ul'
      const attrib = type ? ` type="${type}"` : ''
      const listStyle = type ? 'decimal' : 'disc'
      return `<${tag}${attrib} style="list-style-type: ${listStyle}; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${listItems}</${tag}>`
    }
  )

  // Support [ul] and [ol] lists with [li]
  html = html.replace(/\[ul\]([\s\S]*?)\[\/ul\]/gi, (match: string, content: string) => {
    let ulContent = content.replace(
      /\[li\]([\s\S]*?)\[\/li\]/gi,
      (liMatch: string, liContent: string) => {
        return `<li style="list-style: inherit;">${liContent.trim()}</li>`
      }
    )
    ulContent = ulContent.replace(/\s*\n\s*/g, '')
    return `<ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${ulContent}</ul>`
  })

  html = html.replace(/\[ol\]([\s\S]*?)\[\/ol\]/gi, (match: string, content: string) => {
    let olContent = content.replace(
      /\[li\]([\s\S]*?)\[\/li\]/gi,
      (liMatch: string, liContent: string) => {
        return `<li style="list-style: inherit;">${liContent.trim()}</li>`
      }
    )
    olContent = olContent.replace(/\s*\n\s*/g, '')
    return `<ol style="list-style-type: decimal; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${olContent}</ol>`
  })

  html = html.replace(/\[li\]([\s\S]*?)\[\/li\]/gi, '<li style="list-style: inherit;">$1</li>')

  // Font family, color and size with nested tag support
  let oldHtml
  do {
    oldHtml = html
    html = html.replace(
      /\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi,
      '<span style="color: $1">$2</span>'
    )
  } while (html !== oldHtml)

  do {
    oldHtml = html
    html = html.replace(/\[font=([^\]]+)\]([\s\S]*?)\[\/font\]/gi, (match, fontFace, content) => {
      const safeFont = fontFace.replace(/"/g, "'")
      return `<span style="font-family: ${safeFont}">${content}</span>`
    })
  } while (html !== oldHtml)

  do {
    oldHtml = html
    html = html.replace(/\[size=([^\]]+)\]([\s\S]*?)\[\/size\]/gi, (match, size, content) => {
      const sizeMap: Record<string, string> = {
        '1': '10px',
        '2': '12px',
        '3': '14px',
        '4': '16px',
        '5': '18px',
        '6': '24px',
        '7': '32px'
      }
      const fontSize =
        sizeMap[size.trim()] || (isNaN(Number(size)) ? size.trim() : `${size.trim()}px`)
      return `<span style="font-size: ${fontSize}">${content}</span>`
    })
  } while (html !== oldHtml)

  // Align
  html = html.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div class="text-left">$1</div>')
  html = html.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="text-center">$1</div>')
  html = html.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div class="text-right">$1</div>')

  // Custom links and images (stripping optional surrounding quotes in url)
  html = html.replace(
    /\[url=['"]?([^\]'"]+?)['"]?\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#e5127d] hover:text-[#3498db] underline md:no-underline hover:underline font-bold">$2</a>'
  )
  html = html.replace(
    /\[url\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#e5127d] hover:text-[#3498db] underline md:no-underline hover:underline font-bold">$1</a>'
  )
  // Gallery of multiple images horizontally aligned
  html = html.replace(/\[gallery\]([\s\S]*?)\[\/gallery\]/gi, (match, content) => {
    const imagesHtml = content.replace(
      /\[img\]([\s\S]*?)\[\/img\]/gi,
      '<img src="$1" class="h-[9.5rem] md:h-90 object-cover rounded-xl shadow-xs border border-gray-100 dark:border-zinc-850" />'
    )
    return `<div class="flex flex-wrap gap-2 justify-center my-4">${imagesHtml}</div>`
  })

  html = html.replace(
    /\[img\]([\s\S]*?)\[\/img\]/gi,
    '<div class="my-4 flex justify-center"><img src="$1" class="max-w-full h-auto rounded-xl shadow-md border border-gray-100 dark:border-zinc-800" /></div>'
  )

  // YouTube tag parser
  html = html.replace(/\[youtube\]([\s\S]*?)\[\/youtube\]/gi, (match, videoIdOrUrl) => {
    const trimmed = videoIdOrUrl.trim()
    let videoId = trimmed
    const urlMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/i
    )
    if (urlMatch && urlMatch[1]) {
      videoId = urlMatch[1]
    }
    return `<div class="my-4 flex justify-center"><div class="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-zinc-800"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`
  })

  // Blockquote / code block
  html = html.replace(
    /\[quote\]([\s\S]*?)\[\/quote\]/gi,
    '<blockquote class="border-l-4 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 p-4 my-4 italic rounded-r text-zinc-650 dark:text-zinc-450">$1</blockquote>'
  )
  html = html.replace(
    /\[code\]([\s\S]*?)\[\/code\]/gi,
    '<pre class="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto font-mono text-xs my-4 border border-gray-200 dark:border-zinc-800">$1</pre>'
  )

  // Convert newlines to br
  html = html.replace(/\n/g, '<br>')

  return html
}
