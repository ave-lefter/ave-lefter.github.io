<script setup lang="ts">
import { useDebounceFn, useStorage, useThrottleFn } from '@vueuse/core'
import BlackList from '~/pages/pump/blackList.vue'
import PlatformSelect from './platformSelect.vue'
import Setting from '~/pages/pump/setting.vue'
import PumpList from '~/pages/pump/pumpList.vue'
import type { ChainKey, PumpObj, WSPump } from '~/api/types/pump'
import SuffixIcon from '../suffixIcon.vue'
import PumpFilter from '~/pages/pump/pumpFilter.vue'
import { _getPumpList } from '~/api/pump'

let timer = { id: null }
const pumpAudio = useTemplateRef('pumpAudio')
const isPaused = ref(false)
const loading = ref(false)
const isMounted = ref(false)
const wsCacheList = shallowRef<PumpObj[]>([])
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
const isOut = computed(() => {
  return activeTab.value === 'graduated'
})
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

watch(() => pumpStore.pump_query[pumpStore.activeChain][activeTab.value], () => {
  debouncedSearch()
}, { deep: true })

watch(() => wsStore.wsResult[WSEventType.PUMPSTATE], (val: WSPump[]) => {
  if (Array.isArray(val)) {
    const rTime = Date.now()
    const list = val
    .filter(el=>el.state === activeTab.value)
    .map(i => ({
      ...i,
      ...i.pair,
      rTime: rTime,
      id: `${i.pair.target_token}-${i.chain}`,
      pair_id: `${i.pair.pair}-${i.chain}`,
      token: i.pair.target_token,
      progress: Number(i.progress || 0),
      symbol:
        i.pair.target_token == i.pair.token0_address
          ? i?.pair.token0_symbol
          : i?.pair.token1_symbol,
      name: i.target_token == i.token0_address
        ? i?.token0_name
        : i?.token1_name,
      logo_url:
        i.target_token == i.pair.token0_address
          ? i?.pair.token0_logo_url
          : i?.pair.token1_logo_url,

    }))
    const addList = getFilterData(list, localStorage.getItem(`pumpFilter_${pumpStore.activeChain}_${activeTab.value}`))
    if(addList.length > 0 && pumpStore.pump_notice[pumpStore.activeChain][activeTab.value] && pumpAudio.value){
      pumpAudio.value.play()
    }
    wsCacheList.value.unshift(...addList)
    if(!isPaused.value){
      addListData()
    }
  }
})

const addListData = useThrottleFn(()=>{
  pumpStore.listData.unshift(...wsCacheList.value)
  wsCacheList.value.length = 0
},100)

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
function getPump(params: Record<string, any>, isFilter = false) {
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
      pumpStore.listData = (res || []).map?.(pumpMapFunction)
    })
    .finally(() => {
      loading.value = false
      timer = requestTimeout(5000, () => {
        updatePump(finalParams)
      })
    })
}

function updatePump(params: Record<string, any>) {
  // resolve params
  const finalParams = getPumpParams(params, false)
  _getPumpList(finalParams)
    .then((res = []) => {
      const pumpMap = new Map()
      res.forEach(resItem => {
        pumpMap.set(`${resItem.target_token}-${resItem.chain}`, pumpMapFunction(resItem))
      })
      pumpStore.listData = pumpStore.listData.map(listItem => {
        if (pumpMap.has(listItem.id)) {
          return pumpMap.get(listItem.id)
        }
        return listItem
      })
    })
    .finally(() => {
      timer = requestTimeout(5000, () => {
        updatePump(finalParams)
      })
    })
}

function pumpMapFunction(resItem: PumpObj) {
  return {
    ...resItem,
    id: `${resItem.target_token}-${resItem.chain}`,
    pair_id: `${resItem.pair}-${resItem.chain}`,
    token: resItem.target_token,
    progress: Number(resItem.progress || 0),
    symbol: resItem.target_token == resItem.token0_address ? resItem?.token0_symbol : resItem?.token1_symbol,
    name: resItem.target_token == resItem.token0_address ? resItem?.token0_name : resItem?.token1_name,
    logo_url: resItem.target_token == resItem.token0_address ? resItem?.token0_logo_url : resItem?.token1_logo_url,
    target_opening_at:
      resItem?.target_opening_at !== '1970-01-01T00:00:00Z' &&
        resItem?.target_opening_at !== '0001-01-01T00:00:00Z'
        ? new Date(resItem?.target_opening_at).getTime()
        : 0,
    created_at:
      resItem?.created_at !== '1970-01-01T00:00:00Z' && resItem?.created_at !== '0001-01-01T00:00:00Z'
        ? new Date(resItem?.created_at).getTime() / 1000
        : '0',
    liq:
      resItem.target_token !== resItem.token0_address
        ? resItem.reserve0 * resItem.token0_price_usd * 2
        : resItem.reserve1 * resItem.token1_price_usd * 2,
    medias: getMedias(resItem.appendix, t),
    // normal_tag: normal_tag?.slice(0, 3) || [],
    // signal_arr: signal_arr?.slice(0, 1) || [],
    // tag_arr,
  }
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

function getFilterData(list, conditions) {
  conditions = JSON.parse(conditions)
  return list?.filter((i) => {
    let pass = true
    if (conditions?.q) {
      const arr = conditions?.q.split(',')
      pass = pass && arr?.findIndex(y => i.target_token == y || i.name == y || i.symbol == y) !== -1
    }
    if (conditions?.dev_sale_out) {
      pass = pass && !Number(i?.dev_balance_ratio_cur)
    }
    if (conditions?.progress_min) {
      pass = pass && i.progress >= Number(conditions.progress_min)
    }
    if (conditions?.progress_max) {
      pass = pass && i.progress <= Number(conditions.progress_max)
    }
    if (conditions?.lage) {
      pass = pass && (new Date().getTime() / 1000 - i.time) / 60 >= Number(conditions.lage)
    }
    if (conditions?.rage) {
      pass = pass && (new Date().getTime() / 1000 - i.time) / 60 <= Number(conditions.rage)
    }

    if (conditions?.progress_min) {
      pass = pass && i.progress >= Number(conditions.progress_min)
    }
    if (conditions?.progress_max) {
      pass = pass && i.progress <= Number(conditions.progress_max)
    }

    if (conditions?.market_cap_min) {
      pass = pass && i.market_cap >= Number(conditions.market_cap_min)
    }
    if (conditions?.market_cap_max) {
      pass = pass && i.market_cap <= Number(conditions.market_cap_max)
    }
    if (conditions?.dev_balance_ratio_cur_min) {
      pass = pass && i.dev_balance_ratio_cur >= Number(conditions.dev_balance_ratio_cur_min)
    }
    if (conditions?.dev_balance_ratio_cur_max) {
      pass = pass && i.dev_balance_ratio_cur <= Number(conditions.dev_balance_ratio_cur_max)
    }
    if (conditions?.holders_top10_ratio_min) {
      pass = pass && i.holders_top10_ratio >= Number(conditions.holders_top10_ratio_min)
    }
    if (conditions?.holders_top10_ratio_max) {
      pass = pass && i.holders_top10_ratio <= Number(conditions.holders_top10_ratio_max)
    }
    if (conditions?.tvl_min) {
      pass = pass && i.tvl >= Number(conditions.tvl_min)
    }
    if (conditions?.tvl_max) {
      pass = pass && i.tvl <= Number(conditions.tvl_max)
    }
    //  platforms: 'pump,moonshot',
    if (pumpStore.pump_solana_platforms?.length > 0 && i.chain === 'solana') {
      pass = pass && pumpStore.pump_solana_platforms.includes(i.amm)
    }
    if (conditions?.holder_min) {
      pass = pass && (i?.holder || 0) >= Number(conditions.holder_min)
    }
    if (conditions?.holder_max) {
      pass = pass && (i?.holder || 0) <= Number(conditions.holder_max)
    }

    if (conditions?.volume_u_24h_min) {
      pass = pass && i.volume_u_24h >= Number(conditions.volume_u_24h_min)
    }
    if (conditions?.volume_u_24h_max) {
      pass = pass && i.volume_u_24h <= Number(conditions.volume_u_24h_max)
    }
    if (conditions?.tx_24h_count_min) {
      pass = pass && i.tx_24h_count >= Number(conditions.tx_24h_count_min)
    }
    if (conditions?.tx_24h_count_max) {
      pass = pass && i.tx_24h_count <= Number(conditions.tx_24h_count_max)
    }
    if (conditions?.smart_money_tx_count_24h_min) {
      pass = pass && ((i.smart_money_sell_count_24h || 0) + (i?.smart_money_buy_count || 0)) >= Number(conditions.smart_money_tx_count_24h_min)
    }
    if (conditions?.smart_money_tx_count_24h_max) {
      pass = pass && ((i.smart_money_sell_count_24h || 0) + (i?.smart_money_buy_count || 0)) <= Number(conditions.smart_money_tx_count_24h_max)
    }

    return pass
  })
}
</script>

<template>
  <div
    class="w-full h-full bg-[--d-0B0D12-l-F6F9FF] p-12px"
    :class="{'pr-16px':pumpStore.isLeftFixed,'pl-16px':pumpStore.isRightFixed}"
  >
    <Icon name="custom:drag2" class="absolute top-4px left-50% ml--6px text-6px bg-[--d-333-l-F2F2F2] drag-handle" />
    <div class="flex mb-16px">
      <PlatformSelect />
      <div class="flex-1 mt--12px mb--16px drag-handle" />
      <div class="flex items-center">
        <Setting :chain="pumpStore.activeChain">
          <template #default="{ visible }">
            <div
v-tooltip="$t('customize')"
              class="flex items-center gap-4px mr-8px text-12px bg-[--d-151A22-l-E8F1FF] color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] px-4px py-2px rounded-4px cursor-pointer">
              <Icon name="custom:customized" class="text-13px" />
              <Icon :name="visible ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'" class="text-16px" />
            </div>
          </template>
        </Setting>
        <BlackList reference-class="text-12px" buttonClass="w-20px h-20px! p-0! justify-center!" />
        <Icon
name="custom:close" class="text-14px shrink-0 cursor-pointer color-[--d-FFF-l-333]"
          @click.self="pumpStore.visible = false" />
      </div>
    </div>
    <div class="flex pb-8px border-b-1px border-b-solid border-b-[--d-222-l-F2F2F2] mb-12px">
      <div class="flex items-center gap-8px">
        <span
          v-for="(item, index) in tabList" :key="index" :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-4px py-2px rounded-4px cursor-pointer ${activeTab === item.value ? 'bg-[--d-151A22-l-E8F1FF] color-[--d-F5F5F5-l-333]' : ''
          }`" @click="setActiveTab(item.value)">
          {{ item.label }}
        </span>
      </div>
      <div class="flex-1 drag-handle mb--8px" />
      <div class="flex items-center gap-8px">
        <div class="flex items-ceter gap-4px p-2px rounded-4px bg-[--d-151A22-l-E8F1FF]">
          <div
            v-for="(item, idx) in pumpStore.pumpConfig" :key="idx" class="cursor-pointer rounded-4px p-1px"
            :class="pumpStore.activeChain === item.chain ? 'bg-[--d-111-l-FFF]' : ''"
            @click="pumpStore.activeChain = item.chain as ChainKey">
            <ChainToken :chain="item.chain" :width="16" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex mb-12px">
      <div class="flex items-center gap-8px">
        <signal-quick-buy-input v-model="quickBuyValue" size="small" class="[--el-border-color:transparent]" style="--el-input-bg-color:var(--d-151A22-l-E8F1FF)" />
        <el-select
          v-model="botSettingStore.botSettings[pumpStore.activeChain]!.selected" fit-input-width size="small"
          :suffix-icon="SuffixIcon" class="[&&]:[--el-select-width:40px]" popper-class="small-select"
        >
          <el-option v-for="item in ['s1', 's2', 's3']" :key="item" :value="item" :label="item" />
        </el-select>
        <div
          class="w-20px h-20px flex items-center justify-center bg-[--d-151A22-l-E8F1FF] rounded-4px color-[--d-566275-l-8CA0C3] cursor-pointer hover:color-[--d-F5F5F5-l-333]"
          :class="{
            'color-[--d-F5F5F5-l-333]': pumpStore.pump_notice[pumpStore.activeChain][activeTab],
          }" @click="
            pumpStore.pump_notice[pumpStore.activeChain][activeTab] =
            !pumpStore.pump_notice[pumpStore.activeChain][activeTab]
            ">
          <Icon name="icon-park-solid:volume-notice" class="text-12px" />
        </div>
        <div v-show="isPaused" class="flex items-center justify-center w-20px h-20px color-#FFA622 bg-#FFA6221A rounded-4px">
          <Icon name="custom:stop"/>
        </div>
      </div>
      <div class="flex-1 drag-handle mt--12px" />
      <div class="flex items-center gap-8px">
        <el-input
ref="inputSearch" v-model.trim="pumpStore.pump_query[pumpStore.activeChain][activeTab]"
          class="w-90px [--el-input-border-color:--d-222-l-F2F2F2] [--el-input-bg-color:--d-151A22-l-E8F1FF]!" size="small" :placeholder="$t('search')" @input="
            (val) =>
              (pumpStore.pump_query[pumpStore.activeChain][activeTab] = val.replace(/\s/g, ''))
          ">
          <template #prefix>
            <Icon class="text-12px text-[var(--d-666-l-999)]" name="custom:search" />
          </template>
          <template #suffix>
            <Icon
v-if="pumpStore.pump_query[pumpStore.activeChain][activeTab]" name="pajamas:clear"
              class="color-[--d-666-l-999] text-12px hover:opacity-70% cursor-pointer mr-10px"
              @click="pumpStore.pump_query[pumpStore.activeChain][activeTab] = ''" />
          </template>
        </el-input>
        <PumpFilter
          hideReferenceText :storage="`pumpFilter_${pumpStore.activeChain}_${activeTab}`"
          @update:filterData="confirmFilter" />
      </div>
    </div>
    <div
    class="mx--12px"
    :class="{'mr--16px pr-4px':pumpStore.isLeftFixed,'ml--16px pl-4px':pumpStore.isRightFixed}"
    >
      <PumpList
        v-model:is-paused="isPaused" isInPopup :tableList="filterBlackList" :quickBuyValue="quickBuyValue"
        :loading="loading" :scrollHeight="scrollHeight" :isOut="isOut" />
    </div>
    <audio
      ref="pumpAudio" controls style="display: none"
      src="/signal.mp3"
    />
  </div>
</template>

<style scoped lang="scss">
:deep {
  .el-select--small .el-select__wrapper {
    padding: 2px 4px;
    min-height: 20px;
    --el-fill-color-blank: var(--d-151A22-l-E8F1FF);
  }

  .el-input__prefix-inner> :last-child {
    margin-right: 3px;
  }

  .el-input__suffix-inner> :first-child {
    margin-left: 3px;
    margin-right: 3px;
  }
}
</style>
