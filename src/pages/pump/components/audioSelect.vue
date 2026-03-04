<script setup lang="ts">
import type { ChainKey } from '@/api/types/pump'
defineProps<{
  activeTab: 'new' | 'soon' | 'graduated',
  chain: ChainKey
}>()
const audioVisible = ref(false)
const pumpStore = usePumpStore()
const playingItem = ref<string>('')

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
  playingItem.value = ''
}

function playWithRetry(audio: HTMLAudioElement, item: string, retries = 5, interval = 300) {
  if (previewAudio.value !== audio) return
  if (audio.readyState >= 3) {
    audio.play().catch(() => {})
    playingItem.value = item
    audio.addEventListener('ended', () => { playingItem.value = '' }, { once: true })
    return
  }
  if (retries <= 0) return
  audio.load()
  setTimeout(() => playWithRetry(audio, item, retries - 1, interval), interval)
}

function handleMouseEnter(item: string) {
  stopPreview()
  if (!item) return
  hoverTimer.value = setTimeout(() => {
    const src = audioNameToResource[item as keyof typeof audioNameToResource]
    if (src) {
      const audio = new Audio(src)
      previewAudio.value = audio
      playWithRetry(audio, item)
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
          class="el-select-dropdown__item flex-between hover:text-[--secondary-text]"
          :class="pumpStore.pump_notice?.[chain]?.[activeTab] === item ? 'text-[--primary-color]!' : ''"
          @click="pumpStore.pump_notice[chain][activeTab] = item; audioVisible = false;"
          @mouseenter="() => handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <div class="flex gap-4px items-center">
            <span>{{ item ? item : $t('close') }}</span>
            <svg v-if="item" width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="mt-2px transition-opacity duration-200 text-[--secondary-text]" :class="playingItem === item ? 'opacity-100' : 'opacity-0'">
              <path d="M7 1.5V6.5H6V1.5H7ZM3 1.5V6.5H2V1.5H3ZM1 3V5H0V3H1ZM9 3V5H8V3H9ZM5 0V8H4V0H5Z" fill="currentColor"/>
            </svg>
          </div>
          <Icon
            v-if="pumpStore.pump_notice?.[chain]?.[activeTab] === item"
            name="material-symbols:check"
            class="text-16px color-[--main-text]"
          />
        </li>
      </ul>
    </template>
  </el-popover>
</template>
