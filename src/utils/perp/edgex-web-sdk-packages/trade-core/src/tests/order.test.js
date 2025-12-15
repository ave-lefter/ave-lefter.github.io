const { calculateMaxCreateOrderSize } = require("@/components/calculator/order");
const riskTierList = [
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
];
const ordersToTest = [
  {
    id: "05",
    contractId: "10000001",
    side: "BUY",
    price: "0",
    type: "MARKET",
    createdTime: "1708042549718",
    triggerTime: "1708042549718",
    status: "CANCELED",
    size: "0.0001",
    cumFailSize: "0.1",
    cumFillSize: "0.2",
    cumMatchSize: "0.3",
    marketLimitValue: "100",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
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
    size: "0.0002",
    cumMatchSize: "0.3",
    cumFailSize: "0.1",
    cumFillSize: "0.2",
    marketLimitValue: "50",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
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
    size: "0.0003",
    cumFailSize: "0.1",
    cumFillSize: "0.7",
    marketLimitValue: "50",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
  },
  {
    id: "07",
    contractId: "10000001",
    side: "BUY",
    price: "0",
    type: "MARKET",
    createdTime: "1708042549000",
    triggerTime: "1708042549000",
    status: "PENDING",
    size: "0.0004",
    cumFailSize: "0.1",
    cumFillSize: "0.7",
    marketLimitValue: "50",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
  },
  {
    id: "06",
    contractId: "10000001",
    side: "SELL",
    price: "90",
    type: "LIMIT",
    createdTime: "1708042549718",
    triggerTime: "1708042549718",
    status: "PENDING",
    size: "0.0006",
    cumFailSize: "0.1",
    cumFillSize: "0.7",
    marketLimitValue: "50",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
  },
  {
    id: "06",
    contractId: "10000002",
    side: "SELL",
    price: "0",
    type: "MARKET",
    createdTime: "1708042549718",
    triggerTime: "1708042549718",
    status: "PENDING",
    size: "0.0007",
    cumFailSize: "0.1",
    cumFillSize: "0.7",
    marketLimitValue: "50",
    takerFeeRate: "0.0005",
    makerFeeRate: "0.0002",
    maxLeverage: "10",
  },
];
const fixedParams = {
  contractId: "10000001",
  metadata: {
    contractList: [
      {
        contractId: "10000001",
        contractName: "BTCUSDT",
        baseCoinId: "1000",
        quoteCoinId: "1000",
        tickSize: "0.1",
        stepSize: "0.0001",
        minOrderSize: "0.0010",
        maxOrderSize: "100.0000",
        maxOrderBuyPriceRatio: "0.1",
        minOrderSellPriceRatio: "0.1",
        maxPositionSize: "500.0000",
        riskTierList,
        defaultTakerFeeRate: "0.0005",
        defaultMakerFeeRate: "0.0002",
        defaultLeverage: "10",
        liquidateFeeRate: "0.01",
        enableTrade: true,
        enableDisplay: true,
        enableOpenPosition: true,
        fundingInterestRate: "0.0003",
        fundingImpactMarginNotional: "10",
        fundingMaxRate: "0.000234",
        fundingMinRate: "-0.000234",
        fundingRateIntervalMin: "60",
        displayDigitMerge: "0.5,1,2,5",
        displayMaxLeverage: "30",
        displayMinLeverage: "1",
        displayNewIcon: false,
        displayHotIcon: true,
        starkExSyntheticAssetId: "0x4254432d3130000000000000000000",
        starkExResolution: "0x2540be400",
        starkExOraclePriceQuorum: "0x1",
        starkExOraclePriceSignedAssetId: [],
        starkExOraclePriceSigner: [],
      },
      {
        contractId: "10000002",
        contractName: "ETHUSDT",
        baseCoinId: "1000",
        quoteCoinId: "1000",
        tickSize: "0.1",
        stepSize: "0.0001",
        minOrderSize: "0.0010",
        maxOrderSize: "100.0000",
        maxOrderBuyPriceRatio: "0.1",
        minOrderSellPriceRatio: "0.1",
        maxPositionSize: "500.0000",
        riskTierList,
        defaultTakerFeeRate: "0.0005",
        defaultMakerFeeRate: "0.0002",
        defaultLeverage: "10",
        liquidateFeeRate: "0.01",
        enableTrade: true,
        enableDisplay: true,
        enableOpenPosition: true,
        fundingInterestRate: "0.0003",
        fundingImpactMarginNotional: "10",
        fundingMaxRate: "0.000234",
        fundingMinRate: "-0.000234",
        fundingRateIntervalMin: "60",
        displayDigitMerge: "0.5,1,2,5",
        displayMaxLeverage: "30",
        displayMinLeverage: "1",
        displayNewIcon: false,
        displayHotIcon: true,
        starkExSyntheticAssetId: "0x4254432d3130000000000000000000",
        starkExResolution: "0x2540be400",
        starkExOraclePriceQuorum: "0x1",
        starkExOraclePriceSignedAssetId: [],
        starkExOraclePriceSigner: [],
      },
    ],
  },
  collateral: [{ coinId: "1000", amount: "1000" }],
  position: [],
  symbolsList: [
    { contractId: "10000001", symbol: "BTCUSDT", oraclePrice: "70000", quoteCoinId: "1000", riskTierList, stepSize: "0.000001" },
    { contractId: "10000002", symbol: "ETHUSDT", oraclePrice: "4000", quoteCoinId: "1000", riskTierList, stepSize: "0.000001" },
  ],
  account: {
    contractIdToTradeSetting: {
      10000001: {
        isSetFeeRate: false,
        takerFeeRate: "",
        makerFeeRate: "",
        isSetFeeDiscount: false,
        takerFeeDiscount: "",
        makerFeeDiscount: "",
        isSetMaxLeverage: true,
        maxLeverage: "10",
      },
    },
    defaultTradeSetting: {
      isSetFeeRate: false,
      takerFeeRate: "0",
      makerFeeRate: "0",
      isSetFeeDiscount: false,
      takerFeeDiscount: "0",
      makerFeeDiscount: "0",
      isSetMaxLeverage: false,
      maxLeverage: "10",
    },
  },
  withdraw: [
    { coinId: "1000", status: "SUCCESS_L2_APPROVED", amount: "0.5" },
    { coinId: "1000", status: "PENDING_CENSORING", amount: "0.6" },
  ],
  transferOut: [
    { coinId: "1000", status: "SUCCESS_L2_APPROVED", amount: "0.5" },
    { coinId: "1000", status: "PENDING_CENSORING", amount: "0.6" },
    { coinId: "1000", status: "PENDING_CHECKING", amount: "0.7" },
  ],
  order: [],
};
test("test calculateMaxCreateOrderSize", () => {
  const maxSize = calculateMaxCreateOrderSize({ ...fixedParams, orderSide: "SELL", orderPrice: "71000" });

  expect(maxSize.toNumber()).toBe(0.141866);

  const maxSize2 = calculateMaxCreateOrderSize({ ...fixedParams, orderSide: "BUY", orderPrice: "69000" });

  expect(maxSize2.toNumber()).toBe(0.141886);

  const maxSize21 = calculateMaxCreateOrderSize({ ...fixedParams, orderSide: "BUY", orderPrice: "71000" });

  expect(maxSize21.toNumber()).toBe(0.124211);

  const maxSize3 = calculateMaxCreateOrderSize({ ...fixedParams, order: ordersToTest, orderSide: "BUY", orderPrice: "73000" });

  expect(maxSize3.toNumber()).toBe(0.099447);

  const maxSize4 = calculateMaxCreateOrderSize({ ...fixedParams, order: ordersToTest, orderSide: "SELL", orderPrice: "71000" });

  expect(maxSize4.toNumber()).toBe(0.141866);

  const maxSize5 = calculateMaxCreateOrderSize({ ...fixedParams, order: ordersToTest, orderSide: "BUY", orderPrice: "93000" });

  expect(maxSize5.toNumber()).toBe(0.033218);

  const maxSize6 = calculateMaxCreateOrderSize({ ...fixedParams, order: ordersToTest, orderSide: "SELL", orderPrice: "51000" });

  expect(maxSize6.toNumber()).toBe(0.03835);

  const maxSize7 = calculateMaxCreateOrderSize({ ...fixedParams, order: ordersToTest, orderSide: "BUY", orderPrice: "93000", reduceOnly: true });

  expect(maxSize7.toNumber()).toBe(0);
});
