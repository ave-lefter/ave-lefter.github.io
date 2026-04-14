<template>
  <div class="bg-[--secondary-bg] h-64px" @mouseleave="mouseLeave" v-if="!volumeVisible">
    <div class="tabs pt-11px pb-10px px-15px">
    <button
      v-for="item in tabs"
      :key="item.id"
      class="tab-button clickable-btn bg-[--secondary-bg]"
      :class="{ active: modelValue === item.id }"
      @click.stop="$emit('update:modelValue', item.id)"
    >
      <div class="name">{{ item.name }}</div>
      <div class="value" :style="{ color: getColor(item.id) }">
        {{ getPriceValue(item.id) }}%
      </div>
    </button>
   </div>
  </div>
  <div v-else @mouseenter="volumeVisible=false;console.log('mouseEnter')" class="bg-[--secondary-bg] py-8px px-15px h-64px">
    <template v-for="item in tabs" :key="item.id">
      <VolumeStats
        v-if="modelValue === item.id"
        :tabActive="item.id"
        :tabActiveName="item.name"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'

const VolumeStats = defineAsyncComponent(() => import('./volumeStats.vue'))
defineProps<{
  modelValue: string
  tabs: { id: '5m' | '1h' | '4h' | '24h'; name: string }[]
}>()

const volumeVisible = ref(true)
const $emit = defineEmits(['update:modelValue'])
const tokenStore = useTokenStore()
const getColor = (id: string) => {
  let val = tokenStore.pair?.[`price_change_${id}` as 'price_change_5m' | 'price_change_1h' | 'price_change_4h' | 'price_change_24h']
  if (id === '24h' && tokenStore.selectedToken && tokenStore.tokenAllPair) {
    val = tokenStore.tokenInfoExtra?.t_price_change_24h || tokenStore.tokenInfo?.token?.price_change_v2 || 0
  }
  if(!val) return '#999'
  if (val > 0) return '#12B886'
  if (val < 0) return '#F6465D'
  return '#999'
}

const getPriceValue = (id: string) => {
  if (!tokenStore.pair) return '--'
  let val = tokenStore.pair?.[`price_change_${id}` as 'price_change_5m' | 'price_change_1h' | 'price_change_4h' | 'price_change_24h']
  if (id === '24h' && tokenStore.selectedToken && tokenStore.tokenAllPair) {
    val = tokenStore.tokenInfoExtra?.t_price_change_24h || tokenStore.tokenInfo?.token?.price_change_v2 || 0
  }
  return formatNumber(val, 2)
}
const mouseLeave = () => {
  setTimeout(() => {
    volumeVisible.value = true
  }, 16.7)
}


</script>

<style scoped lang="scss">
  .tabs {
    display: flex;
    align-items: center;
    //  background: var(--main-list-hover);
    .tab-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      // background: var(--main-list-hover);
      color: var(--main-text1);
      flex: 1;
      min-height: 44px;
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      .name {
        font-size: 11px;
      }
      .value {
        font-size: 12px;
        margin-top: 2px;
      }
      &.active {
        background: var(--main-list-hover);
      }
    }
  }
</style>
