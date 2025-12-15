import { OrderMarginService } from "../application/services/OrderMarginService";

describe("OrderMarginService", () => {
  describe("限价单保证金计算", () => {
    test("做多保证金计算 - 基础场景", () => {
      // 用户买入 10 个 BTC，价格 4，预言机价格 4
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 4,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const margin = service.calcLongMargin();

      // 订单开仓价值 = 4 × 10 = 40
      // 开仓亏损 = Max(0, 40 - 10 × 4) = 0
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 40 × 0.0005 = 0.02
      // 总保证金 = 0 + 4 + 0.02 = 4.02

      expect(margin.toString()).toBe("4.02");
    });

    test("做多保证金计算 - 有开仓亏损", () => {
      // 用户买入 10 个 BTC，价格 5，预言机价格 4
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const margin = service.calcLongMargin();

      // 订单开仓价值 = 5 × 10 = 50
      // 开仓亏损 = Max(0, 50 - 10 × 4) = 10
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 50 × 0.0005 = 0.025
      // 总保证金 = 10 + 4 + 0.025 = 14.025

      expect(margin.toString()).toBe("14.025");
    });

    test("做空保证金计算 - 基础场景", () => {
      // 用户卖出 10 个 BTC，价格 4，预言机价格 4
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 4,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const margin = service.calcShortMargin();

      // 订单开仓价值 = -(4 × 10) = -40
      // 开仓亏损 = Max(0, -40 - 10 × 4) = Max(0, -80) = 0
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 40 × 0.0005 = 0.02
      // 总保证金 = 0 + 4 + 0.02 = 4.02

      expect(margin.toString()).toBe("4.02");
    });

    test("做空保证金计算 - 无开仓亏损（委托价格低于预言机价格）", () => {
      // 用户卖出 10 个 BTC，价格 3，预言机价格 4
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 3,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const margin = service.calcShortMargin();

      // 订单开仓价值 = 3 × 10 = 30
      // 开仓亏损 = Max(0, 30 - 10 × 4) = Max(0, -10) = 0
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 30 × 0.0005 = 0.015
      // 总保证金 = 0 + 4 + 0.015 = 4.015

      expect(margin.toString()).toBe("4.015");
    });

    test("做空保证金计算 - 有开仓亏损（委托价格高于预言机价格）", () => {
      // 用户卖出 10 个 BTC，价格 5，预言机价格 4
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const margin = service.calcShortMargin();

      // 订单开仓价值 = 5 × 10 = 50
      // 开仓亏损 = Max(0, 50 - 10 × 4) = Max(0, 10) = 10
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 50 × 0.0005 = 0.025
      // 总保证金 = 10 + 4 + 0.025 = 14.025

      expect(margin.toString()).toBe("14.025");
    });
  });

  describe("市价单保证金计算", () => {
    test("做多市价单 - 使用订单簿计算（sellList 从低到高）", () => {
      // 订单簿示例（卖盘 sellList，按价格从低到高排序）
      // 买入时从最低价开始成交
      const sellList = [
        { price: "2", size: "3" }, // 最低价，优先成交
        { price: "3", size: "6" },
        { price: "4", size: "1" },
      ];

      const service = new OrderMarginService({
        oraclePrice: 4,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
        orderbook: sellList,
      });

      const margin = service.calcLongMargin({ isMarketOrder: true });

      // 买入 10 个，从最低价开始成交：
      // - 3 个 @ 2 = 6
      // - 6 个 @ 3 = 18
      // - 1 个 @ 4 = 4
      // value = 6 + 18 + 4 = 28
      // 市价单委托价格 = 28 / (10 × 1.02) = 28 / 10.2 = 2.745098039215686...
      // 订单开仓价值 = 2.745098039215686 × 10 = 27.45098039215686
      // 开仓亏损 = Max(0, 27.45098039215686 - 10 × 4) = Max(0, -12.54901960784314) = 0
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 27.45098039215686 × 0.0005 = 0.013725490196078431
      // 总保证金 = 0 + 4 + 0.013725490196078431 = 4.013725490196078431

      expect(margin.toString()).toBe("4.01372549019607843137255");
    });

    test("做空市价单 - 使用订单簿计算（buyList 从低到高，需要反转）", () => {
      // 订单簿示例（买盘 buyList，按价格从低到高排序）
      // 卖出时需要从最高价开始成交，所以需要反转
      const buyList = [
        { price: "2", size: "3" },
        { price: "3", size: "6" },
        { price: "4", size: "1" }, // 最高价，优先成交
      ];

      const service = new OrderMarginService({
        oraclePrice: 4,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
        orderbook: buyList,
      });

      const margin = service.calcShortMargin({ isMarketOrder: true });

      // 卖出 10 个，从最高价开始成交（反转后）：
      // - 1 个 @ 4 = 4
      // - 6 个 @ 3 = 18
      // - 3 个 @ 2 = 6
      // value = 4 + 18 + 6 = 28
      // 市价单委托价格 = 28 / (10 × 1.02) = 28 / 10.2 = 2.745098039215686...
      // 订单开仓价值 = 2.745098039215686 × 10 = 27.45098039215686
      // 开仓亏损 = Max(0, 27.45098039215686 - 10 × 4) = Max(0, -12.54901960784314) = 0
      // 初始保证金 = 10 × 4 × (1/10) = 4
      // 手续费 = 27.45098039215686 × 0.0005 = 0.013725490196078431
      // 总保证金 = 0 + 4 + 0.013725490196078431 = 4.013725490196078431

      expect(margin.toString()).toBe("4.01372549019607843137255");
    });

    test("做多市价单 - 订单簿深度不足", () => {
      // 卖盘深度不足，需要使用预言机价格补足
      const sellList = [
        { price: "19", size: "5" }, // 只有 5 个
        { price: "20", size: "3" }, // 只有 3 个
      ];

      const service = new OrderMarginService({
        oraclePrice: 25, // 预言机价格
        size: 10, // 需要买 10 个
        leverage: 10,
        feeRate: 0.0005,
        orderbook: sellList,
      });

      const margin = service.calcLongMargin({ isMarketOrder: true });

      // 买入 10 个：
      // - 5 个 @ 19 = 95
      // - 3 个 @ 20 = 60
      // - 2 个 @ 25 (预言机价格) = 50
      // value = 95 + 60 + 50 = 205
      // 市价单委托价格 = 205 / (10 × 1.02) = 205 / 10.2 = 20.098039215686274...
      // 订单开仓价值 = 20.098039215686274 × 10 = 200.98039215686274
      // 开仓亏损 = Max(0, 200.98039215686274 - 10 × 25) = Max(0, -49.01960784313726) = 0
      // 初始保证金 = 10 × 25 × (1/10) = 25
      // 手续费 = 200.98039215686274 × 0.0005 = 0.10049019607843137
      // 总保证金 = 0 + 25 + 0.10049019607843137 = 25.10049019607843137

      expect(margin.toString()).toBe("25.100490196078431372549");
    });

    test("做空市价单 - 订单簿深度不足", () => {
      // 买盘深度不足，需要使用预言机价格补足
      const buyList = [
        { price: "19", size: "3" },
        { price: "20", size: "5" }, // 最高价 20
      ];

      const service = new OrderMarginService({
        oraclePrice: 25, // 预言机价格
        size: 10, // 需要卖 10 个
        leverage: 10,
        feeRate: 0.0005,
        orderbook: buyList,
      });

      const margin = service.calcShortMargin({ isMarketOrder: true });

      // 卖出 10 个，从最高价开始（反转后）：
      // - 5 个 @ 20 = 100
      // - 3 个 @ 19 = 57
      // - 2 个 @ 25 (预言机价格) = 50
      // value = 100 + 57 + 50 = 207
      // 市价单委托价格 = 207 / (10 × 1.02) = 207 / 10.2 = 20.294117647058823...
      // 订单开仓价值 = 20.294117647058823 × 10 = 202.94117647058823
      // 开仓亏损 = Max(0, 202.94117647058823 - 10 × 25) = Max(0, -47.05882352941177) = 0
      // 初始保证金 = 10 × 25 × (1/10) = 25
      // 手续费 = 202.94117647058823 × 0.0005 = 0.10147058823529411
      // 总保证金 = 0 + 25 + 0.10147058823529411 = 25.10147058823529411

      expect(margin.toString()).toBe("25.10147058823529411764705");
    });
  });

  describe("getMarginDetails", () => {
    test("获取做多保证金详细信息", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const details = service.getMarginDetails("LONG");

      expect(details.price).toBe("5");
      expect(details.orderOpenValue).toBe("50");
      expect(details.openLoss).toBe("10");
      expect(details.initialMargin).toBe("4");
      expect(details.fee).toBe("0.025");
      expect(details.totalMargin).toBe("14.025");
    });

    test("获取做空保证金详细信息 - 无开仓亏损", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 3,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const details = service.getMarginDetails("SHORT");

      // 订单开仓价值 = 3 × 10 = 30
      // 开仓亏损 = Max(0, 30 - 10 × 4) = Max(0, -10) = 0
      expect(details.price).toBe("3");
      expect(details.orderOpenValue).toBe("30");
      expect(details.openLoss).toBe("0");
      expect(details.initialMargin).toBe("4");
      expect(details.fee).toBe("0.015");
      expect(details.totalMargin).toBe("4.015");
    });

    test("获取做空保证金详细信息 - 有开仓亏损", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const details = service.getMarginDetails("SHORT");

      // 订单开仓价值 = 5 × 10 = 50
      // 开仓亏损 = Max(0, 50 - 10 × 4) = Max(0, 10) = 10
      expect(details.price).toBe("5");
      expect(details.orderOpenValue).toBe("50");
      expect(details.openLoss).toBe("10");
      expect(details.initialMargin).toBe("4");
      expect(details.fee).toBe("0.025");
      expect(details.totalMargin).toBe("14.025");
    });
  });

  describe("统一的 calcMargin 方法", () => {
    test("calcMargin('LONG') 与 calcLongMargin() 结果一致", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const marginByCalcMargin = service.calcMargin("LONG");
      const marginByCalcLongMargin = service.calcLongMargin();

      expect(marginByCalcMargin.toString()).toBe(marginByCalcLongMargin.toString());
      expect(marginByCalcMargin.toString()).toBe("14.025");
    });

    test("calcMargin('SHORT') 与 calcShortMargin() 结果一致", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const marginByCalcMargin = service.calcMargin("SHORT");
      const marginByCalcShortMargin = service.calcShortMargin();

      expect(marginByCalcMargin.toString()).toBe(marginByCalcShortMargin.toString());
      expect(marginByCalcMargin.toString()).toBe("14.025");
    });

    test("相同价格下，做多和做空的保证金相同", () => {
      const service = new OrderMarginService({
        oraclePrice: 4,
        price: 5,
        size: 10,
        leverage: 10,
        feeRate: 0.0005,
      });

      const longMargin = service.calcMargin("LONG");
      const shortMargin = service.calcMargin("SHORT");

      expect(longMargin.toString()).toBe(shortMargin.toString());
      expect(longMargin.toString()).toBe("14.025");
    });
  });

  describe("边界情况", () => {
    test("杠杆为 1 时的保证金", () => {
      const service = new OrderMarginService({
        oraclePrice: 100,
        price: 100,
        size: 1,
        leverage: 1,
        feeRate: 0.001,
      });

      const margin = service.calcLongMargin();

      // 初始保证金 = 1 × 100 × (1/1) = 100
      // 手续费 = 100 × 0.001 = 0.1
      // 总保证金 = 0 + 100 + 0.1 = 100.1

      expect(margin.toString()).toBe("100.1");
    });

    test("手续费为 0 时的保证金", () => {
      const service = new OrderMarginService({
        oraclePrice: 100,
        price: 100,
        size: 1,
        leverage: 10,
        feeRate: 0,
      });

      const margin = service.calcLongMargin();

      // 初始保证金 = 1 × 100 × (1/10) = 10
      // 手续费 = 0
      // 总保证金 = 0 + 10 + 0 = 10

      expect(margin.toString()).toBe("10");
    });
  });
});
