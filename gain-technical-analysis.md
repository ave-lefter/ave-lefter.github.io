# 涨幅榜技术分析和实施方案

## 问题根因分析

### 1. API调用问题
当前实现使用了两个不同的API：
- 主要：`/v1api/v2/tokens/priceChange` (专用API，不支持分页)
- 备用：`/v1api/v4/tokens/treasure/list` (通用API，支持分页)

**实际应该使用的接口：**
```
/v1api/v4/tokens/treasure/list?category=gainer&sort=price_change_24h&sort_dir=desc&pageNO=1&pageSize=50
```

### 2. 参数对比分析

**浏览器实际调用：**
```
https://mayeas023.com/v1api/v4/tokens/treasure/list?chain=solana&sort=price_change_24h&sort_dir=desc&pageNO=1&pageSize=50&category=gainer&self_address=0xd9ed4df571c584c687b64810239cf2fe616e1aa1&refresh_total=0
```

**当前项目调用：**
```typescript
getTreasureList({
  category: 'gain',  // ❌ 应该是 'gainer'
  // 缺少默认排序参数
})
```

### 3. 关键差异点

1. **category参数**: 应该是 `'gainer'` 而不是 `'gain'`
2. **缺少默认排序**: 应该默认按 `price_change_24h` 降序排列
3. **API优先级错误**: 应该优先使用通用API而不是专用API

## 技术实施方案

### 1. API调用修正
- 统一使用 `getTreasureList` API
- 修正 category 参数为 'gainer'
- 添加默认排序参数

### 2. 数据处理优化
- 确保 pageInfo.total 正确设置
- 保持与hotRank一致的数据处理逻辑
- 优化WebSocket订阅策略

### 3. 分页功能完善
- 修复分页组件显示问题
- 确保排序和筛选时正确重置页码
- 添加页面大小选择功能

### 4. 实时更新机制
- 优化WebSocket事件订阅
- 保持数据排序的一致性
- 添加连接状态监控

## 实施步骤

1. **修正API调用参数**
2. **更新数据获取逻辑**
3. **测试分页和排序功能**
4. **验证实时更新机制**
5. **开发环境测试**
6. **生产构建验证**
7. **部署到测试环境**
8. **代码提交到GitHub**

## 预期结果

- 涨幅榜正确显示数据
- 分页组件正常工作
- 排序功能完全可用
- 实时价格更新正常
- 与参考网站功能一致