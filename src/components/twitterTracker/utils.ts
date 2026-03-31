/**
 * Process tweet content to convert mentions, hashtags, URLs, emails, and tokens into clickable HTML links
 * Supports additional functionalities such as token matching with optional `$` prefix
 * Safe from XSS attacks
 */

interface Token {
  address: string
  chain: string
  symbol: string
}

interface ParsedToken {
  type: 'url' | 'email' | 'hashtag' | 'mention' | 'token' |'quote'
  text: string
  href?: string
  tag?: string
  address?: string
  chain?: string  
}

/**
 * Escape HTML special characters to prevent XSS attacks
 */
function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/**
 * Generate HTML link based on parsed token type
 */
function generateLink(parsed: ParsedToken, linkClass: string): string {
  switch (parsed.type) {
    case 'url':
      return `<a href="${escapeHtml(parsed.href as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'email':
      return `<a href="${escapeHtml(parsed.href as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'hashtag':
      return `<a href="https://twitter.com/hashtag/${encodeURIComponent(parsed.tag as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'mention':
      return `<a href="https://twitter.com/${encodeURIComponent(parsed.tag as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'token':
      return `<a href="/token/${escapeHtml(parsed.address as string)}-${escapeHtml(parsed.chain as string)}" class="${linkClass}">${escapeHtml(parsed.text)}</a>`
    // case 'token':
    //    return  `<a href="#" @click="navigateTo(\`/token/${escapeHtml(parsed.address as string)}-${escapeHtml(parsed.chain as string)}\`)" class="${linkClass}">${escapeHtml(parsed.text)}</a>`
    case 'quote':
      return `<span>${escapeHtml(parsed.text)}</span>`
    default:
      return escapeHtml(parsed.text)
  }
}

/**
 * Process tweet content and convert it into clickable HTML
 * @param text Raw tweet text
 * @param tokens Optional array of tokens to match and process
 * @returns Processed HTML content with clickable links
 */
export function processTwitterText(text: string | null | undefined, tokens?: Token[]): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const linkClass = '[&&]:color-[--primary-color] hover:underline'

  // Define regex patterns for various matches
  const patterns: Array<{
    regex: RegExp
    type: 'url' | 'email' | 'hashtag' | 'mention'|'quote'
    process: (match: string, capture?: string) => ParsedToken
  }> = [
    {
      regex: /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g,
      type: 'url',
      process: (match: string): ParsedToken => {
        let url = match
        if (url.startsWith('www')) {
          url = 'https://' + url
        }
        return { type: 'url', text: match, href: url }
      }
    },
    {
      regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
      type: 'email',
      process: (match: string): ParsedToken => ({
        type: 'email',
        text: match,
        href: `mailto:${match}`
      })
    },
    {
      regex: /"([^"]*)"/g,
      type: 'quote',
      process: (match: string, capture?: string): ParsedToken => ({
        type: 'quote',
        text: capture || match
      })
    },
    {
      regex: /#([\w\u4e00-\u9fff]+)/g,
      type: 'hashtag',
      process: (match: string, capture?: string): ParsedToken => ({
        type: 'hashtag',
        text: match,
        tag: capture
      })
    },
    {
      regex: /@([\w\u4e00-\u9fff]+)/g,
      type: 'mention',
      process: (match: string, capture?: string): ParsedToken => ({
        type: 'mention',
        text: match,
        tag: capture
      })
    }
  ]

  // Store matches including tokens
  const matches: Array<{ start: number; end: number; parsed: ParsedToken }> = []

  for (const pattern of patterns) {
    let match: RegExpExecArray | null
    pattern.regex.lastIndex = 0
    while ((match = pattern.regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        parsed: pattern.process(match[0], match[1])
      })
    }
  }

  // Add token matches if tokens are provided
  if (tokens && tokens.length > 0) {
    for (const token of tokens) {
      const tokenRegex = new RegExp(`\\$?\\b${token.symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      let match: RegExpExecArray | null
      tokenRegex.lastIndex = 0
      while ((match = tokenRegex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          parsed: {
            type: 'token',
            text: match[0], // Keep original match (with optional `$` prefix)
            address: token.address,
            chain: token.chain
          }
        })
      }
    }
  }

  // Sort matches by start position, then length
  matches.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start
    }
    return b.end - b.start - (a.end - a.start) // Longer matches first in case of overlap
  })

  // Build the HTML content
  let result = ''
  let currentIndex = 0
  for (const match of matches) {
    // Add text before the matched region
    if (currentIndex < match.start) {
      result += escapeHtml(text.substring(currentIndex, match.start))
    }
    // Add the matched region as a link
    result += generateLink(match.parsed, linkClass)
    currentIndex = match.end
  }
  // Add remaining text after the last match
  if (currentIndex < text.length) {
    result += escapeHtml(text.substring(currentIndex))
  }

  return result
}

/**
 * Convert an array of tweets into HTML
 */
export function convertTweetsToHtml(tweetsArray: (string | null | undefined)[], tokens?: Token[]): string {
  return tweetsArray
    .filter((tweet): tweet is string => tweet != null && typeof tweet === 'string')
    .map(tweet => `<div class="tweet-item">${processTwitterText(tweet, tokens)}</div>`)
    .join('')
}