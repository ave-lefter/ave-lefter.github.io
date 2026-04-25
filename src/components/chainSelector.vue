<template>
  <el-select
    v-model="selectedChain"
    :multiple="multiple"
    :placeholder="placeholder || (t('placeholderPrefix1') + t('chain'))"
    value-key="value"
    size="small"
    :clearable="false"
    style="--el-fill-color-blank:var(--border);"
    :suffix-icon="CaretBottom"
    :class="[props.class, props.wrapperClass,'[&&]:[--el-select-input-color:var(--third-text)]']"
    :teleported="props.teleported||false"
    :popper-class="`${props.popperClass} w-103px chain-selector-popper`"
    :persistent="false"
    @change="handleChange"
    @remove-tag="handleRemoveTag"
  >
    <template #prefix>
      <div class="inline-flex items-center">
        <template v-if="multiple && Array.isArray(selectedChain)">
          <img
            v-for="(chain, index) in selectedChain.slice(0, 2)"
            :key="chain.id"
            :src="`${token_logo_url}chain/${chain.id}.png`"
            class="rd-50%"
            :class="['rounded-50% mr--4px relative','z-'+(index+1), (index === selectedChain.length) && 'mr-0']"
            width="12"
            lazy
            alt=""
          >
          <span :class="['inline-block bg-[#333] text-[#fff] min-w-14px h-14px lh-14px text-12px  border-rd-4px text-center',selectedChain.length===1?'ml-4px':'ml-4px']">{{ selectedChain.length }}</span>
        </template>
        <img
          v-else-if="!multiple && selectedChain && !Array.isArray(selectedChain) && selectedChain?.id"
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
import { SupportMonitorChain } from '@/utils/constants'

const { t } = useI18n()
const { token_logo_url } = storeToRefs(useGlobalStore())

interface ChainOption {
  label: string
  value: string
  id: string
}

interface Props {
  modelValue?: ChainOption | ChainOption[] | null
  placeholder?: string
  chains?: string[]
  showLabel?: boolean
  multiple?: boolean
  class?: string
  teleported?: boolean
  wrapperClass?: string
  popperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '',
  chains: () => [...SupportMonitorChain],
  showLabel: true,
  multiple: false,
  class: 'w-70px!',
  popperClass: '',
  wrapperClass: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ChainOption | ChainOption[] | null): void
  (e: 'change', value: ChainOption | ChainOption[] | null): void
}>()

// 按照 SupportMonitorChain 的顺序排序链选项
function sortChainsBySupportOrder(chains: ChainOption[]): ChainOption[] {
  return chains.sort((a, b) => {
    const indexA = SupportMonitorChain.indexOf(a.id)
    const indexB = SupportMonitorChain.indexOf(b.id)
    // 如果找不到对应的索引，保持原有顺序
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
}

const selectedChain = computed({
  get: () => {
    if (props.multiple) {
      const value = Array.isArray(props.modelValue) ? props.modelValue : []
      return sortChainsBySupportOrder(value)
    } else {
      return Array.isArray(props.modelValue) ? null : props.modelValue
    }
  },
  set: (val) => {
    if (props.multiple && Array.isArray(val)) {
      // 确保至少有一个选项被选中
      if (val.length === 0 && chainOptions.value.length > 0) {
        // 如果尝试清空所有选项，则保留第一个选项
        emit('update:modelValue', sortChainsBySupportOrder([chainOptions.value[0]]))
      } else {
        emit('update:modelValue', sortChainsBySupportOrder(val))
      }
    } else {
      emit('update:modelValue', val)
    }
  }
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

function handleChange(value: ChainOption | ChainOption[] | null) {
  emit('change', value)
}

// 处理标签移除事件，确保至少保留一个选项
function handleRemoveTag() {
  if (props.multiple && Array.isArray(selectedChain.value) && selectedChain.value.length === 0) {
    // 如果移除了最后一个标签，恢复第一个选项
    if (chainOptions.value.length > 0) {
      selectedChain.value = [chainOptions.value[0]]
    }
  }
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
// :deep(.el-select__selection) {
//   display:
// }
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