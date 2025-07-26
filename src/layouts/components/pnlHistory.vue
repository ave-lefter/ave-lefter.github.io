<script setup lang="ts">
const visible = defineModel<boolean>('visible')
defineProps<{
  list: any[]
  getColorClass: (val: string | number) => string
}>()
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('PnlHistory')"
    width="420px"
    :close-on-click-modal="false"
  >
    <div class="mx--20px border-t-1px border-t-solid border-[--d-333-l-F2F2F2]" />
    <el-scrollbar :height="500" class="mx--20px">
      <div
        v-for="{ balance, time, amount } in list"
        :key="time"
        class="p-20px flex justify-between items-center hover:bg-[--d-333-l-F2F2F2]"
      >
        <div class="flex flex-col gap-8px">
          <span class="color-[--d-F5F5F5-l-333] font-500 text-16px lh-20px"
            >{{ formatNumber(balance, 3) }} SOL</span
          >
          <div class="color-[--d-666-l-999] text-12px lh-16px">
            {{ formatDate(time, 'YYYY/MM/DD HH:mm:ss') }}
          </div>
        </div>
        <div class="flex gap-8px items-center">
          <span class="font-500 text-16px lh-20px" :class="getColorClass(amount)">
            {{ addSign(amount) }}{{ formatNumber(Math.abs(amount), 3) }} SOL
          </span>
          <!-- <Icon name="ic:baseline-delete"/> -->
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
