<template>
  <el-table-column align="right" width="100">
    <template #header>
      <span>{{ $t('snipers') }}</span>

      <headSort
        :defaultSort="filterForm['sniper_tx_count'].sort_dir === 'asc' ? 'ascending' : (filterForm['sniper_tx_count'].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder)"
      />

      <filterToolbar
        :isActiveFilter="isActiveFilter('sniper_tx_count')"
        :rangeTitle1="`${$t('snipers')}`"
        :rangeList="rangeList"
        @reset="handleReset(filterForm['sniper_tx_count'])"
        @confirm="getRangeList"
      />

      <el-popover
        v-if="false"
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="350"
        trigger="click"
        v-model:visible="filterForm['sniper_tx_count'].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter('sniper_tx_count') ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('snipers') }}</div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm['sniper_tx_count'].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm['sniper_tx_count'].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm['sniper_tx_count'].range"
                range
                :min="0"
                size="small"
                :max="filterForm['sniper_tx_count'].defaultRange[1]"
                :marks="{ 0: '0', [filterForm['sniper_tx_count'].defaultRange[1]]: $f.formatNumber2([filterForm['sniper_tx_count'].defaultRange[1]], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="mt-60 flex">
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm['sniper_tx_count'])">
                <span class="filter-title">{{ $t('sort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['sniper_tx_count'].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['sniper_tx_count'], 'asc')"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['sniper_tx_count'].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['sniper_tx_count'], 'desc')"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm['sniper_tx_count'])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm['sniper_tx_count'])"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </template>
    <template #default="{ row }">
      <span :class="Number(row?.sniper_tx_count || 0) < 5 ? 'color-text-3' : ''" :style="{color: formatColor(Number(row?.sniper_tx_count || 0))}">
        {{ $f.formatNumberS(row?.sniper_tx_count || 0) }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";

export default {
  name: "snipersContent",
  components: {
    headSort
  },
  props: {
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
  data() {
    return {
      rangeList: [{
        label: "< 10",
        min: undefined,
        max: 10
      }, {
        label: "< 50",
        min: undefined,
        max: 50
      },{
        label: "< 100",
        min: undefined,
        max: 100
      }],
    }
  },
  methods: {
    formatColor(val){
      if(val > 30) return '#EB2B4B';
      return 'var(--a-text-2-color)';
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm['sniper_tx_count'].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm['sniper_tx_count'].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm['sniper_tx_count'])
    },
    // 处理排序变化的方法
    handleSortChange(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      // 更新排序方向
      this.filterForm['sniper_tx_count'].sort_dir = sortDir;

      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['sniper_tx_count']);
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

:deep(.el-slider) {
  --el-slider-main-bg-color: var(--a-slider-bg-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}
</style>