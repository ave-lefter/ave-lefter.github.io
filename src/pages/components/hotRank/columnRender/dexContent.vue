<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column v-if="['hot', 'gainer', 'new'].includes?.(activeCategory)" label="DEX" prop="amm" align="center"
    width="70">
    <template #default="{ row }">
      <el-tooltip effect="customized" :content="row.amm" placement="top" v-if="row.amm"
        :popper-class="$store.state.mode">
        <i class="iconfont icon-svg icon-unknown color-text-2 font-20"
          style="font-size: 16px; margin-right: 3px; line-height: 16px" v-if="row.amm === 'unknown'"></i>
        <a v-else :href="$f.formatSwapUrl(row.token, row.chain, row.amm)" @click.stop target="_blank" class="icon-a"
          rel="noopener noreferrer">
          <img v-if="row.chain" style="width: 16px; height: 16px;" class="icon-svg icon-symbol"
            :src="$f.formatIconSwap(row.amm)" onerror="this.src='/icon-default.png'" height="16" />
        </a>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "dexContent",
  props: {
    filterForm: {
      type: Object,
      required: true
    },
    ammList: {
      type: Array,
      default: () => []
    },
    filterSwapList: {
      type: Array,
      default: () => []
    },
    conditions: {
      type: Object,
      required: true
    },
    isActiveFilter: {
      type: Function,
      required: true
    },
    goFilterSwap: {
      type: Function,
      required: true
    },
    searchChainSwap: {
      type: Function,
      required: true
    },
    activeCategory: {
      type: String,
      default: ''
    },
  }
}
</script>


<style>
.icon-svg {
  border-radius: 50%;
}
</style>
