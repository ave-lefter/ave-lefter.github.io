<template>
  <div>
    <!-- 自定义设置对话框 -->
    <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :title="$t('customSetting')"
      width="500px"
      :close-icon="Close"
      append-to-body
      class="custom-settings-dialog"
    >
      <!-- 显示设置部分 -->
      <div class="settings-section">
        <h3 class="section-title">显示设置</h3>
        
        <div class="setting-item">
          <div class="setting-header">
            <!-- <el-color-picker-panel v-model="quoteColor" /> -->
            <el-tooltip trigger="click" :teleported="false" :persistent="false">
              <div
                class="w-16px h-16px rounded-4px border-solid border-[--border] cursor-pointer"
                :style="{ background: quoteColor }"
              />
              <template #content>
                <el-color-picker-panel v-model="quoteColor" />
              </template>
            </el-tooltip>
            <label class="setting-label">双引号</label>
            <el-icon class="info-icon"><QuestionFilled /></el-icon>
          </div>
          <p class="setting-description">
            高亮引号内的文字（如"col"、"name"）
          </p>
        </div>
      </div>

      <!-- 自定义代币部分 -->
      <div class="settings-section mt-6">
        <h3 class="section-title">自定义代币</h3>
        
        <div class="token-inputs grid grid-cols-2 gap-4">
          <!-- 代币符号 -->
          <div class="token-input-group">
            <div class="input-header">
              <!-- <el-color-picker-panel v-model="quoteColor" /> -->
              <el-tooltip trigger="click" :teleported="false" :persistent="false">
                <div
                  class="w-16px h-16px rounded-4px border-solid border-[--border] cursor-pointer"
                  :style="{ background: symbolColor }"
                />
                <template #content>
                  <el-color-picker-panel v-model="symbolColor" />
                </template>
              </el-tooltip>
              <label class="input-label">代币符号</label>
              <el-icon class="info-icon"><QuestionFilled /></el-icon>
            </div>
          
          </div>

          <!-- 代币地址 -->
          <div class="token-input-group">
            <div class="input-header">
              <el-tooltip trigger="click" :teleported="false" :persistent="false">
                <div
                  class="w-16px h-16px rounded-4px border-solid border-[--border] cursor-pointer"
                  :style="{ background: tokenAddressColor }"
                />
                <template #content>
                  <el-color-picker-panel v-model="tokenAddressColor" />
                </template>
              </el-tooltip>
              <label class="input-label">代币地址</label>
              <el-icon class="info-icon"><QuestionFilled /></el-icon>
            </div>
         
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Close, QuestionFilled } from '@element-plus/icons-vue'
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

<style scoped>
:deep(.custom-settings-dialog) {
  --el-dialog-bg-color: #1a1a1a;
  --el-dialog-border-color: #333;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #333;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-input__wrapper) {
  background-color: #2a2a2a;
  border: 1px solid #444;
}

:deep(.el-input__inner) {
  color: #fff;
  background-color: transparent;
}

:deep(.el-input__inner::placeholder) {
  color: #888;
}
</style>

<style scoped lang="scss">
.settings-section {
  margin-bottom: 24px;

  .section-title {
    margin: 0 0 16px 0;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .setting-item {
    margin-bottom: 16px;

    .setting-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .setting-label {
        color: #fff;
        font-size: 13px;
        cursor: pointer;
      }

      .info-icon {
        color: #888;
        font-size: 14px;
        cursor: help;
      }
    }

    .setting-description {
      margin: 0 0 0 32px;
      color: #888;
      font-size: 12px;
      line-height: 1.5;
    }
  }
}

.token-inputs {
  .token-input-group {
    .input-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .input-label {
        color: #fff;
        font-size: 13px;
        cursor: pointer;
      }

      .info-icon {
        color: #888;
        font-size: 14px;
        cursor: help;
      }
    }
  }
}

.mt-6 {
  margin-top: 24px;
}

.mt-2 {
  margin-top: 8px;
}

.gap-4 {
  gap: 16px;
}
</style>