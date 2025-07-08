<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :label="$t('smarter1')"
    align="right"
    width="90"
    :key="$t('smarter1')"
    v-if="activeCategory === 'hot' || activeCategory === 'gainer' || activeCategory === 'inclusion' || activeCategory === 'cto'"
  >
    <template #header>
      <span>{{ $t('smarter1') }}</span>
      <headSort
        :defaultSort="filterForm['smarter'].sort_dir === 'asc' ? 'ascending' : (filterForm['smarter'].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder, filterForm['smarter'])"
      />
      <filterToolbar :isActiveFilter="isActiveFilter('smarter')" :rangeTitle1="`${$t('smarterBuyTxns')}`" :rangeTitle2="`${$t('smarterSellTxns')}`" @reset="handleReset(filterForm['smarter'])" @confirm="getRangeList" />
    </template>
    <template #default="{ row }">
      <!-- <div class="flex-end color-text-2" v-if="shouldShowContent(row)">
        <span :style="{color: row?.smart_money_buy_volume_24h > 0 ? $store.getters.upColor[7] : 'var(--custom-text-3-color)'}">
          ${{ $f.formatNumberS(row?.smart_money_buy_volume_24h || 0, { decimals: 1 })}}
        </span>
        /
        <span :style="{color:row?.smart_money_sell_volume_24h > 0 ? $store.getters.downColor[7] : 'var(--custom-text-3-color)'}">
          ${{ $f.formatNumberS(row?.smart_money_sell_volume_24h || 0, { decimals: 1 })}}
        </span>
      </div>
      <div class="flex-end color-text-2" v-else>
        -
      </div> -->
      <div class=" flex-end color-text-2" v-if="shouldShowContent(row)">
        <span :style="{color: row?.smart_money_buy_count_24h > 0 ? $store.getters.upColor[7] : 'var(--custom-text-3-color)'}">
          {{ $f.formatNumber2(row?.smart_money_buy_count_24h || 0,0)}}
        </span>
        /
        <span :style="{color:row?.smart_money_sell_count_24h > 0 ? $store.getters.downColor[7] : 'var(--custom-text-3-color)'}">
          {{ $f.formatNumber2(row?.smart_money_sell_count_24h || 0,0)}}
        </span>
      </div>
      <div class="flex-end color-text-2" v-else>
        -
      </div>
    </template>
  </el-table-column>
</template>

<script>

import headSort from "@/components/headSort.vue";

export default {
  name: "smarterContent",
  components: {
    headSort
  },
  props: {
    activeCategory: {
      type: String,
      default: ''
    },
    filterForm: {
      type: Object,
      required: true
    },
    isActiveFilter: {
      type: Function,
      required: true
    },
    handleSort: {
      type: Function,
      required: true
    },
    handleReset: {
      type: Function,
      required: true
    },
    handleFilterConfirm: {
      type: Function,
      required: true
    }
  },
  methods:{
    shouldShowContent(row) {
      return row?.smart_money_buy_volume_24h > 0 || 
             row?.smart_money_sell_volume_24h > 0 ||
             row?.smart_money_buy_count_24h > 0 ||
             row?.smart_money_sell_count_24h > 0;
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm[`smarter`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`smarter`].range[1] = e.max1;
      }
      if(e.min2){
        this.filterForm[`smarter`].range1[0] = e.min2;
      }
      if(e.max2){
        this.filterForm[`smarter`].range1[1] = e.max2;
      }
      this.handleFilterConfirm(this.filterForm['smarter'])
    },
    handleSortChange(sortOrder, filterItem) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      filterItem.sort_dir = sortDir;

      this.handleFilterConfirm(filterItem);
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-box {
  padding: 20px;

  &.dark {
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
  }
}

.filter-title {
  font-weight: 400;
  color: var(--a-text-1-color);
}

.flex {
  display: flex;
  align-items: center;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mt-60 {
  margin-top: 60px;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.text-10px {
  font-size: 10px;
}

.text-12px {
  font-size: 12px;
}

.font-400 {
  font-weight: 400;
}

.minor {
  font-size: 12px;
}

.clickable {
  cursor: pointer;
}

.chain-icon-sort-container {
  display: flex;
  flex-direction: column;
  margin-left: 5px;

  .icon-svg {
    width: 10px;
    height: 10px;
    fill: var(--a-text-3-color);

    &.active {
      fill: var(--custom-primary-color);
    }
  }
}

.color-text-2 {
  color: var(--a-text-2-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}
</style>