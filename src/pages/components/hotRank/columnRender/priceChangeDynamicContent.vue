<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  activeInterval: string;
}>()
function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: `price_change_${props.activeInterval}`,
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === `price_change_${props.activeInterval}`) {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})

function formatColor(val, activeInterval = props.activeInterval) {
  // 如果没有值，返回灰色
  if (!val) return 'color-[--d-666-l-999]'

  if (activeInterval === '24h') {
    if (val >= 10000000) return 'color-#FFA622' // 黄色: >= 10M
    if (val >= 1000000) return 'color-[--d-CCC-l-333]' // 白色: >= 1M
    return 'color-[--d-666-l-999]' // 灰色: < 1M
  }

  // 其他时间区间的逻辑保持不变
  if (activeInterval === '1m') {
    if (val > 6945) return 'color-#FFA622'
  }
  if (activeInterval === '5m') {
    if (val > 34722) return 'color-#FFA622'
  }
  if (activeInterval === '15m') {
    if (val > 104167) return 'color-#FFA622'
  }
  if (activeInterval === '1h') {
    if (val > 416667) return 'color-#FFA622'
  }
  if (activeInterval === '4h') {
    if (val > 1666667) return 'color-#FFA622'
  }

  return 'color-[--d-666-l-999]'
}
</script>
<template>
  <el-table-column
    v-if="activeInterval"
    :label="`${activeInterval?.toLowerCase()}%`"
    width="172"
    align="right"
  >
    <template #header>
      <div class="flex items-center justify-end">
        {{ activeInterval.toLowerCase() }} {{ $t("vol")
        }}<HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />/{{
          $t("txns")
        }}<HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
      </div>
    </template>
    <template #default="{ row }">
      <div
        class="flex justify-end"
        :class="formatColor(row[`volume_u_${activeInterval.toLowerCase()}`])"
      >
        ${{
          formatNumber(row[`volume_u_${activeInterval.toLowerCase()}`] || 0, 1)
        }}
      </div>
      <div class="flex justify-end color-[--d-999-l-666]">
        {{
          row[`tx_${activeInterval.toLowerCase()}_count`] > 0
            ? formatNumber(row[`tx_${activeInterval.toLowerCase()}_count`], 0)
            : 0
        }}
      </div>
    </template>
  </el-table-column>
</template>
