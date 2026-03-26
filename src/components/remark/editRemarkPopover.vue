<template>
  <Icon :key="`remark-${address}-${chain}`" name="custom:remark" class="icon-remark text-12px clickable ml-5px" @click.stop.prevent @mouseover.stop="onEnter" />
</template>

<script setup lang="ts">
import RemarkForm from './remarkForm.vue'
import { getRemarkByAddress } from '@/utils'

// interface Props {
//   popoverProps?: Record<string, any>
//   address?: string
//   remark?: string
//   chain?: string
//   inline?: boolean
// }

const props = defineProps({
  popoverProps: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  address: { type: String as PropType<string>, default: '' },
  remark: { type: String as PropType<string>, default: '' },
  chain: { type: String as PropType<string>, default: '' },
  appendTo: { type: [String, Number, HTMLElement] as PropType<string | number | HTMLElement>, default: 'body' },
})
const emit = defineEmits<{
  (e: 'confirm', data: { remark: string }): void
}>()

const target = ref<HTMLElement | null>(null)
const { $popover } = useNuxtApp()

const hide = () => {
  $popover?.hide()
}

const onSubmit = (data: { remark: string }) => {
  emit('confirm', data)
  hide()
}

const onEnter = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement // 使用 currentTarget 确保指向 Icon 元素本身
  // if (!el || target.value === el) return

  // 1. 记录当前目标并关闭旧的 Popover
  hide()
  target.value = el

  // 2. 获取备注内容（工具函数 -> Props -> 空字符串）
  const currentRemark = getRemarkByAddress?.({ address: props.address || '', chain: props.chain || ''}) || props.remark || ''
  // const tableEl = el.closest('.el-table') || el.closest('table') || el.parentElement

  // 3. 触发 Popover 显示
  $popover?.show({
    target: el,
    content: {
      is: RemarkForm,
      props: {
        modelValue: currentRemark,
        onSubmit,
        onCancel: hide
      }
    },
    props: {
      placement: 'right',
      width: '250',
      trigger: 'click',
      persistent: false,
      // 核心优化：将 Popover 挂载到图标的父容器，解决滚动遮挡或层级问题
      appendTo: props.appendTo === 1 ? el?.parentElement : (props.appendTo || 'body'),
      ...(props.popoverProps || {})
    }
  })
}
</script>
