# OrderCalculationService 使用文档

## 概述

`OrderCalculationService` 是 `trade-core` 模块中的核心服务，用于处理订单相关的所有计算逻辑。它提供了从下单前校验、成本计算、强平价估算到保证金计算的一站式静态方法。

## API 方法概览

### 1. `calculateCost`

计算下单成本（通常包含保证金和手续费）。

```typescript
static calculateCost(ctx: OrderCalculationContext, params: CalculateCostParams): BigNumber
```

*   **用途**: 下单前检查用户余额是否足够，或预估资金占用。
*   **上下文 (ctx)**: 需要完整的 `OrderCalculationContext`（账户、持仓、合约信息等）。

### 2. `calculateMaxSize`

计算当前条件下最大可买/可卖数量。

```typescript
static calculateMaxSize(ctx: OrderCalculationContext, params: CalculateMaxSizeParams): BigNumber
```

*   **用途**: 在下单界面显示“最大可买/卖”，或点击“最大”按钮时自动填充数量。
*   **逻辑**: 综合考虑了可用余额、杠杆倍数、风险限额（Risk Tier）、合约最大持仓限制等因素，取最小值。

### 3. `calculateLiqPrice`

计算预估强平价格。

```typescript
static calculateLiqPrice(ctx: OrderCalculationContext, params: CalculateLiqPriceParams): BigNumber
```

*   **用途**: 在用户输入下单参数时，实时展示如果该订单成交，仓位的强平价格会变成多少。
*   **逻辑**: 基于当前持仓和新订单的假设成交，重新计算维持保证金率和强平线。

### 4. `calculateMargin`

计算下单所需保证金（详细版）。

```typescript
static calculateMargin(params: CalculateMarginParams): BigNumber
```

*   **用途**: 专门用于前端 UI 展示（如 `MarginDisplay`），让用户直观看到这一单的预计保证金详情（包含开仓亏损、初始保证金、手续费）。
*   **特点**:
    *   **独立性**: 不依赖 `OrderCalculationContext`，只需要当前订单的参数。
    *   **底层实现**: 委托给 `OrderMarginService`，保证了计算逻辑的复用和一致性。
    *   **参数兼容**: 自动处理 `side` 参数的兼容性（支持 `BUY/SELL` 和 `LONG/SHORT`）。

### 5. `calculateSizeFromRatio`

根据资金比例计算下单数量。

```typescript
static calculateSizeFromRatio(params: CalculateSizeFromRatioParams): string
```

*   **用途**: 滑动条（Slider）交互，例如用户选择“用 50% 资金买入”。

### 6. `calculateTPSLPriceFromROE`

根据目标收益率（ROE）计算止盈/止损触发价格。

```typescript
static calculateTPSLPriceFromROE(params: CalculateTPSLPriceFromROEParams): string
```

*   **用途**: 高级止盈止损设置中，用户输入期望的 ROE%，自动反算出触发价格。

## 使用示例

### 场景一：下单前计算保证金

```typescript
import { OrderCalculationService } from "@edgex/trade-core";

// 准备参数
const params = {
  side: "BUY", // 或 "LONG"
  oraclePrice: 50000,
  price: 50100,
  size: 0.1,
  leverage: 10,
  feeRate: 0.0006,
  isMarketOrder: false
};

// 计算
const margin = OrderCalculationService.calculateMargin(params);

console.log(`所需保证金: ${margin.toFixed(2)} USDT`);
```

### 场景二：计算最大可买数量

```typescript
import { OrderCalculationService, OrderCalculationContext } from "@edgex/trade-core";

// 1. 组装上下文 (通常由 hook 或 store 提供)
const context: OrderCalculationContext = {
  contractId: "btc_usdt",
  metadata: { ... },
  account: { ... },
  positions: [ ... ],
  // ... 其他字段
};

// 2. 计算最大可买
const maxBuySize = OrderCalculationService.calculateMaxSize(context, {
  type: "LIMIT",
  side: "BUY",
  price: 50000
});

console.log(`最大可买: ${maxBuySize.toString()} BTC`);
```

## 最佳实践

1.  **首选本服务**: 除非有特殊需求，否则应优先使用 `OrderCalculationService` 的静态方法，而不是直接实例化底层的 `OrderMarginService` 或调用 `domain/calculator` 中的函数。这有助于保持代码风格统一和逻辑收敛。
2.  **上下文管理**: 对于依赖 `ctx` 的方法，建议在 React 组件中使用 `useOrderCalculationContext` (如果已封装) 或类似的 Hook 来自动组装上下文，避免手动传递大量参数。
3.  **BigNumber**: 所有金额/数量计算均返回 `BigNumber` 对象，请在展示时使用 `.toFixed()` 或 `.toString()`，在继续计算时直接使用对象以保持精度。
