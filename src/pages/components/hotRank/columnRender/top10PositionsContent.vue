<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :key="activeCategory || $t('top10Positions')"
    :label="$t('top10Positions')"
    align="right"
    :width="$f.getTextWidth($t('top10Positions'), 50) + 40"
  >
    <template #header>
      <span>
        {{$t('top10')}}
        <headSort
          :defaultSort="filterForm['holders_top10_ratio'].sort_dir === 'asc' ? 'ascending' : (filterForm['holders_top10_ratio'].sort_dir === 'desc' ? 'descending' : '')"
          @sort-change="(sortOrder) => handleSortChange1(sortOrder)"
        />
         <!-- <span>/ DEV</span> -->
        </span>

      <!-- 添加排序组件到表头 -->
      <!-- <headSort
        :defaultSort="filterForm['dev_balance_ratio_cur'].sort_dir === 'asc' ? 'ascending' : (filterForm['dev_balance_ratio_cur'].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange2(sortOrder)"
      /> -->

      <filterToolbar
        :isActiveFilter="isActiveFilter('holders_top10_ratio')||isActiveFilter('dev_balance_ratio_cur')"
        :rangeTitle1="`${$t('top10Positions')}`"
        :rangeList="rangeList"
        @reset="handleResetList"
        @confirm="getRangeList"
      />

      <el-popover
        v-if="false"
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="350"
        trigger="click"
        v-model:visible="filterForm['holders_top10_ratio'].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter('holders_top10_ratio') ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('top10Positions') }}</div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm['holders_top10_ratio'].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm['holders_top10_ratio'].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm['holders_top10_ratio'].range"
                range
                :min="0"
                size="small"
                :max="filterForm['holders_top10_ratio'].defaultRange[1]"
                :marks="{ 0: '0', [filterForm['holders_top10_ratio'].defaultRange[1]]: $f.formatNumber2([filterForm['holders_top10_ratio'].defaultRange[1]], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="mt-60 flex">
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`holders_top10_ratio`])">
                <span class="filter-title">{{ $t('sort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['holders_top10_ratio'].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['holders_top10_ratio'], 'asc')"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['holders_top10_ratio'].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['holders_top10_ratio'], 'desc')"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm['holders_top10_ratio'])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm['holders_top10_ratio'])"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </template>
    <template #default="{ row }">
      <span :style="{color: formatColor(row?.holders_top10_ratio)}" :class="Number(row?.holders_top10_ratio || 0) <0.1 ? 'color-text-3' : (row?.holders_top10_ratio >10  ? 'color-FFA622' : '')">
        {{ row?.holders_top10_ratio >0  && row?.holders_top10_ratio < 0.1  ? '<0.1' : $f.formatNumberS(row?.holders_top10_ratio || 0) }}%
      </span>
      <!-- <span class="separator-line">/ </span>
        <span :style="{color: row?.dev_balance_ratio_cur > 10 ? '#EB2B4B' : ''}" :class="Number(row?.dev_balance_ratio_cur || 0) < 0.1 ? 'color-text-3' : (row?.dev_balance_ratio_cur >10  ? 'color-FFA622' : '')">
        {{ row?.dev_balance_ratio_cur >0  && row?.dev_balance_ratio_cur < 0.1 ? '<0.1' : $f.formatNumberS(row?.dev_balance_ratio_cur || 0) }}%
      </span> -->
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort.vue";

export default {
  name: "top10PositionsContent",
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
  data(){
    return {
      rangeList: [{
        label: "< 10%",
        min: undefined,
        max: 10
      }, {
        label: "< 30%",
        min: undefined,
        max: 30
      },{
        label: "< 50%",
        min: undefined,
        max: 50
      }],
    }
  },
  methods: {
    formatColor(val){
      if(val >= 30) return '#FFA622';
      return 'var(--a-text-2-color)';
    },
    handleResetList(){
      this.handleReset(this.filterForm['holders_top10_ratio']);
      this.handleReset(this.filterForm['dev_balance_ratio_cur']);
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm[`holders_top10_ratio`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`holders_top10_ratio`].range[1] = e.max1;
      }
      if(e.min2){
        this.filterForm[`dev_balance_ratio_cur`].range[0] = e.min2;
      }
      if(e.max2){
        this.filterForm[`dev_balance_ratio_cur`].range[1] = e.max2;
      }
      this.handleFilterConfirm(this.filterForm[`holders_top10_ratio`]);
      this.handleFilterConfirm(this.filterForm[`dev_balance_ratio_cur`]);
    },
    handleSortChange1(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }
      // 更新排序方向
      this.filterForm['holders_top10_ratio'].sort_dir = sortDir;
      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['holders_top10_ratio']);
    },
    // 处理排序变化的方法
    handleSortChange2(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }
      // 更新排序方向
      this.filterForm['dev_balance_ratio_cur'].sort_dir = sortDir;
      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['dev_balance_ratio_cur']);
    }
  }
}
</script>

<style lang="scss" scoped>

.separator-line {
  color: var(--a-border-color, #444);
  font-size: 14px;
}
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

.color-text-3 {
  color: var(--a-text-3-color);
}

.color-FFA622 {
  color: #FFA622;
}

:deep(.el-slider) {
  --el-slider-main-bg-color: var(--a-slider-bg-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}
</style>
