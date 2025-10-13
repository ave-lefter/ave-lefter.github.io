<script setup lang="ts">
defineProps<{
  activeInterval: string
}>()
</script>

<template>
    <div class="flex items-center gap-3px">
        <span class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]">{{ activeInterval
            }}</span>
        {{ $t('trendChart') }}
    </div>
</template>

<style scoped lang="scss"></style>