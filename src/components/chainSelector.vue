<template>
  <el-select
    v-model="selectedChain"
    :placeholder="placeholder || (t('placeholderPrefix1') + t('chain'))"
    value-key="value"
    size="small"
    style="--el-fill-color-blank:var(--border);"
    :suffix-icon="CaretBottom"
    :class="[props.class, props.wrapperClass]"
    :teleported="true"
    popper-class="w-103px chain-selector-popper"
    :persistent="false"
    @change="handleChange"
  >
    <template #prefix>
      <div class="inline-flex items-center">
        <img
          v-if="selectedChain?.id"
          :src="`${token_logo_url}chain/${selectedChain.id}.png`"
          class="rd-50%"
          width="12"
          lazy
          alt=""
        >
      </div>
    </template>
    <el-option
      v-for="item in chainOptions"
      :key="item.value"
      :label="props.showLabel ? item.label : ' '"
      :value="item"
      class="h-26px! flex! items-center! font-500! text-14px! lh-none!"
    >
      <img
        :src="`${token_logo_url}chain/${item?.id}.png`"
        class="rd-50% mr-4px"
        width="16"
        lazy
        alt=""
      >
      <span>{{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { CaretBottom } from '@element-plus/icons-vue'
import { SupportFullDataChain } from '@/utils/constants'

const { t } = useI18n()
const { token_logo_url } = storeToRefs(useGlobalStore())

interface ChainOption {
  label: string
  value: string
  id: string
}

interface Props {
  modelValue?: ChainOption | null
  placeholder?: string
  chains?: string[]
  showLabel?: boolean
  class?: string
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '',
  chains: () => [...SupportFullDataChain],
  showLabel: true,
  class: 'w-70px!',
  wrapperClass: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ChainOption | null): void
  (e: 'change', value: ChainOption | null): void
}>()

const selectedChain = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const chainOptions = computed(() => {
  return props.chains.map(el => {
    const chainInfo = getChainInfo(el)
    return {
      label: el === 'solana' ? 'SOL' : chainInfo.net_name.toUpperCase(),
      value: chainInfo.chain_id,
      id: chainInfo.net_name
    }
  })
})

function handleChange(value: ChainOption | null) {
  emit('change', value)
}
</script>

<style scoped lang="scss">
:deep() .el-select--small .el-select__wrapper {
  font-size: 10px;
  font-weight: 500;
}

:deep() .el-select-dropdown__list {
  padding: 12px 0;
}

:deep(.chain-selector-popper) {
  z-index: 9999 !important;
}
</style>

<style lang="scss">
// 全局样式：用于自定义 .el-select__wrapper 的样式
// 使用方式：通过 wrapperClass prop 传递类名，然后在这里定义对应的样式
// 
// 示例：
// <ChainSelector wrapper-class="my-custom-wrapper" />
// 
// 然后在这里定义：
// .my-custom-wrapper {
//   .el-select__wrapper {
//     background-color: red;
//     border-radius: 8px;
//   }
// }
</style>