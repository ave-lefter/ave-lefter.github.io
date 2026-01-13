/* DecimalExtensions.ts - 基于 bignumber.js 的高精度数学库 */

import BigNumber from 'bignumber.js'

/** 精度设置（类似 Java MathContext 34 位，ROUND_HALF_UP） */
BigNumber.set({
  DECIMAL_PLACES: 34,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
})

export class DecimalExtensions {
  static DEFAULT_SCALE = 25

  /** 字符串或 number 转 BigNumber */
  static toDecimal(value: string | number | BigNumber): BigNumber {
    if (value === null || value === undefined || value === '') {
      return new BigNumber(0)
    }
    try {
      return new BigNumber(value)
    } catch (e) {
      return new BigNumber(0)
    }
  }

  /** = 0 */
  static isEqualZero(value: BigNumber): boolean {
    return value.isZero()
  }

  /** > 0 */
  static isMoreZero(value: BigNumber): boolean {
    return value.gt(0)
  }

  /** >= 0 */
  static isMoreOrEqualZero(value: BigNumber): boolean {
    return value.gte(0)
  }

  /** < 0 */
  static isLessZero(value: BigNumber): boolean {
    return value.lt(0)
  }

  /** <= 0 */
  static isLessOrEqualZero(value: BigNumber): boolean {
    return value.lte(0)
  }

  /** 数字=指定 */
  static isEqualNum(value: BigNumber, number: BigNumber): boolean {
    return value.eq(number)
  }

  /** 数字>指定 */
  static isMoreNum(value: BigNumber, number: BigNumber): boolean {
    return value.gt(number)
  }

  /** 数字>=指定 */
  static isMoreOrEqualNum(value: BigNumber, number: BigNumber): boolean {
    return value.gte(number)
  }

  /** 数字 < 指定 */
  static isLessNum(value: BigNumber, number: BigNumber): boolean {
    return value.lt(number)
  }

  /** 数字 <= 指定 */
  static isLessOrEqualNum(value: BigNumber, number: BigNumber): boolean {
    return value.lte(number)
  }

  /** 加法 */
  static add(a: BigNumber | string, b: BigNumber | string): string {
    return new BigNumber(a).plus(b).toString()
  }

  /** 减法 */
  static subtract(a: BigNumber | string, b: BigNumber | string): string {
    return new BigNumber(a).minus(b).toString()
  }

  /** 乘法 */
  static multiply(a: BigNumber | string, b: BigNumber | string): string {
    return new BigNumber(a).multipliedBy(b).toString()
  }

  /** 除法 */
  static divide(a: BigNumber | string, b: BigNumber | string): string {
    if (new BigNumber(b).isZero()) {
      return '-'
    }
    return new BigNumber(a).dividedBy(b).toFixed(this.DEFAULT_SCALE)
  }

  /** digitMergeNumber（步长合并）完全对齐 Java */
  static digitMergeNumber(
    value: BigNumber | string,
    digitMerge: BigNumber | string,
    isCeil: boolean
  ): string {
    const v = new BigNumber(value)
    const d = new BigNumber(digitMerge)

    if (d.isZero()) return v.toString()

    const stepCount = v.div(d)
    const fractional = stepCount.mod(1)

    let margin = new BigNumber(0)

    if (isCeil) {
      // Java: fractional != 0 → 加步长
      if (!fractional.isZero()) {
        margin = d
      }
    } else {
      // Java: fractional >= 0.5 → 加步长（四舍五入）
      if (fractional.gte(0.5)) {
        margin = d
      }
    }

    const integerPart = stepCount.integerValue(BigNumber.ROUND_FLOOR)
    return integerPart.multipliedBy(d).plus(margin).toString()
  }

  /** max */
  static max(a: BigNumber, b: BigNumber): BigNumber {
    return a.gt(b) ? a : b
  }

  /** min */
  static min(a: BigNumber, b: BigNumber): BigNumber {
    return a.lt(b) ? a : b
  }

  /** ceil */
  static ceil(value: BigNumber | string, scale: number): string {
    return new BigNumber(value).decimalPlaces(scale, BigNumber.ROUND_CEIL).toString()
  }

  /** floor */
  static floor(value: BigNumber | string, scale: number): string {
    return new BigNumber(value).decimalPlaces(scale, BigNumber.ROUND_FLOOR).toString()
  }

  /** 四舍五入 */
  static round(value: BigNumber | string, scale: number): string {
    return new BigNumber(value).decimalPlaces(scale, BigNumber.ROUND_HALF_UP).toString()
  }

  /** handPrecision（自动精度）*/
  static getPrecision(value: BigNumber): number {
    const abs = value.abs()

    const num = abs.toNumber()

    if (num >= 100000) return 0
    if (num >= 10000) return 1
    if (num >= 1000 || num === 0) return 2
    if (num >= 100) return 3
    if (num >= 10) return 4
    if (num >= 1) return 5

    const str = value.toString()
    if (str.includes('.')) {
      const decimals = str.split('.')[1]
      for (let i = 0; i < decimals.length; i++) {
        if (decimals[i] !== '0') {
          return i + 4
        }
      }
    }
    return 2
  }

  static handPrecision(value: BigNumber): string {
    const precision = this.getPrecision(value)
    return this.round(value, precision)
  }

  /** 格式化成 K/M/B 单位 */
  static handNumber(value: BigNumber, scale = 2, kmbScale = 2): string {
    const v = value
    const abs = v.abs()

    const oneK = new BigNumber(1000)
    const oneM = new BigNumber(1000000)
    const oneB = new BigNumber(1000000000)

    let num = v.toFixed(scale)
    let unit = ''

    if (abs.gte(oneB)) {
      num = v.div(oneB).toFixed(kmbScale)
      unit = 'B'
    } else if (abs.gte(oneM)) {
      num = v.div(oneM).toFixed(kmbScale)
      unit = 'M'
    } else if (abs.gte(oneK)) {
      num = v.div(oneK).toFixed(kmbScale)
      unit = 'K'
    }

    return num + unit
  }
}
