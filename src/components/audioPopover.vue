<template>
  <el-popover placement="right-start" popper-class="el-select__popper"
    popper-style="width: 150px;min-width: 150px; padding: 6px 0" trigger="click" ref="audioPopoverRef"
    virtual-triggering :virtual-ref="buttonRef">
    <ul class="el-select-dropdown__list group">
      <li
        v-for="item in audioList"
        :key="item"
        class="el-select-dropdown__item text-[--main-text] flex-between hover:text-[--secondary-text]"
        :class="audioSettings.audio?.[type] === item ? 'text-[--primary-color]!' : ''"
        @click="() => handleAudioSelect(item)"
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
          v-if="audioSettings.audio?.[type] === item"
          name="material-symbols:check"
          class="text-16px color-[--main-text]"
        />
      </li>
    </ul>
  </el-popover>
</template>

<script setup lang="ts">
import type { PopoverInstance } from 'element-plus';

const props = defineProps<{
  type: 'monitor' | 'twitter' | 'signal' | 'news',
  buttonRef: any
}>()

const { audioSettings } = storeToRefs(useGlobalStore())
const audioPopoverRef = ref<PopoverInstance>()
const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const previewAudio = ref<HTMLAudioElement | null>(null)
const playingItem = ref<string>('')

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

function handleAudioSelect(item: string) {
  stopPreview()
  audioPopoverRef.value?.hide()
  audioSettings.value.audio[props.type] = item
}

onUnmounted(() => {
  stopPreview()
})
</script>

<style scoped>
.new-popover {
  --el-popover__border-color: var(--dialog-divider);
  --el-popover__border-width: 1px;
}
</style>
