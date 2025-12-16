// Generated TypeScript types from OpenAPI spec

import { ICoin, IContract } from "./metadata.type";

export interface IVerifyEmailParam {
  userId: string;
  token?: string;
}

export interface Result {
  code: string;
  msg: string;
  requestTime: string;
  responseTime: string;
}

export interface IOnboardSiteParam {
  ethAddress?: string;
  email?: string;
  onlySignOn?: string;
  param?: string;
  signature?: string;
  l2Key?: string;
  l2KeyYCoordinate?: string;
  clientAccountId?: string;
}

export interface IOnboardSite {
  user: IUser;
  userPreference: IUserPreference;
  isNewUser: boolean;
}

export interface IUser {
  id: string;
  ethAddress: string;
  nickname: string;
  email: string;
  isEmailVerified: boolean;
  country: string;
  language: string;
  avatarUrl: string;
  avatarBorderUrl: string;
  createdTime: string;
  updatedTime: string;
}

export interface IUserPreference {
  userId: string;
  isSharingEthAddress: boolean;
  isSharingNickname: boolean;
  isEmailNotifyGeneralEnable: boolean;
  isEmailNotifyTradingEnable: boolean;
  isEmailNotifyAccountEnable: boolean;
  isAppNotifyTradingEnable: boolean;
  createdTime: string;
  updatedTime: string;
}

export type IJsonNode = any;

export interface INotifyTxRejectParam {
  tx_id?: number;
  reason_code?: string;
  reason_msg?: string;
  tx?: Record<string, any>;
}

export interface INotifyTxRejectResult {
  alt_txs: IJsonNode[];
}

export interface IForcePushPriceParam {
  contractId?: string;
  price?: string;
}

export interface ICreateWithdrawParam {
  accountId?: string;
  coinId?: string;
  amount?: string;
  ethAddress?: string;
  erc20Address?: string;
  clientWithdrawId?: string;
  riskSignature?: string;
  l2Nonce?: string;
  l2ExpireTime?: string;
  l2Signature?: string;
  extraType?: string;
  extraDataJson?: string;
}

export interface ICreateWithdraw {
  withdrawId: string;
}

export interface IUpdateUserParam {
  nickname?: string;
  email?: string;
  country?: string;
  language?: string;
}

export interface IUpdateUserPreferenceParam {
  isSharingEthAddress?: boolean;
  isSharingNickname?: boolean;
  isEmailNotifyGeneralEnable?: boolean;
  isEmailNotifyTradingEnable?: boolean;
  isEmailNotifyAccountEnable?: boolean;
  isAppNotifyTradingEnable?: boolean;
}

export interface IReadSiteMessageParam {
  messageIdList?: string[];
}

export interface ICreatePushConfig {
  subscriptionId?: string;
  onesignalAppId?: string;
  platform?: string;
  version?: string;
}

export interface ICreateAppScanSecretParam {
  expireTime?: string;
}

export interface ICreateAppScanSecret {
  token: string;
  secret: string;
}

export interface ICreateTransferOutParam {
  accountId?: string;
  coinId?: string;
  amount?: string;
  receiverAccountId?: string;
  receiverL2Key?: string;
  clientTransferId?: string;
  transferReason?: string;
  l2Nonce?: string;
  l2ExpireTime?: string;
  l2Signature?: string;
  extraType?: string;
  extraDataJson?: string;
}

export interface ICreateTransferOut {
  transferOutId: string;
}

export interface IGetMaxCreateOrderSizeParam {
  accountId?: string;
  contractId?: string;
  price?: string;
}

export interface IGetMaxCreateOrderSize {
  maxBuySize: string;
  maxSellSize: string;
  ask1Price: string;
  bid1Price: string;
}

export interface ICreateOrderParam {
  accountId?: string;
  contractId?: string;
  side?: string;
  size?: string;
  price?: string;
  clientOrderId?: string;
  type?: string;
  timeInForce?: string;
  reduceOnly?: boolean;
  triggerPrice?: string;
  triggerPriceType?: string;
  expireTime?: string;
  sourceKey?: string;
  isPositionTpsl?: boolean;
  openTpslParentOrderId?: string;
  isSetOpenTp?: boolean;
  openTp?: IOpenTpSlParam;
  isSetOpenSl?: boolean;
  openSl?: IOpenTpSlParam;
  l2Nonce?: string;
  l2Value?: string;
  l2Size?: string;
  l2LimitFee?: string;
  l2ExpireTime?: string;
  l2Signature?: string;
  extraType?: string;
  extraDataJson?: string;
}

export interface IOpenTpSlParam {
  side?: string;
  price?: string;
  size?: string;
  clientOrderId?: string;
  triggerPrice?: string;
  triggerPriceType?: string;
  expireTime?: string;
  l2Nonce?: string;
  l2Value?: string;
  l2Size?: string;
  l2LimitFee?: string;
  l2ExpireTime?: string;
  l2Signature?: string;
}

export interface ICreateOrder {
  orderId: string;
}

export interface ICancelOrderByIdParam {
  accountId?: string;
  orderIdList: string[];
}

export interface ICancelOrder {
  cancelResultMap: Record<string, any>;
}

export interface ICancelOrderByClientOrderIdParam {
  accountId?: string;
  clientOrderIdList: string[];
}

export interface ICancelOrderByClientOrderId {
  cancelResultMap: Record<string, any>;
}

export interface ICancelAllOrderParam {
  accountId?: string;
  filterCoinIdList?: string[];
  filterContractIdList?: string[];
  filterOrderTypeList?: string[];
  filterOrderStatusList?: string[];
  filterIsPositionTpsl?: boolean[];
}

export interface IRequestRelayerSignAndBroadcastParam {
  deadline?: string;
  r?: string;
  s?: string;
  v?: string;
  type?: string;
  amount?: string;
  owner?: string;
  starkKey?: string;
  positionId?: string;
  chainId?: string;
  mpcSignature?: string;
}

export interface IRequestRelayerSignAndBroadcast {
  success: boolean;
}

export interface ICreateDepositParam {
  accountId?: string;
  coinId?: string;
  amount?: string;
  ethAddress?: string;
  erc20Address?: string;
  clientDepositId?: string;
  l1Tx?: IL1Tx;
  riskSignature?: string;
  l2Key?: string;
  extraType?: string;
  extraDataJson?: string;
}

export interface IL1Tx {
  hash?: string;
  index?: number;
  time?: string;
  blockHeight?: string;
}

export interface ICreateDeposit {
  depositId: string;
}

export interface ICreateNormalWithdrawParam {
  accountId?: string;
  coinId?: string;
  amount?: string;
  ethAddress?: string;
  clientWithdrawId?: string;
  expireTime?: string;
  l2Signature?: string;
}

export interface ICreateNormalWithdraw {
  withdrawId: string;
}

export interface ICreateFastWithdrawRequest {
  accountId?: string;
  coinId?: string;
  amount?: string;
  ethAddress?: string;
  erc20Address?: string;
  lpAccountId?: string;
  clientFastWithdrawId?: string;
  expireTime?: string;
  l2Signature?: string;
  fee?: string;
  factRegistryAddress?: string;
  fact?: string;
  chainId?: string;
}

export interface ICreateFastWithdraw {
  fastWithdrawId: string;
}

export interface ICreateCrossWithdrawParam {
  accountId?: string;
  coinId?: string;
  amount?: string;
  ethAddress?: string;
  erc20Address?: string;
  lpAccountId?: string;
  clientCrossWithdrawId?: string;
  expireTime?: string;
  l2Signature?: string;
  fee?: string;
  chainId?: string;
  mpcAddress?: string;
  mpcSignature?: string;
  mpcSignTime?: string;
}

export interface ICreateCrossWithdraw {
  crossWithdrawId: string;
}

export interface IUpdateLeverageSettingParam {
  accountId?: string;
  contractId?: string;
  leverage?: string;
}

export interface IRegisterAccountParam {
  l2Key?: string;
  l2KeyYCoordinate?: string;
  clientAccountId?: string;
}

export interface IRegisterAccount {
  accountId: string;
}

export interface IGetAppScanSecret {
  secret: string;
}

export interface ICheckUserExist {
  isUserExist: boolean;
}

export interface IGetTickerSummary {
  tickerSummary: ITickerSummary;
}

export interface ITickerSummary {
  period: string;
  trades: string;
  value: string;
  openInterest: string;
}

export interface ITicker {
  contractId: string;
  contractName: string;
  priceChange: string;
  priceChangePercent: string;
  trades: string;
  size: string;
  value: string;
  high: string;
  low: string;
  open: string;
  close: string;
  highTime: string;
  lowTime: string;
  startTime: string;
  endTime: string;
  lastPrice: string;
  indexPrice: string;
  oraclePrice: string;
  openInterest: string;
  fundingRate: string;
  fundingTime: string;
  nextFundingTime: string;
}

export interface IStatDayTrade {
  dayTime: string;
  totalTrades: string;
  totalValue: string;
  createTime: string;
}

export interface IContractMultiKline {
  contractId: string;
  klineList: IKline[];
}

export interface IKline {
  klineId: string;
  contractId: string;
  contractName: string;
  klineType: string;
  klineTime: string;
  priceType: string;
  trades: string;
  size: string;
  value: string;
  high: string;
  low: string;
  open: string;
  close: string;
  makerBuySize: string;
  makerBuyValue: string;
}

export interface IPageDataKline {
  dataList: IKline[];
  nextPageOffsetData: string;
}

export interface IBookOrder {
  price: string;
  size: string;
}

export interface IDepth {
  startVersion: string;
  endVersion: string;
  level: number;
  contractId: string;
  contractName: string;
  asks: IBookOrder[];
  bids: IBookOrder[];
  depthType: string;
}

export interface IOpenInterest {
  contractId: string;
  timestamp: string;
  size: string;
}

export interface IGetServerTime {
  timeMillis: string;
}

export interface IChain {
  chain: string;
  chainId: string;
  chainIconUrl: string;
  contractAddress: string;
  depositGasFeeLess: boolean;
  feeLess: boolean;
  feeRate: string;
  gasLess: boolean;
  gasToken: string;
  minFee: string;
  rpcUrl: string;
  webTxUrl: string;
  withdrawGasFeeLess: boolean;
  tokenList: IMultiChainToken[];
  txConfirm: string;
  blockTime: string;
  allowAaDeposit: boolean;
  allowAaWithdraw: boolean;
  allowDeposit: boolean;
  allowWithdraw: boolean;
  appRpcUrl: string;
}

export interface IGlobal {
  appName: string;
  appEnv: string;
  appOnlySignOn: string;
  feeAccountId: string;
  feeAccountL2Key: string;
  poolAccountId: string;
  poolAccountL2Key: string;
  fastWithdrawAccountId: string;
  fastWithdrawAccountL2Key: string;
  fastWithdrawMaxAmount: string;
  fastWithdrawRegistryAddress: string;
  starkExChainId: string;
  starkExContractAddress: string;
  starkExCollateralCoin: ICoin;
  starkExMaxFundingRate: number;
  starkExOrdersTreeHeight: number;
  starkExPositionsTreeHeight: number;
  starkExFundingValidityPeriod: number;
  starkExPriceValidityPeriod: number;
  maintenanceReason: string;
}

export interface IMultiChain {
  coinId: string;
  maxWithdraw: string;
  minWithdraw: string;
  minDeposit: string;
  chainList: IChain[];
}

export interface IMultiChainToken {
  tokenAddress: string;
  decimals: string;
  iconUrl: string;
  token: string;
  pullOff: boolean;
  withdrawEnable: boolean;
  useFixedRate: boolean;
  fixedRate: string;
}

export interface IIndexPriceConfig {
  contractId: string;
  indexPriceExchangeInfoList: IIndexPriceExchangeInfo[];
}

export interface IIndexPriceExchangeInfo {
  exchangeName: string;
  exchangeQuote: string;
  weight: string;
}

export interface IFundingRate {
  contractId: string;
  fundingTime: string;
  fundingTimestamp: string;
  oraclePrice: string;
  indexPrice: string;
  fundingRate: string;
  isSettlement: boolean;
  forecastFundingRate: string;
  previousFundingRate: string;
  previousFundingTimestamp: string;
  premiumIndex: string;
  avgPremiumIndex: string;
  premiumIndexTimestamp: string;
  impactMarginNotional: string;
  impactAskPrice: string;
  impactBidPrice: string;
  interestRate: string;
  predictedFundingRate: string;
  fundingRateIntervalMin: string;
  starkExFundingIndex: string;
}

export interface IPageDataFundingRate {
  dataList: IFundingRate[];
  nextPageOffsetData: string;
}

export interface IAppUpdate {
  latestVersion: string;
  downloadUrl: string;
  marketUrl: string;
  description: string;
  beForceUpdate: boolean;
  beUpdate: boolean;
}

export interface IGet1inchQuote {
  toAmount: string;
  gas: string;
}

export interface IGetAggregateExchangeData {
  toAmount: string;
  tx: ITxInfo;
}

export interface ITxInfo {
  from: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
}

export interface IL2Signature {
  r: string;
  s: string;
  v: string;
}

export interface IWithdraw {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  ethAddress: string;
  erc20Address: string;
  clientWithdrawId: string;
  riskSignature: IL2Signature;
  l2Nonce: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  extraType: string;
  extraDataJson: string;
  status: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IGetWithdrawAvailableAmount {
  availableAmount: string;
}

export interface IPageDataWithdraw {
  dataList: IWithdraw[];
  nextPageOffsetData: string;
}

export interface IUserInfo {
  user: IUser;
  userPreference: IUserPreference;
}

export interface IPageDataSiteMessage {
  dataList: ISiteMessage[];
  nextPageOffsetData: string;
}

export interface ISiteMessage {
  id: string;
  userId: string;
  businessType: string;
  notifyCategory: number;
  title: string;
  content: string;
  webJumpUrl: string;
  androidJumpUrl: string;
  iosJumpUrl: string;
  isRead: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface IFaucetCoinClaim {
  id: string;
  userId: string;
  ethAddress: string;
  faucetAddress: string;
  status: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataFaucetCoinClaim {
  dataList: IFaucetCoinClaim[];
  nextPageOffsetData: string;
}

export interface IClaimFaucetCoin {
  isSuccess: boolean;
  nextClaimTime: string;
}

export interface ICheckUserNicknameExist {
  isNicknameExist: boolean;
}

export interface ITransferOut {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  receiverAccountId: string;
  receiverL2Key: string;
  clientTransferId: string;
  isConditionTransfer: boolean;
  conditionFactRegistryAddress: string;
  conditionFactErc20Address: string;
  conditionFactAmount: string;
  conditionFact: string;
  transferReason: string;
  l2Nonce: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  extraType: string;
  extraDataJson: string;
  status: string;
  receiverTransferInId: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IGetTransferAvailableAmount {
  availableAmount: string;
}

export interface ITransferIn {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  senderAccountId: string;
  senderL2Key: string;
  senderTransferOutId: string;
  clientTransferId: string;
  isConditionTransfer: boolean;
  conditionFactRegistryAddress: string;
  conditionFactErc20Address: string;
  conditionFactAmount: string;
  conditionFact: string;
  transferReason: string;
  extraType: string;
  extraDataJson: string;
  status: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataTransferOut {
  dataList: ITransferOut[];
  nextPageOffsetData: string;
}

export interface IPageDataTransferIn {
  dataList: ITransferIn[];
  nextPageOffsetData: string;
}

export interface IOpenTpSl {
  side: string;
  price: string;
  size: string;
  clientOrderId: string;
  triggerPrice: string;
  triggerPriceType: string;
  expireTime: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
}

export interface IOrder {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  side: string;
  price: string;
  size: string;
  clientOrderId: string;
  type: string;
  timeInForce: string;
  reduceOnly: boolean;
  triggerPrice: string;
  triggerPriceType: string;
  expireTime: string;
  sourceKey: string;
  isPositionTpsl: boolean;
  isLiquidate: boolean;
  isDeleverage: boolean;
  openTpslParentOrderId: string;
  isSetOpenTp: boolean;
  openTp: IOpenTpSl;
  isSetOpenSl: boolean;
  openSl: IOpenTpSl;
  isWithoutMatch: boolean;
  withoutMatchFillSize: string;
  withoutMatchFillValue: string;
  withoutMatchPeerAccountId: string;
  withoutMatchPeerOrderId: string;
  maxLeverage: string;
  takerFeeRate: string;
  makerFeeRate: string;
  liquidateFeeRate: string;
  marketLimitPrice: string;
  marketLimitValue: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  extraType: string;
  extraDataJson: string;
  status: string;
  matchSequenceId: string;
  triggerTime: string;
  triggerPriceTime: string;
  triggerPriceValue: string;
  cancelReason: string;
  cumFillSize: string;
  cumFillValue: string;
  cumFillFee: string;
  maxFillPrice: string;
  minFillPrice: string;
  cumLiquidateFee: string;
  cumRealizePnl: string;
  cumMatchSize: string;
  cumMatchValue: string;
  cumMatchFee: string;
  cumFailSize: string;
  cumFailValue: string;
  cumFailFee: string;
  cumApprovedSize: string;
  cumApprovedValue: string;
  cumApprovedFee: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataOrder {
  dataList: IOrder[];
  nextPageOffsetData: string;
}

export interface IOrderFillTransaction {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  orderId: string;
  orderSide: string;
  fillSize: string;
  fillValue: string;
  fillFee: string;
  fillPrice: string;
  liquidateFee: string;
  realizePnl: string;
  direction: string;
  isPositionTpsl: boolean;
  isLiquidate: boolean;
  isDeleverage: boolean;
  isWithoutMatch: boolean;
  matchSequenceId: string;
  matchIndex: number;
  matchTime: string;
  matchAccountId: string;
  matchOrderId: string;
  matchFillId: string;
  positionTransactionId: string;
  collateralTransactionId: string;
  extraType: string;
  extraDataJson: string;
  censorStatus: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataOrderFillTransaction {
  dataList: IOrderFillTransaction[];
  nextPageOffsetData: string;
}

export interface IDeposit {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  ethAddress: string;
  erc20Address: string;
  clientDepositId: string;
  l1Tx: IL1Tx;
  riskSignature: IL2Signature;
  l2Key: string;
  extraType: string;
  extraDataJson: string;
  status: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataDeposit {
  dataList: IDeposit[];
  nextPageOffsetData: string;
}

export interface IGetNormalWithdrawableAmount {
  amount: string;
}

export interface INormalWithdraw {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  ethAddress: string;
  clientWithdrawId: string;
  l2Nonce: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  status: string;
  tradeWithdrawId: string;
  riskSignature: IL2Signature;
  l1ConfirmedTx: IL1Tx;
  l1ConfirmedTime: string;
  l1CompletedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IGetFastWithdrawSignInfo {
  lpAccountId: string;
  fastWithdrawL2Key: string;
  fastWithdrawFactRegisterAddress: string;
  fastWithdrawMaxAmount: string;
  fee: string;
}

export interface IFastWithdraw {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  ethAddress: string;
  erc20Address: string;
  lpAccountId: string;
  lpAccountL2Key: string;
  clientFastWithdrawId: string;
  fee: string;
  chainId: string;
  l2Nonce: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  extraType: string;
  extraDataJson: string;
  factRegistryAddress: string;
  fact: string;
  status: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2HandleTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l1ConfirmedTx: IL1Tx;
  l1ConfirmedTime: string;
  l1CompletedTime: string;
  l1RejectedReasonCode: string;
  l1RejectedReasonMsg: string;
  riskSignature: IL2Signature;
  transferOutId: string;
  createdTime: string;
  updatedTime: string;
}

export interface IGetCrossWithdrawSignInfo {
  lpAccountId: string;
  crossWithdrawL2Key: string;
  crossWithdrawMaxAmount: string;
  fee: string;
}

export interface ICrossWithdraw {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  ethAddress: string;
  erc20Address: string;
  lpAccountId: string;
  lpAccountL2Key: string;
  clientCrossWithdrawId: string;
  fee: string;
  chainId: string;
  l2Nonce: string;
  l2ExpireTime: string;
  l2Signature: IL2Signature;
  extraType: string;
  extraDataJson: string;
  status: string;
  collateralTransactionId: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2HandleTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l1ConfirmedTx: IL1Tx;
  l1ConfirmedTime: string;
  l1CompletedTx: IL1Tx;
  l1CompletedEthAddress: string;
  l1CompletedTime: string;
  l1RejectedReasonCode: string;
  l1RejectedReasonMsg: string;
  riskSignature: IL2Signature;
  transferOutId: string;
  createdTime: string;
  updatedTime: string;
}

export interface IGetCoinRate {
  rate: string;
}

export interface IAssetOrder {
  orderId: string;
  time: string;
  type: string;
  status: number;
  amount: string;
  fee: string;
  txId: string;
  chain: string;
  address: string;
  coin: string;
  chainId: string;
  transferSenderAccountId: string;
  transferReceiverAccountId: string;
}

export interface IPageDataAssetOrder {
  dataList: IAssetOrder[];
  nextPageOffsetData: string;
}

export interface IPageDataPositionTransaction {
  dataList: IPositionTransaction[];
  nextPageOffsetData: string;
}

export interface IPositionTransaction {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  type: string;
  deltaOpenSize: string;
  deltaOpenValue: string;
  deltaOpenFee: string;
  deltaFundingFee: string;
  beforeOpenSize: string;
  beforeOpenValue: string;
  beforeOpenFee: string;
  beforeFundingFee: string;
  fillCloseSize: string;
  fillCloseValue: string;
  fillCloseFee: string;
  fillOpenSize: string;
  fillOpenValue: string;
  fillOpenFee: string;
  fillPrice: string;
  liquidateFee: string;
  realizePnl: string;
  isLiquidate: boolean;
  isDeleverage: boolean;
  fundingTime: string;
  fundingRate: string;
  fundingIndexPrice: string;
  fundingOraclePrice: string;
  fundingPositionSize: string;
  orderId: string;
  orderFillTransactionId: string;
  collateralTransactionId: string;
  forceTradeId: string;
  extraType: string;
  extraDataJson: string;
  censorStatus: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataPositionTerm {
  dataList: IPositionTerm[];
  nextPageOffsetData: string;
}

export interface IPositionTerm {
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  termCount: number;
  cumOpenSize: string;
  cumOpenValue: string;
  cumOpenFee: string;
  cumCloseSize: string;
  cumCloseValue: string;
  cumCloseFee: string;
  cumFundingFee: string;
  cumLiquidateFee: string;
  createdTime: string;
  updatedTime: string;
  currentLeverage: string;
}

export interface IPosition {
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  openSize: string;
  openValue: string;
  openFee: string;
  fundingFee: string;
  longTermCount: number;
  longTermStat: IPositionStat;
  longTermCreatedTime: string;
  longTermUpdatedTime: string;
  shortTermCount: number;
  shortTermStat: IPositionStat;
  shortTermCreatedTime: string;
  shortTermUpdatedTime: string;
  longTotalStat: IPositionStat;
  shortTotalStat: IPositionStat;
  createdTime: string;
  updatedTime: string;
}

export interface IPositionStat {
  cumOpenSize: string;
  cumOpenValue: string;
  cumOpenFee: string;
  cumCloseSize: string;
  cumCloseValue: string;
  cumCloseFee: string;
  cumFundingFee: string;
  cumLiquidateFee: string;
}

export interface ICollateralTransaction {
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  type: string;
  deltaAmount: string;
  deltaLegacyAmount: string;
  beforeAmount: string;
  beforeLegacyAmount: string;
  fillCloseSize: string;
  fillCloseValue: string;
  fillCloseFee: string;
  fillOpenSize: string;
  fillOpenValue: string;
  fillOpenFee: string;
  fillPrice: string;
  liquidateFee: string;
  realizePnl: string;
  isLiquidate: boolean;
  isDeleverage: boolean;
  fundingTime: string;
  fundingRate: string;
  fundingIndexPrice: string;
  fundingOraclePrice: string;
  fundingPositionSize: string;
  depositId: string;
  withdrawId: string;
  transferInId: string;
  transferOutId: string;
  transferReason: string;
  orderId: string;
  orderFillTransactionId: string;
  orderAccountId: string;
  positionContractId: string;
  positionTransactionId: string;
  forceWithdrawId: string;
  forceTradeId: string;
  extraType: string;
  extraDataJson: string;
  censorStatus: string;
  censorTxId: string;
  censorTime: string;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: string;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: string;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataCollateralTransaction {
  dataList: ICollateralTransaction[];
  nextPageOffsetData: string;
}

export interface ICollateral {
  userId: string;
  accountId: string;
  coinId: string;
  amount: string;
  legacyAmount: string;
  cumDepositAmount: string;
  cumWithdrawAmount: string;
  cumTransferInAmount: string;
  cumTransferOutAmount: string;
  cumPositionBuyAmount: string;
  cumPositionSellAmount: string;
  cumFillFeeAmount: string;
  cumFundingFeeAmount: string;
  cumFillFeeIncomeAmount: string;
  createdTime: string;
  updatedTime: string;
}

export interface IAccount {
  id: string;
  userId: string;
  ethAddress: string;
  l2Key: string;
  l2KeyYCoordinate: string;
  clientAccountId: string;
  isSystemAccount: boolean;
  defaultTradeSetting: ITradeSetting;
  contractIdToTradeSetting: Record<string, any>;
  maxLeverageLimit: string;
  createOrderPerMinuteLimit: number;
  createOrderDelayMillis: number;
  extraType: string;
  extraDataJson: string;
  status: string;
  isLiquidating: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface IPageDataAccount {
  dataList: IAccount[];
  nextPageOffsetData: string;
}

export interface ITradeSetting {
  isSetFeeRate: boolean;
  takerFeeRate: string;
  makerFeeRate: string;
  isSetFeeDiscount: boolean;
  takerFeeDiscount: string;
  makerFeeDiscount: string;
  isSetMaxLeverage: boolean;
  maxLeverage: string;
}

export interface IGetAccountDeleverageLight {
  positionContractIdToLightNumberMap: Record<string, any>;
}

export interface ICollateralAsset {
  userId: string;
  accountId: string;
  coinId: string;
  totalEquity: string;
  totalPositionValueAbs: string;
  initialMarginRequirement: string;
  starkExRiskValue: string;
  pendingWithdrawAmount: string;
  pendingTransferOutAmount: string;
  orderFrozenAmount: string;
  availableAmount: string;
}

export interface IGetAccountAsset {
  account: IAccount;
  collateralList: ICollateral[];
  positionList: IPosition[];
  version: string;
  positionAssetList: IPositionAsset[];
  collateralAssetModelList: ICollateralAsset[];
  oraclePriceList: IIndexPrice[];
}

export interface IIndexPrice {
  contractId: string;
  priceType: string;
  priceValue: string;
  createdTime: string;
  oraclePriceSignature: IOraclePriceSignature[];
}

export interface IOraclePriceSignature {
  contractId: string;
  signer: string;
  price: string;
  externalAssetId: string;
  signature: IL2Signature;
  timestamp: string;
}

export interface IPositionAsset {
  userId: string;
  accountId: string;
  coinId: string;
  contractId: string;
  positionValue: string;
  maxLeverage: string;
  initialMarginRequirement: string;
  starkExRiskRate: string;
  starkExRiskValue: string;
  avgEntryPrice: string;
  liquidatePrice: string;
  bankruptPrice: string;
  worstClosePrice: string;
  unrealizePnl: string;
  termRealizePnl: string;
  totalRealizePnl: string;
}

export interface IAccountAssetSnapshot {
  userId: string;
  accountId: string;
  coinId: string;
  timeTag: number;
  snapshotTime: string;
  totalEquity: string;
  termRealizePnl: string;
  unrealizePnl: string;
  totalRealizePnl: string;
}

export interface IPageDataAccountAssetSnapshot {
  dataList: IAccountAssetSnapshot[];
  nextPageOffsetData: string;
}

export interface IGenerateApiCredentialBySignature {
  apiKey: string;
  secret: string;
  passphrase: string;
}

export interface Result_Void_ {
  code: string;
  data: Record<string, any>;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_OnboardSite_ {
  code: string;
  data: IOnboardSite;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateWithdraw_ {
  code: string;
  data: ICreateWithdraw;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateAppScanSecret_ {
  code: string;
  data: ICreateAppScanSecret;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateTransferOut_ {
  code: string;
  data: ICreateTransferOut;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetMaxCreateOrderSize_ {
  code: string;
  data: IGetMaxCreateOrderSize;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateOrder_ {
  code: string;
  data: ICreateOrder;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CancelOrder_ {
  code: string;
  data: ICancelOrder;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CancelOrderByClientOrderId_ {
  code: string;
  data: ICancelOrderByClientOrderId;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_ResultRequestRelayerSignAndBroadcast_ {
  code: string;
  data: IRequestRelayerSignAndBroadcast;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateDeposit_ {
  code: string;
  data: ICreateDeposit;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateNormalWithdraw_ {
  code: string;
  data: ICreateNormalWithdraw;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateFastWithdraw_ {
  code: string;
  data: ICreateFastWithdraw;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CreateCrossWithdraw_ {
  code: string;
  data: ICreateCrossWithdraw;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_RegisterAccount_ {
  code: string;
  data: IRegisterAccount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetAppScanSecret_ {
  code: string;
  data: IGetAppScanSecret;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CheckUserExist_ {
  code: string;
  data: ICheckUserExist;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetTickerSummaryModel_ {
  code: string;
  data: IGetTickerSummary;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Ticker__ {
  code: string;
  data: ITicker[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_StatDayTrade__ {
  code: string;
  data: IStatDayTrade[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_ContractKline__ {
  code: string;
  data: IContractMultiKline[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_Kline__ {
  code: string;
  data: IPageDataKline;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Depth__ {
  code: string;
  data: IDepth[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_OpenInterest__ {
  code: string;
  data: IOpenInterest[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetServerTime_ {
  code: string;
  data: IGetServerTime;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

// export interface Result_MetaData_ {
//   code: string;
//   data: IMetaData;
//   errorParam: Record<string, any>;
//   requestTime: string;
//   responseTime: string;
//   traceId: string;
// }

export interface Result_List_IndexPriceConfig__ {
  code: string;
  data: IIndexPriceConfig[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_FundingRate__ {
  code: string;
  data: IFundingRate[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_FundingRate__ {
  code: string;
  data: IPageDataFundingRate;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_AppUpdate_ {
  code: string;
  data: IAppUpdate;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_Get1inchQuote_ {
  code: string;
  data: IGet1inchQuote;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetAggregateExchangeData_ {
  code: string;
  data: IGetAggregateExchangeData;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Withdraw__ {
  code: string;
  data: IWithdraw[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetWithdrawAvailableAmount_ {
  code: string;
  data: IGetWithdrawAvailableAmount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_Withdraw__ {
  code: string;
  data: IPageDataWithdraw;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_User_ {
  code: string;
  data: IUser;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_UserPreference_ {
  code: string;
  data: IUserPreference;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_UserInfo_ {
  code: string;
  data: IUserInfo;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_SiteMessage__ {
  code: string;
  data: IPageDataSiteMessage;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_FaucetCoinClaim__ {
  code: string;
  data: IPageDataFaucetCoinClaim;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_ClaimFaucetCoin_ {
  code: string;
  data: IClaimFaucetCoin;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_CheckUserNicknameExist_ {
  code: string;
  data: ICheckUserNicknameExist;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_TransferOut__ {
  code: string;
  data: ITransferOut[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetTransferOutAvailableAmount_ {
  code: string;
  data: IGetTransferAvailableAmount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_TransferIn__ {
  code: string;
  data: ITransferIn[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_TransferOut__ {
  code: string;
  data: IPageDataTransferOut;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_TransferIn__ {
  code: string;
  data: IPageDataTransferIn;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Order__ {
  code: string;
  data: IOrder[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_Order__ {
  code: string;
  data: IPageDataOrder;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_OrderFillTransaction__ {
  code: string;
  data: IPageDataOrderFillTransaction;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_OrderFillTransaction__ {
  code: string;
  data: IOrderFillTransaction[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Deposit__ {
  code: string;
  data: IDeposit[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_Deposit__ {
  code: string;
  data: IPageDataDeposit;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetNormalWithdrawableAmount_ {
  code: string;
  data: IGetNormalWithdrawableAmount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_NormalWithdraw__ {
  code: string;
  data: INormalWithdraw[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetFastWithdrawSignInfo_ {
  code: string;
  data: IGetFastWithdrawSignInfo;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_FastWithdraw__ {
  code: string;
  data: IFastWithdraw[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetCrossWithdrawSignInfo_ {
  code: string;
  data: IGetCrossWithdrawSignInfo;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_CrossWithdraw__ {
  code: string;
  data: ICrossWithdraw[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetCoinRate_ {
  code: string;
  data: IGetCoinRate;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_AssetOrder__ {
  code: string;
  data: IPageDataAssetOrder;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_PositionTransaction__ {
  code: string;
  data: IPageDataPositionTransaction;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_PositionTransaction__ {
  code: string;
  data: IPositionTransaction[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_PositionTerm__ {
  code: string;
  data: IPageDataPositionTerm;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Position__ {
  code: string;
  data: IPosition[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_CollateralTransaction__ {
  code: string;
  data: IPageDataCollateralTransaction;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_CollateralTransaction__ {
  code: string;
  data: ICollateralTransaction[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_List_Collateral__ {
  code: string;
  data: ICollateral[];
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_Account__ {
  code: string;
  data: IPageDataAccount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetAccountDeleverageLight_ {
  code: string;
  data: IGetAccountDeleverageLight;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_Account_ {
  code: string;
  data: IAccount;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GetAccountAsset_ {
  code: string;
  data: IGetAccountAsset;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_PageData_AccountAssetSnapshot__ {
  code: string;
  data: IPageDataAccountAssetSnapshot;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

export interface Result_GenerateApiCredentialBySignature_ {
  code: string;
  data: IGenerateApiCredentialBySignature;
  errorParam: Record<string, any>;
  requestTime: string;
  responseTime: string;
  traceId: string;
}

// API Endpoint Types

export interface verifyEmailRequest {
  body: IVerifyEmailParam;
}

export interface verifyEmailResponse {
  data: Result_Void_;
}

export interface onboardSiteRequest {
  body: IOnboardSiteParam;
}

export interface onboardSiteResponse {
  data: Result_OnboardSite_;
}

export interface receiveAlternativeTxRequest {
  body: INotifyTxRejectParam;
}

export interface receiveAlternativeTxResponse {
  data: void;
}

export interface forcePushPriceRequest {
  body: IForcePushPriceParam;
}

export interface forcePushPriceResponse {
  data: Result_Void_;
}

export interface createWithdrawRequest {
  body: ICreateWithdrawParam;
}

export interface createWithdrawResponse {
  data: Result_CreateWithdraw_;
}

export interface updateUserRequest {
  body: IUpdateUserParam;
}

export interface updateUserResponse {
  data: Result_Void_;
}

export interface updateUserPreferenceRequest {
  body: IUpdateUserPreferenceParam;
}

export interface updateUserPreferenceResponse {
  data: Result_Void_;
}

export interface sendEmailVerificationRequest {
  body: void;
}

export interface sendEmailVerificationResponse {
  data: Result_Void_;
}

export interface readSiteMessageRequest {
  body: IReadSiteMessageParam;
}

export interface readSiteMessageResponse {
  data: Result_Void_;
}

export interface createPushConfigRequest {
  body: ICreatePushConfig;
}

export interface createPushConfigResponse {
  data: Result_Void_;
}

export interface createAppScanSecretRequest {
  body: ICreateAppScanSecretParam;
}

export interface createAppScanSecretResponse {
  data: Result_CreateAppScanSecret_;
}

export interface createTransferOutRequest {
  body: ICreateTransferOutParam;
}

export interface createTransferOutResponse {
  data: Result_CreateTransferOut_;
}

export interface getMaxCreateOrderSizeRequest {
  body: IGetMaxCreateOrderSizeParam;
}

export interface getMaxCreateOrderSizeResponse {
  data: Result_GetMaxCreateOrderSize_;
}

export interface createOrderRequest {
  body: ICreateOrderParam;
}

export interface createOrderResponse {
  data: Result_CreateOrder_;
}

export interface cancelOrderByIdRequest {
  body: ICancelOrderByIdParam;
}

export interface cancelOrderByIdResponse {
  data: Result_CancelOrder_;
}

export interface cancelOrderByClientOrderIdRequest {
  body: ICancelOrderByClientOrderIdParam;
}

export interface cancelOrderByClientOrderIdResponse {
  data: Result_CancelOrderByClientOrderId_;
}

export interface cancelAllOrderRequest {
  body: ICancelAllOrderParam;
}

export interface cancelAllOrderResponse {
  data: Result_CancelOrder_;
}

export interface requestRelayerSignAndBroadcastRequest {
  body: IRequestRelayerSignAndBroadcastParam;
}

export interface requestRelayerSignAndBroadcastResponse {
  data: Result_ResultRequestRelayerSignAndBroadcast_;
}

export interface createDepositRequest {
  body: ICreateDepositParam;
}

export interface createDepositResponse {
  data: Result_CreateDeposit_;
}

export interface createNormalWithdrawRequest {
  body: ICreateNormalWithdrawParam;
}

export interface createNormalWithdrawResponse {
  data: Result_CreateNormalWithdraw_;
}

export interface createFastWithdrawRequest {
  body: ICreateFastWithdrawRequest;
}

export interface createFastWithdrawResponse {
  data: Result_CreateFastWithdraw_;
}

export interface createCrossWithdrawRequest {
  body: ICreateCrossWithdrawParam;
}

export interface createCrossWithdrawResponse {
  data: Result_CreateCrossWithdraw_;
}

export interface updateLeverageSettingRequest {
  body: IUpdateLeverageSettingParam;
}

export interface updateLeverageSettingResponse {
  data: Result_Void_;
}

export interface registerAccountRequest {
  body: IRegisterAccountParam;
}

export interface registerAccountResponse {
  data: Result_RegisterAccount_;
}

export interface getAppScanSecretRequest {
  body: void;
}

export interface getAppScanSecretResponse {
  data: Result_GetAppScanSecret_;
}

export interface checkUserExistRequest {
  body: void;
}

export interface checkUserExistResponse {
  data: Result_CheckUserExist_;
}

export interface getTicketSummaryRequest {
  body: void;
}

export interface getTicketSummaryResponse {
  data: Result_GetTickerSummaryModel_;
}

export interface getTickerRequest {
  body: void;
}

export interface getTickerResponse {
  data: Result_List_Ticker__;
}

export interface getStatDayTradeRequest {
  body: void;
}

export interface getStatDayTradeResponse {
  data: Result_List_StatDayTrade__;
}

export interface getMultiContractKlineRequest {
  body: void;
}

export interface getMultiContractKlineResponse {
  data: Result_List_ContractKline__;
}

export interface getKlineRequest {
  body: void;
}

export interface getKlineResponse {
  data: Result_PageData_Kline__;
}

export interface getExchangeLongShortRatioRequest {
  body: void;
}

export interface getExchangeLongShortRatioResponse {
  data: Result_GetTickerSummaryModel_;
}

export interface getDepthRequest {
  body: void;
}

export interface getDepthResponse {
  data: Result_List_Depth__;
}

export interface getAccurateOpenInterestRequest {
  body: void;
}

export interface getAccurateOpenInterestResponse {
  data: Result_List_OpenInterest__;
}

export interface getServerTimeRequest {
  body: void;
}

export interface getServerTimeResponse {
  data: Result_GetServerTime_;
}

export interface getMetaDataRequest {
  body: void;
}

export interface getMetaDataResponse {
  // data: Result_MetaData_;
  data: any;
}

export interface getIndexPriceConfigRequest {
  body: void;
}

export interface getIndexPriceConfigResponse {
  data: Result_List_IndexPriceConfig__;
}

export interface getLatestFundingRateRequest {
  body: void;
}

export interface getLatestFundingRateResponse {
  data: Result_List_FundingRate__;
}

export interface getFundingRatePageRequest {
  body: void;
}

export interface getFundingRatePageResponse {
  data: Result_PageData_FundingRate__;
}

export interface getOrderBookRequest {
  body: void;
}

export interface getOrderBookResponse {
  data: Result_PageData_FundingRate__;
}

export interface getContractsRequest {
  body: void;
}

export interface getContractsResponse {
  data: Result_PageData_FundingRate__;
}

export interface getContractSpecificationsRequest {
  body: void;
}

export interface getContractSpecificationsResponse {
  data: Result_PageData_FundingRate__;
}

export interface getAppUpdateRequest {
  body: void;
}

export interface getAppUpdateResponse {
  data: Result_AppUpdate_;
}

export interface getQuotaRequest {
  body: void;
}

export interface getQuotaResponse {
  data: Result_Get1inchQuote_;
}

export interface getAggregateExchangeDataRequest {
  body: void;
}

export interface getAggregateExchangeDataResponse {
  data: Result_GetAggregateExchangeData_;
}

export interface getWithdrawByIdRequest {
  body: void;
}

export interface getWithdrawByIdResponse {
  data: Result_List_Withdraw__;
}

export interface getWithdrawByClientWithdrawIdRequest {
  body: void;
}

export interface getWithdrawByClientWithdrawIdResponse {
  data: Result_List_Withdraw__;
}

export interface getWithdrawAvailableAmountRequest {
  body: void;
}

export interface getWithdrawAvailableAmountResponse {
  data: Result_GetWithdrawAvailableAmount_;
}

export interface getActiveWithdrawRequest {
  body: void;
}

export interface getActiveWithdrawResponse {
  data: Result_PageData_Withdraw__;
}

export interface getUserByIdRequest {
  body: void;
}

export interface getUserByIdResponse {
  data: Result_User_;
}

export interface getUserPreferenceRequest {
  body: void;
}

export interface getUserPreferenceResponse {
  data: Result_UserPreference_;
}

export interface getUserInfoRequest {
  body: void;
}

export interface getUserInfoResponse {
  data: Result_UserInfo_;
}

export interface getSiteMessagePageRequest {
  body: void;
}

export interface getSiteMessagePageResponse {
  data: Result_PageData_SiteMessage__;
}

export interface getFaucetCoinClaimPageRequest {
  body: void;
}

export interface getFaucetCoinClaimPageResponse {
  data: Result_PageData_FaucetCoinClaim__;
}

export interface claimFaucetCoinRequest {
  body: void;
}

export interface claimFaucetCoinResponse {
  data: Result_ClaimFaucetCoin_;
}

export interface checkUserNicknameExistRequest {
  body: void;
}

export interface checkUserNicknameExistResponse {
  data: Result_CheckUserNicknameExist_;
}

export interface getTransferOutByIdRequest {
  body: void;
}

export interface getTransferOutByIdResponse {
  data: Result_List_TransferOut__;
}

export interface getWithdrawAvailableAmount_1Request {
  body: void;
}

export interface getWithdrawAvailableAmount_1Response {
  data: Result_GetTransferOutAvailableAmount_;
}

export interface getTransferInByIdRequest {
  body: void;
}

export interface getTransferInByIdResponse {
  data: Result_List_TransferIn__;
}

export interface getActiveTransferOutRequest {
  body: void;
}

export interface getActiveTransferOutResponse {
  data: Result_PageData_TransferOut__;
}

export interface getActiveTransferInRequest {
  body: void;
}

export interface getActiveTransferInResponse {
  data: Result_PageData_TransferIn__;
}

export interface getOrderByIdRequest {
  body: void;
}

export interface getOrderByIdResponse {
  data: Result_List_Order__;
}

export interface getOrderByClientOrderIdRequest {
  body: void;
}

export interface getOrderByClientOrderIdResponse {
  data: Result_List_Order__;
}

export interface getHistoryOrderPageRequest {
  body: void;
}

export interface getHistoryOrderPageResponse {
  data: Result_PageData_Order__;
}

export interface getHistoryOrderFillTransactionPageRequest {
  body: void;
}

export interface getHistoryOrderFillTransactionPageResponse {
  data: Result_PageData_OrderFillTransaction__;
}

export interface getHistoryOrderFillTransactionByIdRequest {
  body: void;
}

export interface getHistoryOrderFillTransactionByIdResponse {
  data: Result_List_OrderFillTransaction__;
}

export interface getHistoryOrderByIdRequest {
  body: void;
}

export interface getHistoryOrderByIdResponse {
  data: Result_List_Order__;
}

export interface getHistoryOrderByClientOrderIdRequest {
  body: void;
}

export interface getHistoryOrderByClientOrderIdResponse {
  data: Result_List_Order__;
}

export interface getActiveOrderPageRequest {
  body: void;
}

export interface getActiveOrderPageResponse {
  data: Result_PageData_Order__;
}

export interface getDepositByIdRequest {
  body: void;
}

export interface getDepositByIdResponse {
  data: Result_List_Deposit__;
}

export interface getDepositByClientDepositIdRequest {
  body: void;
}

export interface getDepositByClientDepositIdResponse {
  data: Result_List_Deposit__;
}

export interface getActiveDepositRequest {
  body: void;
}

export interface getActiveDepositResponse {
  data: Result_PageData_Deposit__;
}

export interface getNormalWithdrawableAmountRequest {
  body: void;
}

export interface getNormalWithdrawableAmountResponse {
  data: Result_GetNormalWithdrawableAmount_;
}

export interface getNormalWithdrawByIdRequest {
  body: void;
}

export interface getNormalWithdrawByIdResponse {
  data: Result_List_NormalWithdraw__;
}

export interface getFastWithdrawSignInfoRequest {
  body: void;
}

export interface getFastWithdrawSignInfoResponse {
  data: Result_GetFastWithdrawSignInfo_;
}

export interface getFastWithdrawByIdRequest {
  body: void;
}

export interface getFastWithdrawByIdResponse {
  data: Result_List_FastWithdraw__;
}

export interface getCrossWithdrawSignInfoRequest {
  body: void;
}

export interface getCrossWithdrawSignInfoResponse {
  data: Result_GetCrossWithdrawSignInfo_;
}

export interface getCrossWithdrawByIdRequest {
  body: void;
}

export interface getCrossWithdrawByIdResponse {
  data: Result_List_CrossWithdraw__;
}

export interface getCoinRateRequest {
  body: void;
}

export interface getCoinRateResponse {
  data: Result_GetCoinRate_;
}

export interface getAllOrdersPageRequest {
  body: void;
}

export interface getAllOrdersPageResponse {
  data: Result_PageData_AssetOrder__;
}

export interface getPositionTransactionPageRequest {
  body: void;
}

export interface getPositionTransactionPageResponse {
  data: Result_PageData_PositionTransaction__;
}

export interface getPositionTransactionByIdRequest {
  body: void;
}

export interface getPositionTransactionByIdResponse {
  data: Result_List_PositionTransaction__;
}

export interface getPositionTermPageRequest {
  body: void;
}

export interface getPositionTermPageResponse {
  data: Result_PageData_PositionTerm__;
}

export interface getCollateralByCoinIdRequest {
  body: void;
}

export interface getCollateralByCoinIdResponse {
  data: Result_List_Position__;
}

export interface getCollateralTransactionPageRequest {
  body: void;
}

export interface getCollateralTransactionPageResponse {
  data: Result_PageData_CollateralTransaction__;
}

export interface getCollateralTransactionByIdRequest {
  body: void;
}

export interface getCollateralTransactionByIdResponse {
  data: Result_List_CollateralTransaction__;
}

export interface getCollateralByCoinId_1Request {
  body: void;
}

export interface getCollateralByCoinId_1Response {
  data: Result_List_Collateral__;
}

export interface getAccountPageRequest {
  body: void;
}

export interface getAccountPageResponse {
  data: Result_PageData_Account__;
}

export interface getAccountDeleverageLightRequest {
  body: void;
}

export interface getAccountDeleverageLightResponse {
  data: Result_GetAccountDeleverageLight_;
}

export interface getAccountByIdRequest {
  body: void;
}

export interface getAccountByIdResponse {
  data: Result_Account_;
}

export interface getAccountAssetRequest {
  body: void;
}

export interface getAccountAssetResponse {
  data: Result_GetAccountAsset_;
}

export interface getAccountAssetSnapshotPageRequest {
  body: void;
}

export interface getAccountAssetSnapshotPageResponse {
  data: Result_PageData_AccountAssetSnapshot__;
}

export interface createApiCredentialRequest {
  body: void;
}

export interface createApiCredentialResponse {
  data: Result_GenerateApiCredentialBySignature_;
}
