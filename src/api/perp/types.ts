import type { TradeOrderParams } from '@edgex-fe/typescript-sdk'

type MakeOptional<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;


export type PerpOrderParams = MakeOptional<TradeOrderParams, 'accountId' | 'timeInForce'>
