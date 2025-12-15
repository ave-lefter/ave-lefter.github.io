import { Order } from "../../domain/entities/Order";

export interface GetConditionalOrdersInput {
  orders: Order[];
  contractId?: string;
}

export class GetConditionalOrdersUseCase {
  execute(input: GetConditionalOrdersInput): Order[] {
    const { orders, contractId } = input;

    let result = orders.filter((order) => order.isConditional());

    if (contractId) {
      result = result.filter((order) => order.contractId === contractId);
    }

    return result;
  }
}
