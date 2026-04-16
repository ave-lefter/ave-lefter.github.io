export type BotChain = 'eth' | 'base' | 'bsc' | 'solana' | 'xlayer' | 'ton'
export type MonitorChainType = 'solana' | 'bsc' | 'xlayer';
export type BotSettingKey = 's1' | 's2' | 's3'

export interface SwapCompletedEventPayload {
  fromToken: string;
  toToken: string;
  chain: string;
}
