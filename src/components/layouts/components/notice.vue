<template>
  <el-popover
v-model:visible="visible"
:persistent="false"
    placement="bottom-end"
    :width="450"
    trigger="click"
    popper-class="[--el-popover-bg-color:--border]"
  >
    <template #reference>
      <div
        class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px flex items-center"
        @click.stop="visitSysNotice"
      >
        <el-badge :is-dot="limitOrderUnRead||!isLatestExperienced || newRemind" class="h-20px" color="#F6465D">
          <Icon
            class="text-20px text-[--secondary-text] cursor-pointer"
            name="material-symbols:notifications"
          />
        </el-badge>
      </div>
    </template>
    <div class="p-20px pr-0">
      <div class="flex mr-20px items-center gap-20px mb-20px border-b-solid border-b-1px border-b-[--dialog-divider]">
        <a
          href="javascript:;"
          :class="`decoration-none text-14px lh-16px pb-12px text-center b-b-solid b-b-2px
         ${activeTab == 'notice' ? 'color-[--main-text] b-b-[--main-text]':'b-b-transparent color-[--third-text]'}`"
          @click="activeTab = 'notice'"
        >
          {{ $t('notice') }}
        </a>
        <a
          v-show="isBotLogin && completedLimitTx.length > 0"
          href="javascript:;"
          :class="`decoration-none text-14px lh-16px pb-12px text-center b-b-solid b-b-2px
         ${isLimitOrder ? 'color-[--main-text] b-b-[--main-text]':'b-b-transparent color-[--third-text]'}`"
          @click.stop="handleVisible"
          @click="activeTab='limitOrder'"
        >
          {{ $t('limitOrder') }}
        </a>
        <a
          href="javascript:;"
          :class="`decoration-none text-14px lh-16px pb-12px text-center b-b-solid b-b-2px
         ${activeTab == 'remind' ? 'color-[--main-text] b-b-[--main-text]':'b-b-transparent color-[--third-text]'}`"
          @click="switchRemind"
        >
         {{ $t('alerts') }}
        </a>
        <div class="flex-1" />
          <a
          v-if="activeTab == 'remind'"
          href="javascript:;"
          class="decoration-none text-12px lh-16px pb-12px text-center b-b-solid b-b-2px b-b-transparent color-[--third-text] hover:opacity-90"
          @click="deleteNotifyHistory"
        >
         {{ $t('clearAll') }}
        </a>
      </div>
      <el-scrollbar
        max-height="500px"
      >
        <ul
          v-show="activeTab == 'notice'"
          class="pr-20px flex flex-col gap-30px"
        >
          <li
            v-for="({title,content,time},idx) in announceList"
            :key="idx"
          >
            <h2
              class="text-16px mb-10px color-[--main-text] font-600"
            >
              {{ title }}
            </h2>
            <div class="text-12px mb-4px notice-content" v-html="content"/>
            <p class="text-12px color-[--third-text] my-0">
              {{ formatDate(time, 'YYYY/MM/DD HH:mm:ss') }}
            </p>
          </li>
          <li
            v-show="announceList.length === 0"
            class="flex items-center justify-center pb-20px h-150px"
          >
            <AveEmpty/>
          </li>
        </ul>
        <ul
          v-show="isLimitOrder"
          class="pr-20px flex flex-col gap-30px"
        >
          <li
            v-for="(item, index) in completedLimitTx"
            :key="index"
            class="cursor-pointer hover:opacity-50"
            @click.stop="tableRowClick(item)"
          >
            <div
              :class="`text-16px ${lastVisitedTime < item.blockTime?'':''}`"
            >
              {{ item.symbol }} {{ $t('limitOrder') }}{{
                item.status === 'auto_cancelled' ? $t('autoCancel') : ''
              }}
            </div>
            <div
              v-if="item.status === 'error'"
              class="text-12px mt-5px"
            >
              {{ item.symbol }} {{ $t('limitOrderFail') }} {{
                formatNumber(formatUnits(new BigNumber(item.inAmount || 0).toFixed(0), item.inTokenDecimals || 0).toString(), 3)
              }} {{ item.inTokenSymbol }} {{ $t('failReason') }}: {{ formatBotError(item.errorLog) }}
            </div>
            <div v-else-if="item.status === 'cancelled'" class="text-12px mt-5px">{{ item.symbol }} {{
                $t('limitOrderCancel')
              }} {{
                formatNumber(formatUnits(new BigNumber(item?.inAmount || 0).toFixed(0), item.inTokenDecimals || 0).toString(), 3)
              }} {{ item?.inTokenSymbol }}
            </div>
            <div v-else-if="item.status === 'confirmed'" class="text-12px mt-5px">{{ item.symbol }} {{
                $t('limitOrderSuccess', {
                  a: formatNumber(item.amount, 3),
                  s: item.symbol,
                  p: formatNumber(item.price),
                  t: item.isBuy ? $t('bought') : $t('sold')
                })
              }}
            </div>
            <div v-else-if="item.status === 'auto_cancelled'" class="text-12px">{{ item.symbol }}
              {{ $t('limitOrderAutoCancel', {f: formatBotError(item?.errorLog || '')}) }}
            </div>
            <div class="color-[--third-text] text-12px">{{ formatDate((item?.updateTime) || item?.createTime) }}</div>
          </li>
        </ul>
        <div v-if="activeTab == 'remind'" class="min-h-500px">
          <div v-for="(item, $index) in remindHistoryList" :key="$index" class="item">
            <div class="flex-between items-center parent cursor-pointer">
              <NuxtLink
                :to="`/token/${item.token_address}-${item.chain}`"
                class="flex no-underline items-center"
                @click.stop.prevent="visible = false"
              >
              <token-img :row="item" />
              <span class="text-16px font-500 ml-8px ellipsis">{{ item.symbol }}</span>
            </NuxtLink>

              <Icon
                class="text-16px"
                :name="`custom:${item.direction == 'up' ? 'arrow-up' : 'arrow-down'}`"
              />
              <span class="ml-4px text-14px" :class="item.direction == 'up'? 'color-[--up-color]':'color-[--down-color]'">{{
                item.direction == 'up' ? $t('gtPrice') : $t('ltPrice')
              }}</span>
              <span class="ml-4px text-14px"
                >${{ formatNumber(item.warning_price || 0, { decimals: 4, limit: 6 }) }}</span
              >
              <span class="color-[--down-color] ml-4px text-14px"
                >({{ item.is_repeatable == 1 ? $t('duplicate'): $t('once')}})</span
              >
              <div class="flex-1" />
              <!-- <span class="color-[--third-text] text-12px">{{ formatTimeFromNow(item.create_time) }}</span> -->
              <span v-if="!(item?.create_time)" class="color-[--third-text] text-12px"> - </span>
              <TimerCount
                v-else-if="
                  Number(formatTimeFromNow(item?.create_time, true)) < 60
                "
                :key="`${item.create_time}`"
                :timestamp="Number(item.create_time)"
                :end-time="60"
              >
                <template #default="{ seconds }">
                  <span class="color-#FFA622 text-12px">
                    <template v-if="seconds < 60"> {{ seconds }}s </template>
                    <template v-else>
                      {{ formatTimeFromNow(item.create_time) }}
                    </template>
                  </span>
                </template>
              </TimerCount>
              <span
v-else
class="color-[--third-text] text-12px"
              >
                {{
                  formatTimeFromNow(
                    Number(item?.create_time)
                  )

                }}
              </span>
            </div>
          </div>
          <div
            v-if="remindHistoryList?.length == 0 && !loadingRemindHistory"
            class="empty text-14px color-[--icon-color] flex items-center justify-center flex-col mt-100px "
          >
            <Icon class="text-40px" name="custom:bell" />
            <span class="mt-10px">{{ $t('emptyAlert') }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import AveEmpty from '@/components/aveEmpty.vue'
import {useStorage} from '@vueuse/core'
import {evm_utils} from '@/utils'
import BigNumber from 'bignumber.js'
import {getAnnounces, getLatest} from '~/api/user'
import {getCompletedLimitTx, type IGetMarketCompletedLimitResponse} from '~/api/bot'

const NOTICE_FILTER_TIME = 1744460716
const {formatUnits} = evm_utils
const ACTIVE_ENUM = {
  notice: 'notice',
  limitOrder: 'limitOrder',
  remind: 'remind'
} as const

interface ICompletedLimitTx extends IGetMarketCompletedLimitResponse {
  symbol: string
  amount: any
  price: string
  isBuy: boolean
}

type ActiveTab = keyof typeof ACTIVE_ENUM
const followStore = useFollowStore()
const lastExperienceTime = useStorage('lastExperienceTime', 0, localStorage)
const themeStore = useThemeStore()
const wsStore = useWSStore()
const botStore = useBotStore()
const visitedTime = useStorage('botLimitNotificationTime', 0, localStorage)
const lastVisitedTime = ref<number>(visitedTime.value || 0)
const visible = ref(false)
const activeTab = ref<ActiveTab>('notice')
const announceList = ref<any[]>([])
const completedLimitTx = shallowRef<ICompletedLimitTx[]>([])

const globalStore = useGlobalStore()
const remindStore = useRemindStore()
const { remindCount, newRemind, remindHistoryList,loadingRemindHistory } = storeToRefs(remindStore)
const { getNotifyHistoryList, deleteNotifyHistory } = remindStore

const limitOrderUnRead = computed(() => completedLimitTx.value?.some(i => visitedTime.value < (i.blockTime || Number(i.batchId) / 1000)))
const isLimitOrder = computed(() => activeTab.value === ACTIVE_ENUM.limitOrder)
const isBotLogin = computed(() => botStore.userInfo && botStore.userInfo.name)
const isLatestExperienced = computed(() => {
  return !globalStore.latestNotice.time
    || globalStore.latestNotice.time <= NOTICE_FILTER_TIME
    || Number(lastExperienceTime.value) >= Number(globalStore.latestNotice.time)
})

const currentAddress = computed(() => {
  return followStore.currentAddress || ''
})
watch(remindCount, (val) => {
  if (val && activeTab.value == 'remind') {
    setTimeout(() => {
      getNotifyHistoryList()
    }, 500)
  }
})
watch(
  () => currentAddress.value,
  (val) => {
    if (val) {
      getNotifyHistoryList()
    } else {
      remindHistoryList.value = []
    }
  }
)
watch(visible, (val) => {
  if (!val) {
    lastVisitedTime.value = visitedTime.value
  }
})

watch(() => wsStore.wsResult[WSEventType.TGBOT], (val) => {
  if (val && val?.swapType > 2) {
    _getCompletedLimitTx()
  }
})

watch(() => botStore.evmAddress, () => {
  if (botStore.evmAddress) {
    _getCompletedLimitTx()
  }
}, {
  immediate: true
})

watch(() => useLocaleStore().locale, () => {
  getNoticeList()
  if (botStore.evmAddress) {
    _getCompletedLimitTx()
  }
})

onMounted(() => {
  getNoticeList()
  getLatestNotice()
})

async function _getCompletedLimitTx() {
  try {
    const chainMainToken: Record<string, string> = {
      solana: 'sol',
      ton: 'TON'
    }
    const res = await getCompletedLimitTx(botStore.evmAddress)
    completedLimitTx.value = (res || []).map(el => {
      const isBuy = (el.inTokenAddress === (chainMainToken[el.chain] || NATIVE_TOKEN))
      let inAmount: any = new BigNumber(el.inAmount || 0).toFixed(0)
      inAmount = !(el.inTokenDecimals) ? inAmount : (formatUnits(inAmount, el.inTokenDecimals || 0))
      let outputAmount: any = new BigNumber(el?.outputAmount || 0).toFixed(0)
      outputAmount = !(el.outTokenDecimals) ? outputAmount : (formatUnits(outputAmount, el.outTokenDecimals || 0))
      return {
        ...el,
        isBuy,
        symbol: !isBuy ? el.inTokenSymbol : el.outTokenSymbol,
        amount: !isBuy ? inAmount : outputAmount,
        price: !isBuy ? el.inPrice : el.outPrice
      }
    })
  } catch (err) {
    console.log('=>(notice.vue:187) err', err)
  }
}

function handleVisible() {
  lastVisitedTime.value = visitedTime.value
  const max = Math.max(...completedLimitTx.value.map((i: any) => (i?.blockTime || (i?.batchId / 1000))))
  visitedTime.value = max || parseInt(String(Date.now() / 1000)) || 0
}

function tableRowClick(row: any) {
  if (!row.txHash) return
  window.open(formatExplorerUrl(row.chain, row.txHash, 'tx'))
}

async function getNoticeList() {
  try {
    const res = await getAnnounces()
    announceList.value = (res || []).filter((el: any) => el.time > NOTICE_FILTER_TIME)
  } catch (e) {
    console.log('=>(notice.vue:160) e', e)
  }
}

async function getLatestNotice() {
  const res = await getLatest()
  globalStore.latestNotice = res
}

function visitSysNotice() {
  lastExperienceTime.value = globalStore.latestNotice.time
}
function switchRemind() {
  activeTab.value = 'remind'
  newRemind.value = false
  getNotifyHistoryList()
}
</script>
<style lang="scss" scoped>
.item {
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  margin-top: 12px;
  padding-right: 15px;
  .parent {
    &:hover {
      .delete {
        color: var(--down-color);
      }
    }
  }
  ul li {
    &:hover {
      .delete-children {
        display: block;
        color: var(--down-color);
      }
    }
  }

  .delete {
    color: var(--third-text);
  }
  .delete-children {
    display: none;
  }
}
</style>
