<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'

const modelValue = defineModel<string>()
const emit = defineEmits<{
  (e: 'playAudio'): void
}>()
defineProps<{
  title: string
}>()

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

onUnmounted(() => {
  stopPreview()
})
</script>

<template>
  <div class="flex justify-between items-center text-12px mb-24px">
    {{ title }}
    <div class="flex items-center w-180px rounded-4px bg-[--dialog-divider] px-8px">
      <Icon :name="modelValue ? 'custom:audio-on' : 'custom:audio-off'"
        class="text-16px shrink-0 color-[--secondary-text]" />
      <el-select v-model="modelValue" class="new-select" popper-class="[--el-font-size-base:12px] new-select-popper"
        :suffix-icon="SuffixIcon" :empty-values="[null, undefined]" :persistent="false">
        <el-option
          v-for="item in audioList"
          :key="item"
          class="flex-between items-center"
          :label="item ? item : $t('close')"
          :value="item"
          @mouseenter="handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <div class="flex gap-4px items-center">
            <span>{{ item ? item : $t('close') }}</span>
            <svg v-if="item" width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"
              class="mt-2px transition-opacity duration-200 text-[--secondary-text]" :class="playingItem === item ? 'opacity-100' : 'opacity-0'">
              <path d="M7 1.5V6.5H6V1.5H7ZM3 1.5V6.5H2V1.5H3ZM1 3V5H0V3H1ZM9 3V5H8V3H9ZM5 0V8H4V0H5Z" fill="currentColor"/>
            </svg>
          </div>
          <Icon v-if="modelValue === item" name="material-symbols:check" class="text-16px color-[--main-text] ml-4px" />
        </el-option>
      </el-select>
      <div class="w-1px h-8px bg-[--icon-color] mx-4px shrink-0" />
      <Icon name="custom:play-circle-line"
        class="text-16px shrink-0 color-[--secondary-text] cursor-pointer hover:color-[--main-text]"
        @click.self="emit('playAudio')" />
    </div>
  </div>
</template>
