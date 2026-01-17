<template>
  <div v-if="isAutoSellConfig" class="min-w-180px">
    <div class="mb-8px color-[--main-text]">{{ $t('autoSellStrategy') }}</div>
    <ul class="color-[--secondary-text] font-normal text-xs leading-[150%]" >
      <li v-if="botSettingStore.autoSellConfig_autoSell">{{ $t('autoSellHalf') }}: {{ $t('takeProfit') }} <span class="color-#12B886">100%</span>, {{ $t('sell') }} <span class="color-#12B886">50%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_devsell && Number(autoSellConfigs.autoSellConfig_devsell!.priceChange) > 0 && Number(autoSellConfigs.autoSellConfig_devsell!.sellRatio) > 0" class="relative">{{ $t('DEVSEll') }}: <span class="text-18px mt--3px absolute top-0">≥</span><span class="color-#F6465D ml-10px">{{ autoSellConfigs.autoSellConfig_devsell!.priceChange }}%</span>, {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_devsell!.sellRatio }}%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_trailing && Number(autoSellConfigs.autoSellConfig_trailing!.priceChange) > 0 && Number(autoSellConfigs.autoSellConfig_trailing!.sellRatio) > 0">{{ $t('trailingStop') }}: {{ $t('pullback') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_trailing!.priceChange }}%</span>, {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_trailing!.sellRatio  }}%</span></li>
      <li v-if="autoSellConfigs.isAutoSellConfig_migrated && Number(autoSellConfigs.autoSellConfig_migrated!.sellRatio) > 0">{{ $t('listingOnDex') }}: {{ $t('sell') }} <span class="color-#F6465D">{{ autoSellConfigs.autoSellConfig_migrated!.sellRatio  }}%</span></li>
    </ul>
    <template v-if="autoSellConfigs.isAutoSellConfig||autoSellConfigs.isAutoSellConfig1||autoSellConfigs.isAutoSellConfig2||autoSellConfigs.isAutoSellConfig3||autoSellConfigs.isAutoSellConfig4||autoSellConfigs.isAutoSellConfig5||autoSellConfigs.isAutoSellConfig6">
      <div class="my-8px color-[--main-text]">{{ $t('advancedTradingStrategy') }}</div>
      <ul class="color-[--secondary-text] font-normal text-xs leading-[150%]">
        <li v-for="(item, index) in autoSellConfig" :key="index">{{ item.isUp ? $t('TP') : $t('SL') }}{{ item.index }}: {{ item.isUp ? $t('rise') : $t('fall') }} <span :class="item?.isUp ? 'color-#12B886' : 'color-#F6465D'">{{ item.priceChange || '--'  }}%</span>, {{ $t('sell') }} <span :class="item?.isUp ? 'color-#12B886' : 'color-#F6465D'">{{ item.sellRatio || '--'  }}%</span></li>
      </ul>
    </template>
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
