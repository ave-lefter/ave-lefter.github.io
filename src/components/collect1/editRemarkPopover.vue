<template>
  <Icon :key="`remark-${address}-${chain}`" name="custom:remark" class="icon-remark text-12px clickable ml-5px" @click.stop.prevent @mouseover.stop="onEnter" />
</template>

<script setup lang="ts">
import RemarkForm from './remarkForm.vue'
import { getRemarkByAddress } from '@/utils'

interface Props {
  popoverProps?: Record<string, any>
  address?: string
  remark?: string
  chain?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'confirm', data: { remark: string }): any
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
  const el = e.target as HTMLElement
  if (target.value !== el) {
    hide()
    target.value = el
  }


  const remark = getRemarkByAddress?.({ address: props.address || '', chain: props.chain || ''}) || props.remark || ''

  $popover?.show({
    target: el,
    content: {
      is: RemarkForm,
      props: {
        modelValue: remark,
        onSubmit,
        onCancel: hide
      }
    },
    props: {
      placement: 'right',
      width: '250',
      trigger: 'click',
      persistent: false,
      ...(props.popoverProps || {})
    }
  })
}
</script>

