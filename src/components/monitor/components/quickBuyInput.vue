<script setup lang="ts">
import BigNumber from 'bignumber.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '0.01'
  },
  size: {
    type: String,
    default: ''
  },
  showChainIcon: {
    type: Boolean,
    default: false
  },
  inputStyle:{
    type: String,
    default: ''
  },
  chain: {
    type: String,
    default: 'solana'
  }
})
const configStore = useConfigStore()
const emit = defineEmits(['update:modelValue'])
const quickBuyValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function handleInput(value: string) {
  quickBuyValue.value = value.replace(/-|[^\d.]/g, '')
}

function handleBlurBuyValue() {
  const decimals = 4
  const v1 = new BigNumber(quickBuyValue.value || 0)
    .toFixed()
    .match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0]
  if (String(quickBuyValue.value) !== String(v1)) {
    if (quickBuyValue.value === '') {
      quickBuyValue.value = ''
    } else if (Number(v1) === 0) {
      quickBuyValue.value = '0'
    } else {
      quickBuyValue.value = v1 || '0'
    }
  }
}
</script>

<template>
  <el-input
    :style="inputStyle"
    v-model.trim="quickBuyValue"
    :size="size"
    clearable
    placeholder="0"
    class="[&&]:[--el-input-bg-color:--dialog-list-hover] [--el-component-size-small:22px] [&&]:[--el-input-width:68px] [--el-text-color-regular:--secondary-text] [--el-input-icon-color:--secondary-text] [--el-text-color-placeholder:--secondary-text] [--el-border-color:transparent]"
    @input="handleInput"
    @blur="handleBlurBuyValue"
  >
    <template
      #prefix
    >
      <img
        v-if="showChainIcon&&chain"
        class="rounded-full w-14px h-14px mr-4px!"
        :src="`${configStore.token_logo_url}chain/${chain}.png`"
        alt=""
        onerror="this.src='/icon-default.png'"
        srcset=""
      >
      <Icon
        v-else
        name="mynaui:lightning-solid"
      />
    </template>
  </el-input>
</template>

<style scoped lang="scss">
  :deep() .el-input__prefix-inner > :last-child{
    margin-right: 4px;
  }
  :deep() .el-input__wrapper{
    padding: 2px 4px;
  }
</style>
