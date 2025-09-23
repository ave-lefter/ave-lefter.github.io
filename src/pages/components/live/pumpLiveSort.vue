<template>
  <div class="flex-end">
    <a
      v-for="(item, $index) in tabs"
      :key="$index"
      class="text-12px mr-5px flex items-center"
      :class="globalStore.pumpLiveSort.sort === item.id ? 'active' : ''"
      href=""
      @click.stop.prevent="switchTab(item)"
      >{{ $t(item.name) }}
      <template v-if="globalStore.pumpLiveSort.sort === item.id">
        <Icon
          v-if="globalStore.pumpLiveSort.sort_dir == 'ASC'"
          class="text-18px"
          name="material-symbols:fitbit-arrow-upward"
        />
        <Icon
          v-if="globalStore.pumpLiveSort.sort_dir == 'DESC'"
          class="text-18px"
          name="material-symbols:fitbit-arrow-downward"
        />
      </template>
    </a>
  </div>
</template>

<script setup lang="ts">
const globalStore = useGlobalStore()
interface Tab {
  id: string
  name: string
}

const count = shallowRef(-1)
const tabs = computed<Tab[]>(() => {
  return [
    {
      id: 'usd_market_cap',
      name: 'MC',
    },
    {
      id: 'created_timestamp',
      name: 'time',
    },
  ]
})

function switchTab(item: Tab) {
  count.value++
  if (count.value >= 1) {
    count.value = -1
  }
  globalStore.pumpLiveSort.sort = item.id
  if (count.value == -1) {
    globalStore.pumpLiveSort.sort_dir = 'DESC'
  } else if (count.value == 0) {
    globalStore.pumpLiveSort.sort_dir = 'ASC'
  } else if (count.value == 1) {
    globalStore.pumpLiveSort.sort_dir = ''
    globalStore.pumpLiveSort.sort = ''
  }
}
</script>

<style lang="scss" scoped>
a {
  color: var(--secondary-text);
  &.active {
    color: var(--pump-green);
  }
}
</style>
