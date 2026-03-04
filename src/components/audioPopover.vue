<template>
  <el-popover placement="right-start" popper-class="el-select__popper"
    popper-style="width: 150px;min-width: 150px; padding: 6px 0" trigger="click" ref="audioPopoverRef"
    virtual-triggering :virtual-ref="buttonRef">
    <ul class="el-select-dropdown__list group">
      <li
        v-for="item in audioList"
        :key="item"
        class="el-select-dropdown__item text-[--main-text] flex-between hover:bg-[--border]"
        :class="audioSettings.audio?.[type] === item ? 'text-[--primary-color]!' : ''"
        @click="() => handleAudioSelect(item)"
        @mouseenter="() => handleMouseEnter(item)"
        @mouseleave="handleMouseLeave"
      >
        <span>{{ item ? item : $t('close') }}</span>
        <Icon v-if="audioSettings.audio?.[type] === item" name="material-symbols:check"
          class="text-16px color-[--main-text]" />
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
