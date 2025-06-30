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
        :stroke="isDark ? '#333333' : '#F2F2F2'"
        stroke-width="4"
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
        stroke-width="4"
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
        :fill="isDark ? '#333333' : '#F2F2F2'"
      />
      <rect
        v-if="progress > 0"
        x="0"
        y="0"
        :width="progress"
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
        r="33"
        :stroke="isDark ? '#333333' : '#F2F2F2'"
        stroke-width="4"
        fill="none"
      />
      <circle
        v-if="progress > 0"
        class="progress"
        cx="36"
        cy="36"
        r="33"
        :stroke="color"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="201"
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
        :fill="isDark ? '#333333' : '#F2F2F2'"
      />
      <rect
        v-if="progress > 0"
        x="0"
        y="0"
        :width="progress"
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
const { isDark, pumpSetting } = storeToRefs(globalStore)

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
  return 201 * (1 - (props.progress || 0) / 100)
})
</script>

<style scoped>
.progress {
  transition: stroke-dashoffset 1s ease-in-out;
}
</style>
