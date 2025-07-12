<template>
  <div class="relative">
    <div :style="botStore.connectVisible&&[{filter: 'url(#blur)'}]" class="min-h-screen">
      <TheHeader />
      <div
        class="relative flex bg-[--d-000-l-F6F6F6] gap-1px pt-1px transition-transform transition-duration-300 overflow-hidden"
        :style="signalStore.translateStyle"
      >
        <Draggable
          v-if="signalStore.isLeftFixed&&signalStore.signalVisible"
          class="[&&]:relative shrink-0"
          :min-width="240"
          :max-width="360"
          :initial-width="signalStore.fixedWidth"
          :initial-height="signalStore.winHeight-95"
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
        <slot/>
        <Draggable
          v-if="signalStore.isRightFixed&&signalStore.signalVisible"
          class="[&&]:relative shrink-0"
          :min-width="240"
          :max-width="360"
          :x="0"
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
  </div>
</template>

<script setup lang='ts'>
  import TheHeader from '@/components/layouts/TheHeader.vue'
  import TheFooter from '@/components/layouts/TheFooter.vue'
  const botStore = useBotStore()
  const signalStore = useSignalStore()
</script>

<style>

</style>
