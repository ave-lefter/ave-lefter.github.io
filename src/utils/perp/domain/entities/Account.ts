import BigNumber from "bignumber.js";
import type { AccountInfo, ContractIdToTradeSetting, DefaultTradeSetting, IMetadata } from "../../types";

/**
 * 账户实体
 *
 * 封装账户基础信息、配置和状态
 */
export class Account {
  constructor(public raw: AccountInfo) {}

  static fromRaw(raw: AccountInfo): Account {
    return new Account(raw);
  }

  // ============================================================================
  // 基础属性 Getters
  // ============================================================================

  get id() {
    return this.raw.id;
  }

  get userId() {
    return this.raw.userId;
  }

  get ethAddress() {
    return this.raw.ethAddress;
  }

  get accountName() {
    return this.raw.accountName;
  }

  get user() {
    return this.raw.user;
  }

  /** L2 公钥 */
  get l2Key() {
    return this.raw.l2Key;
  }

  get l2KeyYCoordinate() {
    return this.raw.l2KeyYCoordinate;
  }

  /** 客户端账户 ID (如 'main') */
  get clientAccountId() {
    return this.raw.clientAccountId;
  }

  get wallet() {
    return this.raw.wallet;
  }

  get walletIcon() {
    return this.raw.walletIcon;
  }

  get smartWalletAddress() {
    return this.raw.smartWalletAddress;
  }

  get extraType() {
    return this.raw.extraType;
  }

  get extraDataJson() {
    return this.raw.extraDataJson;
  }

  get status() {
    return this.raw.status;
  }

  get createdTime() {
    return new Date(Number(this.raw.createdTime));
  }

  get updatedTime() {
    return new Date(Number(this.raw.updatedTime));
  }

  // ============================================================================
  // 状态判断
  // ============================================================================

  /** 是否为系统账户 */
  get isSystemAccount() {
    return this.raw.isSystemAccount;
  }

  /** 是否处于强平中 */
  get isLiquidating() {
    return this.raw.isLiquidating;
  }

  // ============================================================================
  // 配置与限制
  // ============================================================================

  /** 账户最大杠杆限制 */
  get maxLeverageLimit(): string {
    return this.raw.maxLeverageLimit;
  }

  /** 每分钟下单限制 */
  get createOrderPerMinuteLimit(): number {
    return this.raw.createOrderPerMinuteLimit;
  }

  /** 下单延迟 (毫秒) */
  get createOrderDelayMillis(): number {
    return this.raw.createOrderDelayMillis;
  }

  /** 默认交易设置 */
  get defaultTradeSetting(): DefaultTradeSetting {
    return this.raw.defaultTradeSetting;
  }

  /** 合约特定交易设置映射 */
  get contractIdToTradeSetting(): ContractIdToTradeSetting {
    return this.raw.contractIdToTradeSetting;
  }

  /**
   * 获取指定合约的交易设置
   * 优先返回合约特定的设置，如果没有则返回默认设置
   *
   * @param contractId 合约 ID
   */
  getTradeSetting(contractId: string): DefaultTradeSetting {
    if (this.raw.contractIdToTradeSetting && this.raw.contractIdToTradeSetting[contractId]) {
      return this.raw.contractIdToTradeSetting[contractId];
    }
    return this.raw.defaultTradeSetting;
  }

  /**
   * 获取用户偏好设置
   */
  get userPreference() {
    return this.raw.userPreference;
  }

  /**
   * 获取 Keys 配置 (API Key / L2 Key)
   */
  get keys() {
    return this.raw.keys;
  }

  // ============================================================================
  // 业务逻辑 (Configuration Resolution)
  // ============================================================================

  /**
   * 获取有效的 Taker 和 Maker 手续费率
   * 逻辑优先级:
   * 1. 合约特定配置 (如果 isSetFeeRate)
   * 2. 合约特定配置折扣 (如果 isSetFeeDiscount)
   * 3. 账户默认配置 (如果 isSetFeeRate)
   * 4. 账户默认配置折扣 (如果 isSetFeeDiscount)
   * 5. 合约元数据默认值
   */
  getEffectiveFeeRate(contractId: string, metadata: IMetadata): { takerFeeRate: string | undefined; makerFeeRate: string | undefined } {
    const curContractIdToTradeSetting = this.raw.contractIdToTradeSetting?.[contractId];
    const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId);
    const defaultTradeSetting = this.raw.defaultTradeSetting;

    // 1. 账户合约配置 - 直接设置费率
    if (curContractIdToTradeSetting?.isSetFeeRate) {
      return {
        takerFeeRate: curContractIdToTradeSetting?.takerFeeRate,
        makerFeeRate: curContractIdToTradeSetting?.makerFeeRate,
      };
    }

    // 2. 账户合约配置 - 折扣
    if (curContractIdToTradeSetting?.isSetFeeDiscount) {
      return {
        takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || 0)
          .multipliedBy(curContractIdToTradeSetting?.takerFeeDiscount)
          .toString(),
        makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || 0)
          .multipliedBy(curContractIdToTradeSetting?.makerFeeDiscount)
          .toString(),
      };
    }

    // 3. 账户默认配置 - 直接设置费率
    if (defaultTradeSetting?.isSetFeeRate) {
      return {
        takerFeeRate: defaultTradeSetting?.takerFeeRate,
        makerFeeRate: defaultTradeSetting?.makerFeeRate,
      };
    }

    // 4. 账户默认配置 - 折扣
    if (defaultTradeSetting?.isSetFeeDiscount) {
      return {
        takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || 0)
          .multipliedBy(defaultTradeSetting?.takerFeeDiscount)
          .toString(),
        makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || 0)
          .multipliedBy(defaultTradeSetting?.makerFeeDiscount)
          .toString(),
      };
    }

    // 5. 合约配置里的默认配置
    return {
      takerFeeRate: curContractIdToMetadata?.defaultTakerFeeRate,
      makerFeeRate: curContractIdToMetadata?.defaultMakerFeeRate,
    };
  }

  /**
   * 获取有效的最大杠杆
   * 逻辑优先级:
   * 1. 合约特定配置 (如果 isSetMaxLeverage)
   * 2. 账户默认配置 (如果 isSetMaxLeverage)
   * 3. 合约元数据默认值
   */
  getEffectiveMaxLeverage(contractId: string, metadata: IMetadata): number {
    const curContractIdToTradeSetting = this.raw.contractIdToTradeSetting?.[contractId];
    const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId);
    const defaultTradeSetting = this.raw.defaultTradeSetting;

    // 1. 账户合约配置
    if (curContractIdToTradeSetting?.isSetMaxLeverage) {
      return Number(curContractIdToTradeSetting?.maxLeverage);
    }

    // 2. 账户默认配置
    if (defaultTradeSetting?.isSetMaxLeverage) {
      return Number(defaultTradeSetting?.maxLeverage);
    }

    // 3. 合约配置里的默认配置
    return Number(curContractIdToMetadata?.defaultLeverage);
  }
}
