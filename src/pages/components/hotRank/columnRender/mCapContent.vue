<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :label="$t('mCap') + '/' + $t('price')"
    align="right"
    width="140"
  >
    <template #header>
      <span>
        
        <!-- {{ $t('price')}}
        <span>/</span> -->

        {{ $t('mCap')}}
        <headSort
          :defaultSort="filterForm['market_cap'].sort_dir === 'asc' ? 'ascending' : (filterForm['market_cap'].sort_dir === 'desc' ? 'descending' : '')"
          @sort-change="(sortOrder) => handleSortChange(sortOrder)"
        />
      </span>

      <filterToolbar
        :isActiveFilter="isActiveFilter('market_cap')"
        :rangeTitle1="`${$t('mCap')}($)`"
        :rangeList="rangeList"
        @reset="handleReset(filterForm['market_cap'])"
        @confirm="getRangeList"
      />
    </template>
    <template #default="{ row }">
      <div>
        <div :style="{color: getMarketCapColor(row)}" :class="!row.market_cap ? 'color-text-3' : ''">${{ $f.formatNumberS(row.market_cap || 0) }}</div>
        <!-- <div class="text-12px color-text-2">${{ $f.formatNumber2(row.current_price_usd || 0, 3) }}</div> -->
      </div>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";

export default {
  name: "priceMarketCapContent",
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
        label: "> $100K",
        min: 100000,
        max: undefined
      }, {
        label: "> $300K",
        min: 300000,
        max: undefined
      },{
        label: "> $1M",
        min: 1000000,
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
      
      // 币龄小于1天且市值大于100万，或币龄小于7天且市值大于1000万
      if ((tokenAge < 86400 && marketCap > 1000000) || 
          (tokenAge < 604800 && marketCap > 10000000)) {
        return '#FFA622'; // 黄色
      }
      
      return 'var(--a-text-1-color)'; // 白色
    },
    handleSortChange(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }
      // 更新排序方向
      this.filterForm['market_cap'].sort_dir = sortDir;
      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['market_cap']);
    },
    getRangeList(e) {

      if(e.min1){
        this.filterForm[`market_cap`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`market_cap`].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm[`market_cap`]);
    }
  }
}
</script>

<style lang="scss" scoped>
.color-text-2 {
  color: var(--a-text-2-color);
}

.color-text-3 {
  color: var(--a-text-3-color);
}

.text-12px {
  font-size: 12px;
}
</style>