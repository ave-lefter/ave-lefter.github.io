

interface CopyTradeParams {
  tgUid: string
  chain: string
  creatorAddress: string // 用户钱包地址
  buyType: number // 最大金额买入
  sellType: number // 止盈止损卖
  followAddress: string // 聪明钱地址
  takeProfitRatio: number // 涨50%卖出
  stopLossRatio: number // 跌15%卖出
  buyAmount: string // 固定金额时为买入数量，最大跟买时为最大买入数量。solana单位为lamports；evm单位为wei
  priorityFee: string // solana为优先费，单位为lamports；evm为额外gas，单位为wei
  isPrivate: false // 不开启防夹保护
  slippage: number // 滑点10%
  autoGas: number // 关闭自动gas
  autoSlippage: false //使用自动滑点
  maxBuyRatio: number //最大买入时, 买入比例，单位bps，100%时为10000
  buyOnce: true //每个代币只买一次
  source: string //枚举 web, app,不传的话默认 app

  maxBuyValue: string // 跟单目标最大买入金额usd，大于此金额不跟买
  minBuyValue: string // 跟单目标最小买入金额usd, 小于此金额不跟买
  maxMarketCap: string // 买入代币的最大marketcap, 大于此不跟买
  minMarketCap: string // 买入代币的最小marketcap, 小于此不跟买
  maxTokenAge: number // token的最大创建时间, 单位秒，大于此不跟买
  minTokenAge: number // token的最小创建时间，单位秒，小于此不跟买
  enableAt: number // 开始时间点，整点，每天再此后开始跟
  disableAt: number // 结束时间点，整点，每天在此之后不跟
  tokenBlacklist: Array<string> // token黑名单，里面的不跟买
  ignoreHeld: false // 是否跟买已持仓的代币，false是跟买， true不跟买已持仓
}

//创建跟单
export function _createFollowOrder(data: CopyTradeParams) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/createFollowOrder', {
    method: 'POST',
    headers: {
      'ave-platform': 'web'
    },
    body: {
      ...data,
      source: 'web',
    },
  })
}

export interface CopyOrder {
  totalProfitRatioAll: number
  profitRealizedRatioAll: number // 已实现利润率
  profitUnrealizedRatioAll: number // 未实现利润率
  totalProfitAll: string
  profitRealizedAll: string // 已实现利润
  profitUnrealizedAll: string // 未实现利润
  copyList: CopyObj[]
}

export interface CopyObj {
  id: number
  chain: string
  status: string
  createTime: string
  tgUid: string
  evmAddress: string
  creatorAddress: string
  sellType: number
  buyType: number
  followAddress: string
  botHost: string
  lastSwap: string | number // 最后交易时间
  totalTokenCount: number // 交易代币个数
  winToken: number // 盈利代币个数
  lossToken: number // 亏损代币个数
  totalProfit: string // 总利润
  profitRealized: string // 已实现利润
  profitUnrealized: string // 未实现利润
  totalProfitRatio: number // 总利润率
  profitRealizedRatio: number // 已实现利润率
  profitUnrealizedRatio: number // 未实现利润率
  copyHolding: number // 跟单持仓金额USD计
  followName: string
  followIconUrl: string
  isHeart: boolean
  finishTime?: string
}
//查询进行中跟单列表
export function _getFollowingInfo(evmAddress: string): Promise<CopyOrder> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowingInfo', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: {
      evmAddress,
    },
  })
}

//查询已取消跟单列表
export function _getFollowHistory(data: {
  pageSize: number
  pageNo: number
  evmAddress: string
}): Promise<CopyObj[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowHistory', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: data,
  })
}
//查询跟单币种
export function _getFollowTokens(data: {
  walletAddress: string
  followAddress: string
  chain: string
  id: number
  sortBy: string
  sortOrder: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowTokens', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: data,
  })
}
//查询跟单成功
export function _getSuccessFollowTxs(data: {
  walletAddress: string
  chain: string
  id: number
  pageNo: string
  pageSize: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getSuccessFollowTxs', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: data,
  })
}
//查询跟单失败
export function _getFailFollowTxs(data: {
  walletAddress: string
  chain: string
  id: number
  pageNo: string
  pageSize: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFailFollowTxsV2', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: data,
  })
}

//查询跟单无效
export function _getFilteredFollowTxs(data: {
  walletAddress: string
  chain: string
  id: number
  pageNo: string
  pageSize: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFilteredFollowTxs', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    query: data,
  })
}

//切换跟单状态
export function _toggleFollowOrder(data: { chain: string; followId: number }): Promise<{ status: string}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/toggleFollowOrder', {
    method: 'post',
    headers: {
      'ave-platform': 'web',
    },
    body: data,
  })
}

//取消跟单状态
export function _cancelFollowOrder(data: { chain: string; id: number }): Promise<{ id: string }> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/cancelFollowOrder', {
    method: 'post',
    headers: {
      'ave-platform': 'web',
    },
    body: data,
  })
}
//根据跟单 id 查询跟单详情
export function _getFollowInfoById(data: { chain: string; id: number }): Promise<CopyObj> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowInfoById', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    params: data,
  })
}
//获取跟单信息，用于修改跟单回显
export function _getFollowSwapOrder(data: { chain: string; id: number }): Promise<CopyTradeParams> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowSwapOrder', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    params: data,
  })
}
interface ActiveCopyAddress {

}
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
//查询活跃跟单地址
export async function _getFollowingAddress(evmAddress: string) {
  // await delay(1000* 60) // 👈 延迟
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getFollowingAddress', {
    method: 'get',
    headers: {
      'ave-platform': 'web',
    },
    params: {
      evmAddress,
    },
  })
}
