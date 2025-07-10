<template>
  <el-table-column :label="$t('AI叙事')" :width="232">
    <template #default="{ row }">
     <div class="text-12px lh-16px">
      {{
        row.headline || "$BABYLABUBU 是一个基于 BNB 链的社区驱动的memecoin。"
      }}
     </div>
    </template>
  </el-table-column>
</template>
