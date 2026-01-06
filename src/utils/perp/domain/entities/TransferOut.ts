import BigNumber from "bignumber.js";
import type { ITransferOut } from "../../types";
import { ENUM_TRANSFER_STATUS } from "../constants";

/**
 * 转出实体
 *
 * 封装转出单的状态和业务逻辑
 */
export class TransferOut {
  constructor(public raw: ITransferOut) {}

  static fromRaw(raw: ITransferOut): TransferOut {
    return new TransferOut(raw);
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

  get receiverAccountId(): string {
    return this.raw.receiverAccountId;
  }

  get transferReason(): string {
    return this.raw.transferReason;
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
   * 是否处于待检查状态
   * 待检查的转出会计入冻结金额
   */
  isPendingChecking(): boolean {
    return this.status === ENUM_TRANSFER_STATUS.PENDING_CHECKING;
  }

  /**
   * 是否处于待审核状态
   * 待审核的转出会计入冻结金额
   */
  isPendingCensoring(): boolean {
    return this.status === ENUM_TRANSFER_STATUS.PENDING_CENSORING;
  }

  /**
   * 是否处于待处理状态（计入冻结金额）
   * 包括：待检查、待审核
   */
  isPendingForFrozen(): boolean {
    return this.isPendingChecking() || this.isPendingCensoring();
  }

  /**
   * 是否已成功（L2 批准）
   */
  isSuccess(): boolean {
    return this.status === ENUM_TRANSFER_STATUS.SUCCESS_L2_APPROVED;
  }

  /**
   * 是否已失败（终态）
   */
  isFailed(): boolean {
    return (
      this.status === ENUM_TRANSFER_STATUS.FAILED_CHECK_INVALID ||
      this.status === ENUM_TRANSFER_STATUS.FAILED_CENSOR_FAILURE ||
      this.status === ENUM_TRANSFER_STATUS.FAILED_L2_REJECT ||
      this.status === ENUM_TRANSFER_STATUS.FAILED_L2_REJECT_APPROVED
    );
  }

  /**
   * 是否处于处理中（非终态）
   */
  isPending(): boolean {
    return !this.isSuccess() && !this.isFailed();
  }
}
