# 涨幅榜功能结构设计文档

## 1. 目录结构设计

### 1.1 基础目录结构
```
src/pages/components/
├── categoryTabs.vue                 # 标签切换组件（复用现有）
├── chainsSelect.vue                # 链选择组件（复用现有）
├── columnsToolbar.vue              # 列工具栏组件（复用现有）
├── hotRank/                        # 热搜榜目录（现有）
│   ├── hot.vue                     # 热搜榜主组件
│   └── columnRender/               # 列渲染组件
└── gainRank/                       # 涨幅榜目录（新增）
    ├── gain.vue                    # 涨幅榜主组件
    └── columnRender/               # 列渲染组件（复用热搜榜）
```

### 1.2 涨幅榜详细目录结构
```
src/pages/components/gainRank/
├── gain.vue                        # 涨幅榜主组件
└── columnRender/                   # 列渲染组件目录
    ├── index.ts                    # 导出所有组件（复用）
    ├── gainColumnsService.ts       # 涨幅榜列配置服务
    ├── dexContent.vue              # DEX内容组件（复用）
    ├── dynamicPriceChangeHeader.vue # 动态价格变化头部（复用）
    ├── dynamicMarkers.vue          # 动态标记组件（复用）
    ├── dynamicMarkersHeader.vue    # 动态标记头部（复用）
    ├── dynamicVolAndTxs.vue        # 动态交易量和交易数（复用）
    ├── dynamicVolAndTxsHeader.vue  # 动态交易量头部（复用）
    ├── headline.vue                # 头条组件（复用）
    ├── holdersContent.vue          # 持有者内容（复用）
    ├── holdersHeader.vue           # 持有者头部（复用）
    ├── insidersContent.vue         # 内幕交易内容（复用）
    ├── insidersHeader.vue          # 内幕交易头部（复用）
    ├── liquidityContent.vue        # 流动性内容（复用）
    ├── liquidityHeader.vue         # 流动性头部（复用）
    ├── mCapContent.vue             # 市值内容（复用）
    ├── mCapHeader.vue              # 市值头部（复用）
    ├── poolPairContent.vue         # 池对内容（复用）
    ├── poolPairHeader.vue          # 池对头部（复用）
    ├── priceChange.vue             # 价格变化组件（复用）
    ├── priceContent.vue            # 价格内容（复用）
    ├── priceHeader.vue             # 价格头部（复用）
    ├── quickContent.vue            # 快速操作内容（复用）
    ├── rangePopover.vue            # 范围弹窗（复用）
    ├── securityContent.vue         # 安全内容（复用）
    ├── smarterContent.vue          # 智能钱包内容（复用）
    ├── smarterHeader.vue           # 智能钱包头部（复用）
    ├── snipersContent.vue          # 狙击手内容（复用）
    ├── snipersHeader.vue           # 狙击手头部（复用）
    ├── top10Header.vue             # Top10头部（复用）
    └── top10PositionsContent.vue   # Top10持仓内容（复用）
```

## 2. 组件复用策略

### 2.1 完全复用的组件
以下组件可以直接复用，无需修改：
- `categoryTabs.vue` - 标签切换组件
- `chainsSelect.vue` - 链选择组件
- `columnsToolbar.vue` - 列工具栏组件
- `hotRank/columnRender/` 目录下的所有渲染组件

### 2.2 需要适配的组件
- `categoryTabs.vue` - 需要添加涨幅榜标签配置
- `gain.vue` - 基于 `hot.vue` 创建，修改API调用参数

### 2.3 新增的组件
- `gainColumnsService.ts` - 涨幅榜列配置服务

## 3. 代码规范

### 3.1 Vue组件规范
- 使用 Vue 3 Composition API
- 使用 TypeScript 类型定义
- 使用 `<script setup>` 语法
- 遵循单文件组件(SFC)规范
- 使用 JSX 语法进行复杂渲染

### 3.2 样式规范
- 使用 UnoCSS 进行样式编写
- 使用 CSS 变量进行主题适配
- 遵循响应式设计原则
- 使用 SCSS 预处理器

### 3.3 命名规范
- 组件文件使用 PascalCase 命名
- 组件名称使用 PascalCase
- 变量和函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 文件夹使用 kebab-case

### 3.4 代码组织规范
- 按功能模块组织代码
- 相关组件放在同一目录
- 工具函数和服务单独抽离
- 类型定义统一管理

## 4. 数据流设计

### 4.1 数据流向
```
主页面 (index.vue)
    ↓
标签切换 (categoryTabs.vue)
    ↓
涨幅榜组件 (gain.vue)
    ↓
API调用 (getTreasureList)
    ↓
数据处理 (listMapFunction)
    ↓
表格渲染 (AveTable)
    ↓
列渲染组件 (columnRender/*)
```

### 4.2 状态管理
- 使用 Pinia 进行全局状态管理
- WebSocket 数据通过 `useWSStore` 管理
- 用户配置通过 `useStorage` 持久化
- 主题和语言通过对应的 store 管理

### 4.3 数据更新机制
- 初始加载：API调用获取数据
- 定时刷新：每10秒自动刷新
- 实时更新：WebSocket推送价格更新
- 用户交互：筛选、排序、分页触发更新

## 5. 接口设计

### 5.1 API接口
```typescript
// 获取涨幅榜数据
getTreasureList({
  category: 'gain',         // 涨幅榜类别
  pageNO: number,          // 页码
  pageSize: number,        // 每页数量
  chain: string,           // 区块链筛选
  sort: string,            // 排序字段
  sort_dir: string,        // 排序方向
  self_address: string,    // 用户地址
  ...filterForm            // 其他筛选条件
})
```

### 5.2 WebSocket接口
```typescript
// 订阅价格更新
wsStore.send({
  jsonrpc: '2.0',
  method: 'subscribe',
  params: ['price_extra', pairs],
  id: 1
})

// 取消订阅
wsStore.send({
  jsonrpc: '2.0',
  method: 'unsubscribe',
  params: ['price_extra'],
  id: 1
})
```

### 5.3 数据结构
```typescript
// 涨幅榜数据项
interface GainRankItem {
  id: string;                    // 唯一标识
  pair_id: string;               // 交易对ID
  token: string;                 // 代币地址
  chain: string;                 // 区块链
  target_token: string;          // 目标代币
  current_price_usd: number;     // 当前价格
  price_change_1m: number;       // 1分钟涨幅
  price_change_5m: number;       // 5分钟涨幅
  price_change_15m: number;      // 15分钟涨幅
  price_change_1h: number;       // 1小时涨幅
  price_change_4h: number;       // 4小时涨幅
  price_change_24h: number;      // 24小时涨幅
  market_cap: number;            // 市值
  liq: number;                   // 流动性
  holders: number;               // 持有者数量
  is_fav: boolean;               // 是否收藏
  // ... 其他字段
}
```

## 6. 性能优化策略

### 6.1 组件优化
- 使用 `shallowRef` 减少响应式开销
- 使用 `KeepAlive` 缓存组件状态
- 使用 `v-memo` 优化列表渲染
- 组件懒加载和异步加载

### 6.2 数据优化
- 虚拟滚动处理大量数据
- 数据分页和懒加载
- WebSocket连接池管理
- 缓存策略优化

### 6.3 渲染优化
- 使用 `v-show` 替代 `v-if` 处理频繁切换
- 避免不必要的DOM操作
- 使用 CSS 变量减少样式计算
- 图片懒加载和预加载

## 7. 错误处理策略

### 7.1 API错误处理
- 网络错误重试机制
- 数据格式验证
- 错误信息用户友好显示
- 降级处理和兜底方案

### 7.2 组件错误处理
- 错误边界处理
- 组件加载失败处理
- 渲染错误恢复
- 用户操作错误提示

### 7.3 WebSocket错误处理
- 连接断开重连机制
- 消息丢失处理
- 数据同步验证
- 连接状态监控

## 8. 测试策略

### 8.1 单元测试
- 组件功能测试
- 工具函数测试
- API调用测试
- 数据处理测试

### 8.2 集成测试
- 组件交互测试
- 数据流测试
- 用户操作流程测试
- 性能测试

### 8.3 端到端测试
- 完整功能流程测试
- 跨浏览器兼容性测试
- 移动端适配测试
- 压力测试

## 9. 部署和维护

### 9.1 部署策略
- 环境配置管理
- 构建优化配置
- 静态资源优化
- CDN配置

### 9.2 监控和维护
- 性能监控
- 错误监控
- 用户行为分析
- 定期更新和维护

## 10. 开发计划

### 10.1 阶段一：基础框架搭建
- 创建涨幅榜基础组件
- 配置路由和状态管理
- 实现基本的数据获取和展示

### 10.2 阶段二：功能完善
- 实现所有列的渲染
- 添加筛选和排序功能
- 实现实时数据更新

### 10.3 阶段三：优化和测试
- 性能优化
- 错误处理完善
- 全面测试
- 文档完善

### 10.4 阶段四：发布和维护
- 生产环境部署
- 用户反馈收集
- 问题修复和优化
- 功能迭代