import BigNumber from "bignumber.js";
import type { AccountInfo, IContract, IMetadata, IRiskTier } from "../../types"
import {
  bigNumberMultiply,
  toPrecisionString,
  toThousandString,
  toTickSizeRoundString,
} from "../../utils";
import { Account } from "./Account";
import { RiskTier } from "./RiskTier";

export class SymbolEntity {
  constructor(public raw: IContract) {}

  static fromRaw(raw: IContract): SymbolEntity {
    return new SymbolEntity(raw);
  }

  // === 基础属性访问 (IContract 全量暴露) ===
  get contractId() {
    return this.raw.contractId;
  }
  get contractName() {
    return this.raw.contractName;
  }
  get baseCoinId() {
    return this.raw.baseCoinId;
  }
  get quoteCoinId() {
    return this.raw.quoteCoinId;
  }
  get tickSize() {
    return this.raw.tickSize;
  }
  get stepSize() {
    return this.raw.stepSize;
  }
  get minOrderSize() {
    return this.raw.minOrderSize;
  }
  get maxOrderSize() {
    return this.raw.maxOrderSize;
  }
  get maxOrderBuyPriceRatio() {
    return this.raw.maxOrderBuyPriceRatio;
  }
  get minOrderSellPriceRatio() {
    return this.raw.minOrderSellPriceRatio;
  }
  get maxPositionSize() {
    return this.raw.maxPositionSize;
  }
  get maxMarketPositionSize() {
    return this.raw.maxMarketPositionSize;
  }
  get riskTierList() {
    return this.raw.riskTierList.map(
      (item, index) => new RiskTier(item, index, this.raw.riskTierList),
    );
  }
  get defaultTakerFeeRate() {
    return this.raw.defaultTakerFeeRate;
  }
  get defaultMakerFeeRate() {
    return this.raw.defaultMakerFeeRate;
  }
  get defaultLeverage() {
    return this.raw.defaultLeverage;
  }
  get liquidateFeeRate() {
    return this.raw.liquidateFeeRate;
  }
  get enableTrade() {
    return this.raw.enableTrade;
  }
  get enableDisplay() {
    return this.raw.enableDisplay;
  }
  get enableOpenPosition() {
    return this.raw.enableOpenPosition;
  }
  get fundingInterestRate() {
    return this.raw.fundingInterestRate;
  }
  get fundingImpactMarginNotional() {
    return this.raw.fundingImpactMarginNotional;
  }
  get fundingMaxRate() {
    return this.raw.fundingMaxRate;
  }
  get fundingMinRate() {
    return this.raw.fundingMinRate;
  }
  get fundingRateIntervalMin() {
    return this.raw.fundingRateIntervalMin;
  }
  get displayDigitMerge() {
    return this.raw.displayDigitMerge;
  }
  get displayMaxLeverage() {
    return this.raw.displayMaxLeverage;
  }
  get displayMinLeverage() {
    return this.raw.displayMinLeverage;
  }
  get displayNewIcon() {
    return this.raw.displayNewIcon;
  }
  get displayHotIcon() {
    return this.raw.displayHotIcon;
  }
  get matchServerName() {
    return this.raw.matchServerName;
  }
  get starkExSyntheticAssetId() {
    return this.raw.starkExSyntheticAssetId;
  }
  get starkExResolution() {
    return this.raw.starkExResolution;
  }
  get starkExOraclePriceQuorum() {
    return this.raw.starkExOraclePriceQuorum;
  }
  get starkExOraclePriceSignedAssetId() {
    return this.raw.starkExOraclePriceSignedAssetId;
  }
  get starkExOraclePriceSigner() {
    return this.raw.starkExOraclePriceSigner;
  }
  get symbol() {
    return this.raw.symbol;
  }
  get pricePrecision() {
    return this.raw.pricePrecision ?? 2;
  }
  get priceStep() {
    return this.raw.priceStep;
  }
  get sizePrecision() {
    return this.raw.sizePrecision ?? 2;
  }
  get sizeStep() {
    return this.raw.sizeStep;
  }
  get baseCoin() {
    return this.raw.baseCoin;
  }
  get baseCoinPrecision() {
    return this.raw.baseCoinPrecision ?? 2;
  }
  get baseCoinRealPrecision() {
    return this.raw.baseCoinRealPrecision ?? 2;
  }
  get baseCoinIcon() {
    return this.raw.baseCoinIcon;
  }
  get quoteCoinPrecision() {
    return this.raw.quoteCoinPrecision ?? 2;
  }
  get pnlPrecision() {
    return this.raw.pnlPrecision ?? 2;
  }
  get quoteCoinRealPrecision() {
    return this.raw.quoteCoinRealPrecision ?? 2;
  }
  get quoteCoin() {
    return this.raw.quoteCoin;
  }
  get quoteCoinIcon() {
    return this.raw.quoteCoinIcon;
  }
  get lastPrice() {
    return this.raw.lastPrice;
  }

  // === 核心业务行为 ===

  /**
   * Finds the risk tier for a given notional value.
   * This logic was previously in the `findRiskTier` helper.
   * @param notionalValue The absolute position value.
   * @returns The matching RiskTier entity, or undefined if not found.
   */
  getRiskTier(notionalValue: string | number): RiskTier | undefined {
    const tiers = this.riskTierList;
    if (!tiers || tiers.length === 0) return undefined;

    const valueAbs = new BigNumber(notionalValue).abs();
    let previousUpperBound = new BigNumber(0);

    for (const tier of tiers) {
      const currentUpperBound = new BigNumber(tier.positionValueUpperBound || 0);

      // Logic from helper.ts: [previous, current)
      if (previousUpperBound.lte(valueAbs) && valueAbs.lt(currentUpperBound)) {
        return tier;
      }

      previousUpperBound = currentUpperBound;
    }

    return undefined;
  }

  /**
   * 格式化价格 (自动应用 tickSize/priceStep)
   *
   * @param price 价格
   * @param roundMode 取整模式: 'floor' (向下), 'round' (四舍五入), 'ceil' (向上)
   *                  默认为 'round'
   * @returns 价格字符串 (不带千分位，适合输入框回填或API参数)
   */
  formatPrice(
    price: string | number | BigNumber,
    roundMode: "floor" | "round" | "ceil" = "round",
  ): string {
    // 避免在此处进行 toNumber() 转换，尽量传递原始值
    // 但如果 price 是 undefined/null/NaN，需要处理
    if (price === "" || price === null || price === undefined) return "0";
    if (typeof price === "number" && isNaN(price)) return "0";
    if (BigNumber.isBigNumber(price) && price.isNaN()) return "0";

    const pStr = BigNumber.isBigNumber(price) ? price.toFixed() : String(price);

    // 优先使用 priceStep
    if (this.raw.priceStep && Number(this.raw.priceStep) > 0) {
      if (roundMode === "ceil") {
        const step = new BigNumber(this.raw.priceStep);
        return new BigNumber(pStr)
          .div(step)
          .integerValue(BigNumber.ROUND_CEIL)
          .multipliedBy(step)
          .toFixed(this.pricePrecision);
      }

      const isFloor = roundMode === "floor";
      // toTickSizeRoundString accepts string or number
      return toTickSizeRoundString(pStr, this.raw.priceStep, isFloor);
    }

    // 回退到 pricePrecision
    return toPrecisionString(pStr, this.pricePrecision);
  }

  /**
   * 格式化价格用于展示 (带千分位)
   */
  formatPriceFormatted(
    price: string | number | BigNumber,
    roundMode: "floor" | "round" | "ceil" = "round",
  ): string {
    const plainPrice = this.formatPrice(price, roundMode);
    // 使用 toThousandString 进行千分位处理，保持精度不变
    // toThousandString 内部会重新做精度截断，为了避免二次截断导致的意外，
    // 我们这里只用它来做千分位，传入足够大的精度
    // 或者直接利用 split 方式加逗号 (更安全，避免 rounding)
    const parts = plainPrice.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  /**
   * 格式化数量 (自动应用 sizeStep)
   * 默认向下取整 (isFloor=true)，因为数量通常不能超过余额或限制
   */
  formatSize(size: string | number | BigNumber): string {
    // 同上，避免过早 toNumber
    if (size === "" || size === null || size === undefined) return "0";
    const sStr = BigNumber.isBigNumber(size) ? size.toFixed() : String(size);
    return toTickSizeRoundString(sStr, this.raw.sizeStep, true);
  }

  /**
   * 格式化数量用于展示 (带千分位)
   */
  formatSizeFormatted(size: string | number | BigNumber): string {
    const plainSize = this.formatSize(size);
    const parts = plainSize.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  /**
   * 格式化金额/价值 (用于显示 USDT 金额，带千分位)
   */
  formatQuoteValue(value: string | number | BigNumber): string {
    // toThousandString handles BigNumber internally by converting to number in some implementations,
    // but looking at utils, it takes string|number|BigNumber.
    // Ensure we pass a valid input.
    return toThousandString(value, this.quoteCoinPrecision);
  }

  /**
   * 格式化 PnL (盈亏)
   * 使用 pnlPrecision
   */
  formatPnL(value: string | number | BigNumber): string {
    return toThousandString(value, this.pnlPrecision);
  }

  /**
   * 格式化名义价值 (Notional Value)
   * 通常与 Quote Value 逻辑一致，但可能不带千分位
   */
  formatNotionalValue(value: string | number | BigNumber): string {
    return toPrecisionString(value, this.quoteCoinPrecision);
  }

  /**
   * 计算名义价值 (Notional Value = Size * Price)
   */
  calculateNotionalValue(size: string | number, price: string | number): BigNumber {
    return new BigNumber(size).multipliedBy(price);
  }

  /**
   * 获取当前价值对应的最大杠杆
   * 根据 riskTierList 计算
   */
  getMaxLeverage(notionalValue: string | number = 0): string {
    const tiers = this.raw.riskTierList;
    if (!tiers || tiers.length === 0) return this.raw.displayMaxLeverage;

    // 查找符合价值区间的档位
    const val = new BigNumber(notionalValue).abs(); // 价值取绝对值
    for (const tier of tiers) {
      if (val.lte(tier.positionValueUpperBound)) {
        return tier.maxLeverage;
      }
    }
    // 超过最大档位，返回最低杠杆 (通常是最后一个档位)
    return tiers[tiers.length - 1].maxLeverage;
  }

  /**
   * 检查数量是否符合最小下单限制
   */
  isSizeValid(size: string | number): boolean {
    const s = new BigNumber(size);
    return s.gte(this.minOrderSize);
  }

  isZeroFee(metadata: IMetadata, account: AccountInfo) {
    if (!metadata) return false;
    try {
      let takerFeeRate, makerFeeRate;
      if (account) {
        ({ takerFeeRate, makerFeeRate } = Account.fromRaw(account).getEffectiveFeeRate(
          this.contractId,
          metadata,
        ));
      } else {
        const meta = metadata.contractList?.find((i) => i.contractId === this.contractId);
        takerFeeRate = meta?.defaultTakerFeeRate;
        makerFeeRate = meta?.defaultMakerFeeRate;
      }

      return (
        parseFloat(String(takerFeeRate || 0)) === 0 && parseFloat(String(makerFeeRate || 0)) === 0
      );
    } catch (error) {
      return false;
    }
  }
}
