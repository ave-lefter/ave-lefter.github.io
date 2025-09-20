<template>
  <div class="pump w-full bg-[--main-bg]">
    <div class="flex-start p-x-17px py-12px bg-[--main-bg] mb-1px mt-1px">
      <el-popover
        v-model:visible="visible_platforms"
        placement="bottom-start"
        popper-class="new-popover"
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
              <div v-if="item.platforms?.length <= 1" class="pump-platforms">
                <el-checkbox
                  v-for="i in item.platforms"
                  :key="i.platform"
                  :label="i.platform_show"
                  :model-value="true"
                  disabled
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
              </div>

              <el-checkbox-group
                v-else
                v-model="pump_solana_platforms"
                class="pump-platforms"
              >
                <el-checkbox
                  v-for="i in item.platforms"
                  :key="i.platform"
                  :label="i.platform_show"
                  :value="i.platform"
                  :disabled="
                    pump_solana_platforms?.includes(i.platform) &&
                    pump_solana_platforms?.length === 1
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
          @click.stop="activeChain = item.chain"
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
      <el-col v-show="single('new') && pumpSetting.grid['new'].show" :span="getSpan()" :style="{order: orderNew}">
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
            <span  v-show="isPausedObj.new" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <el-input
              v-if="pumpSetting?.show_search"
              ref="inputSearch"
              v-model.trim="pump_query[activeChain].new"
              class="search-input1 px-20px mr-4px"
              size="small"
              :placeholder="$t('search')"
              @input="(val) => pump_query[activeChain].new = val.replace(/\s/g, '')"
            >
              <template #prefix>
                <Icon
                  class="text-12px text-[var(--third-text)]"
                  name="custom:search"
                />
              </template>
              <template #suffix>
                <Icon
                  v-if="pump_query[activeChain].new"
                  name="pajamas:clear"
                  class="color-[--third-text] text-12px hover:opacity-70% cursor-pointer mr-10px"
                  @click="pump_query[activeChain].new = ''"
                />
              </template>
            </el-input>
            <!-- <span class="bg-[--main-input-button-bg] py-4px px-10px rounded-4px mr-4px color-[--third-text] cursor-pointer  hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.new } "  @click="pump_notice[activeChain].new = !pump_notice[activeChain].new">
            <Icon
            name="icon-park-solid:volume-notice"
            class="text-12px"
            />
            </span> -->
            <AudioSelect activeTab="new" />
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_new`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>

          <PumpList
            class="pump-item_list-new"
            type="new"
            :tableList="list1 || []"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'new']"
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
            <span  v-show="isPausedObj.soon" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <el-input
              v-if="pumpSetting?.show_search"
              ref="inputSearch"
              v-model.trim="pump_query[activeChain].soon"
              class="search-input1 px-20px mr-4px"
              size="small"
              :placeholder="$t('search')"
              @input="(val) => pump_query[activeChain].soon = val.replace(/\s/g, '')"
            >
              <template #prefix>
                <Icon
                  class="text-12px text-[var(--third-text)]"
                  name="custom:search"
                />
              </template>
              <template #suffix>
                <Icon
                  v-if="pump_query[activeChain].soon"
                  name="pajamas:clear"
                  class="color-[--third-text9] text-12px hover:opacity-70% cursor-pointer mr-10px"
                  @click="pump_query[activeChain].soon = ''"
                />
              </template>
            </el-input>
            <!-- <span class="bg-[--main-input-button-bg] py-4px px-10px rounded-4px mr-4px color-[--third-text] cursor-pointer hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.soon } "  @click="pump_notice[activeChain].soon = !pump_notice[activeChain].soon">
              <Icon
              name="icon-park-solid:volume-notice"
              class="text-12px"
              />
            </span> -->
            <AudioSelect activeTab="soon" />
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_soon`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-soon"
            type="soon"
            :tableList="list2 || []"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'soon']"
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

            <span  v-show="isPausedObj.graduated" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-8px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-16px"/>
            </span>
            <span class="flex-1" />
            <el-input
              v-if="pumpSetting?.show_search"
              ref="inputSearch"
              v-model.trim="pump_query[activeChain].graduated"
              class="search-input1 px-20px mr-4px"
              size="small"
              :placeholder="$t('search')"
              @input="(val) => pump_query[activeChain].graduated = val.replace(/\s/g, '')"
            >
              <template #prefix>
                <Icon
                  class="text-12px text-[var(--third-text)]"
                  name="custom:search"
                />
              </template>
              <template #suffix>
                <Icon
                  v-if="pump_query[activeChain].graduated"
                  name="pajamas:clear"
                  class="color-[--third-text] text-12px hover:opacity-70% cursor-pointer mr-10px"
                  @click="pump_query[activeChain].graduated = ''"
                />
              </template>
            </el-input>
            <!-- <span class="bg-[--main-input-button-bg] py-4px px-10px rounded-4px mr-4px color-[--third-text] cursor-pointer hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.graduated } "  @click="pump_notice[activeChain].graduated = !pump_notice[activeChain].graduated">
              <Icon
              name="icon-park-solid:volume-notice"
              class="text-12px"
              />
            </span> -->
            <AudioSelect activeTab="graduated" />
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_graduated`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-graduated"
            :tableList="list3 || []"
            type="graduated"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'graduated']"
            isOut
          />
        </div>
      </el-col>
    </el-row>

    <audio
      ref="pumpAudio" controls style="display: none"
      :src="audioUrl"
      :volume="+globalStore.audioSettings.audio.signal/100 || 0.5"
    />
  </div>
</template>

<script setup lang="ts">
import { useStorage, useDebounceFn, useWindowSize, useThrottleFn } from '@vueuse/core'
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
  WSPump
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
  sessionStorage
)
const audioUrl = ref('')
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, pumpBlackList } = storeToRefs(globalStore)

const orderNew = computed(() => {
  return pumpSetting.value.grid['new'].order
})
const orderSoon = computed(() => {
  return pumpSetting.value.grid['soon'].order
})
const orderGraduated= computed(() => {
  return pumpSetting.value.grid['graduated'].order
})
const pumpConfig = shallowRef<PumpConfig[]>()
const isRotate = ref(false)
const pump_count = shallowRef({
  solana: {
      new: 0,
      soon: 0,
      graduated: 0
    },
  bsc: {
    new: 0,
    soon: 0,
    graduated: 0
  }
})
const pump_query  = useStorage(
  'pump_query',
  {
    solana: {
      new: '',
      soon: '',
      graduated: ''
    }
    ,
    bsc: {
      new: '',
      soon: '',
      graduated: ''
    }
  },
  localStorage
)

const pumpFilter_bsc_new = usePumpTableDataFetching('pumpFilter_bsc_new')
const pumpFilter_bsc_soon = usePumpTableDataFetching('pumpFilter_bsc_soon')
const pumpFilter_bsc_graduated = usePumpTableDataFetching(
  'pumpFilter_bsc_graduated'
)
const pumpFilter_solana_new = usePumpTableDataFetching('pumpFilter_solana_new')
const pumpFilter_solana_soon = usePumpTableDataFetching(
  'pumpFilter_solana_soon'
)
const pumpFilter_solana_graduated = usePumpTableDataFetching(
  'pumpFilter_solana_graduated'
)
const pump_solana_platforms = useStorage(
  'pump_solana_platforms1',
  ['pump', 'moonshot', 'raydium','believe', 'jupstudio','moon_new','cookingcity', 'bonk', 'bags', 'heaven'],
  localStorage
)

const {pump_notice} = storeToRefs(usePumpStore())
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
})
const loading: Record<string, boolean> = reactive({
  'bsc-new': false,
  'bsc-soon': false,
  'bsc-graduated': false,
  'solana-new': false,
  'solana-soon': false,
  'solana-graduated': false,
})

const isPausedObj = ref({
  new: false,
  soon: false,
  graduated: false,
})

const wsTableListCache = ref<PumpObj[]>([])
const wsTableList = ref<PumpObj[]>([])
const logoList = ref<{logo_url: string, name: string, token: string, symbol: string, rTime: number }[]>([])

const platformsList = computed(() => {
  const list = pumpConfig?.value?.filter((i) => i?.chain === activeChain.value)
  console.log('----list--------',platforms.value)
  return (
    list?.[0]?.platforms?.filter((i) =>
      platforms?.value.includes(i.platform)
    ) || []
  )
})
const platforms = computed(() => {
  if (activeChain.value == 'solana') {
    return pump_solana_platforms?.value?.join(',')
  } else {
  return 'fourmeme'}
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
  const pumpFilter_new = localStorage.getItem(
    `pumpFilter_${activeChain.value}_new`
  )

const wsList = getFilterData(list1, pumpFilter_new)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
  let filterList = [...wsList1, ...list]
  if (logoList?.value?.length > 0 && filterList?.length > 0) {
    filterList = filterList.map(i => {
      const obj = logoList.value?.find(y => y.token == i.target_token)
      if (obj) {
        return {
          ...i,
          logo_url: obj?.logo_url,
          name: obj?.name,
          symbol: obj?.symbol
        }
      } else {
        return i
      }
    })
  }
  return filterList
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
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'soon' && i.chain === activeChain.value)
  const pumpFilter_soon = localStorage.getItem(
    `pumpFilter_${activeChain.value}_soon`
  )
  const wsList = getFilterData(list1, pumpFilter_soon)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
    let filterList = [...wsList1, ...list]
    if (logoList?.value?.length > 0 && filterList?.length > 0) {
      filterList = filterList.map(i => {
        const obj = logoList.value?.find(y => y.token == i.target_token)
        if (obj) {
          return {
            ...i,
            logo_url: obj?.logo_url,
            name: obj?.name,
            symbol: obj?.symbol
          }
        } else {
          return i
        }
      })
    }
    return filterList
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
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'graduated' && i.chain === activeChain.value)
  const pumpFilter_graduated= localStorage.getItem(
    `pumpFilter_${activeChain.value}_graduated`
  )
  const wsList = getFilterData(list1, pumpFilter_graduated)
  const wsList1 = wsList?.filter((i: { pair: string }) => !list?.some(j => j.pair === i.pair))
    let filterList = [...wsList1, ...list]
    if (logoList?.value?.length > 0 && filterList?.length > 0) {
      filterList = filterList.map(i => {
        const obj = logoList.value?.find(y => y.token == i.target_token)
        if (obj) {
          return {
            ...i,
            logo_url: obj?.logo_url,
            name: obj?.name,
            symbol: obj?.symbol
          }
        } else {
          return i
        }
      })
    }
    return filterList
  })
watch(() => list1.value?.[0]?.target_token, useThrottleFn((val) => {
  const newAudio = pump_notice.value[activeChain.value].new
  if(newAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[newAudio as keyof typeof audioNameToResource]
    || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(() => list2.value?.[0]?.target_token, useThrottleFn((val) => {
  const soonAudio = pump_notice.value[activeChain.value].soon
  if(soonAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[soonAudio as keyof typeof audioNameToResource]
    || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(() => list3.value?.[0]?.target_token, useThrottleFn((val) => {
  const graduatedAudio = pump_notice.value[activeChain.value].graduated
  if(graduatedAudio && pumpAudio.value && val) {
    audioUrl.value = audioNameToResource[graduatedAudio as keyof typeof audioNameToResource]
    || audioNameToResource.Beep
    pumpAudio.value.play()
  }
},300))
watch(()=>[pump_notice.value[activeChain.value].new,
pump_notice.value[activeChain.value].soon,
pump_notice.value[activeChain.value].graduated
],(val)=>{
  if(val.some(el=>!!el)){
    setTimeout(()=>{
      if(pumpAudio.value){
        pumpAudio.value.play()
      }
    })
  }
})
watch(pump_solana_platforms, () => {
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
  if (Array.isArray(val)) {
    wsUpdateTableList(val)
  }
})
watch(() => wsStore.wsResult[WSEventType.TOKEN_UPDATED], (val) => {
  if (val) {
    const rTime = Date.now()
    const obj = { ...val, rTime: rTime }
    logoList.value = logoList?.value?.filter?.(i => i.token !== obj.token && rTime - (i.rTime || 0) <= 16000)
    logoList.value.unshift(obj)
  }
})
watch(()=>pump_query.value[activeChain.value].new, () => {
  debouncedFetch('new')
}, { deep: true })
watch(()=>pump_query.value[activeChain.value].soon, () => {
  debouncedFetch('soon')
}, { deep: true })
watch(()=>pump_query.value[activeChain.value].graduated, () => {
  debouncedFetch('graduated')
}, { deep: true })

const debouncedFetch = useDebounceFn((type)=>search(type), 500)
function search(type: string) {
  if (type == 'new') {
    const pumpFilter_new = localStorage.getItem(`pumpFilter_${activeChain.value}_new`)
    const params1 = {
      category: 'new',
      ...(pumpFilter_new ? JSON.parse(pumpFilter_new) : ''),
    }
    getPump(params1, true)
  }
  if (type == 'soon') {
    const pumpFilter_soon = localStorage.getItem(`pumpFilter_${activeChain.value}_new`)
    const params2 = {
      category: 'soon',
      ...(pumpFilter_soon ? JSON.parse(pumpFilter_soon) : ''),
    }
    getPump(params2, true)
  }
  if (type == 'graduated') {
    const pumpFilter_graduated = localStorage.getItem(`pumpFilter_${activeChain.value}_graduated`)
    const params3 = {
      category: 'graduated',
      ...(pumpFilter_graduated ? JSON.parse(pumpFilter_graduated) : ''),
    }
    getPump(params3, true)
  }
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
// function wsUpdateBaseInfo(obj: { logo_url: string, name: string, token: string, symbol: string , rTime: number}) {
//   wsTableList.value = wsTableList.value?.map(i => {
//     if (obj.token == i.target_token) {
//       return {
//         ...i,
//         logo_url: obj.logo_url,
//         name: obj.name,
//         symbol: obj.symbol
//       }
//     }
//     return i
//   })
//   wsTableListCache.value = wsTableListCache.value?.map(i => {
//     if (obj.token == i.target_token) {
//       return {
//         ...i,
//         logo_url: obj.logo_url,
//         name: obj.name,
//         symbol: obj.symbol
//       }
//     }
//     return i
//   })
//   const c = ['new', 'soon', 'graduated']
//   c.forEach((i) => {
//     fourmemeListObj[activeChain.value][i] = fourmemeListObj?.[activeChain.value][i]?.map((j) => {
//       if (obj.token == j.target_token) {
//         return {
//           ...j,
//           logo_url: obj.logo_url,
//           name: obj.name,
//           symbol: obj.symbol
//         }
//       }
//       return {
//         ...j,
//       }
//     })
//   })
// }
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
      wsTableListCache.value = [...list, ...(wsTableList1 || [])]
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
    pumpConfig.value = res
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
  const pumpFilter_new = localStorage.getItem(
    `pumpFilter_${activeChain.value}_new`
  )
  const pumpFilter_soon = localStorage.getItem(
    `pumpFilter_${activeChain.value}_soon`
  )
  const pumpFilter__graduated = localStorage.getItem(
    `pumpFilter_${activeChain.value}_graduated`
  )
  const params1 = {
    category: 'new',
    ...(pumpFilter_new ? JSON.parse(pumpFilter_new) : ''),
  }
  getPump(params1, isFilter)
  const params2 = {
    category: 'soon',
    ...(pumpFilter_soon ? JSON.parse(pumpFilter_soon) : ''),
  }

  getPump(params2, isFilter)
  const params3 = {
    category: 'graduated',
    ...(pumpFilter__graduated ? JSON.parse(pumpFilter__graduated) : ''),
  }
  getPump(params3, isFilter)
}

function getPump(params, isFilter = false) {
  const chain = activeChain.value
  if (Timer[params.category]) {
    clearTimeout(Timer[params.category])
    Timer[params.category] = null
  }

  if ((isPausedObj.value[params.category] || route.name !== 'pump') && !isFilter) {
    Timer[params.category] = setTimeout(() => {
      getPump(params)
    }, 5000)
    return
  }
  params.chain = chain
  if (pump_count.value[chain][params.category] === 0) {
    loading[chain + '-' + params.category] = true
  }

  if (chain === 'solana') {
    if (!pump_solana_platforms?.value?.length) {
      params.platforms = 'pump,moonshot'
    } else {
      params.platforms = pump_solana_platforms.value?.join(',')
    }
  } else {
    params.platforms = 'fourmeme'
  }

  if (pump_query.value[chain][params.category]) {
    if (isFilter) {
      params.q = params.q + pump_query.value[activeChain.value][params.category]
    } else {
      params.q =  pump_query.value[activeChain.value][params.category]
    }
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
        // let signal_arr = []
        // let normal_tag = []
        // if (i.dynamic_tag) {
        //   const tag_arr = JSON.parse(i.dynamic_tag) || []
        //   signal_arr = tag_arr?.filter((i) => i?.startsWith('signal'))
        //   signal_arr = signal_arr?.map((y) => ({
        //     tag:
        //       y?.split('-')[5] &&
        //       (y?.split('-')[1] == 'whale_sell' ||
        //         y?.split('-')[1] == 'whale_buy')
        //         ? `${y?.split('-')[1]}_trump`
        //         : y?.split('-')[1],
        //     color: y?.split('-')[2],
        //     n: y?.split('-')[3],
        //     timestamp: y?.split('-')[4],
        //   }))
        //   signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
        //   const kol_arr = signal_arr.filter(
        //     (item, index) =>
        //       signal_arr.findIndex((el) =>
        //         new RegExp('^kol_.*$', 'gi').test(el.tag)
        //       ) == index
        //   )
        //   const dev_arr = signal_arr.filter(
        //     (item, index) =>
        //       signal_arr.findIndex((el) =>
        //         new RegExp('^dev_.*$', 'gi').test(el.tag)
        //       ) == index
        //   )
        //   const smarter_arr = signal_arr.filter(
        //     (item, index) =>
        //       signal_arr.findIndex((el) =>
        //         new RegExp('^smarter_.*$', 'gi').test(el?.tag)
        //       ) == index
        //   )
        //   const whale_arr = signal_arr.filter(
        //     (item, index) =>
        //       signal_arr.findIndex((el) =>
        //         new RegExp('^whale_.*$', 'gi').test(el.tag)
        //       ) == index
        //   )
        //   const other_arr = signal_arr?.filter(
        //     (el) =>
        //       !new RegExp('^dev_|kol_|smarter_|whale_.*$', 'gi').test(el.tag)
        //   )
        //   signal_arr = kol_arr
        //     ?.concat(dev_arr)
        //     ?.concat(smarter_arr)
        //     ?.concat(whale_arr)
        //     ?.concat(other_arr)
        //   signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
        //   normal_tag = tag_arr.filter((i) => !i?.startsWith('signal'))
        // }
        // normal_tag =
        //   normal_tag?.map((i) => ({
        //     tag: i,
        //     color: 'green',
        //     showText: false,
        //   })) || []

        // let tag_arr = []
        // if (i.tag) {
        //   tag_arr = i.tag?.split(',') || []
        // }
        // const is_rug_pull =
        //   signal_arr?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag)) ||
        //   normal_tag?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag))
        // const is_shit_coins =
        //   signal_arr?.some((i) => new RegExp('shitcoin', 'gi').test(i?.tag)) ||
        //   normal_tag?.some((i) => new RegExp('shitcoin', 'gi').test(i.tag))
        // if (i.risk_score >= 100 && i.chain == 'solana') {
        //   signal_arr = []
        //   normal_tag = [
        //     {
        //       tag: 'flag_dangerous',
        //       color: 'red',
        //       showText: true,
        //     },
        //   ]
        // } else if (is_rug_pull) {
        //   signal_arr = []
        //   normal_tag = [
        //     {
        //       tag: 'flag_rug_pull',
        //       color: 'red',
        //       showText: true,
        //     },
        //   ]
        // } else if (is_shit_coins) {
        //   signal_arr = []
        //   normal_tag = [
        //     {
        //       tag: 'flag_shit_coins',
        //       color: 'red',
        //       showText: true,
        //     },
        //   ]
        // }
        // if (i.cto_flag == 1) {
        //   normal_tag.unshift({
        //     tag: 'cto_flag',
        //     color: 'green',
        //     showText: false,
        //   })
        // }
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
          medias: getMedias(i.appendix),
          // normal_tag: normal_tag?.slice(0, 3) || [],
          // signal_arr: signal_arr?.slice(0, 1) || [],
          // tag_arr,
        }
      })
      fourmemeListObj[activeChain.value][params.category as CategoryKey] = list
      wsTableListCache.value =
        wsTableListCache?.value.filter?.(
          (i) => !list?.some?.((j) => j?.pair === i?.pair)
      ) || []
    })
    .finally(() => {
      loading[chain + '-' + params.category] = false
      pump_count.value[chain][params.category] ++
      Timer[params.category] = setTimeout(() => {
            getPump(params)
          }, 5000)
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
      conditions = JSON.parse(conditions)
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
        //  platforms: 'pump,moonshot',
        if (pump_solana_platforms?.value.length > 0 && i.chain === 'solana') {
          pass = pass && pump_solana_platforms.value.includes(i.amm)
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
