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
            <div class="flex gap-4px items-center">
              <div class="setting-label">{{ $t('doubleQuotes') }}</div>
              <Icon name="mingcute:refresh-1-line"></Icon>
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
              <div class="flex gap-4px items-center">
                <div class="setting-label">{{ $t('symbol') }}</div>
                <Icon name="mingcute:refresh-1-line"></Icon>
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
              <div class="flex gap-4px items-center">
                <div class="setting-label">{{ $t('tokenAddress') }}</div>
                <Icon name="mingcute:refresh-1-line"></Icon>
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

const quoteColor = useLocalStorage('tw-quoteColor', '#3F80F7')
const symbolColor = useLocalStorage('tw-symbolColor', '#FFA622')
const tokenAddressColor = useLocalStorage('tw-tokenAddressColor', '#3F80F7')
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
</style>