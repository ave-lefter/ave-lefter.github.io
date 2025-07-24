<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import PnlSetting from './pnlSetting.vue'
import PnlHistory from './pnlHistory.vue'

const pnlBoundingRect = useStorage('pnlBoundingRect', {
  width: 480,
  height: 120,
  x: 250,
  y: -38,
})

const onDragStop = (x: number, y: number) => {
  pnlBoundingRect.value.x = x
  pnlBoundingRect.value.y = y
}

const onResizing = (width: number, height: number) => {
  pnlBoundingRect.value.width = width
  pnlBoundingRect.value.height = height
}
const pnlHistoryVisible = ref(false)
const pnlSettingVisible = ref(false)
</script>

<template>
  <Draggable
    class-name="top-0 left-0 fixed draggable"
    :z="3"
    :initialWidth="pnlBoundingRect.width"
    :initial-height="pnlBoundingRect.height"
    :x="pnlBoundingRect.x"
    :y="pnlBoundingRect.y"
    :min-width="240"
    :min-height="120"
    :parent="true"
    :handles="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']"
    @on-drag-stop="onDragStop"
    @on-resizing="onResizing"
  >
    <div class="w-full h-full p-12px bg-red-500 flex flex-col">
      <div class="flex relative justify-between items-center h-16px mb-10px">
        <div class="flex items-center gap-12px">
          <Icon name="custom:pump-setting" class="cursor-pointer text-12px color-#FFFFFF99" @click.self="pnlSettingVisible = true"/>
          <Icon name="custom:history-fill" class="cursor-pointer text-16px color-#FFFFFF99" @click.self="pnlHistoryVisible = true"/>
        </div>
        <div>
          <Icon name="custom:reset2" class="cursor-pointer text-16px color-#FFFFFF99" />
          <Icon name="material-symbols:close" class="cursor-pointer text-16px color-#FFFFFF99" />
        </div>
      </div>
      <div class="mt--26px flex-1 flex items-center justify-center">
        123
      </div>
    </div>
  </Draggable>
  <PnlSetting v-model:visible="pnlSettingVisible"/>
  <PnlHistory v-model:visible="pnlHistoryVisible"/>
</template>
<style scoped lang="scss">
.draggable {
  :deep{
    .handle-br{
        opacity: 0;
    }
    .handle-tl, .handle-tr, .handle-br, .handle-bl{
        width: 12px;
        height: 12px;
    }
  }
}
</style>
