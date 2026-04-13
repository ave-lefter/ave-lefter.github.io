<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const signalStore = useSignalStore()
const dragStore = useDragStore()
const { t } = useI18n()
const { width: winWidth } = useWindowSize()

function handleOnDrag(x: number, y: number) {
  // 右侧固定模式：x 是绝对坐标，不允许向右拖动超过初始位置
  if (signalStore.placement === 'right') {
    const initialX = dragStore.rightWidth.signal || 0
    if (x > initialX) {
      return false
    }
  }
  
  // center 模式：调用原有的 onDrag 处理样式
  if (signalStore.placement === 'center') {
    signalStore.onDrag(x)
  }
  
  return true
}

function dragStop(x: number, y: number) {
  // 左侧固定模式：x 是相对偏移，需要转换为绝对坐标
  let absoluteX = x
  if (signalStore.placement === 'left') {
    const leftOffset = dragStore.leftWidth.signal || 0
    absoluteX = leftOffset + x
  }
  
  // 对于固定模式之间的切换，不检查上限
  // 只检查 center 模式下是否会触边
  if (signalStore.placement === 'center' && dragStore.fixedCount >= 3) {
    if (Math.abs(absoluteX) < 1 || absoluteX + signalStore.signalBoundingRect.width >= winWidth.value) {
      ElMessage.warning(t('popTips'))
      return
    }
  }
  
  if (signalStore.placement === 'left') {
    signalStore.onLeftDragStop(absoluteX, y)
  } else if (signalStore.placement === 'right') {
    signalStore.onRightDragStop(absoluteX, y)
  } else {
    signalStore.onDragStop(absoluteX, y)
  }
}

const initialWidth = computed(() => Math.min(signalStore.signalBoundingRect.width, signalStore.winWidth))

const initialHeight = computed(() => Math.min(signalStore.signalBoundingRect.height, signalStore.winHeight - 60))

</script>
<template>
    <Draggable
v-if="!signalStore.isLeftFixed && !signalStore.isRightFixed && signalStore.signalVisible"
        class-name="top-0 left-0 fixed overflow-hidden" :z="3" :initialWidth="initialWidth"
        :initial-height="initialHeight" :x="signalStore.signalBoundingRect.x"
        :y="signalStore.signalBoundingRect.y" :min-width="240" :min-height="160" :parent="true" :handles="[
            'tl',
            'tm',
            'tr',
            'mr',
            'br',
            'bm',
            'bl',
            'ml',
        ]" drag-cancel="#drag-disabled,#drag-settings,#custom-filter" @onDragStop="dragStop"
        @onResizing="signalStore.onResizing" :on-drag="handleOnDrag">
        <Signal
:container-width="signalStore.signalBoundingRect.width"
            :scroll-height="signalStore.signalBoundingRect.height - 117"
            class="border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]" />
    </Draggable>
    <Draggable
v-if="signalStore.isLeftFixed && signalStore.signalVisible"
        class="[&&]:relative shrink-0 left fixed! left-0 top-61px left-drag" :axis="'x'" :min-width="240" :max-width="360"
        :style="`left:${dragStore.leftWidth.signal}px`"
        :initial-width="signalStore.fixedWidth" :initial-height="signalStore.winHeight - 95" :parent="true" :handles="[
            'mr',
        ]" drag-cancel="#drag-disabled" @onDragStop="dragStop"
        @onResizing="signalStore.onFixedResizing" :on-drag="handleOnDrag">
        <Signal :container-width="signalStore.fixedWidth" :scroll-height="signalStore.winHeight - 200" />
    </Draggable>
    <Draggable
v-if="signalStore.isRightFixed && signalStore.signalVisible"
        class="[&&]:relative shrink-0 right fixed! top-61px left-0 right-drag" :axis="'x'"
        :x="dragStore.rightWidth.signal" :min-width="240" :parent="true" :max-width="360"
        :initial-width="signalStore.fixedWidth" :initial-height="signalStore.winHeight - 95" :handles="[
            'ml',
        ]" drag-cancel="#drag-disabled" @onDragStop="dragStop"
        @onResizing="signalStore.onFixedResizing" :on-drag="handleOnDrag">
        <Signal :container-width="signalStore.fixedWidth" :scroll-height="signalStore.winHeight - 200" />
    </Draggable>
</template>