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
          <span class="text-12px color-[--main-text1] mx-3px">{{ currentChainSelectedWallets?.length }}</span>
          <Icon name="prime:sort-down-fill" class="color-[--main-text1] text-14px transition-all-300" :class="{ 'rotate-180': selectWalletVisible }" />
        </div>
      </template>
      <template #default>
        <div class="color-[--third-text] text-12px max-h-500px overflow-y-auto">
          <div class="flex items-center px-12px py-8px b-b-solid b-b-1px b-b-[--border]">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              style="--el-checkbox-font-size: 12px;"
              @change="handleCheckAllChange"
            >
              <!-- {{ $t('all1') }} -->
            </el-checkbox>
            <div class="flex items-center gap-4px">
              <div
                v-for="chainItem in availableChains"
                :key="chainItem.id"
                class="chain-icon-btn w-20px h-20px rd-50% flex items-center justify-center cursor-pointer transition-all-200"
                :class="selectedChainValue === chainItem.id ? 'chain-icon-active' : 'chain-icon-inactive'"
                @click="handleChainSelect(chainItem.id)"
              >
                <img
                  :src="`${configStore.token_logo_url}chain/${chainItem.icon}.png`"
                  class="w-14px h-14px rounded-full"
                  lazy
                  alt=""
                >
              </div>
            </div>
          </div>
          <div :key="botStore.evmAddress" class="px-12px">
            <el-checkbox-group
              v-model="currentChainSelectedWallets"
              @change="handleCheckedChange"
            >
              <div v-for="(item, index) in walletList" :key="item.evmAddress" class="flex items-center h-50px" :class="{ 'b-b-solid b-b-1px b-b-[--border]': index !== botStore?.walletList.length - 1 }">
                <div class="flex items-center" style="flex: 1.5">
                  <el-checkbox :key="item.evmAddress" class="[&&]:[--el-checkbox-disabled-checked-icon-color:#FFF] [&&]:[--el-checkbox-disabled-checked-input-fill:#3F80F7] [&&]:[--el-checkbox-disabled-checked-input-border-color:#3F80F7] batch-checkbox" :value="item.evmAddress" :disabled="item.evmAddress === botStore.evmAddress" :checked="item.evmAddress === botStore.evmAddress" />
                  <div class="text-12px lh-14px" @click.stop>
                    <div class="color-[--main-text1] overflow-hidden text-ellipsis whitespace-nowrap max-w-100px" :title="item.name">{{ item.name }}</div>
                    <div class="color-[--third-text] flex items-center" >
                      <span>{{ getAddressFromChain(selectedChainValue, item.addresses)?.address?.replace(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}</span>
                      <Icon v-copy="getAddressFromChain(selectedChainValue, item.addresses)?.address" name="bxs:copy" class="clickable ml-5px text-12px" />
                    </div>
                  </div>
                </div>
                <div class="ml-auto lh-14px flex items-center color-[--main-text1] text-12px">
                  <img :src="`${configStore.token_logo_url}chain/${selectedChainValue}.png`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
                  <span>{{ formatNumber(getAddressFromChainBalance(selectedChainValue, item.addresses, tokenStore.swap.payToken?.address) || 0) }}</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </el-popover>
    <div class="border-l-solid border-l-1px border-l-[--icon-color] h-8px mx-8px" />
    <img :src="`${configStore.token_logo_url}chain/${selectedChainValue}.png`" class="rd-50% mr-2px" height="12" alt="" srcset="" >
    <span class="text-12px color-[--main-text1]">{{ formatNumber(totalSelectWalletBalance || 0) }}</span>
  </div>
</template>

<script setup lang='ts'>
import type { CheckboxValueType } from 'element-plus'
import BigNumber from 'bignumber.js'
import { useStorage } from '@vueuse/core'
import { SupportMonitorChain } from '@/utils/constants'

const props = defineProps({
  chains: {
    type: Array as PropType<string[]>,
    default: () => [...SupportMonitorChain]
  },
  boundary: {
    type: HTMLElement as PropType<HTMLElement | null>,
    default: null
  },
  storageKey: {
    type: String,
    default: 'quickBatchWallet'
  }
})

onMounted(() => {
  console.log('quickBatchWallet mounted', props.chains)
})

const configStore = useConfigStore()
const tokenStore = useTokenStore()
const botStore = useBotStore()
const selectWalletVisible = ref(false)
const isIndeterminate = ref(false)

// 按照 SupportMonitorChain 的顺序排序链的辅助函数
function sortChainsBySupportOrder(chains: string[]) {
  return [...chains].sort((a, b) => {
    const indexA = SupportMonitorChain.indexOf(a)
    const indexB = SupportMonitorChain.indexOf(b)
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
}

// 多链配置
const availableChains = computed(() => {
  // 先按照 SupportMonitorChain 排序
  const sortedChains = sortChainsBySupportOrder(props.chains)
  return sortedChains.map(chain => ({
    id: chain,
    icon: chain
  }))
})

// 持久化选中的链，默认使用排序后的第一个
const selectedChainValue = useStorage(`${props.storageKey}_selectedChain`, sortChainsBySupportOrder(props.chains)[0] || 'eth')

// 为每个链独立存储选中的钱包
const chainSelectedWallets = useStorage<Record<string, string[]>>(`${props.storageKey}_selectedWallets`, {})

const currentAddress = useFollowStore().currentAddress

watch(() => currentAddress, (newAddress) => {
  if (!newAddress) {
    // 清空选中钱包
    chainSelectedWallets.value = {}
  }
})

// 获取当前链的选中钱包列表
const currentChainSelectedWallets = computed({
  get: () => {
    const chain = selectedChainValue.value
    const wallets = chainSelectedWallets.value[chain]
    return wallets && wallets.length > 0 ? wallets : [botStore.evmAddress || '']
  },
  set: (value: string[]) => {
    const chain = selectedChainValue.value
    chainSelectedWallets.value = {
      ...chainSelectedWallets.value,
      [chain]: value
    }
  }
})

// 监听 chains 变化，自动切换到排序后的第一个
watch(() => props.chains, (newChains) => {
  if (newChains && newChains.length > 0) {
    const sorted = sortChainsBySupportOrder(newChains)
    selectedChainValue.value = sorted[0]
  }
}, { immediate: false })

const allWallets = computed(() => {
  return botStore.walletList?.map?.(i => i.evmAddress) || []
})

const walletList = computed(() => {
  const _walletList = botStore.walletList?.slice?.(0)
  return _walletList?.sort?.((a) => a.evmAddress === botStore.evmAddress ? -1 : 1) || []
})

const totalSelectWalletBalance = computed(() => {
  const addresses = [...currentChainSelectedWallets.value, (botStore.evmAddress || '')]
  const uniqueAddresses = Array.from(new Set(addresses?.filter(Boolean)))
  let balance = '0'
  const token = tokenStore.swap.payToken
  botStore.walletList?.forEach(i => {
    if (uniqueAddresses.includes(i.evmAddress)) {
      balance = new BigNumber(balance).plus(getAddressFromChainBalance(selectedChainValue.value, i.addresses, token?.address) || 0).toFixed()
    }
  })
  return balance
})

const handleCheckAllChange = (val: CheckboxValueType) => {
  currentChainSelectedWallets.value = val ? allWallets.value : [botStore.evmAddress || '']
  isIndeterminate.value = false
}

const handleCheckedChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < botStore.walletList.length
}

const handleChainSelect = (chainId: string) => {
  selectedChainValue.value = chainId
}

const checkAll = computed(() => {
  const checkedCount = currentChainSelectedWallets.value.length
  return checkedCount === botStore.walletList.length
})

const walletCheckboxes = computed(() => {
  return currentChainSelectedWallets.value
})

function getAddressFromChain(chain: typeof SupportMonitorChain[number], addresses: typeof botStore.walletList[number]['addresses']) {
  return addresses?.find?.(i => i?.chain === chain)
}

function getAddressFromChainBalance(chain: typeof SupportMonitorChain[number], addresses: typeof botStore.walletList[number]['addresses'], token?: string) {
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

.chain-icon-btn {
  opacity: 0.4;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
}

.chain-icon-active {
  opacity: 1 !important;
  background: rgba(255, 255, 255, 0.1);
}

.chain-icon-inactive {
  opacity: 0.4;
}
</style>