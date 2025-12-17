<template>
  <div >
    <el-divider class="!m-0 !mb-24px !mt-24px !border-t-[--dialog-divider]" />
    <div class="flex-between cursor-pointer" @click="isExpanded = !isExpanded">
      <ul class="flex-start">
        <li class="text-12px flex-start">
          <Icon
            v-tooltip="$t('slippage')"
            name="custom:slippage"
            class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"
          />
          <span>{{ settingCopyTrade?.[props.chain]?.slippage }}%</span>
        </li>
        <li class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('mev')"
            name="custom:mev"
            class="text-16px color-[--third-text] ml-0 mr-6px cursor-pointer"
          />
          {{ settingCopyTrade?.[props.chain]?.isPrivate ? $t('on') : $t('off') }}
        </li>
        <li v-if="isEvmChain(chain || '')" class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('estimatedGas')"
            name="custom:gas"
            class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"
          />
          ${{ getEstimatedGas() }}
        </li>
        <li v-if="chain === 'solana'" class="text-12px flex-start ml-24px">
          <Icon
            v-tooltip="$t('priorityFee')"
            name="custom:gas"
            class="text-14px color-[--third-text] mr-6px cursor-pointer ml-0"
          />
          <span class="whitespace-nowrap">{{ botPriorityFee() }} SOL</span>
        </li>
      </ul>
      <Icon
        :name="isExpanded ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
        class="text-16px"
      />
    </div>
    <transition name="fade" v-if="isExpanded">
      <div>
        <div class="flex-between mt-16px">
          <span class="mr-auto color-[--secondary-text]">{{ $t('slippage') }}</span>
          <Icon
            class="text-15px color-[--icon-color] ml-5px clickable mr-auto"
            name="material-symbols:help-rounded"
            @click.stop="openSlippageTips"
          />
          <div class="flex-1"></div>
          <div class="slippage-input">
            <el-input
              v-model.trim="currentSetting.slippage"
              clearable
              :placeholder="$t('custom')"
              @input="(val) => onValidateInput(val, 'slippage')"
            >
              <template #suffix>
                <span>%</span>
              </template>
            </el-input>
          </div>
        </div>
        <div class="flex-between mt-16px">
          <span class="mr-auto color-[--secondary-text]">{{ $t('protection') }}</span>
          <el-switch
            v-model="currentSetting.isPrivate"
            class="ml-auto"
            style="--el-switch-on-color: #3c6cf6; zoom: 0.9; height: 14px"
          />
        </div>
        <div class="flex-between mt-16px">
          <span class="color-[--secondary-text]">{{ chain === 'solana' ? $t('priorityFee') : $t('extraGas') }}</span>
          <div class="flex-1"></div>
          <div>
            <el-input
              v-model="currentSetting.priorityFee"
              inputmode="decimal"
              clearable
              :placeholder="chain === 'solana' ? $t('customFee1') : $t('customEvmFee1')"
              @input="(val) => onValidateInput(val, 'priorityFee')"
            >
              <template #suffix>
                <span>{{chain === 'solana' ? 'SOL' : 'GWEI'}}</span>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { formatBotGasTips } from '@/utils/bot'
import { isEvmChain, getRpcProvider } from '@/utils'
import type { BotChain, BotSettingKey } from '~/utils/types'

import { ElMessageBox } from 'element-plus'
const { t } = useI18n()
const botStore = useBotStore()
const botSwapStore = useBotSwapStore()
const tokenStore = useTokenStore()
const emit = defineEmits(['getEstimatedGas'])
const { settingCopyTrade, defaultCopyTradeSetting, form , type} = storeToRefs(useCopyTradeStore())
const props = withDefaults(
  defineProps<{
    chain: BotChain
    visible?: boolean,
  }>(),
  {
    chain: 'bsc',
    visible: false
  }
)

const gasPrice = shallowRef(0)
const isExpanded = shallowRef(false)
const currentSetting = computed(() => {
  if (!settingCopyTrade.value) {
    settingCopyTrade.value = {}
  }

  if (!settingCopyTrade.value[props.chain]) {
    settingCopyTrade.value[props.chain] = { ...defaultCopyTradeSetting.value, priorityFee: props.chain == 'solana' ? '0.04': '1' }
  }

  return settingCopyTrade.value[props.chain]!
})

watch(
  () => currentSetting.value.slippage,
  (val) => {
    form.value.slippage = val
  },
  { immediate: true }
)

watch(
  () => currentSetting.value.isPrivate,
  (val) => {
    form.value.isPrivate = val
  },
  { immediate: true }
)

watch(
  () => currentSetting.value.priorityFee,
  (val) => {
    form.value.priorityFee = val
  },
  { immediate: true }
)
function getGasPrice() {
  const chain = props.chain
  if (!isEvmChain(chain)) {
    return
  }
  getRpcProvider(chain)
    ?.getFeeData()
    .then((res) => {
      if (res) {
        gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
      }
    })
}
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (isEvmChain(props.chain)) {
      getGasPrice()
    }
    if(props.chain=='solana'){
      botPriorityFee()
    }
  }
})
watch(() => props.chain, (newVal) => {
  currentSetting.value.priorityFee = props.chain == 'solana' ? '0.04': '1'
  if (newVal) {
    if (isEvmChain(props.chain)) {
      getGasPrice()
    }
    if (props.chain == 'solana') {
      botPriorityFee()
    }
  }
})
const botPriorityFee = () => {
  const chain = props.chain
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const mev = currentSetting.value?.isPrivate
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  if (currentSetting.value?.priorityFee == '0' || currentSetting.value?.priorityFee == '') {
    currentSetting.value.priorityFee = gasTips?.[1]?.toString()
  }
  const priorityFee = currentSetting.value?.priorityFee
  emit('getEstimatedGas', priorityFee)
  return priorityFee
}

function getEstimatedGas() {
  const chain = props.chain
  let gas = '0'
  // debugger
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    const mev = currentSetting.value?.isPrivate || false
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    if (currentSetting.value?.priorityFee == '0' || currentSetting.value?.priorityFee == '') {
      currentSetting.value.priorityFee = gasTips?.[1]?.toString()
    }
    const extraGasPrice = currentSetting.value?.priorityFee || gasTips?.[1]
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    gas = formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice || 0).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  emit('getEstimatedGas', gas)
  return gas
}

function openSlippageTips() {
  // 提示逻辑，可扩展
  ElMessageBox.alert(t('slippageTips'), {
    title: t('slippage'),
    confirmButtonText: t('iKnown'),
  }).then(() => {
    // on close
  })
}
const onValidateInput = (val: string, type: 'slippage' | 'priorityFee') => {
  // 1️⃣ 只允许数字和 .
  let value = val.replace(/[^\d.]/g, '')
  // 2️⃣ 只允许一个小数点
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  // 3️⃣ 小数点不能放在第一位（可选）
  if (value.startsWith('.')) {
    value = '0' + value
  }
  if ( Number(value) >100) {
    value = '100'
  }
  currentSetting.value[type] = Number(value)
}
</script>
<style lang="scss" scoped>
:deep().el-input__wrapper {
  background: var(--border);
  padding: 0 12px;
  -el-input-inner-height: 48px;
  --el-input-inner-height: 48px;
}
</style>
