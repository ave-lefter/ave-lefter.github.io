<script setup lang="ts">
import SignalContainer from './components/signal/signalContainer.vue'
import KOL from './components/kol/index.vue'
import Filter from './components/signal/filter.vue'
import { _getKolList, _getSmartList } from '@/api/kol'
import { useLocalStorage, useStorage } from '@vueuse/core'
import type { ChainKey } from '~/api/types/pump'
const Version = 1
const { t } = useI18n()

const configStore = useConfigStore()
const walletStore = useWalletStore()
const botStore = useBotStore()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()

const signalContainerRef =
  useTemplateRef<InstanceType<typeof SignalContainer>>('signalContainerRef')
const smartChains = computed(() => {
  return ['solana', 'bsc'].map((value) => {
    return {
      label: getChainInfo(value)?.name,
      value,
    }
  })
})
const isActivity = computed(() => activeTab.value === 'activity')
const activeChain = useStorage<ChainKey>('signal_active_chain', 'bsc')
const activeChain2 = shallowRef<ChainKey>('solana')

const intervalFilter = useLocalStorage('web_market_intervalFilter', {})
const signalSwitchFlag = useLocalStorage('signalSwitchFlag', true)
const filterConditions = useLocalStorage('filterConditionsSmart', {
  chain: 'solana',
  category: 'cowboys',
  categoryList: ['cowboys', ''],
  version: Version,
})
const activeTab = shallowRef('activity')
const tableDataObj = ref({})
const loading = shallowRef(false)
const tableIndex = shallowRef(0)
const total = shallowRef(0)
const initNum = shallowRef(0)

// 内存存储搜索关键词，键格式：${chain}-${category}
const searchKeywords = ref({})

const defaultConditions = ref({
  chain: 'solana',
  category: 'cowboys',
  categoryList: ['cowboys', ''],
  direction: '',
  sort: 'rank_score',
  sort_dir: 'desc',
  version: Version,
  interval: '30D',
  profit_above_900_percent_num_min: '', // 10X+ 币数 最小值
  profit_above_900_percent_num_max: '', // 10X+ 币数 最大值
  profit_300_900_percent_num_min: '', // 4X-10X币数 最小值
  profit_300_900_percent_num_max: '', // 4X-10X币数 最大值
  profit_100_300_percent_num_min: '', // 2X-4X币数 最小值
  profit_100_300_percent_num_max: '', // 2X-4X币数 最大值
  profit_10_100_percent_num_min: '', // 10%-2X币数 最小值
  profit_10_100_percent_num_max: '', // 10%-2X币数 最大值
  profit_neg10_10_percent_num_min: '', // -10%-10%币数 最小值
  profit_neg10_10_percent_num_max: '', // -10%-10%币数 最大值
  profit_neg50_neg10_percent_num_min: '', // -50%—-10%币数 最小值
  profit_neg50_neg10_percent_num_max: '', // -50%—-10%币数 最大值
  profit_neg100_neg50_percent_num_min: '', // -100%—-50%币数 最小值
  profit_neg100_neg50_percent_num_max: '', // -100%—-50%币数 最大值
  last_trade_time_min: '', // 最近交易时间最小值（时间戳）
  last_trade_time_max: '', // 最近交易时间最大值（时间戳）
  keyword: '',
})
const filterFormObj = ref({})

const audioVisible = ref(false)
const showResetBtn = shallowRef(false)
// token: 筛选 token
// history_count：筛选信号数，对应值2, 5, 15
// 市值：mc_curr，市值过滤，
// 市值方向：mc_curr_sign， 默认 > 大于号，可选 <
const defaultSignalFilter = {
  token: '',
  history_count: undefined as undefined | number,
  mc_curr: undefined as undefined | number,
  mc_curr_sign: '<',
}
const signalFilter = useStorage('signalParams', {
  ...defaultSignalFilter,
})

function onReset() {
  signalFilter.value = { ...defaultSignalFilter }
}
function onConfirm(_filterParams: typeof defaultSignalFilter) {
  signalFilter.value = { ..._filterParams }
}

const tabs = computed(
  () =>
    [
      {
        id: 'activity',
        name: t('signal2'),
      },
      {
        id: 'cowboys',
        name: t('cowboys'),
      },
      {
        id: 'kol',
        name: t('kol'),
      },
    ] as const
)
const openTimeList = computed(() => {
  return [
    { text: t('all'), value: '' },
    { text: '≤10min', value: String(10 * 60) },
    { text: '≤30min', value: String(30 * 60) },
    { text: '≤1H', value: String(60 * 60) },
    // { text: '≤6H', value: String(60 * 6 * 60) },
    { text: '≤12H', value: String(60 * 12 * 60) },
    { text: '≤24H', value: String(60 * 24 * 60) },
    { text: '≤7D', value: String(60 * 24 * 7 * 60) },
    // { text: '≤14D', value: String(60 * 24 * 14 * 60) },
    { text: '≤30D', value: String(60 * 24 * 30 * 60) },
  ]
}) as ComputedRef<Array<{ text: string; value: string }>>
const tableData = computed(() => {
  console.log(
    '-----------tableData--------',
    tableDataObj?.value?.[filterConditions?.value?.chain + '-' + filterConditions?.value?.category]
  )
  return (
    tableDataObj?.value?.[
      filterConditions?.value?.chain + '-' + filterConditions?.value?.category
    ] || []
  )
})
const activeCategory1 = computed(() => filterConditions.value.category)
const activeInterval = computed(() => intervalFilter?.value['global_interval'] || '7D')

const quickBuyValue = useStorage('quickBuyValue', '0.01')

type TabId = (typeof tabs.value)[number]['id']

onMounted(() => {
  init()
})
function handleTabChange(tab: TabId) {
  if (activeTab.value === tab) return
  setSignalSwitchFlag(tab, false)
  activeTab.value = tab

  // 切换标签时清空所有搜索状态
  searchKeywords.value = {}

  // 更新过滤条件
  if (tab === 'activity') {
    filterConditions.value.category = 'activity'
    filterConditions.value.categoryList = ['activity', '']
    signalSwitchFlag.value = true
  } else {
    filterConditions.value.category = tab
    filterConditions.value.categoryList = [tab, '']
  }

  // 只在非activity标签时初始化表单和获取数据
  if (tab !== 'activity') {
    initFilterForm()
    getSmartList()
  }
}
function setSignalSwitchFlag(tab: TabId, $bol: boolean) {
  signalSwitchFlag.value = $bol
  activeTab.value = tab
  filterConditions.value.category = tab
  filterConditions.value.categoryList = [tab, '']
}
function handleIntervalChange(interval: string) {
  if (activeInterval.value === interval) return
  intervalFilter.value['global_interval'] = interval
  const key = activeChain2.value + '-' + activeCategory1.value
  if (!filterConditions.value[key]) {
    filterConditions.value[key] = {}
  }
  filterConditions.value[key].interval = interval
  getSmartList()
}
function init() {
  // 页面初始化时清空所有搜索状态
  searchKeywords.value = {}

  if (filterConditions?.value) {
    activeChain2.value = filterConditions.value.chain
    // activeTab.value = filterConditions.value.category
  }
  if (filterConditions?.value && filterConditions?.value?.version !== Version) {
    activeChain2.value = 'solana'
    // activeTab.value= 'activity'
    localStorage.removeItem('filterConditionsSmart')
    filterConditions.value = {
      chain: 'solana',
      category: 'cowboys',
      categoryList: ['cowboys', ''],
      version: Version,
    }
  }

  // this.initFilterForm()
  getSmartList()
}
function getSmartList(isSort = false) {
  // 只在数据变化时更新storage
  const currentKey = filterConditions?.value?.chain + '-' + filterConditions?.value?.category
  const conditions = filterConditions.value?.[currentKey] || ''
  console.log('------conditions--------', currentKey)
  const data = {
    ...conditions,
    chain: filterConditions?.value.chain,
    last_trade_time_min: conditions?.last_trade_time
      ? parseInt(Date.now() / 1000) - conditions.last_trade_time
      : '',
    self_address: botStore?.evmAddress || walletStore.address,
    interval: activeInterval.value || '30D',
    // 从内存状态获取搜索关键词
    keyword: searchKeywords.value[currentKey] || '',
  }

  // 根据不同的category设置不同的默认排序参数
  if (!data.sort || !data.sort_dir) {
    data.sort = filterConditions?.value?.category === 'kol' ? 'rank_score' : 'total_profit'
    data.sort_dir = 'desc'
  }

  // 只在没有数据时显示loading
  if (!tableDataObj.value?.[currentKey]?.length || isSort) {
    loading.value = true
  }

  // 清理不需要的参数
  if (data.last_trade_time) delete data.last_trade_time
  delete data.category
  delete data.version
  delete data.categoryList

  // 构建请求参数
  const requestParams = Object.entries(data).reduce((acc, [key, value]) => {
    if (value) acc[key] = String(value)
    return acc
  }, {})

  tableIndex.value++

  // 根据不同的category调用不同的API
  const apiCall = filterConditions.value?.category === 'kol' ? _getKolList : _getSmartList

  apiCall(requestParams)
    .then((res) => {
      const list = Array.isArray(res) ? res : []
      const tableData = list.map((i) => ({
        ...i,
        last_trade_time:
          i?.last_trade_time !== '1970-01-01T00:00:00Z' &&
          i?.last_trade_time !== '0001-01-01T00:00:00Z'
            ? new Date(i?.last_trade_time).getTime() / 1000
            : '0',
        extra: getExtra(i.extra_info),
      }))
      tableDataObj.value[currentKey] = tableData
    })
    .catch(() => {
      if (!filterConditions.value?.chain && !filterConditions.value?.category) {
        total.value = 0
        tableDataObj.value[currentKey] = []
      }
    })
    .finally(() => {
      initNum.value++
      loading.value = false
    })
}
function getExtra(appendix: string) {
  if (!appendix) return []
  if (isJSON(appendix)) {
    const obj = JSON.parse(appendix)
    const arr = []
    if (obj?.short_term_trader) arr.push({ img: 'short_term_trader', tip: 'short_term_trader' })
    if (obj?.big_wallet) arr.push({ img: 'big_wallet', tip: 'big_wallet' })
    if (obj?.long_term_trader) arr.push({ img: 'long_term_trader', tip: 'long_term_trader' })
    return arr
  }
  return []
}
function initFilterForm() {
  if (!activeCategory1.value) {
    return
  }
  const key = activeChain2.value + '-' + activeCategory1.value
  const conditions = filterConditions?.value?.[key]
  if (!conditions) {
    filterConditions.value[key] = { ...defaultConditions.value }
  }
  const filterForm = {
    profit_percent_num: {
      visible: false,
      type: 'profit_percent_num',
      profit_obj: {
        profit_above_900_percent_num: {
          name: '10X+',
          color: 'green',
          type: 'profit_percent_num',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_above_900_percent_num_min || 0),
            Number(conditions?.profit_above_900_percent_num_max || 500),
          ],
          sort: 'profit_above_900_percent_num',
          sort_dir:
            conditions?.sort === 'profit_above_900_percent_num'
              ? conditions?.sort_dir || null
              : null,
        },
        profit_300_900_percent_num: {
          name: '4X~10X',
          color: 'green',
          type: 'profit_percent_num',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_300_900_percent_num_min || 0),
            Number(conditions?.profit_300_900_percent_num_max || 500),
          ],
          sort: 'profit_300_900_percent_num',
          sort_dir:
            conditions?.sort === 'profit_300_900_percent_num' ? conditions?.sort_dir || null : null,
        },
        profit_100_300_percent_num: {
          name: '2X~4X',
          color: 'green',
          type: 'profit_percent_num',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_100_300_percent_num_min || 0),
            Number(conditions?.profit_100_300_percent_num_max || 500),
          ],
          sort: 'profit_100_300_percent_num',
          sort_dir:
            conditions?.sort === 'profit_100_300_percent_num' ? conditions?.sort_dir || null : null,
        },

        profit_10_100_percent_num: {
          name: '10%~2X',
          color: 'green',
          type: 'profit_percent_num',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_10_100_percent_num_min || 0),
            Number(conditions?.profit_100_300_percent_num_max || 500),
          ],
          sort: 'profit_100_300_percent_num',
          sort_dir:
            conditions?.sort === 'profit_100_300_percent_num' ? conditions?.sort_dir || null : null,
        },
      },
      sort_dir:
        conditions?.sort === 'profit_above_900_percent_num' ||
        conditions?.sort === 'profit_300_900_percent_num' ||
        conditions?.sort === 'profit_100_300_percent_num' ||
        conditions?.sort === 'profit_10_100_percent_num'
          ? conditions?.sort_dir || null
          : null,
    },

    profit_percent_num_lt: {
      visible: false,
      type: 'profit_percent_num_lt',
      profit_obj: {
        profit_neg10_10_percent_num: {
          name: '-10%~10%',
          color: 'yellow',
          type: 'profit_percent_num_lt',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_neg10_10_percent_num_min || 0),
            Number(conditions?.profit_neg10_10_percent_num_max || 500),
          ],
          sort: 'profit_neg10_10_percent_num',
          sort_dir:
            conditions?.sort === 'profit_neg10_10_percent_num'
              ? conditions?.sort_dir || null
              : null,
        },

        profit_neg50_neg10_percent_num: {
          name: '-50%~-10%',
          color: 'red',
          type: 'profit_percent_num_lt',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_neg50_neg10_percent_num_min || 0),
            Number(conditions?.profit_neg50_neg10_percent_num_max || 500),
          ],
          sort: 'profit_neg50_neg10_percent_num',
          sort_dir:
            conditions?.sort === 'profit_neg50_neg10_percent_num'
              ? conditions?.sort_dir || null
              : null,
        },

        profit_neg100_neg50_percent_num: {
          name: '-100%~-50%',
          color: 'red',
          type: 'profit_percent_num_lt',
          defaultRange: [0, 500],
          range: [
            Number(conditions?.profit_neg100_neg50_percent_num_min || 0),
            Number(conditions?.profit_neg100_neg50_percent_num_max || 500),
          ],
          sort: 'profit_neg100_neg50_percent_num',
          sort_dir:
            conditions?.sort === 'profit_neg100_neg50_percent_num'
              ? conditions?.sort_dir || null
              : null,
        },
      },
      sort_dir:
        conditions?.sort === 'profit_neg10_10_percent_num' ||
        conditions?.sort === 'profit_neg50_neg10_percent_num' ||
        conditions?.sort === 'profit_neg100_neg50_percent_num'
          ? conditions?.sort_dir || null
          : null,
    },
    last_trade_time: {
      visible: false,
      type: 'last_trade_time',
      last_trade_time: conditions?.last_trade_time || '',
      sort_dir: conditions?.sort === 'last_trade_time' ? conditions?.sort_dir || null : null,
    },
    keyword: {
      visible: false,
      type: 'keyword',
      keyword: searchKeywords.value[key] || '', // 从内存状态获取keyword
      sort_dir: conditions?.sort === 'keyword' ? conditions?.sort_dir || null : null,
    },
  }
  filterFormObj.value[key] = filterForm
}
function isActiveFilter(prop) {
  if (!prop) return false
  const key = activeChain2.value + '-' + activeCategory1.value
  const conditions = filterConditions?.value?.[key] || {}
  const filterForm = filterFormObj?.value?.[key] || {}
  if (prop === 'last_trade_time') {
    return conditions.last_trade_time && conditions.last_trade_time !== ''
  }
  console.log('filterForm', filterForm)
  return filterRange(prop) || filterForm?.[prop]?.sort_dir
}
function filterRange(prop) {
  const key = activeChain2.value + '-' + activeCategory1.value
  const conditions = filterConditions?.value?.[key] || {}
  const filterForm = filterFormObj?.value?.[key] || {}
  const rangeObj = {
    last_trade_time: ['last_trade_time'],
    profit_percent_num: [
      'profit_above_900_percent_num_min', // 10X+ 币数 最小值
      'profit_above_900_percent_num_max', // 10X+ 币数 最大值

      'profit_300_900_percent_num_min', // 4X-10X币数 最小值
      'profit_300_900_percent_num_max', // 4X-10X币数 最大值

      'profit_100_300_percent_num_min', // 2X-4X币数 最小值
      'profit_100_300_percent_num_max', // 2X-4X币数 最大值

      'profit_10_100_percent_num_min', // 10%-2X币数 最小值
      'profit_10_100_percent_num_max', // 10%-2X币数 最大值

      'profit_neg10_10_percent_num_min', // -10%-10%币数 最小值
      'profit_neg10_10_percent_num_max', // -10%-10%币数 最大值

      'profit_neg50_neg10_percent_num_min', // -50%—-10%币数 最小值
      'profit_neg50_neg10_percent_num_max', // -50%—-10%币数 最大值

      'profit_neg100_neg50_percent_num_min', // -100%—-50%币数 最小值
      'profit_neg100_neg50_percent_num_max', // -100%—-50%币数 最大值
    ],
    profit_above_900_percent_num: [
      'profit_above_900_percent_num_min',
      'profit_above_900_percent_num_max',
    ],
    profit_300_900_percent_num: [
      'profit_300_900_percent_num_min',
      'profit_300_900_percent_num_max',
    ],
    profit_100_300_percent_num: [
      'profit_100_300_percent_num_min',
      'profit_100_300_percent_num_max',
    ],
    profit_10_100_percent_num: ['profit_10_100_percent_num_min', 'profit_10_100_percent_num_max'],
    profit_neg10_10_percent_num: [
      'profit_neg10_10_percent_num_min',
      'profit_neg10_10_percent_num_max',
    ],
    profit_neg50_neg10_percent_num: [
      'profit_neg50_neg10_percent_num_min',
      'profit_neg50_neg10_percent_num_max',
    ],
    profit_neg100_neg50_percent_num: [
      'profit_neg100_neg50_percent_num_min',
      'profit_neg100_neg50_percent_num_max',
    ],
  }
  const range = rangeObj[prop]
  // let len = range?.length
  if (prop === 'keyword') {
    // 从内存状态检查搜索关键词是否激活
    return searchKeywords.value[key] && searchKeywords.value[key] !== ''
  }
  if (prop == 'profit_percent_num') {
    console.log('------ggg-----------', range[0], conditions, filterForm[prop])
    //  return !(len?.every(i=> (!conditions[range[i]] || conditions[range[i]] === filterForm[prop].defaultRange[i])))
    return !(
      (!conditions[range[0]] ||
        conditions[range[0]] ===
          filterForm[prop]?.profit_obj[range[0]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[1]] ||
        conditions[range[1]] ===
          filterForm[prop]?.profit_obj[range[1]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[2]] ||
        conditions[range[2]] ===
          filterForm[prop]?.profit_obj[range[2]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[3]] ||
        conditions[range[3]] ===
          filterForm[prop]?.profit_obj[range[3]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[4]] ||
        conditions[range[4]] ===
          filterForm[prop]?.profit_obj[range[4]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[5]] ||
        conditions[range[3]] ===
          filterForm[prop]?.profit_obj[range[5]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[6]] ||
        conditions[range[6]] ===
          filterForm[prop]?.profit_obj[range[6]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[7]] ||
        conditions[range[7]] ===
          filterForm[prop]?.profit_obj[range[7]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[8]] ||
        conditions[range[8]] ===
          filterForm[prop]?.profit_obj[range[8]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[9]] ||
        conditions[range[9]] ===
          filterForm[prop]?.profit_obj[range[9]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[10]] ||
        conditions[range[10]] ===
          filterForm[prop]?.profit_obj[range[10]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[11]] ||
        conditions[range[11]] ===
          filterForm[prop]?.profit_obj[range[11]?.replace?.('_max', '')]?.defaultRange[1]) &&
      (!conditions[range[12]] ||
        conditions[range[12]] ===
          filterForm[prop]?.profit_obj[range[12]?.replace?.('_min', '')]?.defaultRange[0]) &&
      (!conditions[range[13]] ||
        conditions[range[13]] ===
          filterForm[prop]?.profit_obj[range[13]?.replace?.('_max', '')]?.defaultRange[1])
    )
    // return true
  } else {
    // return !(len?.every(i=> (!conditions[range[i]] || conditions[range[i]] === filterForm[prop].defaultRange[i])))
    return !(
      (!conditions[range[0]] || conditions[range[0]] === filterForm[prop].defaultRange[0]) &&
      (!conditions[range[1]] || conditions[range[1]] === filterForm[prop].defaultRange[1])
    )
  }
}
function handleFilterConfirm(val) {
  // let conditions = this.filterConditions[this.activeCategory1] || {}
  const key = activeChain2.value + '-' + activeCategory1.value
  if (!filterConditions?.value?.[key]) {
    filterConditions.value[key] = {}
  }
  if (
    (filterConditions.value[key].sort !== val.type && val.sort_dir) ||
    (filterConditions.value[key].sort === val.type &&
      filterConditions.value[key].sort_dir !== val.sort_dir)
  ) {
    filterConditions.value[key].sort_dir = val.sort_dir || null
    filterConditions.value[key].sort = val.type
  }
  // console.log(this.filterConditions[key])
  // this.resetSort()

  if (val.type === 'profit_percent_num') {
    for (const i in val.profit_obj) {
      if (val.profit_obj[i].range[0] && val.profit_obj[i].range[1]) {
        if (Number(val.profit_obj[i].range[0]) > Number(val.profit_obj[i].range[1])) {
          ElMessage.error(t('maxGtMin'))
          return
        }
      }
      filterConditions.value[key][i + '_min'] = val.profit_obj[i].range[0] || ''
      filterConditions.value[key][i + '_max'] =
        val.profit_obj[i].range[1] >= val.profit_obj[i].defaultRange[1]
          ? ''
          : val.profit_obj[i].range[1] || ''
      if (val.profit_obj[i].sort_dir) {
        filterConditions.value[key].sort_dir = val.profit_obj[i].sort_dir
        filterConditions.value[key].sort = i
      }
    }
  } else if (val.type === 'last_trade_time') {
    filterConditions.value[key].last_trade_time = val.last_trade_time
  } else if (val.type === 'keyword') {
    // 将搜索关键词存储到内存而不是持久化存储
    searchKeywords.value[key] = val.keyword
  }
  val.visible = false
  resetSort()
  getSmartList()
}
function handleSort(val: string, dir: string) {
  const currentForm = filterFormObj.value[activeChain2.value + '-' + activeCategory1.value]
  if (val.type === 'profit_percent_num') {
    const profit_obj = currentForm?.['profit_percent_num']?.profit_obj
    for (const i in profit_obj) {
      profit_obj[i].sort_dir = ''
    }
  }
  if (!dir) {
    const sortList = ['desc', 'asc', null]
    if (!val.sort_dir) {
      val.sort_dir = sortList[0]
    } else {
      val.sort_dir = sortList[sortList.indexOf(val.sort_dir) + 1]
    }
    return
  }
  if (val.sort_dir === dir) {
    val.sort_dir = null
  } else {
    val.sort_dir = dir
  }

  if (val.type === 'profit_percent_num') {
    const profit_obj = currentForm?.['profit_percent_num']?.profit_obj
    for (const i in profit_obj) {
      if (profit_obj[i].sort_dir) {
        currentForm['profit_percent_num'].sort_dir = profit_obj[i].sort_dir
        currentForm['profit_percent_num'].sort = i
      }
    }
  }
  filterFormObj.value[activeChain2.value + '-' + activeCategory1.value] = currentForm
  console.log('filterFormObj111', filterFormObj)
}

function handleReset(val) {
  val.sort_dir = null
  if (val.type === 'last_trade_time') {
    val.last_trade_time = ''
  } else if (val.type === 'profit_percent_num') {
    val.sort_dir = ''
    for (const i in val.profit_obj) {
      val.profit_obj[i].range = val.profit_obj[i].defaultRange
      val.profit_obj[i].sort = ''
      val.profit_obj[i].sort_dir = ''
    }
    const key = activeChain2.value + '-' + activeCategory1.value
    filterConditions.value[key].sort_dir = '' || null
    filterConditions.value[key].sort = ''

    console.log('--1111---', val)
  } else if (val.type === 'keyword') {
    val.keyword = ''
    // 同时清空内存中的搜索状态
    const key = activeChain2.value + '-' + activeCategory1.value
    searchKeywords.value[key] = ''
  } else {
    val.range1 = val.defaultRange
    val.range = val.defaultRange
  }
  handleFilterConfirm(val)
}

function handleSortChange(row: { prop: string; order: 'ascending' | 'descending' | null }) {
  filterConditions.value[activeChain2.value + '-' + activeCategory1.value].sort = row?.prop
  filterConditions.value[activeChain2.value + '-' + activeCategory1.value].sort_dir =
    row?.order?.replace?.('ending', '') || null
  console.log('-----row-------', activeChain2.value + '-' + activeCategory1.value)
  // resetSort()
  getSmartList(true)
}
function resetSort() {
  const key = activeChain2.value + '-' + activeCategory1.value
  filterFormObj.value[key] = {}
  initFilterForm()
}
function switchChain(chain: string) {
  activeChain2.value = chain
  filterConditions.value.chain = chain

  // 切换链时清空所有搜索状态
  searchKeywords.value = {}

  initFilterForm()
  getSmartList()
}

function setActiveChain(value: string) {
  if (value !== activeChain.value) {
    signalContainerRef.value?.setFilterToken?.('')
    signalFilter.value = { ...signalFilter.value, token: '' }
  }
  activeChain.value = value
}
</script>

<template>
  <div class="w-full bg-[--main-bg]">
    <div class="p-12px flex justify-between">
      <div class="flex gap-8px">
        <span
          v-for="(item, $index) in tabs"
          :key="$index"
          class="py-8px text-14px px-12px rounded-4px bg-[--main-input-button-bg] color-[--secondary-text] flex items-center justify-center cursor-pointer"
          :class="{ active: activeTab == item.id }"
          @click.stop.prevent="handleTabChange(item.id)"
        >
          {{ item.name }}
        </span>
      </div>
      <div v-if="isActivity" class="flex h-28px">
        <div class="flex items-center mr-24px">
          <div
            v-show="showResetBtn"
            class="flex items-center text-12px gap-2px cursor-pointer mr-20px color-[--main-text]"
            @click="signalContainerRef?.setFilterToken?.('')"
          >
            <Icon name="custom:reset" class="text-14px" />
            {{ $t('reset') }}
          </div>
          <Filter :filter-params="signalFilter" @onReset="onReset" @onConfirm="onConfirm" />
          <el-popover
            v-model:visible="audioVisible"
            trigger="click"
            popper-class="el-select__popper"
          >
            <template #reference>
              <div class="flex items-center text-12px ml-20px color-[--main-text] cursor-pointer">
                <Icon
                  :name="globalStore.audioSettings.audio.signal ? 'custom:ad' : 'custom:admute'"
                  class="text-16px mr-4px color-[--secondary-text]"
                />
                {{ $t('NewSignalAlert') }}
              </div>
            </template>
            <template #default>
              <ul class="el-scrollbar__view el-select-dropdown__list [&&]:m--12px">
                <li
                  v-for="item in audioList"
                  :key="item"
                  class="el-select-dropdown__item hover:bg-[--border]"
                  :class="{ 'bg-[--border]': globalStore.audioSettings.audio.signal === item }"
                  @click="
                    () => {
                      globalStore.audioSettings.audio.signal = item
                      audioVisible = false
                    }
                  "
                >
                  <span class="text-12px">{{ item || $t('close') }}</span>
                </li>
              </ul>
            </template>
          </el-popover>
          <div class="flex items-center text-12px ml-20px color-[--main-text]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="7" cy="7" r="7" fill="#349EFF" />
              <path
                d="M6.0594 9.56109L6.165 7.96635L9.06051 5.3572C9.18895 5.24065 9.03435 5.18405 8.86453 5.28584L5.29021 7.54394L3.74422 7.05398C3.41267 6.95979 3.40886 6.72979 3.81986 6.56402L9.84088 4.24123C10.1161 4.11684 10.3801 4.30902 10.2745 4.73119L9.24913 9.56085C9.1773 9.90406 8.97013 9.98683 8.68353 9.82867L7.12256 8.67512L6.3724 9.40245C6.28559 9.48926 6.214 9.56085 6.0594 9.56085V9.56109Z"
                fill="white"
              />
            </svg>
            <a
              v-if="!['zh-cn', 'zh-tw'].includes(localeStore.locale)"
              href="https://t.me/AveSignalMonitor"
              target="_blank"
              class="ml-1 underline"
            >
              TG {{ $t('Subscription') }}
            </a>
            <a v-else href="https://t.me/AveSignalMonitorCN" target="_blank" class="underline ml-1">
              TG{{ $t('Subscription') }}
            </a>
          </div>

          <QuickSwapSet
            v-model:quickBuyValue="quickBuyValue"
            :chain="activeChain"
            style="margin-left: 20px"
            :showQuickAmount="false"
          />
          <AutoSellSetting class="ml-20px" :chain="activeChain" />
        </div>
        <div
          class="px-8px py-2px rounded-4px gap-4px bg-[--main-input-button-bg] flex color-[--third-text]"
        >
          <div
            v-for="{ value } in smartChains"
            :key="value"
            class="flex items-center justify-center p-2px rounded-4px cursor-pointer"
            :class="`${activeChain === value ? 'bg-[--tab-active-bg] color-[--main-text]' : ''}`"
            @click="setActiveChain(value)"
          >
            <img
              class="w-20px h-20px rounded-full opacity-60 block"
              :src="`${configStore.token_logo_url}chain/${value}.png`"
              alt=""
            />
          </div>
        </div>
      </div>
      <div v-else class="flex-end">
        <div class="p-2px rounded-4px bg-[--main-input-button-bg] flex color-[--third-text]">
          <div
            v-for="interval in ['1D', '7D', '30D']"
            :key="interval"
            class="flex items-center justify-center gap-4px px-8px py-6px text-12px rounded-4px cursor-pointer"
            :class="`${activeInterval === interval ? 'bg-[--tab-active-bg] color-[--main-text]' : ''}`"
            @click="handleIntervalChange(interval)"
          >
            {{ interval }}
          </div>
        </div>
        <div
          class="p-2px rounded-4px bg-[--main-input-button-bg] flex ml-12px color-[--third-text]"
        >
          <div
            v-for="{ label, value } in smartChains"
            :key="value"
            class="flex items-center justify-center gap-4px px-8px py-6px text-12px rounded-4px cursor-pointer"
            :class="`${activeChain2 === value ? 'bg-[--tab-active-bg] color-[--main-text]' : ''}`"
            @click="switchChain(value)"
          >
            <img
              class="w-16px h-16px rounded-full opacity-60"
              :src="`${configStore.token_logo_url}chain/${value}.png`"
              alt=""
            />
            {{ label }}
          </div>
        </div>
      </div>
    </div>

    <SignalContainer
      v-if="isActivity"
      ref="signalContainerRef"
      v-model:showResetBtn="showResetBtn"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      :filterParams="signalFilter"
    />
    <KOL
      v-else
      ref="table_p"
      :key="filterConditions?.[activeChain2 + '-' + activeCategory1]?.sort + '1'"
      :activeTab="activeTab"
      :tableData="tableData"
      :tableIndex="tableIndex"
      :filterForm="filterFormObj[activeChain2 + '-' + activeCategory1]"
      :conditions="filterConditions[activeChain2 + '-' + activeCategory1]"
      :isActiveFilter="isActiveFilter"
      :handleFilterConfirm="handleFilterConfirm"
      :handleSort="handleSort"
      :handleReset="handleReset"
      :loading="loading"
      :openTimeList="openTimeList"
      :handleSortChange="handleSortChange"
      :activeInterval="activeInterval"
      @handleSortChange="handleSortChange"
    />
  </div>
</template>

<style scoped lang="scss">
.active {
  background: #3f80f7;
  color: #f5f5f5;
}
.interval-btns {
  display: flex;
  align-items: center;
  margin-left: 12px;
  background: var(--d-222-l-F2F2F2);
  padding: 4px;
  .interval-btn {
    font-size: 12px;
    color: var(--d-666-l-999);
    text-align: center;
    font-weight: 500;
    line-height: 16px;
    text-decoration: none;
    padding: 5px 10px;
    border-color: transparent !important;
    border-radius: 4px;
    &.active-interval {
      color: #fff;
      background: var(--d-111-l-FFF);
    }
  }
}
</style>
