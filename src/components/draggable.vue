<script setup lang="ts">
import VueDraggableResizable from './vue-draggable-resizeable/index.vue'
import {useThrottleFn} from '@vueuse/core'

defineProps<{
  initialWidth: number
  initialHeight?: number
  minWidth: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  parent?: boolean
  handles: string[]
}>()

const emit = defineEmits(['onDragStop', 'onResizing', 'onDrag'])
const klineRef = shallowRef<HTMLElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    klineRef.value = document.getElementById('tv_chart_container')!
  }, 20)
})
const route = useRoute()
watch(()=>route.path,()=>{
  if(route.path.includes('/token/')){
    setTimeout(() => {
      klineRef.value = document.getElementById('tv_chart_container')!
    }, 20)
  }
})

function onDragStop(x: number, y: number) {
  emit('onDragStop', x, y)
  if (klineRef.value) {
    klineRef.value.style.pointerEvents = 'auto'
  }
}

const onResizing = useThrottleFn((...args: number[]) => {
  if (klineRef.value) {
    klineRef.value.style.pointerEvents = 'none'
  }
  emit('onResizing', args[2], args[3])
}, 100, true, true)

function onResizeStop() {
  if (klineRef.value) {
    klineRef.value.style.pointerEvents = 'auto'
  }
}

function onDrag(x: number, y: number) {
  emit('onDrag', x, y)
}
</script>

<template>
  <VueDraggableResizable
    class-name-dragging="opacity-90 z-10!"
    :w="initialWidth"
    :h="initialHeight"
    :min-width="minWidth"
    :min-height="minHeight"
    :maxWidth="maxWidth"
    :maxHeight="maxHeight"
    :parent="parent"
    :handles="handles"
    @drag-stop="onDragStop"
    @dragging="onDrag"
    @resizing="onResizing"
    @resizeStop="onResizeStop"
  >
    <slot/>
  </VueDraggableResizable>
</template>

<style lang="scss">
@import "@/components/vue-draggable-resizeable/index.css";

.handle {
  display: block !important;
}

.handle-tl, .handle-tr, .handle-br, .handle-bl {
  opacity: 0;
  z-index: 2;
  width: 20px;
  height: 20px;
}

.handle-tl {
  top: 0;
  left: 0;
}

.handle-tr {
  top: 0;
  right: 0;
}

.handle-br {
  opacity: 1;
  bottom: 0;
  right: 0;
  border-radius: 0 0 8px 0;
  border: 0 none;
  background: linear-gradient(135deg, transparent 0%, transparent 50%, var(--d-333-l-CCC) 50%, var(--d-333-l-CCC) 100%);
}

.handle-bl {
  bottom: 0;
  left: 0;
}
.handle-mr, .handle-ml {
  z-index: 1;
  opacity: 0;
  margin-top: 0;
  top: 20px;
  height: calc(100% - 40px);
  user-select: none;
  cursor: col-resize;
}

.handle-mr {
  right: -2px;
}

.handle-ml {
  left: -2px;
}

.handle-tm, .handle-bm {
  z-index: 1;
  opacity: 0;
  margin-left: 0;
  left: 20px;
  width: calc(100% - 40px);
  user-select: none;
  cursor: row-resize;
}

.handle-bm {
  z-index: 1;
  bottom: -8px;
}

.handle-tm {
  top: -8px;
}

.vdr {
  border: 0 none;
}
</style>
