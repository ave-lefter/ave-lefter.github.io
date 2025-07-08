<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :key="activeInterval"
    v-if="activeInterval"
    :width="$f.getTextWidth($t('markers'), 50) + 70"
    align="right"
  >
    <template #header>
      <div style="display: inline-flex;align-items: center;line-height: 1;">
        <span style="background: var(--a-bg-3-color); color: #f5f5f5; margin-right: 1px; padding: 1px 2.5px;border-radius: 4px;">{{ activeInterval.toLowerCase() }}</span>
        <span>{{ $t('markers') }}</span>
      </div>

      <headSort
        :defaultSort="filterForm[`makers_${activeInterval?.toLowerCase()}`].sort_dir === 'asc' ? 'ascending' : (filterForm[`makers_${activeInterval?.toLowerCase()}`].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder)"
      />

      <filterToolbar
        :isActiveFilter="isActiveFilter(`makers_${activeInterval?.toLowerCase()}`)"
        :rangeTitle1="`${$t('nMarkers', { n: activeInterval })}`"
        :rangeList="rangeList"
        @reset="handleReset(filterForm[`makers_${activeInterval?.toLowerCase()}`])"
        @confirm="getRangeList"
      />

      <el-popover
        v-if="false"
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="350"
        trigger="click"
        v-model:visible="filterForm[`makers_${activeInterval?.toLowerCase()}`].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter(`makers_${activeInterval?.toLowerCase()}`) ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('nMarkers', { n: activeInterval }) }}</div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm[`makers_${activeInterval?.toLowerCase()}`].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm[`makers_${activeInterval?.toLowerCase()}`].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm[`makers_${activeInterval?.toLowerCase()}`].range"
                range
                :min="0"
                size="small"
                :max="filterForm[`makers_${activeInterval?.toLowerCase()}`].defaultRange[1]"
                :marks="{ 0: '0', [filterForm[`makers_${activeInterval?.toLowerCase()}`].defaultRange[1]]: $f.formatNumber2(filterForm[`makers_${activeInterval?.toLowerCase()}`].defaultRange[1], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="mt-60 flex">
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`makers_${activeInterval?.toLowerCase()}`])">
                <span class="filter-title">{{ $t('sort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm[`makers_${activeInterval?.toLowerCase()}`].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm[`makers_${activeInterval?.toLowerCase()}`], 'asc')"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm[`makers_${activeInterval?.toLowerCase()}`].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm[`makers_${activeInterval?.toLowerCase()}`], 'desc')"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm[`makers_${activeInterval?.toLowerCase()}`])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm[`makers_${activeInterval?.toLowerCase()}`])"
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
        <div :style="{color: getHoldersColor(row?.[`makers_${activeInterval?.toLowerCase()}`] || 0)}">
          {{ row?.[`makers_${activeInterval?.toLowerCase()}`] > 0 ? $f.formatNumber2(row?.[`makers_${activeInterval?.toLowerCase()}`] || 0, 0) : 0 }}
        </div>
        <div class="text-12px color-text-2">
          <span :style="{color: getDetailColor(row?.[`makers_${activeInterval?.toLowerCase()}`] || 0, true)}">
            {{ $f.formatNumberS(row?.[`buyers_${activeInterval.toLowerCase()}`] || 0) }}
          </span>/<span :style="{color: getDetailColor(row?.[`makers_${activeInterval?.toLowerCase()}`] || 0, false)}">
            {{ $f.formatNumberS(row?.[`sellers_${activeInterval.toLowerCase()}`] || 0) }}
          </span>
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort.vue";

export default {
  name: "markersContent",
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
        label: "> 300",
        min: 300,
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
  methods: {
    getHoldersColor(holders) {
      return holders >= 1000 ? '#FFA622' : 'var(--a-text-3-color)';
    },
    getDetailColor(holders, isBuyer) {
      if (holders < 1000) return 'var(--a-text-3-color)';
      return isBuyer ? this.$store.getters.upColor[7] : this.$store.getters.downColor[7];
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm[`makers_${this.activeInterval.toLowerCase()}`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`makers_${this.activeInterval.toLowerCase()}`].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm[`makers_${this.activeInterval.toLowerCase()}`])
    },
    handleSortChange(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      this.filterForm[`makers_${this.activeInterval?.toLowerCase()}`].sort_dir = sortDir;

      this.handleFilterConfirm(this.filterForm[`makers_${this.activeInterval?.toLowerCase()}`]);
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

.color-text-2 {
  color: var(--a-text-2-color);
}

:deep(.el-slider) {
  --el-slider-main-bg-color: var(--a-slider-bg-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}
</style>