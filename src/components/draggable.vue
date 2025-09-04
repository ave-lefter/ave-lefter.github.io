<script setup lang="ts">
import VueDraggableResizable from './vue-draggable-resizeable/index.vue'
import {useThrottleFn} from '@vueuse/core'


withDefaults(defineProps<{
  initialWidth: number
  initialHeight?: number
  minWidth: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  parent?: boolean
  handles: string[]
  shouldRenderChild?: boolean
  z?:number
}>(), {
 shouldRenderChild: true
})

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
    :shouldRenderChild="shouldRenderChild"
    :w="initialWidth"
    :h="initialHeight"
    :min-width="minWidth"
    :min-height="minHeight"
    :maxWidth="maxWidth"
    :maxHeight="maxHeight"
    :parent="parent"
    :handles="handles"
    :z="z"
    @drag-stop="onDragStop"
    @dragging="onDrag"
    @resizing="onResizing"
    @resizeStop="onResizeStop"
  >
    <slot/>
    <template #mr>
      <span v-for="i in 3" :key="i" class="bg-#444 w-2px h-2px rounded-full"/>
    </template>
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
.left-drag .handle-mr,.right-drag .handle-ml{
  display: flex!important;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 4px;
    border:0 none;
    opacity: 1;
    top:0;
    height: 100%;
    gap:1px;
    background: var(--d-333-l-F2F2F2);
    &:hover{
      background: var(--d-666-l-CCC);
    }
}
.left-drag .handle-mr{
  right: 0;
}
.right-drag .handle-ml{
  left: 0;
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
