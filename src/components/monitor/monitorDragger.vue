<template>
  <Draggable 
  :class="{ 'left-drag': monitorStore.isLeftFixed, 'right-drag': monitorStore.isRightFixed }"
  :shouldRenderChild="shouldRenderChild" v-bind="props1" @on-drag-stop="dragStop" @on-resizing="resizing" @on-drag="drag">
    <!-- <Monitor v-bind="props2"/> -->
    <!-- {{ dragStore.leftWidth.signal }}{{ dragStore.leftWidth.monitor }} {{ dragStore.leftWidth.pump }} -->
    <component :is="lazyComponent" v-bind="props2"/>
  </Draggable>
</template>

<script setup lang="ts">
const signalStore = useSignalStore()
const monitorStore = useMonitorStore()
const dragStore = useDragStore()
const {placement}=storeToRefs(monitorStore)
const {lang} = storeToRefs(useGlobalStore())
const key=ref(0)

const reload = () => {
  key.value++
}
watch(() => placement.value, () => {
  reload()
  reCreateChild()
})

onMounted(()=>{
  if(monitorStore.visible){
    loadComponent()
  }else{
    setTimeout(() => {
      loadComponent()
    },3000)
  }
})


watch(() => monitorStore.visible, () => {
  if(monitorStore.visible){
    loadComponent()
  }
})
const lazyComponent = shallowRef<Component | null>(null)
const loadComponent = async () => {
  const component = await import('./index.vue')
  lazyComponent.value = component.default
}
const props1=computed(()=>{
  // console.log('props1', placement.value)
  let data={
    handles:['tl','tm','tr','mr','br','bm','bl','ml'],
    dragHandle:'.drag-handle'
  } as any
  if(placement.value==='center'){
    data={
      className:'top-0 left-0 fixed',
      initialWidth:monitorStore.monitorBoundingRect.width,
      initialHeight:monitorStore.monitorBoundingRect.height,
      x:monitorStore.monitorBoundingRect.x,
      y:monitorStore.monitorBoundingRect.y,
      minWidth:360,
      minHeight:160,
      parent: true,
      handles:['tl','tm','tr','mr','br','bm','bl','ml'],
      dragHandle:'.drag-handle',
      z:1
    }
  }else if(placement.value==='left'){
    data={
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${dragStore.leftWidth.monitor}px`,
      axis: 'x',
      x: 0,
      minWidth: lang.value.indexOf('zh') > -1 ? 360 : 360,
      maxWidth: 438,
      initialWidth: monitorStore.fixedWidth,
      initialHeight: monitorStore.winHeight - 95,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle'
    }
  }else if(placement.value==='right'){
    data = {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x: dragStore.rightWidth.monitor,
      y:0,
      minWidth: lang.value.indexOf('zh') > -1 ? 360 : 360,
      maxWidth: 438,
      initialWidth: monitorStore.fixedWidth,
      initialHeight: monitorStore.winHeight - 95,
      parent: true,
      handles: ['ml'],
      dragHandle: '.drag-handle'
    }
  }
  return data
})
const shouldRenderChild = shallowRef(true)

const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}

const props2=computed(()=>{
  let data={} as any
  if(placement.value==='center'){
    data={
      class:'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]',
      scrollHeight:monitorStore.monitorBoundingRect.height-40, 
      isLarge:monitorStore.monitorBoundingRect.width>720
    }
  }else{
    data={
      scrollHeight:monitorStore.winHeight-160,
    }
  }
  return data
})
function dragStop(x: number, y: number) {
  if(placement.value==='left'){
    monitorStore.onLeftDragStop(x,y)
  }else if(placement.value==='right'){
    monitorStore.onRightDragStop(x,y)
  }else{
    monitorStore.onDragStop(x,y)
  }
}
function resizing(w: number, h: number) {
  if(placement.value==='center'){
    monitorStore.onResizing(w,h)
  }else {
    monitorStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if(placement.value==='center'){
    monitorStore.onDrag(x)
  } else{
    return null
  }
}
</script>
