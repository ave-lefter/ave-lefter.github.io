<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <el-table v-loading="loading && !txHistory?.length" :data="txHistory" fit stripe :height="tableHeight" row-class-name="text-12px" header-row-class-name="text-12px"
      style="width: 100%;" @row-click="tableRowClick">
      <template #empty>
        <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>
      <el-table-column :label="t('token')" align="left">
        <template v-if="isBotWallet" #default="{ row }">
          <div class="flex items-center justify-start">
            <div class="icon-token-container mr-5px">
              <div class="relative">
                <el-image class="w-32px h-32px rounded-full" :src="getSymbolDefaultIcon({
                  chain: row?.chain,
                  symbol: !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol,
                  logo_url: !isBuy(row.swapType) ? row?.inTokenLogoUrl : row.outTokenLogoUrl
                })">
                  <template #error>
                    <img class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                  <template #placeholder>
                    <img class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                </el-image>
                <img v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-0 rd-50%"
                  :src="`${configStore.token_logo_url}chain/${row.chain}.png`" alt="" srcset="">
              </div>
            </div>
            <span class="text-[var(--d-eaecef-l-333333)] text-13px">{{ !isBuy(row.swapType) ?
              row?.inTokenSymbol :
              row.outTokenSymbol
            }}</span>
          </div>
        </template>
         <template v-else #default="{ row }">
          <div class="flex items-center justify-start">
            <div class="icon-token-container mr-5px">
              <div class="relative">
                <el-image class="w-32px h-32px rounded-full" :src="getSymbolDefaultIcon({
                  chain: row?.chain,
                  symbol: !isBuyChain(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol,
                  logo_url: !isBuyChain(row.swapType) ? row?.inTokenLogoUrl : row.outTokenLogoUrl
                })">
                  <template #error>
                    <img class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuyChain(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                  <template #placeholder>
                    <img class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuyChain(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                </el-image>
                <img v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-3px rd-50%"
                  :src="`${configStore.token_logo_url}chain/${row.chain}.png`" alt="" srcset="">
              </div>
            </div>
            <span class="text-[var(--d-eaecef-l-333333)] text-13px">{{ !isBuyChain(row.swapType) ?
              row?.inTokenSymbol :
              row.outTokenSymbol
            }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('type')" align="right" prop="isBuy">
        <template #header>
          <div class="flex flex-row-reverse">
            <div class="flex items-center">
              <div>{{ t('type') }}</div>
              <el-dropdown v-if="isBotWallet" :persistent="false" trigger="click" @command="handleTypeCommand">
                <Icon name="custom:filter"
                  :class="[filterConditions?.isBuy >= 0 && filterConditions?.isLimit >= 0 && 'color-#286DFF']"
                  class="color-[--third-text] cursor-pointer text-10px" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="all">{{ t('all') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.isBuy === 0 && filterConditions.isLimit === 1 && 'active-dropdown-item']"
                      command="LimitSell">{{ t('limit') }}/{{ t('sell') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.isBuy === 1 && filterConditions.isLimit === 1 && 'active-dropdown-item']"
                      command="LimitBuy">{{ t('limit') }}/{{ t('buy') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.isBuy === 0 && filterConditions.isLimit === 0 && 'active-dropdown-item']"
                      command="MarketSell">{{ t('market') }}/{{ t('sell') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.isBuy === 1 && filterConditions.isLimit === 0 && 'active-dropdown-item']"
                      command="MarketBuy">{{ t('market') }}/{{ t('buy') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        <template #default="{ row }">
          <template v-if="isBotWallet">
              <div v-if="isBuy(row.swapType)" style="background: rgba(18, 184, 134, 0.10)"
              class="text-13px text-center text-[#12B886] px-5px py-2px rounded-4px">
              {{ getSwapTypeLabel(row.swapType) }}
            </div>
            <div v-else style="background: rgba(246, 70, 93, 0.10)"
              class="text-13px  text-center text-[#F6465D] px-5px py-2px rounded-4px">
              {{ getSwapTypeLabel(row.swapType) }}
            </div>
          </template>
          <template v-if="!isBotWallet">
              <div v-if="isBuyChain(row.swapType)" style="background: rgba(18, 184, 134, 0.10)"
              class="text-13px text-center text-[#12B886] px-5px py-2px rounded-4px">
              {{ getChianSwapTypeLabel(row.swapType) }}
            </div>
            <div v-else style="background: rgba(246, 70, 93, 0.10)"
              class="text-13px  text-center text-[#F6465D] px-5px py-2px rounded-4px">
              {{ getChianSwapTypeLabel(row.swapType) }}
            </div>
          </template>

        </template>
      </el-table-column>
      <el-table-column :label="t('price')" align="right">
        <template v-if="isBotWallet" #default="{ row }">
          <div class="text-[--secondary-text] text-right">${{ isBuy(row.swapType) ? formatNumber(row?.outPrice ||
            0) : formatNumber(row?.inPrice || 0) }}</div>
        </template>
        <template v-else #default="{ row }">
          <div class="text-[--secondary-text] text-right">${{ isBuyChain(row.swapType) ? formatNumber(row?.outPrice ||
            0) : formatNumber(row?.inPrice || 0) }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('volume4')" align="right">
        <template #default="{ row }">
          <div class="text-[--secondary-text] text-right">${{ formatNumber(Number(row?.inValue) || row?.outValue ||
            0, 2) }}</div>
        </template>
      </el-table-column>

      <el-table-column :label="t('amount1')" align="right">
        <template #header>
          <span>{{ t('amount1') }}</span>
          <!-- <span @click="isUnit = !isUnit"
            class="iconify i-custom:u text-10px ml-3px color-[--third-text] cursor-pointer text-12px"></span>
          <span @click="isUnit = !isUnit"
            class="iconify i-custom:b text-10px ml-3px color-[--third-text] cursor-pointer text-12px"></span> -->
        </template>
        <template #default="{ row }">
          <span v-if="isBotWallet" class="text-[--secondary-text] text-right">
            <template v-if="!isBuy(row.swapType)">
              {{ formatNumber(formatUnits(new BigNumber(row?.inAmount || 0).toFixed(0), row.inTokenDecimals ||
                0).toString(), 4) }}
              {{ row?.inTokenSymbol }}
            </template>
            <template v-else>
              {{ formatNumber(formatUnits(new BigNumber(row?.outAmount || 0).toFixed(0), row.outTokenDecimals ||
                0).toString(), 4)
              }}
              {{ row?.outTokenSymbol }}
            </template>
          </span>
          <span v-else class="text-[--secondary-text] text-right">
            <template v-if="!isBuyChain(row.swapType)">
              {{ row.status === 'cancelled' ? '0' : formatNumber(formatUnits(new BigNumber(row?.inAmount ||
                0).toFixed(0), row.inTokenDecimals || 0).toString(), 4) }}
              {{ row?.inTokenSymbol }}
            </template>
            <template v-else>
              {{ row.status === 'cancelled' ? '0' : formatNumber(formatUnits(new BigNumber(row?.outAmount ||
                0).toFixed(0), row.outTokenDecimals || 0).toString(), 4) }}
              {{ row?.outTokenSymbol }}
            </template>
          </span>
        </template>
      </el-table-column>

      <el-table-column v-if="isBotWallet" :label="t('status')" align="right">
        <template #header>
          <div class="flex flex-row-reverse">
            <div class="flex items-center">
              <div>{{ t('status') }}</div>
              <el-dropdown :persistent="false" trigger="click" @command="handleStatusCommand">
                <Icon name="custom:filter" :class="[filterConditions.statusType && 'color-#286DFF']"
                  class="color-[--third-text] cursor-pointer text-10px" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="all">{{ t('all') }}</el-dropdown-item>
                    <el-dropdown-item :class="[filterConditions.statusType === 'confirmed' && 'active-dropdown-item']"
                      command="confirmed">{{ t('completed') }}</el-dropdown-item>
                    <el-dropdown-item :class="[filterConditions.statusType === 'cancelled' && 'active-dropdown-item']"
                      command="cancelled">{{ t('cancelled1') }}</el-dropdown-item>
                    <el-dropdown-item :class="[filterConditions.statusType === 'error' && 'active-dropdown-item']"
                      command="error">{{ t('failed') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.statusType === 'auto_cancelled' && 'active-dropdown-item']"
                      command="auto_cancelled">{{ t('autoCancelled') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        <template #default="{ row }">
          <div class="text-[--secondary-text] text-right truncate">
            <span v-if="row.status === 'confirmed'">{{ t('completed')
            }}</span>
            <span v-else-if="row.status === 'error'" style="color: var(--down-color);word-break: break-all;">{{
              t('failed') }}<template v-if="row?.errorLog">({{ formatBotError(row?.errorLog) }})</template></span>
            <span v-else-if="row.status === 'cancelled'">{{ t('cancelled1')
            }}</span>
            <span v-else-if="row.status === 'auto_cancelled'">{{
              t('autoCancelled')
            }}</span>
            <span v-else style="color: var(--custom-text-1-color);">{{ t('pending') }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('CreateTime')" align="right">
        <template #default="{ row }">
          <span class="text-[--secondary-text] text-right">{{ formatDate(row.createTime, 'YYYY/MM/DD HH:mm')
          }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('operate')" align="right">
        <template #default="{ row }">
          <div class="flex items-center flex-row-reverse">
            <Icon name="custom:browser" class="text-16px  ml-8px clickable color-[--third-text]"
              @click.stop.prevent="jumpExplorerUrl(row)" />
            <template v-if="row.status == 'confirmed' && row.swapType === 2 && row.chain === 'solana'">
              <share :statistics="row" :address="isBotWallet ? props.userAddress : row.userAddress" :chain="row.chain" />
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
// import { useStorage } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { formatDate, getSymbolDefaultIcon, getChainDefaultIcon, formatExplorerUrl } from '~/utils'
import { formatNumber } from '~/utils/formatNumber'
import { bot_getUserTxHistory1, wallet_getOrders } from '@/api/token'
import share from './share.vue'
import { evm_utils } from '@/utils'

import { ref, nextTick } from 'vue'

const { formatUnits } = evm_utils

const props = defineProps({
  chain: {
    type: String,
    required: true
  },
  currentToken: {
    type: Boolean,
    required: true
  },
  userAddress: {
    type: String,
    required: true
  }
})

// const tokenStore = useTokenStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const route = useRoute()
const router = useRouter()
const { mode } = storeToRefs(useGlobalStore())
const tokenStore = useTokenStore()
const { t } = useI18n()
const configStore = useConfigStore()
const globalStore = useGlobalStore()

// 钱包类型判断
const isBotWallet = computed(() => {
  return !!botStore?.userInfo?.evmAddress
})

// 根据钱包类型确定使用的链参数
const currentChain = computed(() => {
  if (isBotWallet.value) {
    return props.chain
  } else {
    return walletStore.chain
  }
})

const currentTokenAddress = computed(() => {
  return props.currentToken ? getAddressAndChainFromId((route.params.id as string) || '')?.address || '' : ''
})

const filterConditions = ref<any>({
  isLimit: undefined,
  isBuy: undefined,
  statusType: ''
})

const txHistory = ref<any[]>([])
const loading = ref(false)

const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 360, 450)
})


// 验证链和地址格式是否匹配
function validateChainAddress(chain: string, address: string) {
  if (!chain || !address) {
    return false
  }

  // 验证地址格式与链匹配
  if (chain === 'solana') {
    const isValid = address.length > 30 && !address.startsWith('0x')
    return isValid
  } else if (['bsc', 'ethereum', 'polygon', 'arbitrum', 'base'].includes(chain)) {
    const isValid = address.startsWith('0x') && address.length === 42
    return isValid
  }

  return true
}

watch([() => currentChain.value, () => props.userAddress, () => props.currentToken, () => route.params.id], ([newChain, newAddress]) => {
  if (validateChainAddress(newChain, newAddress)) {
    nextTick(() => {
      getTxHistory()
    })
  }
}, { immediate: true })

function handleTypeCommand(command: string) {
  if (command === 'all') {
    filterConditions.value.isBuy = undefined
    filterConditions.value.isLimit = undefined
  } else if (command === 'LimitSell') {
    // Explicit Limit Sell
    filterConditions.value.isBuy = 0
    filterConditions.value.isLimit = 1
  } else if (command === 'LimitBuy') {
    // Explicit Limit Buy
    filterConditions.value.isBuy = 1
    filterConditions.value.isLimit = 1
  } else if (command === 'MarketSell') {
    // Explicit Market Sell
    filterConditions.value.isBuy = 0
    filterConditions.value.isLimit = 0
  } else if (command === 'MarketBuy') {
    // Explicit Market Buy
    filterConditions.value.isBuy = 1
    filterConditions.value.isLimit = 0
  }
  getTxHistory()
}

function handleStatusCommand(command: string) {
  if (command === 'all') {
    filterConditions.value.statusType = ''
  } else {
    filterConditions.value.statusType = command
  }
  getTxHistory()
}

function jumpExplorerUrl(row: any) {
  if (!row.txHash) {
    return
  }
  window.open(formatExplorerUrl(row.chain, row.txHash, 'tx'))
}

function tableRowClick(row: any) {
    let token
    if(isBotWallet.value) {
      token = !isBuy(row.swapType) ? row?.inTokenAddress : row.outTokenAddress
    } else {
      token = !isBuyChain(row.swapType) ? row?.inTokenAddress : row.outTokenAddress
    }
    if (!token) {
      return
    }
    router.push(`/token/${token}-${row.chain}`)
}


const getTxHistory = async () => {
  loading.value = true
  try {
    const apiChain = currentChain.value
    if (!validateChainAddress(apiChain, props.userAddress)) {
      loading.value = false
      return
    }

    if (isBotWallet.value) {
      // Bot钱包使用原接口
      const res = await bot_getUserTxHistory1({
        page: 0,
        pageSize: 1000,
        chain: apiChain,
        walletAddress: props.userAddress,
        token: currentTokenAddress.value,
        timeSort: true,
        tradeVolumeSort: false,
        isSuccess: false,
        status: filterConditions.value.statusType,
        isLimit: filterConditions.value.isLimit,
        isBuy: filterConditions.value.isBuy,
        tgUid: botStore?.userInfo?.tgUid,
        minTradeVolume: 0,
        maxTradeVolume: 100000
      })
      txHistory.value = res || []
      globalStore.mySwapList = res || []
    } else {
      // 链钱包使用新接口
      const tokenAddress = currentTokenAddress.value

      const res = await wallet_getOrders({
        chain: apiChain,
        creatorAddress: props.userAddress,
        token: tokenAddress,
        mode: 1, // 历史交易
        onlySuccess: true,
        pageSize: 100,
        pageNo: 1,
      })

      const rawList = res?.list || []

      if (rawList.length > 0) {
        const mappedData = rawList.map(mapWalletOrderToTableRow)
        txHistory.value = mappedData
        globalStore.mySwapList = mappedData
      } else {
        txHistory.value = []
        globalStore.mySwapList = []
      }
    }
  } catch (error) {
    console.error('获取交易历史错误:', error)
  } finally {
    loading.value = false
  }
}

function getSwapTypeLabel(swapType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 13 | 14) {
  const swapTypeMap = {
    1: t('buy'),
    2: t('sell'),
    3: 'Wrap',
    4: 'Unwrap',
    5: `${t('limit')}/${t('buy')}`,
    6: `${t('limit')}/${t('sell')}`,
    7: t('followBuy'),
    8: t('followSell'),
    12: t('trailingStop'),
    13: t('listingOnDex'),
    14: t('devSell')
  } as const
  if (swapTypeMap[swapType]) {
    return swapTypeMap[swapType]
  }
  return ''
}

function getChianSwapTypeLabel(swapType: 1 | 2 | 3 | 4 | 5 | 6 ) {
  const swapTypeMap = {
    1: t('buy'),
    2: t('sell'),
    3: t('limitBuy1'),
    4: t('limitSell1'),
    5: 'Wrap',
    6: 'Unwrap',
  } as const
  if (swapTypeMap[swapType]) {
    return swapTypeMap[swapType]
  }
  return ''
}

function isBuy(swapType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 13 | 14) {
  return swapType === 1 || swapType === 5 || swapType === 7
}

function isBuyChain(swapType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 13 | 14) {
  return swapType === 1 || swapType === 3 || swapType === 5 || swapType === 7
}

// 将链钱包数据映射为bot钱包表格格式
function mapWalletOrderToTableRow(order: any) {
  const outputAmount = parseFloat(order.outputAmount || '0')
  const inAmount = parseFloat(order.inAmount || '0')
  const inPrice = parseFloat(order.inPrice || '0')
  const outPrice = parseFloat(order.outPrice || '0')
  return {
    chain: currentChain.value,
    swapType: order.swapType,
    inTokenSymbol: order.inToken,
    outTokenSymbol: order.outToken,
    inTokenLogoUrl: order.inLogoUrl,
    outTokenLogoUrl: order.outLogoUrl,
    inTokenAddress: order.inTokenAddress,
    outTokenAddress: order.outTokenAddress,
    inTokenDecimals: order.inDecimals,
    outTokenDecimals: order.outDecimals,
    inPrice: inPrice,
    outPrice: outPrice,
    inValue: inAmount * inPrice / Math.pow(10, order.inDecimals || 0),
    outValue: outputAmount * outPrice / Math.pow(10, order.outDecimals || 0),
    inAmount: inAmount.toString(),
    outAmount: outputAmount.toString(),
    createTime: order.createTime,
    txHash: order.txHash,
    status: order.status,
    userAddress: order.creatorAddress,
    errorLog: order.errorLog || ''
  }
}

onMounted(() => {
  getTxHistory()
})
defineExpose({
  getTxHistory,
  refreshData: () => {
    getTxHistory()
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item) {
  font-size: 12px;
  padding: 8px 16px;

  &.active-dropdown-item {
    color: #286DFF;
    font-weight: bold;
  }
}

:deep(.el-dropdown-menu) {
  background-color: var(--custom-bg-1-color);
  border: 1px solid var(--d-33353D-l-f5f5f5);
}

.active-dropdown-item {
  color: #286DFF !important;
  font-weight: bold;
}
</style>
