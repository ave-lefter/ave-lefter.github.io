<template>
  <div class="history">
    <el-scrollbar v-if="searchTokens?.length > 0" v-loading="loading" height="calc(60vh - 50px)">
      <ul class="content color-[--d-F5F5F5-l-333]">
        <li v-for="(row, $index) in searchTokens" :key="$index"  :class="{ disabled: disabledToken === row.address }" class="flex justify-between px-5px py-8px clickable"  @click.stop.prevent="tableRowClick(row)">
          <div class="token-info">
            <TokenImg class="mr-5px" :row="row" />
            <div class="flex-column">
              <div class="flex-start">
                <span class="token-symbol font-14">{{ row.symbol }}</span>
                <span v-if="((row?.risk_score || 0) > 55 || (row?.risk_level || 0) < 0) && row.risk_level !== 1" class="risk-status high">
                  {{ $t('highRisk') }}
                </span>
              </div>
              <span
                v-if="!row?.tags && row.address !== NATIVE_TOKEN"
                class="px-5px py-0 color-#999"
              >
                {{ row.token?.slice(0, 4) }}**{{ row.token?.slice(-4) }}
              </span>
            </div>
          </div>
          <div v-if="(row.amount || 0) > 0 || (row.value || 0) > 0" class="flex flex-col text-right">
            <span class="color-[--d-F5F5F5-l-333] py-2px" v-html="row.amount || row.value ? formatNumber(row?.amount || row?.value || '') : ''" />
            <span
              class="color-#999"
              v-html="
                `$ ${formatNumber(
                  (row.current_price_usd || row.price || 0) * (row?.amount || row?.value || 0)
                )}`
              "
            />
          </div>
        </li>
      </ul>
    </el-scrollbar>
    <div v-else class="empty">
      <div>
        <img src="@/assets/images/empty-black.svg" >
        <br >
        <span>{{ $t('noSearchResults') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { NATIVE_TOKEN } from '@/utils/constants'
import { formatNumber } from '@/utils/formatNumber'
const props = defineProps({
  searchTokens: {
    type: Array as PropType<Array<{
      address?: string;
      token?: string;
      symbol: string;
      logo_url: string;
      chain: string;
      amount?: number;
      value?: number;
      current_price_usd?: number;
      price?: number
      risk_score?: number
      risk_level?: number
      tags?: string
    }>>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabledToken: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['onSelect'])

function tableRowClick(item: typeof props.searchTokens[number]) {
  if ((item?.address || item?.token) && props.disabledToken !== item.address) {
    emit('onSelect', item)
  }
}

</script>

<style lang="scss" scoped>
.history {
  font-size: 12px;
  padding-bottom: 10px;
  .empty {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      text-align: center;
    }
    img {
      width: 100px;
      margin-bottom: 20px;
    }
  }
  .content {
    padding: 0 10px 20px 0;
    .token-info {
      display: flex;
      align-items: center;
      .token-symbol {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 2px 5px;
      }
      .token-network {
        border: 1px solid var(--d-333-l-F5F5F5);
        border-radius: 10px;
        font-size: 12px;
        color: #999;
        padding: 2px 5px;
        margin-left: 5px;
      }
      .token-icon {
        border-radius: 50%;
      }
      .ad-tag {
        border: 1px solid;
        padding: 0 4px;
        font-size: 12px;
        margin-left: 5px;
        color: #999;
        border-radius: 5px;
      }
      .risk-status {
        display: inline-block;
        font-size: 10px;
        border: 1px solid;
        border-radius: 20px;
        padding: 2px 5px;
        margin-left: 5px;
        &.high {
          color: #f72121;
        }
      }
    }
    li:not(.disabled):hover {
      text-decoration: none;
      background-color: var(--d-1A1A1A-l-F2F2F2);
      opacity: 1;
    }
    li.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    // .flex {
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   // margin-top: 10px;
    //   padding: 8px 5px;
    //   > :nth-child(1) {
    //     flex: 1.5;
    //   }
    //   > :nth-child(2) {
    //     flex: 1;
    //     text-align: right;
    //   }
    //   > :nth-child(3) {
    //     flex: 1;
    //     text-align: right;
    //   }
    //   > :nth-child(4) {
    //     flex: 1.5;
    //     text-align: right;
    //     color: #eaecef;
    //   }
    // }
    span {
      // color: var(--d-F5F5F5-l-333);
      &.green {
        color: #12b886;
      }
      &.red {
        color: #ff646d;
      }
    }
  }
}
</style>
