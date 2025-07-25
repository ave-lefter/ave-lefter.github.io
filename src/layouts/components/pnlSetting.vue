<script setup lang="ts">
const visible = defineModel<boolean>('visible')
const blur = ref(0)
const opacity = ref(100)
const solUsdSwitch = ref(false)
const showU = ref(true)

function beforeUpload(file) {
  // 这里可以加图片大小/比例校验
  return true
}
function resetBg() {
  // 重置背景图片逻辑
}
function onReset() {
  blur.value = 0
  opacity.value = 100
  solUsdSwitch.value = false
  showU.value = true
  resetBg()
}
function onConfirm() {
  // 提交逻辑
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('PnlSetting')"
    width="360px"
    :close-on-click-modal="false"
    class="pnl-setting-dialog"
  >
    <div class="mx--20px border-t-1px border-t-solid border-[--d-333-l-F2F2F2]" />
    <div class="pt-20px">
      <div class="flex justify-between color-[--d-CCC-l-333] text-12px lh-18px mb-16px">
        <span>{{ $t('BackPic') }}</span>
        <div class="flex items-center gap-4px">
          <Icon name="custom:refresh-left" />
          {{ $t('ResetBackPic') }}
        </div>
      </div>
      <el-upload
        class="[--el-fill-color-blank:--d-333-l-F2F2F2] [--el-border-color:--d-333-l-F2F2F2] [--el-color-primary:--d-333-l-F2F2F2] upload"
        accept=".png,.jpg,.jpeg,.webp"
        drag
        :show-file-list="false"
        :limit="1"
        :before-upload="beforeUpload"
      >
        <div class="flex justify-center mb-6px">
          <Icon name="custom:upload-cloud" class="text-24px color-[--d-CCC-l-333]" />
        </div>
        <div class="color-[--d-999-l-666] text-12px lh-18px text-center">
          {{ $t('UploadTips') }}
        </div>
      </el-upload>
      <div class="color-[--d-666-l-999] text-12px mt-2 mb-24px">推荐的宽高比 4:1 和1MB文件大小</div>
    </div>

    <div class="color-[--d-F5F5F5-l-333] lh-20px mb-16px">背景设置</div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px color-[--d-CCC-l-333]">模糊</span>
      <el-input
        v-model.number="blur"
        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
      >
        <template #suffix>px</template>
      </el-input>
    </div>
    <el-slider
      v-model="blur"
      :min="0"
      :max="20"
      :step="1"
      :marks="{
        0: '0',
        5: '5',
        10: '10',
        15: '15',
        20: '20',
      }"
      class="[&&]:[--el-slider-button-size:8px] [--el-color-white:#3F80F7] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px"
    />
    <div class="flex items-center justify-between mt-32px mb-16px">
      <span class="text-12px color-[--d-CCC-l-333]">不透明度</span>
      <el-input
        v-model.number="opacity"
        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
      >
        <template #suffix>px</template>
      </el-input>
    </div>
    <el-slider
      v-model="blur"
      :min="0"
      :max="20"
      :step="1"
      :marks="{
        0: '0',
        5: '5',
        10: '10',
        15: '15',
        20: '20',
      }"
      class="[&&]:[--el-slider-button-size:8px] [--el-color-white:#3F80F7] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px"
    />

    <div class="flex items-center justify-between my-3">
      <span>SOL 和 USD互换</span>
      <el-switch v-model="solUsdSwitch" />
    </div>
    <div class="flex items-center justify-between my-3">
      <span>显示U本位</span>
      <el-switch v-model="showU" />
    </div>

    <template #footer>
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="onConfirm">完成</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.upload {
  :deep {
    .el-upload {
      --el-upload-dragger-padding-horizontal: 15px;
    }
  }
}
:deep{
  .el-slider__stop{
      height: 4px;
      top:-1px;
      --el-slider-stop-bg-color:var(--d-666-l-999);
      --el-border-radius-circle:1px;
    }
    .el-slider__marks-text{
      font-size: 12px;
      color: var(--d-666-l-999);
      margin-top: 6px;
    }
}
</style>
