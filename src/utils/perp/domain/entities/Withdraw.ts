import BigNumber from "bignumber.js";
import type { IWithdraw } from "../../types";
import { ENUM_WITHDRAW_STATUS } from "../constants";

/**
 * 提现实体
 *
 * 封装提现单的状态和业务逻辑
 */
export class Withdraw {
  constructor(public raw: IWithdraw) {}

  static fromRaw(raw: IWithdraw): Withdraw {
    return new Withdraw(raw);
  }

  // ============================================================================
  // 基础属性 Getters
  // ============================================================================

  get id(): string {
    return this.raw.id;
  }

  get userId(): string {
    return this.raw.userId;
  }

  get accountId(): string {
    return this.raw.accountId;
  }

  get coinId(): string {
    return this.raw.coinId;
  }

  get amount(): BigNumber {
    return BigNumber(this.raw.amount);
  }

  get amountStr(): string {
    return this.raw.amount;
  }

  get status(): string {
    return this.raw.status;
  }

  get ethAddress(): string {
    return this.raw.ethAddress;
  }

  get createdTime(): Date {
    return new Date(Number(this.raw.createdTime));
  }

  get updatedTime(): Date {
    return new Date(Number(this.raw.updatedTime));
  }

  // ============================================================================
  // 业务逻辑
  // ============================================================================

  /**
   * 是否处于待审核状态
   * 待审核的提现会计入冻结金额
   */
  isPendingCensoring(): boolean {
    return this.status === ENUM_WITHDRAW_STATUS.PENDING_CENSORING;
  }

  /**
   * 是否已成功（L2 批准）
   */
  isSuccess(): boolean {
    return this.status === ENUM_WITHDRAW_STATUS.SUCCESS_L2_APPROVED;
  }

  /**
   * 是否已失败（终态）
   */
  isFailed(): boolean {
    return (
      this.status === ENUM_WITHDRAW_STATUS.FAILED_CENSOR_FAILURE ||
      this.status === ENUM_WITHDRAW_STATUS.FAILED_L2_REJECT ||
      this.status === ENUM_WITHDRAW_STATUS.FAILED_L2_REJECT_APPROVED
    );
  }

  /**
   * 是否处于处理中（非终态）
   */
  isPending(): boolean {
    return !this.isSuccess() && !this.isFailed();
  }
}
