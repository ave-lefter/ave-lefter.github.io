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
</script>

<template>
  <el-popover
    v-model:visible="computedVisible"
    placement="bottom"
    :width="215"
    trigger="click"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        :class="`${modelValue?'color-[--secondary-text]':'color-[--third-text]'} cursor-pointer text-10px`"
      />
    </template>
    <template #default>
      <div class="flex">
        <el-input
          v-model.trim="tempAddress"
          style="--el-input-bg-color: var(--dialog-list-hover);"
          :placeholder="$t('enterAddress')"
          clearable
        />
      </div>
      <el-button
        v-if="evmAddress"
        :key="themeStore.theme"
        class="h-30px mt-20px w-full"
        size="default"
        color="var(--border)"
        @click="tempAddress=getWalletAddress(chain)||''"
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
