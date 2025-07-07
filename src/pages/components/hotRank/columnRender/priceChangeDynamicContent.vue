<template>
  <el-table-column
    :key="activeInterval"
    v-if="activeInterval && ['5m', '15m', '1H', '4H']?.includes(activeInterval)"
    :label="`${ activeInterval?.toLowerCase() }%`"
    sortable="custom"
    :sort-orders="['descending', 'ascending', null]"
    :prop="`price_change_${activeInterval.toLowerCase()}`"
    width="90"
    align="right"
  >
    <template #header>
      <div style="display: inline-flex;align-items: center;line-height: 1;">
        <span style="background: var(--a-bg-3-color); color: #f5f5f5; margin-right: 1px; padding: 1px 2.5px;border-radius: 4px;">{{ activeInterval.toLowerCase() }}</span>
        <span>%</span>
      </div>
    </template>
    <template #default="{ row }">
      <span 
        class="ellipsis block" 
        style="max-width: 100px;margin-left:auto;" 
        :class="Number(row?.[`price_change_${activeInterval.toLowerCase()}`]) > 0 ? 'green' : (Number(row?.[`price_change_${activeInterval.toLowerCase()}`]) === 0 ? 'color-text-3' : 'red')"
      >
        {{ Number(row?.[`price_change_${activeInterval.toLowerCase()}`]) > 0 ? '+' : '' }}{{ $f.formatNumberS(row?.[`price_change_${activeInterval.toLowerCase()}`] || 0) }}%
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "priceChangeDynamicContent",
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