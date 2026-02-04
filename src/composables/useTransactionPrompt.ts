import { reactive } from 'vue'
import { formatExplorerUrl } from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'

export interface ShowExecutingOptions {
  startTime?: number
}

export interface ShowSuccessOptions {
  chain: string
  txHash: string
  elapsedSec: number
  isBuy: boolean
  fromSymbol?: string
  fromAmount?: string | number
  toSymbol?: string
  toAmount?: string | number
}

export interface ShowOrderOptions {
  fromSymbol: string
  fromAmount: string | number
  toSymbol: string
  toAmount: string | number
}

export interface TransactionPromptSuccessPayload {
  isBuy: boolean
  elapsedSec: number
  explorerUrl: string
  fromSymbol: string
  fromAmount: string | number
  toSymbol: string
  toAmount: string | number
}

/** 单槽位状态，供 TransactionPromptSlot 读取 */
export const transactionPromptState = reactive<{
  type: 'executing' | 'success' | null
  executingSeconds: number
  successPayload: TransactionPromptSuccessPayload | null
}>({
  type: null,
  executingSeconds: 0,
  successPayload: null,
})

/** 成功提示自动隐藏时长（毫秒） */
const SUCCESS_AUTO_HIDE_MS = 7000
let successHideTimer: ReturnType<typeof setTimeout> | null = null

function clearSuccessHideTimer() {
  if (successHideTimer) {
    clearTimeout(successHideTimer)
    successHideTimer = null
  }
}

function closeExecuting() {
  transactionPromptState.type = transactionPromptState.type === 'executing' ? null : transactionPromptState.type
  transactionPromptState.executingSeconds = 0
}

function formatAmount(val: string | number | undefined): string {
  if (val === undefined || val === null) return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return String(val)
  return formatNumber(n, 4)
}

export function useTransactionPrompt() {
  function updateExecutingSeconds(seconds: number) {
    if (transactionPromptState.type === 'executing') {
      transactionPromptState.executingSeconds = seconds
    }
  }

  function showExecuting(_options: ShowExecutingOptions = {}) {
    clearSuccessHideTimer()
    transactionPromptState.type = 'executing'
    transactionPromptState.executingSeconds = 0
    transactionPromptState.successPayload = null
    return {
      update: updateExecutingSeconds,
      close: closeExecuting,
    }
  }

  function showSuccess(options: ShowSuccessOptions) {
    closeExecuting()
    clearSuccessHideTimer()
    const explorerUrl = options.txHash ? formatExplorerUrl(options.chain, options.txHash, 'tx') : ''
    const elapsedSec = Number((options.elapsedSec).toFixed(1))
    transactionPromptState.type = 'success'
    transactionPromptState.successPayload = {
      isBuy: options.isBuy,
      elapsedSec,
      explorerUrl,
      fromSymbol: options.fromSymbol ?? '',
      fromAmount: options.fromAmount ?? 0,
      toSymbol: options.toSymbol ?? '',
      toAmount: options.toAmount ?? 0,
    }
    successHideTimer = setTimeout(() => {
      transactionPromptState.type = null
      transactionPromptState.successPayload = null
      successHideTimer = null
    }, SUCCESS_AUTO_HIDE_MS)
  }

  function showOrder(options: ShowOrderOptions) {
    // 订单已合并到 showSuccess 内，单独调用时仅更新 successPayload 的订单字段（若当前为 success）
    if (transactionPromptState.type === 'success' && transactionPromptState.successPayload) {
      transactionPromptState.successPayload = {
        ...transactionPromptState.successPayload,
        fromSymbol: options.fromSymbol,
        fromAmount: options.fromAmount,
        toSymbol: options.toSymbol,
        toAmount: options.toAmount,
      }
    }
  }

  function closeAll() {
    closeExecuting()
    clearSuccessHideTimer()
    transactionPromptState.type = null
    transactionPromptState.successPayload = null
  }

  return {
    showExecuting,
    showSuccess,
    showOrder,
    closeExecuting,
    close: closeAll,
    updateExecutingSeconds,
    formatAmount,
  }
}
