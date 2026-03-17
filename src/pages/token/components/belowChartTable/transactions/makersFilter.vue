<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  modelValue: {
    type: String,
    default: ''
  },
  chain: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:visible', 'confirm', 'reset'])
const {evmAddress, getWalletAddress} = useBotStore()
const themeStore = useThemeStore()
const tempAddress = shallowRef('')
const walletStore = useWalletStore()
const botStore = useBotStore()
const computedVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})

watch(() => props.modelValue, () => {
  tempAddress.value = props.modelValue
})
const self_address = computed(() => {
  if (props.chain !== 'solana') {
    return botStore.evmAddress || walletStore.address
  } else {
    return botStore.getWalletAddress('solana') || walletStore.address
  }
})
function filterSelfWalletSubmit() {
  if(!verifyLogin()){
    return 
  }
  console.log('filterSelfWalletSubmit',self_address.value)
  tempAddress.value=self_address.value
}
</script>

<template>
  <el-popover
    v-model:visible="computedVisible"
    placement="bottom"
    :width="215"
    trigger="click"
    :persistent="false"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        :class="`${modelValue?'color-[--primary-color]':'color-[--third-text]'} cursor-pointer text-10px`"
      />
    </template>
    <template #default>
      <div class="flex">
        <el-input
          v-model.trim="tempAddress"
          style="--el-input-bg-color: var(--dialog-list-hover);"
          :placeholder="$t('enterAddress')"
          
        />
      </div>
      <el-button
        v-if="evmAddress"
        :key="themeStore.theme"
        class="h-30px mt-20px w-full"
        size="default"
        color="var(--border)"
        @click="filterSelfWalletSubmit"
      >
        {{ $t('filterWallet') }}
      </el-button>
      <div class="flex mt-20px">
        <el-button
          :key="themeStore.theme"
          class="h-30px flex-1 m-l-auto"
          color="var(--border)"
          @click="tempAddress='';emit('confirm')"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button
          type="primary"
          class="h-30px flex-1 m-l-auto"
          @click="emit('confirm',tempAddress)"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>

</style>
