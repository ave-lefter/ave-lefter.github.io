<template>
  <div class="items-center inline-flex">
    <img src="@/assets/images/fast.svg" class="w-14px h-14px" alt="" srcset="">
    <span class="ml-5px mr-5px color-[--d-999-l-666] text-12px">{{ $t('quick') }}</span>
    <el-input
        v-model.trim="quickBuyValue1"
        style="
          background: var(--d-222-l-F2F2F2);
          --el-input-bg-color: var(--d-222-l-F2F2F2);
          --el-input-border-color: var(--d-222-l-F2F2F2);
          border-radius: 4px;
          width: 88px;
          height: 28px;
        "
        placeholder="0"
        clearable
        type="text"
        @input="(value) => {
            quickBuyValue1 = value.replace(/\-|[^\d.]/g, '')
      }"
        @blur="handleBlurBuyValue(quickBuyValue1)">
      <template #prefix>
        <img
            class="rounded-full w-14px h-14px mr-4px!"
            :src="`${configStore.token_logo_url}chain/${chain}.png`"
            alt=""
            onerror="this.src='/icon-default.png'"
            srcset=""
        >
      </template>
    </el-input>
    <div
        v-if="chain && botStore.isSupportChains.includes(chain)"
        class="ml-20px flex justify-end items-center text-12px">
      <span class="color-[--d-999-l-666] mr-5px">{{ $t('default') }}</span>
      <div
          class="flex items-center justify-between p-1px rounded-4px text-12px h-28px bg-[--d-222-l-F2F2F2] px-2px py-2px">

          <button
              v-for="item in ['s1', 's2', 's3']"
              :id="item"
              :key="item"
              :ref="setBtnRef"
              class="color-[--d-666-l-999] cursor-pointer border-none font-400 rounded-4px min-w-36px py-5px px-10px text-center"
              :class="`${item === botSettingStore.botSettings?.[chain]?.selected?'color-[--d-F5F5F5-l-333] bg-[--d-111-l-FFF]':'bg-transparent'}`"
              type="button"
              @click.stop="botSettingStore.botSettings[chain].selected = item"
              @mouseenter="showPopover(item)"
              @mouseleave="visible = false"

              >
                {{ item.toUpperCase() }}
          </button>
      </div>
    </div>
    <SlippageSet
        class="ml-12px"
        :chain="chain"
        :setting="botSettingStore?.botSettings[chain]"
    />
    <el-popover
      v-model:visible="visible"
      :virtual-ref="currentBtnRef"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom"
    >
      <ul>
        <li class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="text-12px color-[--d-666-l-999] ml-0 mr-4px cursor-pointer" />
          <span v-if="botSettingStore.botSettings?.[chain || '']?.[selected]?.slippage !== 'auto'">{{ botSettingStore.botSettings?.[chain || '']?.[selected]?.slippage }}%</span>
          <span v-else>{{ $t('auto') }}</span>
        </li>
        <li v-if="isEvmChain(chain || '')" class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="text-12px color-[--d-666-l-999] ml-0 mr-4px cursor-pointer" />
          <span>${{ getEstimatedGas() }}</span>
        </li>
        <li v-if="chain === 'solana'" class="text-14px mt-4px mb-4px flex-start">
            <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-12px color-[--d-666-l-999] mr-3px cursor-pointer ml-0" />
            <span>{{ botPriorityFee }} SOL</span>
        </li>
        <li class="text-14px mt-4px mb-4px flex-start">
          <span class="mr-4px color-[--d-666-l-999] text-12px">{{ $t('autoSellHalf') }}</span>
          {{  botSettingStore.botSettings?.[chain]?.[selected]?.autoSell ? '开' : '关'}}
        </li>

        <li class="text-14px mt-4px mb-4px flex-start">
          <span class="mr-4px color-[--d-666-l-999] text-12px">{{ $t('mev') }}</span>
          {{  botSettingStore.botSettings?.[chain]?.[selected]?.mev ? '开' : '关'}}
        </li>

      </ul>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import BigNumber from 'bignumber.js'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
import { formatBotGasTips } from '@/utils/bot'
import { isEvmChain, getRpcProvider } from '@/utils'


const botStore = useBotStore()
const configStore = useConfigStore()
const botSwapStore = useBotSwapStore()
const botSettingStore = useBotSettingStore()
const tokenStore = useTokenStore()
const emit = defineEmits(['update:quickBuyValue'])
const props = withDefaults(defineProps<{
  chain: string
  quickBuyValue?: string
}>(), {
  quickBuyValue: '0.01'
})
const gasPrice= shallowRef(0)

const visible = ref(false)
const selected = ref('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)

const botPriorityFee = computed(() => {
  const chain = props.chain
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain]?.[selected.value]
  const mev = botSettings?.mev

  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})


const quickBuyValue1 = computed({
  get() {
    return props.quickBuyValue
  },
  set(value) {
    emit('update:quickBuyValue', value)
  }
})
function handleBlurBuyValue(value: string) {
  const decimals = 4
  const v = value
  const v1 = new BigNumber(v || 0)
      .toFixed()
      .match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))[0]
  if (String(v) !== String(v1)) {
    if (v === '') {
      quickBuyValue1.value = ''
    } else if (Number(v1) === 0) {
      quickBuyValue1.value = '0'
    } else {
      quickBuyValue1.value = v1
    }
  }
}
function setBtnRef(el: HTMLElement | null) {
  if (el && el?.id) {
    btnRefs.value[el?.id] = el
  }
}
function showPopover (item: string) {
  selected.value = item
  currentBtnRef.value = btnRefs.value[item] || null
  visible.value = true
  getGasPrice()
}
function getGasPrice() {
  const chain = props.chain
  if (!isEvmChain(chain)) {
    return
  }
  getRpcProvider(chain)?.getFeeData().then(res => {
    if (res) {
      gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

function getEstimatedGas() {
  const chain = props.chain
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.[selected.value]
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}
</script>
