<template>
  <Draggable 
  :class="{ 'left-drag': positionStore.isLeftFixed, 'right-drag': positionStore.isRightFixed }"
  :shouldRenderChild="shouldRenderChild" v-bind="props1" @on-drag-stop="dragStop" @on-resizing="resizing" @on-drag="drag">
    <!-- <position v-bind="props2"/> -->
    <!-- {{ dragStore.leftWidth.signal }}{{ dragStore.leftWidth.position }} {{ dragStore.leftWidth.pump }} -->
    <component :is="lazyComponent" v-bind="props2"/>
  </Draggable>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { t } = useI18n()
const positionStore = usePositionStore()
const dragStore = useDragStore()
const {placement}=storeToRefs(positionStore)
const {lang} = storeToRefs(useGlobalStore())
const key=ref(0)
const { width: winWidth } = useWindowSize()
const reload = () => {
  key.value++
}
watch(() => placement.value, () => {
  reload()
  reCreateChild()
})

onMounted(()=>{
  if(positionStore.visible){
    loadComponent()
  }else{
    setTimeout(() => {
      loadComponent()
    },3000)
  }
})


watch(() => positionStore.visible, () => {
  if(positionStore.visible){
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
      initialWidth:positionStore.positionBoundingRect.width,
      initialHeight:positionStore.positionBoundingRect.height,
      x:positionStore.positionBoundingRect.x,
      y:positionStore.positionBoundingRect.y,
      minWidth:300,
      minHeight:160,
      parent: true,
      handles:['tl','tm','tr','mr','br','bm','bl','ml'],
      dragHandle:'.drag-handle',
      z:1
    }
  }else if(placement.value==='left'){
    data={
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${dragStore.leftWidth.position}px`,
      axis: 'x',
      x: 0,
      minWidth: lang.value.indexOf('zh') > -1 ? 290 : 300,
      maxWidth: 388,
      initialWidth: positionStore.fixedWidth,
      initialHeight: positionStore.winHeight - 95,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle'
    }
  }else if(placement.value==='right'){
    data = {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x: dragStore.rightWidth.position,
      y:0,
      minWidth: lang.value.indexOf('zh') > -1 ? 290 : 300,
      maxWidth: 388,
      initialWidth: positionStore.fixedWidth,
      initialHeight: positionStore.winHeight - 95,
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
      scrollHeight:positionStore.positionBoundingRect.height-15, 
      isLarge:positionStore.positionBoundingRect.width>720
    }
  }else{
    data={
      scrollHeight:positionStore.winHeight-90,
    }
  }
  return data
})
function dragStop(x: number, y: number) {
  if ((Math.abs(x) < 1||x + positionStore.positionBoundingRect.width >= winWidth.value) && dragStore.fixedCount >= 3) {
    ElMessage.warning(t('popTips'))
    return
  }
  if(placement.value==='left'){
    positionStore.onLeftDragStop(x,y)
  }else if(placement.value==='right'){
    positionStore.onRightDragStop(x,y)
  }else{
    positionStore.onDragStop(x,y)
  }
}
function resizing(w: number, h: number) {
  if(placement.value==='center'){
    positionStore.onResizing(w,h)
  }else {
    positionStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if(placement.value==='center'){
    positionStore.onDrag(x)
  } else{
    return null
  }
}
</script>
