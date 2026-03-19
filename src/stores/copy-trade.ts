import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import {
  _getFollowingInfo,
  _getFollowingAddress,
  type CopyObj,
  type CopyOrder,
} from '@/api/copyTrade'
import { SupportCopyTradeChain } from '@/utils/constants'

export const useCopyTradeStore = defineStore('copyTrade', () => {
  const botStore = useBotStore()
  const type = shallowRef(1)
  const copyTradeVisible = shallowRef(false)
  const copyTradeAddVisible = shallowRef(false)
  const copyOrderLoading = shallowRef(false)
  const activeCopyAddress = ref<Record<string, string[]>>({})
  const form = ref({
    id: 0,
    followAddress: '',
    buyType: 2, // 1:等比例买, 2:固定金额, 3:最大跟买
    buyAmount: '',
    maxBuyRatio: '',
    sellType: 1, //0:手动卖(不跟单卖), 1:自动跟卖, 2:止盈止损
    takeProfitRatio: '',
    stopLossRatio: '',
    ignoreHeld: false,
    buyOnce: false,
    chain: 'bsc',

    slippage: 9, //滑点
    isPrivate: false, //防夹
    priorityFee: '', //优先费/gas费
  })
  const advancedForm = ref({
    minBuyValue: '',
    maxBuyValue: '',
    minMarketCap: '',
    maxMarketCap: '',
    minLiquidity: '',
    maxLiquidity: '',
    minTokenAge: 0,
    maxTokenAge: 0,
    enableAt: 0,
    disableAt: 0,
  })


  const blacklist = ref<{ id: number; value: string }[]>([])
  const copyOrder = ref<CopyOrder | null>(null)
  const defaultCopyObj: CopyObj = {
    followName: '',
    creatorAddress: '',
    chain: '',
    id: 0,
  }
  const copyObj = useLocalStorage<CopyObj>('copy_obj', defaultCopyObj)
  const setting = ref({
    slippage: 9, //滑点
    isPrivate: false, //防夹
    priorityFee: '', // gas/优先费
  })
  interface CopyTradeSetting {
    slippage: number // 滑点
    isPrivate: boolean // 防夹
    priorityFee: string // gas / 优先费
  }
  type CopyTradeChain = (typeof SupportCopyTradeChain)[number]
  const defaultCopyTradeSetting: CopyTradeSetting = {
    slippage: 9,
    isPrivate: false,
    priorityFee: '',
  }
  // const settingCopyTrade = useLocalStorage<Partial<Record<CopyTradeChain, CopyTradeSetting>>>(
  //   'copy_setting',
  //   {}
  // )

  const settingCopyTrade = ref<Partial<Record<CopyTradeChain, CopyTradeSetting>>>({})
  SupportCopyTradeChain.forEach((chain) => {
    if (!settingCopyTrade.value[chain]) {
      settingCopyTrade.value[chain] = {
        ...defaultCopyTradeSetting,
        priorityFee: chain == 'solana' ? '0.001' : '0.05',
      }
    }
  })
  async function getFollowingInfo() {
    if (!botStore?.evmAddress) return
    copyOrderLoading.value = true
    try {
      const res = await _getFollowingInfo(botStore.evmAddress)
      copyOrder.value = {
        ...res,
        copyList: Array.isArray(res?.copyList)
          ? res.copyList.map((i) => ({
              ...i,
              lastSwap:
                i?.lastSwap !== '1970-01-01T00:00:00Z' && i?.lastSwap !== '0001-01-01T00:00:00Z'
                  ? i.lastSwap
                  : '0',
            }))
          : [],
      }
    } catch (err) {
      console.log('_getFollowingInfo', err)
     // throw err // 👈 需要外层感知失败就保留
    } finally {
      copyOrderLoading.value = false
    }
  }

  async function getFollowingAddress() {
    if (!botStore?.evmAddress) {
      return
    }

    activeCopyAddress.value = await _getFollowingAddress(botStore?.evmAddress)
    console.log('-----activeCopyAddress.value -------', activeCopyAddress.value)
  }
  return {
    copyTradeVisible,
    copyTradeAddVisible,
    setting,
    copyObj,
    getFollowingInfo,
    getFollowingAddress,
    copyOrder,
    copyOrderLoading,
    form,
    advancedForm,
    blacklist,
    activeCopyAddress,
    settingCopyTrade,
    defaultCopyTradeSetting,
    type
  }
})
