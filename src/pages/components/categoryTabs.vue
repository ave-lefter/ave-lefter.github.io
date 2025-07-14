<script setup lang="ts">
import ColumnsToolbar from './columnsToolbar.vue'
import BlackList from '../pump/blackList.vue'
import type { CategoryElement } from '~/api/market'

const props = defineProps<{ activeTab: string; categories: CategoryElement[] }>()
// const { t } = useI18n()
const intervals = computed(() => {
  return [
    { name: '1m', id: '1m' },
    { name: '5m', id: '5m' },
    { name: '15m', id: '15m' },
    { name: '1h', id: '1h' },
    { name: '4h', id: '4h' },
    { name: '24h', id: '24h' },
  ]
})
const iconMap = shallowRef({
  hot:'custom:hot'
})
const globalStore = useGlobalStore()
// 由于其他榜单未上，用临时的 computed过滤
const supportCategories = computed(() => {
  const keys = ['hot']
  return (props.categories||[]).filter((el) => {
    return keys.includes(el.category)
  })
})
const localeStore = useLocaleStore()
</script>

<template>
  <div class="flex flex-1 justify-between">
    <div class="flex gap-2 text-12px">
      <span
        v-for="(item, index) in supportCategories"
        :key="index"
        class="p-2 lh-16px cursor-pointer rounded-1 flex items-center"
        :class="activeTab===item.category?'color-#F5F5F5 bg-#333':'bg-[--d-1A1A1A-l-F2F2F2] color-[--d-666-l-999]'"
      >
        <Icon :name="iconMap[item.category]" class="mr-1 color-#FFA622 text-12px" />
        {{ item[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
      </span>
    </div>
    <div class="flex gap-12px items-center text-12px">
      <div class="p-1 rounded-1 bg-[--d-222-l-F2F2F2]">
        <button
          v-for="(item, index) in intervals"
          :key="index"
          class="lh-16px py-2px px-8px color-[--d-F5F5F5-l-333] border-none cursor-pointer rounded-2px"
          :class="
            globalStore.rankCommon.activeInterval === item.id
              ? 'bg-[--d-111-l-FFF]'
              : 'bg-transparent'
          "
          @click.stop="globalStore.rankCommon.activeInterval = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="flex items-center">
        <el-switch v-model="globalStore.rankCommon.quickVisible" class="mr-2" />
        <QuickSwapSet
          v-if="globalStore.rankCommon.quickVisible"
          v-model:quickBuyValue="globalStore.rankCommon.quickBuyValue"
          class="mr-8px"
          :settingsButtonVisible="false"
          :chain="'solana'"
        />
        <BlackList />
        <ColumnsToolbar v-if="activeTab === 'hot'" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
