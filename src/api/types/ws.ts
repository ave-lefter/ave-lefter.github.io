export interface IPriceV2Response {
  event: string;
  prices: {
    chain: string;
    pair: string;
    is_main_pair: boolean;
    target_token: string;
    base_token: string;
    uprice: number;
    last_price: number;
    reserve0: string;
    reserve1: string;
    tvl: number;
    price_change: string;
    volume_24_u: number;
    direction: string;
    time: number;
    volume_u_24h: number;
    change: number;
    token: string;
  }[];
}

export interface IAssetResponse {
  client_address: string;
  event: string;
  swap?: {
    type: '0' | '1';
    chain: string;
    token: string;
    token_name: string;
    logo_url: string;
    time: number;
    rule_id: number;
    amount: string;
    amm: string;
    eth_price: string;
    price: string;
  };
  transfer?: {
    type: string;
    chain: string;
    token: string;
    token_name: string;
    logo_url: string;
    time: number;
    rule_id: number;
    amount: string;
    address: string;
  };
}

export interface IPumpResponse {
  amm: string;
  chain: string;
  pair: {
    amm: string;
    chain: string;
    current_price_usd: number;
    market_cap: number;
    pair: string;
    reserve0: number;
    reserve1: number;
    slot: number;
    tag: string;
    target_token: string;
    token0_address: string;
    token0_decimal: number;
    token0_price_usd: number;
    token0_symbol: string;
    token1_address: string;
    token1_decimal: number;
    token1_price_usd: number;
    token1_symbol: string;
    total: number;
    tvl: number;
  };
  pump_pair_address: string;
  state: string;
  time: number;
}

export interface ITGBotResponse {
  batchId:          string;
  chain:            string;
  followAddress:    string;
  followBuyType:    number;
  followOrderId:    number;
  followSellType:   number;
  inAmount:         string;
  inTokenAddress:   string;
  inTokenDecimals:  number;
  inTokenName:      string;
  inTokenSymbol:    string;
  limitPrice:       string;
  msgId:            number;
  outTokenAddress:  string;
  outTokenDecimals: number;
  outTokenName:     string;
  outTokenSymbol:   string;
  swapType:         number;
  tgUid:            string;
  txList:           TxList[];
}

export interface TxList {
  createPrice:   string;
  failMessage:   string;
  fromAmount:    string;
  orderPrice:    string;
  outputAmount:  string;
  price:         number;
  profit:        string;
  success:       boolean;
  swapType:      number;
  txHash:        string;
  walletAddress: string;
  walletName:    string;
}