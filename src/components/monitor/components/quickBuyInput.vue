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
  }
})

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
    v-model.trim="quickBuyValue"
    :size="size"
    clearable
    placeholder="0"
    class="[--el-fill-color-blank:--d-222-l-FFF] [--el-component-size-small:22px] [&&]:[--el-input-width:88px] [--el-text-color-regular:--d-999-l-666] [--el-input-icon-color:--d-999-l-666] [--el-text-color-placeholder:--d-999-l-666]"
    @input="handleInput"
    @blur="handleBlurBuyValue"
  >
    <template
      #prefix
    >
      <Icon
        name="mynaui:lightning-solid"
      />
    </template>
  </el-input>
</template>

<style scoped lang="scss">

</style>
