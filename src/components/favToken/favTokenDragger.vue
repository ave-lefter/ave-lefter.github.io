<template>
  <Draggable 
  :class="{ 'left-drag': favTokenStore.isLeftFixed, 'right-drag': favTokenStore.isRightFixed }"
  :shouldRenderChild="shouldRenderChild" v-bind="props1" @on-drag-stop="dragStop" @on-resizing="resizing" @on-drag="drag">
    <!-- <favToken v-bind="props2"/> -->
    <!-- {{ dragStore.leftWidth.signal }}{{ dragStore.leftWidth.favToken }} {{ dragStore.leftWidth.pump }} -->
    <component :is="lazyComponent" v-bind="props2"/>
  </Draggable>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { t } = useI18n()
const favTokenStore = useFavTokenStore()
const dragStore = useDragStore()
const {placement}=storeToRefs(favTokenStore)
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
  if(favTokenStore.visible){
    loadComponent()
  }else{
    setTimeout(() => {
      loadComponent()
    },2800)
  }
})


watch(() => favTokenStore.visible, () => {
  if(favTokenStore.visible){
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
      initialWidth:favTokenStore.favTokenBoundingRect.width,
      initialHeight:favTokenStore.favTokenBoundingRect.height,
      x:favTokenStore.favTokenBoundingRect.x,
      y:favTokenStore.favTokenBoundingRect.y,
      minWidth:280,
      minHeight:160,
      parent: true,
      handles:['tl','tm','tr','mr','br','bm','bl','ml'],
      dragHandle:'.drag-handle',
      z:1
    }
  }else if(placement.value==='left'){
    data={
      className: '[&&]:relative shrink-0 left fixed! top-61px',
      style: `left:${dragStore.leftWidth.favToken}px`,
      axis: 'x',
      x: 0,
      minWidth: lang.value.indexOf('zh') > -1 ? 281 : 280,
      maxWidth: 388,
      initialWidth: favTokenStore.fixedWidth,
      initialHeight: favTokenStore.winHeight - 95,
      parent: true,
      handles: ['mr'],
      dragHandle: '.drag-handle'
    }
  }else if(placement.value==='right'){
    data = {
      className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
      axis: 'x',
      x: dragStore.rightWidth.favToken,
      y:0,
      minWidth: lang.value.indexOf('zh') > -1 ? 281 : 280,
      maxWidth: 388,
      initialWidth: favTokenStore.fixedWidth,
      initialHeight: favTokenStore.winHeight - 95,
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
      scrollHeight:favTokenStore.favTokenBoundingRect.height-15, 
      isLarge:favTokenStore.favTokenBoundingRect.width>720
    }
  }else{
    data={
      scrollHeight:favTokenStore.winHeight-98,
    }
  }
  return data
})
function dragStop(x: number, y: number) {
  if ((Math.abs(x) < 1||x + favTokenStore.favTokenBoundingRect.width >= winWidth.value) && dragStore.fixedCount >= 3) {
    ElMessage.warning(t('popTips'))
    return
  }
  if(placement.value==='left'){
    favTokenStore.onLeftDragStop(x,y)
  }else if(placement.value==='right'){
    favTokenStore.onRightDragStop(x,y)
  }else{
    favTokenStore.onDragStop(x,y)
  }
}
function resizing(w: number, h: number) {
  if(placement.value==='center'){
    favTokenStore.onResizing(w,h)
  }else {
    favTokenStore.onFixedResizing(w)
  }
}
function drag(x: number) {
  if(placement.value==='center'){
    favTokenStore.onDrag(x)
  } else{
    return null
  }
}
</script>
