<template>
  <div>
    <div class="flex justify-between mt-5 mb-2.5">
      <h2 class="summary-title text-5 leading-5 font-500 text-[var(--d-fff-l-333)]">{{ $t('walletActivity') }}</h2>
    </div>
    <div v-loading="loading" class="activity relative p-5 rounded-2 h-[220px] bg-[--d-15171C-l-F8F8F8]">
      <template v-if="activity.dataset.source.length <= 0">
        <AveEmpty
          :style="{
            height: '180px',
            paddingTop: '60px',
          }"
          :showText="false"
        />
      </template>
      <AveCharts
        v-else
        ref="activityChart"
        :container-style="{
          height: '180px',
        }"
        :grid="activity.grid"
        :xAxis="activity.xAxis"
        :series="activity.series"
        :tooltip="activity.tooltip"
        :dataset="activity.dataset"
      />
    </div>
    <PnlDetail
      v-model="pnlDrawerVisible"
      :loading="eventsPage.loading"
      :finished="eventsPage.finished"
      :error="eventsPage.error"
      :eventsDetail="eventsDetail"
      :chain="chain"
      :pageNO="eventsPage.pageNO"
      :pageSize="eventsPage.pageSize"
      @detailOnLoad="onGetEventsAnalysisDetail"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import AveCharts from '@/components/charts/aveCharts.vue'
import AveEmpty from '@/components/aveEmpty.vue'
// import Loading from '@/components/loading/js/Component.vue'
import PnlDetail from './pnlDetail.vue'
// import { formatNumberS } from '@/utils/formatNumber'
import { generateAvatarIcon } from '@/utils'
import { getEventsAnalysis, getEventsAnalysisDetail } from '@/api/wallet'

const configStore = useConfigStore()
const $t = getGlobalT()
const props = defineProps({
  interval: {
    type: [Number, String],
    default: '24H',
  },
  address: {
    type: String,
    default: '',
  },
  chain: {
    type: String,
    default: '',
  },
})

const activity = ref({
  grid: {
    top: '10',
    left: '15',
    right: '15',
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      show: true,
      color: () => (isDark.value ? '#999' : '#959A9F'),
      fontSize: 10,
      formatter: (value) => {
        const dayjsTime = dayjs(value * 1000)
        const time = dayjsTime.format('HH:mm')
        const date = dayjsTime.format('DD/MM')
        return props.interval === '30D' ? date : `${time}\n${date}`
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
    axisPointer: {
      type: 'line',
      z: 0,
      animation: false,
      lineStyle: {
        type: 'solid',
        width: 28,
        color: 'rgb(179, 179, 179,0.3)',
      },
    },
    padding: 8,
    backgroundColor: 'rgba(0,0,0,.8)',
    borderWidth: 0,
    formatter: (params) => {
      const { name, value } = params[0] || {}
      const dayjsTime = dayjs(name * 1000)
      const timeStr = dayjsTime.format('HH:mm DD/MM')
      const { tokens = [] } = value || {}
      return `
          <div>
              <div style="color:#959A9F;font-size: 12px;">
                  ${timeStr}
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  color:#fff;
                  font-size: 12px;
                  justify-content: space-between;
                  gap:8px;
                "
              >
                 ${$t('txns')}: ${value?.txns}
                 <div>
                  ${tokens
                    .slice(0, 4)
                    .map((el) => {
                      let icon
                      if (el.logo_url) {
                        icon = `${configStore?.token_logo_url}${el.logo_url}`
                      } else {
                        icon = generateAvatarIcon(el.token)
                      }
                      return `<img
                          width="16"
                          height="16"
                          style="margin-right:8px;border-radius: 50%;"
                          src="${icon}" alt=""
                        />`
                    }).join('')}
                  </div>
              </div>
              <div style="color:#fff;font-size: 12px;">
                 ${$t('Vol')}: $${formatNumber(value?.volume, 2)}
              </div>
          </div>
        `
    },
  },
  series: {
    type: 'bar',
    barMaxWidth: 16,
    barMinHeight: 1,
    itemStyle: {
      color: (params) => {
        if (Math.abs(params.value?.txns) > 0) {
          return 'rgba(18, 184, 134, 0.5)'
        }
        return isDark.value ? '#999' : '#E5E5E5'
      },
    },
    selectedMode: 'single',
    select: {
      itemStyle: {
        color: 'rgba(18, 184, 134, 1)',
        borderColor: 'transparent',
      },
    },
  },
  dataset: {
    source: [],
    dimensions: ['time', 'txns'],
  },
})

const pnlDrawerVisible = ref(false)
const eventsDetail = ref({})
const eventsPage = ref({
  loading: false,
  pageNO: 1,
  finished: false,
  error: false,
  query: {},
})
const selectedIndex = ref(null)
const loading = ref(false)
const activityChart = ref(null)
const instance = ref(null)

const isDark = computed(() => mode.value === 'dark')

const themeStore = useThemeStore()

const mode = computed(() => {
  return themeStore.isDark ? 'dark' : 'light'
})

const dimensionTime = computed(() => {
  const map = {
    '24H': 1,
    '7D': 4,
    '30D': 24,
  }
  return map[props.interval]
})
const chainAddress = computed(() => [props.chain, props.address])

watch(() => props.interval, onGetEventsAnalysis)
watch(chainAddress, onGetEventsAnalysis)

onMounted(() => {
  onGetEventsAnalysis()
})

function onGetEventsAnalysis() {
  const { interval, address, chain } = props
  loading.value = true
  getEventsAnalysis({
    interval,
    user_address: address,
    user_chain: chain,
  })
    .then(async (res) => {
      const data = res?.map?.((el) => el.time)
      activity.value.dataset.source = res || []
      activity.value.xAxis = {
        ...activity.value.xAxis,
        data,
      }
      if (activity.value.dataset.source.length > 0) {
        setTimeout(() => {
          bindEchartsEvent()
        }, 20)
      }
    })
    .catch(console.log)
    .finally(() => {
      loading.value = false
    })
}

function bindEchartsEvent() {
  instance.value = echarts.getInstanceByDom(activityChart.value?.$refs?.areaChart)
  if (instance.value) {
    const zr = instance.value.getZr()
    zr.off('click', barClick)
    zr.on('click', barClick)
  }
}

function barClick(e) {
  const point = [e.offsetX, e.offsetY]
  const dataIndex = instance.value.convertFromPixel({ seriesIndex: 0 }, point)[0]
  if (selectedIndex.value === dataIndex) {
    selectedIndex.value = null
  } else {
    selectedIndex.value = dataIndex
    const params = getTimeByIndex(selectedIndex.value)
    pnlDrawerVisible.value = true
    eventsPage.value.query = params
    eventsDetail.value = {}
    eventsPage.value.pageNO = 1
    eventsPage.value.finished = false
    eventsPage.value.error = false
    onGetEventsAnalysisDetail()
  }
}

function getTimeByIndex(index) {
  const { time } = activity.value.dataset.source[index] || {}
  const start_time = dayjs(time * 1000).unix()
  const end_time = dayjs(time * 1000)
    .add(dimensionTime.value, 'hour')
    .unix()
  return {
    start_time,
    end_time,
  }
}

function onGetEventsAnalysisDetail() {
  eventsPage.value.loading = true
  const lastIndex = eventsDetail.value.events?.length - 1
  const lastData = eventsDetail.value.events?.[lastIndex] || {}
  const pageParams = {
    max_block_number: lastData.block_number,
    max_event_id: lastData.event_id,
  }
  getEventsAnalysisDetail({
    user_chain: props.chain,
    user_address: props.address,
    ...eventsPage.value.query,
    ...pageParams,
  })
    .then(({ events = [], ...rest } = {}) => {
      if (eventsPage.value.pageNO === 1) {
        eventsDetail.value = { ...rest, events }
      } else {
        eventsDetail.value.events = eventsDetail.value.events.concat(events)
      }
      eventsPage.value.pageNO++
      if (events?.length === 0) {
        eventsPage.value.finished = true
      }
    })
    .catch(() => {
      eventsPage.value.error = false
      eventsDetail.value.events = []
    })
    .finally(() => {
      eventsPage.value.loading = false
    })
}
</script>

<style scoped lang="scss">
/* Only keep styles that can't be expressed with UnoCSS */
.activity :deep(.el-card) {
  border: 0 none;
  background-color: var(--custom-bg-10-color);
  border-radius: 12px;
}

.activity :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity :deep(.el-card__body) {
  padding-top: 0;
}

.activity :deep(.tooltip) {
  pointer-events: auto !important;
}

.fixed-tooltip {
  display: none;
  position: absolute;
  top: -30px;
  border-radius: 4px;
  color: rgb(102, 102, 102);
  font: 14px / 21px sans-serif;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
