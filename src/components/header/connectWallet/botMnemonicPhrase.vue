<template>
  <div class="text-32px inline-flex items-center">
    <span class="font-600">AVE Bot 交易钱包</span>
  </div>
  <div>
    <div class="item mt-32px">
      <div class="text-14px color-[--secondary-text] text-left">
        <span class="color-[--primary-color] mr-4px text-17px">EVM</span>钱包地址
      </div>
      <div
        class="bg-[--border] rounded-8px text-14px color-[--main-text] flex-start px-12px py-14px mt-8px"
      >
        <span>1111111</span>
        <span class="flex-1"></span>
        <Icon
          v-copy="1111"
          name="bxs:copy"
          class="text-12px ml-2px cursor-pointer color-[--third-text] hover:opacity-80"
          @click.stop.prevent
        />
        <Icon
          name="material-symbols:qr-code"
          class="text-12px ml-2px cursor-pointer color-[--third-text] ml-6px hover:opacity-80"
          @click.stop.prevent
        />
      </div>
    </div>
    <div class="item mt-32px">
      <div class="text-14px color-[--secondary-text] text-left">
        <span class="color-[--primary-color] mr-4px text-17px">solana</span>钱包地址
      </div>
      <div
        class="bg-[--border] rounded-8px text-14px color-[--main-text] flex-start px-12px py-14px mt-8px"
      >
        <span>1111111</span>
        <span class="flex-1"></span>
        <Icon
          v-copy="1111"
          name="bxs:copy"
          class="text-12px ml-2px cursor-pointer color-[--third-text] hover:opacity-80"
          @click.stop.prevent
        />
        <Icon
          name="material-symbols:qr-code"
          class="text-12px ml-2px cursor-pointer color-[--third-text] ml-6px hover:opacity-80"
          @click.stop.prevent
        />
      </div>
    </div>
    <div class="item mt-32px">
      <div class="text-14px color-[--secondary-text] text-left">
        <span>助记词</span>
        <span class="color-[--yellow] text-12px block mt-4px"
          >建议手动抄写下面的助记词并将其保存在安全的地方</span
        >
      </div>

      <div
        class="bg-[--border] rounded-8px text-14px color-[--main-text] flex-start px-12px py-14px mt-8px flex-between"
      >
        <div class="grid">
          <span v-for="(item, $index) in 12" :key="$index">111111</span>
        </div>
        <div class="w-12px h-12px ml-30px">
          <Icon
            v-copy="1111"
            name="bxs:copy"
            class="text-12px ml-2px cursor-pointer color-[--third-text] block hover:opacity-80"
            @click.stop.prevent
          />
        </div>
      </div>

      <el-button class="h-48px! mt-116px" type="primary" size="large" style="width: 100%"> 继续 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { key } from 'localforage'

const botStore = useBotStore()
const configStore = useConfigStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.grid {
  display: flex;
  flex-wrap: wrap; /* 一行放不下自动换行 */
  gap: 10px;
  span {
    text-align: center;
  }
}
</style>
