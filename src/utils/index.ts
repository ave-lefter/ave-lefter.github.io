import timezoneObj from './json/timezone.json'
import config from './json/config.json'
import dayjs from './day'
import sha1 from 'crypto-js/sha1'
import { PublicKey } from '@solana/web3.js'
import { TronWeb } from 'tronweb'
import TonWeb from 'tonweb'
import IconUnknown from '@/assets/images/icon-unknown.png'
import { useRemarksStore } from '~/stores/remarks'
import Cookies from 'js-cookie'
import { JsonRpcProvider, formatUnits, parseUnits, FixedNumber } from 'ethers'
import type {GetHotTokensResponse} from '~/api/token'
import BigNumber from 'bignumber.js'
import type {SearchHot} from '~/api/types/search'
import type { ConfigType } from 'dayjs'
import { useStorage } from '@vueuse/core'
import type { Size, SizeObj } from '~/api/types/pump'

export function isJSON(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}

export function formatDate(
  val: string | number | Date,
  dateType = 'YYYY-MM-DD HH:mm:ss'
) {
  let dateStr: Date | null = null
  let timeStamp: number | string = 0
  let str
  if (typeof val === 'object' && val instanceof Date) {
    dateStr = val
  } else {
    if (String(val).length <= 10) {
      timeStamp = Number(Number(val) * 1000)
    } else {
      timeStamp = Number(val)
    }
    if (!timeStamp) {
      timeStamp = val
    }
    dateStr = new Date(timeStamp)
  }

  str = dateType.replace('YYYY', String(dateStr.getFullYear()))
  str = str.replace(
    'MM',
    (dateStr.getMonth() + 1 < 10 ? '0' : '') + (dateStr.getMonth() + 1)
  )
  str = str.replace(
    'DD',
    (dateStr.getDate() < 10 ? '0' : '') + dateStr.getDate()
  )
  str = str.replace(
    'HH',
    (dateStr.getHours() < 10 ? '0' : '') + dateStr.getHours()
  )
  str = str.replace(
    'mm',
    (dateStr.getMinutes() < 10 ? '0' : '') + dateStr.getMinutes()
  )
  str = str.replace(
    'ss',
    (dateStr.getSeconds() < 10 ? '0' : '') + dateStr.getSeconds()
  )

  return str
}

// 根据数字获取 precision 和 minMove
export function formatDecimals(n: number | string, decimals = 3) {
  let n1 = Number(n) || 0
  let d = 0
  while (n1 < 0.1 && n1 !== 0) {
    n1 = n1 * 10
    d++
  }
  let result = d + decimals
  if (n1 < 1) {
    result = result + 1
  }
  result = result === 11 ? 10 : result > 16 ? 16 : result
  return {
    precision: result,
    minMove: Number('0.' + '0'.repeat(result - 1) + '1'),
  }
}

export function getTimezone() {
  const timezone = dayjs.tz.guess()
  const tO: { [key: string]: number } = timezoneObj
  if (tO[timezone]) {
    return timezone
  } else {
    let offset = dayjs().utcOffset()
    const a = Object.keys(timezoneObj)
    for (let i = 0; i < a.length; i++) {
      const cur = a[i]
      if (tO[cur] * 60 === offset) {
        return cur
      }
    }
    offset = Math.round(offset / 60) * 60
    for (let i = 0; i < a.length; i++) {
      const cur = a[i]
      if (tO[cur] * 60 === offset) {
        return cur
      }
    }
  }
}

export function getAddressAndChainFromId(id: string, type: 1): [string, string]
export function getAddressAndChainFromId(
  id: string,
  type?: number
): { address: string; chain: string }
export function getAddressAndChainFromId(id: string, type: number = 0) {
  if (!id || !id.includes('-')) {
    if (type === 1) {
      return ['', ''] as [string, string]
    }
    return { address: '', chain: '' }
  }

  const address = id.replace(/-[^-]+$/, '')
  const chain = id.slice(address.length + 1) // 更安全、性能更好

  if (type === 1) {
    return [address, chain] as [string, string]
  }

  return { address, chain }
}

// 传去 时间长度 返回 格式化的时间
export function formatTime(time: number | string) {
  if (!time) {
    return 0
  }
  if (Number(time) < 0) {
    time = 0
  }
  if (typeof time === 'string') {
    time = Number(time)
  }
  if (time < 60) {
    return `${Math.floor(time)}s`
  }
  if (time < 3600) {
    return `${Math.floor(time / 60)}m`
  }
  if (time < 3600 * 24) {
    return `${Math.floor(time / 3600)}h`
  }
  return `${Math.floor(time / 3600 / 24)}d`
}

export function formatTimeFromNow(val: number | string, isNum = false) {
  let timeStamp: number | string = Number(Number(val) * 1000)
  if (!timeStamp) {
    timeStamp = val
  }
  const dateStr = new Date(timeStamp)
  let time = Math.floor((Date.now() - dateStr.getTime()) / 1000)
  if (time < 0) {
    time = 0
  }
  if (isNum) {
    return time
  }
  return formatTime(time)
}

export function formatUrl(url: string) {
  if (!url) {
    return ''
  }
  if (url?.includes('://')) {
    return url
  }
  return 'https://' + url
}

export function getChainInfo(chain: string, isChainId = false) {
  const chainConfig = useConfigStore().chainConfig
  const chainInfo = chainConfig?.find((item) => (isChainId ? item.chain_id : item.net_name) === chain)
  if (!chainInfo) {
    return {} as Record<string, any>
  }
  return chainInfo
}

export function getSwapInfo(
  chain: string | { chain: string; amm: string },
  amm?: string
) {
  const chainConfig = useConfigStore().chainConfig
  if (typeof chain === 'string') {
    const chainInfo = chainConfig?.find((item) => item.net_name === chain)
    if (!chainInfo) {
      return {} as Record<string, any>
    }
    return chainInfo?.swaps?.find?.((item) => item.name === amm)
  } else {
    const chainInfo = chainConfig?.find((item) => item.net_name === chain.chain)
    if (!chainInfo) {
      return {} as Record<string, any>
    }
    return chainInfo?.swaps?.find?.((item) => item.name === chain.amm)
  }
}

export function getTagTooltip(i: {
  tag?: string
  smart_money_buy_count_24h?: number
  smart_money_sell_count_24h?: number
}) {
  const $t = getGlobalT()
  if (!i.tag) {
    if ((i.smart_money_buy_count_24h??0) > 0 || (i.smart_money_sell_count_24h??0) > 0) {
      return $t('smart_money_tips', {
        b: i.smart_money_buy_count_24h,
        s: i.smart_money_sell_count_24h,
      })
    }
    return ''
  }
  const tips: Record<string, string> = {
    kol_sell: $t('kol_sell_tips'),
    kol_buy: $t('kol_buy_tips'),
    smarter_buy: $t('smarter_buy_tips'),
    smarter_sell: $t('smarter_sell_tips'),
  }
  return tips?.[i.tag] || $t(i.tag)
}

export function getAi(i: {
  tag?: string
  smart_money_buy_count_24h?: number
  smart_money_sell_count_24h?: number
}) {
  const $t = getGlobalT()
  if (!i.tag) {
    if ((i.smart_money_buy_count_24h??0) > 0 || (i.smart_money_sell_count_24h??0) > 0) {
      return $t('smart_money_tips', {
        b: i.smart_money_buy_count_24h,
        s: i.smart_money_sell_count_24h,
      })
    }
    return ''
  }
  const tips: Record<string, string> = {
    kol_sell: $t('kol_sell_tips'),
    kol_buy: $t('kol_buy_tips'),
    smarter_buy: $t('smarter_buy_tips'),
    smarter_sell: $t('smarter_sell_tips'),
  }
  return tips?.[i.tag] || $t(i.tag)
}

// 根据字符串生成头像
export function generateAvatarIcon(string: string) {
  const hashBuffer = sha1(string)
  const hash = hashBuffer.toString()
  const width = 80
  const height = 80
  const pixelSize = 10
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const color1 = '#' + hash.slice(0, 6)
  const color2 = '#' + hash.slice(6, 12)
  const color3 = '#' + hash.slice(12, 18)
  const columns = Math.floor(width / pixelSize)
  const rows = Math.floor(height / pixelSize)
  const halfColumns = Math.floor((columns + 1) / 2)
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < halfColumns; column++) {
      const xPos = column * pixelSize
      const yPos = row * pixelSize
      const colorChoice = (row * halfColumns + column) % 3
      let color
      switch (colorChoice) {
        case 0:
          color = color1
          break
        case 1:
          color = color2
          break
        case 2:
          color = color3
          break
        default:
          color = color1
          break
      }
      if (ctx) {
        ctx.fillStyle = color
        ctx.fillRect(xPos, yPos, pixelSize, pixelSize)
        ctx.fillRect(width - xPos - pixelSize, yPos, pixelSize, pixelSize)
      }
    }
  }
  return canvas.toDataURL('image/png')
}

export function isValidAddress(address: string, chain = 'eth') {
  if (chain === 'solana') {
    try {
      new PublicKey(address)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
  if (chain === 'tron') {
    return TronWeb.isAddress(address)
  }
  if (chain === 'sui') {
    const suiReg = /^[0-9a-zA-Z]{66}$/
    return suiReg.test(address)
  }
  if (chain === 'ton') {
    return TonWeb.utils.Address.isValid(address) || false
  }
  if (chain === 'brc20') {
    const btcReg = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,62}$/
    return btcReg.test(address)
  }
  if (getChainInfo(chain)?.vm_type === 'evm') {
    const hexReg = /^0x[0-9a-zA-Z]{40}$/
    return hexReg.test(address)
  }
  return false
}

export function formatSwapUrl(address: string, chain: string, amm: string) {
  const swapInfo = getSwapInfo(chain, amm)
  const swapUrl = swapInfo?.swap_url
  if (swapInfo && swapUrl) {
    if (typeof swapUrl === 'string') {
      return swapUrl + address
    } else if (swapUrl?.[amm]) {
      return swapUrl?.swapUrl?.[amm] + address
    } else {
      return ''
    }
  }
  return ''
}

export function formatExplorerUrl(
  chain: string,
  address: string,
  type: 'token' | 'address' | 'tx' = 'token'
) {
  const chainInfo = getChainInfo(chain)
  if (chain === 'halo') {
    if (type === 'tx') {
      address = address?.replace?.(/^0x/, '')
    }
  }
  const keyUrl = (type + '_url') as 'token_url' | 'address_url' | 'tx_url'
  const url = chainInfo?.[keyUrl]
  if (url) {
    return url.replace(`{${type}}`, address)
  }
  const n = chainInfo ? chainInfo.block_explorer_url : ''
  let type1:
    | 'tokenAddr'
    | 'account'
    | 'token20'
    | 'contract'
    | 'transaction'
    | 'txs'
    | typeof type = type
  if (chain === 'oec' && type === 'token') {
    type1 = 'tokenAddr'
  }
  if (chain === 'solana' && type === 'address') {
    type1 = 'account'
  }

  if (chain === 'nervos') {
    if (type === 'address' || type === 'token') {
      type1 = 'account'
    }
  }

  if (chain === 'tron') {
    if (type === 'token') {
      type1 = 'token20'
    } else if (type === 'address') {
      type1 = 'contract'
    } else if (type === 'tx') {
      type1 = 'transaction'
    }
  }

  if (chain === 'osmosis') {
    type1 = 'txs'
  }

  if (chain === 'vision') {
    if (type === 'token') {
      type1 = 'token20'
    } else if (type === 'tx') {
      type1 = 'transaction'
    }
  }

  return `${n}/${type1}/${address}`
}

export function openBrowser(
  url: string,
  type: 'token' | 'address' | 'tx',
  chain: string
) {
  let newUrl = url
  if (type) {
    newUrl = formatExplorerUrl(chain, url, type)
  }
  if (!newUrl) {
    return
  }
  window.open(newUrl)
}

export function getChainDefaultIconColor(chain?: string) {
  const theme = useThemeStore().theme
  const defaultColor = theme === 'dark' ? '#333333' : '#999999'
  if (!chain) {
    return defaultColor
  }
  const colors: Record<string, string> = {
    solana: '#C931F7',
    eth: '#627EEA',
    bsc: '#F0B90A',
    tron: '#C53027',
    sui: '#6FBCF0',
    ton: '#0099E9',
    base: '#0152FF',
  }

  return colors?.[chain] || defaultColor
}

export function getChainDefaultIcon(chain?: string, text = '', type?: string) {
  if (text) {
    const color = getChainDefaultIconColor(chain)
    const circle = `<?xml version="1.0" standalone="no"?><svg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="50%" cy="50%" r="16" stroke="transparent" fill="${color}" stroke-width="0"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#fff">${text
      ?.slice(0, 1)
      ?.toUpperCase?.()}</text>
    </svg>`
    const rect = `<?xml version="1.0" standalone="no"?>
    <svg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="${color}" stroke="transparent" stroke-width="0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#fff">
        ${text?.slice(0, 1)?.toUpperCase?.()}
      </text>
    </svg>`
    const defaultSvg = type === 'rect' ? rect : circle
    try {
      return (
        'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(defaultSvg)))
      )
    } catch (err) {
      console.log(err)
      return ''
    }
  }
  return '/icon-default.png'
}
export function getSymbolDefaultIcon(tokenInfo: {
  symbol?: string
  chain: string
  logo_url?: string
}| undefined , type= 'circle') {
  const domain = useConfigStore().token_logo_url
  if (
    tokenInfo &&
    tokenInfo.logo_url !== undefined &&
    tokenInfo.logo_url !== ''
  ) {
    if (/^https?:\/\//.test(tokenInfo.logo_url)) {
      return tokenInfo.logo_url
    }
    return domain + tokenInfo.logo_url
  }
  return getChainDefaultIcon(tokenInfo?.chain || '', tokenInfo?.symbol || '', type || '')
}

export function formatIconTag(src: string) {
  const urlPrefix =
    useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
  return src && src !== 'unknown'
    ? `${urlPrefix}signals/${src}.png`
    : IconUnknown
}
export function formatImgUrl(type: string, src: string) {
  if (!type || !src) {
    return IconUnknown
  }
  const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
  return `${urlPrefix}${type}/${src}.png`
}

export function deepMerge(target: any, source: any) {
  if (Array.isArray(target) && Array.isArray(source)) {
    // 如果是数组，直接覆盖
    return source
  } else if (typeof target === 'object' && typeof source === 'object') {
    // 对象的合并逻辑
    const result = { ...target }
    for (const key in source) {
      // eslint-disable-next-line no-prototype-builtins
      if (target.hasOwnProperty(key)) {
        // 如果目标对象中已有该键，递归合并
        result[key] = deepMerge(target[key], source[key])
      } else {
        // 如果目标对象中没有该键，直接添加
        result[key] = source[key]
      }
    }
    return result
  } else {
    // 基本类型覆盖
    return source
  }
}

export function formatIconSwap(src?: string) {
  return src && src !== 'unknown'
    ? `${useConfigStore().token_logo_url}swap/${src}.jpeg`
    : IconUnknown
}

export function formatNewTags(src?:string) {
  return src && src !== 'unknown'
    ? `${useConfigStore().token_logo_url}address_portrait/${src}`
    : IconUnknown
}

export function getWSMessage(e: MessageEvent) {
  if (e.data === 'pong') {
    return null
  }
  if (isJSON(e.data)) {
    const result = JSON.parse(e.data || {})?.result || {}
    if (result.status === 'ok') {
      const data = result.data
      const event = data.event
      return {
        event,
        data,
      }
    }
  }
  return null
}

export function verifyLogin() {
  const bottStore = useBotStore()
  const userInfo = bottStore.userInfo
  if (!userInfo?.evmAddress) {
    bottStore.changeConnectVisible(true)
    // 连接钱包
    return false
  }
  return true
}

export function formatRemark(val = '', n = 10, suffix = '...'){
  if (typeof val !== 'string') return val
  if (val.length > n) {
    return val.slice(0,n) + suffix
  }
  return val
}

export function getRemarkByAddress({address, chain}: {address: string, chain: string}) {
  if (!address || !chain) {
    return ''
  }
  return useRemarksStore().getRemarkByAddress({address, chain})
}

export function getColorClass(val: string|number) {
  if (Number(val) > 0) {
    return 'color-#12B886'
  } else if (Number(val) < 0) {
    return 'color-#FF646D'
  } else {
    return 'color-[--d-666-l-999]'
  }
}
export function desensitizeEmail(email: string) {
  // 使用正则表达式匹配邮箱格式
  const emailPattern = /^(.+?)(@.*)$/
  const match = email.match(emailPattern)

  if (match) {
    const username = match[1] // 获取用户名部分
    const domain = match[2] // 获取域名部分

    let maskedUsername
    if (username.length === 1) {
      // 只有一个字符，保留该字符并加上 ***
      maskedUsername = `${username}***`
    } else if (username.length >= 2) {
      // 大于等于两个字符，保留前两个字符并加上 ***
      maskedUsername = `${username.slice(0, 2)}***`
    }

    return `${maskedUsername}${domain}`
  } else {
    throw new Error('Invalid email format')
  }
}

export function isEvmChain(chain: string) {
  const chainInfo = getChainInfo(chain)
  return chainInfo?.vm_type === 'evm'
}

export function getRpcProvider(chain: string) {
  const chainInfo = getChainInfo(chain)
  if (!chainInfo || chainInfo?.vm_type !== 'evm') {
    return null
  }
  const RPC: Record<string, string> = {
    base: 'https://1rpc.io/base',
    eth: 'https://rpc.mevblocker.io'
  }
  const rpcUrl = RPC?.[chain] || chainInfo?.rpc_url || ''
  return new JsonRpcProvider(rpcUrl, Number(chainInfo.chain_id))
}

export const evm_utils = {
  formatUnits: (...arg: [value: string | number | bigint, decimals?: string | number]) => {
    const decimals = Number(arg?.[1])
    if (!decimals) {
      return arg?.[0] || 0
    }
    return formatUnits(...arg)
  },
  parseUnits: (...arg: [value: string | number | bigint, decimals?: string | number]) => {
    const decimals = Number(arg?.[1])
    if (!decimals) {
      return FixedNumber.fromString(String(arg?.[0] ?? '0')).value
    }
    const valueStr = String(arg?.[0] ?? '')
    return parseUnits(valueStr, decimals)
  }
}
export function filterGas(num: number, chain?: string) {
  if (chain === 'bsc') {
    if (num < 1) {
      return '#999'
    } else if (num < 2) {
      return '#EAECEF'
    } else {
      return '#f81111'
    }
  } else if (chain === 'eth') {
    if (num < 3) {
      return '#999'
    } else if (num < 6) {
      return '#EAECEF'
    } else {
      return '#f81111'
    }
  } else {
    if (num < 0.5) {
      return '#999'
    } else {
      return '#f81111'
    }
  }
}
export function addSign(val: number) {
  if (val > 0) {
    return '+'
  } else if (val < 0) {
    return '-'
  }
  return ''
}

export function getTextWidth(text: string, min = 0) {

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.font = '12px DINPro-regular'
  const metrics = context.measureText(text)
  console.log('-----text--------', text, Math.max(metrics.width, min))
  return Math.max(metrics.width, min)
}

export function jumpTg() {
  const inviterUrl =
    config.inviter_url_v2 || 'https://share.ave.ai'
  const text =
    useLocaleStore().locale == 'zh-cn'
      ? '我正在Ave.ai挖百倍金狗，现在注册并交易，跟我一起探寻百倍Meme。'
      : 'I’m currently mining 100x Gold Doge on Ave.ai. Register and trade now, and join me in exploring 100x Meme.'
  const refCode = Cookies.get('refCode') || ''
  const url =
    `${inviterUrl}?code=${refCode}` +
    `
#AveAI #CryptoTrading #MemeCoins`
  const share_url = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}`
  window.open(share_url)
}

export function jumpX() {
  const inviterUrl =
    config.inviter_url_v2 || 'https://share.ave.ai'
  const text =
    useLocaleStore().locale == 'zh-cn'
      ? `我正在Ave.ai挖百倍金狗，现在注册并交易，跟我一起探寻百倍Meme。
👉`
      : `I’m currently mining 100x Gold Doge on Ave.ai. Register and trade now, and join me in exploring 100x Meme.
👉`
  const refCode = Cookies.get('refCode') || ''
  const url =
    `${inviterUrl}?code=${refCode}` +
    `
#AveAI #CryptoTrading #MemeCoins`
  const share_url = `https://x.com/intent/post?text=${encodeURIComponent(
    text
  )}+${encodeURIComponent(url)}`
  window.open(share_url)
}

export function scrollTabToCenter(tabsContainer: Ref<HTMLElement | null>,index: number) {
  if (!tabsContainer.value) {
    return
  }
  const container = tabsContainer.value
  const tab = container.children[index] as HTMLElement
  if (!tab) return

  const containerWidth = container.offsetWidth
  const tabLeft = tab.offsetLeft
  const tabWidth = tab.offsetWidth

  container.scrollTo({
    left: tabLeft - (containerWidth / 2) + (tabWidth / 2),
    behavior: 'smooth'
  })
}

export function uuid() {
  return Math.random().toString(36).slice(-8) + Date.now()
}

export function getMCap(row: GetHotTokensResponse | SearchHot) {
  const amount = new BigNumber(row.total).minus(row.lock_amount).minus(row.burn_amount).minus(row.other_amount)
  return amount.gt(0)? amount.multipliedBy(row.current_price_usd).toString() : '0'
}

export function formatCountdown(time: ConfigType) {
  const seconds = Math.abs(dayjs(time).diff(dayjs(), 's'))
  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    // 1h
    const minutes = Math.floor(seconds / 60)
    let remainingSeconds = seconds % 60
    remainingSeconds = Math.floor(remainingSeconds)
    return `${minutes}min ${
      remainingSeconds > 0 ? remainingSeconds + 's' : ''
    }`
  } else if (seconds < 86400) {
    // 1d
    const hours = Math.floor(seconds / 3600)
    let remainingMinutes = Math.floor((seconds % 3600) / 60)
    remainingMinutes = Math.floor(remainingMinutes)
    return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'min' : ''}`
  } else if (seconds < 2592000) {
    // 1m (30 days)
    const days = Math.floor(seconds / 86400)
    let remainingHours = Math.floor((seconds % 86400) / 3600)
    remainingHours = Math.floor(remainingHours)
    return `${days}d ${remainingHours > 0 ? remainingHours + 'h' : ''} `
  } else if (seconds < 31536000) {
    // 1y (12 months)
    const months = Math.floor(seconds / 2592000)
    return `${months}m`
  } else {
    const years = Math.floor(seconds / 31536000)
    return `${years}y`
  }
}

export function usePumpTableDataFetching(key = '') {
  return useStorage(
    key,
    {
      dev_sale_out: 0,
      platforms: 'pump,moonshot',
      market_cap_min: '', // 市值
      market_cap_max: '',
      progress_min: '', //进度
      progress_max: '',
      volume_u_24h_min: '', //交易额
      volume_u_24h_max: '',
      dev_balance_ratio_cur_min: '', //dev 持仓%
      dev_balance_ratio_cur_max: '',
      holders_top10_ratio_min: '', //top10 持仓%
      holders_top10_ratio_max: '',
      tvl_min: '',
      tvl_max: '',
      holder_min: '', //持有人
      holder_max: '',
      tx_24h_count_min: '',
      tx_24h_count_max: '',
      smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
      smart_money_tx_count_24h_max: '',
    },
    localStorage,
    { mergeDefaults: true }
  )
}
export function getValueType(val) {
  return Object.prototype.toString.call(val)
}
export function _isString(val) {
  return getValueType(val) === '[object String]'
}

export function _isArray(val) {
  return getValueType(val) === '[object Array]'
}


export function getSwapSize(type: Size):SizeObj {
  const obj:Record<Size, SizeObj> = {
    small: {
      flash:'6px',
      amm: '10px',
      text: '10px'
    },
    medium: {
      flash:'10px',
      amm: '12px',
      text: '12px'
    },
    large: {
      flash:'12px',
      amm: '16px',
      text: '16px'
    }
  }
  return obj[type] || ''
}