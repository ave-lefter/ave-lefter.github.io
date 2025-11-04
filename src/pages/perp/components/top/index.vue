<template>
  <div class="bg-[--d-101114-l-F6F9FF] h-64px flex-start items-center justify-start py-7px px-12px">
    <el-popover popper-class="[--el-popover-bg-color:--border]">
      <template #reference>
        <div
          class="flex items-center px-4px py-4px cursor-pointer rounded-4px hover:bg-[--d-1B1D21-l-E8F1FF]"
        >
          <token-img tokenClass="w-32px h-32px"></token-img>
          <div class="ml-8px">
            <span class="color-[--main-text] text-18px font-500 block">BTCUSDT</span>
            <span class="color-[--third-text] text-12px mt-2px">永续</span>
          </div>
          <Icon
            :name="isRotate ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
            class="text-18px color-[--main-text]"
          />
        </div>
      </template>
      <template #default>
        <div class="py-4px [&&]:m--12px flex flex-col">11111111</div>
      </template>
    </el-popover>

    <div class="ml-16px">
      <span class="text-20px font-700 block text-left color-red">111750.24</span>
      <span class="text-12px block text-left color-red mt-2px">-3700 +1.25%</span>
    </div>
    <div class="ml-16px w-0 border-l-[--icon-color] border-l-solid h-28px"></div>
    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">指数价格</span>
      <span class="text-12px block text-left color-[--main-text] leading-16px mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">预言机价格</span>
      <span class="text-12px block text-left color-[--main-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">24h涨跌</span>
      <span class="text-12px block text-left color-[--main-text] mt-2px color-red">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">24h最高价</span>
      <span class="text-12px block text-left color-[--secondary-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">24h最低价</span>
      <span class="text-12px block text-left color-[--secondary-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">24h交易额(USDT)</span>
      <span class="text-12px block text-left color-[--secondary-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">24h交易量(BTC)</span>
      <span class="text-12px block text-left color-[--secondary-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">未平仓合约(USD)</span>
      <span class="text-12px block text-left color-[--main-text] mt-2px">3700</span>
    </div>

    <div class="ml-16px">
      <span class="text-12px block text-left color-[--third-text]">资金费率/倒计时</span>
      <span class="text-12px block text-left color-[--main-text] mt-2px">3700</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import search from './search'
const isRotate = shallowRef(false)
</script>

<style lang="scss" scoped></style>
