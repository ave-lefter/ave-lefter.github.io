<template>
  <div class="text-24px inline-flex items-center">
    <el-icon :size="28" class="clickable" @click="botStore.connectWalletTab = 0">
      <ArrowLeft />
    </el-icon>
    <span class="font-600">{{ $t('importAddress') }}</span>
  </div>
  <el-form ref="form" class="mt-40px form-container" style="--el-border-radius-base:6px" :model="watchWalletForm" :rules="rules" label-width="0" size="large" label-position="top" @submit.prevent="importAddress">
    <el-form-item prop="chain" :label="$t('selectNetwork')">
      <el-select
        v-model="watchWalletForm.chain"
        filterable
        placeholder="Select"
        style="width: 100%;height: 48px;"
        size="large"
        :filter-method="chainFilterMethod"
      >
        <template #prefix>
          <div class="h-32px inline-flex items-center">
            <img :src="`${configStore.token_logo_url}chain/${watchWalletForm.chain}.png`" class="rd-50%" width="32" lazy alt="">
          </div>
        </template>
        <el-option
          v-for="item in chains"
          :key="item.net_name"
          :label="item.name"
          :value="item.net_name"
          class="h-48px! flex items-center"
        >
          <img :src="`${configStore.token_logo_url}chain/${item.net_name}.png`" class="rd-50% mr-5px" width="32" lazy alt="">
          <span>{{ item.name || '' }}</span>
          <span class="ml-auto color-[--d-666-l-999] text-12px">{{ item.description || '' }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="address" :label="$t('address')">
      <el-input v-model="watchWalletForm.address" :placeholder="$t('enterAddress')" clearable style="--el-input-inner-height:48px"/>
    </el-form-item>
    <el-form-item prop="" class="text-center mb-5px!">
      <div class="" style="width: 100%; text-align: center; margin-top: 30px;">
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

const botStore = useBotStore()
const configStore = useConfigStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()
const { t } = useI18n()

const watchWalletForm = reactive({
  address: '',
  chain: 'bsc',
})
const queryChain = ref('')
const chains = computed(() => {
  return configStore.chainConfig?.filter?.(i => {
    const reg = new RegExp(queryChain.value, 'i')
    return (i.vm_type === 'evm' || i.net_name === 'tron' || i.net_name === 'solana') && (reg.test(i.name || '') || reg.test(i.net_name))
  })
})

const validateAddress = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (value === '') {
    callback(new Error(t('cannotBeEmpty')))
  } else if (!isValidAddress(value, watchWalletForm.chain)) {
    callback(new Error(t('pleaseEnterCorrectAddress')))
  } else {
    callback()
  }
}

const rules = computed(() => {
  return {
    address: [{ validator: validateAddress, trigger: 'blur' }],
  }
})

function chainFilterMethod(query: string) {
  queryChain.value = query
}

const formRef = useTemplateRef<FormInstance>('form')

function importAddress() {
  formRef.value?.validate((valid) => {
    if (valid) {
      walletStore.address = watchWalletForm.address
      walletStore.chain = watchWalletForm.chain
      walletStore.provider = null
      walletStore.walletName = 'WatchWallet'
      botStore.connectVisible = false
    }
  })
}


</script>

<style lang="scss" scoped>
.form-container :deep() .el-form-item__label {
  --at-apply: text-14px color-[--d-666-l-999];
}
</style>
