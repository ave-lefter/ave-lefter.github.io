<template>
  <div class="pump w-full bg-[--main-bg]" v-if="route.name=='index'">
    <div class="flex-start p-x-17px py-12px bg-[--main-bg] mb-1px mt-1px">
      <div class="tabs mr-8px">
        <div
          v-for="item in pumpConfig"
          :key="item.chain"
          :class="{ active: item.chain === activeChain }"
          class="flex-start h-24px  w-24px clickable"
          @click.stop="switchChain(item)"
        >
          <el-image
            style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
            "
            :class="{'opacity-30': item.chain !== activeChain}"
            :src="`${token_logo_url}chain/${item.chain}.png`"
          />
          <!-- <span>{{ item.chain_show || '' }}</span> -->
        </div>
      </div>
      <el-popover
        v-model:visible="visible_platforms"
        placement="bottom-start"
        popper-class="new-popover"
        :width="'auto'"
        :persistent="false"
        trigger="click"
      >
        <template #reference>
          <el-button class="btn mr-16px">
            <template v-for="(i, $index) in platformsList" :key="$index">
              <el-image
                class="mr-5px rounded w-14px"
                :src="`${token_logo_url}${i.platform_icon?.replace(
                  '/signals/',
                  'signals/'
                )}`"
              />
              <span v-if="platformsList?.length == 1">{{
                i.platform_show
              }}</span>
            </template>
            <Icon
              :name="
                isRotate
                  ? 'radix-icons:triangle-up'
                  : 'radix-icons:triangle-down'
              "
              class="text-16px color-[--main-text]"
            />
          </el-button>
        </template>
        <template #default>
          <template v-for="item in pumpConfig" :key="item.chain">
            <template v-if="item.chain === activeChain">
              <el-checkbox-group
                v-model="pumpV3[activeChain].platforms as string[]"
                class="pump-platforms flex flex-col"
              >
                <el-checkbox
                  v-for="i in item.platforms"
                  :key="i.platform"
                  :label="i.platform_show"
                  :value="i.platform"
                  :disabled="
                    pumpV3[activeChain].platforms?.includes(i.platform) &&
                    pumpV3[activeChain].platforms?.length === 1
                  "
                >
                  <el-image
                    class="mr-5px rounded w-14px"
                    :src="`${token_logo_url}${i.platform_icon?.replace(
                      '/signals/',
                      'signals/'
                    )}`"
                  />
                  {{ i.platform_show }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </template>
        </template>
      </el-popover>
      <div class="flex-1" />
      <Setting :chain="activeChain" :pumpConfig="pumpConfig"/>
      <BlackList />
      <QuickSwapSet
        v-model:quickBuyValue="quickBuyValue"
        :chain="activeChain"
        :settingsButtonVisible="true"
        class="mr-12px"
      />
      <AutoSellSetting :chain="activeChain" root-class="mr-0"/>
    </div>
    <el-row type="flex" :gutter="pumpSetting.isGutter ? 10 : 2" class="w-full pl-16px" :class="pumpSetting.isGutter? 'pr-6px': 'pr-14px'">
      <el-col v-show="single('new') && pumpSetting.grid['new']?.show" :span="getSpan()" :style="{order: orderNew}">
        <div class="pump-item  rounded-4px" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-12px">
            <template v-if="width > 1024">
              <img
                class="mr-5px"
                src="@/assets/images/pump/new.svg"
                width="24"
                alt=""
              >
              <span class="color-[--d-F5F5F5-l-333]">{{ $t('new1') }}</span>
            </template>
            <div v-else class="tabs single" >
              <button
                v-for="item in tabsList"
                :key="item.id"
                :class="{ active: item.id === activeTab}"
                class="flex-start"
                type="button"
                @click.stop="activeTab = item.id"
              >
                <img
                  v-if="item.id == 'new'"
                  class="mr-5px"
                  src="@/assets/images/pump/new.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'soon'"
                  class="mr-5px"
                  src="@/assets/images/pump/soon.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'graduated'"
                  class="mr-5px"
                  src="@/assets/images/pump/graduated.svg"
                  width="24"
                  alt=""
                >
                <span>{{ item.name || '' }}</span>
              </button>
            </div>
            <span  v-show="isPausedObj?.new" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <AudioSelect activeTab="new" :chain="activeChain"/>
            <PumpFilter
              :key="`pumpFilter_${activeChain}_new`"
              :storage="`pumpFilter_${activeChain}_new`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>

          <PumpList
            class="pump-item_list-new"
            :scrollHeight="scrollHeight"
            type="new"
            :tableList="list1 || []"
            :quickBuyValue="quickBuyValue"
            :loading="pumpV3[activeChain]['new']['loading']"
            @mouseover="isPausedObj.new = true"
            @mouseleave="isPausedObj.new = false"
          />
        </div>
      </el-col>
      <el-col v-show="single('soon') && pumpSetting.grid['soon'].show" :span="getSpan()" :style="{order: orderSoon}">
        <div class="pump-item" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-12px rounded-4px">
            <template v-if="width > 1024">
              <img
                class="mr-5px"
                src="@/assets/images/pump/soon.svg"
                width="24"
                alt=""
              >
              <span class="color-[--d-F5F5F5-l-333]">{{ $t('soon') }}</span>
            </template>
            <div v-else class="tabs single" >
              <button
                v-for="item in tabsList"
                :key="item.id"
                :class="{ active: item.id === activeTab}"
                class="flex-start"
                type="button"
                @click.stop="activeTab = item.id"
              >
                <img
                  v-if="item.id == 'new'"
                  class="mr-5px"
                  src="@/assets/images/pump/new.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'soon'"
                  class="mr-5px"
                  src="@/assets/images/pump/soon.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'graduated'"
                  class="mr-5px"
                  src="@/assets/images/pump/graduated.svg"
                  width="24"
                  alt=""
                >
                <span>{{ item.name || '' }}</span>
              </button>
            </div>
            <span  v-show="isPausedObj?.soon" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <AudioSelect activeTab="soon" :chain="activeChain"/>
            <PumpFilter
              :key="`pumpFilter_${activeChain}_soon`"
              :storage="`pumpFilter_${activeChain}_soon`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-soon"
            :scrollHeight="scrollHeight"
            type="soon"
            :tableList="list2 || []"
            :quickBuyValue="quickBuyValue"
            :loading="pumpV3[activeChain]['soon']['loading']"
            isSoon
            @mouseover="isPausedObj.soon = true"
            @mouseleave="isPausedObj.soon = false"
          />
        </div>
      </el-col>
      <el-col v-show="single('graduated') && pumpSetting.grid['graduated'].show" :span="getSpan()" :style="{order: orderGraduated}">
        <div class="pump-item" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-12px rounded-4px">
            <template v-if="width > 1024">
              <img
                class="mr-5px"
                src="@/assets/images/pump/graduated.svg"
                width="24"
                alt=""
              >
              <span class="color-[--d-F5F5F5-l-333]">{{ $t('graduated') }}</span>
            </template>
            <div v-else class="tabs single" >
              <button
                v-for="item in tabsList"
                :key="item.id"
                :class="{ active: item.id === activeTab}"
                class="flex-start"
                type="button"
                @click.stop="activeTab = item.id"
              >
                <img
                  v-if="item.id == 'new'"
                  class="mr-5px"
                  src="@/assets/images/pump/new.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'soon'"
                  class="mr-5px"
                  src="@/assets/images/pump/soon.svg"
                  width="24"
                  alt=""
                >
                <img
                  v-if="item.id == 'graduated'"
                  class="mr-5px"
                  src="@/assets/images/pump/graduated.svg"
                  width="24"
                  alt=""
                >
                <span>{{ item.name || '' }}</span>
              </button>
            </div>

            <span  v-show="isPausedObj?.graduated" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <AudioSelect activeTab="graduated" :chain="activeChain"/>
            <PumpFilter
              :key="`pumpFilter_${activeChain}_graduated`"
              :storage="`pumpFilter_${activeChain}_graduated`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-graduated"
            :scrollHeight="scrollHeight"
            :tableList="list3 || []"
            type="graduated"
            :quickBuyValue="quickBuyValue"
            :loading="pumpV3[activeChain]['graduated']['loading']"
            isOut
            @mouseover="isPausedObj.graduated = true"
            @mouseleave="isPausedObj.graduated = false"
          />
        </div>
      </el-col>
    </el-row>

    <audio
      ref="pumpAudio" controls style="display: none"
      :src="audioUrl"
      :volume="+globalStore.audioSettings.audio.volume/100 || 0.5"
    />
  </div>
</template>

<script setup lang="ts">
import { useStorage, useWindowSize, useThrottleFn, useDocumentVisibility } from '@vueuse/core'
import QuickSwapSet from '@/components/quickSwap/quickSwapSet.vue'
import PumpList from './pump/components/pumpList.vue'
import Setting from './pump/components/setting.vue'
import BlackList from './pump/components/blackList.vue'
import PumpFilter from './pump/components/pumpFilter.vue'
import { _getPumpConfig, _getPumpList } from '@/api/pump'
import type {
  PumpConfig,
  PumpObj,
  ChainKey,
  CategoryKey,
  WSPumpObj
} from '@/api/types/pump'
import { isEqual, throttle } from 'lodash-es'
import AutoSellSetting from '@/components/autoSellSetting/index.vue'
import AudioSelect from './pump/components/audioSelect.vue'
defineOptions({
  name: 'pump' // 显式命名
})

type TimeoutReturnType = ReturnType<typeof setTimeout> | number | null
const Timer: {
  new: TimeoutReturnType
  soon: TimeoutReturnType
  graduated: TimeoutReturnType
} = {
  new: null,
  soon: null,
  graduated: null
}
const { width } = useWindowSize()
const activeTab = shallowRef('new')
const route = useRoute()
const { t } = useI18n()
const wsv2Store = useV2WSStore()
let isInitObj = {
  new: true,
  soon: true,
  graduated: true
}
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const activeChain = useStorage<ChainKey>(
  'pump_activeChain2',
  'bsc',
  localStorage
)
const audioUrl = ref('')
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, pumpBlackList } = storeToRefs(globalStore)

const orderNew = computed(() => {
  return pumpSetting.value.grid['new']?.order
})
const orderSoon = computed(() => {
  return pumpSetting.value.grid['soon']?.order
})
const orderGraduated= computed(() => {
  return pumpSetting.value.grid['graduated']?.order
})
const pumpConfig = shallowRef<PumpConfig[]>()
const isRotate = ref(false)
const { pump_notice, pumpV3, pumpFilterDefault } = storeToRefs(usePumpStore())
const pumpAudio = useTemplateRef('pumpAudio')
const visible_platforms = shallowRef(false)
const fourmemeListObj = reactive<Record<ChainKey, Record<CategoryKey, PumpObj[]>>>({
  bsc: {
    new: [],
    soon: [],
    graduated: [],
  },
  solana: {
    new: [],
    soon: [],
    graduated: [],
  },
  xlayer: {
    new: [],
    soon: [],
    graduated: [],
  },
  monad: {
    new: [],
    soon: [],
    graduated: [],
  },
  base: {
    new: [],
    soon: [],
    graduated: [],
  },
})

const isPausedObj = ref({
  new: false,
  soon: false,
  graduated: false,
})

// let wsTableListCache: PumpObj[] = []
let wsTableListCache: Record<string, PumpObj[]> = {}
const wsTableList = shallowRef<PumpObj[]>([])
const logoList = shallowRef<{ logo_url: string, name: string, token: string, symbol: string, rTime: number, appendix: string, twitter_type: number, buy_tax: number, sell_tax: number }[]>([])
type StatisticsItem = {
  first_transfer_in_from_label: any
  volume_u_24h: number
  age_seconds: any
  first_transfer_in_from: any
  smart_wallet_ratio: any
  smart_wallet_count: any
  total_count: number
  migrated_count: number
  migrated_ratio: number
  max_dev_ratio: number
  kol_count: number
  kol_ratio: any
  buyers_24h: any
  sellers_24h: any
  makers_24h: number
  reserve1: number
  reserve0: number
  chain: string
  token: string
  holder_count: number
  rat_ratio: string
  dev_ratio: string
  sniper_ratio: string
  progress: string
  top10_ratio: string,
  tx_amount_24h:number
  tx_count_24h:number
  tvl:number
  total: string
  uprice: number
  net_flow_vol: number,
  address_binding_ratio: string
  phishing_ratio: string,
  sells_tx_24h_count:number
  buys_tx_24h_count: number
}
let portraitTimer: ReturnType<typeof setTimeout> | null = null
let isPortraitSubscribed = false
const mapStatistics = shallowRef(new Map<string, StatisticsItem>())
const platformsList = computed(() => {
  const list = pumpConfig?.value?.filter((i) => i?.chain === activeChain.value)
  return (
    list?.[0]?.platforms?.filter((i) =>
      platforms?.value.includes(i.platform)
    ) || []
  )
})
const platforms = computed(() => {
    return pumpV3.value?.[activeChain.value]?.platforms?.join(',')
})
const baseTokenMap = computed(() => {
  const list =
    pumpConfig?.value?.find(i => i?.chain === activeChain.value)
      ?.base_tokens || []
  return new Map(list.map(item => [item.hash, {
    symbol: item.name,
    token: item.hash,
    logo_url: item.logo_url
  }]))
})
const tabsList = computed(() => {
  return [
    {
      name: t('new1'),
      id: 'new'
    },
    {
      name: t('soon'),
      id: 'soon'
    },
    {
      name: t('graduated'),
      id: 'graduated'
    }
  ]
})
const list1 = computed(() => {
  let list = fourmemeListObj?.[activeChain.value]?.new || []
  if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
    list = list.filter(
      (item) =>
        !pumpBlackList.value?.some(
          (i) =>
            (i.address == item.token  && i.type=='ca' || i.address == item.symbol && i.type=='keyword' || i.address == item.token  && i.type=='dev')
        )
    )
  }
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'new' && i.chain === activeChain.value)
  const pumpFilter = localStorage.getItem(`pumpFilter_${activeChain.value}_new`)
  const wsList = getFilterData(list1, pumpFilter)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
  let filterList = [...wsList1, ...list].map(i => {
  const baseHash =
    i.target_token === i.token0_address
      ? i.token1_address
      : i.token0_address

  return {
    ...i,
    baseToken: baseTokenMap.value.get(baseHash)
  }
})
  if (logoList.value?.length && filterList?.length) {
    const logoMap = new Map(
      logoList.value.map(item => [item.token, item])
    )
    filterList = filterList.map(i => {
      const obj = logoMap.get(i.target_token)
      if (!obj) return i
      return {
        ...i,
        ...(obj.logo_url
          ? {
              logo_url: obj.logo_url
            }
          : {}
        ),
        ...(obj.buy_tax
          ? {
              buy_tax: obj.buy_tax
            }
          : {}
        ),
        ...(obj.sell_tax
          ? {
              sell_tax: obj.sell_tax
            }
          : {}
        ),
        ...(obj.name
          ? {
              name: obj.name
            }
          : {}
        ),
        ...(obj.symbol
          ? {
              symbol: obj.symbol
            }
          : {}
        ),
        ...(obj.appendix
          ? {
              medias: getMedias(obj.appendix),
              twitter_type: obj.twitter_type
            }
          : {}
        )
      }
    })
  }
  if (filterList?.length) {
    filterList = mergeStatisticsList(mapStatistics.value, filterList)
    fourmemeListObj[activeChain.value].new = filterList?.slice?.(0, 100) || []
  }
  return filterList?.slice?.(0, 100)
})
const list2 = computed(() => {
  let list = fourmemeListObj?.[activeChain.value]?.soon || []
  if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
    list = list.filter(
      (item) =>
        !pumpBlackList.value?.some(
          (i) =>
          (i.address == item.token  && i.type=='ca' || i.address == item.symbol && i.type=='keyword' || i.address == item.token  && i.type=='dev')
        )
    )
  }
  const list1 = (wsTableList.value || [])?.filter(i => (i.state === 'migrating') && i.chain === activeChain.value)
  const pumpFilter = localStorage.getItem(`pumpFilter_${activeChain.value}_soon`)
  const wsList = getFilterData(list1, pumpFilter)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
  let filterList = [...wsList1, ...list].map(i => {
  const baseHash =
    i.target_token === i.token0_address
      ? i.token1_address
      : i.token0_address

  return {
    ...i,
    baseToken: baseTokenMap.value.get(baseHash)
  }
})
    if (logoList.value?.length && filterList?.length) {
      const logoMap = new Map(
        logoList.value.map(item => [item.token, item])
      )
      filterList = filterList.map(i => {
        const obj = logoMap.get(i.target_token)
        if (!obj) return i
        return {
          ...i,
          ...(obj.logo_url
            ? {
                logo_url: obj.logo_url
              }
            : {}
          ),
          ...(obj.buy_tax
            ? {
                buy_tax: obj.buy_tax
              }
            : {}
          ),
          ...(obj.sell_tax
            ? {
                sell_tax: obj.sell_tax
              }
            : {}
          ),
          ...(obj.name
            ? {
                name: obj.name
              }
            : {}
          ),
          ...(obj.symbol
            ? {
                symbol: obj.symbol
              }
            : {}
          ),
          ...(obj.appendix
            ? {
                medias: getMedias(obj.appendix),
                twitter_type: obj.twitter_type
              }
            : {}
          )
        }
      })
    }
    if (filterList?.length) {
      filterList = mergeStatisticsList(mapStatistics.value, filterList)
    }
    const tokenSet = new Set(
      list3.value?.map(j => j.target_token)
    )
    filterList = filterList?.filter(
      (i: { target_token: string }) =>
        !tokenSet.has(i.target_token)
    )

     fourmemeListObj[activeChain.value].soon = filterList?.slice?.(0, 100) || []
    return filterList?.slice?.(0, 100)
  })
const list3 = computed(() => {
let list = fourmemeListObj?.[activeChain.value]?.graduated || []
if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
  list = list.filter(
    (item) =>
      !pumpBlackList.value?.some(
        (i) =>
        (i.address == item.token  && i.type=='ca' || i.address == item.symbol && i.type=='keyword' || i.address == item.token  && i.type=='dev')
      )
  )
}
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'migrated' && i.chain === activeChain.value)
  const pumpFilter = localStorage.getItem(`pumpFilter_${activeChain.value}_graduated`)
  const wsList = getFilterData(list1, pumpFilter)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
  let filterList = [...wsList1, ...list].map(i => {
  const baseHash =
      i.target_token === i.token0_address
        ? i.token1_address
        : i.token0_address

    return {
      ...i,
      baseToken: baseTokenMap.value.get(baseHash)
    }
  })
  if (logoList.value?.length && filterList?.length) {
    const logoMap = new Map(
      logoList.value.map(item => [item.token, item])
    )
    filterList = filterList.map(i => {
      const obj = logoMap.get(i.target_token)
      if (!obj) return i
      return {
        ...i,
        ...(obj.logo_url
          ? {
              logo_url: obj.logo_url
            }
          : {}
        ),
        ...(obj.buy_tax
          ? {
              buy_tax: obj.buy_tax
            }
          : {}
        ),
        ...(obj.sell_tax
          ? {
              sell_tax: obj.sell_tax
            }
          : {}
        ),
        ...(obj.name
          ? {
              name: obj.name
            }
          : {}
        ),
        ...(obj.symbol
          ? {
              symbol: obj.symbol
            }
          : {}
        ),
        ...(obj.appendix
          ? {
              medias: getMedias(obj.appendix),
              twitter_type: obj.twitter_type
            }
          : {}
        )
      }
    })
  }
  if (filterList?.length) {
    filterList = mergeStatisticsList(mapStatistics.value, filterList)
    fourmemeListObj[activeChain.value].graduated = filterList?.slice?.(0, 100) || []
  }
  return filterList?.slice?.(0, 100)
})
const mergedBaseList = computed(() => {
  return [...list1.value, ...list2.value, ...list3.value]
})
const scrollHeight = computed(()=>{
  return 'calc(100vh - 215px)'
  // return globalStore.tokenHistoryVisible ? 'calc(100vh - 248px)':'calc(100vh - 215px)'
})


// 🔧 FIX: 外置 throttled handlers（只创建一次）
const playNewAudio = useThrottleFn((val) => {
  const newAudio = pump_notice.value?.[activeChain.value]?.new
  if (newAudio && pumpAudio.value && val) {
    audioUrl.value =
      audioNameToResource[newAudio as keyof typeof audioNameToResource] ||
      audioNameToResource.Beep
    pumpAudio.value.play().catch(() => {})
  }
}, 300)

const playSoonAudio = useThrottleFn((val) => {
  const soonAudio = pump_notice.value?.[activeChain.value]?.soon
  if (soonAudio && pumpAudio.value && val) {
    audioUrl.value =
      audioNameToResource[soonAudio as keyof typeof audioNameToResource] ||
      audioNameToResource.Beep
    pumpAudio.value.play().catch(() => {})
  }
}, 300)

const playGraduatedAudio = useThrottleFn((val) => {
  const graduatedAudio = pump_notice.value?.[activeChain.value]?.graduated
  if (graduatedAudio && pumpAudio.value && val) {
    audioUrl.value =
      audioNameToResource[graduatedAudio as keyof typeof audioNameToResource] ||
      audioNameToResource.Beep
    pumpAudio.value.play().catch(() => {})
  }
}, 300)
const stopWatchList1 = watch(
  () => list1.value?.[0]?.target_token,
  playNewAudio
)
const stopWatchList2 = watch(
  () => list2.value?.[0]?.target_token,
  playSoonAudio
)
const stopWatchList3 = watch(
  () => list3.value?.[0]?.target_token,
  playGraduatedAudio
)

let onCanPlayHandler: (() => void) | null = null

function bindAudioCanPlay() {
  if (!pumpAudio.value || onCanPlayHandler) return
  onCanPlayHandler = () => {
    pumpAudio.value?.play().catch(() => {})
  }
  pumpAudio.value.addEventListener('canplay', onCanPlayHandler)
}

function unbindAudioCanPlay() {
  if (pumpAudio.value && onCanPlayHandler) {
    pumpAudio.value.removeEventListener('canplay', onCanPlayHandler)
    onCanPlayHandler = null
  }
}

watch(() => [pump_notice.value?.[activeChain.value]?.new,
pump_notice.value?.[activeChain.value]?.soon,
pump_notice.value?.[activeChain.value]?.graduated
], useThrottleFn((val, old) => {
  if(val.some(el=>!!el)){
    const url = getChangedValue(val, old)
    if (pumpAudio.value && url) {
      audioUrl.value = audioNameToResource[url as keyof typeof audioNameToResource] || audioNameToResource.Beep
      pumpAudio.value.oncanplay = () => {
        pumpAudio.value?.play().catch(() => {})
      }
    }
  }
},300))

watch(()=> pumpV3.value[activeChain.value].platforms, (val, oldValue) => {
  if (isEqual(val, oldValue)) return
  getPumpList()
})
watch(activeChain, (val, old) => {
  if (old) {
    fourmemeListObj[old] = {
      new: [],
      soon: [],
      graduated: []
    }
  }

  getPumpList()
  wsTableListCache = {}
  wsTableList.value = []
  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstatev2', old],
    id: 1,
  })
  setTimeout(() => {
    wsv2Store.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pumpstatev2', val],
      id: 1,
    })
  }, 500)
    isInitObj = {
      new: true,
      soon: true,
      graduated: true
    }
    wsv2Store.send({
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: ['portrait_statistics'],
      id: 1,
    })
})

const pumpStateBuffer: any[] = []
const flushPumpState = useThrottleFn(() => {
  if (!pumpStateBuffer.length || !documentVisible.value) return
  wsUpdateTableList(pumpStateBuffer)
  subscribePortrait(pumpStateBuffer)
  pumpStateBuffer.length = 0
}, 100)

// 保存 watch 监听器的 unwatch 函数，用于组件卸载时清理
let watchPumpStateUnwatch: (() => void) | null = null
let watchTokenUpdatedUnwatch: (() => void) | null = null
let watchPortraitStatsUnwatch: (() => void) | null = null

watchPumpStateUnwatch = watch(() => wsv2Store.wsResult[WSEventV2Type.PUMPSTATE], (val) => {
  if (Array.isArray(val)) {
    pumpStateBuffer.push(...val)
    if (pumpStateBuffer.length > 300) {
      pumpStateBuffer.splice(0, pumpStateBuffer.length - 300)
    }
    flushPumpState()
  }
})
const bufferLogoMap = new Map<string, any>()
const logoThrottled = useThrottleFn(() => {
  if (!bufferLogoMap.size || !documentVisible.value) return
  const mergedList = Array.from(bufferLogoMap.values())
  logoList.value = [
    ...mergedList,
    ...logoList.value,
  ].slice(0, 300)
  bufferLogoMap.clear()
}, 100)

watchTokenUpdatedUnwatch = watch(
  () => wsv2Store.wsResult[WSEventV2Type.TOKEN_UPDATED],
  (val) => {
    if (!val?.token) return
    const prev = bufferLogoMap.get(val.token)
    setLRU(
      bufferLogoMap,
      val.token,
      prev ? mergeLogo(prev, val) : val,
      100
    )
    logoThrottled()
  }
)
function setLRU(map: Map<string, any>, key: string, value: any, limit = 100) {
  if (map.has(key)) {
    map.delete(key) // 刷新顺序
  }
  map.set(key, value)
  if (map.size > limit) {
    const oldestKey = map.keys().next().value
    if (oldestKey) {
      map.delete(oldestKey)
    }
  }
}

const flushStatistics = useThrottleFn(() => {
  if (!mapStatistics.value.size || !documentVisible.value) return
  triggerRef(mapStatistics)
}, 300)
// watch(

// const MAX_SIZE = 100

watchPortraitStatsUnwatch = watch(
  () => wsv2Store.wsResult[WSEventV2Type.PORTRAIT_STATISTICS],
  (val) => {
    if (!Array.isArray(val) || !val.length ) return
    val.forEach((item) => {
      setLRUStatistics(mapStatistics.value, item.token, item, 100)
    })
    flushStatistics()
  }
)

function setLRUStatistics(
  map: Map<string, StatisticsItem>,
  key: string,
  source: StatisticsItem,
  limit = 100
) {
  const prev = map.get(key)
  map.set(key, prev ? mergeStatistics(prev, source) : source)
  if (map.size > limit) {
    const old = map.keys().next().value
    if (old !==undefined) {
      map.delete(old)
    }
  }
}


function bufRender() {
  flushPumpState()
  logoThrottled()
  flushStatistics()
}
const getChangedValue = (A: string[], B: string[]): string | null => {
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) {
      return A[i]
    }
  }
  return null
}


let isLeave = true

onActivated(() => {
  bindAudioCanPlay()
  isLeave = false
  wsTableListCache = {}
  wsTableList.value = []
  getPumpConfig()
  getPumpList()
  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstatev2', activeChain.value],
    id: 1,
  })
  setTimeout(() => {
    wsv2Store.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pumpstatev2', activeChain.value],
      id: 1,
    })
  }, 500)

  isInitObj = {
    new: true,
    soon: true,
    graduated: true
  }
})

onDeactivated(()=>{
  // 清理 watch 监听器，防止内存泄漏
  // watchPumpStateUnwatch?.()
  // watchTokenUpdatedUnwatch?.()
  // watchPortraitStatsUnwatch?.()
  // watchPumpStateUnwatch = null
  // watchTokenUpdatedUnwatch = null
  // watchPortraitStatsUnwatch = null

  // stopWatchList1()
  // stopWatchList2()
  // stopWatchList3()
  unbindAudioCanPlay()
  isPausedObj.value.new = false
  isPausedObj.value.soon = false
  isPausedObj.value.graduated = false
  isLeave = true
  pumpStateBuffer.length = 0
  bufferLogoMap.clear()
  mapStatistics.value.clear()
  logoList.value = []
  wsTableListCache = {}
  wsTableList.value = []

  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstatev2',  activeChain.value],
    id: 1,
  })
  for (const key in Timer) {
    const timerKey = key as keyof typeof Timer
    if (Timer[timerKey]) {
      clearTimeout(Timer[timerKey])
      Timer[timerKey] = null
    }
  }
  if (portraitTimer) {
    clearTimeout(portraitTimer)
  }
  unsubscribePortrait()
})
const startPortraitTimer = () => {
  if (portraitTimer) {
    clearTimeout(portraitTimer)
  }
  portraitTimer = setTimeout(() => {
    unsubscribePortrait()
    subscribePortrait(mergedBaseList.value)
    startPortraitTimer()
  }, 1 * 60 * 1000)
}
const subscribePortrait = (list) => {
  if (!Array.isArray(list) || list.length === 0 || isLeave) return

  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: [
      'portrait_statistics',
      {
        tks: list.map(i => ({
          ch: i.chain,
          tk: i?.pair?.target_token || i?.target_token
        }))
      }
    ],
    id: 1,
  })

  isPortraitSubscribed = true
}

const unsubscribePortrait = () => {
  // if (!isPortraitSubscribed) return
  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['portrait_statistics'],
    id: 1,
  })
  // isPortraitSubscribed = false
}

function wsUpdateTableList(wsList: WSPumpObj[]) {
  const c = ['new', 'soon', 'graduated'] as const
  if (!wsList?.length) return
  // const rTime = Date.now()
  const list = wsList?.map?.(i => ({
    ...i,
    ...(i.pair),
    // rTime: rTime,
    id: `${i.pair.target_token}-${i.chain}`,
    pair_id: `${i.pair.pair}-${i.chain}`,
    token: i.pair.target_token,
    progress: 0,
    symbol:
      i.pair.target_token == i.pair.token0_address
        ? i?.pair.token0_symbol
        : i?.pair.token1_symbol,
    name:  i.pair.target_token == i.pair.token0_address
          ? i.pair?.token0_name
          : i.pair?.token1_name,
    logo_url:
    i.pair.target_token == i.pair.token0_address
      ? i?.pair.token0_logo_url
      : i?.pair.token1_logo_url,

  }))
  const currentChain = activeChain.value
  if (!wsTableListCache[currentChain]) wsTableListCache[currentChain] = []
  const wsTableList1 = wsTableListCache[currentChain]?.filter?.(i => !list?.some?.(j => j.pump_pair_address === i.pump_pair_address))
  wsTableListCache[currentChain] = [...(list?.filter(i => i.chain === currentChain) || []), ...(wsTableList1 || [])]?.slice(0, 100)
  // let wsTime = this.wsTableListCache?.time || 0
  // if (wsTime < Date.now() - 15000) {
  //   this.wsTableListCache = {
  //     list,
  //     time: Date.now()
  //   }
  // } else {
  //   let wsTableList = this.wsTableListCache?.list?.filter?.(i => !list?.some?.(j => j.pump_pair_address === i.pump_pair_address))
  //   this.wsTableListCache.list = [...list, ...(wsTableList || [])]
  // }

  let list1 = wsTableListCache[currentChain]
  const list2 = wsTableList?.value.filter(i => i.chain === currentChain)
  if (isPausedObj?.value?.new) {
    list1 = [...(list1?.filter?.(i => i.state !== 'new') || []), ...(list2?.filter?.(i => i.state === 'new') || [])]
  }
  if (isPausedObj?.value?.soon) {
    // list1 = list1?.filter?.(i => i.state !== 'soon' && i.state !== 'migrating')
    list1 = [...(list1?.filter?.(i => i.state !== 'soon' && i.state !== 'migrating') || []), ...(list2?.filter?.(i => i.state === 'soon' || i.state === 'migrating') || [])]
  }
  if (isPausedObj?.value?.graduated) {
    // list1 = list1?.filter?.(i => i.state !== 'graduated')
    list1 = [...(list1?.filter?.(i => i.state !== 'graduated' && i.state !== 'migrated') || []), ...(list2?.filter?.(i => i.state === 'graduated' || i.state === 'migrated') || [])]
  }
  wsTableList.value = [...list1]

  c.forEach((i) => {
    fourmemeListObj[activeChain.value][i] = fourmemeListObj?.[activeChain.value][i]?.map((j) => {
      const item = list?.find(
        (k) => k.pump_pair_address === j.pair && k.chain === j.chain
      )
      let res = {}
      if (item) {
        res = {
          ...item,
        }
      }
      return {
        ...j,
        ...(res || {})
      }
    })
  })
}
function getPumpConfig() {
  _getPumpConfig().then((res) => {
    pumpConfig.value = Array.isArray(res) ? res : []
    console.log('----pumpConfig--------', pumpConfig.value)
    console.log('-------fourmemeListObj-----', fourmemeListObj)
    pumpConfig.value?.forEach(i => {
      if (!pumpV3.value[i.chain]?.platforms?.length) {
        const platforms = i.platforms?.map(y => {
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
      }
      if (!pump_notice.value?.[i.chain]) {
        pump_notice.value[i.chain] = {
            new: '',
            soon: '',
            graduated: '',
        }
      }
      if (!fourmemeListObj?.[i.chain]) {
        fourmemeListObj[i.chain] = {
            new: [],
            soon: [],
            graduated: [],
        }
      }

    })
  })
}
function handlerFilterConfirm(
  val: { progress_min?: string; progress_max?: string; chain: ChainKey; platforms: string; has_sm?: boolean},
  type: string
) {

  console.log('handlerFilterConfirm', val, type)
  let params = null
  if (type?.includes('new')) {
    params = {
      category: 'new',
    }
  }
  if (type?.includes('soon')) {
    params = {
      category: 'soon',
    }
  }
  if (type?.includes('graduated')) {
    params = {
      category: 'graduated',
    }
    val.progress_min = undefined
    val.progress_max = undefined
  }
  getPump({ ...(params as { category: CategoryKey }), ...val }, true)
}
function single(type: string) {
  if (width.value < 1024) {
    if (type == activeTab.value) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}
function getPumpList(isFilter = false) {
  const new1 = localStorage.getItem(`pumpFilter_${activeChain.value}_new`)
  const soon = localStorage.getItem(`pumpFilter_${activeChain.value}_soon`)
  const graduated = localStorage.getItem(`pumpFilter_${activeChain.value}_graduated`)
  const params1 = {
    category: 'new',
    ...(new1 ? JSON.parse(new1) : ''),
  }
  getPump(params1, isFilter)
  const params2 = {
    category: 'soon',
    ...(soon ? JSON.parse(soon) : ''),
  }

  getPump(params2, isFilter)
  const params3 = {
    category: 'graduated',
    ...(graduated ? JSON.parse(graduated): ''),
  }
  getPump(params3, isFilter)
}

async function getPump(rawParams: {
  category: CategoryKey
  chain: ChainKey
  platforms: string
  has_sm?: boolean
  sm_list?: string[] | string
}, isFilter = false) {
  const { category } = rawParams
  const currentChain = activeChain.value

  // 1. 清理定时器
  if (Timer[category]) {
    clearTimeout(Timer[category] as number)
    Timer[category] = null
  }

  // 2. 状态拦截
  const isInactive = route.name !== 'index'
  const isPaused = isPausedObj.value?.[category] || route.name !== 'index'

  if (isInactive) return

  // if (!isFilter && isPaused) {
  //   Timer[category] = setTimeout(() => getPump(rawParams), 5000)
  //   return
  // }

  // 3. 构建参数 (浅拷贝避免污染)
  const queryParams = { ...rawParams, chain: currentChain }
  const platformList = pumpV3.value?.[currentChain]?.platforms

  if (platformList?.length > 0) {
    queryParams.platforms = platformList.join(',')
  }

  if (queryParams.has_sm) {
    delete queryParams.sm_list
  } else if (Array.isArray(queryParams.sm_list) && queryParams.sm_list.length > 0) {
    queryParams.sm_list = queryParams.sm_list.join(',')
  }

  // 过滤无效键值
  const finalParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v != null && v !== '' && Boolean(v))
  )

  // 4. Loading 状态处理
  const state = pumpV3.value[currentChain]?.[category]
  if (state.loading) return
  if (state?.count === 0) state.loading = true


  try {
    const res = await _getPumpList(finalParams)

    // 5. 数据转换
    const formattedList = (res || []).map(item => {
      const isT0 = item.target_token === item.token0_address
      const targetPrefix = isT0 ? 'token0' : 'token1'

      return {
        ...item,
        id: `${item.target_token}-${item.chain}`,
        pair_id: `${item.pair}-${item.chain}`,
        token: item.target_token,
        progress: Number(item.progress || 0),
        symbol: item[`${targetPrefix}_symbol`],
        name: item[`${targetPrefix}_name`],
        logo_url: item[`${targetPrefix}_logo_url`],
        target_opening_at: parseDate(item.target_opening_at),
        created_at: parseDate(item.created_at, true),
        liq: isT0
          ? item.reserve1 * item.token1_price_usd * 2
          : item.reserve0 * item.token0_price_usd * 2,
        medias: getMedias(item.appendix)
      }
    })

    // 6. 更新列表与缓存过滤 (Set 优化)
    fourmemeListObj[currentChain][category] = formattedList.slice(0, 100)

    const newPairSet = new Set(formattedList.map(i => i.pair))
    wsTableListCache[currentChain] = (wsTableListCache[currentChain] || []).filter(i => !newPairSet.has(i.pair)).slice(0, 50)

    if(isInitObj[finalParams.category as keyof typeof isInitObj]) {
      if (formattedList?.length > 0) {
          subscribePortrait(formattedList?.slice?.(0, 100))
          startPortraitTimer()
      } else {
        isInitObj[finalParams.category as keyof typeof isInitObj] = false
      }
    }

  } catch (err) {
    console.error('Fetch pump list failed:', err)
  } finally {
    // 7. 善后与下一次轮询
    if (state) {
      state.loading = false
      state.count++
    }
    // Timer[category] = setTimeout(() => getPump(rawParams), 10000)
  }
}

/** 辅助函数：统一处理后端无效时间 */
function parseDate(dateStr?: string | number, toSeconds = false) {
  const isInvalid = !dateStr || String(dateStr).startsWith('1970') || String(dateStr).startsWith('0001')
  if (isInvalid) return toSeconds ? '0' : 0
  const ms = new Date(dateStr).getTime()
  return toSeconds ? ms / 1000 : ms
}
function getFilterData(list: PumpObj[], conditions: any) {
  conditions = JSON.parse(conditions) || {}
  return list?.filter((i) => {
    let pass = true
    if (conditions?.q) {
      const arr = conditions?.q.split(',')
      pass = pass && arr?.findIndex(y=> i.target_token == y || i.name == y || i.symbol == y) !== -1
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
      pass = pass && (new Date().getTime()/1000- i.time)/60 >= Number(conditions.lage)
    }
    if (conditions?.rage) {
      pass = pass && (new Date().getTime()/1000- i.time)/60 <= Number(conditions.rage)
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
    if (pumpV3.value[activeChain.value].platforms.length > 0) {
      pass = pass && pumpV3.value[activeChain.value].platforms.includes(i.platform_id)
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
function getSpan() {
  const visibleList = Object.values(pumpSetting?.value.grid || {}).filter(i => i.show) || []
  if (width.value > 1024) {
    if(visibleList?.length ==1){
      return 24
    }
    if(visibleList?.length ==2){
      return 12
    }
    if(visibleList?.length ==3){
      return 8
    }
  } else {
    return 24
  }
}
function switchChain(item: { chain: ChainKey }) {
  activeChain.value = item.chain
}

const documentVisible1 = useDocumentVisibility()

const documentVisible = computed(() => {
  return documentVisible1.value === 'visible'
})

watch(documentVisible, (val) => {
  if (route.name !== 'index') return
  if (val) {
    bufRender()
  }
})

// watch(documentVisible, (val) => {
//   if (route.name !== 'index') return
//   if (val) {
//     wsTableListCache = []
//     wsTableList.value = []
//     isInitObj.value = {
//       new: true,
//       soon: true,
//       graduated: true
//     }
//     wsv2Store.send({
//       jsonrpc: '2.0',
//       method: 'subscribe',
//       params: ['pumpstate', activeChain.value],
//       id: 1,
//     })
//     getPumpList()
//   } else {
//     if (portraitTimer) {
//       clearTimeout(portraitTimer)
//       portraitTimer = null
//     }
//     unsubscribePortrait()
//     wsv2Store.send({
//       jsonrpc: '2.0',
//       method: 'unsubscribe',
//       params: ['pumpstate'],
//       id: 1,
//     })
//   }
// })

const DIRECT_MAP: [keyof StatisticsItem, keyof PumpObj][] = [
  ['volume_u_24h', 'volume_u_24h'],
  ['net_flow_vol', 'net_flow_vol'],
  ['address_binding_ratio', 'address_binding_ratio'],
  ['phishing_ratio', 'phishing_ratio'],
  ['sells_tx_24h_count', 'sells_tx_24h_count'],
  ['buys_tx_24h_count', 'buys_tx_24h_count'],
  ['migrated_count', 'dev_migrated_count'],
  ['total_count', 'dev_total_count'],
  ['migrated_ratio', 'dev_migrated_ratio'],
  ['max_dev_ratio', 'max_dev_ratio'],
  ['kol_ratio', 'kol_ratio'],
  ['smart_wallet_ratio', 'smart_wallet_ratio'],
  ['first_transfer_in_from', 'dev_first_transfer_in_from'],
  ['first_transfer_in_from_label', 'dev_first_transfer_in_from_label'],
  ['age_seconds', 'dev_age_seconds'],
]
const NUMBER_MAP: [keyof StatisticsItem, keyof PumpObj][] = [
  ['holder_count', 'holders'],//dev_holder_count
  ['rat_ratio', 'insider_balance_ratio_cur'],
  ['dev_ratio', 'dev_balance_ratio_cur'], //dev_ratio
  ['sniper_ratio', 'sniper_balance_ratio_cur'],
  ['top10_ratio', 'holders_top10_ratio'],
  ['tx_count_24h', 'tx_24h_count'],
  ['tvl', 'tvl'],
  ['reserve0', 'reserve0'],
  ['reserve1', 'reserve1'],
  ['makers_24h', 'makers_24h'],
  ['sellers_24h', 'sellers_24h'],
  ['buyers_24h', 'buyers_24h'],
  ['kol_count', 'kol_tag_count'],
  ['smart_wallet_count', 'smart_wallet_tag_count']
]
function mergeStatisticsList(
  statisticsList: Map<string, StatisticsItem>,
  filterList: PumpObj[]
) {
  return filterList.map(i => {
    const obj = statisticsList.get(i.token)

    if (!obj) {
      if (i.chain == 'bsc' || i.chain == 'solana') {
        if (i.amm === 'flapswap') {
          i.market_cap = 1000000000 * i.current_price_usd || i.market_cap || 4900
        } else {
          i.market_cap = 1000000000 * i.current_price_usd || i.market_cap || 0
        }
      } else if (i.chain == 'base') {
        if (i.platform == 'clanker' || i.platform_id == 'clanker') {
          i.market_cap = 100000000000 * i.current_price_usd || i.market_cap || 22500
        } else if (i.platform == 'bankr' || i.platform_id == 'bankr') {
          i.market_cap = 100000000000 * i.current_price_usd || i.market_cap || 0
        } else {
          i.market_cap = 1000000000 * i.current_price_usd || i.market_cap || 0
        }
      } else {
          i.market_cap =  i.market_cap
      }
      return i
    }
    const next = { ...i }

    /** progress（特殊处理） */
    if (obj.progress != null) {
      const p = Number(obj.progress)
      next.progress = p < 0 ? 0 : Math.min(p, 100)
    }

    /** 普通映射 */
    for (const [from, to] of DIRECT_MAP) {
      const v = obj[from]
      if (v != null) {
        ;(next as any)[to] = v
      }
    }

    /** Number 映射 */
    for (const [from, to] of NUMBER_MAP) {
      const v = obj[from]
      if (v != null) {
        ;(next as any)[to] = Number(v)
      }
    }

    /** price / total / market_cap */
    if (obj.uprice != null && obj.uprice != 0) {
      next.current_price_usd = obj.uprice
    }
    if (obj.total != null) {
      next.total = Number(obj.total)
    }
    if (next.chain == 'bsc' || next.chain == 'solana') {
      if (next.amm === 'flapswap') {
        next.market_cap = Number(next.total) * next.current_price_usd || 1000000000 * next.current_price_usd || next.market_cap || 4900
      } else {
        next.market_cap = Number(next.total) * next.current_price_usd || 1000000000 * next.current_price_usd || next.market_cap || 0
      }
    } else if (next.chain == 'base') {
      if (next.platform == 'clanker' || next.platform_id == 'clanker') {
        next.market_cap = Number(next.total) * next.current_price_usd || 100000000000 * next.current_price_usd || next.market_cap || 22500
      } else if (next.platform == 'bankr' || next.platform_id == 'bankr') {
        next.market_cap = Number(next.total) * next.current_price_usd || 100000000000 * next.current_price_usd || next.market_cap || 0
      } else {
        next.market_cap = Number(next.total) * next.current_price_usd || 1000000000 * next.current_price_usd || next.market_cap || 0
      }
    } else {
      next.market_cap = Number(next.total) * next.current_price_usd || next.market_cap
    }
    return next
  })
}

const MERGE_KEYS = [
  'progress',
  'holder_count',
  'rat_ratio',
  'dev_ratio',
  'sniper_ratio',
  'top10_ratio',
  'uprice',
  'volume_u_24h',
  'tx_count_24h',
  'tvl',
  'reserve0',
  'reserve1',
  'makers_24h',
  'sellers_24h',
  'buyers_24h',
  'address_binding_ratio',
  'phishing_ratio',
  'total',
  'net_flow_vol',
  'sells_tx_24h_count',
  'buys_tx_24h_count',
  'migrated_count',
  'total_count',
  'migrated_ratio',
  'max_dev_ratio',
  'kol_count',
  'kol_ratio',
  'smart_wallet_count',
  'smart_wallet_ratio',
  'first_transfer_in_from',
  'first_transfer_in_from_label',
  'age_seconds'
] as const

function mergeStatistics(prev: any, next: any) {
  const result = { ...prev }

  for (const key of MERGE_KEYS) {
    const v = next[key]
    if (v !== null && v !== undefined) {
      result[key] = v
    }
  }
  return result
}
function mergeLogo(prev: any, next: any) {
  return {
    ...prev,
    ...next,
    logo_url: next.logo_url || prev.logo_url,
    appendix: next.appendix || prev.appendix,
  }
}
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--main-input-button-bg);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;
  gap:8px;
  &.single {
    background: transparent;
    border-radius: 0px;
    button {
    border: none;

    // font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    background: transparent;
    min-width: 36px;
    padding: 5px 10px;
    text-align: center;
    opacity: 0.7;
    font-weight: 500;
    font-style: Medium;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 0px;

    &.active {
      color: var(--main-text);
      background: var(--tab-active-bg);
      opacity: 1;
    }
  }
  }

  button {
    border: none;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    background: transparent;
    // min-width: 36px;
    padding: 2px;
    text-align: center;
    &.active {
      color: var(--main-text);
      background: var(--tab-active-bg);
    }
  }
}
.btn {
  height: 28px;
  border: none;
  background: var(--main-input-button-bg);
  padding: 7px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color:var(--main-text);
}
:deep().search-input1 {
  background: var(--main-input-button-bg);
  padding: 1px;
  width: 200px;
  border-radius: 4px;
  border: none;
  .el-input__wrapper {
    background-color: transparent;
    box-shadow: none;
    &:hover {
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    &.is-focus {
      border-color: #3F80F7; /* 蓝色 */
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    .el-input__inner{
      color: var(--main-text);
      &::placeholder {
        color: var(--third-text);
      }
    }
  }
}
/* 修改 hover 效果：背景色 + 字体颜色 */
// ::v-deep(.el-checkbox) {
//   width: 100%;
//   &:hover {
//     color: #409EFF;
//     background-color: #f0f9ff;
//     border-radius: 4px;
//     transition: all 0.2s;
//   }

// }
::v-deep(.el-checkbox ) {
  .el-checkbox__label {
    color: var(--third-text);
  }
  .el-checkbox__inner{
    border-color: var(--border);
  }
  .el-checkbox__input{
    &.is-checked{
      .el-checkbox__inner{
        // background: var(--d-333-l-CCC);
        // border-color: var(--d-333-l-CCC);
      }
      &+ .el-checkbox__label {
        color: var(--main-text)
      }
    }
  }

  color: var(--main-text);
}
.pump-item{
  background: var(--main-bg);
  border: 1px solid var(--main-input-button-bg);
  border-radius: 4px;
}
</style>
