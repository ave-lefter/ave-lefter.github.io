<template>
  <el-drawer
    v-model="visible"
    class="bg-[--d-222-l-FFF] color-[--d-F5F5F5-l-333]"
    :size="500"
    header-class="!mb-5"
  >
    <template #header>
      <span class="pnl-title text-[var(--d-fff-l-333)]">{{ $t('pnlDetail') }}</span>
    </template>
    <el-divider class="!m-0 !mb-5 !border-t-[--d-33353D-l-F5F5F5]" />
    <div>
      <div class="pnl-row flex justify-between px-5 text-3.5 leading-5 mb-3">
        <span class="pnl-row-name text-[#959a9f]">{{ $t('Txs') }}</span>
        <span class="pnl-row-value text-[var(--d-fff-l-333)]">{{ eventsDetail.txns }}</span>
      </div>
      <div class="pnl-row flex justify-between px-5 text-3.5 leading-5 mb-3">
        <span class="pnl-row-name text-[#959a9f]">{{ $t('Vol') }}</span>
        <span class="pnl-row-value text-[var(--d-fff-l-333)]">${{ volume }}</span>
      </div>
      <div class="pnl-row flex justify-between px-5 text-3.5 leading-5 mb-3">
        <span class="pnl-row-name text-[#959a9f]">{{ $t('time') }}</span>
        <span class="pnl-row-value text-[var(--d-fff-l-333)]">{{ time }}</span>
      </div>
      <div
        v-infinite-scroll="onLoad"
        :infinite-scroll-disabled="loading || finished || error"
        infinite-scroll-distance="300"
        :infinite-scroll-delay="200"
        :infinite-scroll-immediate="false"
      >
        <el-table
          ref="table_ref"
          :load="loading"
          :data="eventsDetail.events"
          fit
          style="width: 100%"
          class="pointer"
          @row-click="tableRowClick"
        >
          <template #empty>
            <AveEmpty v-if="!loading" class="table-empty mt-10" />
          </template>
          <TokenColumn
            :columnProps="{
              label: $t('walletToken'),
              width: '158',
            }"
          />
          <el-table-column width="60" :label="$t('type')">
            <template #default="{ row }">
              <span
                class="text-3"
                :style="{
                  color: filterType(row?.flow_type)?.color == 'green' ? upColor : downColor,
                }"
              >
                {{ filterType(row?.flow_type)?.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="78" :label="$t('Vol')">
            <template #default="{ row }">
              <span class="text-3"> {{ formatNumber(row.volume, 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('price')">
            <template #default="{ row }">
              <span class="text-3">
                ${{ row?.token_price_u > 0 ? formatNumber(row?.token_price_u || 0, 2) : 0 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('time')">
            <template #default="{ row }">
              <span class="text-3">
                {{ dayjs(row.block_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-5 text-3.5 text-center text-[--d-666-l-959A9F)]]">
          <span v-if="loading && pageNO > 1">{{ $t('loading') }}</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { upColor, downColor } from '@/utils/constants'
import dayjs from 'dayjs'
import TokenColumn from '@/components/tokenColumn.vue'
import AveEmpty from '@/components/aveEmpty.vue'

const $t = getGlobalT()
const props = defineProps({
  value: Boolean,
  eventsDetail: {
    type: Object,
    default: () => ({}),
  },
  handleSortChange: {
    type: Function,
    default: () => {},
  },
  conditions: {
    type: Object,
    default: () => ({}),
  },
  handleSort: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  pageNO: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  chain: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['input', 'detailOnLoad'])

const table_ref = ref(null)

const visible = computed({
  get: () => props.value,
  set: (val) => emit('input', val),
})

const volume = computed(() => {
  return typeof props.eventsDetail.volume === 'number'
    ? formatNumber(props.eventsDetail.volume, 2)
    : props.eventsDetail.volume
})

const time = computed(() => {
  const { start_time, end_time } = props.eventsDetail
  console.log('props.eventsDetail', props.eventsDetail)
  if (!start_time || !end_time) {
    return '--'
  }
  const [startDate, startTime] = formatTime(start_time)
  const [endDate, endTime] = formatTime(end_time)
  if (startDate === endDate) {
    return `${startDate} ${startTime}~${endTime}`
  } else {
    return `${startDate} ${startTime}~${endDate} ${endTime}`
  }
})

const formatTime = (date) => {
  const dayjsDate = dayjs(date * 1000)
  return [dayjsDate.format('YYYY-MM-DD'), dayjsDate.format('HH:mm')]
}

const filterType = (type) => {
  const o = {
    0: {
      name: $t('swap_buy'),
      color: 'green',
    },
    1: {
      name: $t('swap_sell'),
      color: 'red',
    },
  }
  return o[type]
}

const tableRowClick = (item) => {
  window.open(formatExplorerUrl(props.chain, item.tx_hash, 'tx'))
}

const onLoad = () => {
  emit('detailOnLoad')
}
</script>
