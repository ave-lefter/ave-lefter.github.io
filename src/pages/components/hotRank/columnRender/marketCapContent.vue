<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :label="$t('mCap')"
    align="right"
    :width="$f.getTextWidth($t('mCap'), 50) + 40"
  >
    <template #header>
      <span>
        {{ $t('mCap') }}
        <headSort
          :defaultSort="filterForm['market_cap'].sort_dir === 'asc' ? 'ascending' : (filterForm['market_cap'].sort_dir === 'desc' ? 'descending' : '')"
          @sort-change="(sortOrder) => handleSortChange(sortOrder)"
        />
      </span>
      <filterToolbar
        :isActiveFilter="isActiveFilter('market_cap')"
        :rangeTitle1="$t('mCap')"
        :rangeList="rangeList"
        @reset="handleResetList"
        @confirm="getRangeList"
      />
    </template>
    <template #default="{ row }">
      <div class="flex-end">
        <span :style="{color: getMarketCapColor(row)}">
          ${{ $f.formatNumberS(row?.market_cap || 0) }}
        </span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";

export default {
  name: "marketCapContent",
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
        label: "< 1M",
        min: undefined,
        max: 1000000
      }, {
        label: "< 10M",
        min: undefined,
        max: 10000000
      }, {
        label: "> 10M",
        min: 10000000,
        max: undefined
      }],
    }
  },
  methods: {
    getTokenAge(listingTime) {
      if (!listingTime) return Infinity;
      const listingDate = new Date(listingTime);
      const now = new Date();
      return Math.floor((now - listingDate) / 1000);
    },
    getMarketCapColor(row) {
      if (!row?.market_cap) return 'var(--a-text-3-color)';
      
      const marketCap = row.market_cap;
      const tokenAge = this.getTokenAge(row?.created_at);
      console.log('marketCap', marketCap);
      console.log('tokenAge 🍷', tokenAge);
      
      // 币龄小于1天且市值大于100万，或币龄小于7天且市值大于1000万
      if ((tokenAge < 86400 && marketCap > 1000000) || 
          (tokenAge < 604800 && marketCap > 10000000)) {
        return '#FFA622'; // 黄色
      }
      
      return 'var(--a-text-1-color)'; // 白色
    },
    handleSortChange(sortOrder) {
      this.handleSort(this.filterForm['market_cap'], sortOrder === 'ascending' ? 'asc' : (sortOrder === 'descending' ? 'desc' : ''));
      this.handleFilterConfirm(this.filterForm['market_cap']);
    },
    handleResetList() {
      this.handleReset(this.filterForm['market_cap']);
    },
    getRangeList(e) {
      if(e.min1) {
        this.filterForm['market_cap'].range[0] = e.min1;
      }
      if(e.max1) {
        this.filterForm['market_cap'].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm['market_cap']);
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