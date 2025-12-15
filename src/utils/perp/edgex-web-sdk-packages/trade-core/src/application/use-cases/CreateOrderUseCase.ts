import { CreateOrderInput } from "../dtos/order.dto";
import { HttpOrderRepository } from "../../infrastructure/repositories/HttpOrderRepository";
import { OrderParamsBuilder } from "../../infrastructure/builders/OrderParamsBuilder";

export class CreateOrderUseCase {
  constructor(private readonly orderRepo: HttpOrderRepository) {}

  async execute(input: CreateOrderInput) {
    const { params, metadata, currentActiveAccount, currentActiveChainId } = input;
    const { onErrorHandler, ...orderOptions } = params;

    const orderParams = await OrderParamsBuilder.build(
      orderOptions,
      metadata,
      currentActiveAccount,
      currentActiveChainId,
    );

    const result = await this.orderRepo.create({ ...orderParams, onErrorHandler });
    return {
      data: result,
      success: true,
    };
  }
}
