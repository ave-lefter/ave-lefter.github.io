// 抵押品信息列表
export interface Collateral {
  userId: string   // 用户ID
  accountId: string  // 账户ID
  coinId: string                      // 货币ID
  amount: string                      // 抵押品数额
  legacyAmount: string                // 老式记账方式余额字段
  cumDepositAmount: string            // 累计充值数量
  cumWithdrawAmount: string           // 累计提现数量
  cumTransferInAmount: string         // 累计转入数量
  cumTransferOutAmount: string        // 累计转出数量
  cumPositionBuyAmount: string        // 累计仓位买入扣减的抵押品数量
  cumPositionSellAmount: string       // 累计仓位卖出增加的抵押品数量
  cumFillFeeAmount: string            // 累计成交手续费数量
  cumFundingFeeAmount: string         // 累计资金费用数量
  cumFillFeeIncomeAmount: string      // 累计委托单手续费收入数量
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 抵押品变动明细列表
export interface CollateralTransaction {
  id: string                          // 唯一标识
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 货币ID
  type: 'DEPOSIT'                       // 明细类型
  deltaAmount: string                 // 抵押品变动数量
  deltaLegacyAmount: string           // 老式记账方式余额字段变动数量
  beforeAmount: string                // 变动前的抵押品数量
  beforeLegacyAmount: string          // 变动前的老式记账方式余额字段
  fillCloseSize: string               // 成交平仓数量
  fillCloseValue: string              // 成交平仓价值
  fillCloseFee: string                // 成交平仓手续费
  fillOpenSize: string                // 成交开仓数量
  fillOpenValue: string               // 成交开仓价值
  fillOpenFee: string                 // 成交开仓手续费
  fillPrice: string                   // 成交价格
  liquidateFee: string                // 清算费（强平费）
  realizePnl: string                  // 平仓已实现盈亏
  isLiquidate: false                    // 是否是强平成交
  isDeleverage: false                   // 是否是自动减仓成交
  fundingTime: string                 // 资金费率结算时间
  fundingRate: string                 // 资金费率
  fundingIndexPrice: string           // 资金费率相关的指数价格
  fundingOraclePrice: string          // 资金费率相关的预言机价格
  fundingPositionSize: string         // 资金费用结算时仓位大小
  depositId: string                   // 关联的充值单ID
  withdrawId: string                  // 关联的提现单ID
  transferInId: string                // 关联的转账转入单ID
  transferOutId: string               // 关联的转账转出单ID
  transferReason: 'NORMAL'              // 转账原因
  orderFillTransactionId: string      // 关联的委托单成交明细ID
  forceWithdrawId: string             // 关联的强制提现单ID
  forceTradeId: string                // 关联的强制交易单ID
  extraType: string                   // 附加类型
  extraDataJson: string               // 附加数据
  censorStatus: 'CENSOR_SUCCESS'        // 当前审查状态
  censorTxId: string                  // 审查处理序号
  censorTime: string                  // 审查处理时间
  censorFailCode: string              // 审查失败错误码
  censorFailReason: string            // 审查失败原因
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 持仓信息列表
export interface Position {

  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  contractId: string                  // 合约ID
  openSize: string                    // 当前开仓数量（正数为多仓，负数为空仓）
  openValue: string                   // 当前开仓价值
  openFee: string                     // 当前开仓均摊后的手续费
  fundingFee: string                  // 当前仓位均摊后的资金费用
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间

}

// 持仓变动明细列表

export interface PositionTransaction {
  id: string                          // 唯一标识
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  contractId: string                  // 合约ID
  type: 'OPEN_LONG'                     // 明细类型
  deltaOpenSize: string               // 持有数量变动值
  deltaOpenValue: string              // 开仓价值变动值
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 充值单列表
export interface Deposit {
  id: string                          // 充值单ID
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  amount: string                      // 充值数量
  ethAddress: string                  // 充值的ETH地址
  erc20Address: string                // 充值的币种合约地址
  clientDepositId: string             // 客户自定义ID
  l1Tx: {}                              // L1交易信息
  riskSignature: {}                     // 风控签名
  l2Key: string                       // L2上的收款账户key
  extraType: string                   // 附加类型
  extraDataJson: string               // 额外数据
  status: 'SUCCESS_L2_APPROVED'         // 充值单状态
  collateralTransactionId: string     // 关联的抵押品明细ID
  censorTxId: string                  // 审查处理序号
  censorTime: string                  // 审查处理时间
  censorFailCode: string              // 审查失败错误码
  censorFailReason: string            // 审查失败原因
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 提现单列表
export interface Withdraw {
  id: string                          // 提现单ID
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  amount: string                      // 提现数量
  ethAddress: string                  // 提现到的地址
  erc20Address: string                // 提现的币种合约地址
  clientWithdrawId: string            // 客户自定义ID
  riskSignature: {}                     // 风控签名
  l2Nonce: string                     // L2签名nonce
  l2ExpireTime: string                // L2签名过期时间
  l2Signature: {}                       // 提交L2的签名
  extraType: string                   // 附加类型
  extraDataJson: string               // 额外数据
  status: 'SUCCESS_L2_APPROVED'         // 提现单状态
  collateralTransactionId: string     // 关联的抵押品明细ID
  censorTxId: string                  // 审查处理序号
  censorTime: string                  // 审查处理时间
  censorFailCode: string              // 审查失败错误码
  censorFailReason: string            // 审查失败原因
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 转入单列表
export interface TransferIn {
  id: string                          // 转账转入单ID
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  amount: string                      // 转账数量
  senderAccountId: string             // 发款方账户ID
  senderL2Key: string                 // 发款方账户L2 key
  senderTransferOutId: string         // 发款方转账转出单ID
  clientTransferId: string            // 客户自定义ID
  isConditionTransfer: false            // 是否为条件转账
  conditionFactRegistryAddress: string// 条件转账fact注册合约地址
  conditionFactErc20Address: string   // 条件转账fact生成所使用的erc20地址
  conditionFactAmount: string         // 条件转账fact生成所使用的amount
  conditionFact: string               // 条件转账fact
  transferReason: 'NORMAL'              // 转账原因
  extraType: string                   // 附加类型
  extraDataJson: string               // 额外数据
  status: 'SUCCESS_L2_APPROVED'         // 转账状态
  collateralTransactionId: string     // 关联的抵押品明细ID
  censorTxId: string                  // 审查处理序号
  censorTime: string                  // 审查处理时间
  censorFailCode: string              // 审查失败错误码
  censorFailReason: string            // 审查失败原因
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 转出单列表
export interface TransferOut {
  id: string                          // 转账转出单ID
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  amount: string                      // 转账数量
  receiverAccountId: string           // 收款账户ID
  receiverL2Key: string               // 收款账户L2 key
  clientTransferId: string            // 客户自定义ID
  isConditionTransfer: false            // 是否为条件转账
  conditionFactRegistryAddress: string// 条件转账fact注册合约地址
  conditionFactErc20Address: string   // 条件转账fact生成所使用的erc20地址
  conditionFactAmount: string         // 条件转账fact生成所使用的amount
  conditionFact: string               // 条件转账fact
  transferReason: 'NORMAL'              // 转账原因
  l2Nonce: string                     // L2签名nonce
  l2ExpireTime: string                // L2签名过期时间
  l2Signature: {}                       // 提交L2的签名
  extraType: string                   // 附加类型
  extraDataJson: string               // 额外数据
  status: 'SUCCESS_L2_APPROVED' | 'PENDING_CHECKING' | 'PENDING_CENSORING'     // 转账状态
  receiverTransferInId: string        // 收款方转账转入单ID
  collateralTransactionId: string     // 关联的抵押品明细ID
  censorTxId: string                  // 审查处理序号
  censorTime: string                  // 审查处理时间
  censorFailCode: string              // 审查失败错误码
  censorFailReason: string            // 审查失败原因
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

// 委托单列表

export interface Order {
  id: string                          // 委托单ID
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  contractId: string                  // 合约ID
  side: 'BUY' | 'SELL'                        // 买卖方向
  price: string                       // 委托价格
  size: string                        // 委托数量
  clientOrderId: string               // 客户自定义ID
  type: 'LIMIT' | 'MARKET'                                      // 委托单类型
  timeInForce: 'GTC'                    // 委托单执行策略
  reduceOnly: false                     // 是否是只减仓委托
  triggerPrice: string                // 触发价格
  triggerPriceType: 'LAST_PRICE'        // 价格类型
  expireTime: string                  // 过期时间
  sourceKey: string                   // 来源key
  extraType: string                   // 附加类型
  extraDataJson: string               // 附加数据
  status: 'PENDING_NEW' | 'PENDING' | 'OPEN' | 'CANCELING' | 'UNTRIGGERED' | 'FILLED' | 'CANCELED'           // 委托单状态
  cancelReason: 'USER_CANCEL'           // 委托单取消原因
  cumFillSize: string                 // 累计成交数量
  cumFillValue: string                // 累计成交价值
  cumFillFee: string                  // 累计成交手续费
  maxFillPrice: string                // 最高成交价格
  minFillPrice: string                // 最低成交价格
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
  triggerTime: string                 // 触发时间
  cumFailSize: string
  cumMatchSize: string
  isWithoutMatch: boolean
  withoutMatchFillValue: string
  withoutMatchFillSize: string
  marketLimitValue: string
  isPositionTpsl: boolean                 // 是否为仓位止盈止损单
}

// 成交明细列表
export interface OrderFillTransaction {
  id: string                          // 唯一标识
  userId: string                      // 用户ID
  accountId: string                   // 账户ID
  coinId: string                      // 抵押品币种ID
  contractId: string                  // 合约ID
  orderId: string                     // 委托单ID
  orderSide: 'BUY'                      // 买卖方向
  fillSize: string                    // 实际成交数量
  fillValue: string                   // 实际成交价值
  fillFee: string                     // 实际成交费用
  fillPrice: string                   // 成交价格
  liquidateFee: string                // 清算费用
  realizePnl: string                  // 实际已实现盈亏
  direction: 'MAKER'                    // 实际成交方向
  isPositionTpsl: false                 // 是否为仓位止盈止损单
  isLiquidate: false                    // 是否是清算成交
  isDeleverage: false                   // 是否是自动减仓单成交
  isWithoutMatch: false                 // 是否为不经过撮合直接成交的委托单
  matchSequenceId: string             // 撮合处理后的顺序ID
  matchIndex: 0                         // 撮合处理后多次成交的index
  matchTime: string                   // 撮合处理后的时间
  matchAccountId: string              // 成交对手账户ID
  matchOrderId: string                // 成交对手委托单ID
  matchFillId: string                 // 撮合引擎返回的成交ID
  positionTransactionId: string       // 关联的仓位明细ID
  collateralTransactionId: string     // 关联的抵押品明细ID
  extraType: string                   // 附加类型
  extraDataJson: string               // 附加数据
  createdTime: string                 // 创建时间
  updatedTime: string                   // 更新时间
}

