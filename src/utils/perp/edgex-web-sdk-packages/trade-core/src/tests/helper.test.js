const { findRiskTier } = require("@/components/calculator/helper");

const fixRiskTiers = [
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

test("findRiskTier", () => {
  const riskTier = findRiskTier("5", fixRiskTiers);
  expect(riskTier.tier).toBe(1);
  const riskTier10 = findRiskTier("10", fixRiskTiers);
  expect(riskTier10.tier).toBe(2);
});
