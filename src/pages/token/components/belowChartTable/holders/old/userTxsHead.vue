<template>
  <el-alert
    v-if="userAddress === botStore?.evmAddress"
    class="myTxs-notice"
    type="warning"
    :title="t('myTxsNotice')"
    show-icon
    closable
    :style="{
      backgroundColor:
        mode === 'light' ? '#ffa94d0d' : 'rgba(117, 65, 29, 0.23)',
      color: '#ED6A0C',
      border: 'none',
    }"
  />

  <div class="profit">
    <div
      v-for="(label, index) in profitItems"
      :key="index"
      class="profit-container"
    >
      <div class="right">
        <span class="label" v-html="label.label" />
        <span
          v-if="label.type === 'profit'"
          class="value"
          :style="{
            color: profit.value >= 0 ? upColor[0] : downColor[0],
          }"
        >
          {{ profit.value >= 0? '$'+ formatNumber(profit.value) : '-$'+ formatNumber(Math.abs(profit.value)) }}
        </span>
        <span
          v-else-if="label.type === 'profitChange'"
          class="value"
          :style="{
            color: profit.value >= 0 ? upColor[0] : downColor[0],
          }"
        >
          {{ formatPercent(profitChange.value) }}
        </span>
        <span v-else class="value">
          {{ label.prefix }}{{ formatNumber(label.value) }}
        </span>
      </div>
    </div>
  </div>

  <div
    class="holder-container"
    :style="{
      '--upColor': upColor[0],
      '--downColor': downColor[0],
      '--upBgColor': '#12B88633',
      '--downBgColor': '#ff646d33',
    }"
  >
    <div class="bottom">
      <div class="item up">
        <div>
          <span class="label">{{ t('buyFrequency') }}</span>
          <span class="value">{{ formatNumber(totalBuyFrequency) }}</span>
        </div>
        <div>
          <span class="label">{{ t('buyAmount') }}($)</span>
          <span class="value">{{ formatNumber(totalBuy) }}</span>
        </div>
      </div>
      <div class="item down">
        <div>
          <span class="label">{{ t('sellFrequency') }}</span>
          <span class="value">{{ formatNumber(totalSellFrequency) }}</span>
        </div>
        <div>
          <span class="label">{{ t('sellAmount') }}($)</span>
          <span class="value">{{ formatNumber(totalSell) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAddressAndChainFromId } from '@/utils/index'
import { getUserBalances } from '@/api/token'
import { formatNumber } from '@/utils/formatNumber'
import { upColor, downColor } from '@/utils/constants'

const props = defineProps<{
  tableList: any[]
  userAddress: string
}>()

const { t } = useI18n()
const botStore = useBotStore()

const balance = ref(0)

const { mode } = storeToRefs(useGlobalStore())
const route = useRoute()
const { price, tokenInfoExtra } = storeToRefs(useTokenStore())
const id = computed(() => {
  return route.params.id as string
})

const tokenAddress = computed(() => {
  return getAddressAndChainFromId(id.value)?.address || ''
})

const totalBuy = computed(() =>
  props.tableList.reduce((p, c) => (isBuy(c) ? p + getAmountUSD(c) : p), 0)
)

const totalBuyAmount = computed(() =>
  props.tableList.reduce((p, c) => (isBuy(c) ? p + getAmount(c) : p), 0)
)

const totalSell = computed(() =>
  props.tableList.reduce((p, c) => (!isBuy(c) ? p + getAmountUSD(c) : p), 0)
)

const totalBuyFrequency = computed(
  () => props.tableList.filter((c) => isBuy(c)).length || 0
)

const totalSellFrequency = computed(
  () => props.tableList.filter((c) => !isBuy(c)).length || 0
)

const avgBuyPrice = computed(() =>
  totalBuyAmount.value > 0 ? totalBuy.value / totalBuyAmount.value : 0
)

const tokenValue = computed(() => {
  let sellTax = (tokenInfoExtra?.value?.sell_tax || 0) / 100
  sellTax = sellTax > 1 ? 1 : sellTax
  return (price.value || 0) * (balance.value || 0) * (1 - sellTax)
})

const profit = computed(() => ({
  value: totalSell.value + tokenValue.value - totalBuy.value,
}))

const profitChange = computed(() => ({
  value: totalBuy.value > 0 ? profit.value.value / totalBuy.value : 0,
}))

const profitItems = computed(() => [
  { label: t('currentPosition'), value: balance.value, prefix: '' },
  {
    label: `${t('tokenValue')}${
      tokenInfoExtra?.value?.sell_tax ?? 0 > 0
        ? ` (-${t('sellTax1')} ${formatNumber(
            tokenInfoExtra?.value?.sell_tax || 0,
            2
          )}%)`
        : ''
    }`,
    value: tokenValue.value,
    prefix: '$',
  },
  { label: t('positionCostPrice'), value: avgBuyPrice.value, prefix: '$' },
  { label: t('profit'), value: profit.value.value, type: 'profit' },
  { label: '', value: profitChange.value.value, type: 'profitChange' },
])

function isBuy(row: any) {
  if (row.from_address && row.from_address === tokenAddress.value) return false
  if (row.to_address && row.to_address === tokenAddress.value) return true
  const m = row.amount0In > 0 ? row.token0Address : row.token1Address
  return m !== tokenAddress.value
}

function getAmount(row: any) {
  if (row.from_address === tokenAddress.value) return row.from_amount
  if (row.to_address === tokenAddress.value) return row.to_amount
  if (row.amount0In > 0) {
    return tokenAddress.value === row.token0Address
      ? row.amount0In
      : row.amount1Out
  } else {
    return tokenAddress.value === row.token1Address
      ? row.amount1In
      : row.amount0Out
  }
}

function getAmountUSD(row: any) {
  if (row.from_address === tokenAddress.value)
    return Number(row.from_amount) * Number(row.from_price_usd)
  if (row.to_address === tokenAddress.value)
    return Number(row.to_amount) * Number(row.to_price_usd)
  return row.amountUSD
}

async function getTokenBalance() {
  try {
    const id = route.params.id as string
    if (id) {
      const { chain } = getAddressAndChainFromId(id)
      const res = await getUserBalances(id, [props.userAddress + '-' + chain])
      if (res && res[0]) {
        const { value } = res[0]
        balance.value = value
      }
    }
  } finally {
    //
  }
}
watch(
  () => props.tableList,
  (val) => {
    if (val?.length > 0) {
      balance.value = 0
      getTokenBalance()
    }
  },
  { deep: true }
)

watch(
  () => props.userAddress,
  (val) => {
    if (val) {
      balance.value = 0
      getTokenBalance()
    }
  },
  { deep: true }
)

</script>

<style lang="scss" scoped>
.myTxs-notice {
  font-size: 12px;
  margin: 8px 8px 0 8px;
  height: 32px;
}
.profit {
  display: flex;
  justify-content: space-between;
}
.profit-container {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999999;
  .value {
    color: #fff;
    i {
      color: #999999;
    }
    a {
      color: #fff;
      &:hover {
        color: #558bed;
      }
    }
  }
  .icon-svg {
    font-size: 38px;
    margin-right: 10px;
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    .label {
      font-size: 12px;
      color: #848e9c;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
    }
    .value {
      color: #fff;
      margin-left: 10px;
    }
    .top {
      font-size: 15px;
      // color: #FFFFFF;
      line-height: 23px;
      font-weight: 400;
    }
    .bottom {
      font-size: 10px;
      // color: #FFFFFF;
      line-height: 14px;
      font-weight: 400;
      .label {
        margin-top: 5px;
      }
      .value + .label {
        margin-left: 10px;
      }
      .value + .value {
        margin-left: 5px;
      }
    }
  }
}
.holder-container {
  margin-bottom: 10px;
  .top {
    margin: 10px 0;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & + .item {
        margin-left: 8px;
      }
      .label {
        font-size: 12px;
        color: #787b86;
        letter-spacing: 0;
        text-align: center;
        font-weight: 400;
      }
      .value {
        font-size: 16px;
        // color: #FFFFFF;
        color: #9aa4d8;
        font-weight: 400;
      }
    }
  }
  .bottom {
    margin: 10px 0 0 0;
    display: flex;
    justify-content: space-between;
    border-radius: 4px;
    .item {
      flex: 1;
      display: flex;

      justify-content: space-between;
      border-radius: 4px;
      padding: 15px 28px;
      & + .item {
        margin-left: 8px;
      }
      .label {
        font-size: 12px;
        color: #787b86;
        text-align: center;
        font-weight: 400;
        vertical-align: middle;
      }
      .value {
        font-size: 15px;
        text-align: center;
        font-weight: 400;
        margin-left: 10px;
        vertical-align: middle;
      }
      &.up {
        background-color: var(--upBgColor);
        .value {
          color: var(--upColor);
        }
      }
      &.down {
        background-color: var(--downBgColor);
        .value {
          color: var(--downColor);
        }
      }
    }
  }
}

.table {
  font-size: 12px;
  color: #878fbc;
  letter-spacing: 0.29px;
  position: relative;
  background: #2c3254;
  padding: 5px 10px 20px;
  .table-list {
    font-size: 12px;
    min-height: 200px;
    color: #9aa4d8;
    .table-item {
      display: flex;
      align-items: center;
      &.table-header {
        font-size: 12px;
        color: #6a719c;
      }
      span {
        padding: 10px 0;
        &:nth-child(1) {
          flex: 1.9;
          text-align: left;
        }
        &:nth-child(2) {
          flex: 1.8;
          text-align: right;
        }
        &:nth-child(3) {
          margin: 0 5px;
          flex: 3;
          text-align: right;
        }
        &:nth-child(4) {
          flex: 2;
          text-align: right;
        }
      }
    }
  }
}
:deep().el-table__empty-block {
  background: #343c63;
}
:deep() .el-table {
  font-size: 14px;
  color: #878fbc;
  letter-spacing: 0.29px;
  &::before {
    height: 0px;
  }
  thead {
    color: #fff;
    th {
      background: #2c3254;
      &.is-leaf {
        border-bottom: none;
      }
      .cell {
        font-size: 14px;
        letter-spacing: 0.29px;
        line-height: 20px;
        color: #878fbc;
      }
    }
  }
  tr {
    background: #2c3254;
    td {
      border-bottom: 1px solid rgba(135, 143, 188, 0.3);
      .cell {
        line-height: 26px;
      }
    }
  }
}
:deep() .el-table--enable-row-hover {
  .el-table__body tr:hover > td {
    background-color: #2c3254;
  }
}
.pagination-box {
  margin-top: 20px;
}
a {
  color: #c5cbce;
}
a:hover {
  color: #558bed;
}
.highlight {
  color: #fff;
}
</style>
