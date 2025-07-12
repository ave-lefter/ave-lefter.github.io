<template>
  <el-table-column :label="$t('AI叙事')" :width="232">
    <template #default="{ row }">
     <div class="text-12px lh-16px">
      {{
        row.headline || "暂无AI叙事内容"
      }}
     </div>
    </template>
  </el-table-column>
</template>
