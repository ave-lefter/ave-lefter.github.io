<template>
  <div class="relative">
    <div :style="botStore.connectVisible&&[{filter: 'url(#blur)'}]">
      <TheHeader/>
       <!-- :style="signalStore.translateStyle"  translate-x-0px-->
      <div
        :class="['relative flex bg-[--d-000-l-F6F6F6] gap-1px pt-1px transition-transform transition-duration-300',`translate-x-${signalStore.translateStyle}`]"
        :style="_style"
      >
        <slot/>
      </div>
      <TheFooter />
    </div>
    <svg v-if="botStore.connectVisible" width="0" height="0" class="absolute">
      <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </svg>
    <Draggable
      v-if="!signalStore.isLeftFixed&&!signalStore.isRightFixed&&signalStore.signalVisible"
      class-name="top-0 left-0 fixed"
      :z="3"
      :initialWidth="signalStore.signalBoundingRect.width"
      :initial-height="signalStore.signalBoundingRect.height"
      :x="signalStore.signalBoundingRect.x"
      :y="signalStore.signalBoundingRect.y"
      :min-width="240"
      :min-height="160"
      :parent="true"
      :handles="[
         'tl',
          'tm',
          'tr',
          'mr',
          'br',
          'bm',
          'bl',
          'ml',
    ]"
      drag-cancel="#drag-disabled,#drag-settings,#custom-filter"
      @onDragStop="signalStore.onDragStop"
      @onResizing="signalStore.onResizing"
      @onDrag="signalStore.onDrag"
    >
      <Signal
        :container-width="signalStore.signalBoundingRect.width"
        :scroll-height="signalStore.signalBoundingRect.height-117"
        class="border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]"
      />
    </Draggable>
    <Draggable
      v-if="signalStore.isLeftFixed&&signalStore.signalVisible"
      class="[&&]:relative shrink-0 left fixed! left-0 top-64px"
      :axis="'x'"
      :min-width="240"
      :max-width="360"
      :initial-width="signalStore.fixedWidth"
      :initial-height="signalStore.winHeight-95"
      :parent="true"
      :handles="[
      'mr',
      ]"
      drag-cancel="#drag-disabled"
      @onDragStop="signalStore.onLeftDragStop"
      @onResizing="signalStore.onFixedResizing"
    >
      <Signal
        :container-width="signalStore.fixedWidth"
        :scroll-height="signalStore.winHeight-200"
      />
    </Draggable>
    <Draggable
      v-if="signalStore.isRightFixed&&signalStore.signalVisible"
      class="[&&]:relative shrink-0 right fixed! top-64px left-0"
      :axis="'x'"
      :x="signalStore.winWidth-signalStore.fixedWidth"
      :min-width="240"
      :parent="true"
      :max-width="360"
      :initial-width="signalStore.fixedWidth"
      :initial-height="signalStore.winHeight-95"
      :handles="[
      'ml',
      ]"
      drag-cancel="#drag-disabled"
      @onDragStop="signalStore.onRightDragStop"
      @onResizing="signalStore.onFixedResizing"
    >
      <Signal
        :container-width="signalStore.fixedWidth"
        :scroll-height="signalStore.winHeight-200"
      />
    </Draggable>
    
    
     <Draggable
      v-if="!monitorStore.isLeftFixed&&!monitorStore.isRightFixed&&monitorStore.visible"
      class-name="top-0 left-0 fixed"
      :z="3"
      :initialWidth="monitorStore.monitorBoundingRect.width"
      :initial-height="monitorStore.monitorBoundingRect.height"
      :x="monitorStore.monitorBoundingRect.x"
      :y="monitorStore.monitorBoundingRect.y"
      :min-width="lang.indexOf('zh')>-1?280:333"
      :min-height="160"
      :parent="true"
      :handles="[
         'tl',
          'tm',
          'tr',
          'mr',
          'br',
          'bm',
          'bl',
          'ml',
    ]"
      drag-cancel="#drag-disabled,#drag-settings,#custom-filter"
      @onDragStop="monitorStore.onDragStop"
      @onResizing="monitorStore.onResizing"
      @onDrag="monitorStore.onDrag"
    >
      <Monitor class="border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]" :scroll-height="monitorStore.monitorBoundingRect.height-40" :isLarge="monitorStore.monitorBoundingRect.width>720"/>
    </Draggable>
    <Draggable
      v-if="monitorStore.isLeftFixed&&monitorStore.visible"
      class="[&&]:relative shrink-0 left fixed! left-0 top-64px"
      :axis="'x'"
      :min-width="lang.indexOf('zh')>-1?280:333"
      :max-width="360"
      :initial-width="monitorStore.fixedWidth"
      :initial-height="monitorStore.winHeight-95"
      :parent="true"
      :handles="[
      'mr',
      ]"
      drag-cancel="#drag-disabled"
      @onDragStop="monitorStore.onLeftDragStop"
      @onResizing="monitorStore.onFixedResizing"
    >
      <Monitor :scroll-height="monitorStore.monitorBoundingRect.height-40" />
    </Draggable>
    <Draggable
      v-if="monitorStore.isRightFixed&&monitorStore.visible"
      class="[&&]:relative shrink-0 right fixed! top-64px left-0"
      :axis="'x'"
      :x="monitorStore.winWidth-monitorStore.fixedWidth"
      :min-width="lang.indexOf('zh')>-1?280:333"
      :parent="true"
      :max-width="360"
      :initial-width="monitorStore.fixedWidth"
      :initial-height="monitorStore.winHeight-95"
      :handles="[
      'ml',
      ]"
      drag-cancel="#drag-disabled"
      @onDragStop="monitorStore.onRightDragStop"
      @onResizing="monitorStore.onFixedResizing"
    >
      <Monitor :scroll-height="monitorStore.monitorBoundingRect.height-40"/>
    </Draggable>
    <FavAddressPop ref="favAddressPopRef" :visible="favAddressPopVisible" :formData="attentionDetails" :button-ref="attentionTrigger || {}" width="248" :groupOptions="addressGroups" :title="$t('followAddress')" @onConfirm="handleAddAttention" @onCancel="() => favAddressPopVisible = false"/>
  </div>
</template>

<script setup lang='ts'>
  import TheHeader from '@/components/layouts/TheHeader.vue'
  import TheFooter from '@/components/layouts/TheFooter.vue'
  const botStore = useBotStore()
  const {lang} = storeToRefs(useGlobalStore())
  const {addressGroups,attentionTrigger,attentionDetails,favAddressPopVisible,handleAddAttention} = storeToRefs(useFollowStore())
  const signalStore = useSignalStore()
  const monitorStore = useMonitorStore()
  const _style=computed(()=>{
    if(signalStore.signalVisible){
      if(signalStore.isLeftFixed){
        return {
          paddingLeft:signalStore.fixedWidth+4+'px',
        }
      }else if(signalStore.isRightFixed){
        return {
          paddingRight:signalStore.fixedWidth+4+'px',
        }
      }
       return {}
    }
    return {
    }
  })
</script>

<style>

</style>
