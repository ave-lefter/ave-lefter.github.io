import { CancelOrderInput } from "../dtos/order.dto";
import { HttpOrderRepository } from "../../infrastructure/repositories/HttpOrderRepository";

export class CancelOrderUseCase {
  constructor(private readonly orderRepo: HttpOrderRepository) {}

  async execute(input: CancelOrderInput) {
    return this.orderRepo.cancel(input);
  }
}
