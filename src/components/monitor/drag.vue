<template>
  <Draggable
    v-bind="props1[props.item]"
    @on-drag-stop="dragStop"
    @on-resizing="resizing"
    @on-drag="drag"
  >
    <Monitor v-bind="props2" />
  </Draggable>
</template>

<script setup lang="ts">
import Monitor from './index.vue'
const signalStore = useSignalStore()
const monitorStore = useMonitorStore()
const trackerStore = useTwitterTrackerStore()
const dragPumpStore = usePumpStore()
const { placement } = storeToRefs(monitorStore)
const { lang } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const props = defineProps({
  item: {
    type: String,
    default: 'center',
  },
})

const props1 = computed(() => {
  return {
    center: {
      className: 'top-0 left-0 fixed',
      initialWidth: monitorStore.monitorBoundingRect.width,
      initialHeight: monitorStore.monitorBoundingRect.height,
      x: monitorStore.monitorBoundingRect.x,
      y: monitorStore.monitorBoundingRect.y,
      minWidth: 360,
      minHeight: 160,
      parent: true,
      handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      dragHandle: '.drag-handle',
    },
    left: {
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${signalStore.isLeftFixed && signalStore.signalVisible ? signalStore.fixedWidth + 1 : 0}px`,
      axis: 'x',
      x: 0,
      minWidth: lang.value.indexOf('zh') > -1 ? 360 : 360,
      maxWidth: 438,
      initialWidth: monitorStore.fixedWidth,
      initialHeight: monitorStore.winHeight - 95,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle',
    },
    right: {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x:
        monitorStore.winWidth -
        monitorStore.fixedWidth -
        (signalStore.isRightFixed && signalStore.signalVisible ? signalStore.fixedWidth + 1 : 0),
      y: 0,
      minWidth: lang.value.indexOf('zh') > -1 ? 360 : 360,
      maxWidth: 438,
      initialWidth: monitorStore.fixedWidth,
      initialHeight: monitorStore.winHeight - 95,
      parent: true,
      handles: ['ml'],
      dragHandle: '.drag-handle',
    },
    right2: {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0 translate-y-0!',
      axis: 'x',
      x:
        monitorStore.winWidth -
        monitorStore.fixedWidth -
        (signalStore.isRightFixed && signalStore.signalVisible ? signalStore.fixedWidth + 1 : 0),
      minWidth: lang.value.indexOf('zh') > -1 ? 360 : 360,
      maxWidth: 438,
      initialWidth: monitorStore.fixedWidth,
      initialHeight: monitorStore.winHeight - 95,
      parent: true,
      handles: ['ml'],
      dragHandle: '.drag-handle',
    },
  }
})
const props2 = computed(() => {
  let data = {} as any
  if (placement.value === 'center') {
    data = {
      class:
        'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]',
      scrollHeight: monitorStore.monitorBoundingRect.height - 40,
      isLarge: monitorStore.monitorBoundingRect.width > 720,
    }
  } else {
    data = {
      scrollHeight: monitorStore.winHeight - 160,
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
    monitorStore.onLeftDragStop(x, y)
  } else if (placement.value === 'right') {
    monitorStore.onRightDragStop(x, y)
  } else if (placement.value === 'right2') {
    monitorStore.onRightDragStop(x, y)
  } else {
    monitorStore.onDragStop(x, y)
  }
}
function resizing(w: number, h: number) {
  if (placement.value === 'center') {
    monitorStore.onResizing(w, h)
  } else {
    monitorStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if (placement.value === 'center') {
    monitorStore.onDrag(x)
  } else {
    return null
  }
}
</script>
