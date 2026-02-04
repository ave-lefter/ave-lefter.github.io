<script setup lang="ts">
import TopLeftTable from './topLeftTable.vue'
import BottomLeftTable from '~/pages/token/components/left/bottomLeftTable.vue'
import {useStorage, useWindowSize} from '@vueuse/core'
import {DefaultHeight} from '~/utils/constants'

const topLeftHeight = useStorage('topLeftHeight', DefaultHeight.TOPLEFT)
const canDrag = shallowRef(false)
const globalStore = useGlobalStore()
const {height} = useWindowSize()

// const leftDragEvent = useEventBus(BusEventType.LEFT_DRAG)

function drag(e: MouseEvent) {
  let dy = e.clientY
  canDrag.value = true
  document.onmousemove = e => {
    if (!canDrag.value) {
      return
    }
    const {clientY} = e

    const _topLeftHeight = clientY < dy
      ? topLeftHeight.value - (dy - clientY)
      : topLeftHeight.value + clientY - dy
    if (_topLeftHeight <= height.value - 164) {
      topLeftHeight.value = _topLeftHeight
    }
    dy = clientY
  }
  document.onmouseup = () => {
    // document.getElementById('k-line-chart-container').style.pointerEvents = 'auto'
    canDrag.value = false
    document.onmousemove = null
    document.onmouseup = null
    // leftDragEvent.emit(topLeftHeight.value)
  }
  return false
}
</script>

<template>
  <div v-if="globalStore.showLeft">
    <div class="relative">
      <TopLeftTable :height="topLeftHeight"/>
      <div
        class="w-full cursor-row-resize bg-[--border] gap-1px hover:bg-[--third-text] flex items-center justify-center h-4px"
        @mousedown.stop.prevent="drag"
      >
        <span v-for="i in 4" :key="i" class="bg-[--icon-color] w-2px h-2px rounded-full"/>
      </div>
    </div>
    <BottomLeftTable/>
  </div>
</template>

<style scoped>

</style>
