<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>

<template>
  <div
    v-if="row.headline"
    v-tooltip="{
      content: row.summary || row.headline,
      props:{
        'popper-class':'max-w-200px'
      }
    }"
    class="[&&]:text-12px lh-16px line-3"
  >
    {{ row.headline || $t('noAi') }}
  </div>
  <div v-else class="[&&]:text-12px color-[--third-text]">
    {{ $t('noAi') }}
  </div>
</template>
