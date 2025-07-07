<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    :label="$t('liquidity1') + '/' + $t('initial')"
    align="right"
    width="140"
  >
    <template #header>
      <div style="display: inline-flex;align-items: center;line-height: 1;">
        <span>
          {{ $t('liquidity1')}}
          <span>/</span>
          {{ $t('initial')}}
          <headSort
            :defaultSort="filterForm['tvl'].sort_dir === 'asc' ? 'ascending' : (filterForm['tvl'].sort_dir === 'desc' ? 'descending' : '')"
            @sort-change="(sortOrder) => handleSortChange2(sortOrder)"
          />
        </span>
        <i v-show="isShowB" class="iconfont icon-b font-12 ml-3 clickable" @click.stop="isShowB = false"></i>
        <i v-show="!isShowB" class="iconfont icon-u font-12 ml-3 clickable" @click.stop="isShowB = true"></i>
      </div>

      <filterToolbar
        :isActiveFilter="isActiveFilter('tvl')"
        :rangeTitle1="`${$t('liquidity1')}($)`"
        :rangeList="rangeList"
        @reset="handleResetList"
        @confirm="getRangeList"
      />
    </template>
    <template #default="{ row }">
      <div>
        <div>
          <!-- <span :style="{ color: row.tvl_ratio >= 0 ? (row.tvl_ratio > 0 ? $store.getters.upColor[7] : 'var(--custom-text-2-color)') : $store.getters.downColor[7] }" class="mr-3">
            {{ row.tvl_ratio > 0 ? '+' : '' }}{{ $f.formatNumberS(row.tvl_ratio) }}%
          </span> -->
          <span v-show="isShowB" :style="{ color: row.tvl_ratio < 0 ? $store.getters.downColor[7] : 'var(--a-text-1-color)' }" :class="!(row?.target_token === row?.token0_address ? row?.reserve1 : row?.reserve0) ? 'color-text-3' : ''">
            {{ $f.formatNumberS((row?.target_token === row?.token0_address ? row?.reserve1 : row?.reserve0) || 0) }} {{ row?.target_token === row?.token0_address ? row?.token1_symbol : row?.token0_symbol }}
          </span>
          <span v-show="!isShowB" :style="{ color: row.tvl_ratio < 0 ? $store.getters.downColor[7] : 'var(--a-text-1-color)' }" :class="!row.tvl ? 'color-text-3' : ''">
            ${{ $f.formatNumberS(row.tvl || 0) }}
          </span>
        </div>
        <div v-show="!isShowB" class="text-12px color-text-2">
          ${{ $f.formatNumberS(row.init_tvl || 0) }}
        </div>
        <div v-show="isShowB" class="text-12px color-text-2">
          {{ $f.formatNumberS((row?.target_token === row?.token0_address ? row?.init_reserve1 : row?.init_reserve0) || 0) }} {{ row?.target_token === row?.token0_address ? row?.token1_symbol : row?.token0_symbol }}
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";
export default {
  name: "liquidityContent",
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
  data(){
    return {
      isShowB: false,
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
  methods:{
    formatColor(val){
      if(val > 10000000) return '#FFA622';
      return 'var(--custom-text-5-color)';
    },
    getTokenAge(listingTime) {
      if (!listingTime) return Infinity;
      const listingDate = new Date(listingTime);
      const now = new Date();
      return Math.floor((now - listingDate) / 1000);
    },
    getMarketCapColor(row) {
      console.log("🚀 ~ getMarketCapColor ~ row:", row)
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
    handleResetList(){
      this.handleReset(this.filterForm['tvl']);
    },
    getRangeList(e){
      if(e.min1){
        this.filterForm[`tvl`].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm[`tvl`].range[1] = e.max1;
      }
      this.handleFilterConfirm(this.filterForm[`tvl`]);
    },
    handleSortChange2(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }
      // 更新排序方向
      this.filterForm['tvl'].sort_dir = sortDir;
      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['tvl']);
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