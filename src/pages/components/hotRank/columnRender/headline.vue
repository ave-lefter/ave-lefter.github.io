<template>
  <el-table-column :label="$t('aiSummary')" :width="232">
    <template #default="{ row }">
     <div class="text-12px lh-16px" :class="!row.headline?'color-[--d-666-l-999]':''">
      {{
        row.headline || $t('noAi')
      }}
     </div>
    </template>
  </el-table-column>
</template>
