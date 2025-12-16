import { FilledOrder } from "../entities/FilledOrder";
import { TradeHistory } from "../entities/TradeHistory";

export class FilterUtils {
  /**
   * 判断日期是否在指定天数范围内
   * @param date - Date 对象或时间戳
   * @param days - 天数
   * @returns 是否在范围内
   */
  static isWithinDays(date: Date | number, days: number): boolean {
    if (!date) return false;

    const targetTime = date instanceof Date ? date.getTime() : date;
    const now = Date.now();
    const daysInMs = days * 24 * 60 * 60 * 1000;

    return now - targetTime <= daysInMs;
  }

  /**
   * 判断项目状态是否匹配
   * @param item - 数据项
   * @param statusValue - 状态值 ("all" 表示全部)
   * @returns 是否匹配
   */
  static matchesStatus(item: TradeHistory, statusValue: string): boolean {
    if (statusValue === "all" || statusValue === "ALL") return true;
    return item.status === statusValue;
  }

  /**
   * 判断项目方向是否匹配
   * @param item - 数据项
   * @param sideValue - 方向值 ("all" 表示全部)
   * @returns 是否匹配
   */
  static matchesSide(item: FilledOrder, sideValue: string): boolean {
    if (sideValue === "all" || sideValue === "ALL") return true;
    return item.orderSide === sideValue;
  }
}