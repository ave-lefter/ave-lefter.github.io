import BigNumber from "bignumber.js";
import { generateRandomClientId } from "@edgex/trade-libs";

/**
 * 计算TWAP订单拆分
 * @param {string} totalQty - 总下单数量
 * @param {string} maxSize - 最大单笔数量
 * @returns {Array<string>} 拆分后的订单数量数组
 */
export const calculateTwapSizes = (totalQty: string | number, maxSize: string): string[] => {
  const total = new BigNumber(totalQty);
  const max = new BigNumber(maxSize);

  // 计算需要拆分的份数
  const parts = Math.ceil(total.dividedBy(max).toNumber());

  // 生成拆分后的数量数组
  const sizes: string[] = [];
  for (let i = 0; i < parts - 1; i++) {
    sizes.push(max.toString());
  }

  // 最后一份数量
  const lastSize = total.minus(max.multipliedBy(parts - 1));
  sizes.push(lastSize.toString());

  return sizes;
};

/**
 * 生成TWAP订单组ID
 * @returns {string} TWAP组ID
 */
export const generateTwapGroupId = () => {
  return `twap_${generateRandomClientId()}`;
};
