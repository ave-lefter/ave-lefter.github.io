<script setup>
import {setUserTokenStatus} from '@/api/wallet'

const {t} = useI18n()
const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  modelValue: Boolean,
  self_address: String
})
const {updateHolderNum}= storeToRefs(useUserStore())
const themeStore = useThemeStore()
const emit = defineEmits(['update:modelValue', 'hideToken'])
const loading = ref(false)
const hideTokenVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

async function confirm() {
  try {
    loading.value = true
    const {token, chain} = props.row
    await setUserTokenStatus({
      token,
      type: 'blacklist'
    }, props.self_address, chain)
    ElMessage.success(t('success'))
    hideTokenVisible.value = false
    emit('hideToken')
    updateHolderNum.value++
  } catch (e) {
    console.log('=>(tokenList.vue:742) e', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="hide-token">
    <el-dialog
      v-model="hideTokenVisible"
      :title="$t('ConfirmHideToken')"
      class="dialog !w-540px text-12px"
    >
      <div>
        <label class="color-[--d-333-l-f5f5f5] leading-18px ">{{ $t('TokenName') }}</label>
        <div class="mt-10px mb-20px p-10px h-36px rounded-4px color-[--third-text] bg-[--border]">
          {{ row.symbol }}
        </div>
        <label class="color-[--d-333-l-f5f5f5] leading-18px">{{ $t('ContractAddress') }}</label>
        <div class="mt-10px mb-20px p-10px h-36px rounded-4px color-[--third-text] bg-[--border]">
          {{ row.token }}
        </div>
        <div class="flex items-center">
          <el-button
            :key="themeStore.theme"
            color="var(--border)"
            size="default"
            class="flex-1 h-40px"
            @click.stop="hideTokenVisible=false">
            {{ $t('cancel') }}
          </el-button>
          <el-button
            size="default"
            class="flex-1 h-40px "
            type="primary"
            :loading="loading"
            @click.stop="confirm"
          >
            {{ $t('Hide') }}
          </el-button>
        </div>
        <div class="color-#FFA622 text-12px mt-20px">
          *{{ $t('BlockTips') }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.hide-token :deep(.dialog) {
  --el-dialog-padding-primary: 30px 0 0;
  --el-dialog-bg-color: var(--d-222-l-fff);
}
</style>
