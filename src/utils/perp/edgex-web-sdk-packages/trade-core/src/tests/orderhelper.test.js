const { calculateOpenOrderFrozenAmount, calculateCloseOrderFrozenAmount, calculatePositionWorstClosePrice, checkCloseOrderIsValid, calculateOrderFillData } = require("@/components/calculator/order");
const { default: BigNumber } = require("bignumber.js");

const contract = {
  riskTierList: [
    {
      tier: 1,
      positionValueUpperBound: "10",
      maxLeverage: "10",
      maintenanceMarginRate: "0.05",
      starkExRisk: "214748365",
      starkExUpperBound: "340282366920938463463374607431768211455",
    },
    {
      tier: 2,
      positionValueUpperBound: "79228162514264337593543",
      maxLeverage: "10",
      maintenanceMarginRate: "0.05",
      starkExRisk: "214748365",
      starkExUpperBound: "340282366920938463463374607431768211455",
    },
  ],
  tickSize: "0.1",
  stepSize: "0.001",
};

/**
 * 订单计算基础方法测试
 */

test("test calculateOpenOrderFrozenAmount", () => {
  const amount = calculateOpenOrderFrozenAmount("70000", "0.03", "0.001", "60", "0.05");
  expect(amount.toString()).toBe("5.1");
  const amount2 = calculateOpenOrderFrozenAmount("70000", "0.03", "0.001", "80", "0.05");
  expect(amount2.toString()).toBe("16.1");
  const amount3 = calculateOpenOrderFrozenAmount("70000", "0.03", "-0.001", "-80", "0.05");
  expect(amount3.toString()).toBe("6.1");
});

test("test calculateCloseOrderFrozenAmount", () => {
  const amount = calculateCloseOrderFrozenAmount("70000", "0.03", "-0.001", "-60", "0.05");
  expect(amount.toString()).toBe("10.9");
});

test("test calculatePositionWorstClosePrice", () => {
  const amount = calculatePositionWorstClosePrice(contract, "70000", "0.001", "80", "5", "10", "30", "0.008");
  expect(amount.toString()).toBe("31754.1");
  const amount2 = calculatePositionWorstClosePrice(contract, "70000", "-0.001", "80", "5", "10", "30", "0.008");
  expect(amount2.toString()).toBe("107638.8");
});

test("test checkCloseOrderIsValid", () => {
  const valid = checkCloseOrderIsValid(
    contract,
    "70000",
    "0.03",
    "0.6",
    "3000",
    [
      {
        id: "05",
        contractId: "10000001",
        side: "BUY",
        price: "0",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "PENDING",
        size: "0.5",
        cumFailSize: "0.1",
        cumFillSize: "0.2",
        marketLimitValue: "100",
      },
      {
        id: "03",
        contractId: "10000001",
        side: "BUY",
        price: "100",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "CANCELED",
        size: "2.5",
        cumMatchSize: "1.5",
        cumFailSize: "0.1",
        cumFillSize: "0.2",
      },
      {
        id: "01",
        contractId: "10000001",
        side: "BUY",
        price: "90",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "PENDING",
        size: "3.5",
        cumFailSize: "0.1",
        cumFillSize: "0.7",
      },
    ],
    "BUY",
    "0.1",
    "80",
    "0.008",
  );
  expect(valid).toBe(true);
  const valid2 = checkCloseOrderIsValid(
    contract,
    "70000",
    "0.03",
    "0.6",
    "3000",
    [
      {
        id: "05",
        contractId: "10000001",
        side: "SELL",
        price: "0",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "PENDING",
        size: "0.5",
        cumFailSize: "0.1",
        cumFillSize: "0.2",
        marketLimitValue: "100",
      },
      {
        id: "03",
        contractId: "10000001",
        side: "SELL",
        price: "100",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "CANCELED",
        size: "2.5",
        cumMatchSize: "1.5",
        cumFailSize: "0.1",
        cumFillSize: "0.2",
      },
      {
        id: "01",
        contractId: "10000001",
        side: "SELL",
        price: "90",
        type: "LIMIT",
        createdTime: "1708042549718",
        triggerTime: "1708042549718",
        status: "PENDING",
        size: "3.5",
        cumFailSize: "0.1",
        cumFillSize: "0.7",
      },
    ],
    "SELL",
    "0.1",
    "80",
    "0.008",
  );
  expect(valid2).toBe(true);
});

test("test calculateOrderFillData", () => {
  const result = calculateOrderFillData({
    contract,
    positionOpenSize: BigNumber(0.01),
    order: {
      id: "05",
      contractId: "10000001",
      side: "BUY",
      price: "0",
      type: "LIMIT",
      createdTime: "1708042549718",
      triggerTime: "1708042549718",
      status: "PENDING",
      size: "0.5",
      cumFailSize: "0.1",
      cumFillSize: "0.2",
      marketLimitValue: "100",
    },
  });

  expect(result.closeSize.toString()).toBe("0");
  expect(result.closeValue.toString()).toBe("0");
  expect(result.openSize.toString()).toBe("0.2");
  expect(result.openValue.toString()).toBe("40");

  const result2 = calculateOrderFillData({
    contract,
    positionOpenSize: BigNumber(0.01),
    order: {
      id: "05",
      contractId: "10000001",
      side: "BUY",
      price: "69000",
      type: "LIMIT",
      createdTime: "1708042549718",
      triggerTime: "1708042549718",
      status: "FILLED",
      size: "0.5",
      cumMatchSize: "1",
      cumFailSize: "0.1",
      cumFillSize: "0.2",
      marketLimitValue: "100",
    },
  });

  expect(result2.closeSize.toString()).toBe("0");
  expect(result2.closeValue.toString()).toBe("0");
  expect(result2.openSize.toString()).toBe("0.7");
  expect(result2.openValue.toString()).toBe("48300");

  const result4 = calculateOrderFillData({
    contract,
    positionOpenSize: BigNumber(0.01),
    order: {
      id: "05",
      contractId: "10000001",
      side: "SELL",
      price: "69000",
      type: "LIMIT",
      createdTime: "1708042549718",
      triggerTime: "1708042549718",
      status: "FILLED",
      size: "0.5",
      cumMatchSize: "1",
      cumFailSize: "0.1",
      cumFillSize: "0.2",
      marketLimitValue: "100",
    },
  });

  expect(result4.closeSize.toString()).toBe("-0.01");
  expect(result4.closeValue.toString()).toBe("-690");
  expect(result4.openSize.toString()).toBe("-0.69");
  expect(result4.openValue.toString()).toBe("-47610");
});
