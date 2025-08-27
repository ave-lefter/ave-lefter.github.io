<script setup lang="ts">
import Trending from './trending.vue'
import {useStorage, useWindowSize} from '@vueuse/core'
import {DefaultHeight} from '~/utils/constants'

const {t} = useI18n()
const {height} = useWindowSize()
const topLeftHeight = useStorage('topLeftHeight', DefaultHeight.TOPLEFT)
const finalHeight = computed(() => height.value - topLeftHeight.value)
// const leftDragEvent = useEventBus<number>(BusEventType.LEFT_DRAG)
// leftDragEvent.on(setTopLeftHeight)
// onUnmounted(() => {
//   leftDragEvent.off(setTopLeftHeight)
// })
//
// function setTopLeftHeight(_height: number) {
//   topLeftHeight.value = _height
// }
const activeTab = shallowRef<keyof typeof components>('Trending')
const tabs = computed(()=>{
    return [
    {name: t('trending'), component: 'Trending' as const},
    // {name: 'Pump', component: 'Pump' as const},
  ]
})
const components = {
  Trending,
  // Pump: defineAsyncComponent(() => import('./pump.vue'))
}
const Component = computed(() => {
  return components[activeTab.value]
})
</script>

<template>
  <div class="bg-[--d-111-l-FFF] rounded-2px text-14px pt-10px flex-1 flex flex-col">
    <div class="flex items-center px-12px gap-20px border-b-#FFFFFF08">
      <a
        v-for="(item) in tabs"
        :key="item.component" href="javascript:;"
        :class="`decoration-none text-12px lh-16px pb-8px text-center color-[--d-666-l-999] b-b-solid b-b-2px font-500
        ${activeTab===item.component ? 'color-[--d-F5F5F5-l-222] b-b-[--d-F5F5F5-l-333]':'b-b-transparent'}`"
        @click="activeTab=item.component"
      >
        {{ item.name }}
      </a>
    </div>
    <KeepAlive>
      <component
        :is="Component"
        class="flex-1 relative"
        :finalHeight="finalHeight"
      />
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>
