<template>
  <Draggable
      v-show="trackerStore.visible"
      :class="{ 'left-drag': trackerStore.isLeftFixed, 'right-drag': trackerStore.isRightFixed }"
      :shouldRenderChild="shouldRenderChild"
      v-bind="props1"
      @on-drag-stop="dragStop"
      @on-resizing="resizing"
      @on-drag="drag"
    >
      <!-- <Monitor v-bind="props2"/> -->
      <component :is="author_id? AuthorIndex:lazyComponent" v-bind="props2" @setDrawerVisible="drawerVisible = true" />
    </Draggable>
    <div>
      <TwitterTrackerDrawer v-model:visible="drawerVisible" />
    </div>
</template>
<script setup name="trackerDragger">
import { useWindowSize } from '@vueuse/core'

const AuthorIndex = defineAsyncComponent(() => import('./authorIndex.vue'))
const drawerVisible = ref(false)
const trackerStore = useTwitterTrackerStore()
const dragStore = useDragStore()
const { t } = useI18n()
const { placement } = storeToRefs(trackerStore)
const v2WsStore = useV2WSStore()
const key = ref(0)
const { width: winWidth } = useWindowSize()
const author_id = ref(null)
provide('twitter_author_id', author_id)

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
  if (trackerStore.visible) {
    loadComponent()
  } else {
    setTimeout(() => {
      loadComponent()
    }, 3000)
  }
})

watch(
  () => trackerStore.visible,
  () => {
    if (trackerStore.visible) {
      loadComponent()
    }
  }
)
const lazyComponent = shallowRef(null)
const loadComponent = async () => {
  const component = await import('./trackerPop.vue')
  lazyComponent.value = component.default
}

const dragConstant = computed(() => {
  return {
    minWidth: 360,
    minHeight: 160,
    maxWidth: 438,
    initialHeight: trackerStore.winHeight - 95,
    centerScrollHeight: trackerStore.boundingRect.height - 140,
    otherScrollHeight: trackerStore.winHeight - 230,
  }
})
const props1 = computed(() => {
  const placementData = {
    center: {
      className: 'top-0 left-0 fixed',
      initialWidth: trackerStore.boundingRect.width,
      initialHeight: trackerStore.boundingRect.height,
      x: trackerStore.boundingRect.x,
      y: trackerStore.boundingRect.y,
      minWidth: dragConstant.value.minWidth,
      minHeight: dragConstant.value.minHeight,
      parent: true,
      handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      dragHandle: '.drag-handle',
    },
    left: {
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${dragStore.leftWidth.twitter}px`,
      axis: 'x',
      x: 0,
      minWidth: dragConstant.value.minWidth,
      maxWidth: dragConstant.value.maxWidth,
      initialWidth: trackerStore.fixedWidth,
      initialHeight: dragConstant.value.initialHeight,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle',
    },
    right: {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x: dragStore.rightWidth.twitter,
      y: 0,
      minWidth: dragConstant.value.minWidth,
      maxWidth: dragConstant.value.maxWidth,
      initialWidth: trackerStore.fixedWidth,
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
  let data = {}
  if (placement.value === 'center') {
    data = {
      class:
        'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]',
      // scrollHeight: dragConstant.value.centerScrollHeight,
    }
  } else {
    data = {
      // scrollHeight: dragConstant.value.otherScrollHeight,
    }
  }
  return data
})
function dragStop(x, y) {
  if ((Math.abs(x) < 1||x + trackerStore.boundingRect.width >= winWidth.value) && dragStore.fixedCount >= 3) {
    ElMessage.warning(t('popTips'))
    return
  }
  if (placement.value === 'left') {
    trackerStore.onLeftDragStop(x, y)
  } else if (placement.value === 'right') {
    trackerStore.onRightDragStop(x, y)
  } else {
    trackerStore.onDragStop(x, y)
  }
}
function resizing(w, h) {
  if (placement.value === 'center') {
    trackerStore.onResizing(w, h)
  } else {
    trackerStore.onFixedResizing(w)
  }
}
function drag(x) {
  if (placement.value === 'center') {
    trackerStore.onDrag(x)
  } else {
    return null
  }
}

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
