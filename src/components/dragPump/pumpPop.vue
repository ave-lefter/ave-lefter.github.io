<script setup lang="ts">
import { useDebounceFn, useStorage } from '@vueuse/core'
import BlackList from '~/pages/pump/blackList.vue'
import PlatformSelect from './platformSelect.vue'
import Setting from '~/pages/pump/setting.vue'
import PumpList from '~/pages/pump/pumpList.vue'
import type { ChainKey } from '~/api/types/pump'
import SuffixIcon from '../suffixIcon.vue'
import PumpFilter from '~/pages/pump/pumpFilter.vue'
import { _getPumpList } from '~/api/pump'

let timer = { id: null }
const isPaused = ref(false)
const loading = ref(false)
const isMounted = ref(false)
defineProps<{
  scrollHeight: number
}>()
const pumpStore = usePumpStore()
const wsStore = useWSStore()
const botSettingStore = useBotSettingStore()
const { pumpSetting, pumpBlackList } = useGlobalStore()
const { t } = useI18n()
const tabList = computed(() => {
  return [
    {
      label: t('new1'),
      value: 'new' as const,
    },
    {
      label: t('soon'),
      value: 'soon' as const,
    },
    {
      label: t('graduated'),
      value: 'graduated' as const,
    },
  ]
})
const filterBlackList = computed(() => {
  // blackList
  if (pumpSetting.isBlacklist && pumpBlackList.length > 0) {
    return pumpStore.listData.filter(
      (item) =>
        !pumpBlackList.some(
          (i) =>
            (i.address == item.token && i.type == 'ca') ||
            (i.address == item.symbol && i.type == 'keyword')
        )
    )
  }
  return pumpStore.listData
})
const activeTab = useStorage<(typeof tabList.value)[number]['value']>('dragPumpActive', 'new')
const setActiveTab = (value: (typeof tabList.value)[number]['value']) => {
  activeTab.value = value
}
const quickBuyValue = useStorage('quickBuyValue', '0.01')
watch(
  () => pumpStore.visible,
  (val) => {
    if (!val) {
      unsubscribe()
      if (timer.id) {
        cancelAnimationFrame(timer.id)
      }
    } else {
      init()
      subscribe()
      if (!isMounted.value) {
        isMounted.value = true
      }
    }
  },
  {
    immediate: true,
  }
)
watch(
  () => pumpStore.activeChain,
  () => {
    if (pumpStore.visible) {
      init(true)
      unsubscribe()
      subscribe()
    }
  }
)
watch(
  () => [pumpStore.pump_solana_platforms, activeTab.value],
  () => {
    init()
  }
)

watch(()=>pumpStore.pump_query[pumpStore.activeChain][activeTab.value],()=>{
  debouncedSearch()
},{deep:true})

function unsubscribe() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstate'],
    id: 1,
  })
}
function subscribe() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['pumpstate', pumpStore.activeChain],
    id: 1,
  })
}

const debouncedSearch = useDebounceFn(() => {
  init(true)
}, 500)

function init(isFilter = false) {
  const params = localStorage.getItem(`pumpFilter_${pumpStore.activeChain}_${activeTab.value}`)
  getPump(JSON.parse(params || '{}'), isFilter)
}

function confirmFilter(
  val: { progress_min: string | undefined; progress_max: string | undefined },
  type: string
) {
  let category = ''
  ;['new', 'soon', 'graduated'].forEach((item) => {
    if (type.includes(item)) {
      category = item
    }
    if (type === 'graduated') {
      val.progress_min = undefined
      val.progress_max = undefined
    }
  })
  getPump({ category, ...val }, true)
}
function getPump(params, isFilter = false) {
  if (timer.id) {
    cancelAnimationFrame(timer.id)
    timer.id = null
  }
  // loading
  if (isFilter || !isMounted.value) {
    loading.value = true
  }
  // resolve params
  const finalParams = getPumpParams(params, isFilter)
  _getPumpList(finalParams)
    .then((res) => {
      pumpStore.listData = (res || [])?.map?.((i) => {
        return {
          ...i,
          id: `${i.target_token}-${i.chain}`,
          pair_id: `${i.pair}-${i.chain}`,
          token: i.target_token,
          progress: Number(i.progress || 0),
          symbol: i.target_token == i.token0_address ? i?.token0_symbol : i?.token1_symbol,
          name: i.target_token == i.token0_address ? i?.token0_name : i?.token1_name,
          logo_url: i.target_token == i.token0_address ? i?.token0_logo_url : i?.token1_logo_url,
          target_opening_at:
            i?.target_opening_at !== '1970-01-01T00:00:00Z' &&
            i?.target_opening_at !== '0001-01-01T00:00:00Z'
              ? new Date(i?.target_opening_at).getTime()
              : 0,
          created_at:
            i?.created_at !== '1970-01-01T00:00:00Z' && i?.created_at !== '0001-01-01T00:00:00Z'
              ? new Date(i?.created_at).getTime() / 1000
              : '0',
          liq:
            i.target_token !== i.token0_address
              ? i.reserve0 * i.token0_price_usd * 2
              : i.reserve1 * i.token1_price_usd * 2,
          medias: getMedias(i.appendix, t),
          // normal_tag: normal_tag?.slice(0, 3) || [],
          // signal_arr: signal_arr?.slice(0, 1) || [],
          // tag_arr,
        }
      })
    })
    .finally(() => {
      loading.value = false
      timer = requestTimeout(5000, () => {
        getPump(finalParams)
      })
    })
}

function requestTimeout(interval: number, callback: () => void) {
  const timerId = { id: null }
  let lastCallTime = performance.now()
  const request = () => {
    timerId.id = requestAnimationFrame(() => {
      if (performance.now() - lastCallTime < interval) {
        request()
      } else {
        lastCallTime = performance.now()
        callback()
      }
    })
  }
  request()
  return timerId
}

function getPumpParams(oldParams, isFilter: boolean) {
  let platforms = 'fourmeme'
  //   platforms
  if (pumpStore.activeChain === 'solana') {
    if (!pumpStore.pump_solana_platforms?.length) {
      platforms = 'pump,moonshot'
    } else {
      platforms = pumpStore.pump_solana_platforms.join(',')
    }
  }
  let q = oldParams.q
  //   q
  if (pumpStore.pump_query[pumpStore.activeChain][activeTab.value]) {
    if (isFilter) {
      q = oldParams.q + pumpStore.pump_query[pumpStore.activeChain][activeTab.value]
    } else {
      q = pumpStore.pump_query[pumpStore.activeChain][activeTab.value]
    }
  }
  //   has_sm
  const has_sm = oldParams.has_sm
  if (has_sm && oldParams.sm_list?.length > 0) {
    delete oldParams.sm_list
  }
  let sm_list = ''
  if (!has_sm && Array.isArray(oldParams.sm_list) && oldParams.sm_list.length > 0) {
    sm_list = oldParams.sm_list.join(',')
  }
  return Object.fromEntries(
    Object.entries({
      ...oldParams,
      platforms,
      q,
      sm_list,
      has_sm,
      chain: pumpStore.activeChain,
      category: activeTab.value,
    }).filter(([_, value]) => value != null && value !== '' && Boolean(value))
  )
}
</script>

<template>
  <div class="w-full h-full bg-[--d-111-l-FFF] p-12px">
    <div class="flex justify-between mb-16px">
      <PlatformSelect />
      <div class="flex items-center">
        <Setting :chain="pumpStore.activeChain">
          <template #default="{ visible }">
            <div
              v-tooltip="$t('customize')"
              class="flex items-center gap-4px mr-8px text-12px bg-[--d-222-l-F2F2F2] color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] px-4px py-2px rounded-4px cursor-pointer"
            >
              <Icon name="custom:customized" class="text-13px" />
              <Icon
                :name="visible ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
                class="text-16px"
              />
            </div>
          </template>
        </Setting>
        <BlackList reference-class="text-12px" buttonClass="w-20px h-20px! p-0! justify-center!" />
        <Icon
          name="custom:close"
          class="text-14px shrink-0 cursor-pointer color-[--d-FFF-l-333]"
          @click.self="pumpStore.visible = false"
        />
      </div>
    </div>
    <div
      class="flex justify-between pb-8px border-b-1px border-b-solid border-b-[--d-222-l-F2F2F2] mb-12px"
    >
      <div class="flex items-center gap-8px">
        <span
          v-for="(item, index) in tabList"
          :key="index"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-4px py-2px rounded-4px cursor-pointer ${
            activeTab === item.value ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]' : ''
          }`"
          @click="setActiveTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <div class="flex items-center gap-8px">
        <div class="flex items-ceter gap-4px p-2px rounded-4px bg-[--d-333-l-F2F2F2]">
          <div
            v-for="(item, idx) in pumpStore.pumpConfig"
            :key="idx"
            class="cursor-pointer rounded-4px p-1px"
            :class="pumpStore.activeChain === item.chain ? 'bg-[--d-111-l-FFF]' : ''"
            @click="pumpStore.activeChain = item.chain as ChainKey"
          >
            <ChainToken :chain="item.chain" :width="16" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between mb-12px">
      <div class="flex items-center gap-8px">
        <signal-quick-buy-input
          v-model="quickBuyValue"
          size="small"
          class="[--el-border-color:transparent]"
        />
        <el-select
          v-model="botSettingStore.botSettings[pumpStore.activeChain]!.selected"
          fit-input-width
          size="small"
          :suffix-icon="SuffixIcon"
          class="[&&]:[--el-select-width:40px]"
          popper-class="small-select"
        >
          <el-option v-for="item in ['s1', 's2', 's3']" :key="item" :value="item" :label="item" />
        </el-select>
        <div
          class="w-20px h-20px flex items-center justify-center bg-[--d-222-l-F2F2F2] rounded-4px color-[--d-666-l-999] cursor-pointer hover:color-[--d-F5F5F5-l-333]"
          :class="{
            'color-[--d-F5F5F5-l-333]': pumpStore.pump_notice[pumpStore.activeChain][activeTab],
          }"
          @click="
            pumpStore.pump_notice[pumpStore.activeChain][activeTab] =
              !pumpStore.pump_notice[pumpStore.activeChain][activeTab]
          "
        >
          <Icon name="icon-park-solid:volume-notice" class="text-12px" />
        </div>
      </div>
      <div class="flex items-center gap-8px">
        <el-input
          ref="inputSearch"
          v-model.trim="pumpStore.pump_query[pumpStore.activeChain][activeTab]"
          class="w-90px [--el-input-border-color:--d-222-l-F2F2F2]"
          size="small"
          :placeholder="$t('search')"
          @input="
            (val) =>
              (pumpStore.pump_query[pumpStore.activeChain][activeTab] = val.replace(/\s/g, ''))
          "
        >
          <template #prefix>
            <Icon class="text-12px text-[var(--d-666-l-999)]" name="custom:search" />
          </template>
          <template #suffix>
            <Icon
              v-if="pumpStore.pump_query[pumpStore.activeChain][activeTab]"
              name="pajamas:clear"
              class="color-[--d-666-l-999] text-12px hover:opacity-70% cursor-pointer mr-10px"
              @click="pumpStore.pump_query[pumpStore.activeChain][activeTab] = ''"
            />
          </template>
        </el-input>
        <PumpFilter
          hideReferenceText
          :storage="`pumpFilter_${pumpStore.activeChain}_${activeTab}`"
          @update:filterData="confirmFilter"
        />
      </div>
    </div>
    <div class="mx--12px">
      <PumpList
        isInPopup
        :tableList="filterBlackList"
        :quickBuyValue="quickBuyValue"
        :loading="loading"
        :scrollHeight="scrollHeight"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep {
  .el-select--small .el-select__wrapper {
    padding: 2px 4px;
    min-height: 20px;
    --el-fill-color-blank: var(--d-222-l-F2F2F2);
  }
  .el-input__prefix-inner > :last-child{
    margin-right: 3px;
  }
  .el-input__suffix-inner > :first-child{
    margin-left: 3px;
    margin-right: 3px;
  }
}
</style>
