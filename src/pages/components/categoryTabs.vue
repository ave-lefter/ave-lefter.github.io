<script setup lang="ts">
const props = defineProps<{
  activeInterval: string
}>()
const emit = defineEmits(['update:activeInterval'])
const intervals = computed(() => {
  return [
    {name: '1m', id: '1m'},
    {name: '5m', id: '5m'},
    {name: '15m', id: '15m'},
    {name: '1H', id: '1H'},
    {name: '4H', id: '4H'},
    {name: '24H', id: '24H'},
  ]
})
</script>

<template>
  <div class="flex flex-1 justify-between">
    <div class="flex gap-2 text-12px">
      <span class="p-2 lh-16px bg-#1A1A1A cursor-pointer rounded-1">
        <Icon name="custom:hot" class="mr-1"/>
        {{ $t('trending') }}
      </span>
    </div>
    <div class="flex gap-12px items-center text-12px">
      <div class="p-1 rounded-1 bg-[--d-222-l-F2F2F2]">
        <button
            v-for="(item, index) in intervals" :key="index"
            class="lh-16px py-2px px-8px color-[--d-F5F5F5-l-333] border-none cursor-pointer rounded-2px"
            :class="activeInterval === item.id?'bg-[--d-111-l-FFF]':'bg-transparent'"
            @click.stop="emit('update:activeInterval',item.id)"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="flex items-center"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
