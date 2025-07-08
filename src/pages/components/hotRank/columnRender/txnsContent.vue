<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :key="activeInterval"
    v-if="activeInterval"
    :width="$f.getTextWidth($t('txns'), 50) + 80"
    align="right"
  >
    <template #header>
      <div style="display: inline-flex;align-items: center;line-height: 1;">
        <span style="background: var(--a-bg-3-color); color: #f5f5f5; margin-right: 1px; padding: 1px 2.5px;border-radius: 4px;">{{ activeInterval.toLowerCase() }}</span>
        <span>{{ $t('txns') }}</span>
      </div>
      <headSort
        :defaultSort="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].sort_dir === 'asc' ? 'ascending' : (filterForm[`tx_${activeInterval?.toLowerCase()}_count`].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder)"
      />
      <filterToolbar :isActiveFilter="isActiveFilter(`tx_${activeInterval.toLowerCase()}_count`)" :rangeTitle1="$t('nTxAddress', { n: activeInterval })" :rangeList="rangeList" @reset="handleReset(filterForm[`tx_${activeInterval.toLowerCase()}_count`])" @confirm="getRangeList" />



      <el-popover
        v-if="false"
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="350"
        trigger="click"
        v-model:visible="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter(`tx_${activeInterval?.toLowerCase()}_count`) ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('nTxAddress', { n: activeInterval }) }}</div>
            <div class="flex mt-10">
              <el-input
                :class="{ active: conditions && conditions.amount_15m_min > 0 }"
                v-model.trim.number="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                :class="{ active: conditions && conditions.amount_15m_max > 0 }"
                v-model.trim.number="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].range"
                range
                :min="0"
                size="small"
                :max="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].defaultRange[1]"
                :marks="{ 0: '0', [filterForm[`tx_${activeInterval?.toLowerCase()}_count`].defaultRange[1]]: $f.formatNumber2(filterForm[`tx_${activeInterval?.toLowerCase()}_count`].defaultRange[1], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="mt-60 flex">
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`tx_${activeInterval?.toLowerCase()}_count`])">
                <span class="filter-title">{{ $t('sort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm[`tx_${activeInterval?.toLowerCase()}_count`], 'asc')"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm[`tx_${activeInterval?.toLowerCase()}_count`].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm[`tx_${activeInterval?.toLowerCase()}_count`], 'desc')"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm[`tx_${activeInterval?.toLowerCase()}_count`])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm[`tx_${activeInterval?.toLowerCase()}_count`])"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </template>
    <template #default="{ row }">
      <div style="padding: 0 5px;">
        <div :class="!row?.[`tx_${activeInterval?.toLowerCase()}_count`] ? 'color-text-3' : ''">
          {{ row?.[`tx_${activeInterval?.toLowerCase()}_count`] > 0 ? $f.formatNumber2(row?.[`tx_${activeInterval?.toLowerCase()}_count`] || 0, 0) : 0 }}
        </div>
        <div class="text-12px color-text-2">
          <span :style="{color: '#37B270'}">{{ $f.formatNumberS(row?.[`buys_tx_${activeInterval.toLowerCase()}_count`] || 0) }}</span>/<span :style="{color: '#EB2B4B'}">{{ $f.formatNumberS(row?.[`sells_tx_${activeInterval.toLowerCase()}_count`] || 0) }}</span>
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort.vue";

export default {
  name: "txnsContent",
  components: {
    headSort
  },
  props: {
    activeInterval: {
      type: String,
      default: ''
    },
    filterForm: {
      type: Object,
      required: true
    },
    conditions: {
      type: Object,
      default: () => ({})
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
  data(){
    return {
      rangeList: [{
        label: "> 200",
        min: 200,
        max: undefined
      }, {
        label: "> 500",
        min: 500,
        max: undefined
      },{
        label: "> 1,000",
        min: 1000,
        max: undefined
      }],
    }
  },
  methods:{
    formatTxnsColor(val){
      if(val > 5000) return '#FFA622';  // >5000显示黄色
      if(val > 3000) return '#3F80F7';  // >3000显示蓝色
      if(val < 1000) return 'var(--a-text-2-color)';  // <1000显示白色
      return 'var(--a-text-2-color)';
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm[`tx_${this.activeInterval.toLowerCase()}_count`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`tx_${this.activeInterval.toLowerCase()}_count`].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm[`tx_${this.activeInterval.toLowerCase()}_count`])
    },
    handleSortChange(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      this.filterForm[`tx_${this.activeInterval?.toLowerCase()}_count`].sort_dir = sortDir;

      this.handleFilterConfirm(this.filterForm[`tx_${this.activeInterval?.toLowerCase()}_count`]);
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

.mt-10 {
  margin-top: 10px;
}

.mt-60 {
  margin-top: 60px;
}

.mb-20 {
  margin-bottom: 20px;
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

.red {
  color: v-bind("$store.getters.downColor[7]");
}

.green {
  color: v-bind("$store.getters.upColor[7]");
}

.color-text-3 {
  color: var(--a-text-3-color);
}

:deep(.el-slider) {
  --el-slider-main-bg-color: var(--a-slider-bg-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}

.color-text-2 {
  color: var(--a-text-2-color);
}
</style>