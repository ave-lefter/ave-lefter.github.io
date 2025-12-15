import request from "@edgex/http-client";
import { CancelAllOrdersInput, CancelOrderInput } from "../../application/dtos/order.dto";
import { CreateOrderParams } from "../builders/OrderParamsBuilder";

export class HttpOrderRepository {
  async create(params: CreateOrderParams & { onErrorHandler?: any }): Promise<any> {
    const { onErrorHandler, ...data } = params;
    try {
      return await request.post("/v1/private/order/createOrder", data);
    } catch (err: any) {
      if (err?.code && onErrorHandler) {
        onErrorHandler(err?.code, err?.errorParam, "submitFail");
      }
      throw err;
    }
  }

  async createTwap(params: {
    orders: any[];
    accountId: string;
    twapGroupId: string;
    twapTotalSize: string | number;
    onErrorHandler?: any;
  }): Promise<any> {
    const { onErrorHandler, ...data } = params;
    try {
      return await request.post("/v1/private/order/createTwapOrders", data);
    } catch (err: any) {
      if (err?.code && onErrorHandler) {
        onErrorHandler(err?.code, err?.errorParam, "submitFail");
      }
      throw err;
    }
  }

  async cancel(input: CancelOrderInput): Promise<any> {
    return await request.post("/v1/private/order/cancelOrderById", {
      accountId: input.accountId,
      orderIdList: input.orderIds,
    });
  }

  async cancelAll(input: CancelAllOrdersInput): Promise<any> {
    return await request.post("/v1/private/order/cancelAllOrder", input, {
      interceptError: false,
    } as any);
  }
}
