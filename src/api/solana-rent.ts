
// 查询 sol 钱包可关闭账户列表
export function getSolClosableAccounts(walletAddress: string): Promise<Array<{
  tokenAccount: string
  mint: string
  symbol: string
}>> {
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/swap/getSolClosableAccounts', {
    method: 'get',
    query: {
      walletAddress
    }
  })
}

// 查询 sol 关闭单个账户退款数量
export function getSolCloseRefund(): Promise<number> {
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/swap/getSolCloseRefund', {
    method: 'get'
  })
}

// 创建 sol 批量关闭账户交易
export function createSolCloseAccountsTx(data: {
  creatorAddress: string
  // tgUid: string
  closeAccounts: Array<{
    mint: string
    tokenAccount: string
  }>
  source?: string
}): Promise<{
  id: number
  batchId: string
  tokenAddress: string[]
  tokenAccount: string[]
  txHash: string
  txContent: string
  errorLog: string
}> {
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/swap/createSolCloseAccountsTx', {
    method: 'post',
    body: {
      source: 'web',
      ...data
    }
  })
}

// 发送 sol 批量关闭账户交易
export function sendSolCloseAccountsTx(data: {
  id: number
  signature: string
}): Promise<{
  id: number
  batchId: string
  txHash: string
}> {
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/swap/sendSolCloseAccountsTx',{
    method: 'post',
    body: {
      source: 'web',
      ...data
    }
  })
}

// /v2/swap/createSolCloseAccountsTx
// 创建 sol 批量关闭账户交易
export function bot_createSolCloseAccountsTx(data: {
  batchId: string
  creatorAddress: string
  tgUid: string
  closeAccounts: Array<{
    mint: string
    tokenAccount: string
  }>
  source?: string
}): Promise<{
  id: number
  batchId: string
  tokenAddress: string[]
  tokenAccount: string[]
  txHash: string
  errorLog: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/createSolCloseAccountsTx', {
    method: 'post',
    body: {
      source: 'web',
      ...data
    }
  })
}
