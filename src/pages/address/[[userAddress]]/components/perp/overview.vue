<script setup lang="ts">
const {t} = useI18n()
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg]">
    <div class="flex justify-between mb-24px">
      <span class="text-24px lh-30px color-[--main-text] font-500">{{ t('totalAssets') }}</span>
      <div>
        <el-button class="w-100px h-32px m-l-auto [--el-font-size-base:12px]" type="primary" size="small">
          {{ t('deposit') }}
        </el-button>
        <el-button class="w-100px h-32px [&&]:m-l-8px [--el-font-size-base:12px]" size="small">
          {{ t('withdraw') }}
        </el-button>
      </div>
    </div>
    <div>
      <div class="flex items-center gap-8px mb-8px">
        <span class="text-24px lh-30px color-[--main-text] font-500">$5,286,125.85</span>
        <Icon class="color-[--primary-color] cursor-pointer text-15px" name="custom:refresh"/>
      </div>
      <div class="flex items-center gap-8px">
        <span class="text-12px lh-16px color-[--secondary-text]">{{ t('todayPnl') }}</span>
        <span class="text-12px lh-16px color-[--main-text]">-0.33 USDT</span>
        <span class="text-12px lh-16px color-[--secondary-text]">(-0.00%)</span>
    </div>
    <el-divider class="[--el-border-color:--main-divider]"/>
    <div class="flex items-center justify-between mb-16px">
      <div class="mr-60px">
        <label class="text-12px lh-18px color-[--secondary-text]">{{ t('totalVolume') }}</label>
        <div class="text-18px lh-24px color-[--main-text] font-500">
          $122,382.22
        </div>
      </div>
      <div>
        <label class="text-12px lh-18px color-[--secondary-text]">{{ t('score2') }}</label>
        <div>
          <span class="text-18px lh-24px color-[--up-color] font-500">+23</span>
          <span class="text-14px ml-8px lh-24px color-[--third-text]">本周 +123</span>
        </div>
      </div>
      <el-button type="primary" size="small" class="w-56px  [--el-font-size-base:12px]">{{ t('receive') }}</el-button>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('todayVolume') }}</span>
      <span class="text-14px lh-18px color-[--main-text] font-500">$2,382</span>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('totalPnl') }}</span>
      <span class="text-14px lh-18px color-[--main-text]">+$6,125.85</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('maxDrawdown') }}</span>
      <span class="text-14px lh-18px color-[--main-text]">--</span>
    </div>
  </div>
</div>
</template>