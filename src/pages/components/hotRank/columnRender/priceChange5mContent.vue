<template>
  <el-table-column
    :key="activeInterval"
    v-if="activeInterval && ['1m', '24H']?.includes(activeInterval)"
    label="5m%"
    sortable="custom"
    :sort-orders="['descending', 'ascending', null]"
    prop="price_change_5m"
    min-width="90"
    align="right"
  >
    <template #default="{ row }">
      <span  
        class="ellipsis block" 
        style="max-width: 100px;margin-left:auto;" 
        :class="Number(row?.price_change_5m) > 0 ? 'green' : (Number(row?.price_change_5m) === 0 ? 'color-text-3' : 'red')"
      >
        {{ Number(row?.price_change_5m) > 0 ? '+' : '' }}{{ $f.formatNumberS(row.price_change_5m || 0) }}%
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "priceChange5mContent",
  props: {
    activeInterval: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.block {
  display: block;
}
.red {
  color: #EB2B4B;
}
.green {
  color: #37B270;
}

.color-text-3 {
  color: var(--a-text-3-color);
}
</style> 