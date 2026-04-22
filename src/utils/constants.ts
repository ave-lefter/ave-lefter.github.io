// import Beep from '@/assets/audio/beep.mp3'
// import Bell from '@/assets/audio/bell.mp3'
// import Ding from '@/assets/audio/ding.wav'
// import Click from '@/assets/audio/click.wav'
import Dog from '@/assets/audio/dog.wav'
import Gun from '@/assets/audio/gun.wav'
// import Pop from '@/assets/audio/pop.wav'
// import Bar from '@/assets/audio/bar.mp3'
import Message from '@/assets/audio/message.wav'
import Bong from '@/assets/audio/bong.mp3'
import Kaching from '@/assets/audio/kaching.mp3'
import Coin from '@/assets/audio/Coin.wav'

import Alipay from '@/assets/audio/Alipay.mp3'
import Boom from '@/assets/audio/Boom.mp3'
import C from '@/assets/audio/C.mp3'
import H from '@/assets/audio/H.mp3'
import Handgun from '@/assets/audio/Handgun.mp3'
import Sonumi from '@/assets/audio/Sonumi.mp3'
import Yes from '@/assets/audio/Yes.mp3'
import Wechat from '@/assets/audio/Wechat.mp3'
import RedPacket from '@/assets/audio/RedPacket.mp3'




export const NATIVE_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const SOLANA_NATIVE_TOKEN = 'So11111111111111111111111111111111111111112'


export function getNativeToken(chain: string) {
  return ({
    solana: 'sol',
    ton: 'TON',
  } as any)[chain] || NATIVE_TOKEN
}

export const BotNativeTokens = ['sol', 'TON', NATIVE_TOKEN]
export const MAIN_COIN: {
  [key: string]: string
} = {
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-eth':
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-bsc':
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-polygon':
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270-polygon',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-heco':
    '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f-heco',
}

export const upColor = ['#12B886']
export const downColor = ['#F6465D']
// WebSocket 事件类型常量
export const WSEventType = {
  KLINE: 'kline',
  SWITCH_MAIN_PAIR_V2: 'switch_main_pair_v2',
  TX: 'tx',
  LIQ: 'liq',
  PRICE: 'price',
  PRICE_NEW: 'price-new',
  PRICE_GAINER: 'price-gainer',
  PRICE_EXTRA: 'price_extra',
  PRICEV2: 'pricev2',
  TGBOT: 'tgbot',
  ASSET: 'asset',
  MONITOR: 'monitor',
  GOLD_SIGNAL: 'gold_signal',
  SIGNALSV2_PUBLIC_MONITOR: 'signalsv2_public_monitor',
  PUBLIC_PORTRAIT: 'public_portrait',
  SIMPLE_TX: 'simple_tx',
  PUMP_MIGRATED: 'pump_migrated'
}
// perp
export const WSPerpHost = 'wss://quote.edgex.exchange'

export const WSPerpEventType = {
  TICKER_ALL_1S: 'ticker.all.1s',
  KLINE: 'kline.LAST_PRICE',
  DEPTH: 'depth',
  TRADES: 'trades',
}

export const MAX_UINT_AMOUNT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

type NumRecord = Record<string, number>
export const MIN_BALANCE: NumRecord = {
  bsc: 0.002,
  arbitrum: 0.001,
  core: 0.01,
  polygon: 0.1,
  oec: 0.0001,
  optimism: 0.001,
  zksync: 0.001,
  eth: 0.005,
  heco: 0.01,
  fsc: 0.01,
  telegramx: 0.01,
  shj: 0.01,
  pego: 0.1,
  pulsechain: 1000,
  opbnb: 0.0008,
  solana: 0.01,
  base: 0.00005,
  linea: 0.0001,
  xlayer: 0.01,
  morph: 0.001,
  berachain: 0.00001,
  sonic: 0.1
}
export const NATIVE_TOKENS = [
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'Am5hwEp5VBqXoeE5pRU47RTW6gYeFQ6ahi1j4ZVVeL2V',

  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  '0x55d398326f99059ff775485246999027b3197955',
  '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
]

export interface IFavDialogEventArgs {
  type: 'confirmSwitchGroup' | 'remark' | 'order' | 'changeFavoriteGroupName'|'removeFavoriteGroup' |'delete' | 'pump_remark_edit',
  tokenId?: string,
  groupId?: string,
}
export const BusEventType = {
  TOP_FAV_CHANGE: 'top-favorite-change',
  FAV_DIALOG: 'fav-dialog',
  // LEFT_DRAG: 'left-drag',
  SCROLL_TO_TOP: 'scroll-to-top',
  TOP_ADD_GROUP: 'top-add-group',
  DEV_TOKENS_TAB: 'dev-tokens-tab',
  PUMP_REMARK_EDIT: 'pump_remark_edit',
  TOKEN_BLACKLIST_CHANGE: 'token-blacklist-change',
  SWAP_COMPLETED: 'swap-completed',
}

export const ProvideType = {
  HOT_TOKENS: 'hot-tokens',
  KLINE_DATE_FILTER: 'kline-date-filter',
}
export const SupportFullDataChain = ['solana', 'bsc','eth','base','xlayer','fsc']
export const SupportMonitorChain = ['solana', 'bsc','eth','base','xlayer']

export const SupportTokenKlineChains = ['juchain', 'arbitrum', 'optimism']
export const SupportTokenKlineLaunchpad = [
  'bsc-four.meme',
  'bsc-flap.sh',
  'bsc-four_agent_meme',
  'bsc-web3.binance.com',
  'solana-dexscreener.com',
  'solana-pump.fun',
  'solana-time.fun',
  'solana-raydium.io',
  'solana-meteora.ag',
  'solana-letsbonk.fun',
  'solana-boop.fun',
  'solana-believe.app',
  'solana-moonshot.com',
  'solana-jup.ag',
  'solana-bags.fm',
  'solana-cooking.city',
]
export const SupportCopyTradeChain = ['solana', 'bsc', 'eth', 'base']

export const defaultPaginationParams = {
  pageNO: 1,
  pageSize: 20,
  loaded: false,
  finished: false,
}

// 设置默认高度，有多个地方需要用到
export const DefaultHeight = {
  TOPLEFT: window.innerHeight / 2,
  KLINE: window.innerHeight / 2
}

export const WSSimpleTxChain = ['core','arbitrum','optimism','avalanche','blast','polygon','alveychain','apchain','bitgert','cronos','cube','cvn','dogechain','drac','dojo','eos','etc','ethg','ftm','tron','aptos','fsc','mantle','mbkv2','eni','abstract','xlayer','chronoschain','marschain','xone','hyperevm','juchain','babylon','berachain','base','aia','eth','bsc','zchains','arbitrumnova','astar','aurora','metachain','b2network','bitlayer','bitonenetwork','boat','bouncebit','callisto','celo','seiv2','qom','cyber','sui','apechain','matchain','slerfchain','morph','gravity','xrpl','hyperliquid','genesys','sonic','nervosutxo','fusion','opbnb','tbc','unichain','mud','merlin','bevm','bitchain','bitrock','depass','ete','ton','solana']


export const BotSettingsArr = [
  {
    value: 's1',
    label: 'P1',
  },
  {
    value: 's2',
    label: 'P2',
  },
  {
    value: 's3',
    label: 'P3',
  }
] as const

export const resolutionMap  = {
  '1S':{
    val:1,
    unit:'s'
  },'1D':{
    val:1,
    unit:'d'
  }, '1W':{
    val:1,
    unit:'w'
  },
  '5S':{
    val:5,
    unit:'s'
  },
  '15S':{
    val:15,
    unit:'s'
  },
  '30S':{
    val:30,
    unit:'s'
  }
} as const

export const audioList = [
  '',
  // 'Beep',
  // 'Bell',
  // 'Ding',
  // 'Click',
  'Dog',
  'Gun',
  // 'Pop',
  // 'Bar',
  'Handgun',
  'Kaching',
  'Yes',
  'Wechat',
  'Alipay',
  'Sonumi',
  'H',
  'C',
  'Boom',

  'Message',
  'Bong',
  'Coin',
  'RedPacket'
] as const
export const audioNameToResource = {
  // Beep,
  // Bell,
  // Ding,
  // Click,
  Dog,
  Gun,
  // Pop,
  // Bar,
  Handgun,
  Kaching,
  Yes,
  Wechat,
  Alipay,
  Sonumi,
  H,
  C,
  Boom,


  Message,
  Bong,
  Coin,
  RedPacket
}

export const SwapType = {
  BUY: 1,
  SELL: 2,
  LIMIT_BUY: 5,
  LIMIT_SELL: 6,
}

export const MarketVersion = 'Ranks_v1'

export const CategoryTabsCacheKey = {
  hot: `hot${MarketVersion}`,
  new: `new${MarketVersion}`,
  gainer: `gainer${MarketVersion}`,
  pump: `pump${MarketVersion}`,
  inclusion: `inclusion${MarketVersion}`,
  binance_alpha: `binance_alpha${MarketVersion}`,
  xstocks:`xstocks${MarketVersion}`,
  volume:`volume${MarketVersion}`,
}

export const holdersTooltip = (t)=>({
  30:t('smart'),
   31:t('kol2'),
   39:t('whale2'),
   19:t('shot'),
   35:t('bad'),
   36:t('bindAddress'),
   34:t('fishing'),
   25:t('dev2'),
   16:t('mouse')
})

export const KOL_KEY = '31'

export const WSEventV2Type = {
  PUMPSTATE: 'pumpstatev2',
  TOKEN_UPDATED: 'token_updated',
  PORTRAIT_STATISTICS:'portrait_statistics',
  TWITTER_MONITOR:'twitter_monitor',
  PUBLIC_TWITTER: 'public_twitter',
  SUB_TOKEN_KLINE_EXTRA: 'sub_token_kline_extra',
  HEARTBEAT: 'heartbeat'
}
