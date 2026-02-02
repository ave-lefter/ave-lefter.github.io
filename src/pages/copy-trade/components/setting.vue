<template>
  <div>
    <el-divider class="!m-0 !mb-24px !mt-24px !border-t-[--dialog-divider]" />

    <div class="flex-between cursor-pointer" @click="toggle">
      <ul class="flex-start">
        <li class="text-12px flex-start">
          <Icon
            v-tooltip="$t('slippage')"
            name="custom:slippage"
            class="text-14px color-[--third-text] mr-6px"
          />
          <span>{{ currentSetting.slippage || 9}}%</span>
        </li>

        <li class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('mev')"
            name="custom:mev"
            class="text-16px color-[--third-text] mr-6px"
          />
          {{ currentSetting.isPrivate ? $t('on') : $t('off') }}
        </li>

        <li v-if="isEvmChain(props.chain)" class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('estimatedGas')"
            name="custom:gas"
            class="text-14px color-[--third-text] mr-6px"
          />
          ${{ estimatedGas }}
        </li>

        <li v-if="props.chain === 'solana'" class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('priorityFee')"
            name="custom:gas"
            class="text-14px color-[--third-text] mr-6px"
          />
          <span>{{ displayPriorityFee }} SOL</span>
        </li>
      </ul>

      <Icon
        :name="isExpanded ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
        class="text-16px"
      />
    </div>

    <div ref="expandRef" v-show="isExpanded">
      <!-- slippage -->
      <div class="flex-between mt-16px">
        <span class="color-[--secondary-text]">{{ $t('slippage') }}</span>

        <el-input
          v-model.trim="currentSetting.slippage"
          style="width: 221px"
        >
          <template #suffix>%</template>
        </el-input>
      </div>

      <!-- protection -->
      <div class="flex-between mt-16px">
        <span class="color-[--secondary-text]">{{ $t('protection') }}</span>
        <el-switch v-model="currentSetting.isPrivate" />
      </div>

      <!-- priority fee -->
      <div class="flex-between mt-16px">
        <span class="color-[--secondary-text]">
          {{ props.chain === 'solana' ? $t('priorityFee') : $t('extraGas') }}
        </span>
        <el-input
          :model-value="currentSetting.priorityFee"
          @update:model-value="onPriorityFeeInput"
          clearable
          style="width: 221px"
        >
          <template #suffix>
            {{ props.chain === 'solana' ? 'SOL' : 'GWEI' }}
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { isEvmChain, getRpcProvider } from '@/utils'
import { formatBotGasTips } from '@/utils/bot'
import type { BotChain } from '~/utils/types'

/* props —— 完全保持不变 */
const props = withDefaults(
  defineProps<{ chain: BotChain; visible?: boolean }>(),
  { chain: 'bsc', visible: false }
)

const { t } = useI18n()
const botStore = useBotStore()
const botSwapStore = useBotSwapStore()
const tokenStore = useTokenStore()
const { settingCopyTrade, defaultCopyTradeSetting, form} =
  storeToRefs(useCopyTradeStore())

/* local state */
const isExpanded = ref(false)
const expandRef = ref<HTMLElement | null>(null)
const gasPrice = shallowRef(0)

/* current setting（只在这里初始化） */
const currentSetting = computed(() => {
  settingCopyTrade.value ||= {}
  settingCopyTrade.value[props.chain] ||= {
    ...defaultCopyTradeSetting.value,
    priorityFee: ''
  }
  return settingCopyTrade.value[props.chain]
})

/* 只读：priorityFee 展示兜底 */
const displayPriorityFee = computed(() => {
  const raw = currentSetting.value.priorityFee
  if (raw !== '' && raw !== '0') return raw

  const mev = currentSetting.value.isPrivate
  const { gasTip1List, gasTip2List } =
    formatBotGasTips(botSwapStore.gasTip, props.chain)

  return (mev ? gasTip1List : gasTip2List)?.[1]?.toString() || '0'
})

/* 纯计算：estimatedGas */
const estimatedGas = computed(() => {
  if (!isEvmChain(props.chain)) return '0'
  if (!botStore.isSupportChains.includes(props.chain)) return '0'

  const mev = currentSetting.value.isPrivate
  const nativePrice =
    botSwapStore.mainTokensPrice?.find(
      i => i.chain === props.chain
    )?.current_price_usd || tokenStore.swap.native.price || 0

  const gasLimit =
    botSwapStore.gasTip?.find(i => i.chain === props.chain && i.mev === !!mev)
      ?.gasLimit || 200000

  return new BigNumber(gasPrice.value)
    .plus(new BigNumber(displayPriorityFee.value).times(1e9))
    .times(gasLimit)
    .times(nativePrice)
    .div(1e18)
    .toFixed(2)
})

/* effects（只在明确时机） */
watch(
  () => props.visible,
  v => {
    if (v && isEvmChain(props.chain)) {
      getRpcProvider(props.chain)
        ?.getFeeData()
        .then(r => (gasPrice.value = Number(r?.gasPrice || 0)))
    }
  },
  { immediate: true }
)

watch(
  () => currentSetting.value.slippage,
  (val) => {
    form.value.slippage = val
  },
  { deep: true, immediate: true }
)
watch(
  () => currentSetting.value.isPrivate,
  (val) => {
    form.value.isPrivate = val
  },
  { deep: true, immediate: true }
)

watch(
  () => currentSetting.value.priorityFee,
  (val) => {
    form.value.priorityFee = val
  },
  { deep: true,immediate: true }
)

/* handlers */
const onPriorityFeeInput = (val: string) => {
  currentSetting.value.priorityFee = val
}

const toggle = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    await nextTick()
    expandRef.value?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  background: var(--border);
}
</style>
