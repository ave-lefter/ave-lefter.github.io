import { reactive } from 'vue'
import { formatExplorerUrl } from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'

export interface ExecutingOptions {
  avatarAddress?: string
  avatarChain?: string
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
  avatarAddress?: string
  avatarChain?: string
}

export interface TransactionPromptSuccessPayload {
  isBuy: boolean
  /** 耗时（毫秒），用于展示「仅耗时0.47秒」 */
  elapsedMs: number
  explorerUrl: string
  fromSymbol: string
  fromAmount: string | number
  toSymbol: string
  toAmount: string | number
}

export interface TransactionPromptMessage {
  id: string
  type: 'executing' | 'success' | 'order'
  /** 执行中已耗时（毫秒），用于展示 0.42s */
  executingMs: number
  successPayload: TransactionPromptSuccessPayload | null
  avatarAddress?: string
  avatarChain?: string
}

/** 成功提示自动隐藏时长（毫秒） */
const SUCCESS_AUTO_HIDE_MS = 7000
/** 买入时：成功展示多久后新增「订单详情」消息（毫秒） */
const SUCCESS_TO_ORDER_MS = 1000

const SPEED_FACTOR = 0.7 // 用于模拟更快的执行速度，提升用户体验。实际耗时乘以该系数后展示给用户。

let idSeed = 0
function generateId() {
  idSeed += 1
  return `tx-prompt-${idSeed}-${Date.now()}`
}

/** 消息列表，供 TransactionPromptSlot 渲染多条（类似 Element Message）。新消息 unshift 到顶部，可同时存在多条。 */
export const transactionPromptList = reactive<TransactionPromptMessage[]>([])

const messageTimers = new Map<string, ReturnType<typeof setTimeout>>()

function clearTimers(id: string) {
  const keys = Array.from(messageTimers.keys()).filter((k) => k.startsWith(`${id}:`))
  keys.forEach((k) => {
    const t = messageTimers.get(k)
    if (t) {
      clearTimeout(t)
      messageTimers.delete(k)
    }
  })
  const t = messageTimers.get(id)
  if (t) {
    clearTimeout(t)
    messageTimers.delete(id)
  }
}

function removeMessage(id: string) {
  clearTimers(id)
  const idx = transactionPromptList.findIndex((m) => m.id === id)
  if (idx !== -1) transactionPromptList.splice(idx, 1)
}

/** 买入时新增一条独立的「订单详情」消息，与 success 同时存在 */
function addOrderMessage(successMessage: TransactionPromptMessage) {
  if (!successMessage.successPayload?.isBuy) return
  const orderId = generateId()
  const orderMessage: TransactionPromptMessage = {
    id: orderId,
    type: 'order',
    executingMs: 0,
    successPayload: { ...successMessage.successPayload },
    avatarAddress: successMessage.avatarAddress,
    avatarChain: successMessage.avatarChain,
  }
  transactionPromptList.unshift(orderMessage)
  const t = setTimeout(() => {
    removeMessage(orderId)
    messageTimers.delete(orderId)
  }, SUCCESS_AUTO_HIDE_MS)
  messageTimers.set(orderId, t)
}

function buildSuccessPayload(options: ShowSuccessOptions): TransactionPromptSuccessPayload {
  const explorerUrl = options.txHash ? formatExplorerUrl(options.chain, options.txHash, 'tx') : ''
  const elapsedMs = Math.round((options.elapsedSec ?? 0) * SPEED_FACTOR * 1000)
  return {
    isBuy: options.isBuy,
    elapsedMs,
    explorerUrl,
    fromSymbol: options.fromSymbol ?? '',
    fromAmount: options.fromAmount ?? 0,
    toSymbol: options.toSymbol ?? '',
    toAmount: options.toAmount ?? 0,
  }
}

export type TransactionPromptHandle = {
  /** 更新执行中耗时（毫秒），用于展示 0.42s */
  update(ms: number): void
  success(options: ShowSuccessOptions): void
  /** 切换到第三步「订单详情」（仅买入有效） */
  showOrderDetail(): void
  close(): void
}

/**
 * 命令式 API：先显示 executing，再通过 handle.success() 转为 success（同一条消息）
 * 支持同时存在多条消息，类似 Element Message。
 */
export function useTransactionPrompt() {
  /** 显示「执行中」并返回句柄，后续可 update / success / showOrderDetail / close */
  function executing(options: ExecutingOptions = {}): TransactionPromptHandle {
    const id = generateId()
    const message: TransactionPromptMessage = {
      id,
      type: 'executing',
      executingMs: 0,
      successPayload: null,
      avatarAddress: options.avatarAddress,
      avatarChain: options.avatarChain,
    }
    transactionPromptList.unshift(message)

    return {
      update(ms: number) {
        const m = transactionPromptList.find((i) => i.id === id)
        if (m && m.type === 'executing') m.executingMs = ms * SPEED_FACTOR
      },
      success(successOptions: ShowSuccessOptions) {
        const m = transactionPromptList.find((i) => i.id === id)
        if (!m) return
        clearTimers(id)
        m.type = 'success'
        m.executingMs = 0
        m.successPayload = buildSuccessPayload(successOptions)
        if (successOptions.avatarAddress !== undefined) m.avatarAddress = successOptions.avatarAddress
        if (successOptions.avatarChain !== undefined) m.avatarChain = successOptions.avatarChain
        const t = setTimeout(() => {
          removeMessage(id)
          messageTimers.delete(id)
        }, SUCCESS_AUTO_HIDE_MS)
        messageTimers.set(id, t)
        if (successOptions.isBuy) {
          const orderT = setTimeout(() => {
            addOrderMessage(m)
            messageTimers.delete(`${id}:order`)
          }, SUCCESS_TO_ORDER_MS)
          messageTimers.set(`${id}:order`, orderT)
        }
      },
      showOrderDetail() {
        const m = transactionPromptList.find((i) => i.id === id)
        if (m && m.successPayload?.isBuy) addOrderMessage(m)
      },
      close() {
        removeMessage(id)
      },
    }
  }

  /** 仅显示「成功」（不经过 executing），用于直接展示成功结果 */
  function success(options: ShowSuccessOptions): { close: () => void; showOrderDetail: () => void } {
    const id = generateId()
    const message: TransactionPromptMessage = {
      id,
      type: 'success',
      executingMs: 0,
      successPayload: buildSuccessPayload(options),
      avatarAddress: options.avatarAddress,
      avatarChain: options.avatarChain,
    }
    transactionPromptList.unshift(message)
    const t = setTimeout(() => {
      removeMessage(id)
      messageTimers.delete(id)
    }, SUCCESS_AUTO_HIDE_MS)
    messageTimers.set(id, t)
    if (options.isBuy) {
      const orderT = setTimeout(() => {
        addOrderMessage(message)
        messageTimers.delete(`${id}:order`)
      }, SUCCESS_TO_ORDER_MS)
      messageTimers.set(`${id}:order`, orderT)
    }
    return {
      close: () => removeMessage(id),
      showOrderDetail: () => addOrderMessage(message),
    }
  }

  /** 关闭指定 id 的消息（供 Slot 点击关闭时调用） */
  function close(id: string) {
    removeMessage(id)
  }

  /** 关闭全部 */
  function closeAll() {
    transactionPromptList.splice(0, transactionPromptList.length)
    messageTimers.forEach((t) => clearTimeout(t))
    messageTimers.clear()
  }

  function formatAmount(val: string | number | undefined): string {
    if (val === undefined || val === null) return '0'
    const n = Number(val)
    if (Number.isNaN(n)) return String(val)
    return formatNumber(n, 4)
  }

  return {
    executing,
    success,
    close,
    closeAll,
    formatAmount,
  }
}
