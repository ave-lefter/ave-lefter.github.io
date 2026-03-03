<template>
  <div class="text-16px lh-24px">{{ $t('confirmSellAlTips') }}</div>
  <div class="flex items-center mt-24px">
    <el-button class="flex-1" size="large" @click.stop="emit('cancel')">{{ $t('cancel') }}</el-button>
    <el-button class="flex-1" type="primary" size="large" @click.stop="emit('success')">{{ $t('confirm') }}</el-button>
  </div>
</template>

<script setup lang='ts'>
const emit = defineEmits(['success', 'cancel'])
</script>

<style>

</style>
