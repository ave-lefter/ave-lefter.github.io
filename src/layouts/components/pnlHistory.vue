<script setup lang="ts">
const visible = defineModel<boolean>('visible')
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('PnlHistory')"
    width="420px"
    :close-on-click-modal="false"
  >
    <div class="mx--20px border-t-1px border-t-solid border-[--d-333-l-F2F2F2]" />
    <div class="mx--20px">
      <div class="p-20px flex justify-between items-center">
        <div class="flex flex-col gap-8px">
          <span class="color-[--d-F5F5F5-l-333] font-500 text-16px lh-20px">0.3 SOL</span>
          <div class="color-[--d-666-l-999] text-12px lh-16px">2024/09/11 19:32:22</div>
        </div>
        <div class="flex gap-8px items-center">
          <span class="color-[--d-F5F5F5-l-333] font-500 text-16px lh-20px">0.3 SOL</span>
          <Icon name="ic:baseline-delete"/>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
