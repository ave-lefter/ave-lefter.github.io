<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import PnlSetting from './pnlSetting.vue'
import PnlHistory from './pnlHistory.vue'
import pnlImg from '@/assets/images/pnl.png'
import type { IAssetResponse } from '~/api/types/ws'
import { bot_getTokenBalance } from '~/api/bot'

const botStore = useBotStore()
const globalStore = useGlobalStore()
const pnlBoundingRect = useStorage('pnlBoundingRect', {
  width: 480,
  height: 120,
  x: 250,
  y: -38,
})
const pnlSetting = useStorage('pnl-setting', {
  chain: 'solana',
  background: pnlImg,
  blur: 0,
  opacity: 100,
  solUsdSwitch: false,
  showU: true,
})
const currentPrice = computed(() => {
  return globalStore.footerTokensPrice.find((el) => el.chain === pnlSetting.value.chain)?.current_price_usd || 0
})
const pnlData = useStorage('pnlData', {
  solana: {
    initBalance: 0,
    balance: 0,
    historyList: [],
  },
  bsc: {
    initBalance: 0,
    balance: 0,
    historyList: [],
  },
})
const currentChainPnl = computed(() => {
  return pnlData.value[pnlSetting.value.chain as keyof typeof pnlData.value]
})

const supportChains = ['solana', 'bsc']
const wsStore = useWSStore()
watch(
  () => wsStore.wsResult[WSEventType.ASSET],
  (val: IAssetResponse) => {
    if (val.transfer) {
      const { type, amount, time, chain } = val.transfer
      const isBuy = type === '0'
      if (supportChains.includes(chain)) {
        const currentData = pnlData.value[chain as keyof typeof pnlData.value]
        currentData.balance += isBuy ? Number(amount) : -amount
        pnlData.value[chain as keyof typeof pnlData.value].historyList.unshift({
          isBuy,
          amount,
          time,
          balance: currentData.balance,
        })
      }
    }
  }
)
const addresses = computed(() => {
  const result = botStore.userInfo?.addresses
  if (Array.isArray(result)) {
    return Array.from(new Set(result.map((el) => el.address)))
  }
  return []
})
watch(
  () => addresses.value,
  () => {
    if (addresses.value?.length) {
      subBalanceChange()
    }
  },
  {
    immediate: true,
  }
)
function subBalanceChange() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['asset'],
    id: 1,
  })
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['asset', addresses.value],
    id: 1,
  })
}

const onDragStop = (x: number, y: number) => {
  pnlBoundingRect.value.x = x
  pnlBoundingRect.value.y = y
}

const onResizing = (width: number, height: number) => {
  pnlBoundingRect.value.width = width
  pnlBoundingRect.value.height = height
}
const scale = computed(() => {
  return Math.min(pnlBoundingRect.value.width / 300, pnlBoundingRect.value.height / 100)
})
const pnlHistoryVisible = ref(false)
const pnlSettingVisible = ref(false)

function login() {
  botStore.changeConnectVisible(true)
}
onMounted(() => {
  getTokenBalance('solana')
})

async function getTokenBalance(chain: string) {
  const walletAddress = botStore.getWalletAddress(chain)
  if (!walletAddress) return
  const res = await bot_getTokenBalance({
    chain,
    tokens: [getNativeToken(chain)],
    walletAddress,
  })
  const token = res?.[0] || {}
  pnlData.value[chain as keyof typeof pnlData.value].balance = token.balance
}
</script>

<template>
  <Draggable
    class-name="top-0 left-0 fixed draggable"
    :z="3"
    :initialWidth="pnlBoundingRect.width"
    :initial-height="pnlBoundingRect.height"
    :x="pnlBoundingRect.x"
    :y="pnlBoundingRect.y"
    :min-width="300"
    :min-height="100"
    :parent="true"
    :handles="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']"
    @on-drag-stop="onDragStop"
    @on-resizing="onResizing"
  >
    <img
      :src="pnlSetting.background"
      alt="background"
      class="absolute top-0 left-0 w-full h-full object-cover"
      :style="{
        filter: `blur(${pnlSetting.blur}px) opacity(${pnlSetting.opacity}%)`,
      }"
    >
    <div class="w-full h-full py-12px flex flex-col relative group/item">
      <div class="flex relative justify-between items-center h-16px mb-10px px-12px">
        <div
          class="flex items-center gap-12px opacity-0 group-hover/item:opacity-100 transition-all duration-300"
        >
          <Icon
            name="custom:pump-setting"
            class="cursor-pointer text-12px color-#FFFFFF99"
            @click.self="pnlSettingVisible = true"
          />
          <Icon
            name="custom:history-fill"
            class="cursor-pointer text-16px color-#FFFFFF99"
            @click.self="pnlHistoryVisible = true"
          />
        </div>
        <div
          class="flex items-center gap-12px opacity-0 group-hover/item:opacity-100 transition-all duration-300"
        >
          <Icon name="custom:reset2" class="cursor-pointer text-12px color-#FFFFFF99" />
          <Icon name="material-symbols:close" class="cursor-pointer text-16px color-#FFFFFF99" />
        </div>
      </div>
      <div class="mt--26px flex-1 flex items-center justify-center">
        <div v-if="!botStore.evmAddress" class="text-center">
          <div class="color-[--d-999-l-666] text-12px lh-18px mb-12px">你还没有登录AVE.AI</div>
          <el-button
            size="small"
            class="[--el-button-border-color:--d-F5F5F5-l-333] [--el-button-hover-text-color:--d-F5F5F5-l-333] [--el-button-hover-border-color:--d-F5F5F5-l-333] [--el-button-hover-bg-color:transparent]"
            @click="login"
            >{{ $t('login') }}</el-button
          >
        </div>
        <div class="flex flex-1">
          <div class="flex-1 flex flex-col items-center">
            <div
              class="color-[--d-F5F5F5-l-333] font-bold mb-2px flex items-center gap-4px"
              :style="{
                fontSize: 16 * scale + 'px',
                lineHeight: 20 * scale + 'px',
              }"
            >
              <ChainToken :chain="pnlSetting.chain" :width="16 * scale" />
              {{ formatNumber(currentChainPnl.balance,3) }}
            </div>
            <span
              class="color-[--d-F5F5F5-l-333] mb-2px"
              :style="{
                fontSize: 10 * scale + 'px',
                lineHeight: 12 * scale + 'px',
              }"
              >+$0</span
            >
            <div
              class="color-[--d-999-l-666]"
              :style="{
                fontSize: 12 * scale + 'px',
                lineHeight: 16 * scale + 'px',
              }"
            >
              {{ $t('balance1') }}
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div
              class="color-[--d-F5F5F5-l-333] font-bold mb-2px flex items-center gap-4px"
              :style="{
                fontSize: 16 * scale + 'px',
                lineHeight: 20 * scale + 'px',
              }"
            >
              <ChainToken :chain="pnlSetting.chain" :width="16 * scale" />
              6.345
            </div>
            <span
              class="color-[--d-F5F5F5-l-333] mb-2px"
              :style="{
                fontSize: 10 * scale + 'px',
                lineHeight: 12 * scale + 'px',
              }"
              >+$0</span
            >
            <div
              class="color-[--d-999-l-666]"
              :style="{
                fontSize: 12 * scale + 'px',
                lineHeight: 16 * scale + 'px',
              }"
            >
              {{ $t('balance1') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Draggable>
  <PnlSetting v-model:visible="pnlSettingVisible" v-model:pnlSetting="pnlSetting" />
  <PnlHistory v-model:visible="pnlHistoryVisible" />
</template>
<style scoped lang="scss">
.draggable {
  :deep {
    .handle-br {
      opacity: 0;
    }
    .handle-tl,
    .handle-tr,
    .handle-br,
    .handle-bl {
      width: 12px;
      height: 12px;
    }
  }
}
</style>
