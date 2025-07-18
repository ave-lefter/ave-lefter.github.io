<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>

<template>
  <div v-if="row.headline" v-tooltip="row.headline" class="[&&]:text-12px lh-16px line-3">
    {{ row.headline || $t('noAi') }}
  </div>
  <div v-else class="color-[--d-666-l-999] [&&]:text-12px">
    {{ $t('noAi') }}
  </div>
</template>
