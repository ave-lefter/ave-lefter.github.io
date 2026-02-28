<template>
  <div class="bg-[--main-input-button-bg] flex items-center ml-auto p-[5px_2px] rounded-4px">
    <el-popover
      v-model:visible="selectWalletVisible"
      :persistent="false"
      placement="bottom"
      width="305"
      trigger="click"
      popper-class="[&&]:[--el-popover-padding:0]"
      :popper-options="{ modifiers: [{ name: 'preventOverflow', options: { boundary: boundary, padding: 0 } }] }"
    >
      <template #reference>
        <div class="flex item-center clickable">
          <Icon name="ri:wallet-fill" class="color-[--secondary-text] text-14px" />
          <span class="text-12px color-[--main-text] mx-3px">{{ botSwapStore.botSwapSelectedWallets?.length }}</span>
          <Icon name="prime:sort-down-fill" class="color-[--main-text] text-14px transition-all-300" :class="{ 'rotate-180': selectWalletVisible }" />
        </div>
      </template>
      <template #default>
        <div class="color-[--third-text] text-12px max-h-500px overflow-y-auto">
          <div class="flex items-center justify-between px-12px b-b-solid b-b-1px b-b-[--border]">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              style="--el-checkbox-font-size: 12px;flex: 1.5"
              @change="handleCheckAllChange"
            >
              {{ $t('all1') }}
            </el-checkbox>
            <span class="flex-1 text-right">{{ $t('balance1') }}({{ tokenStore.swap.payToken?.symbol }})</span>
            <span class="flex-1 text-right">{{ $t('balance1') }}({{ tokenStore.swap.token?.symbol }})</span>
          </div>
          <div :key="botStore.evmAddress" class="px-12px">
            <el-checkbox-group
              v-model="botSwapStore.botSwapSelectedWallets"
              @change="handleCheckedChange"
            >
              <div v-for="(item, index) in walletList" :key="item.evmAddress" class="flex items-center h-50px" :class="{ 'b-b-solid b-b-1px b-b-[--border]': index !== botStore?.walletList.length - 1 }">
                <div class="flex items-center" style="flex: 1.5">
                  <el-checkbox :key="item.evmAddress" class="[&&]:[--el-checkbox-disabled-checked-icon-color:#FFF] [&&]:[--el-checkbox-disabled-checked-input-fill:#3F80F7] [&&]:[--el-checkbox-disabled-checked-input-border-color:#3F80F7] batch-checkbox" :value="item.evmAddress" :disabled="item.evmAddress === botStore.evmAddress" :checked="item.evmAddress === botStore.evmAddress" />
                  <div class="text-12px lh-14px" @click.stop>
                    <div class="color-[--main-text] overflow-hidden text-ellipsis whitespace-nowrap max-w-100px" :title="item.name">{{ item.name }}</div>
                    <div class="color-[--third-text] flex items-center" >
                      <span>{{ getAddressFromChain(chain, item.addresses)?.address?.replace(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}</span>
                      <Icon v-copy="getAddressFromChain(chain, item.addresses)?.address" name="bxs:copy" class="clickable ml-5px text-12px" />
                    </div>
                  </div>
                </div>
                <div class="ml-auto lh-14px flex items-center color-[--main-text] text-12px flex-1 justify-end">
                  <img :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
                  <span>{{ formatNumber(getAddressFromChainBalance(chain, item.addresses, tokenStore.swap.payToken?.address) || 0) }}</span>
                </div>
                <div class="ml-auto lh-14px flex items-center color-[--main-text] text-12px flex-1 justify-end">
                  <img :src="`${configStore.token_logo_url}${tokenStore.swap.token?.logo_url}`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
                  <span>{{ formatNumber(getAddressFromChainBalance(chain, item.addresses, tokenStore.swap.token?.address) || 0) }}</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </el-popover>
    <div class="border-l-solid border-l-1px border-l-[--icon-color] h-8px mx-8px" />
    <img :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
    <span class="text-12px color-[--main-text]">{{ formatNumber(totalSelectWalletBalance || 0) }}</span>
  </div>
</template>

<script setup lang='ts'>
import type { CheckboxValueType } from 'element-plus'
import BigNumber from 'bignumber.js'

const props = defineProps({
  chain: {
    type: String as PropType<BotChain>,
    default: ''
  },
  boundary: {
    type: HTMLElement as PropType<HTMLElement | null>,
    default: null
  }
})


const configStore = useConfigStore()
const tokenStore = useTokenStore()
const botStore = useBotStore()
const botSwapStore = useBotSwapStore()
const selectWalletVisible = ref(false)
// const checkAll = ref(false)
const isIndeterminate = ref(false)
// const boundary = useTemplateRef('bot-swap-container')
const allWallets = computed(() => {
  return botStore.walletList?.map?.(i => i.evmAddress) || []
})

const walletList = computed(() => {
  const _walletList = botStore.walletList?.slice?.(0)
  return _walletList?.sort?.((a) => a.evmAddress === botStore.evmAddress ? -1 : 1) || []
})

const totalSelectWalletBalance = computed(() => {
  const addresses = [...botSwapStore.botSwapSelectedWallets, (botStore.evmAddress || '')]
  // 去重 并去除 undefined 空字符
  const uniqueAddresses = Array.from(new Set(addresses?.filter(Boolean)))
  let balance = '0'
  const token = tokenStore.swap.payToken
  botStore.walletList?.forEach(i => {
    if (uniqueAddresses.includes(i.evmAddress)) {
      balance = new BigNumber(balance).plus(getAddressFromChainBalance(props.chain, i.addresses, token?.address) || 0).toFixed()
    }
  })
  return balance
})

const handleCheckAllChange = (val: CheckboxValueType) => {
  botSwapStore.botSwapSelectedWallets = val ? allWallets.value : [botStore.evmAddress || '']
  isIndeterminate.value = false
}

const handleCheckedChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  // checkAll.value = checkedCount === botStore.walletList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < botStore.walletList.length
}

const checkAll = computed(() => {
  const checkedCount = botSwapStore.botSwapSelectedWallets.length
  return checkedCount === botStore.walletList.length
})

function getAddressFromChain(chain: BotChain, addresses: typeof botStore.walletList[number]['addresses']) {
  return addresses?.find?.(i => i?.chain === chain)
}

function getAddressFromChainBalance(chain: BotChain, addresses: typeof botStore.walletList[number]['addresses'], token?: string) {
  if (BotNativeTokens?.includes(token || '') || !token) {
    return getAddressFromChain(chain, addresses)?.balance || 0
  }
  return getAddressFromChain(chain, addresses)?.tokenBalances?.[token]?.balance || 0
}
</script>

<style lang="scss" scoped>
.batch-checkbox :deep(.is-disabled) {
  opacity: 0.4;
}
</style>
