<template>
  <div class="pump w-full bg-[--main-bg]">
    <div class="flex-start p-x-17px py-12px bg-[--main-bg] mb-1px mt-1px">
      <el-popover
        v-model:visible="visible_platforms"
        placement="bottom-start"
        popper-class="new-popover"
        :width="'auto'"
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
      <QuickSwapSet
        v-model:quickBuyValue="quickBuyValue"
        :chain="activeChain"
        :settingsButtonVisible="true"
      />
      <div class="flex-1" />
      <Setting :chain="activeChain" :pumpConfig="pumpConfig"/>
      <BlackList />
      <AutoSellSetting :chain="activeChain" />
      <div class="tabs">
        <button
          v-for="item in pumpConfig"
          :key="item.chain"
          :class="{ active: item.chain === activeChain }"
          class="flex-start"
          type="button"
          @click.stop="switchChain(item)"
        >
          <el-image
            style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              margin-right: 5px;
            "
            :class="{'opacity-30': item.chain !== activeChain}"
            :src="`${token_logo_url}chain/${item.chain}.png`"
          />
          <span>{{ item.chain_show || '' }}</span>
        </button>
      </div>
    </div>
    <el-row type="flex" :gutter="pumpSetting.isGutter ? 10 : 2" class="w-full px-16px">
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
            <AudioSelect activeTab="new" />
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
            <AudioSelect activeTab="soon" />
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
            <AudioSelect activeTab="graduated" />
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
import PumpList from './pumpList.vue'
import Setting from './setting.vue'
import BlackList from './blackList.vue'
import PumpFilter from './pumpFilter.vue'
import { _getPumpConfig, _getPumpList } from '@/api/pump'
import type {
  PumpConfig,
  PumpObj,
  ChainKey,
  CategoryKey,
  WSPump,
  pumpData
} from '@/api/types/pump'
import { throttle } from 'lodash-es'
import { isJSON, formatUrl, usePumpTableDataFetching } from '@/utils/index'
import AutoSellSetting from '@/components/autoSellSetting/index.vue'
import AudioSelect from './audioSelect.vue'
const Timer = {
  new: null,
  soon: null,
  graduated: null
}
const { width } = useWindowSize()
console.log('-----width-------',width)
const activeTab = shallowRef('new')
const route = useRoute()
const { t } = useI18n()
const wsStore = useWSStore()
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const activeChain = useStorage<ChainKey>(
  'pump_activeChain',
  'solana',
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
const fourmemeListObj = reactive<
  Record<ChainKey, Record<CategoryKey, PumpObj[]>>
>({
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
  // xlayer: {
  //   new: [],
  //   soon: [],
  //   graduated: [],
  // },
})

const isPausedObj = ref({
  new: false,
  soon: false,
  graduated: false,
})

const wsTableListCache = shallowRef<PumpObj[]>([])
const wsTableList = shallowRef<PumpObj[]>([])
const logoList = shallowRef<{logo_url: string, name: string, token: string, symbol: string, rTime: number }[]>([])

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
  let filterList = [...wsList1, ...list]
  if (logoList?.value?.length > 0 && filterList?.length > 0) {
    filterList = filterList.map(i => {
      const obj = logoList.value?.find(y => y.token == i.target_token)
      if (obj) {
        return {
          ...i,
          ...obj,
          logo_url: obj?.logo_url,
          name: obj?.name,
          symbol: obj?.symbol
        }
      } else {
        return i
      }
    })
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
    let filterList = [...wsList1, ...list]
    if (logoList?.value?.length > 0 && filterList?.length > 0) {
      filterList = filterList.map(i => {
        const obj = logoList.value?.find(y => y.token == i.target_token)
        if (obj) {
          return {
            ...i,
            ...obj,
            logo_url: obj?.logo_url,
            name: obj?.name,
            symbol: obj?.symbol
          }
        } else {
          return i
        }
      })
    }
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
    let filterList = [...wsList1, ...list]
    if (logoList?.value?.length > 0 && filterList?.length > 0) {
      filterList = filterList.map(i => {
        const obj = logoList.value?.find(y => y.token == i.target_token)
        if (obj) {
          return {
            ...i,
            ...obj,
            logo_url: obj?.logo_url,
            name: obj?.name,
            symbol: obj?.symbol
          }
        } else {
          return i
        }
      })
    }
    return filterList?.slice?.(0, 100)
  })
const scrollHeight = computed(()=>{
  return globalStore.tokenHistoryVisible ? 'calc(100vh - 248px)':'calc(100vh - 215px)'
})
watch(() => list1.value?.[0]?.target_token, useThrottleFn((val) => {
  const newAudio = pump_notice.value[activeChain.value]?.new
  if(newAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[newAudio as keyof typeof audioNameToResource]
      || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(() => list2.value?.[0]?.target_token, useThrottleFn((val) => {
  const soonAudio = pump_notice.value[activeChain.value]?.soon
  if(soonAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[soonAudio as keyof typeof audioNameToResource]
    || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(() => list3.value?.[0]?.target_token, useThrottleFn((val) => {
  const graduatedAudio = pump_notice.value[activeChain.value]?.graduated
  if(graduatedAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[graduatedAudio as keyof typeof audioNameToResource]
    || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(() => [pump_notice.value[activeChain.value]?.new,
pump_notice.value[activeChain.value]?.soon,
pump_notice.value[activeChain.value]?.graduated
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

watch(()=> pumpV3.value[activeChain.value].platforms, () => {
  getPumpList()
})
watch(activeChain, () => {
  getPumpList()
  wsTableListCache.value = []
  wsTableList.value = []
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstate'],
    id: 1,
  })
  setTimeout(() => {
    wsStore.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pumpstate', activeChain.value],
      id: 1,
    })
  }, 500)
})
watch(() => wsStore.wsResult[WSEventType.PUMPSTATE], (val) => {
  if (Array.isArray(val) && documentVisible.value) {
    wsUpdateTableList(val)
  }
})
watch(() => wsStore.wsResult[WSEventType.TOKEN_UPDATED], (val) => {
  if (val && documentVisible.value) {
    const rTime = Date.now()
    const obj = { ...val, rTime: rTime }
        // console.log('----obj------',obj.symbol,'--MC--',obj.market_cap, '--progress--',obj.progress,  '--top--',obj.holders_top10_ratio  )
    logoList.value = logoList?.value?.filter?.(i => i.token !== obj.token && rTime - (i.rTime || 0) <= 16000)
    logoList.value.unshift(obj)
  }
})

const getChangedValue = (A: string[], B: string[]): string | null => {
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) {
      return A[i]
    }
  }
  return null
}

onMounted(() => {
  document.addEventListener('mousemove', mouseInsideTxs)
  getPumpConfig()
  getPumpList()
  wsTableListCache.value = []
  wsTableList.value = []
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstate'],
    id: 1,
  })
  setTimeout(() => {
    wsStore.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pumpstate', activeChain.value],
      id: 1,
    })
  }, 500)
})

onUnmounted(()=>{
  document.removeEventListener('mousemove', mouseInsideTxs)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['pumpstate'],
    id: 1,
  })
  for (const key in Timer) {
    const timerKey = key as keyof typeof Timer
    if (Timer[timerKey]) {
      clearTimeout(Timer[timerKey])
      Timer[timerKey] = null
    }
  }
})

const mouseInsideTxs = throttle(function (event) {
    const element1 = document.querySelector('.pump-item_list-new')
    const element2 = document.querySelector('.pump-item_list-soon')
    const element3 = document.querySelector('.pump-item_list-graduated')
    if (!element1 && !element2 && !element3) return
    if (element1) {
    isPausedObj.value.new = getMouseInsideElement(event, element1)
    }
    if (element2) {
      isPausedObj.value.soon = getMouseInsideElement(event, element2)
    }
    if (element3) {
      isPausedObj.value.graduated = getMouseInsideElement(
        event,
        element3
      )
    }

}, 100, { leading: true, trailing: true })
function getMouseInsideElement(event:any, element:any) {
    // 获取鼠标位置
    const mouseX = event.clientX
    const mouseY = event.clientY
    // 获取元素的边界矩形
    const rect = element.getBoundingClientRect()
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    )
}
function wsUpdateBaseInfo(obj: { logo_url: string, name: string, token: string, symbol: string , rTime: number}) {
  wsTableList.value = wsTableList.value?.map(i => {
    if (obj.token == i.target_token) {
      return {
        ...i,
        logo_url: obj.logo_url,
        name: obj.name,
        symbol: obj.symbol
      }
    }
    return i
  })
  wsTableListCache.value = wsTableListCache.value?.map(i => {
    if (obj.token == i.target_token) {
      return {
        ...i,
        logo_url: obj.logo_url,
        name: obj.name,
        symbol: obj.symbol
      }
    }
    return i
  })
  const c = ['new', 'soon', 'graduated']
  c.forEach((i) => {
    fourmemeListObj[activeChain.value][i] = fourmemeListObj?.[activeChain.value][i]?.map((j) => {
      if (obj.token == j.target_token) {
        return {
          ...j,
          logo_url: obj.logo_url,
          name: obj.name,
          symbol: obj.symbol
        }
      }
      return {
        ...j,
      }
    })
  })
}
function wsUpdateTableList(wsList: WSPump[]) {
      const c = ['new', 'soon', 'graduated']
      if (!wsList?.length) return
      const rTime = Date.now()
      const list = wsList?.map?.(i => ({
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
        name:  i.target_token == i.token0_address
              ? i?.token0_name
              : i?.token1_name,
        logo_url:
        i.target_token == i.pair.token0_address
          ? i?.pair.token0_logo_url
          : i?.pair.token1_logo_url,

      }))
      const wsTableList1 = wsTableListCache?.value?.filter?.(i => !list?.some?.(j => j.pump_pair_address === i.pump_pair_address) && rTime - (i.rTime || 0) <= 15000)
      wsTableListCache.value = [...list, ...(wsTableList1 || [])]?.slice(0,100)
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

      let list1 = wsTableListCache?.value?.filter(i => i.chain === activeChain.value)
      const list2 = wsTableList?.value.filter(i => i.chain === activeChain.value)
      if (isPausedObj?.value?.new) {
        list1 = [...list1?.filter?.(i => i.state !== 'new'), ...list2?.filter?.(i => i.state === 'new')]
      }
      if (isPausedObj?.value?.soon) {
        // list1 = list1?.filter?.(i => i.state !== 'soon' && i.state !== 'migrating')
        list1 = [...list1?.filter?.(i => i.state !== 'soon' && i.state !== 'migrating'), ...list2?.filter?.(i => i.state === 'soon' || i.state === 'migrating')]
      }
      if (isPausedObj?.value?.graduated) {
        // list1 = list1?.filter?.(i => i.state !== 'graduated')
        list1 = [...list1?.filter?.(i => i.state !== 'graduated' && i.state !== 'migrated'), ...list2?.filter?.(i => i.state === 'graduated' || i.state === 'migrated' )]
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
              return y.platform
            }
          } else {
            return y.platform
          }
        }) || []
        if (i.chain == 'solana') {

          console.log('----platforms--111-----',platforms)
        }
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
  val: { progress_min: string | undefined, progress_max: string | undefined },
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
  getPump({ ...params, ...val }, true)
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

function getPump(params, isFilter = false) {
  // console.log('---getPump-111------',params)
  const chain = activeChain.value
  if (Timer[params.category]) {
    clearTimeout(Timer[params.category])
    Timer[params.category] = null
  }
  if (route.name !== 'pump' || !documentVisible.value) {
    return
  }
  if ((isPausedObj.value?.[params.category] || route.name !== 'pump') && !isFilter) {
    Timer[params.category] = setTimeout(() => {
      getPump(params)
    }, 5000)
    return
  }
  params.chain = chain
  if (pumpV3.value[chain]?.[params.category]?.count === 0) {
    pumpV3.value[chain][params.category]['loading'] = true
  }

  if (pumpV3.value?.[activeChain.value]?.platforms?.length > 0) {
    params.platforms = pumpV3.value[activeChain.value]?.platforms?.join(',')
  }
  if (params.has_sm) {
    params.has_sm = true
    if (params?.sm_list?.length > 0) {
      delete params?.sm_list
    }
  }
  if (!params.has_sm && Array.isArray(params?.sm_list) && params?.sm_list?.length > 0) {
    params.sm_list =  params?.sm_list.join(',')
  }
  params = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value != null && value !== '' && Boolean(value))
  )
  _getPumpList(params)
    .then((res) => {
      const list = (res || [])?.map?.((i) => {
        return {
          ...i,
          id: `${i.target_token}-${i.chain}`,
          pair_id: `${i.pair}-${i.chain}`,
          token: i.target_token,
          progress: Number(i.progress || 0),
          symbol:
            i.target_token == i.token0_address
              ? i?.token0_symbol
              : i?.token1_symbol,
          name:  i.target_token == i.token0_address
              ? i?.token0_name
              : i?.token1_name,
          logo_url:
            i.target_token == i.token0_address
              ? i?.token0_logo_url
              : i?.token1_logo_url,
          target_opening_at:
            i?.target_opening_at !== '1970-01-01T00:00:00Z' &&
            i?.target_opening_at !== '0001-01-01T00:00:00Z'
              ? new Date(i?.target_opening_at).getTime()
              : 0,
          created_at:
            i?.created_at !== '1970-01-01T00:00:00Z' &&
            i?.created_at !== '0001-01-01T00:00:00Z'
              ? new Date(i?.created_at).getTime()/1000
              : '0',
          liq:
            i.target_token !== i.token0_address
              ? i.reserve0 * i.token0_price_usd * 2
              : i.reserve1 * i.token1_price_usd * 2,
          medias: getMedias(i.appendix)
        }
      })
      fourmemeListObj[activeChain.value][params.category as CategoryKey] = list?.slice?.(0,100)
      wsTableListCache.value =
        wsTableListCache?.value.filter?.(
          (i) => !list?.some?.((j) => j?.pair === i?.pair)
      )?.slice?.(0,100) || []
    })
    .finally(() => {
      pumpV3.value[chain][params.category]['loading'] = false
      pumpV3.value[chain][params.category].count ++
      Timer[params.category] = setTimeout(() => {
            getPump(params)
          }, 10000)
    })
}
function getMedias(appendix: string) {
  if (!appendix) return []
  if (isJSON(appendix)) {
    const obj = JSON.parse(appendix)
    const arr = []
    if (obj?.website)
      arr.push({
        name: t('website'),
        icon: 'web',
        url: formatUrl(obj.website),
      })
    if (obj?.btok)
      arr.push({
        name: 'Btok',
        icon: 'btok',
        url: formatUrl(obj.btok),
      })
    if (obj?.qq) arr.push({ name: 'QQ', icon: 'qq', url: obj.qq })
    if (obj?.telegram)
      arr.push({
        name: 'Telegram',
        icon: 'tg',
        url: formatUrl(obj.telegram),
      })
    if (obj?.twitter)
      arr.push({
        name: 'Twitter',
        icon: 'twitter',
        url: formatUrl(obj.twitter),
      })
    return arr
  }
  return []
}
function getFilterData(list, conditions) {
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
  console.log('------switchChain--------',item.chain)
  activeChain.value = item.chain
}

const documentVisible = useDocumentVisibility()

watch(documentVisible, (val) => {
  if (val) {
    if (route.name === 'pump') {
      getPumpList()
    }
  }
})
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--main-input-button-bg);
  padding: 1px;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;
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
    min-width: 36px;
    padding: 5px 10px;
    text-align: center;
    &.active {
      color: var(--main-text);
      background: var(--tab-active-bg);
    }
  }
}
.btn {
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
  background: var(--secondary-bg);
  border: 1px solid var(--main-input-button-bg);
  border-radius: 4px;
}
</style>
