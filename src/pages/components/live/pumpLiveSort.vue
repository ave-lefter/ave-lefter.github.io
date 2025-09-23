<template>
  <div class="flex-end">
    <a
      class="text-12px mr-5px flex items-center"
      :class="globalStore.pumpLiveSort.sort === item.id ? 'active' : ''"
      href=""
      @click.stop.prevent="switchTab(item)"
      v-for="(item, $index) in tabs"
      :key="$index"
      >{{ item.name }}
      <template v-if="globalStore.pumpLiveSort.sort === item.id">
        <Icon
          class="text-18px"
          v-if="globalStore.pumpLiveSort.sort_dir == 'ASC'"
          name="material-symbols:fitbit-arrow-upward"
        />
        <Icon
          class="text-18px"
          v-if="globalStore.pumpLiveSort.sort_dir == 'DESC'"
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
      name: 'Time',
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
