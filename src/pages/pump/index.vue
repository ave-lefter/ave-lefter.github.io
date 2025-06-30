<template>
  <div class="pump w-full">
    <div class="flex-start p-x-17px border border-solid border-1 border-[--d-1A1A1A-l-FFF] py-12px">
      <el-popover
        v-model:visible="visible_platforms"
        placement="bottom-start"
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
              class="text-16px"
            />
          </el-button>
        </template>
        <template #default>
          <!-- <el-checkbox
            v-model="checkAll"
            class="width_100"
            size="large"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            {{ $t('all') }}
          </el-checkbox> -->
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
      />
      <div class="flex-1" />
      <Setting :chain="activeChain"/>
      <BlackList />
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
            :src="`${token_logo_url}chain/${item.chain}.png`"
          />
          <span>{{ item.chain_show || '' }}</span>
        </button>
      </div>
    </div>
    <el-row :gutter="pumpSetting.isGutter ? 10 : 2" class="w-full bg-[--d-1A1A1A-l-FFF] pt-1px">
      <el-col :span="8">
        <div class="pump-item bg-[--d-111-l-FFF]  rounded-4px" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-10px">
            <img
              class="mr-5px"
              src="@/assets/images/pump/new.svg"
              width="24"
              alt=""
            >
            <span>{{ $t('new1') }}</span>
            <span  v-show="isPausedObj.new" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-5px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-12px"/>
            </span>

            <span class="bg-[--d-222-l-F2F2F2] py-4px px-10px rounded-4px mr-4px color-[--d-666-l-999] cursor-pointer ml-auto hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.new } "  @click="pump_notice[activeChain].new = !pump_notice[activeChain].new">
            <Icon
            name="icon-park-solid:volume-notice"
            class="text-12px"
            />
            </span>
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_new`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>

          <PumpList
            class="pump-item_list-new"
            :tableList="list1 || []"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'new']"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="pump-item bg-[--d-111-l-FFF]" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-10px rounded-4px">
            <img
              class="mr-5px"
              src="@/assets/images/pump/soon.svg"
              width="24"
              alt=""
            />
            <span>{{ $t('soon') }}</span>
            <span  v-show="isPausedObj.soon" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-5px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-12px"/>
            </span>
            <span class="bg-[--d-222-l-F2F2F2] py-4px px-10px rounded-4px mr-4px color-[--d-666-l-999] cursor-pointer ml-auto hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.soon } "  @click="pump_notice[activeChain].soon = !pump_notice[activeChain].soon">
              <Icon
              name="icon-park-solid:volume-notice"
              class="text-12px"
              />
            </span>
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_soon`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-soon"
            :tableList="list2 || []"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'soon']"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="pump-item bg-[--d-111-l-FFF]" style="padding-top: 15px;">
          <div class="pump-item_header flex-start px-10px rounded-4px">
            <img
              class="mr-5px"
              src="@/assets/images/pump/graduated.svg"
              width="24"
              alt=""
            />
            <span>{{ $t('graduated') }}</span>
            <span  v-show="isPausedObj.graduated" class=" mr-auto bg-#FFA6221A px-4px py-4px rounded-4px ml-5px flex items-center justify-center w-26px h-26px">
              <Icon name="custom:stop" class="color-#FFA622 text-12px"/>
            </span>
            <span class="bg-[--d-222-l-F2F2F2] py-4px px-10px rounded-4px mr-4px color-[--d-666-l-999] cursor-pointer ml-auto hover:color-[--d-F5F5F5-l-333]" :class="{ 'color-[--d-F5F5F5-l-333]': pump_notice[activeChain]?.graduated } "  @click="pump_notice[activeChain].graduated = !pump_notice[activeChain].graduated">
              <Icon
              name="icon-park-solid:volume-notice"
              class="text-12px"
              />
            </span>
            <PumpFilter
              :storage="`pumpFilter_${activeChain}_graduated`"
              @update:filterData="handlerFilterConfirm"
            />
          </div>
          <PumpList
            class="pump-item_list-graduated"
            :tableList="list3 || []"
            :quickBuyValue="quickBuyValue"
            :loading="loading[activeChain + '-' + 'graduated']"
            isOut
          />
        </div>
      </el-col>
    </el-row>
    <audio
      ref="pumpAudio" controls style="display: none"
      src="/signal.mp3"
    />
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
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
const { t } = useI18n()
const wsStore = useWSStore()
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const activeChain = useStorage<ChainKey>(
  'pump_activeChain',
  'solana',
  sessionStorage
)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, pumpBlackList } = storeToRefs(globalStore)

const pumpConfig = shallowRef<PumpConfig[]>()
const isRotate = ref(false)




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
  'pump_solana_platforms',
  ['pump', 'moonshot', 'raydium'],
  localStorage
)

const pump_notice = useStorage(
  'pump_notice',
  {
    solana: {
      new: false,
      soon: false,
      graduated: false
    }
    ,
    bsc: {
      new: false,
      soon: false,
      graduated: false
    }
  },
  localStorage
)
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

const platformsList = computed(() => {
  const list = pumpConfig?.value?.filter((i) => i?.chain === activeChain.value)
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
const list1 = computed(() => {
  let list = fourmemeListObj?.[activeChain.value]?.new || []
  if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
    list = list.filter(
      (item) =>
        !pumpBlackList.value?.some(
          (i) =>
            i.address == item.token ||
            i.address == item.symbol
        )
    )
  }
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'new' && i.chain === activeChain.value)
  const pumpFilter_new = localStorage.getItem(
    `pumpFilter_${activeChain.value}_new`
  )
  const wsList = getFilterData(list1, pumpFilter_new)
  const wsList1 = wsList?.filter(i => !list?.some(j => j.pair === i.pair))
  if(pump_notice.value[activeChain.value].new && pumpAudio.value && wsList1.length >0) {
    pumpAudio.value.play()
  }
  return [...wsList1, ...list]
})
const list2 = computed(() => {
  let list = fourmemeListObj?.[activeChain.value]?.soon || []
  if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
    list = list.filter(
      (item) =>
        !pumpBlackList.value?.some(
          (i) =>
            i.address == item.token ||
            i.address == item.symbol
        )
    )
  }
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'soon' && i.chain === activeChain.value)
  const pumpFilter_new = localStorage.getItem(
    `pumpFilter_${activeChain.value}_soon`
  )
  const wsList = getFilterData(list1, pumpFilter_new)
  const wsList1 = wsList?.filter(i => !list?.some(j => j.pair === i.pair))
  if(pump_notice.value[activeChain.value].soon && pumpAudio.value && wsList1.length >0) {
    pumpAudio.value.play()
  }
  return [...wsList1, ...list]
})
const list3 = computed(() => {
  let list = fourmemeListObj?.[activeChain.value]?.graduated || []
  if (pumpSetting.value.isBlacklist && pumpBlackList.value?.length > 0) {
    list = list.filter(
      (item) =>
        !pumpBlackList.value?.some(
          (i) =>
          i.address == item.token ||
          i.address == item.symbol
        )
    )
  }
  const list1 = (wsTableList.value || [])?.filter(i => i.state === 'graduated' && i.chain === activeChain.value)
  const pumpFilter_new = localStorage.getItem(
    `pumpFilter_${activeChain.value}_graduated`
  )
  const wsList = getFilterData(list1, pumpFilter_new)
  const wsList1 = wsList?.filter(i => !list?.some(j => j.pair === i.pair))
  if(pump_notice.value[activeChain.value].graduated && pumpAudio.value && wsList1.length >0) {
    pumpAudio.value.play()
  }
  return [...wsList1, ...list]
})
watch(pump_solana_platforms, () => {
  getPumpList()
})
watch(activeChain, (val) => {
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
        list1 = [...list1?.filter?.(i => i.state !== 'graduated'), ...list2?.filter?.(i => i.state === 'graduated')]
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
  val: { progress_min: string | undefined; progress_max: string | undefined },
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
  params.chain = chain
  loading[chain + '-' + params.category] = true
  if (chain === 'solana') {
    if (!pump_solana_platforms?.value?.length) {
      params.platforms = 'pump,moonshot'
    } else {
      params.platforms = pump_solana_platforms.value?.join(',')
    }
  } else {
    params.platforms = undefined
  }

  _getPumpList(params)
    .then((res) => {
      const list = (res || [])?.map?.((i) => {
        let signal_arr = []
        let normal_tag = []
        if (i.dynamic_tag) {
          const tag_arr = JSON.parse(i.dynamic_tag) || []
          signal_arr = tag_arr?.filter((i) => i?.startsWith('signal'))
          signal_arr = signal_arr?.map((y) => ({
            tag:
              y?.split('-')[5] &&
              (y?.split('-')[1] == 'whale_sell' ||
                y?.split('-')[1] == 'whale_buy')
                ? `${y?.split('-')[1]}_trump`
                : y?.split('-')[1],
            color: y?.split('-')[2],
            n: y?.split('-')[3],
            timestamp: y?.split('-')[4],
          }))
          signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
          const kol_arr = signal_arr.filter(
            (item, index) =>
              signal_arr.findIndex((el) =>
                new RegExp('^kol_.*$', 'gi').test(el.tag)
              ) == index
          )
          const dev_arr = signal_arr.filter(
            (item, index) =>
              signal_arr.findIndex((el) =>
                new RegExp('^dev_.*$', 'gi').test(el.tag)
              ) == index
          )
          const smarter_arr = signal_arr.filter(
            (item, index) =>
              signal_arr.findIndex((el) =>
                new RegExp('^smarter_.*$', 'gi').test(el?.tag)
              ) == index
          )
          const whale_arr = signal_arr.filter(
            (item, index) =>
              signal_arr.findIndex((el) =>
                new RegExp('^whale_.*$', 'gi').test(el.tag)
              ) == index
          )
          const other_arr = signal_arr?.filter(
            (el) =>
              !new RegExp('^dev_|kol_|smarter_|whale_.*$', 'gi').test(el.tag)
          )
          signal_arr = kol_arr
            ?.concat(dev_arr)
            ?.concat(smarter_arr)
            ?.concat(whale_arr)
            ?.concat(other_arr)
          signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
          normal_tag = tag_arr.filter((i) => !i?.startsWith('signal'))
        }
        // if (i.tag) {
        //   let tag = i.tag?.split(',') || []
        //   let tag1 = tag.filter(i=> i !=='pump' && i !=='moonshot')  || []
        //   normal_tag = tag1.concat(normal_tag)
        // }
        normal_tag =
          normal_tag?.map((i) => ({
            tag: i,
            color: 'green',
            showText: false,
          })) || []

        let tag_arr = []
        if (i.tag) {
          tag_arr = i.tag?.split(',') || []
        }
        const is_rug_pull =
          signal_arr?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag)) ||
          normal_tag?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag))
        const is_shit_coins =
          signal_arr?.some((i) => new RegExp('shitcoin', 'gi').test(i?.tag)) ||
          normal_tag?.some((i) => new RegExp('shitcoin', 'gi').test(i.tag))
        if (i.risk_score >= 100 && i.chain == 'solana') {
          signal_arr = []
          normal_tag = [
            {
              tag: 'flag_dangerous',
              color: 'red',
              showText: true,
            },
          ]
        } else if (is_rug_pull) {
          signal_arr = []
          normal_tag = [
            {
              tag: 'flag_rug_pull',
              color: 'red',
              showText: true,
            },
          ]
        } else if (is_shit_coins) {
          signal_arr = []
          normal_tag = [
            {
              tag: 'flag_shit_coins',
              color: 'red',
              showText: true,
            },
          ]
        }
        if (i.cto_flag == 1) {
          normal_tag.unshift({
            tag: 'cto_flag',
            color: 'green',
            showText: false,
          })
        }
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
          normal_tag: normal_tag?.slice(0, 3) || [],
          signal_arr: signal_arr?.slice(0, 1) || [],
          tag_arr,
        }
      })
      fourmemeListObj[activeChain.value][params.category as CategoryKey] = list
      wsTableListCache.value =
        wsTableListCache?.value.filter?.(
          (i) => !list?.some?.((j) => j?.pair === i?.pair)
        ) || []
      console.log('------res--------', res)
    })
    .finally(() => {
      loading[chain + '-' + params.category] = false
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
      // 筛选条件
      // dev_sale_out: 0,
      // market_cap_min: '', // 市值
      // market_cap_max: '',
      // progress_min: '', //进度
      // progress_max: '',
      // volume_u_24h_min: '', //交易额
      // volume_u_24h_max: '',
      // dev_balance_ratio_cur_min: '', //dev 持仓%
      // dev_balance_ratio_cur_max: '',
      // holders_top10_ratio_min: '', //top10 持仓%
      // holders_top10_ratio_max: '',
      // tvl_min: '',
      // tvl_max: '',
      // holder_min: '', //持有人
      // holder_max: '',
      // tx_24h_count_min: '',
      // tx_24h_count_max: '',
      // smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
      // smart_money_tx_count_24h_max: ''

      return list?.filter((i) => {
        let pass = true
        if (conditions?.dev_sale_out) {
          pass = pass && !Number(i?.dev_balance_ratio_cur)
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
        if (conditions?.progress_min) {
          pass = pass && i.progress >= Number(conditions.progress_min)
        }
        if (conditions?.progress_max) {
          pass = pass && i.progress <= Number(conditions.progress_max)
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

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--d-333333-l-eaecef);
  padding: 1px;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;

  button {
    border: none;
    // font-size: 14px;
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: 1ox solid var(--d-333333-l-F2F2F2);
    background: transparent;
    min-width: 36px;
    padding: 5px 10px;
    text-align: center;
    &.active {
      // color: var(--custom-font-4-color);
      color: var(--d-F5F5F5-l-333);
      background: var(--d-111-l-FFF);
    }
  }
}
.btn {
  border: none;
  background: var(--d-222-l-F2F2F2);
  padding: 7px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
}
</style>
