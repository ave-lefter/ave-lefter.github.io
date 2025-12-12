import {
  calculateTpPriceFromRatio,
  calculateSlPriceFromRatio,
  calculateRatioFromPrice,
  calculatePnLAmountFromPrice,
  calculatePriceFromPnLAmount,
} from "../domain/calculator/tpsl";

describe("TPSL Calculator", () => {
  const priceStep = "0.5";
  const defaultParams = {
    entryPrice: "50000",
    leverage: "10",
    priceStep,
  };

  describe("calculateTpPriceFromRatio", () => {
    it("should calculate LONG TP price correctly (Price UP)", () => {
      // Long TP 20% -> Price moves 2% UP
      // 50000 * (1 + 20/100/10) = 50000 * 1.02 = 51000
      const res = calculateTpPriceFromRatio({
        ...defaultParams,
        side: "LONG",
        ratio: "20",
      });
      expect(res).toBe("51000.0");
    });

    it("should calculate SHORT TP price correctly (Price DOWN)", () => {
      // Short TP 20% -> Price moves 2% DOWN
      // 50000 * (1 - 20/100/10) = 50000 * 0.98 = 49000
      const res = calculateTpPriceFromRatio({
        ...defaultParams,
        side: "SHORT",
        ratio: "20",
      });
      expect(res).toBe("49000.0");
    });
  });

  describe("calculateSlPriceFromRatio", () => {
    it("should calculate LONG SL price correctly (Price DOWN)", () => {
      // Long SL 10% -> Price moves 1% DOWN
      // 50000 * (1 - 10/100/10) = 50000 * 0.99 = 49500
      const res = calculateSlPriceFromRatio({
        ...defaultParams,
        side: "LONG",
        ratio: "10",
      });
      expect(res).toBe("49500.0");
    });

    it("should calculate SHORT SL price correctly (Price UP)", () => {
      // Short SL 10% -> Price moves 1% UP
      // 50000 * (1 + 10/100/10) = 50000 * 1.01 = 50500
      const res = calculateSlPriceFromRatio({
        ...defaultParams,
        side: "SHORT",
        ratio: "10",
      });
      expect(res).toBe("50500.0");
    });
  });

  describe("calculateRatioFromPrice", () => {
    it("should calculate LONG TP Ratio", () => {
      // 51000 vs 50000 -> +2% -> x10 leverage = 20%
      const res = calculateRatioFromPrice({
        entryPrice: "50000",
        triggerPrice: "51000",
        leverage: "10",
        side: "LONG",
        isTp: true,
      });
      expect(res).toBe("20.00");
    });

    it("should calculate SHORT TP Ratio", () => {
      // 49000 vs 50000 -> -2% price (gain for short) -> x10 leverage = 20%
      const res = calculateRatioFromPrice({
        entryPrice: "50000",
        triggerPrice: "49000",
        leverage: "10",
        side: "SHORT",
        isTp: true,
      });
      expect(res).toBe("20.00");
    });

    it("should calculate LONG SL Ratio", () => {
      // 49500 vs 50000 -> -1% price (loss for long) -> x10 leverage = 10% loss
      const res = calculateRatioFromPrice({
        entryPrice: "50000",
        triggerPrice: "49500",
        leverage: "10",
        side: "LONG",
        isTp: false,
      });
      expect(res).toBe("10.00");
    });
  });

  describe("calculatePnLAmountFromPrice", () => {
    it("should calculate LONG TP Amount", () => {
      // (51000 - 50000) * 1 * 1 = 1000
      const res = calculatePnLAmountFromPrice({
        entryPrice: "50000",
        triggerPrice: "51000",
        volume: "1",
        side: "LONG",
        pricePrecision: 2,
        isTp: true,
      });
      expect(res).toBe("1000.00");
    });

    it("should calculate SHORT SL Amount (Absolute Value)", () => {
      // Short SL at 51000 (Price Up = Loss)
      // (51000 - 50000) * (-1) * 1 = -1000 -> abs -> 1000
      const res = calculatePnLAmountFromPrice({
        entryPrice: "50000",
        triggerPrice: "51000",
        volume: "1",
        side: "SHORT",
        pricePrecision: 2,
        isTp: false,
      });
      expect(res).toBe("1000.00");
    });
  });

  describe("calculatePriceFromPnLAmount", () => {
    it("should calculate Price from LONG TP Amount", () => {
      // Entry 50000, Want 1000 Profit, Vol 1 -> Price 51000
      const res = calculatePriceFromPnLAmount({
        entryPrice: "50000",
        amount: "1000",
        volume: "1",
        side: "LONG",
        priceStep,
        isTp: true,
      });
      expect(res).toBe("51000.0");
    });

    it("should calculate Price from SHORT SL Amount", () => {
      // Entry 50000, Want 1000 Loss (input 1000), Vol 1 -> Price 51000
      // Logic: Price = Entry + (-1000 / (1 * -1)) = 50000 + 1000 = 51000
      const res = calculatePriceFromPnLAmount({
        entryPrice: "50000",
        amount: "1000",
        volume: "1",
        side: "SHORT",
        priceStep,
        isTp: false,
      });
      expect(res).toBe("51000.0");
    });
  });
});

