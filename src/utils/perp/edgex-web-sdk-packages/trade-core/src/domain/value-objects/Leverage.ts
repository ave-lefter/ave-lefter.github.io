/**
 * 领域值对象：Leverage（杠杆）
 * Domain Value Object: Leverage
 *
 * 表示杠杆倍数，提供验证和计算功能
 * 不可变对象
 */

import { LeverageExceededError, ValidationError } from "../errors/DomainError";

/**
 * Leverage 值对象
 *
 * 不可变对象，表示杠杆倍数
 */
export class Leverage {
  /**
   * 杠杆倍数
   */
  private readonly value: number;

  /**
   * 最小杠杆倍数
   */
  private static readonly MIN_LEVERAGE = 1;

  /**
   * 最大杠杆倍数
   */
  private static readonly MAX_LEVERAGE = 125;

  /**
   * 构造函数
   *
   * @param value - 杠杆倍数
   * @throws ValidationError 如果杠杆无效
   */
  constructor(value: number) {
    if (!Leverage.isValid(value)) {
      throw new ValidationError(`Invalid leverage: ${value}`, "leverage", value);
    }

    if (value < Leverage.MIN_LEVERAGE || value > Leverage.MAX_LEVERAGE) {
      throw new LeverageExceededError(value, Leverage.MAX_LEVERAGE);
    }

    this.value = value;
  }

  /**
   * 获取杠杆倍数
   */
  getValue(): number {
    return this.value;
  }

  /**
   * 转换为数字
   */
  toNumber(): number {
    return this.value;
  }

  /**
   * 计算保证金率
   *
   * 保证金率 = 1 / 杠杆倍数
   *
   * @returns 保证金率（小数）
   */
  calculateMarginRate(): number {
    return 1 / this.value;
  }

  /**
   * 比较大小
   *
   * @param other - 另一个杠杆
   * @returns 1 (大于), 0 (等于), -1 (小于)
   */
  compare(other: Leverage): number {
    if (this.value > other.value) return 1;
    if (this.value < other.value) return -1;
    return 0;
  }

  /**
   * 是否大于
   */
  isGreaterThan(other: Leverage): boolean {
    return this.compare(other) > 0;
  }

  /**
   * 是否小于
   */
  isLessThan(other: Leverage): boolean {
    return this.compare(other) < 0;
  }

  /**
   * 是否等于
   */
  equals(other: Leverage): boolean {
    return this.compare(other) === 0;
  }

  /**
   * 验证杠杆是否有效
   */
  static isValid(value: number): boolean {
    if (typeof value !== "number") return false;
    if (isNaN(value)) return false;
    if (!isFinite(value)) return false;
    if (value <= 0) return false;
    return true;
  }

  /**
   * 获取最小杠杆倍数
   */
  static getMinLeverage(): number {
    return Leverage.MIN_LEVERAGE;
  }

  /**
   * 获取最大杠杆倍数
   */
  static getMaxLeverage(): number {
    return Leverage.MAX_LEVERAGE;
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return `${this.value}x`;
  }

  /**
   * 转换为 JSON
   */
  toJSON(): { value: number } {
    return {
      value: this.value,
    };
  }
}
