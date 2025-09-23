<template>
  <div class="relative">
    <svg v-if="botStore.connectVisible" width="0" height="0" class="absolute">
      <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </svg>
    <div :style="botStore.connectVisible&&[{filter: 'url(#blur)'}]" class="w-100vw h-100vh">
      <TheHeader/>
       <!-- :style="signalStore.translateStyle"  translate-x-0px-->
        <TokenHistory v-if="tokenHistoryVisible && globalStore.tokenHistoryVisible" class="border-t-solid border-t-[--main-divider]" :style="{paddingLeft:_style.paddingLeft,paddingRight:_style.paddingRight}"/>
      <div
        :class="['relative flex bg-[--main-divider] gap-1px pt-1px transition-transform transition-duration-300 overflow-hidden',]"
        :style="{..._style,transform:`translateX(${signalStore.translateStyle||monitorStore.translateStyle||dragPumpStore.translateStyle}px)`}"
      >
        <slot/>
      </div>
      <TheFooter />
    </div>
    <SignalDraggable v-if="!signalStore.shouldHide"/>
    <MonitorDragger v-show="monitorStore.visible"/>
    <DragPump v-show="dragPumpStore.visible&&!dragPumpStore.shouldHide"/>
    <FavAddressPop ref="favAddressPopRef" :visible="favAddressPopVisible" :button-ref="attentionTrigger || {}" width="248" :groupOptions="addressGroups" :title="$t('followAddress')" @onConfirm="handleAddAttention" @onCancel="() => favAddressPopVisible = false"/>
    <PnlTracker v-if="globalStore.pnlTrackerVisible"/>
    <Top v-if="topVisible" @click="scrollToTop"/>
    <Banner/>
  </div>
</template>

<script setup lang='ts'>
  import TheHeader from '@/components/layouts/TheHeader.vue'
  import TheFooter from '@/components/layouts/TheFooter.vue'

  import SignalDraggable from '~/components/signal/signalDraggable.vue'
import { useEventBus } from '@vueuse/core'
  const PnlTracker  = defineAsyncComponent(()=>import('./components/pnlTracker.vue'))
  const botStore = useBotStore()
  const {addressGroups,attentionTrigger,favAddressPopVisible,handleAddAttention} = storeToRefs(useFollowStore())
  const signalStore = useSignalStore()
  const monitorStore = useMonitorStore()
  const globalStore = useGlobalStore()
  const dragPumpStore = usePumpStore()
  const route = useRoute()

  const _style=computed(()=>{
    let paddingLeft=0
    let paddingRight=0
    if(signalStore.signalVisible && !signalStore.shouldHide){
      if(signalStore.isLeftFixed){
        paddingLeft+=signalStore.fixedWidth+1
      }else if(signalStore.isRightFixed){
        paddingRight+=signalStore.fixedWidth+1
      }
    }
    ;[monitorStore,dragPumpStore].forEach(storeItem=>{
      // 不存在 shouldHide 属性或者 shouldHide 为 false
      if(storeItem.visible && (!('shouldHide' in storeItem) || !storeItem.shouldHide)){
        if(storeItem.isLeftFixed){
          paddingLeft+=storeItem.fixedWidth+1
        }else if(storeItem.isRightFixed){
          paddingRight+=storeItem.fixedWidth+1
        }
      }
    })
    if(paddingLeft===0&&paddingRight===0){
      return {}
    }
    return {
      paddingLeft:paddingLeft+'px',
      paddingRight:paddingRight+'px',
    }
  })

  const topVisible = computed(()=>{
   return ['/smart','/address'].some(url=>route.fullPath.includes(url))
  })
  const tokenHistoryVisible = computed(()=>{
    return !route.fullPath.includes('/token/')
  })

  const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
  function scrollToTop() {
    scrollTopEvent.emit()
  }
</script>

<style lang="scss">
.drag-handle{
  cursor: move;
}
</style>
