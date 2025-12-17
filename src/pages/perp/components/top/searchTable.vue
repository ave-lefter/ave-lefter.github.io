<template>
  <div class="histrory">
    <div class="top h-39px">
      <span>{{ $t('markets1') }}</span>
      <div class="flex-end cursor-pointer select-none" @click.stop="switchSort('lastPrice')">
        {{ $t('price') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'lastPrice', 'b')}
            `"
            @click.stop="switchSort('lastPrice', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'lastPrice', 't')}
            `"
            @click.stop="switchSort('lastPrice', 1)"
          />
        </div>
      </div>
      <div class="flex-end cursor-pointer select-none" @click.stop="switchSort('priceChangePercent')">
        {{ $t('24HChange') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'priceChangePercent', 'b')}
            `"
            @click.stop="switchSort('priceChangePercent', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'priceChangePercent', 't')}
            `"
            @click.stop="switchSort('priceChangePercent', 1)"
          />
        </div>
      </div>
      <div
        class="flex-end cursor-pointer select-none"
        @click.stop="switchSort('size')"
      >
        {{ $t('amountB') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'size', 'b')}
            `"
            @click.stop="switchSort('size', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'size', 't')}
            `"
            @click.stop="switchSort('size', 1)"
          />
        </div>
      </div>
      <div class="flex-end cursor-pointer select-none" @click.stop="switchSort('openInterest')">
        {{ $t('openInterest') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'openInterest', 'b')}
            `"
            @click.stop="switchSort('openInterest', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'openInterest', 't')}
            `"
            @click.stop="switchSort('openInterest', 1)"
          />
        </div>
      </div>
      <div class="flex-end cursor-pointer select-none" @click.stop="switchSort('fundingRate')">
        {{ $t('fundingRate') }}
        <div class="flex flex-col items-center justify-center ml-5px">
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1, 'fundingRate', 'b')}
            `"
            @click.stop="switchSort('fundingRate', -1)"
          />
          <i
            :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1, 'fundingRate', 't')}
            `"
            @click.stop="switchSort('fundingRate', 1)"
          />
        </div>
      </div>
    </div>
    <el-scrollbar
      v-if="tokens1?.length > 0 || isLoading"
      class="hidden-scrollbar"
      v-loading="isLoading"
      height="500px"
      max-height="calc(100vh - 200px)"
    >
      <ul class="content">
        <li v-for="(row, $index) in tokens1" :key="$index">
          <a
            href=""
            class="flex no-underline h-50p"
            @click.stop.prevent="tableRowClick(row)"
          >
            <div class="token-info">
              <div class="icon-token-container relative">
                <el-image class="token-icon" :src="row?.baseCoinIcon">
                  <template #error>
                    <img class="token-icon" :src="getChainDefaultIcon()" />
                  </template>
                  <template #placeholder>
                    <img class="token-icon" :src="getChainDefaultIcon()" />
                  </template>
                </el-image>
              </div>
              <div class="ml-8px">
                <div class="flex-start">
                  <span class="token-symbol">
                    {{ row.contractName }}
                  </span>
                  <span
                    class="bg-[--dialog-tab-active-bg] text-10px px-2px py-2px ml-4px rounded-2px color-[--main-text]"
                    >{{ row.displayMaxLeverage }}X</span
                  >
                </div>
              </div>
            </div>
            <div :class="Number(row?.lastPrice ) > 0 ? 'color-[--main-text]' : ''">
              {{ formatNumber(row.lastPrice || 0, 2) }}
            </div>
            <div :class="Number(row.priceChangePercent )> 0 ? 'color-[--up-color]' : 'color-[--down-color]'">
              {{ formatNumber( Number(row?.priceChangePercent) * 100 || 0, 2) }}%
            </div>
            <div :class="Number(row.value ) > 0 ? 'color-[--main-text]' : ''">
              ${{ formatNumber(row?.value || 0, 2) }}
            </div>
            <div :class="Number(row.openInterest) > 0 ? 'color-[--main-text]' : ''">
              ${{ formatNumber(row?.openInterest || 0, 2) }}
            </div>
            <div :class="Number(row.fundingRate)> 0 || Number(row.fundingInterestRate) > 0 ?'color-[--main-text]' : ''">{{ formatNumber( Number(row?.fundingRate || row.fundingInterestRate)* 100 || 0)}}%
            </div>
          </a>
        </li>
      </ul>
    </el-scrollbar>
    <div v-if="!isLoading && !tokens?.length" class="empty">
      <div>
        <img :src="themeStore.theme === 'light' ? emptyWhite : emptyDark" />
        <br />
        <span>{{ $t('noSearchResults') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
import { formatNumber } from '@/utils/formatNumber'


import { getChainDefaultIcon } from '@/utils/index'
import type { PerpInfo } from '@/api/types/perp'


const themeStore = useThemeStore()
const props = defineProps({
  tokens: {
    type:  Array as () => PerpInfo[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isCanFilter: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close', 'filter', 'sortChange', 'done'])
const $router = useRouter()


type SortValue = 0 | -1 | 1
const activeSort = shallowRef<SortValue>(1)
const sortBy = shallowRef<string>('value')


const tokens1 = computed(() => {
  const list = props.tokens?.slice(0)
  if (activeSort.value === 0 || sortBy.value === '') {
    return props.tokens
  } else {
    return list?.sort(
      (a, b) => ((b[sortBy.value] || 0) - (a[sortBy.value] || 0)) * activeSort.value
    )
  }
})

const isLoading = computed(() => {
  return props.loading
})
function tableRowClick(row: PerpInfo) {
  $router.push({
    name: 'perp-id',
    params: { name: row.contractName },
  })
  emit('close')
}

function getActiveClass(activeSort1: SortValue, sortBy1: string, direction: string) {
  const isEqual = activeSort.value === activeSort1 && sortBy.value === sortBy1
  if (direction === 't') {
    return isEqual ? 'border-t-[--main-text]' : 'border-t-[--third-text]'
  }
  return isEqual ? 'border-b-[--main-text]' : 'border-b-[--third-text]'
}
function switchSort(sortBy1: string, activeSort1?: SortValue) {
  if (sortBy.value !== sortBy1) {
    sortBy.value = sortBy1
    activeSort.value = 1
    emit('sortChange', { prop: sortBy.value, order: activeSort.value })
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
  emit('sortChange', { prop: sortBy.value, order: activeSort.value })
}
</script>
<style lang="scss" scoped>
.histrory {
  font-size: 12px;
  padding-bottom: 10px;
  color: var(--secondary-text);
  .empty {
    color: var(--third-text);
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
    color: var(--third-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    > :nth-child(1) {
      flex: 2;
    }
    > :nth-child(2) {
      flex: 1;
      text-align: right;
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
        background-color: var(--border);
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
        color: var(--main-text);
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
      background-color: var(--border);
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
        flex: 2;
      }
      > :nth-child(2) {
        flex: 1;
        text-align: right;
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
