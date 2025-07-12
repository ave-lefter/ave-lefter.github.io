<template>
  <el-table-column :label="$t('AI叙事')" :width="232">
    <template #default="{ row }">
     <div class="text-12px lh-16px" :class="!row.headline?'color-[--d-666-l-999]':''">
      {{
        row.headline || "暂无AI叙事内容"
      }}
     </div>
    </template>
  </el-table-column>
</template>
