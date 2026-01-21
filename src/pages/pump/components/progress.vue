<template>
  <div>
  <template v-if="pumpSetting.avatar_isCircle == 'rect'">
    <svg
      v-if="pumpSetting.Progress_isCircle =='circle'"
      width="72"
      height="72"
      viewBox="0 0 72 72"
    >
      <!-- 背景方形，圆角为 8px -->
      <rect
        x="4"
        y="4"
        width="64"
        height="64"
        :stroke="bgColor"
        stroke-width="2"
        fill="none"
        rx="4"
        ry="4"
      />

      <!-- 进度条 -->
      <rect
        v-if="progress > 0"
        class="progress"
        x="4"
        y="4"
        width="64"
        height="64"
        :stroke="color"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="256"
        :stroke-dashoffset="dashoffset"
        rx="4"
        ry="4"
      />
    </svg>
    <svg v-else width="72" height="12" viewBox="0 0 200 12">
      <rect
        x="0"
        y="0"
        width="200"
        height="12"
        rx="6"
        :fill="bgColor"
      />
      <rect
        v-if="progress > 0"
        x="0"
        y="0"
        :width="width"
        height="12"
        rx="6"
        :fill="color"
        class="progress-bar"
      />
    </svg>
  </template>
  <template v-else>
    <svg
      v-if="pumpSetting.avatar_isCircle == 'circle' && pumpSetting.Progress_isCircle =='circle'"
      width="72"
      height="72"
      viewBox="0 0 72 72"
    >
      <circle
        cx="36"
        cy="36"
        r="32"
        :stroke="bgColor"
        stroke-width="2"
        fill="none"
      />
      <circle
        v-if="progress > 0"
        class="progress"
        cx="36"
        cy="36"
        r="32"
        :stroke="color"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="200"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <svg v-else width="72" height="12" viewBox="0 0 200 12">
      <rect
        x="0"
        y="0"
        width="200"
        height="12"
        rx="6"
        :fill="bgColor"
      />
      <rect
        v-if="progress > 0"
        x="0"
        y="0"
        :width="width"
        height="12"
        rx="6"
        :fill="color"
        class="progress-bar"
      />
    </svg>
  </template>
</div>
</template>

<script setup lang="ts">
const globalStore = useGlobalStore()
const { pumpSetting } = storeToRefs(globalStore)

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#FFA622',
  },
})

// 计算 stroke-dashoffset
const dashoffset = computed(() => {
  return 200 * (1 - (props.progress || 0) / 100)
})
const width = computed(() => {
  return 200 *  (props.progress || 0)/ 100
})
const bgColor = computed(() => {
  return hexToRgba(props.color, 0.3)
})
function hexToRgba(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<style scoped>
.progress {
  transition: stroke-dashoffset 1s ease-in-out;
}
</style>
