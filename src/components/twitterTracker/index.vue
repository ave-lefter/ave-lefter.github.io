<template>
  <Draggable
    v-show="trackerStore.visible"
    :class="{ 'left-drag': trackerStore.isLeftFixed, 'right-drag': trackerStore.isRightFixed }"
    :shouldRenderChild="shouldRenderChild"
    v-bind="draggableProps"
    @on-drag-stop="handleDragStop"
    @on-resizing="handleResizing"
    @on-drag="handleDrag"
  >
    <component :is="author_id ? AuthorIndex : lazyComponent" v-bind="trackerChildProps" @setDrawerVisible="drawerVisible = true" />
  </Draggable>
  <div>
    <TwitterTrackerDrawer v-model:visible="drawerVisible" />
  </div>
</template>

<script setup name="trackerDragger">
import { usePanelDraggable } from '~/composables/usePanelDraggable'

const AuthorIndex = defineAsyncComponent(() => import('./authorIndex.vue'))
const drawerVisible = ref(false)
const trackerStore = useTwitterTrackerStore()
const { placement } = storeToRefs(trackerStore)
const { lang } = storeToRefs(useGlobalStore())
const v2WsStore = useV2WSStore()
const author_id = ref(null)
provide('twitter_author_id', author_id)

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
  boundingRect: computed(() => trackerStore.boundingRect),
  fixedWidth: computed(() => trackerStore.fixedWidth),
  visible: computed(() => trackerStore.visible),
  isLeftFixed: computed(() => trackerStore.isLeftFixed),
  isRightFixed: computed(() => trackerStore.isRightFixed),
  onLeftDragStop: trackerStore.onLeftDragStop.bind(trackerStore),
  onRightDragStop: trackerStore.onRightDragStop.bind(trackerStore),
  onDragStop: trackerStore.onDragStop.bind(trackerStore),
  onFixedResizing: trackerStore.onFixedResizing.bind(trackerStore),
  onResizing: trackerStore.onResizing.bind(trackerStore),
  onDrag: trackerStore.onDrag.bind(trackerStore),
  loadComponent: () => import('./trackerPop.vue'),
  panelKey: 'twitter',
  isLargeWidthThreshold: 720,
  minWidth: 360,
  maxWidth: 438,
})

// Override childProps for twitter tracker's specific needs
const trackerChildProps = computed(() => {
  const { scrollHeight, ...restProps } = childProps.value
  return {
    ...restProps,
    class: placement.value === 'center'
      ? 'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]'
      : undefined
  }
})

function subscribePublicTwitter(method) {
  v2WsStore.send({
    jsonrpc: '2.0',
    method,
    params: ['public_twitter', 'hot'],
    id: 1,
  })
}

subscribePublicTwitter('subscribe')
onUnmounted(() => {
  subscribePublicTwitter('unsubscribe')
})
</script>
