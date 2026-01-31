<template>
  <div v-if="clipboardTokenInfo?.token" class="flex items-center color-[--main-text] bg-[--main-input-button-bg] h-32px px-8px clipboard-token-container rd-4px ml-10px">
    <NuxtLink :to="`/token/${clipboardTokenInfo.token}-${clipboardTokenInfo.chain}`" class="flex items-center mr-8px">
      <TokenImg :row="clipboardTokenInfo" tokenClass="w-16px h-16px" chainClass="w-8px h-8px bottom--2px! right--2px!" class="w-16px h-16px" />
      <span class="text-12px ml-4px">{{ clipboardTokenInfo.symbol || '' }}</span>
    </NuxtLink>

    <img
      v-if="clipboardTokenInfo?.risk_level == -1 || (clipboardTokenInfo?.risk_score || 0) >= 60"
      class="w-14px"
      src="@/assets/images/risk-gaoliang.svg"
      alt=""
    >
    <img
      v-else-if="(clipboardTokenInfo?.risk_score || 0) > 55 && (clipboardTokenInfo?.risk_score || 0) < 60"
      class="w-14px"
      src="@/assets/images/yichang1-gaoliang.svg"
      alt=""
    >
    <img
      v-else-if="(clipboardTokenInfo?.risk_score || 0) > 0 && (clipboardTokenInfo?.risk_score || 0) <= 55"
      class="w-14px"
      src="@/assets/images/安全.svg"
      alt=""
    >
    <img
      v-else-if="clipboardTokenInfo?.risk_score == 0"
      class="w-14px"
      src="@/assets/images/zhuyi1.svg"
      alt=""
    >
    <TimerCount
      v-if="clipboardTokenInfo.opening_at"
      :key="clipboardTokenInfo.opening_at"
      :timestamp="clipboardTokenInfo.opening_at"
      :end-time="60"
    >
      <template #default="{ seconds }">
        <span class="text-12px ml-8px" :class="{'color-[--secondary-text]': seconds >= 60, 'color-#FFA622': seconds < 60}">
          <template v-if="seconds < 60">
            {{ seconds }}s
          </template>
          <template v-else>
            {{ formatTimeFromNow(clipboardTokenInfo.opening_at) }}
          </template>
        </span>
      </template>
    </TimerCount>
    <!-- <span v-if="clipboardTokenInfo.opening_at" class="text-12px ml-8px color-[--d-666-l-999]">{{ formatTimeFromNow(clipboardTokenInfo.opening_at) }}</span> -->
    <SlippageSetMarket class="ml-6px" :chain="(clipboardTokenInfo.chain as BotChain)" showClipboardSet />
    <span class="w-1px h-20px bg-[--d-333-l-DDD] mx-8px" />
    <QuickSwap
      :quickBuyValue="botSettingStore.clipboardQuickInput[clipboardTokenInfo.chain as BotChain] || ''"
      :row="{...clipboardTokenInfo, chain: clipboardTokenInfo.chain as BotChain}"
      classNames="min-w-48px h-20px!"
      :buttonType="1"
      mainNameVisible
    />
  </div>
</template>

<script setup lang='ts'>
import SlippageSetMarket from '~/pages/token/components/right/botSwap/slippageSetMarket.vue'
import { _tokenSearchV3 } from '@/api/hot'
import type { BotChain } from '~/utils/types'

const clipboardTokenInfo = ref<{
  chain: string
  logo_url: string
  symbol: string
  risk_score?: number
  risk_level?: number
  opening_at?: number
  token: string
} | null>(null)

// const quickBuyValue = ref('')
const botSettingStore = useBotSettingStore()
const botStore = useBotStore()

let Timer: null | ReturnType<typeof setTimeout> = null
async function checkClipboardText() {
  try {
    const text = await navigator?.clipboard?.readText()
    console.log('clipboard.readText', text)
    const isValid  = text && ['eth', 'solana'].some(i => isValidAddress(text, i))
    if (!isValid) {
      clipboardTokenInfo.value = null
      return
    }
    if (clipboardTokenInfo.value?.token === text) {
      return
    }
    if (Timer) {
      clearTimeout(Timer)
      Timer = null
    }
    _tokenSearchV3({
      query: text
    }).then(res => {
      const tokens = (res?.token_list || [])?.filter?.(i => botStore.isSupportChains.includes(i.chain as BotChain)) || []
      if (tokens.length > 0) {
        clipboardTokenInfo.value = tokens[0]
        console.log('clipboardTokenInfo', clipboardTokenInfo.value)
      } else {
        clipboardTokenInfo.value = null
      }
    })
  } catch (error) {
    console.log('error', error)
  }
}

useVisibilityChange(() => {
  setTimeout(() => {
    checkClipboardText()
  }, 100)
}, 1000)

onBeforeUnmount(() => {
  document.removeEventListener('copy', checkClipboardText)
})

onMounted(() => {
  checkClipboardText()
  document.addEventListener('copy', checkClipboardText)
})

</script>

<style scoped lang='scss'>
.clipboard-token-container :deep() {
  .icon-bot-setting {
    color: var(--third-text);
  }
}
</style>
