<template>
  <div class="histrory">
    <div class="top h-39px">
      <span>#</span>
      <span>{{ $t('tokenName') }}</span>
      <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('tx_volume_u_24h')"
      >
        {{ $t('24Volume') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'tx_volume_u_24h', 'b')}
            `"
            @click.stop="switchSort('tx_volume_u_24h', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'tx_volume_u_24h', 't')}
            `"
            @click.stop="switchSort('tx_volume_u_24h', 1)"
          />
        </div>
      </div>
      <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('mcap')"
      >
        {{ $t('mCap') + '/' + $t('pool') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'mcap', 'b')}
            `"
            @click.stop="switchSort('mcap', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'mcap', 't')}
            `"
            @click.stop="switchSort('mcap', 1)"
          />
        </div>
      </div>
      <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('current_price_usd')"
      >
        {{ $t('price') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'current_price_usd', 'b')}
            `"
            @click.stop="switchSort('current_price_usd', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'current_price_usd', 't')}
            `"
            @click.stop="switchSort('current_price_usd', 1)"
          />
        </div>
      </div>
      <!-- <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('pool_size')"
      >
        {{ $t('pool') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'pool_size', 'b')}
            `"
            @click.stop="switchSort('pool_size', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'pool_size', 't')}
            `"
            @click.stop="switchSort('pool_size', 1)"
          />
        </div>
      </div> -->
      <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('holders')"
      >
        {{ $t('holders') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'holders', 'b')}
            `"
            @click.stop="switchSort('holders', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'holders', 't')}
            `"
            @click.stop="switchSort('holders', 1)"
          />
        </div>
      </div>
      <!-- <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('tx_count_24h')"
      >
        {{ $t('Txs') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'tx_count_24h', 'b')}
            `"
            @click.stop="switchSort('tx_count_24h', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'tx_count_24h', 't')}
            `"
            @click.stop="switchSort('tx_count_24h', 1)"
          />
        </div>
      </div> -->
      <!-- <span>{{ $t('riskScore') }}</span> -->
    </div>
    <el-scrollbar
      v-if="tokens1?.length > 0 || isLoading"
      v-loading="isLoading"
      height="500px"
      max-height="calc(100vh - 200px)"
    >
      <ul class="content">
        <li v-for="(row, $index) in tokens1" :key="$index">
          <a
            href=""
            class="flex no-underline h-50p"
            @click.stop.prevent="tableRowClick(row.token + '-' + row.chain)"
          >
            <div class="text-12px">
              {{ $index < 9 ? '0' + Number($index + 1) : $index + 1 }}
            </div>
            <div class="token-info">
              <div
                v-if="getSymbolDefaultIcon(row)"
                class="icon-token-container relative"
              >
                <el-image
                  class="token-icon"
                  :src="getSymbolDefaultIcon(row)"
                  lazy
                >
                  <template #error>
                    <img
                      class="token-icon"
                      :src="getChainDefaultIcon(row.chain, row.symbol)"
                    >
                  </template>
                  <template #placeholder>
                    <img
                      class="token-icon"
                      :src="getChainDefaultIcon(row.chain, row.symbol)"
                    >
                  </template>
                </el-image>
                <img
                  v-if="row?.chain"
                  class="icon-svg icon-symbol rounded-100%"
                  :src="`${token_logo_url}chain/${row?.chain}.png`"
                  alt=""
                  srcset=""
                >
              </div>
              <div class="ml-8px">
                <div class="flex-start">
                  <span class="token-symbol">
                    {{ row.symbol }}
                    <!-- <span style="color: rgb(132, 142, 156)">({{ row.token?.slice(0,4) + '*' + row.token?.slice(-4) }})</span> -->
                  </span>
                  <div
                    v-if="row?.is_adv === 1 && row?.is_showasadv === 1"
                    class="ad-tag"
                  >
                    AD
                  </div>
                  <span
                    v-if="row.risk_level < 0 || row?.risk_score > 55"
                    class="risk-status high"
                  >
                    {{ $t('highRisk') }}
                  </span>
                  <template v-if="row?.hot_rank">
                    <svg
                      v-for="(item, index) in row?.hot_rank"
                      :key="index"
                      class="icon-svg"
                      aria-hidden="true"
                      style="margin-left: 3px; width: 12px"
                    >
                      <use xlink:href="#icon-huoyan" />
                    </svg>
                  </template>
                  <img
                    v-if="row.launchpad"
                    v-tooltip="row.launchpad"
                    class="ml-5px"
                    :src="formatIconTag(row.launchpad)"
                    alt=""
                    :width="10"
                  >
                </div>
                <div class="text-12px color-text-2 mt-3px flex-start" style="align-items:end">
                  <div v-if="row.opening_at" class="mr-5px text-10px" >
                    <TimerCount
                      v-if="
                        !isShowDate &&
                        row.opening_at &&
                        Number(formatTimeFromNow(row.opening_at, true)) < 60
                      "
                      :key="`${row.opening_at}${$Index}`"
                      :timestamp="row.opening_at"
                      :end-time="60"
                    >
                      <template #default="{ seconds }">
                        <span class="color-#FFA622">
                          <template v-if="seconds < 60">
                            {{ seconds }}s
                          </template>
                          <template v-else>
                            {{ formatTimeFromNow(row.opening_at) }}
                          </template>
                        </span>
                      </template>
                    </TimerCount>
                    <span v-else :class=" Number(formatTimeFromNow(row.opening_at, true )) <= 600 ? 'color-#FFA622' : ''">
                      {{
                        isShowDate
                          ? formatDate(row.opening_at, 'HH:mm:ss')
                          : formatTimeFromNow(row.opening_at)
                      }}
                    </span>
                  </div>
                  {{ row.token?.slice(0, 4) + '...' + row.token?.slice(-4) }}
                  <Icon
                    v-copy="row.token"
                    name="bxs:copy"
                    class="text-10px ml-2px cursor-pointer color-[--d-666-l-999] ml-4px"
                    @click.stop.prevent
                  />
                </div>
              </div>
            </div>
            <template v-if="Number(row.current_price_usd) > 0">
              <div
                :class="
                  row.tx_volume_u_24h > 0 ? 'color-[--d-F5F5F5-l-333]' : ''
                "
              >
                ${{ formatNumber(row?.tx_volume_u_24h || 0, 2) }}
              </div>
              <div>
                <span
                  :class="
                    Number(getMCap(row)) > 0 ? 'color-[--d-F5F5F5-l-333]' : ''
                  "
                  >${{ formatNumber(getMCap(row) || 0, 2) }}</span
                >
                <div class="text-12px mt-3px">
                  ${{ formatNumber(row?.pool_size || 0, 2) }}
                </div>
              </div>
              <div>
                <span
                  :class="
                    Number(row.current_price_usd) > 0
                      ? 'color-[--d-F5F5F5-l-333]'
                      : ''
                  "
                  >${{ formatNumber(row.current_price_usd || 0) }}</span
                >
                <div class="text-12px mt-3px">
                  <span
                    v-if="Number(row.price_change) > 0"
                    style="color: #12b886; padding: 10px 0"
                  >
                    +{{ formatNumber(row.price_change || 0) }}%
                  </span>
                  <span
                    v-if="Number(row.price_change) == 0"
                    style="color: #848e9c; padding: 10px 0"
                  >
                    0%
                  </span>
                  <span
                    v-if="Number(row.price_change) < 0"
                    style="color: #ff646d; padding: 10px 0"
                  >
                    {{ formatNumber(row.price_change || 0) }}%
                  </span>
                </div>
              </div>
              <div>{{ formatNumber(row?.holders || 0, { limit: 10 }) }}</div>
              <!-- <div class="text-12px color-text-2">
                {{ formatNumber(row?.tx_count_24h || 0) }}
              </div> -->
              <!-- <div
                class="flex-end"
              >
                <arc-progress
                :progress="Number(row.risk_score / 100) || 0"
                :width="40"
                :thickness="2"
                :big="false"
                :height="20"
                :textHeight="15"
                :end="true"
                class="arc-progress"
              />
              </div> -->
            </template>
            <div v-else class="flex-end">
              <!-- <count-down
                v-if="showTime"
                class="count-down mt-8"
                :time="time"
                format="DD:HH:mm:ss"

              >
                <template #default="timeData">
                  <span class="block">
                    {{
                      timeData.days < 10 ? '0' + timeData.days : timeData.days
                    }}
                  </span>
                  <span class="block ml-3">
                    {{
                      timeData.hours < 10
                        ? '0' + timeData.hours
                        : timeData.hours
                    }}
                  </span>
                  <span class="colon">:</span>
                  <span class="block">
                    {{
                      timeData.minutes < 10
                        ? '0' + timeData.minutes
                        : timeData.minutes
                    }}
                  </span>
                  <span class="colon">:</span>
                  <span class="block">
                    {{
                      timeData.seconds < 10
                        ? '0' + timeData.seconds
                        : timeData.seconds
                    }}
                  </span>
                </template>
              </count-down> -->

              <TimerCount
                v-if="row.opening_at > 0"
                :key="`${row.opening_at}${$Index}`"
                :timestamp="row.opening_at"
                :end-time="60"
              >
                <template #default="{ formattedData }">
                  <span class="color-[--d-999-l-666]">
                    {{ formattedData.days }}D {{ formattedData.hours }}H
                    {{ formattedData.minutes }}M {{ formattedData.seconds }}S
                  </span>
                </template>
              </TimerCount>
              <template v-else>
                <img
                  class="mr-5px"
                  src="@/assets/images/icon-unknown.png"
                  alt=""
                  :width="12"
                >
                {{ $t('unknownRisk') }}
              </template>
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
</template>
<script lang="ts" setup>
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
import { formatNumber } from '@/utils/formatNumber'
import type { GetHotTokensResponse } from '@/api/token'
import type { SearchHot } from '@/api/types/search'
import { getMCap } from '~/utils'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatDate,
} from '@/utils/index'
// import CountDown from './countDown.vue'
const themeStore = useThemeStore()
const props = defineProps({
  tokens: {
    type: Array<GetHotTokensResponse | SearchHot>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])
const $router = useRouter()
const { token_logo_url } = useConfigStore()

type SortValue = 0 | -1 | 1
const activeSort = shallowRef<SortValue>(0)
const sortBy = shallowRef<string>('')
const isPrice = shallowRef<boolean>(true)
const isShowDate = shallowRef<boolean>(false)

const tokens1 = computed(() => {
  const list = props.tokens?.slice(0)
  if (activeSort.value === 0 || sortBy.value === '') {
    return props.tokens
  } else if (sortBy.value == 'mcap') {
    return list?.sort(
      (a, b) => (Number(getMCap(b)) - Number(getMCap(a))) * activeSort.value
    )
  } else {
    return list?.sort(
      (a, b) =>
        ((b[sortBy.value] || 0) - (a[sortBy.value] || 0)) * activeSort.value
    )
  }
})

const isLoading = computed(() => {
  return props.loading
})
function tableRowClick(id: string) {
  $router.push({
    name: 'token-id',
    params: { id: id },
  })
  emit('close')
}
const isShowHighRisk = shallowRef(true)

function getActiveClass(
  activeSort1: SortValue,
  sortBy1: string,
  direction: string
) {
  const isEqual = activeSort.value === activeSort1 && sortBy.value === sortBy1
  if (direction === 't') {
    return isEqual ? 'border-t-[--d-F5F5F5-l-333]' : 'border-t-[--d-666-l-999]'
  }
  return isEqual ? 'border-b-[--d-F5F5F5-l-333]' : 'border-b-[--d-666-l-999]'
}
function switchSort(sortBy1: string, activeSort1?: SortValue) {
  if (sortBy.value !== sortBy1) {
    sortBy.value = sortBy1
    activeSort.value = 1
    return
  }
  // if (activeSort1) {
  //   activeSort.value = activeSort1
  //   return
  // }
  activeSort.value++
  if (activeSort.value > 1) {
    activeSort.value = -1
  }
}
</script>
<style lang="scss" scoped>
.histrory {
  font-size: 12px;
  padding-bottom: 10px;
  color: var(--d-999-l-666);
  .empty {
    color: var(--d-999-l-666);
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
      width: 40px;
      font-size: 12px;
    }
    > :nth-child(2) {
      flex: 2;
    }
    > :nth-child(3) {
      flex: 0.7;
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
    > :nth-child(8) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(9) {
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
        color: var(--d-F5F5F5-l-333);
        font-size: 14px;
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
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .icon-svg {
        width: 14px;
        position: absolute;
        bottom: 3px;
        right: 0px;
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
    a:hover {
      text-decoration: none;
      background-color: var(--d-2A2A2A-l-F2F2F2);
      opacity: 1;
    }
    li:nth-child(1) .flex {
      margin-top: 0;
    }
    .flex {
      font-size: 12px;
      // padding: 8px 0px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > :nth-child(1) {
        width: 40px;
        font-size: 12px;
      }
      > :nth-child(2) {
        flex: 2;
      }
      > :nth-child(3) {
        flex: 0.7;
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
      > :nth-child(8) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(9) {
        flex: 1;
        text-align: right;
      }
    }
    span {
      &.green {
        color: #12b886;
      }
      &.red {
        color: #ff646d;
      }
    }
  }
  a {
    color: var(--custom-font-1-color);
  }
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
