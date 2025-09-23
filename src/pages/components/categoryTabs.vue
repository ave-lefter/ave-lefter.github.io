<script setup lang="ts">
import ColumnsToolbar from './columnsToolbar.vue'
import BlackList from '../pump/blackList.vue'
import PumpLiveSort from './live/pumpLiveSort.vue'
import type { CategoryElement, IGetTreasureConfig } from '~/api/market'
import { getHotDefaultColumns, getHotOptions } from './hotRank/columnRender/hotColumusService'
import { getNewDefaultColumns, getNewOptions } from './newRank/columnRender/newColumnsService'
import { getInclusionDefaultColumns, getInclusionOptions } from './inclusionRank/columnRender/inclusionColumnsService'
import { getGainDefaultColumns, getGainOptions } from './gainerRank/columnRender/gainColumnsService'
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
const isNew = computed(() => props.activeTab === 'new')
const isInclusion = computed(() => props.activeTab === 'inclusion')
const configMap = computed(() => {
  const pumpMaps = props.categories.reduce((prev,cur)=>{
    if(cur.is_pump){
      prev[cur.category] = {
        icon: '',
        storageKey: `${cur.category}TableColumns`,
        getDefaultColumns: getPumpDefault,
        getOptions: getPumpOptions,
      }
    }
    return prev
  },{} as any)
  return {
    hot: {
      icon: 'custom:hot',
      storageKey: 'hotUserTableColumns',
      getDefaultColumns: getHotDefaultColumns,
      getOptions: getHotOptions,
      class: isHot.value ? 'color-[--yellow]' : '',
    },
    new: {
      icon: 'custom:new',
      storageKey: 'newTableColumns',
      getDefaultColumns: getNewDefaultColumns,
      getOptions: getNewOptions,
      class: isNew.value ? 'color-#85E12F' : '',
    },
    gainer: {
      icon: 'custom:gainer',
      storageKey: 'gainUserTableColumns',
      getDefaultColumns: getGainDefaultColumns,
      getOptions: getGainOptions,
      class: props.activeTab === 'gainer' ? 'color-#22C55E' : '',
    },
    pump: {
      icon: getPumpIcon(isPump.value),
      storageKey: 'pumpTableColumns',
      getDefaultColumns: getPumpDefault,
      getOptions: getPumpOptions,
      class: '',
    },
    // bonk_pump: {
    //   icon: '',
    //   storageKey: 'bonk_pumpTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // four: {
    //   icon: '',
    //   storageKey: 'fourTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // bonk: {
    //   icon: '',
    //   storageKey: 'bonkTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // moonshot: {
    //   icon: '',
    //   storageKey: 'moonshotTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // Studio: {
    //   icon: '',
    //   storageKey: 'StudioTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // novabits: {
    //   icon: '',
    //   storageKey: 'novabitsTableColumns',
    //   getDefaultColumns: getPumpDefault,
    //   getOptions: getPumpOptions,
    //   class: '',
    // },
    // heaven_pump:{
    //   icon:'',
    //   storageKey:'heaven_pumpTableColumns',
    //   getDefaultColumns:getPumpDefault,
    //   getOptions:getPumpOptions,
    //   class:''
    // },
    inclusion: {
      icon: 'custom:inclusion',
      storageKey: 'inclusionTableColumns',
      getDefaultColumns: getInclusionDefaultColumns,
      getOptions: getInclusionOptions,
      class: isInclusion.value ? 'color-#B43BFF' : '',
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
    },
    // xdyorswap_pump:{
    //   icon:'',
    //   storageKey:'xdyorswap_pumpTableColumns',
    //   getDefaultColumns:getPumpDefault,
    //   getOptions:getPumpOptions,
    //   class:''
    // },
    pumplive:{
      icon: 'custom:video',
      storageKey: '',
      getDefaultColumns: () => { },
      getOptions: () => { },
      class:''
    },
    ...pumpMaps
  }
})



watch(()=>props.activeChain, () => {
  const index=props.categories.findIndex((i) => {
    return i.category === props.activeTab
  })
  if(index>-1){
    if(props.categories[index] && props.categories[index].sub_category && props.categories[index].sub_category.length > 0){
      const index2=props.categories?.[index]?.sub_category?.findIndex((i) => {
        return i.category === props.activeSubTab
      })
      if(index2<=-1){
        emit('update:activeTab','hot')
      }
    }
  }else{
    emit('update:activeTab','hot')
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
const supportCategories = computed(() => {
  const keys = [
    'hot',
    'new',
    'gainer',
    'pump',
    'bonk_pump',
    'four',
    'bonk',
    'moonshot',
    'Studio',
    'novabits',
    'inclusion',
    'binance_alpha',
    // 'cto',
    'xstocks',
    'volume',
    'heaven_pump',
    'xdyorswap_pump',
    'pumplive'
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
const categoryRef = useTemplateRef('categoryRef')
function updateCategory(category: string, sub_category: CategoryElement[],index:number) {
  emit('update:activeTab', category)
  if (!sub_category.some((el) => el.category === props.activeSubTab)) {
    emit('update:activeSubTab', sub_category[0]?.category || '')
  }
  scrollTabToCenter(categoryRef,index)
}
function updateSubCategory(category: string) {
  emit('update:activeSubTab', category)
}
function updateActiveChain(chain: string) {
  emit('update:activeChain', chain)
  // emit('update:activeTab','hot')
}
const botStore = useBotStore()
const walletStore = useWalletStore()
const isSupportedChain = computed(()=>{
  return (props.activeChain==='AllChains' || botStore.isSupportChains.includes(props.activeChain))
})
watch(()=>props.categories,()=>{
  setTimeout(()=>{
    const index = supportCategories.value.findIndex((el) => {
      return el.category === props.activeTab
    })
    if (index > -1) {
      scrollTabToCenter(categoryRef, index)
    }
  },20)
})
</script>

<template>
  <div class="flex gap-16px py-12px px-16px bg-[--main-bg]">
    <ChainsSelect
      :activeChain="activeChain"
      :list="chains"
      @update:activeChain="updateActiveChain"
    />
    <div class="flex flex-1 gap-16px justify-between">
      <div ref="categoryRef" class="flex gap-2 text-12px flex-1 overflow-x-auto scrollbar-hide">
        <span
          v-for="(item, index) in supportCategories"
          :key="index"
          class="p-2 lh-16px cursor-pointer rounded-1 flex items-center shrink-0 relative"
          :class="
            activeTab === item.category
              ? 'color-[--white] bg-[--primary-color]'
              : 'bg-[--main-input-button-bg] color-[--secondary-text]'
          "
          @click="updateCategory(item.category, item.sub_category || [],index)"
        >
          <Icon
            v-if="configMap[item.category as keyof typeof configMap].icon"
            :name="configMap[item.category as keyof typeof configMap].icon"
            class="mr-1 text-12px"
            :class="configMap[item.category as keyof typeof configMap].class"
          />
          {{ (item as any)[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
          <img v-if="item.is_hot === 1" class="absolute right-0px top-0px" src="@/assets/images/hot.svg" alt="" :height="10">
          <img v-else-if="item.is_hot === 2" class="absolute right-0px top-0px" src="@/assets/images/new.svg" alt="" :height="10">
        </span>
      </div>
      <div class="flex gap-12px items-center text-12px">
        <PumpLiveSort v-if="props.activeTab =='pumplive'"/>
        <div v-else class="p-1 rounded-1 bg-[--main-input-button-bg]">
          <button
            v-for="(item, index) in intervals"
            :key="index"
            class="lh-16px py-2px px-8px border-none cursor-pointer rounded-2px"
            :class="
              globalStore.rankCommon.activeInterval === item.id
                ? 'bg-[--border] color-[--main-text]'
                : 'bg-transparent color-[--secondary-text]'
            "
            @click.stop="globalStore.rankCommon.activeInterval = item.id"
          >
            {{ item.name }}
          </button>
        </div>
        <div class="flex items-center">
          <el-switch v-if="isSupportedChain" v-model="globalStore.rankCommon.quickVisible" class="mr-2" />
          <QuickSwapSet
            v-if="globalStore.rankCommon.quickVisible&&isSupportedChain"
            v-model:quickBuyValue="globalStore.rankCommon.quickBuyValue"
            :class=" props.activeTab =='pumplive'? '': 'mr-12px'"
            :settingsButtonVisible="false"
            :chain="(activeChain==='AllChains'?'':activeChain)"
          />
          <BlackList  v-if="props.activeTab !=='pumplive'"/>
          <ColumnsToolbar
            class="ml-4px"
            :activeTab="props.activeTab"
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
    class="flex items-center gap-8px text-12px px-16px pb-12px bg-[--main-bg]"
  >
    <div
      v-for="item in sub_category_list"
      :key="item.category"
      class="p-2 lh-16px cursor-pointer rounded-1 flex items-center"
      :class="
        activeSubTab === item.category
           ? 'color-[--white] bg-[--primary-color]'
              : 'bg-[--main-input-button-bg] color-[--secondary-text]'
      "
      @click="updateSubCategory(item.category)"
    >
      <Icon
        v-if="isPump"
        :name="`custom:${item.category.replaceAll('_', '-')}`"
        class="mr-1 text-12px"
        :class="activeSubTab === item.category ? 'color-[--white]' : ''"
      />
      {{ item[`name_${localeStore.locale.replace('cn', 'ch').replace('-', '_')}`] }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
