<script setup lang="ts">
const activeInterval = ref()
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
    <div class="flex gap-12px items-center">
      <div class="">
        <button v-for="(item, index) in intervals" :key="index" :class="{ active: activeInterval === item.id }"
                @click.stop="selectInterval(item)">{{ item.name }}
        </button>
        <div class="flex items-center">

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
