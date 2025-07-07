<script lang="jsx">
export default {
  name: "quickContent",
  props: {
    chain: {
      type: String,
      default: ''
    },
    quickBuyValue: {
      type: String,
      default: '0'
    },
    loadingSwap: {
      type: Object,
      default: () => ({})
    },
    submitBotSwap: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    isVisible() {
      return (this.$store.state.bot?.isSupportChains?.includes(this.chain) || !this.chain) && this.$store.state.quickBuy;
    }
  }
}
</script>

<template>
   <!-- fixed="right" -->
  <el-table-column
    v-if="isVisible"
    :label="$t('quick')"
    :key="$t('quick')"
    :min-width="$f.getTextWidth(quickBuyValue, 20) + 100"
    align="center"
    fixed="right"
  >
    <template #default="{ row, $index }">
      <!-- v-if="$store.state.bot?.isSupportChains?.includes(row.chain)" -->
      <div class="trade" style="justify-content: center" >
        <!-- :color="$store.state.mode === 'dark' ? '#333333' : '#f2f2f2'" -->

        <el-button
          class="button-quick-buy flex-end"
          style="width: 62px;background-color: #37B270;color: #fff;"
          :disabled="quickBuyValue == 0"
          :loading="loadingSwap[`${row.pair}-${row.chain}`]"
          v-on="$store.state.bot?.isSupportChains?.includes(row.chain) ? { click: ($event) => { $event.stopPropagation(); $event.preventDefault(); submitBotSwap(row, true); } } : {}"
        >
          <i v-if="!loadingSwap[`${row.pair}-${row.chain}`]" class="iconfont icon-bolt-alt font-12" style="color: #fff;"></i>&nbsp;
          <!-- <img
            v-if="row.chain"
            :src="`${$store.state.s3BaseUrl}chain/${row.chain}.png`"
            alt=""
            onerror="this.src='/icon-default.png'"
            srcset=""
            width="14px"
          />&nbsp; -->
          <!-- <span>{{ quickBuyValue || 0 }}</span> -->
           <span>{{ $t('buy') }}</span>
        </el-button>
      </div>
    </template>
  </el-table-column>
</template>


<style lang="scss" scoped>
.button-quick-buy {
  background-color: #37B270;
  color: #fff;
  width: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
