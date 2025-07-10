<template>
  <el-dialog v-model="botStore.connectVisible" width="500" height='630' :class="['dialog-connect', theme]" append-to-body>
    <div :class="botStore.connectWalletTab === 1 ? 'min-h-560px' : ''">
      <component :is="tabCom" />
    </div>
  </el-dialog>
</template>

<script setup lang='ts'>
import Main from './main.vue'
// import ExtensionWallet from './extensionWallet.vue'
// import WatchWallet from './watchWallet.vue'

const botStore = useBotStore()
const { theme } = storeToRefs(useThemeStore())

const tabCom = computed(() => {
  const connectWalletTab = botStore.connectWalletTab as 1 | 2
  const comments = {
    0: Main,
    1: defineAsyncComponent(() => import('./extensionWallet.vue')),
    // 1: ExtensionWallet,
    2: defineAsyncComponent(() => import('./watchWallet.vue')),
    3: defineAsyncComponent(() => import('./appCode.vue')),
  }
  return connectWalletTab in comments ? comments[connectWalletTab] : null
})


</script>

<style lang='scss'>
.dialog-connect.el-dialog {
  font-family: DIN Pro;
  position: relative;
  border-radius: 15px;
  border-width: 0!important;
  min-width: 500px;
  min-height: 300px;
  padding: 40px 40px;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222222;
  border: 1px solid #27282B;
  margin: 0;
  --el-dialog-padding-primary: 0px;
  .el-dialog__headerbtn {
    top: 29px;
    right: 20px;
  }

  &.light {
    background: var(--d-131722-l-FFF) !important;
    border-color: #D8D8DC;
  }
}


.w-selectNet-popup.el-popper {
  max-width: 420px;
}
</style>

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
  display: inline-block;

  .m-content {
    width: 420px;
    margin: 0 auto;

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

  .connect-popup-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    font-weight: 700;
    line-height: 100%;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #F5F5F5;
    margin-bottom: 40px;

    .el-icon {
      font-size: 16px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
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
