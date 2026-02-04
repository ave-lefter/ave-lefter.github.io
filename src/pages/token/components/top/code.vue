<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import hljsDefineSolidity from 'highlightjs-solidity'
import 'highlight.js/styles/github.css'

hljsDefineSolidity(hljs)

// props
interface Props {
  code: string
  show?: boolean
}
const props = defineProps<Props>()

// codeEl ref
const codeEl = ref<HTMLElement | null>(null)

// 高亮函数
const highlight = () => {
  if (codeEl.value) {
    hljs.highlightBlock(codeEl.value)
  }
}

// 初始挂载时执行高亮
onMounted(() => {
  highlight()
})

// 监听 code 变化时更新高亮
watch(
  () => props.code,
  async () => {
    await nextTick()
    highlight()
  }
)
// watch(isDark, () => {
//     const id = 'hljs-theme'
//     const existing = document.getElementById(id)
//     if (existing) existing.remove()
//     const link = document.createElement('link')
//     link.id = id
//     link.rel = 'stylesheet'
//     link.href = isDark
//       ? 'https://cdn.jsdelivr.net/npm/highlight.js/styles/github-dark.css'
//       : 'https://cdn.jsdelivr.net/npm/highlight.js/styles/github.css'
//       document.head.appendChild(link)
// })
</script>

<template>
  <div class="code-block">
    <div class="flex-end">
      <Icon v-copy="props.code" name="bxs:copy" class="clickable text-14px color-[--third-text]" />
    </div>
    <div class="code-scroll" v-if="props.show">
      <pre>
        <code ref="codeEl" class="language-solidity">{{ props.code }}</code>
      </pre>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-block {
  position: relative;
  border-radius: 4px;
  margin: 10px 0;
  background: #f6f8fa;
  padding: 10px;
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 12px;
  color: #3f80f7;
  z-index: 1;
  cursor: pointer;
  .iconfont {
    font-size: 12px;
  }
}


/* 代码块基础样式 */
pre {
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 14px;
  // background: #f6f8fa; /* 深色背景 */
  color: #dcdcdc;
  margin: 0;
  line-height: 0;
}

pre code {
  display: block; /* 让 code 继承 pre 的宽度 */
  margin: 0;
  background: #f6f8fa;
  line-height: 1.5;
  padding: 10px;
}
/* 滚动条整体 */
pre::-webkit-scrollbar {
  width: 6px; /* 竖向滚动条宽度 */
  height: 6px; /* 横向滚动条高度 */
}

/* 滚动条轨道 */
pre::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

/* 滚动条滑块 */
pre::-webkit-scrollbar-thumb {
  background: rgba(140, 160, 195, 0.4); /* 默认半透明 */
  border-radius: 10px;
  transition: background 0.3s ease;
}

/* hover 效果 */
pre::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 160, 195, 0.8);
}

/* firefox 优化 */
pre {
  scrollbar-width: thin; /* 细滚动条 */
  scrollbar-color: #8ca0c3 transparent; /* thumb + track */
}
</style>
