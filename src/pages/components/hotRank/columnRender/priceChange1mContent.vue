<template>
  <el-table-column
    label="1m%"
    sortable="custom"
    :sort-orders="['descending', 'ascending', null]"
    prop="price_change_1m"
    width="90"
    align="right"
  >
    <template #default="{ row }">
      <span 
        class="ellipsis block" 
        style="max-width: 100px;margin-left:auto;" 
        :class="Number(row?.price_change_1m) > 0 ? 'green' : (Number(row?.price_change_1m) === 0 ? 'color-text-3' : 'red')"
      >
        {{ Number(row?.price_change_1m) > 0 ? '+' : '' }}{{ $f.formatNumberS(row.price_change_1m || 0) }}%
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "priceChange1mContent"
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