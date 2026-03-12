import { defineStore } from 'pinia'
import { useStorage, useLocalStorage } from '@vueuse/core'
import type { pumpBlack, pumpObjColor } from '@/api/types/pump'
import { _getFollowsNum } from '@/api/follow'
import type { MonitorChainType } from '~/utils/types'
import type{ GetHotTokensResponse } from '@/api/token'
import type { ILatestNotice } from '~/api/user'
import { getUserFavoriteGroups, type GetUserFavoriteGroupsResponse } from '~/api/fav'
export const useGlobalStore = defineStore('global', () => {
  const t = getGlobalT()
  const wsStore = useWSStore()
  const localeStore = useLocaleStore()
  const themeStore = useThemeStore()
  const configStore = useConfigStore()
  const showLeft = shallowRef(false)
  const showRight = shallowRef(true)
  const isUSDT = useStorage('isUSDT', true)
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
    isInt: boolean
    define: string[]
    data: Record<
      string,
      {
        minSize: number
        minColor: string
        minUnit?: string
        middleSize: number
        middleColor: string
        middleUnit?: string
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
  }>('pumpSetting9', {
    fontSize_mc: '12px',
    size_swap: '12px',
    Progress_isCircle: 'circle',
    avatar_isCircle: 'rect',
    isGutter: true,
    isRight: false,
    isBlacklist: true,
    show_search: true,
    isInt: false,
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
        minColor: getCssVariable('--main-text1'),
        middleSize: 100000,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
      vol: {
        minSize: 1000,
        minColor: getCssVariable('--main-text1'),
        middleSize: 50000,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
      holders: {
        minSize: 100,
        minColor: getCssVariable('--main-text1'),
        middleSize: 500,
        middleColor: '#FFA622',
        maxColor: '#12B886',
      },
      twitter: {
        minSize: 10,
        minColor: '#009EF7',
        minUnit: 's',
        middleSize: 30,
        middleColor: '#12B886',
        middleUnit: 'm',
        maxColor: '#F6465D',
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
  const clickHolderCount = shallowRef(0)
  const popVisible = shallowRef<boolean>(false)
  // 涨跌幅时区
  const zone=useStorage('zone','24h')

  const zoneList=computed(()=>{
    return [
    {key:'24h',value:t('past24h')},
    {key:'+8h',value:'UTC+8, 00:00'},
  ]
  })
  const showMarket = useLocalStorage('tv_showMarket', false)
  watch(
    () => themeStore.isDark,
    () => {
      pumpSetting.value.data.mc.minColor = getCssVariable('--main-text1')
      pumpSetting.value.data.vol.minColor = getCssVariable('--main-text1')
      pumpSetting.value.data.holders.minColor = getCssVariable('--main-text1')
    },
    {immediate: true}
  )

  const batchRemarkFormData = useStorage('batchRemarkFormData', {
    type: 1,
    needAmount: true,
    isUpdateExist: true,
  })

  const hide_risk=shallowRef(1)
  const hide_small=shallowRef(0)
  const rankCommon = useStorage('rankCommon', {
    activeInterval: '24h',
    quickVisible: true,
    quickBuyValue: '0.01',
    sort: 'time',
    sort_dir: ''
  })
  const pumpLiveSort = useStorage('pumpLiveSort', {
    sort: 'created_timestamp',
    sort_dir: 'DESC',
  })
  const audioSettings = useStorage('audioSettings-v8',{
    active:'',
    notice:{
      monitor:true,
      monitorShow:0,
      monitorBorder:1,
      monitorTh:[true,true,true],
      quickBuyChain:'solana' as  MonitorChainType,
      // monitorTh:['walletUser','walletName','MC','createTime'],
      quickBuy:true,
      quickBuyValue_solana:'0.01',
      quickBuyValue_bsc:'0.01',
      quickBuyValue_xlayer:'0.01',
      quickBuyAction:1,
      signal:true,
      pumpNotice:false,
      pumpChains:['solana'] as string[],
      pumpPlatforms:[] as string[],
      position:'top',
      time:3
    },
    audio:{
      signal:'RedPacket',
      monitor:'Coin',
      marketBuy:'Handgun',
      marketSell:'Kaching',
      limit:'',
      volume:50,
      twitter:'',
      news:''
    },
    wallet:{
      clickTokenAction: -1, //-1 不打开 0: 跳转 1: 新tab打开
      clickAction: 0, // 0: 跳转, 1: 新tab打开
      rightClickAction: 0 // 0: 不打开, 1: 新tab打开
    }
  })

  // 预留一个全局变量，用于控制 token 历史的显示
  const tokenHistoryVisible = useStorage('tokenHistoryVis',false)
  const klineSettingPop = ref({
    visible:false,
    position:[] as number[]
  })
  const lastVisitTokens = useStorage<{
    id: string,
    logo_url: string,
    symbol: string,
    price_change: number | undefined,
    price_change_v2: number | undefined,
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
  const showImport = shallowRef(false)
  const showBotRecord = shallowRef(false)

  const migrated = ref( null as null | {
    migrate_time: number
    migrate_uprice: string
    showMarket: boolean
    mcap: number
  })

  const tagsRatio = ref<{
    address_binding_ratio: number
    bundle_ratio: number
    dev_age_seconds: number
    dev_first_transfer_in_from_label: string
    dev_ratio: number
    kol_count: number
    kol_ratio: number
    max_dev_ratio: number
    rat_ratio: number
    sniper_balance_ratio_cur: number
    top10_ratio: number
    smart_wallet_count: number
    smart_wallet_ratio: number
    colluded_cluster_ratio: number
  }>({
    address_binding_ratio: 0,
    bundle_ratio: 0,
    dev_age_seconds: 0,
    dev_first_transfer_in_from_label: '',
    dev_ratio: 0,
    kol_count: 0,
    kol_ratio: 0,
    max_dev_ratio: 0,
    rat_ratio: 0,
    sniper_balance_ratio_cur: 0,
    top10_ratio: 0,
    smart_wallet_count: 0,
    smart_wallet_ratio: 0,
    colluded_cluster_ratio: 0
  })

  //  点击图表显示交易历史
   const isClickKlineFilter = useStorage('isClickKlineFilter', true)
  //  搜索框的展示
  const dialogVisible_search = ref(false)
  // 搜索框的文案
  const dialogSearchText = ref('')
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
    showRight,
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
    audioSettings,
    pnlTrackerVisible,
    lastVisitTokens,
    tokenHistoryVisible,
    userFavoriteGroups,
    getUserFavoriteGroups: _getUserFavoriteGroups,
    rankConditions,
    rankActiveTab,
    isClickKlineFilter,
    mySwapList,
    pumpLiveSort,
    isUSDT,
    dialogVisible_search,
    dialogSearchText,
    showImport,
    showBotRecord,
    batchRemarkFormData,
    klineSettingPop,
    zone,
    zoneList,
    showMarket,
    migrated,
    clickHolderCount,
    popVisible,
    tagsRatio,
  }
})
