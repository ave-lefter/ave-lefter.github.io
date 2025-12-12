import BigNumber from 'bignumber.js'

/**
 * ✅ 性能优化：使用原生 structuredClone 替代递归实现
 *
 * structuredClone 是浏览器原生 API，性能远超递归深拷贝
 * 支持：Chrome 98+, Firefox 94+, Safari 15.4+, Edge 98+
 *
 * 注意：structuredClone 不支持以下类型：
 * - 函数
 * - DOM 节点
 * - Symbol
 * - Error 对象（部分属性会丢失）
 *
 * @param obj - 要深拷贝的对象
 * @returns {T} - 深拷贝后的对象
 */
export function deepCopy<T>(obj: T): T {
  // 检查浏览器是否支持 structuredClone
  if (typeof structuredClone !== 'undefined') {
    try {
      // 使用原生 structuredClone，性能提升 10-100 倍
      return structuredClone(obj)
    } catch (e) {
      // structuredClone 失败时的 fallback（如函数、Symbol、DOM 节点等）
      console.warn('structuredClone failed, using JSON fallback:', e)
      // 使用 JSON 序列化作为 fallback（会丢失函数、Symbol 等）
      return JSON.parse(JSON.stringify(obj))
    }
  }
  // 旧浏览器 fallback
  return JSON.parse(JSON.stringify(obj))
}

export const defaultTimeFormat = 'YYYY/mm/dd HH:MM:SS'
export const defaultDateFormat = 'YYYY/mm/dd'
export const MONTHS: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 *
 * @param millisecond
 * @param formatter
 * @returns {string}
 */
export function formatDateTime(
  millisecond: string | number,
  formatter: string = defaultTimeFormat,
): string {
  const date = new Date(parseInt(String(millisecond)))
  const opt: Record<string, string> = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString(), // 秒
    OOO: MONTHS[date.getMonth()],
  }
  for (let k in opt) {
    let reg = new RegExp('(' + k + ')').exec(formatter)
    if (reg) {
      formatter = formatter.replace(
        reg[1],
        reg[1].length == 1 ? opt[k] : opt[k].padStart(reg[1].length, '0'),
      )
    }
  }
  return formatter
}

export function printTraceless(...arg: any[]): void {
  //@ts-ignore
  setTimeout(console.log.bind(this, ...arguments), 0)
}

export function formatSeconds(seconds: string | number): {
  day: string
  hour: string
  minute: string
  second: string
} {
  seconds = Number(seconds)
  const tempObj: { day: string; hour: string; minute: string; second: string } =
    {
      day: '00',
      hour: '00',
      minute: '00',
      second: '00',
    }
  if (seconds && seconds > 0) {
    const day = Math.floor(seconds / 86400)
    tempObj.day = (day > 9 ? '' : '0') + day
    seconds = seconds % 86400
    const hour = Math.floor(seconds / 3600)
    tempObj.hour = (hour > 9 ? '' : '0') + hour
    seconds = seconds % 3600
    const minute = Math.floor(seconds / 60)
    tempObj.minute = (minute > 9 ? '' : '0') + minute
    const second = seconds % 60
    tempObj.second = (second > 9 ? '' : '0') + second
  }
  return tempObj
}

/**
 * diff two timestamp in xx D xxH xxM xxS
 * @param {string} start "1711368706111"
 * @param {string} end "1711368854039"
 * @param {string} format default "{D}D {H}H {M}M"
 * @returns {string} formatted diff string
 */
export function diffDateTime(
  start: string | number,
  end: string | number,
  format: string = '{D}D {H}H {M}M',
): string {
  // diff two timestamp in xx D xxH xxM xxS
  const diff = Number(end) - Number(start)
  const days = Math.floor(diff / (24 * 3600 * 1000))
  const leave1 = diff % (24 * 3600 * 1000)
  const hours = Math.floor(leave1 / (3600 * 1000))
  const leave2 = leave1 % (3600 * 1000)
  const minutes = Math.floor(leave2 / (60 * 1000))
  const seconds = Math.floor((leave2 % (60 * 1000)) / 1000)
  return format
    .replace('{D}', String(days))
    .replace('{H}', String(hours))
    .replace('{M}', String(minutes))
    .replace('{S}', String(seconds))
}

function compare(key: string, type: string) {
  return function sortGen(m: any, n: any): number {
    const a = isNaN(Number(m[key])) ? m[key]?.toUpperCase() : Number(m[key])
    const b = isNaN(Number(n[key])) ? n[key]?.toUpperCase() : Number(n[key])
    if (a < b) {
      return type === 'up' ? -1 : 1
    }
    if (a > b) {
      return type === 'up' ? 1 : -1
    }
    return 0
  }
}

/**
 * Sort object array by key, with optional secondary sort
 * @param {Array} list - Array to sort
 * @param {string} key - Primary sort field
 * @param {string} type - Primary sort direction ("up" or "down")
 * @param {string} secondaryKey - Optional secondary sort field (used when primary values are equal)
 * @param {string} secondaryType - Optional secondary sort direction ("up" or "down")
 * @returns {Array} Sorted array
 */
export function sortObjectArrayByKey<T>(
  list: T[],
  key: string,
  type?: string,
  secondaryKey?: string,
  secondaryType?: string,
): T[] {
  // ✅ 性能优化：使用浅拷贝替代深拷贝（数组排序不需要深拷贝）
  const tempList = [...list]

  if (secondaryKey) {
    // Use secondary sort when primary values are equal
    return tempList.sort((a, b) => {
      // Primary sort comparison
      const primaryResult = compare(key, type || 'up')(a, b)
      if (primaryResult !== 0) {
        return primaryResult
      }
      // Primary values are equal, use secondary sort
      return compare(secondaryKey, secondaryType || 'down')(a, b)
    })
  } else {
    // Original single-field sort logic
    return tempList.sort(compare(key, type || 'up'))
  }
}

export function findIndexByKey<T>(list: T[], key: keyof T, value: any): number {
  let tempIdx = -1
  list.some((item, idx) => {
    if (item[key] === value) {
      tempIdx = idx
      return true
    }
  })
  return tempIdx
}
// 数字处理
/**********************************************************************/
/**
 * 科学计数转普通数字
 * @param num
 * @returns {string}
 */
export function toNonExponential(num: number | string): string {
  const tempResult = Number(num)
  if (isNaN(tempResult)) {
    return String(num)
  }
  const matches = tempResult.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return tempResult.toFixed(
    Math.max(
      0,
      (matches ? matches[1] : '')?.length - Number(matches ? matches[2] : 0),
    ),
  )
}
/**
 * 获取数值、数字字符串 精度
 * "0.001" => 3 "2000" => 0
 */
export function getNumberPrecision(num: number | string): number {
  const valStrList = String(num).split('.')
  return valStrList.length <= 2 ? (valStrList[1] ? valStrList[1].length : 0) : 2
}
/**
 * Round by tickSize
 * @param num
 * @param tickSize
 * @param isFloor 是否向下取值，用于计算最大值时，向下取数据、防止溢出
 * @returns {number}
 *
 * toTickSizeNumber(1.58, 0.05) -> 1.60
 * toTickSizeNumber(1.54, 0.05) -> 1.55
 */
export function toTickSizeRoundString(
  num: number | string,
  tickSize: number | string,
  isFloor?: boolean,
): string {
  const tempResult = Number(num)
  if (isNaN(tempResult) || Number(tickSize) <= 0) {
    return String(num)
  }
  let result
  const tickSizeNum = Number(tickSize)
  if (tickSizeNum >= 1) {
    result = (
      Math[isFloor ? 'floor' : 'round'](tempResult / tickSizeNum) * tickSizeNum
    ).toFixed(getNumberPrecision(tickSize))
  } else {
    const precision = String(tickSize).length - 2
    result = bigNumberMultiply(
      Math[isFloor ? 'floor' : 'round'](
        bigNumberMultiply(tempResult, 1 / tickSizeNum),
      ),
      tickSizeNum,
    ).toFixed(precision)
  }
  return Number(result) === 0
    ? tempResult !== 0
      ? String(tickSize)
      : result
    : result
}
/**
 * 百分比处理
 * @param num
 * @param precision
 * @param withoutUnit // 不带结尾的百分号
 * @returns {number | string}
 */
export function toPercentString(
  num: number | string,
  precision?: number,
  withoutUnit?: boolean,
): string {
  const tempResult = Number(num)
  const valPrecision = precision === undefined ? 2 : precision
  return isNaN(tempResult)
    ? (0).toFixed(valPrecision)
    : `${bigNumberMultiply(tempResult, 100).toFixed(valPrecision)}${withoutUnit ? '' : '%'}`
}
/**
 * 普通小数精度处理 截取有效位
 * toPrecisionString(0.001, 2) -> '0.00'
 * toPrecisionString(0.045, 2) -> '0.04'
 * toPrecisionString(0.045, 6) -> '0.045000'
 * toPrecisionString(0.001, 2, 'withMinVal') -> '0.01'
 * @param num
 * @param precision
 * @param withMinVal 是否需要最小值
 * @returns {string}
 */
export function toPrecisionString(
  num: number | string | BigNumber,
  precision: number = 2,
  withMinVal: boolean = false,
): string {
  const tempResult = Number(BigNumber(num).toNumber())
  const valPrecision = precision === undefined ? 2 : precision
  if (num === undefined) return (0).toFixed(valPrecision)
  const scaleNum = Math.pow(10, Math.ceil(valPrecision))
  const result = String(
    isNaN(tempResult)
      ? num
      : (
          Math.floor(bigNumberMultiply(tempResult, scaleNum)) / scaleNum
        ).toFixed(valPrecision),
  )
  return Boolean(withMinVal) && Number(result) === 0
    ? String(Math.pow(10, -precision))
    : result
}
/**
 * 向下 或 向上取精度
 * toPrecisionStringWithType(0.001, 2, 'ceil') -> '0.01'
 * toPrecisionStringWithType(0.045, 2) -> '0.04'
 * toPrecisionStringWithType(0.045, 6) -> '0.045000'
 * @param num
 * @param precision
 * @param type
 */
export function toPrecisionStringWithType(
  num: number | string | BigNumber,
  precision: number = 2,
  type: string = 'floor',
): string {
  const tempResult = Number(BigNumber(num).toNumber())
  const valPrecision = precision === undefined ? 2 : precision
  if (isNaN(tempResult)) {
    return (0).toFixed(valPrecision)
  } else {
    const scaleNum = Math.pow(10, valPrecision)
    return (
      (Math as any)[type](bigNumberMultiply(tempResult, scaleNum)) / scaleNum
    ).toFixed(valPrecision)
  }
}
/**
 * 千分化 小数点截取
 * toThousandString(0.004, 2) -> 0.00
 * toThousandString(0.004, 2, 'withMinVal') -> 0.01
 * toThousandString(10001.123, 6) -> 10,001.123000
 * toThousandString(10001.1234567, 6) -> 10,001.123456
 * @param num
 * @param precision
 * @param withMinVal
 * @returns {number | string}
 */
export function toThousandString(
  num: number | string | BigNumber,
  precision?: number,
  withMinVal?: boolean,
): string {
  const tempResult = Number(BigNumber(num).toNumber())
  const valPrecision = precision === undefined ? 2 : precision
  if (isNaN(tempResult)) {
    return (0).toFixed(valPrecision)
  }
  const scaleNum = Math.pow(10, valPrecision)
  const tempStrList = (
    Math.floor(bigNumberMultiply(tempResult, scaleNum)) / scaleNum
  )
    .toFixed(valPrecision)
    .split('.')
  const result =
    tempStrList.length === 2
      ? `${Number(tempStrList[0]).toLocaleString('en-US')}.${tempStrList[1]}`
      : Number(tempStrList[0]).toLocaleString('en-US')
  return Boolean(withMinVal) && Number(result.replace(/\\,/g, '')) === 0
    ? String(Math.pow(10, -valPrecision))
    : result
}
/**
 * 千分化，小数位为 精度内有效值 位数截取
 * toThousandStringWithValidPrecision(10001.123, 6) -> 10,001.123
 * toThousandStringWithValidPrecision(10001.1234567, 6) -> 10,001.123456
 * @param num
 * @param precision
 */
export function toThousandStringWithValidPrecision(
  num: number | string,
  precision?: number,
): string {
  const tempResult = Number(num)
  const valPrecision = precision === undefined ? 2 : precision
  if (isNaN(tempResult)) {
    return (0).toFixed(valPrecision)
  }
  const tempStrList = toPrecisionString(tempResult, valPrecision).split('.')
  tempStrList[1] = tempStrList[1].replace(/0+$/, '')
  return !tempStrList.includes('')
    ? `${Number(tempStrList[0]).toLocaleString('en-US')}.${tempStrList[1]}`
    : Number(tempStrList[0]).toLocaleString('en-US')
}
/**
 * 千分化，小数位为精度内有效值位数截取（不四舍五入）
 * @param {number|string} num - 输入数值
 * @param {number} [precision=2] - 小数精度
 * @returns {string} - 格式化后的字符串
 */
export function toThousandStringWithValidPrecisionFix(
  num: number | string,
  precision: number = 2,
): string {
  const tempResult = Number(num)
  if (isNaN(tempResult)) return (0).toFixed(precision)

  let integerPart, decimalPart

  if (precision === 0) {
    // 直接截取整数部分，不四舍五入
    integerPart = Math.trunc(tempResult)
    return integerPart.toLocaleString('en-US')
  } else {
    // 处理精度，并去除多余的 0
    let fixedStr = tempResult
      .toFixed(precision)
      .replace(/(\.\d*?)0+$/, '$1')
      .replace(/\.$/, '')
    ;[integerPart, decimalPart] = fixedStr.split('.')
  }

  return decimalPart !== undefined
    ? `${Number(integerPart).toLocaleString('en-US')}.${decimalPart}`
    : Number(integerPart).toLocaleString('en-US')
}

/**
 * 大数据 添加B M K
 * @param num
 * @param precision
 * @returns {number | string}
 */
export function toLargeUnitString(
  num: number | string,
  precision?: number,
): string {
  const tempResult = Number(num)
  if (isNaN(tempResult)) {
    return ''
  }
  const tempPrecision = precision === undefined ? 2 : precision
  let result
  switch (true) {
    case tempResult > 1000000000: // B
      result = `${(tempResult / 1000000000).toFixed(tempPrecision)}B`
      break
    case tempResult > 1000000: // M
      result = `${(tempResult / 1000000).toFixed(tempPrecision)}M`
      break
    case tempResult > 1000: // K
      result = `${(tempResult / 1000).toFixed(tempPrecision)}K`
      break
    default:
      result = tempResult.toFixed(tempPrecision)
  }
  return result
}

/**
 * 大数据 添加T B M K（截断方式，支持负数）
 * @param num
 * @param precision
 * @returns {number | string}
 */
export function formatLargeNumber(
  num: number | string,
  precision: number = 2,
): string {
  const tempResult = Number(num)
  if (isNaN(tempResult)) {
    return ''
  }

  const tempPrecision = precision === undefined ? 2 : precision
  const absResult = Math.abs(tempResult)
  const sign = tempResult < 0 ? -1 : 1

  const truncate = (value: any, p: any) => {
    const factor = Math.pow(10, p)
    return Math.trunc(value * factor) / factor
  }

  let result

  switch (true) {
    case absResult >= 1_000_000_000_000: // T
      result = `${truncate((sign * absResult) / 1_000_000_000_000, tempPrecision)}T`
      break
    case absResult >= 1_000_000_000: // B
      result = `${truncate((sign * absResult) / 1_000_000_000, tempPrecision)}B`
      break
    case absResult >= 1_000_000: // M
      result = `${truncate((sign * absResult) / 1_000_000, tempPrecision)}M`
      break
    case absResult >= 1_000: // K
      result = `${truncate((sign * absResult) / 1_000, tempPrecision)}K`
      break
    default:
      result = truncate(sign * absResult, tempPrecision).toString()
  }

  return result
}

/**********************************************************************/
// 带精度计算 相乘
export function bigNumberMultiply(...args: Array<number | string>): number {
  switch (true) {
    case !args.length:
      return 0
    case args.length === 1:
      return new BigNumber(args[0]).toNumber()
    default:
      const lastArgs = args.slice(1)
      return lastArgs
        .reduce((previousValue, currentValue) => {
          // if (isNaN(currentValue)) {
          //   console.log(`${args} has isNaN number`);
          // }
          return previousValue.multipliedBy(
            isNaN(Number(currentValue)) ? 1 : Number(currentValue),
          )
        }, new BigNumber(args[0]))
        .toNumber()
  }
}
// 带精度计算 相加
export function bigNumberPlus(...args: Array<number | string>): number {
  switch (true) {
    case !args.length:
      return 0
    case args.length === 1:
      return new BigNumber(args[0]).toNumber()
    default:
      const lastArgs = args.slice(1)
      return lastArgs
        .reduce((previousValue, currentValue) => {
          // if (isNaN(currentValue)) {
          //   console.log(`${args} has isNaN number`);
          // }
          return previousValue.plus(
            isNaN(Number(currentValue)) ? 0 : Number(currentValue),
          )
        }, new BigNumber(args[0]))
        .toNumber()
  }
}
// 带精度计算 取余
export function bigNumberModulo(
  numA: number | string,
  numB: number | string,
): number {
  const father = new BigNumber(numA)
  return father.modulo(numB).toNumber()
}
/*********************************************************************/

// 金额添加$，同时千分位化
export function armWith$(val: number | string, precision?: number): string {
  const num = Number(val)
  if (isNaN(num)) {
    return String(val)
  }
  return `${num >= 0 ? '' : '-'}$${toThousandString(
    Math.abs(num),
    precision === undefined ? 2 : precision,
  )}`
}
// 获取小数位，分割 字符小数点
export function getPrecision(num: number | string): number {
  const val = Number(num)
  if (isNaN(val)) {
    return 0
  }
  const strList = String(num).split('.')
  return strList.length === 2 ? strList[1].length : 0
}
export function capitalizeFirstLetter<T>(txt: T): T | string {
  if (typeof txt === 'string' && txt.length) {
    return txt.charAt(0).toUpperCase() + txt.slice(1)
  }
  return txt
}

/**
 * 字符串截短
 * @param str 原字符串
 * @param n 保留位数
 */
export const shortStr = (str: string, n: number): string => {
  if (!str || Object.prototype.toString.call(str) != '[object String]') {
    return ''
  }
  if (Number.isNaN(Number(n)) || Number(n) === 0) {
    return str
  }
  if (str.length <= n) {
    return str
  }
  const len = Math.ceil(n / 2)
  let pre = str.slice(0, len)
  let next = str.slice(str.length - len, str.length)
  return pre + '...' + next
}

export const shortStrPlus = (
  str: string,
  preLen: number,
  nextLen: number,
): string => {
  if (!str || Object.prototype.toString.call(str) !== '[object String]') {
    return ''
  }
  if (Number.isNaN(Number(preLen)) || Number.isNaN(Number(nextLen))) {
    return str
  }
  if (str.length <= preLen + nextLen) {
    return str
  }
  let pre = str.slice(0, preLen)
  let next = str.slice(-nextLen)
  return pre + '...' + next
}

/**
 * 地址忽略大小写对比
 * @param {*} a
 * @param {*} b
 * @returns
 */
export const isEqualAddressIgnoreCase = (
  a: string = '',
  b: string = '',
): boolean => {
  return a?.toLowerCase() === b?.toLowerCase()
}

/**
 * 截断长URL，保留开头和结尾部分，中间用省略号连接
 * 用于在UI中显示长链接时保持良好的视觉效果
 *
 * @param {string} url - 需要截断的URL字符串
 * @param {number} maxLength - 最大显示长度，默认20个字符
 * @returns {string} 截断后的URL字符串
 *
 * @example
 * truncateUrl("https://example.com/very/long/path/to/page?param=value", 30)
 * // 返回: "https://exampl...param=value"
 *
 * truncateUrl("short-url", 40)
 * // 返回: "short-url" (不需要截断)
 */
export const truncateUrl = (url: string, maxLength: number = 20): string => {
  if (!url || url === '--' || url.length <= maxLength) {
    return url
  }

  const start = url.substring(0, Math.floor(maxLength / 2))
  const end = url.substring(url.length - Math.floor(maxLength / 2))
  return `${start}...${end}`
}

/**
 * 获取文本宽度
 * @param {string} text
 * @param {string} font
 * @returns {number}
 *
 * @example
 * getTextWidth("1234567890", "12px Arial")
 * 返回 120
 */
export const getTextWidth = (
  text: string,
  font: string = '12px Arial',
): number => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.font = font
  return context.measureText(text).width
}
