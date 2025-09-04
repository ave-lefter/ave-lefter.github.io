<template>
  <div v-if="isAutoSellConfig" class="min-w-180px">
    <div class="mb-3px">{{ $t('autoSellStrategy') }}</div>
    <ul class="color-#999">
      <li v-if="botSettingStore.autoSellConfig_autoSell">{{ $t('autoSellHalf') }}: {{ $t('takeProfit') }} <span class="color-#12B886">100%</span>, {{ $t('sell') }} <span class="color-#12B886">50%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_devsell && Number(autoSellConfigs.autoSellConfig_devsell!.priceChange) > 0 && Number(autoSellConfigs.autoSellConfig_devsell!.sellRatio) > 0">{{ $t('DEVSEll') }}: <span class="text-18px mt--3px">≥</span><span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_devsell!.priceChange }}%</span>, {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_devsell!.sellRatio }}%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_trailing && Number(autoSellConfigs.autoSellConfig_trailing!.priceChange) > 0 && Number(autoSellConfigs.autoSellConfig_trailing!.sellRatio) > 0">{{ $t('trailingStop') }}: {{ $t('pullback') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_trailing!.priceChange }}%</span>, {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_trailing!.sellRatio }}%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_migrated && Number(autoSellConfigs.autoSellConfig_migrated!.sellRatio) > 0">{{ $t('listingOnDex') }}: {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_migrated!.sellRatio }}%</span></li>
      <template v-if="autoSellConfigs.isAutoSellConfig">
        <li v-for="(item, index) in autoSellConfig" :key="index">{{ item.isUp ? $t('TP') : $t('SL') }}{{ item.index }}: {{ item.isUp ? $t('rise') : $t('fall') }} <span :class="item?.isUp ? 'color-#12B886' : 'color-#F6465D'">{{ item.priceChange }}%</span>, {{ $t('sell') }} <span :class="item?.isUp ? 'color-#12B886' : 'color-#F6465D'">{{ item.sellRatio }}%</span></li>
      </template>
    </ul>
  </div>
  <div v-else class="min-w-160px min-h-30px flex items-center justify-center">
    <div>{{ $t('noAutoSell') }}</div>
  </div>

</template>

<script setup lang='ts'>

import { useAutoSellSettingContent } from './utils'

const { autoSellConfig, isAutoSellConfig, botSettingStore, autoSellConfigs } = useAutoSellSettingContent()


</script>

<style>

</style>
