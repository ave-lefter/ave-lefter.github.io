<template>
  <div class="history">
    <div class="top h-39px">
      <span style="width: 40px; flex: none">#</span>
      <span>{{ $t('wallet') }}</span>
      <span>{{ $t('balance1') }}</span>
      <span style="text-align: right">PnL</span>
      <span>{{ $t('volume') }}</span>
      <span>{{ $t('Txs') }}</span>
      <span>{{ $t('winRate') }}</span>
    </div>

    <el-scrollbar
      v-if="tokens?.length > 0 || isLoading"
      v-loading="isLoading"
      height="500px"
      max-height="calc(100vh - 200px)"
    >
      <ul class="content">
        <li v-for="(row, $index) in tokens" :key="$index">
          <a
            href=""
            class="flex no-underline h-50px"
            @click.stop.prevent="tableRowClick(row)"
          >
            <span class="color-[--d-999-l-666] text-12px" style="width: 40px; flex: none">
              {{ $index < 9 ? '0' + Number($index + 1) : $index + 1 }}
            </span>
            <div class="token-info">
              <UserAvatar
                class="mr-8px"
                :wallet_logo="row.wallet_logo"
                :address="row.wallet_address"
                :chain="row.chain"
                iconSize="32px"
              />
              <div style="display: flex; flex-direction: column">
                <span
                  class="token-symbol ellipsis text-14px"
                  style="max-width: 80px; display: inline-block"
                  :title="
                    getRemarkByAddress({
                      address: row.wallet_address,
                      chain: row.chain,
                    }) || row.wallet_address
                  "
                >
                  {{
                    getRemarkByAddress({
                      address: row.wallet_address,
                      chain: row.chain,
                    }) ||
                    row.remark ||
                    row.wallet_address?.slice(0, 4) +
                      '...' +
                      row.wallet_address?.slice(-4)
                  }}
                </span>
                <div
                  style="display: inline-flex; align-items: center"
                  class="mt-6px"
                >
                  <UserRemark :remark="row.remark" :address="row.wallet_address" :chain="row.chain" :showAddress="false" :wallet_logo="row.wallet_logo" iconEditSize="10px"/>
                  <!-- <a
                    href=""
                    class="ml-8 fav_address a-gray"
                    v-if="row.is_wallet_address_fav == 1"
                    @click.stop.prevent="deleteAttention(row)"
                  >
                    <i class="attention iconfont icon-fav1 active font-12"></i>
                  </a>
                  <a
                    v-else
                    href=""
                    class="ml-8 fav_address a-gray"
                    @click.stop.prevent="openAttention(row, $index)"
                  >
                    <i class="attention iconfont icon-fav1 font-12"></i>
                  </a> -->
                  <Icon
                    v-copy="row.wallet_address"
                    name="bxs:copy"
                    class="text-10px cursor-pointer color-[--d-666-l-999] ml-8px"
                    @click.stop.prevent
                  />
                  <!--  <el-tooltip
                    effect="customized"
                    placement="top"
                    v-if="row.new_tags?.length > 0"
                    :popper-class="$store.state.mode"
                  >
                    <template #content>
                      <div style="display: inline-block;" >
                        <template v-for="(i, index) in row.new_tags" :key="index">
                          <span
                            class="mr-3 font-12"
                            :style="{
                              color: i.color
                            }"
                            v-if="i.type?.includes('TOP') && i.type?.slice(3) <25 || Number(i.type)"
                          >
                            [{{ i?.[$f.filterLanguage($store.getters.language)] }}]
                          </span>
                          <div
                            v-if="i.extra_info?.length > 0 && i.type == '9'"
                            class="color-f2ad41 mt-5"
                          >
                            <template
                              v-for="(lock, $index) in i?.extra_info"
                              :key="$index"
                            >
                              <span class="block mt-5 color">
                                {{ $t('lockAmount') }}:
                                {{ $f.formatNumber2(lock.amount, 2, 4, 1000000) }}
                              </span>
                              <span class="block mt-5">
                                {{ $t('lockDate') }}:
                                {{ $f.formatDate(lock.lockDate, 'YYYY-MM-DD') }}
                              </span>
                              <span class="block mt-5">
                                {{ $t('unlockDate') }}:
                                {{ $f.formatDate(lock.unlockDate, 'YYYY-MM-DD') }}
                              </span>
                            </template>
                          </div>
                        </template>
                      </div>
                    </template>
                    <div class="flex" v-if="row.new_tags?.length > 0">
                      <template v-for="(i, index) in row.new_tags" :key="index">
                        <img
                          style="width: 15px; height: 15px"
                          class="ml-3 pointer"
                          :src="
                            $f.formatNewTags(i.icon)
                          "
                          alt=""
                          height="15px"
                          v-if="i.type?.includes('TOP') && i.type?.slice(3) <25 || Number(i.type)"
                        />
                      </template>
                    </div>
                  </el-tooltip>-->
                </div>
              </div>
            </div>
            <div class="color-[--d-999-l-666]">
              {{formatNumber((Number(row.main_token_balance_amount) || 0),2)}} {{ row.main_token_symbol }}
            </div>
            <div style="margin-left: 5px; text-align: right">
              <div
                :style="{
                  color: !row?.total_profit
                    ? '#666'
                    : row?.total_profit > 0
                    ? '#12B886'
                    : '#F6465D',
                }"
              >
                {{ row?.total_profit>=0? '$'+ formatNumber(row?.total_profit || 0, 2) : '-$'+ formatNumber(Math.abs(row?.total_profit || 0), 2)}}
              </div>
              <div
                :style="{
                  color: !row?.total_profit_rate
                    ? '#666'
                    : row?.total_profit_rate > 0
                    ? '#12B886'
                    : '#F6465D',
                }"
                class="mt-3px"
              >
                {{ formatNumber((row?.total_profit_rate * 100 || 0),2) }}%
              </div>
            </div>
            <div>
              <div>
                ${{
                  formatNumber(
                    (Number(row?.total_purchase_usd) || 0) +
                      (Number(row?.total_sold_usd) || 0),
                    2
                  )
                }}
              </div>
              <!-- <div class="mt-3px">
                <span style="color: #12b886"
                  >${{ formatNumber(row?.total_purchase_usd || 0, 2) }}</span
                ><span style="color: #999">/</span
                ><span style="color: #f6465d"
                  >${{ formatNumber(row?.total_sold_usd || 0, 2) }}</span
                >
              </div> -->
            </div>
            <div>
              <div>
                {{
                  formatNumber(
                    (Number(row?.total_purchase) || 0) +
                      (Number(row?.total_sold) || 0),
                    2
                  )
                }}
              </div>
              <!-- <div class="flex-end mt-3px">
                <span style="color: #12b886">{{
                  formatNumber(row?.total_purchase || 0, 2)
                }}</span
                ><span style="color: #999">/</span
                ><span style="color: #f6465d">{{
                  formatNumber(row?.total_sold || 0, 2)
                }}</span>
              </div> -->
            </div>
            <div
              :style="{
                color: !row?.total_win_ratio
                  ? '#666'
                  : Number(row?.total_win_ratio) > 0
                  ? '#12B886'
                  : '#F6465D',
              }"
            >
              {{ formatNumber(row?.total_win_ratio || 0, 2) }}%
            </div>
          </a>
        </li>
      </ul>
    </el-scrollbar>
    <div v-if="!isLoading && !tokens?.length" class="empty">
      <div>
        <img :src="themeStore.theme === 'light' ? emptyWhite : emptyDark" >
        <br >
        <span>{{ $t('noSearchResults') }}</span>
      </div>
    </div>
  </div>

  <!-- <AttentionDialog v-model:visible="attentionVisible" :row="currentAttentionRow" @submit="addAttention"/> -->
</template>
<script lang="ts" setup>
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
import { formatNumber } from '@/utils/formatNumber'
import UserAvatar from '@/components/userAvatar.vue'
import type { SearchWalletInfo } from '@/api/types/search'
import { getRemarkByAddress } from '@/utils/index'

const $router = useRouter()
const props = defineProps({
  tokens: {
    type: Array<SearchWalletInfo>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])
const tokens = computed(() => {
  return props.tokens
})
const isLoading = computed(() => {
  return props.loading
})
const themeStore = useThemeStore()

function tableRowClick(row: { wallet_address: string; chain: string }) {
  // $router.push({
  //   name: 'Balance',
  //   params: { userAddress: row.wallet_address, chain: row.chain },
  // })

  $router.push({
    path: `/address/${row.wallet_address}/${row.chain}`,
  })
  emit('close')
}

// const botStore = useBotStore()
// const item: SearchWalletInfo
// message.success('2222222')
// deleteAttention (item) {
// if (botStore.evmAddress) {

//   return
// }
// if (this.loadingAttention) return
// this.loadingAttention = true
// this.$store.dispatch('deleteAttention',  {address: item.wallet_address, chain: item.chain}).then(() => {
//   this.$message.success(this.$t('attention1Canceled'))
//   item.is_wallet_address_fav = 0
// }).catch(err => {
//   this.$message.error(err)
// }).finally(() => {
//   this.loadingAttention = false
// })
// }
</script>

<style lang="scss" scoped>
.history {
  font-size: 12px;
  padding-bottom: 10px;
  :deep() .icon-remark {
    margin-left: 0
  }
  .empty {
    color: #999;
    height: 500px;
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
  .top {
    color: var(--d-666-l-999);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    > :nth-child(1) {
      // width: 150px;
      font-size: 12px;
      flex: 1;
    }
    > :nth-child(2) {
      flex: 1;
    }
    > :nth-child(3) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(4) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(5) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(6) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(7) {
      flex: 1;
      text-align: right;
    }
  }
  .content {
    padding: 0 0 20px;
    li {
      padding: 0 20px;
      &:hover {
        background-color: var(--d-2A2A2A-l-F2F2F2);
      }
    }
    .token-info {
      display: flex;
      align-items: center;
      .token-symbol {
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // max-width: 100px;
        display: inline-block;
        word-break: break-all;
        padding: 0;
      }
      .icon-collect {
        font-size: 16px;
        color: #787b86;
        cursor: pointer;
        margin-right: 2px;
        &.collected {
          color: #558bed;
        }
      }
      .token-network {
        border: 1px solid #878fbc;
        border-radius: 10px;
        font-size: 12px;
        color: #878fbc;
        padding: 2px 5px;
        margin-left: 9px;
      }
      .token-icon {
        border-radius: 50%;
      }
      .ad-tag {
        border: 1px solid;
        padding: 0 4px;
        font-size: 12px;
        margin-left: 5px;
        color: #878fbc;
        border-radius: 5px;
      }
      .risk-status {
        display: inline-block;
        font-size: 10px;
        border: 1px solid;
        border-radius: 20px;
        padding: 1px 3px;
        margin-left: 5px;
        &.high {
          color: #f72121;
        }
      }
    }
    li > a:hover {
      text-decoration: none;
      background-color: var(--d-2A2A2A-l-F2F2F2);
      color: var(--a-text-1-color);
      opacity: 1;
    }
    li:nth-child(1) .flex {
      margin-top: 0;
    }
    .flex {
      // padding: 8px 0;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 12px;
      > :nth-child(1) {
        // width: 150px;
        flex: 1;
        font-size: 12px;
      }
      > :nth-child(2) {
        flex: 1;
      }
      > :nth-child(3) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(4) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(5) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(6) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(7) {
        flex: 1;
        text-align: right;
      }
    }
    > span {
      color: var(--custom-font-1-color);
      &.green {
        color: #12b886;
      }
      &.red {
        color: #ff646d;
      }
    }
  }
  li > a {
    color: var(--a-text-1-color);
  }
  // .fav_address .attention.active, .fav_address .attention:hover {
  //   color: #f45469;
  // }
  .no-inherit {
    vertical-align: middle;
  }
  .count-down {
    text-align: right;
    .colon {
      display: inline-block;
      margin: 0 2px;
      color: #3f80f7;
      font-size: 12px;
      padding: 0;
    }
    .block {
      display: inline-block;
      font-size: 12px;
      // width: 30px;
      color: #3f80f7;
      // line-height: 30px;
      text-align: center;
      border-radius: 4px;
      background-color: #1f242a;
      padding: 1px 5px;
    }
  }
}
</style>
