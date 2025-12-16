// Type definitions for metadata
export type HexString = string;
export type DecimalString = string;
export type BooleanString = string;

/**
 * StarkEx collateral coin configuration
 */
export interface StarkExCollateralCoin {
  coinId: string;
  coinName: string;
  stepSize: DecimalString;
  showStepSize: DecimalString;
  iconUrl: string;
  starkExAssetId: HexString;
  starkExResolution: HexString;
}

/**
 * Global application configuration
 */
export interface GlobalConfig {
  appName: string;
  appEnv: string;
  appOnlySignOn: string;
  feeAccountId: string;
  feeAccountL2Key: HexString;
  poolAccountId: string;
  poolAccountL2Key: HexString;
  fastWithdrawAccountId: string;
  fastWithdrawAccountL2Key: HexString;
  fastWithdrawMaxAmount: DecimalString;
  fastWithdrawRegistryAddress: HexString;
  transferCoinId: string;
  transferTokenAddress: HexString;
  transferTokenDecimals: number;
  transferLimitEnable: boolean;
  minTransferSize: DecimalString;
  nativeChainId: string;
  starkExChainId: HexString;
  starkExContractAddress: HexString;
  starkExCollateralCoin: StarkExCollateralCoin;
  starkExMaxFundingRate: number;
  starkExOrdersTreeHeight: number;
  starkExPositionsTreeHeight: number;
  starkExFundingValidityPeriod: number;
  starkExPriceValidityPeriod: number;
  vaultRouterAddress: HexString;
  perpVaultAddress: HexString;
  spotVaultAddress: HexString;
  maintenanceReason: string;
}

/**
 * Coin configuration
 */
export interface ICoin {
  coinId: string;
  coinName: string;
  stepSize: DecimalString;
  showStepSize: DecimalString;
  iconUrl: string;
  starkExAssetId: HexString | null;
  starkExResolution: HexString | null;
  open_size_reduce_ratio: string
}

/**
 * Risk tier configuration for contracts
 */
export interface IRiskTier {
  tier: number;
  positionValueUpperBound: DecimalString;
  maxLeverage: DecimalString;
  maintenanceMarginRate: DecimalString;
  starkExRisk: DecimalString;
  starkExUpperBound: DecimalString;
}

/**
 * Contract/Trading pair configuration
 */
export interface IContract {
  contractId: string;
  contractName: string;
  baseCoinId: string;
  quoteCoinId: string;
  tickSize: DecimalString;
  stepSize: DecimalString;
  minOrderSize: DecimalString;
  maxOrderSize: DecimalString;
  maxOrderBuyPriceRatio: DecimalString;
  minOrderSellPriceRatio: DecimalString;
  maxPositionSize: DecimalString;
  maxMarketPositionSize: DecimalString;
  riskTierList: IRiskTier[];
  defaultTakerFeeRate: DecimalString;
  defaultMakerFeeRate: DecimalString;
  defaultLeverage: DecimalString;
  liquidateFeeRate: DecimalString;
  enableTrade: boolean;
  enableDisplay: boolean;
  enableOpenPosition: boolean;
  fundingInterestRate: DecimalString;
  fundingImpactMarginNotional: DecimalString;
  fundingMaxRate: DecimalString;
  fundingMinRate: DecimalString;
  fundingRateIntervalMin: DecimalString;
  displayDigitMerge: string;
  displayMaxLeverage: DecimalString;
  displayMinLeverage: DecimalString;
  displayNewIcon: boolean;
  displayHotIcon: boolean;
  matchServerName: string;
  starkExSyntheticAssetId: HexString;
  starkExResolution: HexString;
  starkExOraclePriceQuorum: HexString;
  starkExOraclePriceSignedAssetId: HexString[];
  starkExOraclePriceSigner: HexString[];
  symbol: string;
  pricePrecision: number;
  priceStep: DecimalString;
  sizePrecision: number;
  sizeStep: DecimalString;
  baseCoin: string;
  baseCoinPrecision: number;
  baseCoinRealPrecision: number;
  baseCoinIcon: string;
  quoteCoinPrecision: number;
  pnlPrecision: number;
  quoteCoinRealPrecision: number;
  quoteCoin: string;
  quoteCoinIcon: string;
  lastPrice?: string;
}

/**
 * Token configuration for blockchain chains
 */
export interface TokenConfig {
  tokenAddress: HexString;
  decimals: DecimalString;
  iconUrl: string;
  token: string;
  pullOff: boolean;
  withdrawEnable: boolean;
  useFixedRate: boolean;
  fixedRate: DecimalString;
  contractAddress: HexString;
  feeRate: DecimalString;
  isDefaultToken?: boolean;
}

/**
 * Blockchain chain configuration
 */
export interface IChainItem {
  chain: string;
  chainId: string;
  chainIconUrl: string;
  contractAddress: HexString;
  depositGasFeeLess: boolean;
  feeLess: boolean;
  feeRate: DecimalString;
  gasLess: boolean;
  gasToken: string;
  minFee: DecimalString;
  rpcUrl: string;
  webTxUrl: string;
  withdrawGasFeeLess: boolean;
  tokenList: TokenConfig[];
  txConfirm: DecimalString;
  blockTime: DecimalString;
  allowAaDeposit: boolean;
  allowAaWithdraw: boolean;
  allowDeposit: boolean;
  allowWithdraw: boolean;
  appRpcUrl: string;
}

/**
 * Multi-chain configuration for deposits and withdrawals
 */
export interface IChainInfo {
  coinId: string;
  maxWithdraw: DecimalString;
  minWithdraw: DecimalString;
  minDeposit: DecimalString;
  chainList: IChainItem[];
}

export interface IMetadata {
  global: GlobalConfig;
  coinList: ICoin[];
  contractList: IContract[];
  multiChain: IChainInfo;
}
