/**
 * DTO for Account related Use Cases
 */
export interface UpdateLeverageInput {
  accountId: string;
  contractId: string;
  leverage: number;
}

export interface GetPositionTermPageInput {
  accountId?: string;
  size?: number;
  offsetData?: string;
  filterContractIdList?: string;
  filterStartCreatedTimeInclusive?: number | string;
  filterEndCreatedTimeExclusive?: number | string;
  // Allow additional filters if the API supports them
  [key: string]: any;
}

export interface GetPositionTransactionPageInput {
  accountId?: string;
  filterTypeList?: string;
  size?: number;
  offsetData?: string;
  filterContractIdList?: string;
  filterStartCreatedTimeInclusive?: number | string;
  filterEndCreatedTimeExclusive?: number | string;
  filterCloseOnly?: boolean;
  [key: string]: any;
}
