<template>
  <div>
    <!-- 自定义设置对话框 -->
    <el-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
      :title="$t('customSetting')" width="500px" class="w-orderBookDialog" append-to-body>
      <div class="mx--16px h-1px bg-[--border] mb-20px" />
      <!-- 显示设置部分 -->
      <div class="settings-section">
        <h3 class="section-title">{{ $t('twDisplaySettings') }}</h3>

        <div class="setting-item flex gap-12px">
          <div class="setting-header flex gap-4px items-center">
            <!-- <el-color-picker-panel v-model="quoteColor" /> -->
            <el-tooltip trigger="click" :teleported="false" :persistent="false">
              <div class="w-16px h-16px rounded-4px cursor-pointer" :style="{ background: quoteColor }" />
              <template #content>
                <el-color-picker-panel v-model="quoteColor" />
              </template>
            </el-tooltip>
          </div>
          <div class="flex gap-8px flex-col">
            <div class="flex gap-4px items-center cursor-pointer"  @click="reset('quoteColor')">
              <div class="setting-label">{{ $t('doubleQuotes') }}</div>
              <Icon name="mingcute:refresh-1-line" class="mt-2px" :class="{ 'active': isRotatingQuote }"></Icon>
            </div>
            <div class="setting-description">
              {{ $t('doubleQuotesDesc') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义代币部分 -->
      <div class="settings-section mt-6">
        <h3 class="section-title">{{ $t('customTokens') }}</h3>

        <div class="token-inputs grid grid-cols-2 gap-4">
          <!-- 代币符号 -->
          <div class="setting-item flex gap-12px">
            <div class="setting-header flex items-center">
              <!-- <el-color-picker-panel v-model="quoteColor" /> -->
              <el-tooltip trigger="click" :teleported="false" :persistent="false">
                <div class="w-16px h-16px rounded-4px cursor-pointer" :style="{ background: symbolColor }" />
                <template #content>
                  <el-color-picker-panel v-model="symbolColor" />
                </template>
              </el-tooltip>
            </div>
            <div class="flex gap-8px flex-col">
              <div class="flex gap-4px items-center cursor-pointer"  @click="reset('symbolColor')">
                <div class="setting-label">{{ $t('symbol') }}</div>
                <Icon name="mingcute:refresh-1-line" class="mt-2px" :class="{ 'active': isRotatingSymbol }"></Icon>
              </div>
              <div class="setting-description">
                {{ $t('symbolDesc') }}
              </div>
            </div>
          </div>

          <div class="setting-item flex gap-12px">
            <div class="setting-header flex  items-center">
              <!-- <el-color-picker-panel v-model="quoteColor" /> -->
              <el-tooltip trigger="click" :teleported="false" :persistent="false">
                <div class="w-16px h-16px rounded-4px cursor-pointer" :style="{ background: tokenAddressColor }" />
                <template #content>
                  <el-color-picker-panel v-model="tokenAddressColor" />
                </template>
              </el-tooltip>
            </div>
            <div class="flex gap-8px flex-col">
              <div class="flex gap-4px items-center cursor-pointer"  @click="reset('tokenAddressColor')">
                <div class="setting-label">{{ $t('tokenAddress') }}</div>
                <Icon name="mingcute:refresh-1-line" class="mt-2px" :class="{ 'active': isRotatingTokenAddress }"></Icon>
              </div>
              <div class="setting-description">
                {{ $t('tokenAddressDesc') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const quoteColor = useLocalStorage('tw-quoteColor', '#19d92f')
const symbolColor = useLocalStorage('tw-symbolColor', '#FFA622')
const tokenAddressColor = useLocalStorage('tw-tokenAddressColor', '#3F80F7')

const isRotatingQuote = ref(false);
const isRotatingSymbol = ref(false);
const isRotatingTokenAddress = ref(false);

const colorMap = {
  quoteColor,
  symbolColor,
  tokenAddressColor
};

const rotatingRefMap = {
  quoteColor: isRotatingQuote,
  symbolColor: isRotatingSymbol,
  tokenAddressColor: isRotatingTokenAddress
};

function reset(key: 'quoteColor' | 'symbolColor' | 'tokenAddressColor') {
  const defaultColor = {
    quoteColor: '#19d92f',
    symbolColor: '#FFA622',
    tokenAddressColor: '#3F80F7'
  };
  colorMap[key].value = defaultColor[key];
  rotatingRefMap[key].value = true;
  setTimeout(() => {
    rotatingRefMap[key].value = false;
  }, 500);
}
// function reset(key: 'quoteColor' | 'symbolColor' | 'tokenAddressColor') {
//   const resetValues = {
//     quoteColor: '#3F80F7',
//     symbolColor: '#FFA622',
//     tokenAddressColor: '#3F80F7',
//   }

//   const resetFlags = {
//     quoteColor: 'isRotatingQuote',
//     symbolColor: 'isRotatingSymbol',
//     tokenAddressColor: 'isRotatingTokenAddress',
//   }

//   const targetValue = resetValues[key]
//   const targetFlag = resetFlags[key]

//   if (typeof targetValue !== 'undefined') {
//     (window as any)[key].value = targetValue
//     (window as any)[targetFlag].value = true
//     setTimeout(() => {
//       (window as any)[targetFlag].value = false
//     }, 200)
//   }
// }
</script>

<style lang="scss" scoped>
:deep() .w-orderBookDialog.el-dialog {
  .el-dialog__header .el-dialog__title {
    color: var(--main-text1)
  }

  .el-dialog__body {
    color: var(--main-text1)
  }
}

.section-title {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  vertical-align: middle;
  color: var(--third-text1);
  margin-bottom: 8px
}

.setting-label {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0px;
  vertical-align: middle;
  color: var(--main-text1)
}

.setting-description {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0%;
  color: var(--third-text1)
}

.setting-item {
  background: var(--border);
  padding: 12px 16px;
  border-radius: 8px;
}

/* 定义旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.active {
  animation: rotate 0.5s linear;
}
</style>