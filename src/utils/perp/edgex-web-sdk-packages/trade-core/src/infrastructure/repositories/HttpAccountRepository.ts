import request from "@edgex/http-client";
import { UpdateLeverageInput, GetPositionTermPageInput, GetPositionTransactionPageInput } from "../../application/dtos/account.dto";
import { PositionTransactionEntry, PositionTermListEntry } from "@edgex/types";

export class HttpAccountRepository {
  async updateLeverage(input: UpdateLeverageInput): Promise<any> {
    return request.post("/v1/private/account/updateLeverageSetting", {
      accountId: input.accountId,
      contractId: input.contractId,
      leverage: String(input.leverage),
    });
  }

  async getPositionTransactionPage(params: GetPositionTransactionPageInput): Promise<{
    dataList: PositionTransactionEntry[];
    nextPageOffsetData?: string;
  }> {
    const res = await request.get("/v1/private/account/getPositionTransactionPage", {
      params,
    });
    return res.data?.data || { dataList: [] };
  }

  async getPositionTermPage(params: GetPositionTermPageInput): Promise<{
    dataList: PositionTermListEntry[];
    nextPageOffsetData?: string;
  }> {
    const res = await request.get("/v1/private/account/getPositionTermPage", {
      params,
    });
    return res.data?.data || { dataList: [] };
  }
}
