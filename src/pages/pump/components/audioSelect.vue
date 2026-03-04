<script setup lang="ts">
import type { ChainKey } from '@/api/types/pump'
defineProps<{
  activeTab: 'new' | 'soon' | 'graduated',
  chain: ChainKey
}>()
const audioVisible = ref(false)
const pumpStore = usePumpStore()

const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const previewAudio = ref<HTMLAudioElement | null>(null)

function stopPreview() {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  if (previewAudio.value) {
    previewAudio.value.pause()
    previewAudio.value.currentTime = 0
    previewAudio.value = null
  }
}

function playWithRetry(audio: HTMLAudioElement, retries = 5, interval = 300) {
  if (previewAudio.value !== audio) return
  if (audio.readyState >= 3) {
    audio.play().catch(() => {})
    return
  }
  if (retries <= 0) return
  audio.load()
  setTimeout(() => playWithRetry(audio, retries - 1, interval), interval)
}

function handleMouseEnter(item: string) {
  stopPreview()
  if (!item) return
  hoverTimer.value = setTimeout(() => {
    const src = audioNameToResource[item as keyof typeof audioNameToResource]
    if (src) {
      const audio = new Audio(src)
      previewAudio.value = audio
      playWithRetry(audio)
    }
  }, 500)
}

function handleMouseLeave() {
  stopPreview()
}

onUnmounted(() => {
  stopPreview()
})
</script>
<template>
  <el-popover v-model:visible="audioVisible" trigger="click" popper-class="el-select__popper" :persistent="false">
    <template #reference>
      <div
        class="bg-[--main-input-button-bg] py-5px px-8px rounded-4px mr-8px color-[--third-text] cursor-pointer  hover:color-[--d-F5F5F5-l-333] flex items-center justify-center min-h-28px"
        :class="{'color-[--main-text]': pumpStore.pump_notice?.[chain]?.[activeTab]}">
        <Icon :name="pumpStore.pump_notice?.[chain]?.[activeTab] ? 'custom:ad' : 'custom:admute'" class="text-14px" />
      </div>
    </template>
    <template #default>
      <ul class="el-scrollbar__view el-select-dropdown__list [&&]:m--12px">
        <li
          v-for="item in audioList"
          :key="item"
          class="el-select-dropdown__item hover:bg-[--border]"
          :class="{ 'bg-[--border]': pumpStore.pump_notice?.[chain]?.[activeTab] === item }"
          @click="pumpStore.pump_notice[chain][activeTab] = item; audioVisible = false;"
          @mouseenter="() => handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <span>{{ item || $t('close') }}</span>
        </li>
      </ul>
    </template>
  </el-popover>
</template>
