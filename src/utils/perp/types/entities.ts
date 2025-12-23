import { IDeposit, ITransferIn, ITransferOut, IWithdraw } from "./api.types";
import { ITradeHistoryRaw, L2Signature } from "./trade-history.types";

// Basic type aliases
export type BigNumberString = string;
export type TimestampString = string;
export type ID = string;
export type EthAddress = string;

// API Key and L2 Key types
export interface ApiKeyCredentials {
  apiKey: string;
  passphrase: string;
  secret: string;
  [k: string]: any;
}

export interface L2Keypair {
  publicKey: string;
  publicKeyYCoordinate: string;
  privateKey: string;
  [k: string]: any;
}

export interface Keys {
  apiKey: ApiKeyCredentials;
  l2Key: L2Keypair;
  [k: string]: any;
}

// Trade settings
export interface DefaultTradeSetting {
  isSetFeeRate: boolean;
  takerFeeRate: BigNumberString;
  makerFeeRate: BigNumberString;
  isSetFeeDiscount: boolean;
  takerFeeDiscount: BigNumberString;
  makerFeeDiscount: BigNumberString;
  isSetMaxLeverage: boolean;
  maxLeverage: BigNumberString;
}

export type ContractIdToTradeSetting = Record<string, DefaultTradeSetting>;

// User profile and preferences
export interface UserProfile {
  id: ID;
  shortUserId: number;
  ethAddress: EthAddress;
  nickname: string;
  email: string;
  isEmailVerified: boolean;
  country: string;
  language: string;
  avatarUrl: string;
  avatarBorderUrl: string;
  createdTime: TimestampString;
  updatedTime: TimestampString;
}

export interface UserPreference {
  userId: ID;
  isSharingEthAddress: boolean;
  isSharingNickname: boolean;
  isEmailNotifyGeneralEnable: boolean;
  isEmailNotifyTradingEnable: boolean;
  isEmailNotifyAccountEnable: boolean;
  isAppNotifyTradingEnable: boolean;
  createdTime: TimestampString;
  updatedTime: TimestampString;
}

export interface AccountInfo {
  id: ID;
  userId: ID;
  ethAddress: EthAddress;
  accountName: string;
  user: UserProfile;
  l2Key: string;
  l2KeyYCoordinate: string;
  clientAccountId: string;
  isSystemAccount: boolean;
  defaultTradeSetting: DefaultTradeSetting;
  contractIdToTradeSetting: ContractIdToTradeSetting;
  maxLeverageLimit: BigNumberString;
  createOrderPerMinuteLimit: number;
  createOrderDelayMillis: number;
  extraType: string;
  extraDataJson: string;
  status: string;
  isLiquidating: boolean;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  from?: string;
  accountId?: ID;
  keys: Keys;
  wallet: string;
  walletIcon: string;
  userPreference: UserPreference;
  smartWalletAddress: string;
}

// Collateral
export interface CollateralEntry {
  userId: ID;
  accountId: ID;
  coinId: ID;
  amount: BigNumberString;
  legacyAmount: BigNumberString;
  cumDepositAmount: BigNumberString;
  cumWithdrawAmount: BigNumberString;
  cumTransferInAmount: BigNumberString;
  cumTransferOutAmount: BigNumberString;
  cumPositionBuyAmount: BigNumberString;
  cumPositionSellAmount: BigNumberString;
  cumFillFeeAmount: BigNumberString;
  cumFundingFeeAmount: BigNumberString;
  cumFillFeeIncomeAmount: BigNumberString;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  id?: ID;
  from?: string;
}

// Position types
export interface PositionStats {
  cumOpenSize: BigNumberString;
  cumOpenValue: BigNumberString;
  cumOpenFee: BigNumberString;
  cumCloseSize: BigNumberString;
  cumCloseValue: BigNumberString;
  cumCloseFee: BigNumberString;
  cumFundingFee: BigNumberString;
  cumLiquidateFee: BigNumberString;
}

export interface PositionEntry {
  userId: ID;
  accountId: ID;
  coinId: ID;
  contractId: ID;
  openSize: BigNumberString;
  openValue: BigNumberString;
  openFee: BigNumberString;
  fundingFee: BigNumberString;
  longTermCount: number;
  longTermStat: PositionStats;
  longTermCreatedTime: TimestampString;
  longTermUpdatedTime: TimestampString;
  shortTermCount: number;
  shortTermStat: PositionStats;
  shortTermCreatedTime: TimestampString;
  shortTermUpdatedTime: TimestampString;
  longTotalStat: PositionStats;
  shortTotalStat: PositionStats;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  id: ID;
  from?: string;
}

export interface PositionTransactionEntry {
  id: ID;
  userId: ID;
  accountId: ID;
  coinId: ID;
  contractId: ID;
  type: string;
  deltaOpenSize: BigNumberString;
  deltaOpenValue: BigNumberString;
  deltaOpenFee: BigNumberString;
  deltaFundingFee: BigNumberString;
  beforeOpenSize: BigNumberString;
  beforeOpenValue: BigNumberString;
  beforeOpenFee: BigNumberString;
  beforeFundingFee: BigNumberString;
  fillCloseSize: BigNumberString;
  fillCloseValue: BigNumberString;
  fillCloseFee: BigNumberString;
  fillOpenSize: BigNumberString;
  fillOpenValue: BigNumberString;
  fillOpenFee: BigNumberString;
  fillPrice: BigNumberString;
  liquidateFee: BigNumberString;
  realizePnl: BigNumberString;
  isLiquidate: boolean;
  isDeleverage: boolean;
  fundingTime: TimestampString;
  fundingRate: string;
  fundingIndexPrice: string;
  fundingOraclePrice: string;
  fundingPositionSize: string;
  orderId: ID;
  orderFillTransactionId: ID;
  collateralTransactionId: ID;
  forceTradeId: ID;
  extraType: string;
  extraDataJson: string;
  censorStatus: string;
  censorTxId: string;
  censorTime: TimestampString;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: TimestampString;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: TimestampString;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  from?: string;
  [k: string]: string | number | boolean | null | undefined;
}

export interface PositionTermListEntry {
  userId: ID;
  accountId: ID;
  coinId: ID;
  contractId: ID;
  termCount: number;
  cumOpenSize: BigNumberString;
  cumOpenValue: BigNumberString;
  cumOpenFee: BigNumberString;
  cumCloseSize: BigNumberString;
  cumCloseValue: BigNumberString;
  cumCloseFee: BigNumberString;
  cumFundingFee: BigNumberString;
  cumLiquidateFee: BigNumberString;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  currentLeverage: BigNumberString;
  id: ID;
}

// Order types

export interface OpenTpSlOrder {
  side: string;
  price: string;
  size: string;
  clientOrderId: string;
  triggerPrice: string;
  triggerPriceType: string;
  expireTime: TimestampString;
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: TimestampString;
  l2Signature: L2Signature;
}

export interface OrderEntry {
  id: ID;
  userId: ID;
  accountId: ID;
  coinId: ID;
  contractId: ID;
  side: string;
  price: BigNumberString;
  size: BigNumberString;
  clientOrderId: string;
  type: string;
  timeInForce: string;
  reduceOnly: boolean;
  triggerPrice: BigNumberString;
  triggerPriceType: string;
  expireTime: TimestampString;
  sourceKey: string;
  isPositionTpsl: boolean;
  isLiquidate: boolean;
  isDeleverage: boolean;
  openTpslParentOrderId: ID;
  isSetOpenTp: boolean;
  openTp: OpenTpSlOrder;
  isSetOpenSl: boolean;
  openSl: OpenTpSlOrder;
  isWithoutMatch: boolean;
  withoutMatchFillSize: BigNumberString;
  withoutMatchFillValue: BigNumberString;
  withoutMatchPeerAccountId: ID;
  withoutMatchPeerOrderId: ID;
  maxLeverage: BigNumberString;
  takerFeeRate: BigNumberString;
  makerFeeRate: BigNumberString;
  liquidateFeeRate: BigNumberString;
  marketLimitPrice: BigNumberString;
  marketLimitValue: BigNumberString;
  l2Nonce: string;
  l2Value: BigNumberString;
  l2Size: BigNumberString;
  l2LimitFee: BigNumberString;
  l2ExpireTime: TimestampString;
  l2Signature: L2Signature;
  extraType: string;
  extraDataJson: string;
  status: string;
  matchSequenceId: string;
  triggerTime: TimestampString;
  triggerPriceTime: TimestampString;
  triggerPriceValue: BigNumberString;
  cancelReason: string;
  cumFillSize: BigNumberString;
  cumFillValue: BigNumberString;
  cumFillFee: BigNumberString;
  maxFillPrice: BigNumberString;
  minFillPrice: BigNumberString;
  cumLiquidateFee: BigNumberString;
  cumRealizePnl: BigNumberString;
  cumMatchSize: BigNumberString;
  cumMatchValue: BigNumberString;
  cumMatchFee: BigNumberString;
  cumFailSize: BigNumberString;
  cumFailValue: BigNumberString;
  cumFailFee: BigNumberString;
  cumApprovedSize: BigNumberString;
  cumApprovedValue: BigNumberString;
  cumApprovedFee: BigNumberString;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  from?: string;
}

export interface OrderFillTransactionEntry {
  id: ID;
  userId: ID;
  accountId: ID;
  coinId: ID;
  contractId: ID;
  orderId: ID;
  orderSide: string;
  fillSize: BigNumberString;
  fillValue: BigNumberString;
  fillFee: BigNumberString;
  fillPrice: BigNumberString;
  liquidateFee: BigNumberString;
  realizePnl: BigNumberString;
  direction: string;
  isPositionTpsl: boolean;
  isLiquidate: boolean;
  isDeleverage: boolean;
  isWithoutMatch: boolean;
  matchSequenceId: string;
  matchIndex: number;
  matchTime: TimestampString;
  matchAccountId: ID;
  matchOrderId: ID;
  matchFillId: string;
  positionTransactionId: ID;
  collateralTransactionId: ID;
  extraType: string;
  extraDataJson: string;
  censorStatus: string;
  censorTxId: string;
  censorTime: TimestampString;
  censorFailCode: string;
  censorFailReason: string;
  l2TxId: string;
  l2RejectTime: TimestampString;
  l2RejectCode: string;
  l2RejectReason: string;
  l2ApprovedTime: TimestampString;
  createdTime: TimestampString;
  updatedTime: TimestampString;
  from?: string;
}

// Main user snapshot type
export interface UserSnapshot {
  isBound: boolean;
  remember: boolean;
  currentActiveAccount: AccountInfo | null;
  currentClientAccountId: string;
  account: AccountInfo[];
  collateral: CollateralEntry[];
  position: PositionEntry[];
  positionTransaction: PositionTransactionEntry[];
  positionTermList: PositionTermListEntry[];
  deposit: IDeposit[];
  withdraw: IWithdraw[];
  transferIn: ITransferIn[];
  transferOut: ITransferOut[];
  order: OrderEntry[];
  orderFillTransaction: OrderFillTransactionEntry[];
  tradeHistory: ITradeHistoryRaw[];
  fastWithdraw: any[];
  keys: Record<string, Record<string, { apiKey: ApiKeyCredentials; l2Key: L2Keypair }>>;
  taskWin: number;
  currentContractId: string;
  currentSymbolId: string;
  netline: any;
  mycode: string;
  customCode: string;
  isPasswordSet: boolean;
  isPasswordEnabled: boolean;
}

// { price: "143.21", size: "19.7" },
export type IDepthOrder = {
  price: string;
  size: string;
};

export type DepthEntry = {
  startVersion: string;
  endVersion: string;
  level: number;
  contractId: string;
  contractName: string;
  asks: IDepthOrder[];
  bids: IDepthOrder[];
  depthType: string;
};

export type TradeEntry = {
  ticketId: string;
  time: string;
  price: string;
  size: string;
  value: string;
  takerOrderId: string;
  makerOrderId: string;
  takerAccountId: string;
  makerAccountId: string;
  contractId: string;
  contractName: string;
  isBestMatch: boolean;
  isBuyerMaker: boolean;
};

export type TickerEntry = {
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
  bestAskPrice?: string;
  bestBidPrice?: string;
};

export type KlineEntry = {
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
};

export type OrderUpdateData = {
  account: AccountInfo[];
  collateral: CollateralEntry[];
  collateralTransaction: unknown[];
  position: PositionEntry[];
  positionTransaction: PositionTransactionEntry[];
  deposit: unknown[];
  withdraw: unknown[];
  transferIn: unknown[];
  transferOut: unknown[];
  order: OrderEntry[];
  orderFillTransaction: OrderFillTransactionEntry[];
  forceWithdrawList: unknown[];
  forceTradeList: unknown[];
  oraclePriceList: unknown[];
  positionTermList: PositionTermListEntry[];
};

export type OrderUpdateMessage = {
  type: "trade-event";
  content: {
    event: "ORDER_UPDATE";
    version: number;
    data: OrderUpdateData;
    time: number;
    accountId: number;
  };
};

export type AccountSnapshotData = {
  account: AccountInfo[];
  collateral: CollateralEntry[];
  position: PositionEntry[];
  order: OrderEntry[];
  withdraw?: any[];
  transferOut?: any[];
};

export type AccountSnapshotMessage = {
  type: "trade-event";
  content: {
    event: "Snapshot";
    version: number;
    data: AccountSnapshotData;
    time: number;
    accountId: number;
  };
};
