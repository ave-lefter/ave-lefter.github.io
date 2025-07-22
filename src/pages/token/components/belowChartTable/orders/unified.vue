<template>
  <div>
    <el-table v-loading="loading && !txOrder?.length" :data="txOrder" fit stripe :height="tableHeight" style="width: 100%" @row-click="tableRowClick">
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
          <div class="flex items-center justify-start" @click="handleTokenClick(row)">
            <div class="icon-token-container mr-5px">
              <div class="relative">
                <el-image
                  class="w-32px h-32px rounded-full" :src="getSymbolDefaultIcon({
                  chain: row?.chain,
                  symbol: !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol,
                  logo_url: !isBuy(row.swapType) ? row?.inTokenLogoUrl : row.outTokenLogoUrl
                })">
                  <template #error>
                    <img
                      class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                  <template #placeholder>
                    <img
                      class="w-32px h-32px"
                      :src="getChainDefaultIcon(row?.chain, !isBuy(row.swapType) ? row?.inTokenSymbol : row.outTokenSymbol)"
                      alt="" srcset="">
                  </template>
                </el-image>
                <img
                  v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-3px rd-50%"
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
                <Icon
                  name="custom:filter" :class="[filterConditions.swapType?.length === 1 && 'color-#286DFF']"
                  class="color-[--d-666-l-999] cursor-pointer text-10px" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="all">{{ t('all') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.swapType.length === 1 && filterConditions.swapType[0] === 'buy' && 'active-dropdown-item']"
                      command="5">{{ t('limitBuy') }}</el-dropdown-item>
                    <el-dropdown-item
                      :class="[filterConditions.swapType.length === 1 && filterConditions.swapType[0] === 'sell' && 'active-dropdown-item']"
                      command="6">{{ t('limitSell') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        <template #default="{ row }">
          <div v-if="!isBuy(row.swapType)" class="text-13px text-[#F6465D] text-center px-5px py-2px  rounded-4px" style="background: rgba(246, 70, 93, 0.10)">
            {{ getSwapTypeLabel(row.swapType) }}
          </div>
          <div v-else class="text-13px text-[#12B886] text-center px-5px py-2px rounded-4px" style="background: rgba(18, 184, 134, 0.10)">
            {{ getSwapTypeLabel(row.swapType) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('price')" align="right">
        <template #header>
          <span>{{ t('price') }}</span>
        </template>
        <template #default="{ row }">
          <span v-if="row.swapType !== 13 && row.swapType !== 14" class="text-[--d-999-l-959A9F]">${{ formatNumber(row?.PriceLimit || 0) }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('volume4')" align="right">
        <template #default="{ row }">
          <span class="text-[--d-999-l-959A9F]">${{ formatNumber(Number(row?.inValue) || 0, 2) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('amount1')" align="right">
        <template #header>
          <span>{{ t('amountB') }}</span>
        </template>
        <template #default="{ row }">
          <span class="text-[var(--d-999-l-959A9F)]">
            <span class="text-[var(--d-999-l-959A9F)] text-right">
              <template v-if="!isBuy(row.swapType)">
                {{ !!Number(row?.inAmount) ? formatNumber(formatUnits(new BigNumber(row?.inAmount || 0).toFixed(0),
                  row.inTokenDecimals || 0) as string, 4) : '--'
                }}
                {{ !!Number(row?.inAmount) ? row?.inTokenSymbol : '' }}
              </template>
              <template v-else>
                {{ !!Number(row?.outputAmount) ? formatNumber(formatUnits(new BigNumber(row?.outAmount || 0).toFixed(0),
                  row.outTokenDecimals || 0) as string,
                  4) : '--'
                }}
                {{ !!Number(row?.outputAmount) ? row?.outTokenSymbol : '' }}
              </template>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="t('status')" align="right">
        <template #header>
          <span>{{ t('status') }}</span>
          <!-- <el-dropdown trigger="click" @command="handleStatusCommand">
            <i class="iconify i-custom:filter text-10px color-[--d-666-l-999] cursor-pointer text-10px"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="全部">全部</el-dropdown-item>
                <el-dropdown-item command="挂单中">挂单中</el-dropdown-item>
                <el-dropdown-item command="部分成交">部分成交</el-dropdown-item>
              </el-dropdown-menu>
            </template>
  </el-dropdown> -->
        </template>
        <template #default="{ row }">
          <span v-if="row.status === 'confirmed'" class="text-[var(--d-999-l-959A9F)]">{{ t('completed') }}</span>
          <span v-else-if="row.status === 'cancelled'" class="text-[var(--d-999-l-959A9F)]">{{ t('cancelled1') }}</span>
          <span v-else-if="row.status === 'sent'" class="text-[var(--d-999-l-959A9F)]">{{ t('sent') }}</span>
          <span v-else-if="row.status === 'waiting'" class="text-[var(--d-999-l-959A9F)]">{{ t('pendingOrder') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('CreateTime')" align="right">
        <template #default="{ row }">
          <span class="color-[--d-999-l-666]">{{ formatDate(row.createTime, 'YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="t('ExpirationTime')" align="right">
        <template #default="{ row }">
          <span class="color-[--d-999-l-666]">{{ formatDate(new Date(row.createTime).getTime() + 7 * 24 * 60 * 60 *
            1000,
            'YYYY/MM/DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('operate')" align="right">
        <template #default="{ row }">
          <div v-if="row.status === 'waiting'" class="text-[#F6465D] text-14px cursor-pointer" @click.stop="handleCancelOrder(row)">
            {{ t('cancel') }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
// import { useStorage } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { formatDate, getChainDefaultIcon, getAddressAndChainFromId } from '~/utils'
import { formatNumber } from '~/utils/formatNumber'
import { bot_getUserPendingTx, bot_cancelLimitOrdersByBatch } from '@/api/token'
import { evm_utils } from '@/utils'
import { ref } from 'vue'
import { useEventBus } from '@vueuse/core'

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

const botStore = useBotStore()
const tokenStore = useTokenStore()
const route = useRoute()
const router = useRouter()
const { mode } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const configStore = useConfigStore()
const filterConditions = ref({
  swapType: ['buy', 'sell'],
  statusType: ['waiting', 'confirmed', 'error', 'cancelled', 'sent']
})

type GetUserPendingTxRes = Awaited<ReturnType<typeof bot_getUserPendingTx>>
const txOrder = ref<GetUserPendingTxRes>([])
const loading = ref(false)
// const isUnit = ref(true)

const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 260, 450)
})

watch([() => props.currentToken, () => botStore.userInfo?.evmAddress || ''], () => {
  getUserPendingTx()
})

useEventBus<string>('updateLimitOrder').on(chain => {
  if (chain === props.chain) {
    getUserPendingTx()
  }
})

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

function handleCancelOrder(row: any) {
  ElMessageBox.confirm(t('botCancelOrder'), '', {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  })
    .then(async () => {
      console.log(row)
      await bot_cancelLimitOrdersByBatch({
        chain: props.chain,
        batchId: row.batchId
      })
      getUserPendingTx()
      useEventBus<string>('updateKlineLimitLine').emit()
    }).catch(() => { })
}

const handleTokenClick = (row: any) => {
  const token = !isBuy(row.swapType) ? row?.inTokenAddress : row.outTokenAddress
  if (!token) {
    return
  }
  router.push(`/token/${token}-${row.chain}`)
}
function handleTypeCommand(command: string) {
  if (command === 'all') {
    filterConditions.value.swapType = ['buy', 'sell']
  } else if (command === '5') {
    filterConditions.value.swapType = ['buy']
  } else if (command === '6') {
    filterConditions.value.swapType = ['sell']
  }
  getUserPendingTx()
}

// function handleStatusCommand(command: string) {
//   if (command === '全部') {
//     filterConditions.value.statusType = ['waiting', 'confirmed', 'error', 'cancelled', 'sent']
//   } else if (command === '挂单中') {
//     filterConditions.value.statusType = ['waiting']
//   } else if (command === '部分成交') {
//     filterConditions.value.statusType = ['confirmed']
//   }
//   // this.handleFilterConfirm(this.filterForm['statusType']);
// }

function tableRowClick(row: any) {
  const token = !isBuy(row.swapType) ? row?.inTokenAddress : row.outTokenAddress
  if (!token) {
    return
  }
  router.push(`/token/${token}-${row.chain}`)
}

const getUserPendingTx = async (chainValue?: string) => {
  loading.value = true
  const chain = chainValue || props.chain
  try {
    if (!botStore.accessToken) {
      return
    }
    const data = {
      chain: chain,
      token: props.currentToken ? getAddressAndChainFromId(route.params.id as string)?.address : '',
      walletAddress: props.userAddress || botStore.userInfo?.addresses.find((item) => item.chain === chain)?.address || '',
    }
    if (!data.walletAddress || !data.chain) return
    const res = await bot_getUserPendingTx({
      ...data as any
    })
    txOrder.value = res || []
    if (filterConditions.value.swapType.length === 1) {
      if (filterConditions.value.swapType[0] === 'buy') {
        txOrder.value = txOrder.value.filter((item: any) => isBuy(item.swapType))
      }
      if (filterConditions.value.swapType[0] === 'sell') {
        txOrder.value = txOrder.value.filter((item: any) => !isBuy(item.swapType))
      }
    }
    tokenStore.registrationNum = txOrder.value.length
  } catch (error: any) {
    // ElMessage.error(error)
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getUserPendingTx()
})
defineExpose({
  txOrder,
  getUserPendingTx,
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
