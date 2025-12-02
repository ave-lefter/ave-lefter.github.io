<template>
  <div class="flex-1" :style="{width:swipeWidth+ 'px' }">
    <div class="relative scroll-wrapper">
      <div v-if="showLeft" @click="scrollLeft" class="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[--main-bg] to-transparent flex justify-center items-center cursor-pointer">
        <Icon name="material-symbols:arrow-back-ios-new-rounded" class="color-[--secondary-text]"/>
      </div>

      <div ref="scrollRef" @scroll="checkArrows" class="scroll-container flex gap-4 h-full">
        <slot></slot>
      </div>

      <div v-if="showRight" @click="scrollRight" class="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[--main-bg] to-transparent flex justify-center items-center cursor-pointer">
        <Icon name="material-symbols:arrow-forward-ios"  class="color-[--secondary-text]"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
const scrollRef = ref(null)
const showLeft = ref(false)
const showRight = ref(false)

// 检查箭头显示
const checkArrows = () => {
  const el = scrollRef.value
  if (!el) return

  showLeft.value = el.scrollLeft > 0
  showRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 1
}
const swipeWidth = computed(() => {
  return width.value - 334 - 230 - 300-100
})

// 点击箭头滚动
const scrollLeft = () => {
  scrollRef.value.scrollBy({ left: -200, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollRef.value.scrollBy({ left: 200, behavior: 'smooth' })
}
watch(width, () => {
  console.log('------111-----')
   checkArrows()
})

onMounted(async () => {
  await nextTick()
  checkArrows()
  // 延迟再检查一次，保证 DOM 完全渲染
  setTimeout(() => checkArrows(), 50)
})
</script>

<style scoped>
/* 隐藏滚动条 */
.scroll-container {
  overflow-x: auto;
  flex-wrap: nowrap;
}
.scroll-container::-webkit-scrollbar {
  display: none;
}
.scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

</style>
