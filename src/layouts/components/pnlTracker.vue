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
  return (
    globalStore.footerTokensPrice.find((el) => el.token === getChainInfo(pnlSetting.value.chain).wmain_wrapper)
      ?.current_price_usd || 0
  )
})
const pnlData = useStorage('pnlData', {
  solana: {
    initBalance: '0',
    balance: '0',
    historyList: [],
  },
  bsc: {
    initBalance: '0',
    balance: '0',
    historyList: [],
  },
})
watch(()=>pnlSetting.value.chain,(val)=>{
  pnlData.value[val as keyof typeof pnlData.value].historyList = []
  setTokenBalance(val, true)
})
const currentChainData = computed(() => {
  return pnlData.value[pnlSetting.value.chain as keyof typeof pnlData.value]
})
const currentBalanceUsd = computed(() => {
  return Number(currentChainData.value.balance) * currentPrice.value
})
const currentPnl = computed(() => {
  return Number(currentChainData.value.balance) - Number(currentChainData.value.initBalance)
})
const currentRatio = computed(() => {
  return (currentPnl.value / Number(currentChainData.value.initBalance)) * 100
})

const supportChains = ['solana', 'bsc']
const wsStore = useWSStore()
// {
//     "client_address": "DBXf1WHHFF9DKpN4EwsofqZorcmgZEVdZdDuHwm7oY2H",
//     "event": "asset",
//     "swap": {
//         "type": "0",
//         "chain": "solana",
//         "token": "So11111111111111111111111111111111111111112",
//         "token_name": "SOL",
//         "logo_url": "token_icon/solana/So11111111111111111111111111111111111111112.png",
//         "time": 1753511090,
//         "rule_id": 2,
//         "amount": "0.0109386",
//         "amm": "raydiumcpmm",
//         "eth_price": "-0.0109",
//         "price": "186.05904"
//     }
// }
watch(
  () => wsStore.wsResult[WSEventType.ASSET],
  async (val: IAssetResponse) => {
    // Solana 是两个 swap 推送
    const isSolSwap = val.swap && val.swap.token === SOLANA_NATIVE_TOKEN
    // 处理转账或者 bsc 链
    const isBscSwapOrTransfer = val.transfer && val.transfer.token === NATIVE_TOKEN
    if(isSolSwap || isBscSwapOrTransfer){
      const { type, time, chain } = (val.swap || val.transfer)!
      const isBuy = type === '0'
      const prevBalance = currentChainData.value.balance
      const balance = await setTokenBalance(chain, false)
      pnlData.value[chain as keyof typeof pnlData.value].historyList.unshift({
        isBuy,
        amount: Number(balance) - Number(prevBalance),
        time,
        balance,
      })
    }
  //   if (val.swap && val.swap.token === 'So11111111111111111111111111111111111111112') {
      // const { type, time, chain } = val.swap
      // const isBuy = type === '0'
      // const prevBalance = currentChainData.value.balance
      // const balance = await setTokenBalance(val.swap.chain, false)
      // pnlData.value[chain as keyof typeof pnlData.value].historyList.unshift({
      //   isBuy,
      //   amount: Number(balance) - Number(prevBalance),
      //   time,
      //   balance,
      // })
  //   }
  //   // 处理转账或者 bsc 链
  //  else if (val.transfer && val.transfer.token === getNativeToken(pnlSetting.value.chain)) {
  //     const { type, amount, time, chain } = val.transfer
  //     transfer({ type, amount, time, chain })
  //   }
  }
)
// function transfer(params: { type: string; amount: string; time: number; chain: string }) {
//   const { type, amount, time, chain } = params
//   const isBuy = type === '0'
//   if (supportChains.includes(chain)) {
//     const currentData = pnlData.value[chain as keyof typeof pnlData.value]
//     if (isBuy) {
//       currentData.balance = String(Number(currentData.balance) + Number(amount))
//     } else {
//       currentData.balance = String(Number(currentData.balance) - Number(amount))
//     }
//     pnlData.value[chain as keyof typeof pnlData.value].historyList.unshift({
//       isBuy,
//       amount,
//       time,
//       balance: currentData.balance,
//     })
//   }
// }

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
  setTokenBalance('solana', currentChainData.value.initBalance === '0')
})

async function setTokenBalance(chain: string, init = false) {
  const walletAddress = botStore.getWalletAddress(chain)
  if (!walletAddress) return
  const res = await bot_getTokenBalance({
    chain,
    tokens: [getNativeToken(chain)],
    walletAddress,
  })
  const token = res?.[0] || {}
  pnlData.value[chain as keyof typeof pnlData.value].balance = token.balance
  if (init) {
    pnlData.value[chain as keyof typeof pnlData.value].initBalance = token.balance
  }
  return token.balance
}

function getColorClass(val: string | number) {
  if (Number(val) > 0) {
    return 'color-#12B886'
  } else if (Number(val) < 0) {
    return 'color-#FF646D'
  } else {
    return 'color-[--d-F5F5F5-l-333]'
  }
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
              {{
                pnlSetting.solUsdSwitch
                  ? '$' + formatNumber(currentBalanceUsd, 1)
                  : formatNumber(currentChainData.balance, 3)
              }}
            </div>
            <span
              v-if="pnlSetting.showU"
              class="color-[--d-F5F5F5-l-333] mb-2px"
              :style="{
                fontSize: 10 * scale + 'px',
                lineHeight: 12 * scale + 'px',
              }"
            >
              ${{ formatNumber(currentBalanceUsd, 1) }}
            </span>
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
              <span :class="getColorClass(currentPnl)">
                {{ addSign(currentPnl)
                }}{{
                  pnlSetting.solUsdSwitch
                    ? '$' + formatNumber(Math.abs(currentPnl * currentPrice), 1)
                    : formatNumber(Math.abs(currentPnl), 3)
                }}
              </span>
            </div>
            <span
              v-if="pnlSetting.showU"
              class="mb-2px"
              :class="getColorClass(currentPnl)"
              :style="{
                fontSize: 10 * scale + 'px',
                lineHeight: 12 * scale + 'px',
              }"
            >
              {{ addSign(currentPnl) }}${{ formatNumber(Math.abs(currentPnl * currentPrice), 1) }}
            </span>
            <div
              :class="getColorClass(currentPnl)"
              :style="{
                fontSize: 12 * scale + 'px',
                lineHeight: 16 * scale + 'px',
              }"
            >
              {{ addSign(currentPnl) }}{{ formatNumber(Math.abs(currentRatio), 1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </Draggable>
  <PnlSetting v-model:visible="pnlSettingVisible" v-model:pnlSetting="pnlSetting" />
  <PnlHistory
    v-model:visible="pnlHistoryVisible"
    :list="currentChainData.historyList"
    :getColorClass="getColorClass"
  />
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
