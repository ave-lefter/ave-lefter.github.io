<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    :width="360"
    trigger="click"
    :popper-style="`--el-popover-padding: 0; --el-bg-color-overlay: ${ themeStore.isDark ? '#222' : '#FFF'}`"
  >
    <template #reference>
      <div
        class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px flex items-center"
        @click.stop="visitSysNotice"
      >
        <el-badge :is-dot="limitOrderUnRead||!isLatestExperienced" class="h-20px" color="#F6465D">
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
          :class="`decoration-none text-14px lh-16px pb-12px text-center color-[--third-text] b-b-solid b-b-2px
         ${!isLimitOrder ? 'color-[--main-text] b-b-[--main-text]':'b-b-transparent'}`"
          @click="activeTab = 'notice'"
        >
          {{ $t('notice') }}
        </a>
        <a
          v-show="isBotLogin && completedLimitTx.length > 0"
          href="javascript:;"
          :class="`decoration-none text-14px lh-16px pb-12px text-center color-[--third-text] b-b-solid b-b-2px
         ${isLimitOrder ? 'color-[--main-text] b-b-[--main-text]':'b-b-transparent'}`"
          @click.stop="handleVisible"
          @click="activeTab='limitOrder'"
        >
          {{ $t('limitOrder') }}
        </a>
      </div>
      <el-scrollbar
        max-height="500px"
      >
        <ul
          v-show="!isLimitOrder"
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
            <div class="text-12px mb-4px color-[--secondary-text]" v-html="content"/>
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
} as const

interface ICompletedLimitTx extends IGetMarketCompletedLimitResponse {
  symbol: string
  amount: any
  price: string
  isBuy: boolean
}

type ActiveTab = keyof typeof ACTIVE_ENUM

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
const limitOrderUnRead = computed(() => completedLimitTx.value?.some(i => visitedTime.value < (i.blockTime || Number(i.batchId) / 1000)))
const isLimitOrder = computed(() => activeTab.value === ACTIVE_ENUM.limitOrder)
const isBotLogin = computed(() => botStore.userInfo && botStore.userInfo.name)
const isLatestExperienced = computed(() => {
  return !globalStore.latestNotice.time
    || globalStore.latestNotice.time <= NOTICE_FILTER_TIME
    || String(lastExperienceTime.value) === String(globalStore.latestNotice.time)
})

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
</script>
