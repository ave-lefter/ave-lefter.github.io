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

interface Colors {
  quoteColor?: string
  symbolColor?: string
  tokenAddressColor?: string
}

interface ParsedToken {
  type: 'url' | 'email' | 'hashtag' | 'mention' | 'symbol' | 'quote' | 'tokenAddress'
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
 * Generate inline style for colors
 */
function getColorStyle(color?: string): string {
  if (!color) return ''
  return `style="color: ${escapeHtml(color)}"`
}

/**
 * Convert newlines to HTML <br> tags
 */
function convertNewlines(text: string): string {
  return text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')
}

/**
 * Generate HTML link based on parsed token type
 */
function generateLink(parsed: ParsedToken, linkClass: string, colors: Colors): string {
  let processUrlObj,url
  switch (parsed.type) {
    case 'url':
     
      processUrlObj = processUrlWithToken(parsed.href||'')
      url = processUrlObj?.value||''
      if(processUrlObj?.isBlacklisted){
        if(url){
          return `<span class="${linkClass} tw-tokenAddress url"  ${getColorStyle(colors.tokenAddressColor)}>${escapeHtml(url)}</span>`
        }else{
          return `<span class="${linkClass}">***</span>`
        }
      }else{
        return `<span class="${linkClass}">***</span>`
      }
    case 'email':
      return `<a href="${escapeHtml(parsed.href as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'hashtag':
      return `<a href="https://twitter.com/hashtag/${encodeURIComponent(parsed.tag as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'mention':
      return `<a href="https://twitter.com/${encodeURIComponent(parsed.tag as string)}" class="${linkClass}" target="_blank" rel="noopener noreferrer">${escapeHtml(parsed.text)}</a>`
    case 'symbol':
      // return `<a href="/token/${escapeHtml(parsed.address as string)}-${escapeHtml(parsed.chain as string)}" class="${linkClass}" ${getColorStyle(colors.symbolColor)}>${escapeHtml(parsed.text)}</a>`
      return `<span class="${linkClass} tw-symbol" data-value="${parsed.address}-${parsed.chain}" ${getColorStyle(colors.symbolColor)}>${escapeHtml(parsed.text)}</span>`
    case 'tokenAddress':
      return `<span class="${linkClass} tw-tokenAddress"  ${getColorStyle(colors.tokenAddressColor)}>${escapeHtml(parsed.text)}</span>`
    case 'quote':
      return `<span class="${linkClass} tw-quote" ${getColorStyle(colors.quoteColor)}>${escapeHtml(parsed.text)}</span>`
    default:
      return escapeHtml(parsed.text)
  } 
}

// 🔒 黑名单配置（使用 as const 获得字面量联合类型推断）
export const BLACKLIST_KEYWORDS = ['axiom', 'gmgn', 'debot', 'binance', 'okx'] as const

// 🧩 加密货币哈希/地址正则
// 移除 /g 避免 lastIndex 状态污染，match() 无需全局标志即可安全提取首个匹配
const CRYPTO_HASH_REGEX = /(?:0x[a-fA-F0-9]{40,64}|[1-9A-HJ-NP-Za-km-z]{32,44}|[UQ][a-zA-Z0-9_-]{46}|T[1-9A-HJ-NP-Za-km-z]{33}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})(?=[\/?&#\s<]|$)/g

// ⚡ 预编译正则：匹配任意黑名单词，且前后不为字母/数字（防 mybinance 误杀）
const BLACKLIST_URL_REGEX = new RegExp(
  `(?<![a-z0-9])(?:${BLACKLIST_KEYWORDS.join('|')})(?![a-z0-9])`,
  'i'
)
/**
 * 处理 URL：
 * - 命中黑名单域名 且 提取到 Token → 返回 `/${token}`
 * - 未命中 或 无 Token → 原样返回
 */
export function processUrlWithToken(url: string): {isBlacklisted: boolean, value: string}|null {
  if (!url || typeof url !== 'string') return null


  // 2️⃣ 提取首个加密货币哈希/地址
  const token = url.match(CRYPTO_HASH_REGEX)?.[0]
    // 1️⃣ 直接校验完整 URL（无需 new URL() 解析，性能更高）
  const isBlacklisted = BLACKLIST_URL_REGEX.test(url)
  // 3️⃣ 路由重写逻辑
  if(isBlacklisted){
    return {
      isBlacklisted,
      value: token||''
    }
  }else{
    return {
      isBlacklisted,
      value: url
    }
  }
}



/**
 * Process tweet content and convert it into clickable HTML
 * @param text Raw tweet text
 * @param tokens Optional array of tokens to match and process
 * @param colors Optional colors configuration { quoteColor, symbolColor, tokenAddressColor }
 * @returns Processed HTML content with clickable links
 */
export function processTwitterText(
  text: string | null | undefined,
  tokens?: Token[],
  colors?: Colors
): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const linkClass = '[&&]:color-[--primary-color] hover:underline clickable'
  const finalColors: Colors = colors || {}
  // First, convert newlines to br tags (preserve them for later)
  // const hasNewlines = text.includes('\\n') || text.includes('\n')
  const processedText = text
  // Define regex patterns for various matches
  const patterns: Array<{
    regex: RegExp
    type: 'url' | 'email' | 'hashtag' | 'mention' | 'quote' |'tokenAddress' | 'symbol'
    process: (match: string, capture?: string) => ParsedToken
  }> = [
    {
      // URLs (http/https/www)
      regex: /https?:\/\/[A-Za-z0-9._~:/?#&=+%-]+/g,
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
      // Emails
      regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
      type: 'email',
      process: (match: string): ParsedToken => ({
        type: 'email',
        text: match,
        href: `mailto:${match}`
      })
    },
    {
      // Blockchain Addresses (EVM, SOL, TON, SUI, TRON, BRC20)
      // EVM: 0x + 40 hex chars
      // SOL: 44 base58 chars
      // TON: UQ or 0: format
      // SUI: 0x + 64+ hex chars
      // TRON: T + 33 base58 chars
      // BRC20: 1/3 + 25-34 chars or bc1 format

      regex : /\b(?:0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44}|[UQ][a-zA-Z0-9_-]{46}|0x[a-fA-F0-9]{64}|T[1-9A-HJ-NP-Za-km-z]{33}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/g,
      type: 'tokenAddress',
      process: (match: string): ParsedToken => ({
        type: 'tokenAddress',
        text: match
      })
    },
    {
      // Quotes - matches content within English double quotes "" or Chinese quotes ""
      // This regex matches: "..." or "..." or "..."
      regex: /["“”]([^"“”]*)["“”]/g,
      type: 'quote',
      process: (match: string): ParsedToken => {
        // Keep the original match with quotes
        return {
          type: 'quote',
          text: match
        }
      }
    },
    {
      // Hashtags (#tag) - supports English and Chinese
      regex: /#([\w\u4e00-\u9fff]+)/g,
      type: 'hashtag',
      process: (match: string, capture?: string): ParsedToken => ({
        type: 'hashtag',
        text: match,
        tag: capture
      })
    },
    {
      // Mentions (@username) - supports English and Chinese
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
    while ((match = pattern.regex.exec(processedText)) !== null) {
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
      const escapedSymbol = token.symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const tokenRegex = new RegExp(`\\$?\\b${escapedSymbol}\\b|\\$?${escapedSymbol}`, 'gi')
      let match: RegExpExecArray | null
      tokenRegex.lastIndex = 0
      while ((match = tokenRegex.exec(processedText)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          parsed: {
            type: 'symbol',
            text: match[0],
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
    return b.end - b.start - (a.end - a.start)
  })

  // Remove overlapping matches
  const filteredMatches = matches.filter((match, index, arr) => {
    return !arr.some((m, i) => i < index && match.start < m.end && match.end > m.start)
  })

  // Build the HTML content
  let result = ''
  let currentIndex = 0
  for (const match of filteredMatches) {
    // Add text before the matched region
    if (currentIndex < match.start) {
      const textBeforeMatch = processedText.substring(currentIndex, match.start)
      result += convertNewlines(escapeHtml(textBeforeMatch))
    }
    // Add the matched region as a link
    result += generateLink(match.parsed, linkClass, finalColors)
    currentIndex = match.end
  }
  // Add remaining text after the last match
  if (currentIndex < processedText.length) {
    const remainingText = processedText.substring(currentIndex)
    result += convertNewlines(escapeHtml(remainingText))
  }

  return result
}

/**
 * Convert an array of tweets into HTML
 */
export function convertTweetsToHtml(
  tweetsArray: (string | null | undefined)[],
  tokens?: Token[],
  colors?: Colors
): string {
  return tweetsArray
    .filter((tweet): tweet is string => tweet != null && typeof tweet === 'string')
    .map(tweet => `<div class="tweet-item">${processTwitterText(tweet, tokens, colors)}</div>`)
    .join('')
}