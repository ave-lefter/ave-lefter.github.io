import { defineStore } from 'pinia'
import { _getContractCheckResult, type Check, type PairHoldersRank} from '@/api/check'

export const useCheckStore = defineStore('check', () => {
  const checkResult = ref<null | Check>(null)
  const showResult = shallowRef(false)
  const progress = shallowRef(0)
  const hasLpLock = shallowRef(false)
  const statistics_risk_store = shallowRef(0)
  const statistics_warning_store = shallowRef(0)
  const statistics_unknown_store = shallowRef(0)

  function getContractCheckResult(token_id: string, user_address: string) {
    _getContractCheckResult(token_id, user_address).then((res) => {
      const result = res.token_contract

      const a = result?.contract_data?.audits_info
      let audits_info = null
      if (a) {
        audits_info = JSON.parse(a)
      }
      const owner_txs =
        result?.contract_data?.owner_txs?.filter(
          (i) => i?.params && i?.params?.length > 0
        ) || []
      if (result.contract_data !== null) {
        showResult.value = true
      }
      const list = result.contract_data?.pair_holders_rank || []
      const q = list.reduce((p, c) => {
        let s = 0
        if (formatLock(c)) {
          s = Number(c?.quantity)
        }
        return p + s
      }, 0)
      const p = q / Number(result?.contract_data?.pair_total)
      hasLpLock.value =
      result?.contract_data?.is_locked ||
        ((result?.contract_data?.pair_holders_rank?.some?.(i => formatLock(i)) && p > 0.001)?? false)
      progress.value = (result?.contract_data?.risk_score??0) / 100 || 0
      const m = {
        ...result?.contract_data,
        ...result,
        audits_info,
        owner_txs,
      }
      // Reflect.deleteProperty(m, 'contract_data')
      checkResult.value = m
    })
  }




  function formatLock(item: PairHoldersRank | null) {
    return item?.lock || /lock|null|(black hole)/gi.test(item?.mark || '')
  }
  return {
    hasLpLock,
    progress,
    showResult,
    checkResult,
    statistics_risk_store,
    statistics_warning_store,
    statistics_unknown_store,
    getContractCheckResult
  }
})
