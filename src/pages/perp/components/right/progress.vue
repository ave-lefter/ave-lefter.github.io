<template>
  <svg
    class="gauge"
    width="20"
    height="12"
    viewBox="0 0 20 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 左段 (绿区) -->
    <path
      d="M6.86328 4.56738C5.91162 5.11806 5.11807 5.91158 4.56738 6.86328C4.03354 7.78596 3.72755 8.85736 3.72754 10H0C8.69342e-06 8.17828 0.486741 6.47006 1.33789 4.99902C2.21593 3.48154 3.48154 2.21593 4.99902 1.33789L6.86328 4.56738Z"
      :fill="colorSections.green"
    />

    <!-- 中段 (黄区) -->
    <path
      d="M10 0C11.8218 0 13.5299 0.486757 15.001 1.33789L13.1367 4.56738C12.3293 4.10019 11.408 3.80795 10.4248 3.74219L10 3.72754C8.85739 3.72754 7.78598 4.03353 6.86328 4.56738L4.99902 1.33789C6.47006 0.4868 8.17827 0 10 0Z"
      :fill="colorSections.yellow"
    />

    <!-- 右段 (红区) -->
    <path
      d="M15.001 1.33789C16.5185 2.21593 17.784 3.48159 18.6621 4.99902C19.5132 6.47006 20 8.17827 20 10H16.2725C16.2725 8.85741 15.9665 7.78596 15.4326 6.86328C14.8819 5.91163 14.0884 5.11807 13.1367 4.56738L15.001 1.33789Z"
      :fill="colorSections.red"
    />

    <!-- 指针 (使用 SVG rotate(cx,cy) 明确指定旋转中心) -->
    <g
      :transform="pointerTransform"
      style="transition: transform 400ms ease;"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.4278 9.93676C10.3654 10.1474 10.1439 10.2676 9.93331 10.2051C9.72264 10.1426 9.60249 9.92121 9.66498 9.71058L10.9353 5.42634C10.9977 5.21567 11.2192 5.09552 11.4298 5.15801C11.6405 5.22047 11.7606 5.4419 11.6981 5.65253L10.4278 9.93676Z"
        fill="#9CA1A8"
      />
      <path
        d="M11.0517 8.51568C10.4884 7.95239 9.57509 7.95239 9.01181 8.51567C8.44852 9.07896 8.44853 9.99223 9.01181 10.5555C9.5751 11.1188 10.4884 11.1188 11.0517 10.5555C11.6149 9.99223 11.6149 9.07897 11.0517 8.51568Z"
        fill="#9CA1A8"
      />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: { type: Number, default: 0 } // 0–100
})

// clamp progress 0..100
const clamped = (n) => Math.max(0, Math.min(100, Number(n) || 0))

const colorSections = {
  green: '#12B886',
  yellow: '#FFA622',
  red: '#F6465D'
}

// 计算角度：progress 0 -> -90°, 100 -> +90°
const deg = computed(() => {
  const p = clamped(props.progress)
  return (p / 100) * 180 - 107.5
})

// 指针用 SVG 的 rotate(angle cx cy)，这里选择旋转中心 (10,10)
// 如果你希望基点更靠上或靠下，可以调这个 cx/cy（比如 10 9、10 10.5 等）
const pointerTransform = computed(() => `rotate(${deg.value || 0} 10 10)`)
</script>

<style scoped>
.gauge {
  display: inline-block;
  /* 可按需缩放 */
  width: 20px;
}
</style>
