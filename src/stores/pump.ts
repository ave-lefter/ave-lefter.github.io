import { useStorage, useThrottleFn, useWindowSize, type RemovableRef } from '@vueuse/core'
import type { ChainKey, PumpConfig, PumpObj, pumpData } from '~/api/types/pump'
import { _getPumpConfig, _getPumpList } from '@/api/pump'
// import { usePumpTableDataFetching } from '@/utils/index'

export const usePumpStore = defineStore('pumpStore', () => {
  const route = useRoute()
  const shouldHide = computed(() => {
    return route.path.includes('/pump')
  })
  const visible = useStorage('dragPumpVisible', false)
  const boundingRect = useStorage('dragPumpBoundingRect', {
    width: 480,
    height: 700,
    x: 100,
    y: 100
  })
  const { width: winWidth, height: winHeight } = useWindowSize()
  const isLeftFixed = useStorage('isDragPumpLeft', false)
  const isRightFixed = useStorage('isDragPumpRight', false)
  const fixedWidth = useStorage('dragPumpFixedWidth', 480)
  const translateStyle = shallowRef(0)

  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
        x + boundingRect.value.width >= winWidth.value ? -12 : 0
    }
  }, 100, false, true)
  function onDragStop(x: number, y: number) {
    boundingRect.value.x = x
    boundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + boundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    boundingRect.value.width = width
    boundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    isLeftFixed.value = Math.abs(x) < 1
    if (!isLeftFixed.value) {
      boundingRect.value.x = x
      boundingRect.value.y = y
    }
  }

  function onRightDragStop(x: number, y: number) {
    console.log('onRightDragStop', x, y)
    isRightFixed.value = Math.abs(x) < 1
    const _x = winWidth.value - fixedWidth.value + x
    if (!isRightFixed.value) {
      // boundingRect.value.x = _x
      boundingRect.value.x = x
      boundingRect.value.y = y
    }
  }

  function onFixedResizing(width: number) {
    fixedWidth.value = width
  }

  const placement = computed(() => {
    if (!isLeftFixed.value && !isRightFixed.value) {
      return 'center'
    } else if (isLeftFixed.value) {
      return 'left'
    } else if (isRightFixed.value) {
      return 'right'
    } else {
      return 'center'
    }
  })

  const pumpConfig = shallowRef<PumpConfig[]>([])
  const pumpFilterDefault = {
    q: '',
    dev_sale_out: 0,
    platforms: 'pump,moonshot',
    progress_min: '', //进度
    progress_max: '',

    lage: '', //代币时长
    rage: '',
    dev_balance_ratio_cur_min: '', //dev 持仓%
    dev_balance_ratio_cur_max: '',
    holder_min: '', //持有人
    holder_max: '',
    holders_top10_ratio_min: '', //top10 持仓%
    holders_top10_ratio_max: '',
    lsnip: '', //狙击人数
    rsnip: '',
    smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
    smart_money_tx_count_24h_max: '',
    lins: '', //老鼠仓
    rins: '',
    lkol: '', //KOL交易人数
    rkol: '',
    lrug: '', //跑路概率
    rrug: '',

    market_cap_min: '', // 市值
    market_cap_max: '',
    volume_u_24h_min: '', //交易额
    volume_u_24h_max: '',
    lbtx: '', //买入交易数
    rbtx: '',
    lstx: '', //卖出交易数
    rstx: '',
    has_sm: 0,
    sm_list: [],
  }

  function getPumpConfig() {
    _getPumpConfig().then((res) => {
      pumpConfig.value = res || []
      pumpConfig.value.forEach(i => {
        if (!pumpV3.value[i.chain]?.platforms?.length) {
          // const platforms = i.platforms.map(y => y?.platform) || []
          const platforms =
            i.platforms?.map((y) => {
              if (i.chain == 'solana') {
                if (y.platform !== 'believe') {
                  return y.platform || ''
                }
                return ''
              } else {
                return y.platform || ''
              }
            }) || []
          pumpV3.value[i.chain] = {
            ...(pumpV3.value[i.chain] || {}),
            platforms,
            new: {
              count: 0,
              loading: false,
              pumpFilter: pumpFilterDefault,
            },
            soon: {
              count: 0,
              loading: false,
              pumpFilter: pumpFilterDefault,
            },
            graduated: {
              count: 0,
              loading: false,
              pumpFilter: pumpFilterDefault,
            },
          }

          if (!pump_notice.value?.[i.chain]) {
            pump_notice.value[i.chain] = {
              new: '',
              soon: '',
              graduated: '',
            }
          }
          console.log('------pump_notice.value------', pump_notice.value)
        }
      })
    })
  }

  const pump_solana_platforms = useStorage(
    'pump_solana_platforms',
    ['pump', 'moonshot', 'raydium', 'jupstudio', 'moon_new', 'cookingcity', 'bonk', 'bags']
  )
  
  const pumpV3: RemovableRef<Record<ChainKey, pumpData>> = useStorage(
    'pumpV15',
    {
      solana: {
        platforms: [],
        new: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        soon: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        graduated: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
      },
      bsc: {
        platforms: [],
        new: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        soon: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        graduated: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
      },
      xlayer: {
        platforms: [],
        new: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        soon: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        graduated: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
      },
      monad: {
        platforms: [],
        new: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        soon: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        graduated: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
      },
      base: {
        platforms: [],
        new: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        soon: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
        graduated: {
          count: 0,
          loading: false,
          pumpFilter: pumpFilterDefault,
        },
      },
    },
    localStorage
  )
  console.log('pumpV3',pumpV3.value)
  const activeChain = useStorage<ChainKey>(
    'pump_activeChain',
    'bsc',
    sessionStorage
  )
  const pump_query = useStorage('pump_query3', {
    solana: {
      new: '',
      soon: '',
      graduated: '',
    },
    bsc: {
      new: '',
      soon: '',
      graduated: '',
    },
    xlayer: {
      new: '',
      soon: '',
      graduated: '',
    },
    monad: {
      new: '',
      soon: '',
      graduated: '',
    },
    base: {
      new: '',
      soon: '',
      graduated: '',
    },
  })
  const pump_notice = useStorage(
    'pump_notice5',
    {
      solana: {
        new: '',
        soon: '',
        graduated: '',
      },
      bsc: {
        new: '',
        soon: '',
        graduated: '',
      },
      monad: {
        new: '',
        soon: '',
        graduated: '',
      },
      xlayer: {
        new: '',
        soon: '',
        graduated: '',
      },
      base: {
        new: '',
        soon: '',
        graduated: '',
      },
    },
    localStorage
  )
  const listData = shallowRef<PumpObj[]>([])

  return {
    visible,
    boundingRect,
    isLeftFixed,
    isRightFixed,
    fixedWidth,
    winHeight,
    winWidth,
    translateStyle,
    onDrag,
    onDragStop,
    onResizing,
    onLeftDragStop,
    onRightDragStop,
    onFixedResizing,
    placement,
    pumpConfig,
    getPumpConfig,
    pump_solana_platforms,
    activeChain,
    pump_query,
    listData,
    pump_notice,
    shouldHide,
    pumpV3,
    pumpFilterDefault
  }
})
