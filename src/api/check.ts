export interface PairHoldersRank {
  address?: string
  is_contract?: number
  lock?: Array<{
    unlockDate?: number
    lockDate?: number
    amount?: number
    vesting_end: number
  }>
  mark?: string
  percent?: string
  quantity?: string
  analysis_show_warning?: string
  analysis_show_creator?: string
}
export interface OwnerTxs {
  method_code?: string
  timestamp?: number
  params?: Array<{
    name: string
    type?: string
    value?: any
    is_trader_addr?: any
  }> | null
  tx_hash?: string
  method_name?: string
}
interface ContractData {
  audits_info?: string
  owner_txs?: Array<OwnerTxs>
  pair_holders_rank?: Array<PairHoldersRank | null>
  pair_total?: number
  is_safu_contract?: number
  risk_score?: number
  is_locked?: boolean
  audit_pass_by?: string
  audit_link?: string
  is_honeypot?: -1 | 0 | 1
  has_code?: number
  owner_change_balance?: string
  is_proxy?: string
  owner?: string
  owner_type?: string
  can_take_back_ownership?: string
  hidden_owner?: string
  has_owner_removed_risk?: number
  slippage_modifiable?: number
  has_white_method?: number
  has_black_method?: number

  has_mint_method?: number
  hasLpLock?: any
  other_potential_risks?: any
  note?: any
  is_recidivist?: any
  has_malicious_code?: number
  has_sell_max_limit?: number
  can_remove_liqudity?: any
  liquidity_provider?: any
  pair_lock_percent?: number
  has_top10_holder_amount_over_30?: any
  has_not_burned_lp?: any

  trading_cooldown?: string
  external_call?: string
  ave_remarks?: string
  avg_tax_too_high?: string | number
  holder_analysis?: {
    average_tax?: number
    balance_disappeared?: number
    sell_failure?: number
    sell_successful?: number
    simulate_holders?: number
    tax_distribution?: Array<{
      tax: string | number
      count: string | number
    }>
  }
  some_users_are_blocked?: any
  some_users_balance_are_tampered?: any
  is_anti_whale?: string
  anti_whale_modifiable?: string
  cannot_sell_all?: string
  wallet_count_24h_buy?: any
  wallet_count_24h_sell?: any
  vol_24h_top100?: any
  vol_24h_top10?: string | number
  personal_slippage_modifiable?: string
  selfdestruct?: string
  sell_gas?: string
  buy_gas?: string
  approve_gas?: string
  analysis_creator_gt_5percent?: number
  analysis_scam_wallet?: string
  analysis_lp_creator_gt_5percent?: number
  analysis_big_wallet?: string
  analysis_lp_locked_or_burned_gt_15days?: string | number
  analysis_lp_current_adequate?: string
  big_lp_without_any_lock?: string | number
  buy_tax?: number
  sell_tax?: number
  tm_buy_tax_for_lp?: string
  tm_buy_tax_for_burn?: string
  tm_buy_tax_for_fund?: string
  tm_buy_tax_for_holders?: string
  tm_buy_tax_for_lp_holders?: string
  tm_buy_tax_for_team?: string
  tm_buy_tax_for_inviter?: string
  tm_buy_tax_for_other?: string
  tm_sell_tax_for_lp?: string
  tm_sell_tax_for_burn?: string
  tm_sell_tax_for_fund?: string
  tm_sell_tax_for_holders?: string
  tm_sell_tax_for_lp_holders?: string
  tm_sell_tax_for_team?: string
  tm_sell_tax_for_inviter?: string
  tm_sell_tax_for_other?: string
  holders?: number
  pair_holders?: number
  total?: string
  token_holders_rank?: Array<{
    address?: string
    lock?: Array<{
      unlockDate?: number
      lockDate?: number
      amount?: number
      vesting_end: number
    }>
    mark?: string
    percent?: string
    quantity?: string
    analysis_show_warning?: string | number
    analysis_show_creator?: string | number
    is_lp?: string | number
    is_contract?: string | number | null
  }>
  buy_max_amount_per_tx?: string | number
  sell_max_amount_per_tx?: string | number
  tm_max_hold_amount_per_wallet?: string | number
  tm_bonus_token_name?: string
  tm_bonus_token_for_lp_holders?: string
  market_wallet?: string
  team_wallet?: string
  tm_kill_block_after_open?: string | number
  tm_start_trade_at_block?: string | number
  mechanism_intro?: string
  tm_bonus_token_for_holders?: string
  tm_bonus_token_name_for_lp?: string
  is_low_liquidity?: number
  creator_address?: string
  ai_report: AiReport
}
export interface AiReport {
    fee_structure: {
      buy_fee: string
      max_tx_amount: string
      sell_fee: string
      transfer_fee: string
    }
    mechanism_en: string
    mechanism_zh: string
    ownerControl: string[]
    risk: Risk[]
    summary: {
      audit_pass_by: string
      has_backdoor: boolean
      has_external_dependency_risk: boolean
      has_fee_abuse: boolean
      has_hidden_permissions: boolean
      has_logic_confusion: boolean
      has_mint_burn_risk: boolean
      has_reentrancy_risk: boolean
      has_slippage_risk: boolean
      has_transfer_risk: boolean
      has_whitelist_abuse: boolean
      is_owner_renounced: number
      risk_level: string
    }
  }
interface Risk {
  code_snippet?: string
  description_en: string
  description_zh: string
  is_related_to_owner: boolean
  name_en: string
  name_zh: string
  risk_level: number
  risk_removed: number
}
interface TokenContract {
  chain?: string
  token?: string
  daily_activity_addr?: number
  my_vote?: number
  tx_count?: number
  vote_against?: number
  vote_support?: number
  is_locked?: boolean
  contract_data?: ContractData
}
interface CheckResult {
  chain: string
  token: string
  token_contract: TokenContract
}

export type Check = ContractData & Omit<TokenContract, 'contract_data'>

export function _getContractCheckResult(
  token_id: string,
  user_address?: string
): Promise<CheckResult> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/contract', {
    method: 'get',
    query: {
      token_id: token_id,
      type: 'token',
      user_address: user_address,
    },
  })
}

export function _voteSupport(
  token_id: string,
  user_address: string
) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/tokens/${token_id}/vote/support`, {
    method: 'post',
    body: {
      user_address: user_address,
    },
  })
}

export function _voteAgainst(token_id: string, user_address: string) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/tokens/${token_id}/vote/against`, {
    method: 'post',
    body: {
      user_address: user_address,
    }
  })
}
export function _getVote(token_id: string, user_address?: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/contract/vote', {
    method: 'get',
    query: {
      token_id: token_id,
      user_address: user_address,
    },
  })
}

// getLPHolders
export function getLPHolders(tokenId: string): Promise<Array<{
  address: string
  quantity: string
  mark: string
  lock: null | Array<{
    id: number
    token: string
    owner: string
    amount: number
    lockDate: number
    unlockDate: number
    vesting_end?: number
  }>
  percent: string
  analysis_show_creator?: string
  analysis_show_warning?: string
  is_contract?: number
}>> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/lp_holders', {
    method: 'get',
    query: {
      token_id: tokenId,
    }
  })
}
