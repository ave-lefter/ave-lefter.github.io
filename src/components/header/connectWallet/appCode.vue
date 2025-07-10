<template>
  <div class="text-24px inline-flex items-center">
    <el-icon :size="28" class="clickable" @click="botStore.connectWalletTab = 0">
      <ArrowLeft />
    </el-icon>
    <span class="font-600">App Code</span>
  </div>
  <el-form ref="formAppCode"  class="mt-40px form-container" style="--el-border-radius-base:6px" :model="formData" :rules="rules" label-width="auto" size="large" label-position="top" @submit.prevent="importCode">
    <el-form-item prop="code" label="Code">
      <el-input v-model="formData.code" :rows="5" type="textarea" :placeholder="$t('plsImport')"  clearable/>
    </el-form-item>
    <el-form-item prop="" class="text-center mb-5px!">
      <div class="" style="width: 100%; text-align: center; margin-top: 30px;">
        <div class="text-12px tc w-100% mb-15px color-#f3841e" style="color: #f3841e">{{ $t('importTip') }}</div>
        <el-button
          :color="themeStore.isDark?'#F5F5F5':'#222222'"
          style="width: 100%; border-radius: 8px; height: 48px;" native-type="submit" size="large">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import CryptoJS from 'crypto-js'

const botStore = useBotStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()
const { t } = useI18n()

const formData = reactive({
  code: ''
})


const rules = computed(() => {
  return {
    code: [{ required: true, message: t('cannotBeEmpty'), trigger: 'blur' }]
  }
})

const formRef = useTemplateRef<FormInstance>('formAppCode')

function importCode() {
  formRef.value?.validate((valid) => {
    if (valid) {
      const key = 'f?t}6~fdMmQ6AyN^'
      const msg = CryptoJS.AES.decrypt(formData.code?.trim(), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(key),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      const msgString = msg.toString(CryptoJS.enc.Utf8)
      if (formData.code && msgString?.split('-')?.length == 3) {
        const account = msgString.split('-')[0]
        const signature = msgString.split('-')[1]
        const chainId = msgString.split('-')[2]
        walletStore.chain = getChainInfo(chainId, true).net_name
        walletStore.address = account
        walletStore.provider = null
        walletStore.walletName = 'appCode'
        walletStore.walletSignature[account] = signature
        botStore.connectVisible = false
      } else {
        ElMessage.error(t('plsImportCorrect'))
      }
    } else {
      // this.$message.error(this.$t('plsImportCorrect'))
    }
  })
}


</script>

<style lang="scss" scoped>
.form-container :deep() .el-form-item__label {
  --at-apply: text-14px color-[--d-666-l-999];
}
</style>
