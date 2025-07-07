<!-- eslint-disable vue/no-mutating-props -->
<template>
  <template v-if="!showRugAndChips">
    <el-table-column
      align="right"
      width="90"
      v-if="activeCategory === 'hot'"
    >
      <template #header>
        <span>{{ $t('insiders') }}%</span>
        <headSort
          :defaultSort="filterForm['insider_balance_ratio_cur'].sort_dir === 'asc' ? 'ascending' : (filterForm['insider_balance_ratio_cur'].sort_dir === 'desc' ? 'descending' : '')"
          @sort-change="(sortOrder) => handleSortChange(sortOrder, filterForm['insider_balance_ratio_cur'])"
        />
        <filterToolbar 
          :isActiveFilter="isActiveFilter('insider_balance_ratio_cur')" 
          :rangeTitle1="`${$t('insidersPosition1')}%`"
          @reset="handleReset(filterForm['insider_balance_ratio_cur'])" 
          @confirm="getRangeList" 
        />
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
import headSort from "@/components/headSort/index.vue";

export default {
  name: "insidersContentNew",
  components: {
    headSort,
  },
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
  },
  methods:{
    getRangeList(e){
      if(e.min1){
        this.filterForm[`insider_balance_ratio_cur`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`insider_balance_ratio_cur`].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm['insider_balance_ratio_cur'])
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

.color-text-3 {
  color: var(--a-text-3-color);
}

.color-FFA622 {
  color: #FFA622;
}
</style>