<template>
  <div class="history">
    <div class="flex gap-5px mb-32px" v-if="mainTokens?.length >0">
      <div
        class="item bg-[--border] rounded-12px px-12px py-12px flex flex-col items-center justify-center flex-1 max-w-20%"
        v-for="(row, index) in mainTokens"
        :key="index"
        @click="tableRowClick(row)"
      >
        <TokenImg :row="row" tokenClass="w-32px h-32px"/>
        <div class="flex-column mt-6px">
          <div class="flex-start">
            <span class="token-symbol font-14">{{ row.symbol }}</span>
            <span
              v-if="
                ((row?.risk_score || 0) > 55 || (row?.risk_level || 0) < 0) && row.risk_level !== 1
              "
              class="risk-status high"
            >
              {{ $t('highRisk') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-start color-[--secondary-text] text-16px font-500 mb-10px">
      <Icon class="text-24px" name="custom:my-token" />
      <span class="ml-5px">{{ $t('myToken') }}</span>
    </div>
    <el-scrollbar v-if="searchTokens?.length > 0" v-loading="loading" height="calc(45vh)" class="hidden-scrollbar">
      <ul class="content color-[--main-text]">
        <li v-for="(row, $index) in searchTokens" :key="$index"  :class="{ disabled: disabledToken === row.address }" class="flex justify-between px-16px py-16px clickable hover:bg-[--dialog-list-hover]"  @click.stop.prevent="tableRowClick(row)">
          <div class="token-info">
            <TokenImg class="mr-5px" :row="row" tokenClass="w-40px h-40px"/>
            <div class="flex-column">
              <div class="flex-start">
                <span class="token-symbol font-14">{{ row.symbol }}</span>
                <span v-if="((row?.risk_score || 0) > 55 || (row?.risk_level || 0) < 0) && row.risk_level !== 1" class="risk-status high">
                  {{ $t('highRisk') }}
                </span>
              </div>
              <span
                v-if="!row?.tags && row.address !== NATIVE_TOKEN"
                class="px-5px py-0 color-[--third-text]"
              >
                {{ row.token?.slice(0, 4) }}**{{ row.token?.slice(-4) }}
              </span>
            </div>
          </div>
          <div v-if="(row.amount || 0) > 0 || (row.value || 0) > 0 || (row.balance || 0) > 0" class="flex flex-col text-right">
              <span
              class=" color-[--main-text]"
              v-html="
                `$ ${formatNumber(
                  (row.current_price_usd || row.price || 0) * (row?.amount || row?.value || row.balance || 0)
                )}`
              "
            />
            <span class="color-[--third-text] py-2px" v-html="row.amount || row.value || row.balance ? formatNumber(row?.amount || row?.value || row.balance || '') : ''" />
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
import { NATIVE_TOKEN, SupportFullDataChain} from '@/utils/constants'
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
      balance?: number
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
const configStore = useConfigStore()
const chainConfig = configStore.chainConfig

  const obj = {
  'bsc':{
    BNB: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    USDT: '0x55d398326f99059ff775485246999027b3197955',
    USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    USD1: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
  },
  'eth':{
    base: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    USD1: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
  },
  'base':{
    ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    USDT: '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2',
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    },

  'xlayer':{
    OKB: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    WOKB: '0xe538905cf8410324e03a5a23c1c177a474d59b2b',
    USDT: '0x5b827940327c99e255ff498206703bffaa625a43',
    USDC: '0x74b7f16337b8972027f6196a17a631ac6de26d22'
    },
  'solana':{
    SOL: 'So11111111111111111111111111111111111111112',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
    },
  }
const mainTokens = computed(() => {
// 取所有 value，合并，去重
const allValues = [
  ...new Set(
    Object.values(obj) // 拿到每个链的对象
      .flatMap(chainObj => Object.values(chainObj)) // 展平 value
  )
]
console.log('----allValues--------',allValues)
  const list = props.searchTokens?.filter(
    (i) =>  allValues?.includes(i.address || '')
  )
  return list
})


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
        border: 1px solid var(--border);
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
      background-color: var(--border);
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
      // color: var(--main-text);
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
