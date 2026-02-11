<template>
  <el-popover placement="top-start" popper-class="el-select__popper" popper-style="width: 150px;min-width: 150px; padding: 6px 0" trigger="click" ref="audioPopoverRef"  virtual-triggering :virtual-ref="buttonRef"
>
      <ul  class="el-select-dropdown__list group">
        <li v-for="item in audioList" :key="item" class="el-select-dropdown__item text-[--main-text] flex-between" :class="audioSettings.audio?.[type]===item?'text-[--primary-color]!':''" @click="()=>handleAudioSelect(item)">
          <span>{{ item ? item : $t('close') }}</span>
          <Icon v-if="audioSettings.audio?.[type]===item" name="material-symbols:check"  class="text-16px color-[--main-text]"/>
        </li>
      </ul>
  </el-popover>
</template>

<script setup lang="ts">
import type { PopoverInstance } from 'element-plus';

const props = defineProps<{
  type: 'monitor' | 'twitter' | 'signal',
  buttonRef: any
}>()

const { audioSettings } = storeToRefs(useGlobalStore())
const audioPopoverRef = ref<PopoverInstance>()
 
function handleAudioSelect(item:string){ 
  audioPopoverRef.value?.hide()
  audioSettings.value.audio[props.type]=item
}
</script>

<style scoped>
.new-popover {
  --el-popover__border-color: var(--dialog-divider);
  --el-popover__border-width: 1px;
}
</style>
