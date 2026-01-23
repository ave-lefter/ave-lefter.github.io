<template>
  <div class="progress-container">
    <!-- 情况 1：环形进度条（包括圆形环和方型环） -->
    <template v-if="pumpSetting.Progress_isCircle === 'circle'">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <!-- 背景轨道 -->
        <component
          :is="shapeTagName"
          v-bind="shapeProps"
          :stroke="bgColor"
          stroke-width="2"
          fill="none"
        />

        <!-- 进度条 -->
        <component
          v-if="progress > 0"
          :is="shapeTagName"
          v-bind="shapeProps"
          class="progress-path"
          :class="{ 'is-rect': pumpSetting.avatar_isCircle === 'rect' }"
          :stroke="color"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="totalLength"
          :stroke-dashoffset="dashoffset"
        />
      </svg>
    </template>

    <!-- 情况 2：水平长条进度条 -->
    <template v-else>
      <svg width="72" height="12" viewBox="0 0 200 12">
        <rect x="0" y="0" width="200" height="12" rx="6" :fill="bgColor" />
        <rect
          v-if="progress > 0"
          x="0"
          y="0"
          :width="barWidth"
          height="12"
          rx="6"
          :fill="color"
          class="progress-bar-horizontal"
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

// 1. 根据形状动态计算路径总长度
const totalLength = computed(() => {
  // 方形：64 * 4 = 256
  // 圆形：2 * Math.PI * 32 ≈ 201
  return pumpSetting.value.avatar_isCircle === 'rect' ? 256 : 201
})

// 2. 计算偏移量
const dashoffset = computed(() => {
  return totalLength.value * (1 - (props.progress || 0) / 100)
})

// 3. 计算水平条宽度
const barWidth = computed(() => {
  return 200 * (props.progress || 0) / 100
})

// 4. 动态背景色
const bgColor = computed(() => hexToRgba(props.color, 0.3))

// 5. 动态 SVG 标签名与属性
const shapeTagName = computed(() =>
  pumpSetting.value.avatar_isCircle === 'rect' ? 'rect' : 'circle'
)

const shapeProps = computed(() => {
  if (pumpSetting.value.avatar_isCircle === 'rect') {
    return { x: 4, y: 4, width: 64, height: 64, rx: 4, ry: 4 }
  }
  return { cx: 36, cy: 36, r: 32 }
})

// 颜色转换工具
function hexToRgba(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<style scoped>
.progress-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-path {
  transition: stroke-dashoffset 0.8s ease-in-out;
  transform-origin: center;
}

/* 核心：将方形进度条旋转 180 度，使起点从左上变为右下 */
.progress-path.is-rect {
  transform: rotate(-90deg);
}

/* 如果是圆形，通常习惯从顶部开始，可以取消注释下面这行 */
/* .progress-path:not(.is-rect) { transform: rotate(-90deg); } */

.progress-bar-horizontal {
  transition: width 0.8s ease-in-out;
}
</style>
