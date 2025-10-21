import { useStorage, useThrottleFn, useWindowSize } from '@vueuse/core'
import type { ChainKey, PumpConfig, PumpObj, pumpData } from '~/api/types/pump'
import { _getPumpConfig, _getPumpList } from '@/api/pump'

export const usePumpStore = defineStore('pumpStore', () => {
    const route = useRoute()
    const shouldHide = computed(()=>{
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

    function getPumpConfig() {
        _getPumpConfig().then((res) => {
            pumpConfig.value = res || []
            pumpConfig.value.forEach(i => {
              if (!pumpV3.value[i.chain].platforms?.length) {
                const platforms =  i.platforms.map(y=>y?.platform) || []
                  pumpV3.value[i.chain].platforms = platforms
              }
            })
        })
    }

    const pump_solana_platforms = useStorage(
        'pump_solana_platforms',
        ['pump', 'moonshot', 'raydium','believe', 'jupstudio','moon_new','cookingcity', 'bonk','bags']
    )
    const pumpV3 = useStorage<Record<ChainKey, pumpData>>(
      'pumpV4',
      {
        solana: {
          platforms: [],
          new: {
            count: 0,
          },
          soon: {
            count: 0,
          },
          graduated: {
            count: 0,
          },
        },
        bsc: {
          platforms: [],
          new: {
            count: 0,
          },
          soon: {
            count: 0,
          },
          graduated: {
            count: 0,
          },
        },
        xlayer: {
          platforms: [],
          new: {
            count: 0,
          },
          soon: {
            count: 0,
          },
          graduated: {
            count: 0,
          },
        },
      },
      localStorage
    )
    const activeChain = useStorage<ChainKey>(
        'pump_activeChain',
        'solana',
        sessionStorage
    )
    const pump_query = useStorage('pump_query1', {
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
    })
      const pump_notice = useStorage('pump_notice2', {
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
      })
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
        pumpV3
    }
})