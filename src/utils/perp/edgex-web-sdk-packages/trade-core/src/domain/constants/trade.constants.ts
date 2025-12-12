export const TYPE_Perpetual: readonly ["USDC", "USDT"] = ["USDC", "USDT"];

// 定义触发价格类型
interface TriggerPriceType {
  readonly INDEX_PRICE: "INDEX_PRICE";
  readonly LAST_PRICE: "LAST_PRICE";
  readonly ORACLE_PRICE: "ORACLE_PRICE";
}

export const TYPE_triggerPrice: TriggerPriceType = {
  INDEX_PRICE: "INDEX_PRICE",
  LAST_PRICE: "LAST_PRICE",
  ORACLE_PRICE: "ORACLE_PRICE",
};

// 定义条件触发价格类型映射
interface ConditionTriggerPriceTypeMap {
  [TYPE_triggerPrice.ORACLE_PRICE]: string;
  [TYPE_triggerPrice.INDEX_PRICE]: string;
  [TYPE_triggerPrice.LAST_PRICE]: string;
}

export const conditionTriggerPriceTypeMap: ConditionTriggerPriceTypeMap = {
  [TYPE_triggerPrice.ORACLE_PRICE]: "oraclePrice",
  [TYPE_triggerPrice.INDEX_PRICE]: "indexPrice",
  [TYPE_triggerPrice.LAST_PRICE]: "lastPrice",
};

// 定义订单方向类型
interface OrderSideType {
  BUY: string;
  SELL: string;
}

export const TYPE_orderSide: OrderSideType = {
  BUY: "BUY",
  SELL: "SELL",
  // UNKNOWN_ORDER_SIDE: "UNKNOWN_ORDER_SIDE",
  // UNRECOGNIZED: "UNRECOGNIZED"
};

export const DEFAULT_TXT = "-";

interface TransferStatusType {
  UNKNOWN_TRANSFER_STATUS: string;
  PENDING_CHECKING: string; // 对方账户检查中
  PENDING_CENSORING: string; // 审查验证结果中
  SUCCESS_CENSOR_SUCCESS: string; // 转账成功，钱已到账结算。等待 L2 验证批准中。
  SUCCESS_L2_APPROVED: string; // L2 验证批准通过【终态】
  FAILED_CHECK_INVALID: string; // 转账失败。对方账号异常 (不存在，l2key 不匹配，被禁用等) 【终态】
  FAILED_CENSOR_FAILURE: string; // 转账失败。审查验证数据不正确。【终态】
  FAILED_L2_REJECT: string; // L2 拒绝，已到账的钱要回滚
  FAILED_L2_REJECT_APPROVED: string; // L2 拒绝结果验证批准通过【终态】
}

export const ENUM_TRANSFER_STATUS: TransferStatusType = {
  UNKNOWN_TRANSFER_STATUS: "UNKNOWN_TRANSFER_STATUS",
  PENDING_CHECKING: "PENDING_CHECKING", // 对方账户检查中
  PENDING_CENSORING: "PENDING_CENSORING", // 审查验证结果中
  SUCCESS_CENSOR_SUCCESS: "SUCCESS_CENSOR_SUCCESS", // 转账成功，钱已到账结算。等待 L2 验证批准中。
  SUCCESS_L2_APPROVED: "SUCCESS_L2_APPROVED", // L2 验证批准通过【终态】
  FAILED_CHECK_INVALID: "FAILED_CHECK_INVALID", // 转账失败。对方账号异常 (不存在，l2key 不匹配，被禁用等) 【终态】
  FAILED_CENSOR_FAILURE: "FAILED_CENSOR_FAILURE", // 转账失败。审查验证数据不正确。【终态】
  FAILED_L2_REJECT: "FAILED_L2_REJECT", // L2 拒绝，已到账的钱要回滚
  FAILED_L2_REJECT_APPROVED: "FAILED_L2_REJECT_APPROVED", // L2 拒绝结果验证批准通过【终态】
};

// 定义提现状态类型
interface WithdrawStatusType {
  UNKNOWN_WITHDRAW_STATUS: string; // 未知状态
  PENDING_CENSORING: string; // 审查验证结果中
  SUCCESS_CENSOR_SUCCESS: string; // 提现成功，钱已扣除。等待 L2 验证批准中。
  SUCCESS_L2_APPROVED: string; // L2 验证批准通过【终态】
  FAILED_CENSOR_FAILURE: string; // 审查验证提现数据不正确，已撤销充值请求【终态】
  FAILED_L2_REJECT: string; // L2 拒绝，所有数据回滚。【终态】
  FAILED_L2_REJECT_APPROVED: string; // L2 拒绝结果验证批准通过【终态】
}

export const ENUM_WITHDRAW_STATUS: WithdrawStatusType = {
  UNKNOWN_WITHDRAW_STATUS: "UNKNOWN_WITHDRAW_STATUS", // 未知状态
  PENDING_CENSORING: "PENDING_CENSORING", // 审查验证结果中
  SUCCESS_CENSOR_SUCCESS: "SUCCESS_CENSOR_SUCCESS", // 提现成功，钱已扣除。等待 L2 验证批准中。
  SUCCESS_L2_APPROVED: "SUCCESS_L2_APPROVED", // L2 验证批准通过【终态】
  FAILED_CENSOR_FAILURE: "FAILED_CENSOR_FAILURE", // 审查验证提现数据不正确，已撤销充值请求【终态】
  FAILED_L2_REJECT: "FAILED_L2_REJECT", // L2 拒绝，所有数据回滚。【终态】
  FAILED_L2_REJECT_APPROVED: "FAILED_L2_REJECT_APPROVED", // L2 拒绝结果验证批准通过【终态】
};

export const CONST_conditionalOrderType: readonly string[] = [
  "STOP_MARKET",
  "TAKE_PROFIT_MARKET",
  "STOP_LIMIT",
  "TAKE_PROFIT_LIMIT",
];
