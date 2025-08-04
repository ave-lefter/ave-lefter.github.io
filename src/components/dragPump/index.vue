<template>
  <Draggable :shouldRenderChild="shouldRenderChild" v-bind="props1" @on-drag-stop="dragStop" @on-resizing="resizing" @on-drag="drag">
    <!-- <Monitor v-bind="props2"/> -->
    <component :is="lazyComponent" v-bind="props2"/>
  </Draggable>
</template>

<script setup lang="ts">
const signalStore = useSignalStore()
const monitorStore = useMonitorStore()
const dragPumpStore = usePumpStore()
const {placement}=storeToRefs(dragPumpStore)
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
  dragPumpStore.getPumpConfig()
  if(dragPumpStore.visible){
    loadComponent()
  }else{
    setTimeout(() => {
      loadComponent()
    },3000)
  }
})


watch(() => dragPumpStore.visible, () => {
  if(dragPumpStore.visible){
    loadComponent()
  }
})
const lazyComponent = shallowRef<Component | null>(null)
const loadComponent = async () => {
  const component = await import('./pumpPop.vue')
  lazyComponent.value = component.default
}
const props1=computed(()=>{
  const placementData = {
    center:{
      className:'top-0 left-0 fixed',
      initialWidth:dragPumpStore.boundingRect.width,
      initialHeight:dragPumpStore.boundingRect.height,
      x:dragPumpStore.boundingRect.x,
      y:dragPumpStore.boundingRect.y,
      minWidth:360,
      minHeight:160,
      parent:true,
      handles:['tl','tm','tr','mr','br','bm','bl','ml'],
      dragHandle:'.drag-handle'
    },
    left:{
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${getLeftVal('left')}px`,
      axis: 'x',
      x: 0,
      minWidth:360,
      maxWidth: 438,
      initialWidth: dragPumpStore.fixedWidth,
      initialHeight: dragPumpStore.winHeight - 95,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle'
    },
    right:{
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      style: `left:${getLeftVal('right')}px`,
      axis: 'x',
      x: 0,
      minWidth:360,
      maxWidth: 438,
      initialWidth: dragPumpStore.fixedWidth,
      initialHeight: dragPumpStore.winHeight - 95,
      parent: true,
      handles: ['ml'],
      dragHandle: '.drag-handle'
    }
  }
  return placementData[placement.value]
})

function getLeftVal(direction:'left'|'right') {
  let val = 0
  const attribute = direction === 'left' ? 'isLeftFixed' : 'isRightFixed'
  if(signalStore[attribute] && signalStore.signalVisible){
    val += signalStore.fixedWidth
  }
  if(monitorStore[attribute] && monitorStore.visible){
    val += monitorStore.fixedWidth
  }
  return val + 1
}

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
      scrollHeight:dragPumpStore.boundingRect.height-40, 
      isLarge:dragPumpStore.boundingRect.width>720
    }
  }else{
     data={
      scrollHeight:dragPumpStore.winHeight-160,
    }
  }
  return data
})
function dragStop(x: number, y: number) {
  if(placement.value==='left'){
    dragPumpStore.onLeftDragStop(x,y)
  }else if(placement.value==='right'){
    dragPumpStore.onRightDragStop(x,y)
  }else{
    dragPumpStore.onDragStop(x,y)
  }
}
function resizing(w: number, h: number) {
  if(placement.value==='center'){
    dragPumpStore.onResizing(w,h)
  }else {
    dragPumpStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if(placement.value==='center'){
    dragPumpStore.onDrag(x)
  } else{
    return null
  }
}
</script>
