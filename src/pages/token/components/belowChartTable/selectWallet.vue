<template>
  <el-popover
    v-model:visible="selectWalletVisible"
    placement="bottom"
    width="305"
    trigger="click"
    popper-class="[&&]:[--el-popover-padding:0]"
    :popper-options="{ modifiers: [{ name: 'preventOverflow', options: { boundary: boundary, padding: 0 } }] }"
  >
    <template #reference>
      <div class="ml-20px flex items-center clickable">
        <Icon name="ri:wallet-fill"  class="color-[--secondary-text] text-14px" />
        <span class="text-12px color-[--main-text] mx-3px whitespace-nowrap">{{ botStore.walletList?.find(i => i.evmAddress === _evmAddress)?.name || botStore.userInfo?.name || '' }}</span>
        <span class="text-10px color-[--third-text]">{{ getAddressFromChain(chain, _wallet?.addresses || [])?.address?.replace(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}</span>
        <Icon v-copy="getAddressFromChain(chain, _wallet?.addresses || [])?.address" name="bxs:copy" class="clickable ml-5px text-12px color-[--third-text]" />
        <div class="border-l-solid border-l-1px border-l-[--icon-color] h-8px mx-8px" />
        <img :src="`${configStore.token_logo_url}token_icon/${chain}/${getChainInfo(chain)?.wmain_wrapper || ''}.png`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
        <span class="text-12px color-[--main-text]">{{ formatNumber(getAddressFromChainBalance(chain, _wallet?.addresses || [], tokenStore.swap.native?.address) || 0) }}</span>
        <Icon name="prime:sort-down-fill" class="color-[--main-text] text-14px transition-all-300" :class="{ 'rotate-180': selectWalletVisible }" />
      </div>
    </template>
    <template #default>
      <div class="color-[--third-text] text-12px max-h-500px overflow-y-auto">
        <div class="px-12px">
          <el-radio-group v-model="_evmAddress" class="w-100%">
            <div v-for="(item, index) in botStore?.walletList?.toSorted((a) => a.evmAddress === botStore.evmAddress ? -1 : 1)" :key="item.evmAddress" class="flex items-center h-50px w-100%" :class="{ 'b-b-solid b-b-1px b-b-[--border]': index !== botStore?.walletList.length - 1 }" @click.stop="_evmAddress=item.evmAddress;selectWalletVisible=false">
              <el-radio class="[&&]:[--el-checkbox-disabled-checked-icon-color:#FFF] [&&]:[--el-checkbox-disabled-checked-input-fill:#3F80F7] [&&]:[--el-checkbox-disabled-checked-input-border-color:#3F80F7] batch-checkbox" :value="item.evmAddress" />
              <div class="flex justify-between flex-1 clickable">
                <div class="text-12px lh-14px inline-block" >
                  <div class="color-[--main-text] flex">{{ item.name }}</div>
                  <div class="color-[--third-text] flex items-center" >
                    <span>{{ getAddressFromChain(chain, item.addresses)?.address?.replace(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}</span>
                    <Icon v-copy="getAddressFromChain(chain, item.addresses)?.address" name="bxs:copy" class="clickable ml-5px text-12px" @click.stop />
                  </div>
                </div>
                <div class="ml-auto lh-14px inline-flex items-center color-[--main-text] text-12px justify-end">
                  <img :src="`${configStore.token_logo_url}token_icon/${chain}/${getChainInfo(chain)?.wmain_wrapper || ''}.png`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
                  <span>{{ formatNumber(getAddressFromChainBalance(chain, item.addresses, tokenStore.swap.payToken?.address) || 0) }}</span>
                </div>
              </div>
            </div>
          </el-radio-group>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang='ts'>

defineProps({
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
const selectWalletVisible = ref(false)
// const checkAll = ref(false)
// const boundary = useTemplateRef('bot-swap-container')
const _evmAddress = ref(botStore.evmAddress || '')
const evmAddress = computed(() => {
  return _evmAddress.value || botStore.evmAddress
})
const _wallet = computed(() => {
  return botStore.walletList?.find?.(i => i.evmAddress === evmAddress.value)
})


watch(() => botStore.evmAddress, () => {
  _evmAddress.value = botStore.evmAddress
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

defineExpose({
  evmAddress
})

</script>

<style lang="scss" scoped>
.batch-checkbox {
  // width: 100%;
  // :deep() .el-radio__label {
  //   display: flex;
  //   flex: 1;
  // }
  margin-right: 5px;
}
</style>
