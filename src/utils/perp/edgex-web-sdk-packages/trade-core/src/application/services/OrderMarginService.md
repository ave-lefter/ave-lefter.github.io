# OrderMarginService 使用文档

## 概述

`OrderMarginService` 是一个用于计算下单所需保证金的服务类。

## 保证金计算公式

```
保证金 = 开仓亏损 + 初始保证金 + 手续费
```

### 各部分说明

1. **开仓亏损**

   ```
   开仓亏损 = Max(0, 订单开仓价值 - 订单开仓数量 × 当前预言机价格)
   ```

2. **订单开仓价值**

   ```
   订单开仓价值 = 委托价格 × 委托数量
   ```

3. **委托价格**

   - **限价单**: 取用户输入的价格
   - **市价单**: 取当前单边的委托价格
     ```
     市价单委托价格 = value / (size × (1 + 0.02))
     ```
     其中:
     - `value` = 委托单加权平均总价值（根据订单簿计算）
     - `size` = 用户委托数量

4. **初始保证金**

   ```
   初始保证金 = abs(订单开仓数量) × 当前预言机价格 × (1 / 杠杆)
   ```

5. **手续费**
   ```
   手续费 = abs(订单开仓价值) × 手续费率
   ```

## 使用方法

### 1. 基础用法 - 限价单

```javascript
import { OrderMarginService } from "@/services/OrderMarginService";

// 创建服务实例
const service = new OrderMarginService({
  oraclePrice: 70000, // 预言机价格
  price: 71000, // 委托价格
  size: 0.1, // 委托数量
  leverage: 10, // 杠杆倍数
  feeRate: 0.0005, // 手续费率 (0.05%)
});

// 计算做多保证金
const longMargin = service.calcLongMargin();
console.log("做多保证金:", longMargin.toString());

// 计算做空保证金
const shortMargin = service.calcShortMargin();
console.log("做空保证金:", shortMargin.toString());
```

### 2. 市价单计算

```javascript
import { OrderMarginService } from "@/services/OrderMarginService";

// 准备订单簿数据（卖盘，用于买入）
const orderbook = [
  { price: 70100, size: 0.05 },
  { price: 70200, size: 0.08 },
  { price: 70300, size: 0.1 },
];

const service = new OrderMarginService({
  oraclePrice: 70000,
  size: 0.1,
  leverage: 10,
  feeRate: 0.0005,
  orderbook, // 传入订单簿数据
});

// 计算市价单做多保证金
const margin = service.calcLongMargin({ isMarketOrder: true });
console.log("市价单做多保证金:", margin.toString());
```

### 3. 获取详细信息

```javascript
const service = new OrderMarginService({
  oraclePrice: 70000,
  price: 71000,
  size: 0.1,
  leverage: 10,
  feeRate: 0.0005,
});

// 获取做多保证金详细信息
const details = service.getMarginDetails("LONG");
console.log(details);
/*
{
  price: "71000",              // 委托价格
  orderOpenValue: "7100",      // 订单开仓价值
  openLoss: "100",             // 开仓亏损
  initialMargin: "700",        // 初始保证金
  fee: "3.55",                 // 手续费
  totalMargin: "803.55"        // 总保证金
}
*/

// 获取做空保证金详细信息
const shortDetails = service.getMarginDetails("SHORT");
console.log(shortDetails);
```

### 4. 在 React 组件中使用

```javascript
import { useMemo, useState } from "react";
import useCurrentSymbol from "@/modules/trade/application/hooks/useCurrentSymbol";
import { OrderMarginService } from "@/services/OrderMarginService";

const OrderForm = () => {
  const { oraclePrice } = useCurrentSymbol();
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [leverage] = useState(10);
  const feeRate = 0.0005;

  // 计算所需保证金
  const requiredMargin = useMemo(() => {
    if (!price || !size || !oraclePrice) return "0";

    const service = new OrderMarginService({
      oraclePrice,
      price,
      size,
      leverage,
      feeRate,
    });

    return service.calcLongMargin().toFixed(2);
  }, [price, size, oraclePrice, leverage, feeRate]);

  return (
    <div>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="价格"
      />
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        placeholder="数量"
      />
      <div>所需保证金: {requiredMargin} USDT</div>
    </div>
  );
};
```

## API 参考

### 构造函数参数

| 参数          | 类型          | 必填 | 说明                     |
| ------------- | ------------- | ---- | ------------------------ |
| `oraclePrice` | number/string | 是   | 预言机价格               |
| `price`       | number/string | 否\* | 委托价格（限价单必填）   |
| `size`        | number/string | 是   | 委托数量                 |
| `leverage`    | number/string | 是   | 杠杆倍数                 |
| `feeRate`     | number/string | 是   | 手续费率                 |
| `orderbook`   | Array         | 否\* | 订单簿数据（市价单必填） |

\*注: 限价单需要 `price`，市价单需要 `orderbook`

### 方法

#### `calcLongMargin(options)`

计算做多保证金

**参数:**

- `options.isMarketOrder` (boolean): 是否为市价单，默认 `false`

**返回:** `BigNumber` - 所需保证金

#### `calcShortMargin(options)`

计算做空保证金

**参数:**

- `options.isMarketOrder` (boolean): 是否为市价单，默认 `false`

**返回:** `BigNumber` - 所需保证金

#### `getMarginDetails(side, options)`

获取保证金详细信息

**参数:**

- `side` (string): 'LONG' 或 'SHORT'
- `options.isMarketOrder` (boolean): 是否为市价单，默认 `false`

**返回:** `Object` - 包含以下字段:

```javascript
{
  price: string,           // 委托价格
  orderOpenValue: string,  // 订单开仓价值
  openLoss: string,        // 开仓亏损
  initialMargin: string,   // 初始保证金
  fee: string,             // 手续费
  totalMargin: string      // 总保证金
}
```

## 计算示例

### 示例 1: 做多限价单

**输入:**

- 预言机价格: 4
- 委托价格: 4
- 委托数量: 10
- 杠杆: 10
- 手续费率: 0.0005

**计算过程:**

1. 订单开仓价值 = 4 × 10 = 40
2. 开仓亏损 = Max(0, 40 - 10 × 4) = 0
3. 初始保证金 = 10 × 4 × (1/10) = 4
4. 手续费 = 40 × 0.0005 = 0.02
5. **总保证金 = 0 + 4 + 0.02 = 4.02**

### 示例 2: 做多限价单（有亏损）

**输入:**

- 预言机价格: 4
- 委托价格: 5
- 委托数量: 10
- 杠杆: 10
- 手续费率: 0.0005

**计算过程:**

1. 订单开仓价值 = 5 × 10 = 50
2. 开仓亏损 = Max(0, 50 - 10 × 4) = 10
3. 初始保证金 = 10 × 4 × (1/10) = 4
4. 手续费 = 50 × 0.0005 = 0.025
5. **总保证金 = 10 + 4 + 0.025 = 14.025**

### 示例 3: 市价单（根据订单簿）

**输入:**

- 预言机价格: 4
- 委托数量: 10
- 杠杆: 10
- 手续费率: 0.0005
- 订单簿: | 盘口 | 数量 | 价格 | 价值 | |------|------|------|------| | 买 3 | 10 | 4 | 1×4=4 | | 买 2 | 6 | 3 | 6×3=18 | | 买 1 | 3 | 2 | 3×2=6 |

**计算过程:**

1. value = 4 + 18 + 6 = 28 USD
2. 市价单委托价格 = 28 / (10 × 1.02) = 2.745098...
3. 订单开仓价值 = 2.745098... × 10 = 27.45098...
4. 开仓亏损 = Max(0, 27.45098... - 10 × 4) = 0
5. 初始保证金 = 10 × 4 × (1/10) = 4
6. 手续费 = 27.45098... × 0.0005 = 0.01372549...
7. **总保证金 ≈ 4.0137**

## 注意事项

1. 所有计算使用 `BigNumber` 以确保精度
2. 市价单需要提供订单簿数据，否则会使用预言机价格作为委托价格
3. 做空时订单开仓价值为负值
4. 返回值为 `BigNumber` 对象，使用 `.toString()` 转换为字符串
