<template>
  <Draggable
    :class="{ 'left-drag': dragPumpStore.isLeftFixed, 'right-drag': dragPumpStore.isRightFixed }"
    :shouldRenderChild="shouldRenderChild"
    v-bind="props1"
    @on-drag-stop="dragStop"
    @on-resizing="resizing"
    @on-drag="drag"
  >
    <!-- <Monitor v-bind="props2"/> -->
    <component :is="lazyComponent" v-bind="props2" />
  </Draggable>
</template>

<script setup lang="ts">
const signalStore = useSignalStore()
const monitorStore = useMonitorStore()
const dragPumpStore = usePumpStore()
const trackerStore = useTwitterTrackerStore()
const dragStore = useDragStore()
const { t } = useI18n()
const { placement } = storeToRefs(dragPumpStore)
const key = ref(0)

const reload = () => {
  key.value++
}
watch(
  () => placement.value,
  () => {
    reload()
    reCreateChild()
  }
)

onMounted(() => {
  dragPumpStore.getPumpConfig()
  if (dragPumpStore.visible) {
    loadComponent()
  } else {
    setTimeout(() => {
      loadComponent()
    }, 3000)
  }
})

watch(
  () => dragPumpStore.visible,
  () => {
    if (dragPumpStore.visible) {
      loadComponent()
    }
  }
)
const lazyComponent = shallowRef<Component | null>(null)
const loadComponent = async () => {
  const component = await import('./pumpPop.vue')
  lazyComponent.value = component.default
}
const dragConstant = computed(() => {
  return {
    minWidth: 480,
    minHeight: 262,
    maxWidth: 600,
    initialHeight: dragPumpStore.winHeight - 95,
    centerScrollHeight: dragPumpStore.boundingRect.height - 140,
    otherScrollHeight: dragPumpStore.winHeight - 230,
  }
})
const props1 = computed(() => {
  const placementData = {
    center: {
      className: 'top-0 left-0 fixed',
      initialWidth: dragPumpStore.boundingRect.width,
      initialHeight: dragPumpStore.boundingRect.height,
      x: dragPumpStore.boundingRect.x,
      y: dragPumpStore.boundingRect.y,
      minWidth: dragConstant.value.minWidth,
      minHeight: dragConstant.value.minHeight,
      parent: true,
      handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      dragHandle: '.drag-handle',
    },
    left: {
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${dragStore.leftWidth.pump}px`,
      axis: 'x',
      x: 0,
      minWidth: dragConstant.value.minWidth,
      maxWidth: dragConstant.value.maxWidth,
      initialWidth: dragPumpStore.fixedWidth,
      initialHeight: dragConstant.value.initialHeight,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle',
    },
    right: {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x: dragStore.rightWidth.pump,
      y: 0,
      minWidth: dragConstant.value.minWidth,
      maxWidth: dragConstant.value.maxWidth,
      initialWidth: dragPumpStore.fixedWidth,
      initialHeight: dragConstant.value.initialHeight,
      parent: true,
      handles: ['ml'],
      dragHandle: '.drag-handle',
    },
  }
  return placementData[placement.value]
})

const shouldRenderChild = shallowRef(true)

const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}

const props2 = computed(() => {
  let data = {} as any
  if (placement.value === 'center') {
    data = {
      class:
        'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]',
      scrollHeight: dragConstant.value.centerScrollHeight,
    }
  } else {
    data = {
      scrollHeight: dragConstant.value.otherScrollHeight,
    }
  }
  return data
})
function dragStop(x: number, y: number) {
  if (['left', 'right'].includes(placement.value) && Math.abs(x) < 1) {
    if (
      signalStore.signalVisible &&
      monitorStore.visible &&
      dragPumpStore.visible &&
      trackerStore.visible
    ) {
      ElMessage.warning(t('popTips'))
      return
    }
  }
  if (placement.value === 'left') {
    dragPumpStore.onLeftDragStop(x, y)
  } else if (placement.value === 'right') {
    dragPumpStore.onRightDragStop(x, y)
  } else {
    dragPumpStore.onDragStop(x, y)
  }
}
function resizing(w: number, h: number) {
  if (placement.value === 'center') {
    dragPumpStore.onResizing(w, h)
  } else {
    dragPumpStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if (placement.value === 'center') {
    dragPumpStore.onDrag(x)
  } else {
    return null
  }
}
</script>
