// stores/toke.ts
import {useSessionStorage, useLocalStorage, useWindowSize} from '@vueuse/core'
import { defineStore } from 'pinia'
import type { TokenInfo, TokenInfoExtra } from '~/api/types/token'
import { BigNumber } from 'bignumber.js'
import type { GetTotalHoldersResponse} from '~/api/stats'
import {getTotalHolders} from '~/api/stats'
import { ElMessage } from 'element-plus'
import { DefaultHeight, SupportTokenKlineLaunchpad, SupportTokenKlineChains } from '~/utils/constants'
import { getXType } from '~/api/x'

type Token = {
  chain?: string
  balance?: string
  symbol?: string
  decimals?: number
  address?: string
  price?: number
  logo_url?: string
}

export const useTokenStore = defineStore('token', () => {
  const route = useRoute()
  const tokenInfo = ref<null | TokenInfo>(null)
  const tokenInfoExtra = ref<null | TokenInfoExtra>(null)
  const twitterType = ref<0 | 1 | 2 | 3>(0)
  const { $i18n } = useNuxtApp()
  const globalStore = useGlobalStore()
  const tokenWarningObj = useLocalStorage<Record<string, boolean>>(
    'tokenWarningNotice',
    {}
  )
  const devTokenNum = ref(0)
  const collected = shallowRef(false)
  const loadingToken = shallowRef(false)
  const token = computed(() => tokenInfo.value?.token)
  const pairs = computed(() => tokenInfo.value?.pairs)
  const pairAddress = useSessionStorage('token_pairAddress', '')
  const selectedToken =  useSessionStorage('token_selectedToken', true)
  const pair = computed(() => {
    if (pairAddress.value) {
      return pairs.value?.find(pair => pair.pair === pairAddress.value) || null
    }
    return pairs.value?.[0] || null
  })

  const tokenAllPair = computed(() => {
    const isSupportTokenKlineLaunchpad = SupportTokenKlineLaunchpad?.includes?.(token.value?.chain + '-' + (token.value?.launchpad || ''))
    if (!(SupportTokenKlineChains?.includes?.(token.value?.chain || '') || isSupportTokenKlineLaunchpad)) {
      return null
    }
    const _pairs = tokenInfo.value?.pairs
    const init_reserve = _pairs?.reduce((pre, item) => {
      return new BigNumber(pre || 0).plus(item.target_token === item.token0_address ? item.init_reserve0 : item.init_reserve1).toFixed()
    }, '0')
    const reserve = _pairs?.reduce((pre, item) => {
      return new BigNumber(pre || 0).plus(item.target_token === item.token0_address ? item.reserve0 : item.reserve1).toFixed()
    }, '0')

    const reserveU = _pairs?.reduce((pre, item) => {
      return new BigNumber(pre || 0).plus(item.target_token === item.token0_address ? new BigNumber(item.reserve1 || 0).times(item.token1_price_usd || 0).times(2) : new BigNumber(item.reserve0 || 0).times(item.token0_price_usd || 0).times(2)).toFixed()
    }, '0')
    return {
      token: token.value?.token,
      symbol: token.value?.symbol,
      chain: token.value?.chain,
      init_reserve,
      reserve,
      price: price.value || 0,
      reserveU
    }
  })
  const tokenPrice = shallowRef(0)
  const tokenPriceChange = shallowRef(0)
  const totalHolders = shallowRef<GetTotalHoldersResponse[]>([])
  const price = computed(() => tokenPrice.value || token.value?.current_price_usd)
  const priceChange = computed(() => tokenPriceChange.value || pair.value?.price_change || token.value?.price_change)
  const priceChangeV2 = computed(() => tokenPriceChange.value || pair.value?.price_change_24h || token.value?.price_change_v2)

  const gasPrice = ref(0)

  const placeOrderUpdate = ref(0)
  const placeOrderSuccess = ref(0)
  const registrationNum = ref(0)
  watch(price, val => {
    if (val) {
      if (route.fullPath?.includes?.('/token')) {
        // useHead({ title: '$' + formatNumber(val, 4) + ' ' + token.value?.symbol + ' | Ave' })
        if (globalStore.showMarket) {
          document.title = '$' + formatNumber(marketCap.value, 2) + ' ' + token.value?.symbol + ' | Ave'
        } else {
          document.title = '$' + formatNumber(val, 4) + ' ' + token.value?.symbol + ' | Ave'
        }
      }
    }
  })
 watch(()=>globalStore.showMarket, (val) => {
    if (route.fullPath?.includes?.('/token')) {
      // useHead({ title: '$' + formatNumber(val, 4) + ' ' + token.value?.symbol + ' | Ave' })
      if (val) {
        document.title =
          '$' + formatNumber(marketCap.value, 2) + ' ' + token.value?.symbol + ' | Ave'
      } else {
        document.title = '$' + formatNumber(price.value || 0, 4) + ' ' + token.value?.symbol + ' | Ave'
      }
    }
 })
  const centerTopHeight = shallowRef(DefaultHeight.KLINE)
  const {height} = useWindowSize()
  const commonHeight = computed(() => height.value - centerTopHeight.value)
  const bestToken = ref(null)

  const swap = reactive<{
    native: Token,
    token: Token,
    payToken: Token
  }>({
    native: {},
    token: {},
    payToken: {
      chain: 'solana',
      symbol: 'SOL',
      decimals: 9,
      address: 'sol',
      price: 1,
      logo_url: 'token_icon/solana/So11111111111111111111111111111111111111112.png',
      balance: '0'
    }
  })

  // 从 sessionStorage 初始化 payToken
  const savedPayToken = sessionStorage.getItem('token_payToken')
  if (savedPayToken) {
    try {
      swap.payToken = JSON.parse(savedPayToken)
    } catch (e) {
      console.error('Failed to parse payToken from sessionStorage:', e)
    }
  }

  // 监听 payToken 变化并同步到 sessionStorage
  watch(
    () => swap.payToken,
    (newPayToken) => {
      sessionStorage.setItem('token_payToken', JSON.stringify(newPayToken))
    },
    { deep: true }
  )

  const circulation = computed(() => {
    const circulation = new BigNumber(token.value?.total || 0)
      .minus(token.value?.lock_amount_dec || 0)
      .minus(token.value?.other_amount_dec || 0)
      .minus(token.value?.burn_amount_dec || 0)
    return circulation.lt(0) ? new BigNumber(0) : circulation
  })

  const marketCap = computed(() => {
    return new BigNumber(price.value || 0).times(circulation.value || 0).toFixed() || '0'
  })

  const warningStatus = computed(() => {
    let status = false
    const id = route.params.id as string
    if (route.name == 'token-id' && (token?.value?.risk_level ?? 0) >= 0 && !tokenWarningObj.value[id]) {
      status =
        (token?.value?.risk_level ?? 0) >= 0 &&
        !token?.value?.logo_url &&
        !tokenInfo?.value?.is_audited
    }
    return status
  })
  const isShowWaring = computed(() => {
    return (token?.value?.risk_level ?? 0) < 0 || warningStatus.value
  })

  function switchPair(pair1: TokenInfo['pairs'][0]['pair'] | boolean) {
    const pairs = tokenInfo.value?.pairs || []
    if (typeof pair1 === 'boolean') {
      pairAddress.value = pairs?.[0]?.pair
      selectedToken.value = pair1
      return
    } else {
      selectedToken.value = false
    }
    if (!pairs) return
    const isPair = pairs?.some(pair2 => pair2.pair === pair1)
    if (isPair) {
      pairAddress.value = pair1
    } else {
      pairAddress.value = pairs?.[0]?.pair
    }
  }

  function reset() {
    tokenInfo.value = null
    tokenInfoExtra.value = null
    tokenPrice.value = 0
    tokenPriceChange.value = 0
    pairAddress.value = ''
  }

  function _getTotalHolders(tokenId: string) {
    if (!tokenId) return
    getTotalHolders(tokenId).then(res => {
      totalHolders.value = Array.isArray(res) ? res : []
      triggerRef(totalHolders)
    })
  }

  function onSwitchMainPairV2(data: {
    chain: string
    token: string
    event: string
    id: string
    new_main_pair: string
    old_main_pair: string
    tag: string
    new_main_pair_data: {
      amm: string
      chain: string
      init_reserve0: number
      init_reserve1: number
      reserve0: number
      reserve1: number
      tag: string
      pair: string
      target_token: string
      token0_address: string
      token0_symbol: string
      token1_address: string
      token1_symbol: string
      token0_decimal: number
      token1_decimal: number
      tvl: number
    }
  }) {
    if ((data.token + '-' + data.chain) === route.params.id && data?.tag?.endsWith?.('_king')) {
      ElMessage.success($i18n.t('openedTip'))
      const newPair = {
        ...data.new_main_pair_data,
        new_main_pair: data.new_main_pair,
        init_reserve1: data.new_main_pair_data?.init_reserve1 || 0,
        init_reserve0: data.new_main_pair_data?.init_reserve0 || 0,
        price_change_1h: 0,
        price_change_4h: 0,
        price_change_5m: 0,
        price_change_24h: 0,
        swap_url: '',
        token0_price_eth: 0,
        token0_price_usd: 0,
        token1_price_eth: 0,
        token1_price_usd: 0,
        price_change: 0,
        reserve_change: 0,
        created_at: 0,
        tx_count: 0,
        updated_at: 0,
        low_u: 0,
        high_u: 0,
        tx_amount: 0,
        first_trade_at: 0,
        lp_holders: 0,
        lp_locked_percent: 0,
        lp_locked_to: '',
        lp_lock_platform: '',
        dynamic_tag: '',
        is_swap_supported: 0,
        show_name: '',
        is_fake: false,
        smart_money_buy_count_24h: 0,
        smart_money_sell_count_24h: 0,
        progress: 0,
        risk_score: 0,

        buy_volume_u_1h: 0,
        buy_volume_u_4h: 0,
        buy_volume_u_5m: 0,
        buy_volume_u_24h: 0,

        buyers_1h: 0,
        buyers_4h: 0,
        buyers_5m: 0,
        buyers_24h: 0,

        buys_tx_1h_count: 0,
        buys_tx_4h_count: 0,
        buys_tx_5m_count: 0,
        buys_tx_24h_count: 0,

        makers_1h: 0,
        makers_4h: 0,
        makers_5m: 0,
        makers_24h: 0,

        sell_volume_u_1h: 0,
        sell_volume_u_4h: 0,
        sell_volume_u_5m: 0,
        sell_volume_u_24h: 0,

        sellers_1h: 0,
        sellers_4h: 0,
        sellers_5m: 0,

        sellers_24h: 0,
        sells_tx_1h_count: 0,
        sells_tx_4h_count: 0,
        sells_tx_5m_count: 0,
        sells_tx_24h_count: 0,

        tx_1h_count: 0,
        tx_4h_count: 0,
        tx_5m_count: 57,
        tx_24h_count: 0,

        volume_u: 0,
        volume_u_1h: 0,
        volume_u_4h: 0,
        volume_u_5m: 0,
        volume_u_24h: 0,
      }
      tokenInfo.value?.pairs.forEach(pair => {
        if (pair.pair === data.old_main_pair) {
          pair.reserve0 = 0
          pair.reserve1 = 0
        }
      })
      tokenInfo.value?.pairs.unshift(newPair)


    const isSupportTokenKlineLaunchpad = SupportTokenKlineLaunchpad?.includes?.(token.value?.chain + '-' + (token.value?.launchpad || ''))
      if (SupportTokenKlineChains?.includes?.(token.value?.chain || '') || isSupportTokenKlineLaunchpad) {
        switchPair(true)
      } else {
        switchPair(newPair.pair)
      }
    }
  }

  function _getXType(id?: string) {
    getXType(id || route.params.id as string).then(res => {
      if (typeof res.type === 'number') {
        twitterType.value = res.type
      }
      console.log('twitterType',res,twitterType.value)
    }).catch(() => {
      twitterType.value = 0
    })
  }

  return {
    tokenInfo,
    tokenInfoExtra,
    token,
    pairs,
    tokenAllPair,
    pairAddress,
    selectedToken,
    pair,
    price,
    priceChange,
    priceChangeV2,
    tokenPrice,
    circulation,
    marketCap,
    gasPrice,
    reset,
    switchPair,
    _getTotalHolders,
    totalHolders,
    swap,
    placeOrderUpdate,
    registrationNum,
    placeOrderSuccess,
    onSwitchMainPairV2,
    isShowWaring,
    warningStatus,
    tokenWarningObj,
    centerTopHeight,
    commonHeight,
    twitterType,
    collected,
    getXType: _getXType,
    loadingToken,
    devTokenNum,
    bestToken
  }
})

