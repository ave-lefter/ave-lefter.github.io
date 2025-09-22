import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { pumpBlack, pumpObjColor } from '@/api/types/pump'
import { _getFollowsNum } from '@/api/follow'

import type{ GetHotTokensResponse } from '@/api/token'
import type { ILatestNotice } from '~/api/user'
import { getUserFavoriteGroups, type GetUserFavoriteGroupsResponse } from '~/api/fav'
export const useGlobalStore = defineStore('global', () => {
  const wsStore = useWSStore()
  const localeStore = useLocaleStore()
  const themeStore = useThemeStore()
  const configStore = useConfigStore()
  const showLeft = shallowRef(true)
  const footerTokensPrice = shallowRef([
    {
      token: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      chain: 'bsc',
      id: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chain: 'eth',
      id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      chain: 'bsc',
      id: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: 'So11111111111111111111111111111111111111112',
      chain: 'solana',
      id: 'So11111111111111111111111111111111111111112-solana',
      current_price_usd: 0,
      price_change: 0
    }
  ])
  const pumpSetting = useStorage<{
    fontSize_mc: string
    size_swap: string
    Progress_isCircle: string
    avatar_isCircle: string
    isGutter: boolean
    isRight: boolean
    isBlacklist: boolean
    show_search: boolean
    define: string[]
    data: Record<
      string,
      {
        minSize: number
        minColor: string
        middleSize: number
        middleColor: string
        maxColor: string
      }
    >
    bg: Record<string, pumpObjColor>
    bgList: string[]
    grid: Record<
      string,
      {
        id: string
        order: number
        name: string
        show: boolean
      }
    >
    jump: 'close' | 'open' | 'open_jump'
    border: string
  }>('pumpSetting2', {
    fontSize_mc: '12px',
    size_swap: '12px',
    Progress_isCircle: 'circle',
    avatar_isCircle: 'rect',
    isGutter: true,
    isRight: false,
    isBlacklist: true,
    show_search: true,
    define: [
      'name',
      'txs',
      'vol',
      'holder',
      'mcap',
      'media',
      'smart',
      'top',
      'dev',
      'insider',
      'sniper',
      'rug',
      'kol',
      'markers',
    ],
    data: {
      mc: {
        minSize: 30000,
        minColor: getCssVariable('--main-text'),
        middleSize: 100000,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
      vol: {
        minSize: 1000,
        minColor: getCssVariable('--main-text'),
        middleSize: 50000,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
      holders: {
        minSize: 100,
        minColor: getCssVariable('--main-text'),
        middleSize: 500,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
    },
    bg: {},
    bgList: [],
    grid: {
      new: {
        id: 'new',
        order: 1,
        name: 'new1',
        show: true,
      },
      soon: {
        id: 'soon',
        order: 2,
        name: 'soon',
        show: true,
      },
      graduated: {
        id: 'graduated',
        order: 2,
        name: 'graduated',
        show: true,
      },
    },
    jump: 'close',
    border: '',
  })

  const hide_risk=shallowRef(1)
  const hide_small=shallowRef(0)
  const rankCommon = useStorage('rankCommon',{
    activeInterval: '24h',
    quickVisible: true,
    quickBuyValue: '0.01',
  })

  // 预留一个全局变量，用于控制 token 历史的显示
  const tokenHistoryVisible = true
  const lastVisitTokens = useStorage<{
    id: string,
    logo_url: string,
    symbol: string,
    price_change: number | undefined,
    circulation: string,
    price: number,
  }[]>('lastTokens', [])
  const latestNotice = shallowRef<ILatestNotice>({} as ILatestNotice)
  const rankActiveTab = useStorage('rankActiveTab', 'hot')
  // pump 和活动榜单动态插入
  const rankConditions = useStorage<Record<string, { sort: { sort: string; sort_dir: string }, filter: Record<string, any> }>>('rankCache',{
    hot:{
      sort:{
        sort: '',
        sort_dir: '',
      },
      filter:{}
    },
    new:{
      sort:{
        sort: '',
        sort_dir: '',
      },
      filter:{}
    },
    gainer:{
      sort:{
        sort: '',
        sort_dir: '',
      },
      filter:{}
    },
    inclusion:{
      sort:{
        sort: '',
        sort_dir: '',
      },
      filter:{}
    }
  })

  const userFavoriteGroups = ref<GetUserFavoriteGroupsResponse[]>([])
  const pnlTrackerVisible = useStorage('pnlTrackerVisible', false)

  const pumpBlackList = useStorage<Array<pumpBlack>>('pumpBlackList', [])
  const holderBlackList = useStorage<Array<pumpBlack>>('holderBlackList', [])
  const mySwapList = ref<any[]>([])

   const hotList = shallowRef<GetHotTokensResponse[]>([])
   function sendFooterPriceWs() {
    const data = {
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: ['pricev2', footerTokensPrice.value?.map(i => i.id)],
      id: 1,
    }
    wsStore.send(data)
    const data1 = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pricev2', footerTokensPrice.value?.map(i => i.id)],
      id: 1,
    }
    wsStore.send(data1)
  }


  function onmessageFooterPrice(data: any) {
    const prices = data?.prices as { token: string, chain: string, uprice: number, price_change: number }[]
    footerTokensPrice.value = footerTokensPrice.value?.map?.(
      (i) => {
        const item = prices.find(
          (j) => j.token + '-' + j.chain === i?.id
        )
        if (item) {
          return {
            ...i,
            current_price_usd: item.uprice,
            price_change: item.price_change,
          }
        } else {
          return {
            ...i,
          }
        }
      }
    )
  }
  const footerTokensPriceIds = computed(() => footerTokensPrice.value?.map(i => i.id))

  const headFollowsNum = ref<{ all: number,soldAll: number }>({ all: 0,soldAll: 0})
  // const id = computed(() => {
  //   return useRoute().params?.id as string
  // })
  function getFollowsNum() {
    if (!useFollowStore().currentAddress) {
      return
    }
    const params = {
      token_id: useRoute().params?.id,
      self_address: useFollowStore().currentAddress,
    }
    _getFollowsNum(params).then((res) => {
      headFollowsNum.value = res
    }).catch(() => {
      headFollowsNum.value = {
        all: 0,
        soldAll: 0,
      }
    })
  }

  function _getUserFavoriteGroups(walletAddress:string) {
    getUserFavoriteGroups(walletAddress).then((res) => {
      userFavoriteGroups.value = (res || []).filter((el) => !!el.name)
    })
  }

  return {
    lang: computed(() => localeStore.locale),
    token_logo_url: computed(() => configStore.token_logo_url),
    mode: computed(() => (themeStore.isDark ? 'dark' : 'light')),
    isDark: computed(() => themeStore.isDark),
    sendFooterPriceWs,
    onmessageFooterPrice,
    footerTokensPrice,
    footerTokensPriceIds,
    showLeft,
    pumpSetting,
    pumpBlackList,
    holderBlackList,
    hotList,
    hide_small,
    hide_risk,
    rankCommon,
    headFollowsNum,
    getFollowsNum,
    latestNotice,
    pnlTrackerVisible,
    lastVisitTokens,
    tokenHistoryVisible,
    userFavoriteGroups,
    getUserFavoriteGroups:_getUserFavoriteGroups,
    rankConditions,
    rankActiveTab,
    mySwapList
  }
})
