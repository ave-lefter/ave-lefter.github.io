<template>
  <el-table-column
    :label="label"
    sortable="custom"
    :sort-orders="['descending', 'ascending', null]"
    prop="total_profit"
  >
    <template #default="{ row }">
      <span v-if="row?.total_profit > 0" :style="{ color: upColor[7] }">
        ${{ formatNumber(row?.total_profit || 0, 2, 4, 4) }}
      </span>
      <span v-else-if="row?.total_profit == 0" style="color: #959a9f">$0</span>
      <span v-else-if="row?.total_profit == '--'" style="color: #959a9f">--</span>
      <span :style="{ color: downColor }" v-else>
        {{ '-$' + formatNumber(Math.abs(row?.total_profit) || 0, 2, 4, 4) }}
      </span>
      <span
        class="block text-12px">
        <template v-if="row?.total_profit_ratio == 0">0</template>
        <template v-else-if="row?.total_profit_ratio == '--'">--</template>
        <template v-else>
          <span
            :style="{
              color: row?.total_profit_ratio > 0 ? upColor : downColor,
            }"
          >
            {{ formatNumber(row?.total_profit_ratio * 100 || 0, 2, 4, 4) }}%
          </span>
        </template>
      </span>
    </template>
  </el-table-column>
</template>

<script setup>
import { formatNumber } from '@/utils/formatNumber'
import { downColor, upColor } from '@/utils/constants'

const props = defineProps({
  label: String,
})
</script>

<style lang="scss" scoped>
</style>
