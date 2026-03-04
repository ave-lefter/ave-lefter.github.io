import langs from './json/botLang.json'
import Cookies from 'js-cookie'
import BigNumber from 'bignumber.js'

export function formatBotError(msg: string) {
  const locale = localStorage.language
  if (locale?.includes('zh')) {
    const msgsTimeout = [
      'transaction confirmation on chain timeout',
      'transaction confirmation on chain timeout, please check on solscan',
      'bundle confirmation on chain timeout, please check on solscan',
      'transaction already sent but confirmation on chain timeout',
      'transaction confirmation on chain timeout, please check message hash in tonviewer',
    ]
    if (msgsTimeout?.some?.((i) => msg?.includes?.(i))) {
      return '链上交易确认超时, 自行查看交易状态'
    }
    const timeoutMsgs = ['Limit Swap Time Out', 'auto cancelled due to timeout']
    if (timeoutMsgs?.some?.((i) => new RegExp(i, 'gi').test(msg))) {
      return '限价单时间到期'
    }
    if (new RegExp('auto cancelled due to no token', 'gi').test(msg)) {
      return '在其他订单中, 已卖空该token'
    }
    if (new RegExp('auto cancel when limit sell token out', 'gi').test(msg)) {
      return '在其他订单中, 已卖空该token'
    }
    if (
      new RegExp(
        'Please avoid placing orders with the same amount at similar prices. You can either use a different trade amount, or more than 40% of the price difference from other orders for the same token',
        'gi'
      ).test(msg)
    ) {
      return '请避免以相似的价格下相同数量的订单。您可以使用不同的交易金额，也可以使用相同代币与其他订单差价的40%以上。'
    }
    return (langs as Record<string, string>)?.[msg] || msg
  } else if (locale?.includes('en')) {
    if (msg === 'insufficient balance') {
      return 'Insufficient balance. Keep at least 0.006 SOL after the transaction.'
    }
  }
  return msg
}

export function handleBotError(err: any, notify: any = ElNotification) {
  const msg =
    typeof err === 'string'
      ? err
      : err?.data?.message || err?.message || err?.msg
  notify({ title: 'Error', type: 'error', message: formatBotError(msg) })
}

/** 是否 createTx 接口返回的“接口即失败”项（status/errorMessage/errorLog） */
export function hasCreateTxError(item: any): boolean {
  return item?.status === 'error' || !!item?.errorMessage || !!item?.errorLog
}

/** createTx 项的错误展示文案，优先 errorMessage */
export function getCreateTxErrorMsg(item: any): string {
  return item?.errorMessage || item?.errorLog || 'swap error'
}

export function tgLogin() {
  let url = 'https://t.me/AveSniperBot?start=lg-'
  // const config = useRuntimeConfig()
  // const baseUrl = config?.public?.apiBase as string
  const baseUrl = import.meta.env.VITE_API_BASE
  // test
  if (baseUrl === 'https://api.test.phaetd8l.com') {
    url = 'https://t.me/ave_sniper_bot?start=lg-'
  }

  const domains = [
    'avedex.cc',
    'ave.ai',
    'opencw.online',
    'aveapi.online',
    'avechat.site',
    'aveios.com',
    'aoandroid.cloud',
    'aoh5pc.com',
    'aveaidata.com',
    'aveaiweba.github.io',
    'ave-m-test-7.github.io',
    'ave00.com',
    'pro.ave.ai',
    'pro.avesp.xyz',
    'pro0.ave.ai',
    'pro0.ave.ai',
  ]
  const domain = window.location.hostname
  const index = domains.indexOf(domain) + 1
  let path = '1'
  if (index > 0) {
    path = String(index)
  }
  const pathname = window.location.pathname
  const refCode = Cookies.get('refCode') ? `-${Cookies.get('refCode')}` : ''
  if (pathname?.includes('/token/')) {
    const data = getAddressAndChainFromId(
      pathname?.replace?.('/token/', '')
    )
    const address = data?.address
    let chain = data?.chain
    if (address && chain) {
      chain = chain.slice(0, 2)
      path = path + `-${chain}-${address}` + refCode
    }
  } else {
    path = path + refCode
  }
  url = url + path
  window.open(url)
}


export function formatBotGasTips(gasTipList: Array<{
  chain: string
  mev: boolean
  low: number | string
  average: number | string
  high: number | string
}>, chain: string) {
  const gasTip1 = gasTipList.find((i) => i.chain === chain && i.mev)
  const gasTip2 = gasTipList.find((i) => i.chain === chain && !i.mev)
  let gasTip1List = gasTip1
    ? [gasTip1?.low, gasTip1?.average, gasTip1?.high]
    : []
  gasTip1List = gasTip1List.map((i) => new BigNumber(i).div(10 ** 9).toFixed())
  let gasTip2List = gasTip2
    ? [gasTip2?.low, gasTip2?.average, gasTip2?.high]
    : []
  gasTip2List = gasTip2List.map((i) => new BigNumber(i).div(10 ** 9).toFixed())
  return {
    gasTip1List,
    gasTip2List,
  }
}

