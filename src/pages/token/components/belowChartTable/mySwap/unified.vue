<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div>
    <el-table v-loading="loading && !txHistory?.length" :data="txHistory" fit stripe :height="tableHeight"
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
        <template #default="{ row }">
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
                <img v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-3px rd-50%"
                  :src="`${configStore.token_logo_url}chain/${row.chain}.png`" alt="" srcset="">
              </div>
            </div>
            <span class="text-[var(--d-eaecef-l-333333)] text-13px">{{ !isBuy(row.swapType) ?
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
              <el-dropdown trigger="click" @command="handleTypeCommand">
                <Icon name="custom:filter"
                  :class="[filterConditions?.isBuy >= 0 && filterConditions?.isLimit >= 0 && 'color-#286DFF']"
                  class=" color-[--d-666-l-999] cursor-pointer text-10px" />
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
          <div v-if="isBuy(row.swapType)" style="background: rgba(18, 184, 134, 0.10)"
            class="text-13px text-center text-[#12B886] px-5px py-2px rounded-4px">
            {{ getSwapTypeLabel(row.swapType) }}
          </div>
          <div v-else style="background: rgba(246, 70, 93, 0.10)"
            class="text-13px  text-center text-[#F6465D] px-5px py-2px rounded-4px">
            {{ getSwapTypeLabel(row.swapType) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('price')" align="right">
        <template #default="{ row }">
          <div class="text-[var(--d-999-l-959A9F)] text-right">${{ isBuy(row.swapType) ? formatNumber(row?.outPrice ||
            0) : formatNumber(row?.inPrice || 0) }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('volume4')" align="right">
        <template #default="{ row }">
          <div class="text-[var(--d-999-l-959A9F)] text-right">${{ formatNumber(Number(row?.inValue) || row?.outValue ||
            0, 2) }}</div>
        </template>
      </el-table-column>

      <el-table-column :label="t('amount1')" align="right">
        <template #header>
          <span>{{ t('amount1') }}</span>
          <!-- <span @click="isUnit = !isUnit"
            class="iconify i-custom:u text-10px ml-3px color-[--d-666-l-999] cursor-pointer text-12px"></span>
          <span @click="isUnit = !isUnit"
            class="iconify i-custom:b text-10px ml-3px color-[--d-666-l-999] cursor-pointer text-12px"></span> -->
        </template>
        <template #default="{ row }">
          <span class="text-[var(--d-999-l-959A9F)] text-right">
            <template v-if="!isBuy(row.swapType)">
              {{ formatNumber(formatUnits(new BigNumber(row?.inAmount || 0).toFixed(0), row.inTokenDecimals || 0).toString(), 4) }}
              {{ row?.inTokenSymbol }}
            </template>
            <template v-else>
              {{ formatNumber(formatUnits(new BigNumber(row?.outAmount || 0).toFixed(0), row.outTokenDecimals || 0).toString(), 4)
              }}
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
              <el-dropdown trigger="click" @command="handleStatusCommand">
                <Icon name="custom:filter" :class="[filterConditions.statusType && 'color-#286DFF']"
                  class="color-[--d-666-l-999] cursor-pointer text-10px" />
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
          <div class="text-[var(--d-999-l-959A9F)] text-right truncate">
            <span v-if="row.status === 'confirmed'">{{ t('completed')
            }}</span>
            <span v-else-if="row.status === 'error'" style="color: var(--color-red-500);word-break: break-all;">{{
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
          <span class="text-[var(--d-999-l-959A9F)] text-right">{{ formatDate(row.createTime, 'YYYY/MM/DD HH:mm')
          }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isBotWallet" :label="t('operate')" align="right">
        <template #default="{ row }">
          <div class="flex items-center flex-row-reverse">
            <Icon name="custom:browser" class="text-16px  ml-8px clickable color-[--d-999-l-666]"
              @click.stop.prevent="jumpExplorerUrl(row)" />
            <template v-if="row.status == 'confirmed' && row.swapType === 2 && row.chain === 'solana'">
              <share :statistics="row" :address="props.userAddress" :chain="row.chain" />
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

import { ref } from 'vue'

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

// 钱包类型判断
const isBotWallet = computed(() => {
  return !!botStore?.userInfo?.evmAddress
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

// const isUnit = ref(true)

watch([() => props.chain, () => props.currentToken], () => {
  getTxHistory()
})

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
  // if (!row.txHash) return
  // window.open(formatExplorerUrl(row.chain, row.txHash, 'tx'))
  const token = !isBuy(row.swapType) ? row?.inTokenAddress : row.outTokenAddress
  if (!token) {
    return
  }
  router.push(`/token/${token}-${row.chain}`)
}

const getTxHistory = async () => {
  loading.value = true
  try {
    console.log('=== 钱包类型检测 ===')
    console.log('isBotWallet:', isBotWallet.value)
    console.log('botStore.userInfo:', botStore?.userInfo)
    console.log('walletStore.address:', walletStore?.address)
    console.log('props.userAddress:', props.userAddress)
    console.log('props.chain:', props.chain)
    
    if (isBotWallet.value) {
      // Bot钱包使用原接口
      console.log('=== 使用 Bot 钱包接口 ===')
      const res = await bot_getUserTxHistory1({
        page: 0,
        pageSize: 1000,
        chain: props.chain,
        walletAddress: props.userAddress,
        token: props.currentToken ? String(route.params.id).split('-')[0] : '',
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
      console.log('Bot钱包响应:', res)
      txHistory.value = res || []
    } else {
      // 链钱包使用新接口
      console.log('=== 使用链钱包接口 ===')
      const tokenAddress = props.currentToken ? String(route.params.id).split('-')[0] : ''
      console.log('请求参数:', {
        chain: props.chain,
        creatorAddress: props.userAddress,
        token: tokenAddress,
        mode: 1,
        onlySuccess: false,
        pageSize: 1000,
        pageNo: 1
      })
      
      const res = await wallet_getOrders({
        chain: props.chain,
        creatorAddress: props.userAddress,
        token: tokenAddress,
        mode: 1, // 历史交易
        onlySuccess: false,
        pageSize: 1000,
        pageNo: 1
      })
      console.log('链钱包响应:', res)
      // 将链钱包数据映射为表格格式
      txHistory.value = res.list?.map(mapWalletOrderToTableRow) || []
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
    5: `${ t('limit') }/${ t('buy') }`,
    6: `${ t('limit') }/${ t('sell') }`,
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

function isBuy(swapType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 13 | 14) {
  return swapType === 1 || swapType === 5 || swapType === 7
}

// 将链钱包数据映射为bot钱包表格格式
function mapWalletOrderToTableRow(order: any) {
  const outputAmount = order.outputAmount || 0
  const inAmount = order.inAmount || 0
  
  return {
    chain: props.chain,
    swapType: order.swapType,
    inTokenSymbol: order.inToken,
    outTokenSymbol: order.outToken,
    inTokenLogoUrl: order.inLogoUrl,
    outTokenLogoUrl: order.outLogoUrl,
    inTokenAddress: order.inTokenAddress,
    outTokenAddress: order.outTokenAddress,
    inTokenDecimals: order.inDecimals,
    outTokenDecimals: order.outDecimals,
    inPrice: order.inPrice || 0,
    outPrice: order.outPrice || 0,
    inValue: inAmount * (order.inPrice || 0),
    outValue: outputAmount * (order.outPrice || 0),
    inAmount: inAmount * Math.pow(10, order.inDecimals || 0),
    outAmount: outputAmount * Math.pow(10, order.outDecimals || 0),
    createTime: order.createTime,
    txHash: order.txHash,
    status: order.status,
    errorLog: order.errorLog || ''
  }
}

onMounted(() => {
  getTxHistory()
})
defineExpose({
  getTxHistory
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

// :deep(.el-table) {
//   --el-table-tr-bg-color: var(--d-0a0b0d-l-fff);
//   --el-table-bg-color: var(--d-0a0b0d-l-fff);
//   --el-table-text-color: var(--d-222-l-F2F2F2);
//   --el-table-header-bg-color: var(--d-17191C-l-F2F2F2);
//   --el-fill-color-lighter: var(--d-0a0b0d-l-fff);
//   --el-table-header-text-color: var(--d-999-l-666);
//   --el-table-border-color: var(--d-33353D-l-f5f5f5);
//   --el-table-row-hover-bg-color: var(--d-333333-l-eaecef);
//   background: var(--d-0a0b0d-l-fff);
//   --el-bg-color: var(--d-0a0b0d-l-fff);
//   --el-table-border: 0.5px solid var(--d-33353D-l-f5f5f5);
//   font-size: 13px;

//   th {
//     padding: 6px 0;
//     border-bottom: none !important;
//     height: 32px;

//     &.el-table__cell.is-leaf {
//       border-bottom: none;
//     }

//     .cell {
//       font-weight: 400;
//       font-size: 12px;
//     }
//   }
// }
</style>
