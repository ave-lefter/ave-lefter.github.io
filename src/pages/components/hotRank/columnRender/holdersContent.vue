<template>
  <el-table-column
    :label="$t('holders')"
    align="right"
    :width="$f.getTextWidth($t('holders'), 50) + 40"
  >
    <template #header>
      <span>
        {{ $t('holders') }}
        <headSort
          :defaultSort="filterForm['holders'].sort_dir === 'asc' ? 'ascending' : (filterForm['holders'].sort_dir === 'desc' ? 'descending' : '')"
          @sort-change="(sortOrder) => handleSortChange(sortOrder)"
        />
      </span>
      <filterToolbar
        :isActiveFilter="isActiveFilter('holders')"
        :rangeTitle1="$t('holders')"
        :rangeList="rangeList"
        @reset="handleResetList"
        @confirm="getRangeList"
      />
    </template>
    <template #default="{ row }">
      <span :style="{color: formatColor(row)}">
        {{ $f.formatNumber2(row?.holders || 0) }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";

export default {
  name: "holdersContent",
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
        label: "< 100",
        min: undefined,
        max: 100
      }, {
        label: "< 1000",
        min: undefined,
        max: 1000
      }, {
        label: "< 10000",
        min: undefined,
        max: 10000
      }],
    }
  },
  methods: {
    formatColor(row) {
      const holders = row?.holders || 0;
      const tokenAge = this.getTokenAge(row?.created_at);
      
      if ((holders > 1000 && tokenAge < 86400) || 
          (holders > 10000 && tokenAge < 604800)) {
        return '#FFA622'; 
      }
      
      return 'var(--a-text-2-color)';
    },
    getTokenAge(listingTime) {
      if (!listingTime) return Infinity;
      const listingDate = new Date(listingTime);
      const now = new Date();
      return Math.floor((now - listingDate) / 1000);
    },
    handleSortChange(sortOrder) {
      this.handleSort(this.filterForm['holders'], sortOrder === 'ascending' ? 'asc' : (sortOrder === 'descending' ? 'desc' : ''));
      this.handleFilterConfirm(this.filterForm['holders']);
    },
    handleResetList() {
      this.handleReset(this.filterForm['holders']);
    },
    getRangeList(e) {
      if(e.min1) {
        this.filterForm['holders'].range[0] = e.min1;
      }
      if(e.max1) {
        this.filterForm['holders'].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm['holders']);
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

.color-text-2 {
  color: var(--a-text-2-color);
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