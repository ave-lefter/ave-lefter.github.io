<script setup lang="ts">
import pnlImg from '@/assets/images/pnl.png'
const visible = defineModel<boolean>('visible')
const pnlSetting = defineModel<any>('pnlSetting')

const { t } = useI18n()
const defaultSettings = {
  chain: 'solana',
  background: pnlImg,
  blur: 0,
  opacity: 100,
  solUsdSwitch: false,
  showU: true,
}
const settings = ref(pnlSetting.value ? { ...pnlSetting.value } : { ...defaultSettings })
watch(visible, () => {
  if (visible.value) {
    settings.value = pnlSetting.value ? { ...pnlSetting.value } : { ...defaultSettings }
  }
})
const themeStore = useThemeStore()
const supportChains = ['solana', 'bsc']

function beforeUpload(file: File) {
  if (file.size > 200 * 1024) {
    ElMessage.error(t('max200KB'))
    return false
  }
  // 这里可以加图片大小/比例校验
  return true
}
function resetBg() {
  settings.value.background = pnlImg
}
function onReset() {
  pnlSetting.value = { ...defaultSettings }
  visible.value = false
}
function onConfirm() {
  pnlSetting.value = { ...settings.value }
  // 提交逻辑
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :z-index="10001"
    align-center
    :title="$t('PnlSetting')"
    width="360px"
    :close-on-click-modal="false"
    class="pnl-setting-dialog"
  >
    <div class="mx--20px border-t-1px border-t-solid border-[--d-333-l-F2F2F2]" />
    <div class="flex pt-20px items-center justify-between">
      <span class="color-[--d-CCC-l-333] text-12px">{{ $t('selectChain') }}</span>
      <div class="flex items-ceter gap-4px px-4px py-2px rounded-4px bg-[--d-333-l-F2F2F2]">
        <div
          v-for="chain in supportChains"
          :key="chain"
          class="cursor-pointer rounded-4px px-4px py-2px"
          :class="settings.chain === chain ? 'bg-[--d-111-l-FFF]' : ''"
          @click="settings.chain = chain"
        >
          <ChainToken :chain="chain" :width="16" />
        </div>
      </div>
    </div>
    <div class="pt-20px">
      <div class="flex justify-between color-[--d-CCC-l-333] text-12px lh-18px mb-16px">
        <span>{{ $t('backgroundImage') }}</span>
        <div class="flex items-center gap-4px cursor-pointer" @click="resetBg">
          <Icon name="custom:refresh-left" />
          {{ $t('resetBackground') }}
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
        <div class="w-320px h-80px bg-cover flex items-center">
          <img
            :src="settings.background"
            alt="background"
            class="absolute top-0 left-0 w-full h-full object-cover"
            :style="{
              filter: `blur(${settings.blur}px) opacity(${settings.opacity}%)`,
            }"
          >
          <div class="relative flex-1 flex flex-col items-center">
            <div class="color-#F5F5F5 font-bold mb-2px flex items-center gap-4px text-16px lh-20px">
              <ChainToken :chain="settings.chain" :width="16" />
              {{ settings.solUsdSwitch ? '$1.29' : 1.29 }}
            </div>
            <span v-if="settings.showU" class="color-#F5F5F5 mb-2px text-12px lh-16px">
              $1.29
            </span>
            <div class="color-[--d-999-l-666] text-12px lh-16px">
              {{ $t('balance1') }}
            </div>
          </div>
          <div class="relative flex-1 flex flex-col items-center">
            <div class="color-#F5F5F5 font-bold mb-2px flex items-center gap-4px text-16px lh-20px">
              <ChainToken :chain="settings.chain" :width="16" />
              <span class="color-#12B886"> +{{ settings.solUsdSwitch ? '$1.29' : '1.29' }} </span>
            </div>
            <span v-if="settings.showU" class="mb-2px text-12px lh-16px color-#12B886">
              +$1.29
            </span>
            <div class="color-#12B886 text-12px lh-16px">+100%</div>
          </div>
          <div
            class="opacity-0 hover:opacity-100 absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col items-center justify-center"
          >
            <div
              class="flex relative justify-center mb-6px"
              :class="settings.background ? 'color-#F5F5F5' : 'color-[--d-CCC-l-333]'"
            >
              <Icon name="custom:upload-cloud" class="text-24px" />
            </div>
            <div
              class="text-12px relative lh-18px text-center"
              :class="settings.background ? 'color-#F5F5F5' : 'color-[--d-999-l-666]'"
            >
              {{ $t('uploadImage') }}
            </div>
          </div>
        </div>
      </el-upload>
      <div class="color-[--d-666-l-999] text-12px mt-2 mb-24px">
        {{ $t('recommendedAspectRatio') }}
      </div>
    </div>

    <div class="color-[--d-CCC-l-333] lh-20px mb-16px">{{ $t('setBackground') }}</div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px color-[--d-CCC-l-333]">{{ $t('blur') }}</span>
      <el-input
        v-model.number="settings.blur"
        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
      >
        <template #suffix>px</template>
      </el-input>
    </div>
    <el-slider
      v-model="settings.blur"
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
      <span class="text-12px color-[--d-CCC-l-333]">{{ $t('opacity') }}</span>
      <el-input
        v-model.number="settings.opacity"
        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
      >
        <template #suffix>%</template>
      </el-input>
    </div>
    <el-slider
      v-model="settings.opacity"
      :min="0"
      :max="100"
      :step="1"
      :marks="{
        0: '0',
        25: '25',
        50: '50',
        75: '75',
        100: '100',
      }"
      class="[&&]:[--el-slider-button-size:8px] [--el-color-white:#3F80F7] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px"
    />

    <div class="flex items-center justify-between mt-40px">
      <span class="color-[--d-CCC-l-333] text-12px"
        >{{ getChainInfo(settings.chain)?.main_name }}{{ $t('solUsdSwitch') }}</span
      >
      <el-switch
        v-model="settings.solUsdSwitch"
        class="[&&]:h-20px"
        @change="settings.showU = false"
      />
    </div>
    <div class="flex items-center justify-between mt-24px">
      <span class="color-[--d-CCC-l-333] text-12px">{{ $t('showU') }}</span>
      <el-switch
        v-model="settings.showU"
        class="[&&]:h-20px"
        @change="settings.solUsdSwitch = false"
      />
    </div>

    <template #footer>
      <div class="flex">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="themeStore.isDark ? '#333' : '#F2F2F2'"
          @click="onReset"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" class="h-30px flex-1 m-l-auto" @click="onConfirm">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.upload {
  :deep {
    .el-upload {
      --el-upload-dragger-padding-horizontal: 0;
      --el-upload-dragger-padding-vertical: 0;
    }
    .el-upload-dragger {
      border: 0 none;
    }
  }
}
:deep {
  .el-slider__stop {
    height: 4px;
    top: -1px;
    --el-slider-stop-bg-color: var(--d-666-l-999);
    --el-border-radius-circle: 1px;
  }
  .el-slider__marks-text {
    font-size: 12px;
    color: var(--d-666-l-999);
    margin-top: 6px;
  }
}
</style>
