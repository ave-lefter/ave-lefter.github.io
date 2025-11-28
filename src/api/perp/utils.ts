import { Contract, getAddress } from 'ethers'
import { usePerpStore } from '~/stores/perp'
import { type ETHWithdrawInput, type CrossWithdrawInput, type TradeOrderParams } from '@edgex-fe/typescript-sdk'
import { perpApi as api } from './request'
import BigNumber from 'bignumber.js'
import type { PerpOrderParams } from './typs'

export const PerpABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function deposit(address token, uint256 amount, uint256 starkKey, uint256 positionId, bytes exchangeData) payable returns (uint256)",
  "function withdraw(uint256 ownerKey, uint256 assetType)"
]

export const allowance = (tokenAddress: string) => {
  const walletStore = useWalletStore()
  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const tokenInfo = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)?.tokenList?.find?.(i => i.tokenAddress === tokenAddress)
  const { _provider } = getProvider(chain)
  const ERC20 = new Contract(tokenAddress, PerpABI, _provider)
  return ERC20.allowance(walletStore.address, tokenInfo?.contractAddress || '')
}

export const approve = async (tokenAddress: string) => {
  const walletStore = useWalletStore()

  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const tokenInfo = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)?.tokenList?.find?.(i => i.tokenAddress === tokenAddress)
  const signer = await getSigner()
  const ERC20 = new Contract(tokenAddress, PerpABI, signer)
  return ERC20.approve.estimateGas(tokenInfo?.contractAddress || '', MAX_UINT_AMOUNT).then(gas => {
    return ERC20.approve(tokenInfo?.contractAddress || '', MAX_UINT_AMOUNT, { gasLimit: (gas * 2n).toString() })
  })
}

export const deposit = async (tokenAddress: string, amount: string) => {
  const walletStore = useWalletStore()
  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const tokenInfo = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)?.tokenList?.find?.(i => i.tokenAddress === tokenAddress)
  const signer = await getSigner()
  const starkKey = '0x' + perpStore.l2KeyPair?.l2PublicKey
  const positionId = perpStore.userInfo?.id
  const ERC20 = new Contract(tokenInfo?.contractAddress || '', PerpABI, signer)
  const exchangeData = '0x'
  return ERC20.deposit.estimateGas(tokenAddress, amount, starkKey, positionId, exchangeData).then(gas => {
    return ERC20.deposit(tokenAddress, amount, starkKey, positionId, exchangeData, { gasLimit: (gas * 2n).toString() })
  })
}


export const withdraw = async (params: { tokenAddress: string; amount: string; chain: string }) => {
  if (Number(params.chain) === 1) {
    return ETHWithdraw(params.amount)
  }
  return crossWithdraw(params)
}

export async function ETHWithdraw(amount: string) {
  const perpStore = usePerpStore()
  const walletStore = useWalletStore()
  const accountId = perpStore.userInfo?.id || ''
  const metaData = perpStore.metadata
  // const tokenInfo = multiChain?.chainList?.find(item => item.chainId === chain_id)?.tokenList?.find?.(i => i.tokenAddress === tokenAddress)
  const coinId = metaData?.multiChain.coinId || '1000'
  // const coinModel = metaData?.coinList?.find(i => i.coinId === coinId)
  // 1. 提现参数
  const withdrawInput: ETHWithdrawInput = {
    accountId: accountId,           // 账户ID
    coinId: coinId,                         // 币种ID (1000 = USDT)
    amount: amount,                        // 提现金额
    ethAddress: getAddress(walletStore.address), // 目标ETH地址
    clientWithdrawId: Date.now().toString(), // 客户端提现ID (唯一)
    expireTime: (Date.now() + 14 * 24 * 60 * 60 * 1000).toString(), // 过期时间 (24小时后)
  }
  const sdk = perpStore.getSdk()
  const { params, headers } = await sdk.generateETHWithdrawParams(withdrawInput, 1)

  console.log('params', params)
  console.log('headers', headers)
  // 2. 发送提现请求
  return api('/api/v1/private/assets/createNormalWithdraw', {
    headers,
    method: 'POST',
    body: params
  })
}

// 获取跨链提现信息
export async function getCrossWithdrawSignInfo(params: {tokenAddress: string; amount: string; chain: string}): Promise<{
  crossWithdrawL2Key: string
  crossWithdrawMaxAmount: string
  fee: string
  lpAccountId: string
}> {
  const { tokenAddress, amount, chain } = params
  return api('/api/v1/private/assets/getCrossWithdrawSignInfo', {
    method: 'get',
    query: {
      chainId: chain,
      amount: amount,
      tokenAddress
    }
  })
}

// 跨链提现
export async function crossWithdraw(data: {tokenAddress: string; amount: string; chain: string}) {
  const perpStore = usePerpStore()
  const walletStore = useWalletStore()
  const accountId = perpStore.userInfo?.id || ''
  const { tokenAddress, amount, chain } = data
  const { crossWithdrawL2Key, crossWithdrawMaxAmount, fee, lpAccountId } = await getCrossWithdrawSignInfo(data)
  if (new BigNumber(amount).gt(crossWithdrawMaxAmount)) {
    throw new Error('超出最大提现额度')
  }
  const crossWithdrawInput: CrossWithdrawInput = {
    accountId: accountId,           // 账户ID
    coinId: '1000',                         // 币种ID (1000 = USDT)
    amount: new BigNumber(amount).minus(new BigNumber(fee)).toFixed(),                        // amount,                         // 提现金额
    ethAddress: getAddress(walletStore.address), // 目标地址
    erc20Address: getAddress(tokenAddress), // ERC20代币合约地址
    lpAccountId: lpAccountId,      // 流动性提供者账户ID
    clientCrossWithdrawId: Date.now().toString(), // 客户端跨链提现ID (唯一)
    expireTime: String(Math.ceil(new Date().getTime() / 3600000) * 3600000 + 14 * 24 * 60 * 60 * 1000), // 过期时间
    fee: fee,                             // 手续费
    chainId: Number(chain),                            // 目标链ID (97 = BSC testnet)
    crossWithdrawL2Key: crossWithdrawL2Key, // 跨链L2密钥
  }
  const networkId = crossWithdrawInput.chainId
  const sdk = perpStore.getSdk()
  const { params, headers } = await sdk.generateCrossWithdrawParams(crossWithdrawInput, networkId)
  console.log('params', params, headers)
  return api('/api/v1/private/assets/createCrossWithdraw', {
    // headers,
    method: 'POST',
    body: params
  })
}

// 创建订单
export async function createOrder(data: PerpOrderParams) {
  const perpStore = usePerpStore()
  const accountId = data?.accountId || perpStore.userInfo?.id || ''
  const contractId = data?.contractId || ''
  const type = data.type
  const tradeParams: TradeOrderParams = {
    ...data,
    price: type === 'LIMIT' ? data.price.toString () : '0', // Market orders pass price as 0
    size: data?.size || '1',                  // 订单数量
    type: type,                // 订单类型: LIMIT | MARKET
    timeInForce: type === 'LIMIT' ? 'GOOD_TIL_CANCEL' : 'IMMEDIATE_OR_CANCEL',
    // reduceOnly: data?.reduceOnly || false,
    // isPositionTpsl: data?.isPositionTpsl || false,        // 是否为止盈止损单
    // isSetOpenTp: data?.isSetOpenTp || false,           // 是否设置开仓止盈
    // isSetOpenSl: data?.isSetOpenSl || false,           // 是否设置开仓止损
    contractId: contractId,       // 合约ID (AVAXUSD)
    side: data?.side,                  // 买卖方向: BUY | SELL
    triggerPrice: data?.triggerPrice || '',             // 触发价格 (条件单)
    triggerPriceType: data?.triggerPriceType || 'LAST_PRICE', // 触发价格类型
    extraType: data?.extraType || '',                // 额外类型
    extraDataJson: data?.extraDataJson || '',            // 额外数据
    accountId: accountId, // 账户ID

  }

  const contractList = perpStore.contractList || []
  const contractInfo = contractList.find(i => i.contractId === contractId)

  const {takerFeeRate, makerFeeRate} = getFeeRate(contractId)
  // 获取合约信息
  const symbolInfo = {
    contractId: data?.contractId || '',
    symbol: contractInfo?.contractName || '',
    contractName: contractInfo?.contractName || '',
    oraclePrice: contractInfo?.oraclePrice || '0',
    tickSize: contractInfo?.tickSize || '0.0001',
    takerFeeRate: takerFeeRate,
    makerFeeRate: makerFeeRate,
  }

  // 链信息
  const chainInfo = {
    chainId: '1',
  }

  // 账户信息
  const accountInfo = {
    accountId: accountId,
  }
  console.log('tradeParams', {
    tradeParams,
    symbolInfo,
    chainInfo,
    accountInfo,
    requestPath: '/api/v1/private/order/createOrder',
    requestMethod: 'POST',
  })
  const sdk = perpStore.getSdk()
  // 生成交易参数和签名
  const { headers, params } = await sdk.generateTradeParams({
    tradeParams,
    symbolInfo,
    chainInfo,
    accountInfo,
    requestPath: '/api/v1/private/order/createOrder',
    requestMethod: 'POST',
  })

  return api('/api/v1/private/order/createOrder', {
    headers,
    method: 'POST',
    body: params
  })
}



