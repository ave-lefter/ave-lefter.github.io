<template>
  <Draggable
    :class="{ 'left-drag': monitorStore.isLeftFixed, 'right-drag': monitorStore.isRightFixed }"
    :shouldRenderChild="shouldRenderChild"
    v-bind="draggableProps"
    @on-drag-stop="handleDragStop"
    @on-resizing="handleResizing"
    @on-drag="handleDrag"
  >
    <component :is="lazyComponent" v-bind="childProps" />
  </Draggable>
</template>

<script setup lang="ts">
import { usePanelDraggable } from '~/composables/usePanelDraggable'

const monitorStore = useMonitorStore()
const { placement } = storeToRefs(monitorStore)
const { lang } = storeToRefs(useGlobalStore())

// Use the generic composable
const {
  lazyComponent,
  shouldRenderChild,
  draggableProps,
  childProps,
  handleDragStop,
  handleResizing,
  handleDrag
} = usePanelDraggable({
  placement,
  boundingRect: computed(() => monitorStore.monitorBoundingRect),
  fixedWidth: monitorStore.fixedWidth,
  winHeight: monitorStore.winHeight,
  lang,
  visible: computed(() => monitorStore.visible),
  isLeftFixed: computed(() => monitorStore.isLeftFixed),
  isRightFixed: computed(() => monitorStore.isRightFixed),
  onLeftDragStop: monitorStore.onLeftDragStop.bind(monitorStore),
  onRightDragStop: monitorStore.onRightDragStop.bind(monitorStore),
  onDragStop: monitorStore.onDragStop.bind(monitorStore),
  onFixedResizing: monitorStore.onFixedResizing.bind(monitorStore),
  onResizing: monitorStore.onResizing.bind(monitorStore),
  onDrag: monitorStore.onDrag.bind(monitorStore),
  loadComponent: () => import('./index.vue'),
  panelKey: 'monitor',
  scrollHeightCenterOffset: 45,
  isLargeWidthThreshold: 720
})
</script>
