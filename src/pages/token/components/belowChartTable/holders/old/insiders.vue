<template>
  <div class="insiders">
    <div class="top mt-10px">
      <div>
        <div class="item">
          <div class="tl">
            <span
              >{{ $t('insidersBalance') }}&nbsp;&nbsp;{{
                $t('insidersPosition')
              }}</span
            >
            <div class="flex-start">
              ${{ formatNumber(insidersObj?.balance, 0) }}&nbsp;&nbsp;
              {{
                insidersObj?.balance_ratio_cur
                  ? formatNumber(insidersObj?.balance_ratio_cur * 100 || 0, 2) +
                    '%'
                  : 0
              }}
              <span class="color-878FBC">/</span>
              {{
                insidersObj?.balance_ratio_max
                  ? formatNumber(insidersObj?.balance_ratio_max * 100, 2) + '%'
                  : 0
              }}
            </div>
          </div>
          <div class="tr">
            <span>{{ $t('insidersBuyOrSell') }}</span>
            <div class="flex-end">
              <span :style="{ color: upColor[0] }">
                ${{ formatNumber(insidersObj?.vol_buy || 0, 2) }}
              </span>
              <span class="color-878FBC">/</span>
              <span :style="{ color: downColor[0] }">
                ${{ formatNumber(insidersObj?.vol_sell, 2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10px">
        <div class="item">
          <div class="tl">
            <span class="block">{{ $t('snipersAddress') }}</span>
            <div class="flex-start">
              {{
                insidersObj?.unsettled_addresses
                  ? formatNumber(insidersObj?.unsettled_addresses || 0, 2)
                  : 0
              }}
              <span class="color-878FBC">/</span>
              {{
                insidersObj?.all_addresses
                  ? formatNumber(insidersObj?.all_addresses, 2)
                  : 0
              }}
            </div>
          </div>
          <div class="tr">
            <span class="block">{{ $t('insidersProfit') }}</span>
            <span
              :style="{
                color: insidersObj?.vol_profit > 0 ? upColor[0] : downColor[0],
              }"
            >
              ${{ formatNumber(insidersObj?.vol_profit || 0, 2) }}
              <template v-if="insidersObj?.vol_profit_ratio">
                ({{
                  formatNumber(insidersObj?.vol_profit_ratio * 100 || 0, 2)
                }}%)
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="list mt-10px">
      <div class="flex">
        <div class="tabs" style="margin-right: auto">
          <template v-for="(item, index) in tabs" :key="index">
            <input
              :id="`tab-item-${item.id}`"
              v-model="tabActive"
              type="radio"
              :value="item.id"
              class="tab-radio-input"
            >
            <label :for="`tab-item-${item.id}`" class="tab-item">
              {{ item.name }}
            </label>
          </template>
        </div>
        <el-checkbox
          v-if="type === '19' && tabActive === 'holder'"
          v-model="isCleared"
          class="checkbox-old"
          style="
            --van-checkbox-label-color: #878ebe;
            --van-checkbox-label-margin: 5px;
            font-size: 12px;
            margin-right: 15px;
          "
          icon-size="14px"
          >{{ $t('cleared') }}</el-checkbox
        >
      </div>
    </div>
    <InsidersHold
      v-if="tabActive === 'holder'"
      :tableList="tableDataHold1"
      :loading="loadingHold"
      :type="type"
    />
    <InsidersActivity
      v-else
      :tableList="tableDataActivity"
      :loading="loadingActivity"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
import { upColor, downColor } from '@/utils/constants'
import InsidersHold from './insidersHold.vue'
import InsidersActivity from './insidersActivity.vue'
import {
  _getAllTagsHoldList,
  _getAllTagsActivityList,
  type Hold,
  type Activity,
} from '@/api/holders'
const { t } = useI18n()
const props = defineProps({
  insidersObj: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: 'insiders',
  },
})
const route = useRoute()
const tabActive = shallowRef<string>('holder')
const isCleared = shallowRef<boolean>(false)

const tableDataHold = shallowRef<Hold[]>([])
const loadingHold = shallowRef<boolean>(false)

const tableDataActivity = shallowRef<Activity[]>([])
const loadingActivity = shallowRef<boolean>(false)

const { insidersObj, type } = toRefs(props)
const tabs = computed(() => {
  return [
    {
      name: t('insidersHoldings'),
      id: 'holder',
    },
    {
      name: t('insidersActivity'),
      id: 'dongtai',
    },
  ]
})
const id = computed(() => {
  return route.params.id as string
})
const tableDataHold1 = computed(() => {
  if (type.value === '19' && isCleared.value) {
    return (
      tableDataHold?.value?.filter?.(
        (i) => !(i?.balance_ratio > 0 && i?.balance > 0)
      ) || []
    )
  }
  return tableDataHold.value
})

watch(
  () => id.value,
  () => {
    init()
  }
)
watch(tabActive, () => {
  init()
})
watch(type, () => {
  init()
})
function init() {
  if (type.value !== '100' && tabActive.value == 'holder') {
    getAllTagsHoldList()
  }
  if (type.value !== '100' && tabActive.value == 'dongtai') {
    getAllTagsActivityList()
  }
}
function getAllTagsHoldList() {
  loadingHold.value = true
  const paramas = {
    token_id: id.value,
    type: type.value,
  }
  _getAllTagsHoldList(paramas)
    .then((res) => {
      tableDataHold.value = Array.isArray(res) ? res : []
    })
    .catch(() => {})
    .finally(() => {
      loadingHold.value = false
    })
}

function getAllTagsActivityList() {
  loadingActivity.value = true
  const paramas = {
    token_id: id.value,
    type: type.value,
  }
  _getAllTagsActivityList(paramas)
    .then((res) => {
      tableDataActivity.value = Array.isArray(res) ? res.map(i => ({
              ...i,
              time:
                i?.time !== '1970-01-01T00:00:00Z' && i?.time !== '0001-01-01T00:00:00Z'
                  ? new Date(i?.time).getTime() / 1000
                  : 0,
              volume:
                i?.type === 'ADD' || i?.type === 'REMOVE'
                  ? i?.quote_token_amount * i.quote_token_price_u +
                    i?.base_token_amount * i?.base_token_price_u
                  : i?.base_token_amount * i?.base_token_price_u
            })) : []
    })
    .catch(() => {})
    .finally(() => {
      loadingActivity.value = false
    })
}
</script>

<style lang="scss" scoped>
.insiders {
  .top {
    & > div {
      border-radius: 4px;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--secondary-text);
        .color-878FBC {
          color: var(--secondary-text);
        }
        .tr {
          text-align: right;
        }
        .tl {
          text-align: left;
        }
        span {
          &:first-child {
            color: var(--secondary-text);
            display: block;
            font-size: 11px;
            line-height: 16px;
          }
        }
      }
    }
  }
  .list {
    .tabs {
      padding: 10px 0;
      .tab-radio-input {
        width: 0;
        height: 0;
        font-size: 0;
        opacity: 0;
        &:checked + .tab-item {
          border-radius: 4px;
          color: var(--d-FFF-l-000);
        }
      }
      .tab-item {
        color: #787b86;
        background: var(--d-1F242A-l-F5F5F5);
        font-size: 12px;
        letter-spacing: 0;
        line-height: 16px;
        font-weight: 500;
        padding: 5px 8px;
        & ~ .tab-item {
          margin-left: 15px;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
