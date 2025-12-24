import BigNumber from 'bignumber.js'

// 小于 0.1 数字的格式化
export function formatDec(n: number | string, decimals = 3) {
  let n1 = Number(n) || 0
  let d = 0
  if (n1 < 0) {
    n1 = -n1
  }
  while (n1 < 0.1 && n1 !== 0) {
    n1 = n1 * 10
    d++
  }
  let t = decimals + d
  t =  t < 0 ? 0 : t
  const reg = new RegExp('(\\.\\d*?[^0]?)(0+$)')
  return BigNumber(Number(n) || 0)
    .toFixed(t, BigNumber.ROUND_FLOOR)
    .replace(reg, '$1')
    .replace(new RegExp('\\.$'), '')
}


function formatNum(num: string | number, decimals = Infinity, groupSeparator = ',') {
  if (isNaN(Number(num))) {
    return num
  }
  const fmt = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: groupSeparator,
    groupSize: 3,
    secondaryGroupSize: 0,
  }
  const n = new BigNumber(num)
  if (decimals === Infinity) {
    return n.toFormat(fmt)
  }
  if (decimals < 0) {
    return n.times(10 ** decimals).dp(0, BigNumber.ROUND_FLOOR).div(10 ** decimals).toFormat(0, fmt)
  }
  return n.toFormat(decimals, fmt)
}


function formatNumUnit(n: number | string, decimals = 3, unit = 1000000000, _locale?: string) {
  let n1 = Number(n) || 0
  let pre = ''
  if (n1 < 0) {
    pre = '-'
    n1 = -n1
  }
  const locale = _locale || localStorage.getItem('language')
  const d = decimals < 0 ? decimals : Infinity
  if (locale === 'zh-cn') {
    if (n1 >= 10 ** 28) {
      return new BigNumber(n1).toPrecision(decimals + 1)
    }
    if (n1 >= 10 ** 24 && n1 >= unit) {
      n1 = n1 / 10 ** 24
      return pre + formatNum(formatDec(n1, decimals), d) + '亿亿亿'
    }
    if (n1 >= 10 ** 20 && n1 >= unit) {
      n1 = n1 / 10 ** 20
      return pre + formatNum(formatDec(n1, decimals), d) + '万亿亿'
    }
    if (n1 >= 10 ** 16 && n1 >= unit) {
      n1 = n1 / 10 ** 16
      return pre + formatNum(formatDec(n1, decimals), d) + '亿亿'
    }
    if (n1 >= 10 ** 12 && n1 >= unit) {
      n1 = n1 / 10 ** 12
      return pre + formatNum(formatDec(n1, decimals), d) + '万亿'
    }
    if (n1 >= 10 ** 8 && n1 >= unit) {
      n1 = n1 / 10 ** 8
      return pre + formatNum(formatDec(n1, decimals), d) + '亿'
    }
    if (n1 >= 10 ** 4 && n1 >= unit) {
      n1 = n1 / 10 ** 4
      return pre + formatNum(formatDec(n1, decimals), d) + '万'
    }
  } else if (locale === 'zh-tw') {
    if (n1 >= 10 ** 28) {
      return n1
    }
    if (n1 >= 10 ** 24 && n1 >= unit) {
      n1 = n1 / 10 ** 24
      return pre + formatNum(formatDec(n1, decimals), d) + '億億億'
    }
    if (n1 >= 10 ** 20 && n1 >= unit) {
      n1 = n1 / 10 ** 20
      return pre + formatNum(formatDec(n1, decimals), d) + '萬億億'
    }
    if (n1 >= 10 ** 16 && n1 >= unit) {
      n1 = n1 / 10 ** 16
      return pre + formatNum(formatDec(n1, decimals), d) + '億億'
    }
    if (n1 >= 10 ** 12 && n1 >= unit) {
      n1 = n1 / 10 ** 12
      return pre + formatNum(formatDec(n1, decimals), d) + '萬億'
    }
    if (n1 >= 10 ** 8 && n1 >= unit) {
      n1 = n1 / 10 ** 8
      return pre + formatNum(formatDec(n1, decimals), d) + '億'
    }
    if (n1 >= 10 ** 4 && n1 >= unit) {
      n1 = n1 / 10 ** 4
      return pre + formatNum(formatDec(n1, decimals), d) + '萬'
    }
  } else {
    if (n1 >= 10 ** 28) {
      return n1
    }
    if (n1 >= 10 ** 24 && n1 >= unit) {
      n1 = n1 / 10 ** 24
      return pre + formatNum(formatDec(n1, decimals), d) + 'Y'
    }
    if (n1 >= 10 ** 21 && n1 >= unit) {
      n1 = n1 / 10 ** 21
      return pre + formatNum(formatDec(n1, decimals), d) + 'Z'
    }
    if (n1 >= 10 ** 18 && n1 >= unit) {
      n1 = n1 / 10 ** 18
      return pre + formatNum(formatDec(n1, decimals), d) + 'E'
    }
    if (n1 >= 10 ** 15 && n1 >= unit) {
      n1 = n1 / 10 ** 15
      return pre + formatNum(formatDec(n1, decimals), d) + 'P'
    }
    if (n1 >= 10 ** 12 && n1 >= unit) {
      n1 = n1 / 10 ** 12
      return pre + formatNum(formatDec(n1, decimals), d) + 'T'
    }
    if (n1 >= 10 ** 9 && n1 >= unit) {
      n1 = n1 / 10 ** 9
      return pre + formatNum(formatDec(n1, decimals), d) + 'B'
    }
    if (n1 >= 10 ** 6 && n1 >= unit) {
      n1 = n1 / 10 ** 6
      return pre + formatNum(formatDec(n1, decimals), d) + 'M'
    }
    if (n1 >= 10 ** 3 && n1 >= unit) {
      n1 = n1 / 10 ** 3
      return pre + formatNum(formatDec(n1, decimals), d) + 'K'
    }
  }
  return pre + formatNum(formatDec(n1, decimals), d)
}

function formatNumShort(n: string | number, l = 4) {
  let pre = ''
  if (Number(n) < 0) {
    pre = '-'
    n = String(n).replace('-', '')
  }
  if (Number(n) && Number(n) < new BigNumber(0.1).pow(l).toNumber()) {
    const d = Math.ceil(Math.log10(0.1 / Number(n)))
    return (
      pre + '0.0' + `{${d}}` + String(n).replace(new RegExp(`^0\\.0{${d}}`), '')
    )
  }
  return pre + n
}

export function formatPercent(n: number, decimals = 2) {
  return Math.round(n * 10 ** (2 + decimals)) / 10 ** decimals + '%'
}

export function formatNumberS(n: string | number, config: any = {}) {
  let config1 = config
  if (typeof config === 'number') {
    config1 = {
      decimals: config,
    }
  }
  let { decimals, l } = config1
  const { limit } = config1
  decimals = decimals ?? 1
  l = l || 4
  const unit = limit ? 10 ** limit : 10000
  return formatNumber2(n, decimals, l, unit)
}

export function formatNumber2(n: string | number, decimals = 4, l = 4, unit: number = 0, _locale?: string) {
  const n1 = Number(n)
  if (
    !isNaN(n1) &&
    n1 <
    0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001 &&
    n1 > 0
  ) {
    return '0'
  }
  return formatNumShort(formatNumUnit(n, decimals, unit, _locale), l)
}

export function formatNumber(n: string | number, config: { decimals?: number; l?: number; limit?: number, locale?: string } | number = {}) {
  let config1 = config
  if (typeof config === 'number') {
    config1 = {
      decimals: config,
    }
  } else {
    config1 = config
  }
  const decimals = config1?.decimals ?? 4
  const l = config1?.l || 4
  const limit = config1?.limit
  const unit = limit ? 10 ** limit : 100000
  return formatNumber2(n, decimals, l, unit, config1?.locale)
}


