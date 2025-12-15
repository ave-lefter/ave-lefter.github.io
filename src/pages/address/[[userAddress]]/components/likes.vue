<template>
  <div>
    <div class="flex items-center gap-4px mb-12px">
      {{ $t('preferredTokenMarketCap') }}
      <Icon v-tooltip="$t('preferedTips')" name="custom:infomation-line" />
    </div>
    <div class="text-24px font-700 lh-30px color-[--main-text] mb-24px">$100K ~ $1M</div>
    <div class="flex justify-between text-14px mb-12px">
      {{ $t('mCap') }}
      <span>{{ $t('buyFrequency') }}</span>
    </div>
    <div
      v-for="item in list"
      :key="item.label"
      class="flex items-center justify-between h-20px mb-8px"
    >
      <div class="color-[--secondary-text] text-14px w-108px lh-20px">{{ item.label }}</div>
      <el-progress
        class="flex-1 [&&]:[--el-border-color-lighter:#12B8860D]"
        :percentage="20"
        :show-text="false"
        :color="getCssVariable('--up-color')"
      />
      <div class="w-57px text-right color-[--main-text]">208</div>
    </div>
  </div>
</template>
<script setup>
const list = [
  { label: '＜$100K', percentage: 20 },
  { label: '$100K ~ $1M', percentage: 10 },
  { label: '$1M ~ $10M', percentage: 50 },
  { label: '$10M ~ $80M', percentage: 10 },
  { label: '$80M ~ $100M', percentage: 30 },
  { label: '＞$100M', percentage: 20 },
]
</script>
<style scoped lang="scss">
:global(.el-progress-bar__outer) {
  border-radius: 0;
}
:global(.el-progress-bar__inner) {
  border-radius: 0;
}
</style>
