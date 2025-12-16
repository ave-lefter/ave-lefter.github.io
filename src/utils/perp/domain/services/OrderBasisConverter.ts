import { OrderBasis } from "../value-objects/OrderEnums";
import { toPrecisionString, toTickSizeRoundString } from "../../utils";

/**
 * Order Basis Converter
 *
 * Converts order quantity between different basis types:
 * - Size: quantity in base coin (e.g., 0.001 BTC)
 * - Value: value in quote coin (e.g., 100 USD)
 * - Margin: initial margin in quote coin (e.g., 10 USD)
 */
export class OrderBasisConverter {
  /**
   * Convert order quantity from one basis to another
   *
   * @param fromBasis - Source basis type
   * @param toBasis - Target basis type
   * @param quantity - Quantity to convert
   * @param params - Conversion parameters
   * @returns Converted quantity as string, or original quantity if conversion is not needed
   */
  static convert(
    fromBasis: OrderBasis,
    toBasis: OrderBasis,
    quantity: string,
    params: {
      price: number;
      maxLeverage: number;
      pricePrecision: number;
      sizeStep: string;
    },
  ): string {
    if (fromBasis === toBasis) {
      return quantity;
    }

    const { price, maxLeverage, pricePrecision, sizeStep } = params;
    const qtyNum = Number(quantity);

    if (!quantity || !qtyNum || qtyNum <= 0 || !price || price <= 0) {
      return quantity;
    }

    // Size -> Value
    if (fromBasis === OrderBasis.Size && toBasis === OrderBasis.Value) {
      const targetValue = qtyNum * price;
      return toPrecisionString(targetValue, pricePrecision);
    }

    // Value -> Size
    if (fromBasis === OrderBasis.Value && toBasis === OrderBasis.Size) {
      const targetQty = qtyNum / price;
      return toTickSizeRoundString(targetQty, sizeStep);
    }

    // Size -> Margin
    if (fromBasis === OrderBasis.Size && toBasis === OrderBasis.Margin) {
      const targetValue = qtyNum * price;
      return toPrecisionString(targetValue / maxLeverage, 2);
    }

    // Margin -> Size
    if (fromBasis === OrderBasis.Margin && toBasis === OrderBasis.Size) {
      const targetValue = qtyNum * maxLeverage;
      return toTickSizeRoundString(targetValue / price, sizeStep);
    }

    // Value -> Margin
    if (fromBasis === OrderBasis.Value && toBasis === OrderBasis.Margin) {
      return toPrecisionString(qtyNum / maxLeverage, 2);
    }

    // Margin -> Value
    if (fromBasis === OrderBasis.Margin && toBasis === OrderBasis.Value) {
      return toPrecisionString(qtyNum * maxLeverage, pricePrecision);
    }

    return quantity;
  }
}

