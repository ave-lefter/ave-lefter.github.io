import BigNumber from "bignumber.js";
import type { CollateralEntry } from "../../types";

/**
 * 抵押物 (资金) 实体
 *
 * 封装单个币种的资产状态
 */
export class Collateral {
  constructor(public raw: CollateralEntry) {}

  static fromRaw(raw: CollateralEntry) {
    return new Collateral(raw);
  }

  get userId() {
    return this.raw.userId;
  }

  get accountId() {
    return this.raw.accountId;
  }

  get coinId() {
    return this.raw.coinId;
  }

  /**
   * 当前余额 (可用 + 占用)
   */
  get amount(): BigNumber {
    return new BigNumber(this.raw.amount);
  }

  /**
   * 余额字符串
   */
  get amountStr(): string {
    return this.raw.amount;
  }

  get legacyAmount() {
    return this.raw.legacyAmount;
  }

  // ============================================================================
  // 累计统计字段 Getters
  // ============================================================================

  /** 累计充值 */
  get cumDepositAmount() {
    return this.raw.cumDepositAmount;
  }

  /** 累计提现 */
  get cumWithdrawAmount() {
    return this.raw.cumWithdrawAmount;
  }

  /** 累计转入 */
  get cumTransferInAmount() {
    return this.raw.cumTransferInAmount;
  }

  /** 累计转出 */
  get cumTransferOutAmount() {
    return this.raw.cumTransferOutAmount;
  }

  /** 累计买入成交金额 (花费) */
  get cumPositionBuyAmount() {
    return this.raw.cumPositionBuyAmount;
  }

  /** 累计卖出成交金额 (获得) */
  get cumPositionSellAmount() {
    return this.raw.cumPositionSellAmount;
  }

  /** 累计交易手续费 */
  get cumFillFeeAmount() {
    return this.raw.cumFillFeeAmount;
  }

  /** 累计资金费用 */
  get cumFundingFeeAmount() {
    return this.raw.cumFundingFeeAmount;
  }

  /** 累计交易手续费收入 (Maker 返佣等) */
  get cumFillFeeIncomeAmount() {
    return this.raw.cumFillFeeIncomeAmount;
  }

  get createdTime() {
    return new Date(Number(this.raw.createdTime));
  }

  get updatedTime() {
    return new Date(Number(this.raw.updatedTime));
  }

  // ============================================================================
  // 业务逻辑
  // ============================================================================

  /**
   * 判断余额是否足够
   * @param requiredAmount 需要的数量
   */
  isSufficient(requiredAmount: string | number | BigNumber): boolean {
    return this.amount.gte(requiredAmount);
  }
}
