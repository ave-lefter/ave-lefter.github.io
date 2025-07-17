# 涨幅榜功能技术栈约束文档

## 1. 核心技术栈

### 1.1 前端框架
- **Nuxt 3**: 全栈 Vue 框架，SPA 模式
- **Vue 3**: 渐进式 JavaScript 框架，使用 Composition API
- **TypeScript**: 类型安全的 JavaScript 超集
- **Pinia**: Vue 的状态管理库，替代 Vuex

### 1.2 UI 组件库
- **Element Plus**: 基于 Vue 3 的桌面端组件库
- **UnoCSS**: 原子化 CSS 引擎，即时按需生成
- **SCSS**: CSS 预处理器，用于复杂样式编写

### 1.3 构建工具
- **Vite**: 现代化构建工具，基于 ESM
- **pnpm**: 快速、节省磁盘空间的包管理器
- **ESLint**: JavaScript 代码检查工具
- **Terser**: JavaScript 压缩工具

## 2. 开发约束

### 2.1 Vue 3 开发约束
```typescript
// 必须使用 Composition API
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 推荐使用 shallowRef 优化性能
const activeTab = shallowRef('hot')
const loading = shallowRef(false)

// 使用 computed 处理计算属性
const filteredData = computed(() => {
  return data.value.filter(item => condition)
})

// 使用 onMounted 等生命周期钩子
onMounted(() => {
  initData()
})
</script>
```

### 2.2 TypeScript 约束
```typescript
// 接口定义
interface GainRankItem {
  id: string
  chain: string
  price_change_1m: number
  // ... 其他字段
}

// 组件Props定义
const props = defineProps<{
  activeChain: string
  listMapFunction: (item: Record<string, any>) => Record<string, any>
}>()

// 事件定义
const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()
```

### 2.3 Pinia 状态管理约束
```typescript
// 使用 Composition API 风格
export const useGainRankStore = defineStore('gainRank', () => {
  const data = ref<GainRankItem[]>([])
  const loading = ref(false)
  
  const fetchData = async () => {
    loading.value = true
    try {
      const result = await getTreasureList({ category: 'gain' })
      data.value = result.data
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    fetchData
  }
})
```

## 3. API 集成约束

### 3.1 API 调用规范
```typescript
// 使用项目统一的 API 封装
import { getTreasureList } from '~/api/market'

// API 参数类型定义
interface GetTreasureListParams {
  category: 'gain'
  pageNO: number
  pageSize: number
  chain?: string
  sort?: string
  sort_dir?: string
  self_address?: string
}

// 错误处理
try {
  const result = await getTreasureList(params)
  return result
} catch (error) {
  console.error('API Error:', error)
  throw error
}
```

### 3.2 WebSocket 集成约束
```typescript
// 使用统一的 WebSocket Store
const wsStore = useWSStore()

// 订阅价格更新
wsStore.send({
  jsonrpc: '2.0',
  method: 'subscribe',
  params: ['price_extra', pairs],
  id: 1
})

// 监听 WebSocket 数据
watch(
  () => wsStore.wsResult[WSEventType.PRICE_EXTRA],
  (data) => {
    updatePriceData(data)
  }
)
```

## 4. 样式约束

### 4.1 UnoCSS 使用约束
```vue
<template>
  <!-- 使用 UnoCSS 原子类 -->
  <div class="w-full h-full bg-[--d-111-l-FFF] p-4">
    <!-- 响应式设计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 主题变量使用 -->
      <div class="color-[--d-333-l-999] bg-[--d-1A1A1A-l-F2F2F2]">
        Content
      </div>
    </div>
  </div>
</template>
```

### 4.2 SCSS 使用约束
```scss
// 仅用于复杂样式，简单样式使用 UnoCSS
.complex-component {
  // 使用 CSS 变量进行主题适配
  background: var(--d-111-l-FFF);
  color: var(--d-333-l-999);
  
  // 嵌套样式
  &:hover {
    background: var(--d-222-l-F2F2F2);
  }
  
  // 响应式断点
  @media (max-width: 768px) {
    display: block;
  }
}
```

## 5. 性能约束

### 5.1 渲染性能
```vue
<script setup lang="ts">
// 使用 shallowRef 减少响应式开销
const largeList = shallowRef<Item[]>([])

// 使用 computed 缓存计算结果
const filteredList = computed(() => {
  return largeList.value.filter(item => item.visible)
})

// 使用 v-memo 优化列表渲染
const memoKey = computed(() => [activeTab.value, activeChain.value])
</script>

<template>
  <!-- 使用 v-memo 缓存渲染结果 -->
  <div v-memo="memoKey">
    <div v-for="item in filteredList" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

### 5.2 内存管理
```typescript
// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

// 取消 WebSocket 订阅
onUnmounted(() => {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1
  })
})
```

## 6. 代码质量约束

### 6.1 ESLint 规则
```javascript
// .eslintrc.js
module.exports = {
  extends: ['@nuxt/eslint-config'],
  rules: {
    // 单引号
    'quotes': ['error', 'single'],
    // 不要求分号
    'semi': ['error', 'never'],
    // 允许使用 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // Vue 组件允许多个根元素
    'vue/no-multiple-template-root': 'off'
  }
}
```

### 6.2 组件规范
```vue
<script setup lang="ts">
// 导入顺序：Vue -> 第三方库 -> 本地模块
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTreasureList } from '~/api/market'

// Props 定义
const props = defineProps<{
  activeChain: string
}>()

// Emits 定义
const emit = defineEmits<{
  (e: 'update:data', value: any[]): void
}>()

// 响应式数据
const data = ref<any[]>([])

// 计算属性
const filteredData = computed(() => {
  return data.value.filter(item => item.chain === props.activeChain)
})

// 方法
const fetchData = async () => {
  try {
    const result = await getTreasureList({ category: 'gain' })
    data.value = result.data
    emit('update:data', data.value)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}
</script>

<template>
  <div class="gain-rank-container">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped lang="scss">
.gain-rank-container {
  // 样式定义
}
</style>
```

## 7. 测试约束

### 7.1 单元测试
```typescript
// 使用 Vitest 进行单元测试
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GainRank from '~/components/GainRank.vue'

describe('GainRank', () => {
  it('should render correctly', () => {
    const wrapper = mount(GainRank, {
      props: {
        activeChain: 'solana'
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
```

### 7.2 类型测试
```typescript
// 确保类型安全
interface TestData {
  id: string
  name: string
  price: number
}

// 类型断言
const data: TestData = {
  id: '1',
  name: 'Test',
  price: 100
}

// 泛型约束
function processData<T extends TestData>(data: T): T {
  return data
}
```

## 8. 构建约束

### 8.1 Nuxt 配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // SPA 模式
  ssr: false,
  
  // 构建配置
  build: {
    transpile: ['element-plus']
  },
  
  // CSS 配置
  css: ['@unocss/reset/tailwind.css'],
  
  // 模块配置
  modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ]
})
```

### 8.2 构建优化
```javascript
// vite.config.js
export default {
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'lodash': ['lodash-es']
        }
      }
    },
    // 压缩配置
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

## 9. 部署约束

### 9.1 环境配置
```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 生成静态文件
pnpm generate

# 预览生产版本
pnpm preview
```

### 9.2 部署脚本
```bash
# test-peter.sh
#!/bin/bash
pnpm build
pnpm generate
# 部署逻辑...
```

## 10. 兼容性约束

### 10.1 浏览器支持
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 10.2 Node.js 版本
- Node.js 18+
- pnpm 8+

### 10.3 设备支持
- 桌面端：1920x1080 及以上
- 移动端：375x667 及以上
- 平板端：768x1024 及以上

## 11. 安全约束

### 11.1 内容安全策略
```typescript
// 防止 XSS 攻击
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// 验证用户输入
const validateAddress = (address: string): boolean => {
  return /^[a-zA-Z0-9]{32,44}$/.test(address)
}
```

### 11.2 API 安全
```typescript
// 请求签名验证
const signRequest = (params: Record<string, any>): string => {
  // 实现签名逻辑
  return sha1(JSON.stringify(params) + secret)
}

// 防止重放攻击
const addTimestamp = (params: Record<string, any>) => {
  return {
    ...params,
    timestamp: Date.now()
  }
}
```

## 12. 监控约束

### 12.1 性能监控
```typescript
// 性能埋点
const trackPerformance = (action: string, duration: number) => {
  if (typeof window !== 'undefined') {
    // 发送性能数据
    console.log(`${action}: ${duration}ms`)
  }
}

// 错误监控
const trackError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error)
  // 发送错误信息到监控系统
}
```

### 12.2 用户行为监控
```typescript
// 用户行为埋点
const trackUserAction = (action: string, data?: any) => {
  if (typeof window !== 'undefined') {
    // 发送用户行为数据
    console.log(`User action: ${action}`, data)
  }
}
```

## 13. 维护约束

### 13.1 代码文档
- 所有公共函数必须有 JSDoc 注释
- 复杂逻辑必须有行内注释
- 组件必须有使用说明

### 13.2 版本控制
- 使用语义化版本号
- 重要更新必须有变更日志
- 向后兼容性保证

### 13.3 更新策略
- 定期更新依赖包
- 安全补丁及时应用
- 性能优化持续进行