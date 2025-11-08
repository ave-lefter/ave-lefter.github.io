<script setup lang="ts">
const props = defineProps<{
  activeInterval: string
}>()
const activeText = computed(()=>{
  if(['4h','24h'].includes(props.activeInterval)){
    return '1h'
  }
  return props.activeInterval
})
</script>

<template>
    <div class="flex items-center gap-3px">
        <span class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]">{{ activeText
            }}</span>
        {{ $t('trendChart') }}
    </div>
</template>

<style scoped lang="scss"></style>