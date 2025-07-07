<template>
  <template v-if="!showRugAndChips">
    <el-table-column v-if="activeCategory === 'hot'" align="right" width="90">
      <template #header>
        <span>{{ $t('insiders') }}%</span>
        <el-popover
          placement="bottom"
          popper-class="chains-table-filter"
          title=""
          :width="350"
          trigger="click"
          v-model:visible="filterForm['insider_balance_ratio_cur'].visible"
        >
          <template #reference>
            <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter('insider_balance_ratio_cur') ? 'var(--custom-primary-color)' : ''}"></i>
          </template>
          <template #default>
            <div class="filter-box" :class="$store.state.mode">
              <div class="text-12px font-400 filter-title">{{ $t('insidersPosition1') }}%</div>
              <div class="flex mt-10">
                <el-input
                  v-model.trim.number="filterForm['insider_balance_ratio_cur'].range[0]"
                  :placeholder="$t('minor')"
                  clearable
                ></el-input>
                <span class="ml-10 mr-10">~</span>
                <el-input
                  v-model.trim.number="filterForm['insider_balance_ratio_cur'].range[1]"
                  :placeholder="$t('max1')"
                  clearable
                ></el-input>
              </div>
              <div class="mt-10 mb-20" style="padding: 0 10px;">
                <el-slider 
                  :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}" 
                  v-model="filterForm['insider_balance_ratio_cur'].range" 
                  range 
                  :min="0" 
                  size="small" 
                  :max="filterForm['insider_balance_ratio_cur'].defaultRange[1]" 
                  :marks="{ 0: '0', [filterForm['insider_balance_ratio_cur'].defaultRange[1]]: $f.formatNumber2([filterForm['insider_balance_ratio_cur'].defaultRange[1]], 0, 4, 10 ** 4) }" 
                />
              </div>
              <div class="mt-60 flex">
                <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`insider_balance_ratio_cur`])">
                  <span class="filter-title">{{ $t('sort') }}</span>
                  <div class="chain-icon-sort-container">
                    <svg
                      class="icon-svg"
                      aria-hidden="true"
                      :class="filterForm['insider_balance_ratio_cur'].sort_dir === 'asc' ? 'active' : ''" 
                      @click.stop="handleSort(filterForm['insider_balance_ratio_cur'], 'asc')"
                    >
                      <use xlink:href="#icon-sort-up"></use>
                    </svg>
                    <svg
                      class="icon-svg"
                      aria-hidden="true"
                      :class="filterForm['insider_balance_ratio_cur'].sort_dir === 'desc' ? 'active' : ''" 
                      @click.stop="handleSort(filterForm['insider_balance_ratio_cur'], 'desc')"
                    >
                      <use xlink:href="#icon-sort-down"></use>
                    </svg>
                  </div>
                </div>
                <el-button 
                  size="default" 
                  style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;" 
                  :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"    
                  @click.stop="handleReset(filterForm['insider_balance_ratio_cur'])"
                >
                  {{ $t('reset') }}
                </el-button>
                <el-button 
                  size="default" 
                  :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'" 
                  style="height: 30px; min-width: 70px;--el-button-font-weight: 400;" 
                  @click.stop="handleFilterConfirm(filterForm['insider_balance_ratio_cur'])"
                >
                  {{ $t('confirm') }}
                </el-button>
              </div>
            </div>
          </template>
        </el-popover>
      </template>
      <template #default="{ row }">
        <span :class="Number(row?.insider_balance_ratio_cur || 0) < 0.1 ? 'color-text-3' : (row?.insider_balance_ratio_cur >10  ? 'color-FFA622' : '')">
          {{ row?.insider_balance_ratio_cur >0  && row?.insider_balance_ratio_cur < 0.1  ? '<0.1' : $f.formatNumberS(row?.insider_balance_ratio_cur || 0) }}%
        </span>
      </template>
    </el-table-column>
  </template>
</template>

<script>

export default {
  name: "insidersContent",
  props: {
    showRugAndChips: {
      type: Boolean,
      default: false
    },
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