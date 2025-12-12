import { calculateTwapSizes, generateTwapGroupId } from "../../domain/calculator";
import { CreateTwapOrderInput } from "../dtos/order.dto";
import { HttpOrderRepository } from "../../infrastructure/repositories/HttpOrderRepository";
import { OrderParamsBuilder } from "../../infrastructure/builders/OrderParamsBuilder";

export class CreateTwapOrderUseCase {
  constructor(private readonly orderRepo: HttpOrderRepository) {}

  async execute(input: CreateTwapOrderInput) {
    const { params, symbolInfo, metadata, currentActiveAccount, currentActiveChainId } = input;
    const { onErrorHandler, size, ...orderOptions } = params;

    if (!symbolInfo) {
      throw new Error(`Symbol info is required for TWAP orders`);
    }

    const sizes = calculateTwapSizes(params.size, symbolInfo.maxMarketPositionSize);

    // 为每个拆分的订单生成参数
    const orders = await Promise.all(
      sizes.map((splitSize: string | number) =>
        OrderParamsBuilder.build(
          { ...orderOptions, size: splitSize },
          metadata,
          currentActiveAccount,
          currentActiveChainId,
        ),
      ),
    );

    const twapGroupId = generateTwapGroupId();
    const twapTotalSize = params.size;
    const accountId = orders[0]?.accountId;

    const result = await this.orderRepo.createTwap({
      orders,
      accountId,
      twapGroupId,
      twapTotalSize,
      onErrorHandler,
    });

    return {
      data: result,
      sizes,
      success: true,
    };
  }
}
