<template>
  <div v-if="emailRegisterType !== 'reset'">
    <img
      v-if="themeStore.isDark" src="@/assets/images/logo1-83.29x21.97.png" alt="logo" height="21.97"
      loading="lazy">
    <img v-else src="@/assets/images/logo2-83.29x21.97.png" alt="logo" height="21.97" loading="lazy">
  </div>
  <keep-alive>
    <component :is="ResetCom" v-if="emailRegisterType == 'reset'" v-model:cType="emailRegisterType" />
  </keep-alive>
  <div v-show="emailRegisterType !== 'reset'" class='w-content mt-40px'>
    <h3 v-show="emailRegisterType !== 'reset'" class="font-700 flex items-center justify-center text-40px mb-40px lh-none decoration-none">
      <el-icon
        v-if="botStore.connectWalletTab !== 0"
        :size="35" style="color:var(--d-999-l-222);"
        @click="botStore.connectWalletTab = 0">
        <ArrowLeft />
      </el-icon>
      {{ title }}
    </h3>
    <div class="m-content">
      <div v-show="botStore.connectWalletTab === 0" class="text-14px text-center min-h-200px">
        <emailRegisterAndLogin ref="loginForm" v-model:cType="emailRegisterType">
          <!-- <template v-if="emailRegisterType === 'login'">
            <button class="w-full bg-[--d-333-l-F2F2F2] h-40px flex items-center justify-center border-none mt-20px rd-6px px-12px clickable"  @click.stop="botStore.connectWalletTab = 1">
              <span class="mr-auto">{{ $t('chainWallet') }}</span>
              <img class="mr-10px" src="@/assets/images/wallet/metaMask.png"  width="20" alt="metamask" srcset="" lazy>
              <img class="mr-10px" src="@/assets/images/wallet/phantom.png"  width="20" alt="phantom" srcset="" lazy>
              <img class="mr-10px" src="@/assets/images/wallet/okx.png"  width="20" alt="okx" srcset="" lazy>
              <img class="mr-8px" src="@/assets/images/wallet/wc.png"  width="20" alt="wc" srcset="" lazy>
              <Icon class="text-14px color-[--d-666-l-999]" name="ep:arrow-right" />
            </button>
            <ul class="flex items-center justify-center gap-8px mt-20px">
              <template v-for="(item, k) in tabs" :key="item.value">
                <li class="text-14px clickable underline" @click.stop="botStore.connectWalletTab = item.value">{{ item.label }}</li>
                <li v-if="k !== tabs.length - 1">|</li>
              </template>
            </ul>
          </template> -->
        </emailRegisterAndLogin>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ArrowLeft } from '@element-plus/icons-vue'
import emailRegisterAndLogin from './emailRegisterAndLogin.vue'
const emailRegisterType = ref('login')
const botStore = useBotStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const ResetCom = defineAsyncComponent(() => import('./reset.vue'))

const title = computed(() => {
  const connectWalletTab = botStore.connectWalletTab
  if (connectWalletTab == 0) {
    if (emailRegisterType.value == 'login') {
      return t('loginBot')
    } else if (emailRegisterType.value == 'register') {
      return t('registerBot')
    } else {
      return t('tgBotWallet')
    }
  } else if (connectWalletTab == 1) {
    return t('connectChainWallet')
  } else if (connectWalletTab == 2) {
    return t('importAddress')
  } else if (connectWalletTab == 3) {
    return t('appCode')
  } else {
    return t('connectWallet')
  }
})

const tabs = computed(() => {
  return [
    // {
    //   label: t('chainWallet'),
    //   value: 1
    // },
    {
      label: t('importAddress'),
      value: 2
    },
    {
      label: t('appCode'),
      value: 3
    }
  ]
})

watch(() => botStore.connectVisible, (val) => {
  if (!val && (emailRegisterType.value === 'reset' || emailRegisterType.value === 'register')) {
    nextTick(() => {
      emailRegisterType.value = 'login'
    })
  }
})

defineExpose({ emailRegisterType })


</script>

<style scoped lang='scss'>

:deep() .el-input {
  --el-input-border-color: #444444;
  --el-input-placeholder-color: var(--d-666-l-999);
  --el-text-color-placeholder: #999;
  --el-input-bg-color: var(--d-333-l-F2F2F2)
}

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
