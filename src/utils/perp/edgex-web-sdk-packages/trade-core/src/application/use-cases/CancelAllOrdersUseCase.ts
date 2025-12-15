import { CancelAllOrdersInput } from "../dtos/order.dto";
import { HttpOrderRepository } from "../../infrastructure/repositories/HttpOrderRepository";

export class CancelAllOrdersUseCase {
  constructor(private orderRepository: HttpOrderRepository) {}

  async execute(input: CancelAllOrdersInput): Promise<any> {
    return await this.orderRepository.cancelAll(input);
  }
}
