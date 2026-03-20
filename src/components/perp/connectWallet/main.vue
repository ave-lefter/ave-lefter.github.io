<template>
  <div>
    <img
      v-if="themeStore.isDark" src="@/assets/images/logo1-83.29x21.97.png" alt="logo" height="21.97"
      loading="lazy">
    <img v-else src="@/assets/images/logo2-83.29x21.97.png" alt="logo" height="21.97" loading="lazy">
  </div>
  <div class='w-content mt-40px'>
    <h3 class="font-700 flex items-center justify-center text-40px mb-40px lh-none decoration-none">
      {{ title }}
    </h3>
    <div class="m-content">
      <div class="text-14px text-center min-h-200px">
        <emailRegisterAndLogin ref="loginForm" v-model:cType="emailRegisterType" @close="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import emailRegisterAndLogin from './emailRegisterAndLogin.vue'
defineEmits(['close'])
// import { getTonWallets } from '~/utils/wallet/ton'
const emailRegisterType = ref('login')
const themeStore = useThemeStore()
const { t } = useI18n()
const title = computed(() => {
  return t('loginAve')
})


defineExpose({ emailRegisterType })


</script>

<style scoped lang='scss'>

// :deep() .el-input {
//   --el-input-border-color: #444444;
//   --el-input-placeholder-color: var(--d-666-l-999);
//   --el-text-color-placeholder: #999;
//   --el-input-bg-color: var(--d-333-l-F2F2F2)
// }

:deep() .el-input__wrapper {
  border: none;
  border-radius: 6px;
  box-shadow: none;

  &:hover {
    box-shadow: 0 0 0 1px #3F80F7 inset;
  }
}

.w-content {
  // display: inline-block;

  .m-content {
    // width: 420px;
    // margin: 0 auto;

    :deep() .el-input.el-input--large {
      height: 48px;
    }

    :deep() .el-select--large .el-select__wrapper {
      height: 48px;
    }

    :deep() .el-form-item__label {
      color: var(--d-999-l-222);
    }
  }

  .connect-popup-title2 {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    text-decoration-skip-ink: none;
    color: #999999;
  }
}

.light {
  .w-content {
    .connect-popup-title {
      color: #333;
    }

    .m-content .tabs {
      color: #222222;
    }

    .m-content :deep() .el-input {
      --el-input-border-color: #D8D8DC
    }
  }
}

:deep() .el-overlay {
  backdrop-filter: blur(1px);
}
</style>
