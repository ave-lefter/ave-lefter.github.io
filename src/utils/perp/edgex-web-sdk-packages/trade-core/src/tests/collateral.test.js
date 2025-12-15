/**
 * 抵押品相关的计算测试
 */

const { getCollateralInfo } = require("@/components/calculator/collateral");

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

test("test getCollateralInfo", () => {
  const result = getCollateralInfo({
    quoteCoinId: "1001",
    collateral: [{ coinId: "1001", amount: "5000" }],
    position: [
      { contractId: "10000001", coinId: "1001", openSize: "-0.01", quoteCoinRealPrecision: 4 },
    ],
    symbolsList: [{ contractId: "10000001", symbol: "BTCUSDT", oraclePrice: "70000", riskTierList }],
    metadata: {
      contractList: [
        {
          contractId: "10000001",
          contractName: "BTCUSDT",
          baseCoinId: "1001",
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
        maxLeverage: "0",
      },
    },
    withdraw: [
      { coinId: "1001", status: "SUCCESS_L2_APPROVED", amount: "0.5" },
      { coinId: "1001", status: "PENDING_CENSORING", amount: "0.6" },
    ],
    transferOut: [
      { coinId: "1001", status: "SUCCESS_L2_APPROVED", amount: "0.5" },
      { coinId: "1001", status: "PENDING_CENSORING", amount: "0.6" },
      { coinId: "1001", status: "PENDING_CHECKING", amount: "0.7" },
    ],
    order: [],
  });

  expect(result.totalEquity.toNumber()).toBe(4300);
  expect(result.totalInitialMarginRequirement.toNumber()).toBe(70);
  expect(result.totalStarkExRiskValue.toFixed(0)).toBe("35");
  expect(result.totalPendingWithdrawAmount.toNumber()).toBe(0.6);
  expect(result.totalPendingTransferOutAmount.toNumber()).toBe(1.3);
});
