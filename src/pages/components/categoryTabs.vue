<script setup lang="ts">
import ColumnsToolbar from './columnsToolbar.vue'
import BlackList from '../pump/blackList.vue'
import type { CategoryElement, IGetTreasureConfig } from '~/api/market'
import { getHotDefaultColumns, getHotOptions } from './hotRank/columnRender/hotColumusService'
import { getGainDefaultColumns, getGainOptions } from './gainerRank/columnRender/gainColumnsService'
import ChainsSelect from './chainsSelect.vue'

const emit = defineEmits<{
  (e: 'update:activeTab' | 'update:activeChain', value: string): void
}>()

const props = defineProps<{
  activeTab: string
  categories: CategoryElement[]
  chains: IGetTreasureConfig[]
  activeChain: string
}>()
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
const configMap = computed(() => {
  return {
    hot: {
      icon: 'custom:hot',
      storageKey: 'hotUserTableColumns',
      getDefaultColumns: getHotDefaultColumns,
      getOptions: getHotOptions,
      class: props.activeTab === 'hot' ? 'color-#FFA622' : '',
    },
    gainer: {
      icon: 'custom:gain',
      storageKey: 'gainUserTableColumns',
      getDefaultColumns: getGainDefaultColumns,
      getOptions: getGainOptions,
      class: props.activeTab === 'gainer' ? 'color-#22C55E' : '',
    },
  }
})
const globalStore = useGlobalStore()
const supportCategories = computed(() => {
  const keys = ['hot', 'gain', 'gainer']
  const filtered = (props.categories || []).filter((el) => {
    return keys.includes(el.category)
  })
  return filtered
})
const localeStore = useLocaleStore()
</script>

<template>
  <div class="flex gap-16px py-12px px-16px bg-[--d-111-l-FFF]">
    <ChainsSelect
      :activeChain="activeChain"
      :list="chains"
      @update:activeChain="emit('update:activeChain', $event)"
    />
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
          {{ (item as any)[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
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
  </div>
</template>

<style scoped lang="scss"></style>
