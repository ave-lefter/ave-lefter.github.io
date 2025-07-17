<script setup lang="ts">
import ColumnsToolbar from './columnsToolbar.vue'
import BlackList from '../pump/blackList.vue'
import type { CategoryElement } from '~/api/market'
import { getHotDefaultColumns, getHotOptions } from './hotRank/columnRender/hotColumusService'
import { getPumpDefault, getPumpOptions } from './pump/columnRender/pumpColumnsService'

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

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
const themeStore = useThemeStore()
const configMap = computed(() => {
  return {
    hot: {
      icon: 'custom:hot',
      storageKey: 'hotUserTableColumns',
      getDefaultColumns: getHotDefaultColumns,
      getOptions: getHotOptions,
      class: props.activeTab === 'hot' ? 'color-#FFA622' : '',
    },
    pump: {
      icon: 'custom:pump',
      storageKey: 'pumpTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: themeStore.isDark ? '' : 'opacity-50',
    },
  }
})
const globalStore = useGlobalStore()
// 由于其他榜单未上，用临时的 computed过滤
const supportCategories = computed(() => {
  const keys = ['hot', 'pump']
  return (props.categories || []).filter((el) => {
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
        :class="
          activeTab === item.category
            ? 'color-#F5F5F5 bg-#333'
            : 'bg-[--d-1A1A1A-l-F2F2F2] color-[--d-666-l-999]'
        "
        @click="emit('update:activeTab', item.category)"
      >
        <Icon
          :name="configMap[item.category as keyof typeof configMap].icon"
          class="mr-1 text-12px"
          :class="configMap[item.category as keyof typeof configMap].class"
        />
        {{ item[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
      </span>
    </div>
    <div class="flex gap-12px items-center text-12px">
      <div class="p-1 rounded-1 bg-[--d-222-l-F2F2F2]">
        <button
          v-for="(item, index) in intervals"
          :key="index"
          class="lh-16px py-2px px-8px color-[--d-666-l-999] border-none cursor-pointer rounded-2px"
          :class="
            globalStore.rankCommon.activeInterval === item.id
              ? 'bg-[--d-111-l-FFF] color-[--d-F5F5F5-l-333]'
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
          class="mr-12px"
          :settingsButtonVisible="false"
          :chain="'solana'"
        />
        <BlackList />
        <ColumnsToolbar
          class="ml-4px"
          :storageKey="configMap[activeTab as keyof typeof configMap].storageKey"
          :getDefaultColumns="configMap[activeTab as keyof typeof configMap].getDefaultColumns"
          :getOptions="configMap[activeTab as keyof typeof configMap].getOptions"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
