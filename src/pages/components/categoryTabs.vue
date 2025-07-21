<script setup lang="ts">
import ColumnsToolbar from './columnsToolbar.vue'
import BlackList from '../pump/blackList.vue'
import type { CategoryElement, IGetTreasureConfig } from '~/api/market'
import { getHotDefaultColumns, getHotOptions } from './hotRank/columnRender/hotColumusService'
import ChainsSelect from './chainsSelect.vue'
import { getPumpDefault, getPumpOptions } from './pump/columnRender/pumpColumnsService'
import {
  getActivityDefaultColumns,
  getActivityOptions,
} from './activity/columnRender/columusService'

const emit = defineEmits<{
  (e: 'update:activeTab' | 'update:activeChain' | 'update:activeSubTab', value: string): void
}>()

const props = defineProps<{
  activeTab: string
  categories: CategoryElement[]
  chains: IGetTreasureConfig[]
  activeChain: string
  activeSubTab: string
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
const themeStore = useThemeStore()
const isHot = computed(() => props.activeTab === 'hot')
const isPump = computed(() => props.activeTab === 'pump')
const configMap = computed(() => {
  return {
    hot: {
      icon: 'custom:hot',
      storageKey: 'hotUserTableColumns',
      getDefaultColumns: getHotDefaultColumns,
      getOptions: getHotOptions,
      class: isHot.value ? 'color-#FFA622' : '',
    },
    pump: {
      icon: getPumpIcon(isPump.value),
      storageKey: 'pumpTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    bonk_pump: {
      icon: '',
      storageKey: 'bonk_pumpTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    four: {
      icon: '',
      storageKey: 'fourTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    bonk: {
      icon: '',
      storageKey: 'bonkTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    moonshot: {
      icon: '',
      storageKey: 'moonshotTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    Studio: {
      icon: '',
      storageKey: 'StudioTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    novabits: {
      icon: '',
      storageKey: 'novabitsTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    binance_alpha: {
      icon: '',
      storageKey: 'binance_alphaTableColumns',
      getDefaultColumns: getActivityDefaultColumns,
      getOptions: getActivityOptions,
      class: '',
    },
    cto: {
      icon: '',
      storageKey: 'ctoTableColumns',
      getDefaultColumns: getActivityDefaultColumns,
      getOptions: getActivityOptions,
      class: '',
    },
    xstocks: {
      icon: '',
      storageKey: 'xstocksTableColumns',
      getDefaultColumns: getActivityDefaultColumns,
      getOptions: getActivityOptions,
      class: '',
    },
    volume:{
      icon:'',
      storageKey:'volumeTableColumns',
      getDefaultColumns:getActivityDefaultColumns,
      getOptions:getActivityOptions,
      class:''
    }
  }
})
function getPumpIcon(isPump: boolean) {
  if (isPump) {
    return 'custom:pump-active'
  }
  if (themeStore.isDark) {
    return 'custom:pump'
  } else {
    return 'custom:pump-white'
  }
}
const globalStore = useGlobalStore()
// 由于其他榜单未上，用临时的 computed过滤
const supportCategories = computed(() => {
  const keys = [
    'hot',
    'pump',
    'bonk_pump',
    'four',
    'bonk',
    'moonshot',
    'Studio',
    'novabits',
    'binance_alpha',
    'cto',
    'xstocks',
    'volume'
  ]
  return (props.categories || []).filter((el) => {
    return keys.includes(el.category)
  })
})
const localeStore = useLocaleStore()
const sub_category_list = computed(() => {
  return (
    props.categories.find((el) => {
      return el.category === props.activeTab
    })?.sub_category || []
  )
})
function updateCategory(category: string, sub_category: CategoryElement[]) {
  emit('update:activeTab', category)
  if (!sub_category.some((el) => el.category === props.activeSubTab)) {
    emit('update:activeSubTab', sub_category[0]?.category || '')
  }
}
function updateSubCategory(category: string) {
  emit('update:activeSubTab', category)
}
</script>

<template>
  <div class="flex gap-16px py-12px px-16px bg-[--d-111-l-FFF]">
    <ChainsSelect
      :activeChain="activeChain"
      :list="chains"
      @update:activeChain="emit('update:activeChain', $event)"
    />
    <div class="flex flex-1 gap-16px justify-between">
      <div ref="categoryRef" class="flex gap-2 text-12px flex-1 overflow-x-auto">
        <span
          v-for="(item, index) in supportCategories"
          :key="index"
          class="p-2 lh-16px cursor-pointer rounded-1 flex items-center shrink-0"
          :class="
            activeTab === item.category
              ? 'color-#F5F5F5 bg-#333'
              : 'bg-[--d-1A1A1A-l-F2F2F2] color-[--d-666-l-999]'
          "
          @click="updateCategory(item.category, item.sub_category || [])"
        >
          <Icon
            v-if="configMap[item.category as keyof typeof configMap].icon"
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
  </div>
  <div
    v-if="sub_category_list.length"
    class="flex items-center gap-8px text-12px px-16px pb-12px bg-[--d-111-l-FFF]"
  >
    <div
      v-for="item in sub_category_list"
      :key="item.category"
      class="p-2 lh-16px cursor-pointer rounded-1 flex items-center"
      :class="
        activeSubTab === item.category
          ? 'color-#F5F5F5 bg-#333'
          : 'bg-[--d-1A1A1A-l-F2F2F2] color-[--d-666-l-999]'
      "
      @click="updateSubCategory(item.category)"
    >
      <Icon
        v-if="isPump"
        :name="`custom:${item.category.replaceAll('_', '-')}`"
        class="mr-1 text-12px"
        :class="activeSubTab === item.category ? 'color-#F5F5F5' : ''"
      />
      {{ item[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
