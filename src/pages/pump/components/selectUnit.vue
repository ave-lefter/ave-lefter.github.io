<!-- SelectUnit.vue -->
<template>
  <el-popover
    ref="pop"
    trigger="click"
    :teleported="false"
    popper-class="[--el-popover-bg-color:var(--border)]"
    :persistent="false"
  >
    <template #reference>
      <div class="media-item cursor-pointer flex items-center text-12px absolute right-15px bg-[--dialog-bg]" @click.stop>
        <span>{{ modelValue }}</span>
        <Icon class="text-[--main-text] w-14px" name="radix-icons:triangle-down" />
      </div>
    </template>

    <template #default>
      <div class="py-4px flex flex-col">
        <a
          v-for="item in list"
          :key="item"
          href="#"
          class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]"
          @click.stop.prevent="select(item)"
        >
          {{ item }}
        </a>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ElPopover } from 'element-plus'
const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const pop = ref<InstanceType<typeof ElPopover>>()
const list = ['s', 'm', 'h']

function select(item: string) {
  emit('update:modelValue', item)
  pop.value?.hide()
}
</script>
