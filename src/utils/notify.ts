import { ElNotification, type NotificationOptions, type NotificationParams } from 'element-plus'

// 通知队列项类型（存储配置和入队时间）
type NotifyQueueItem = {
  options: NotificationOptions & NotificationParams
  enqueueTime: number // 入队时间戳
}

// 队列管理
let notifyQueue: NotifyQueueItem[] = []
let isProcessing = false // 是否正在处理队列
const MIN_INTERVAL = 500 // 最小触发间隔（ms）
let lastTriggerTime = 0 // 上一条消息的实际触发时间

/**
 * 按顺序触发所有通知，相邻消息触发间隔不小于0.5秒
 * 不等待消息关闭，仅控制触发时间间隔
 */
const enqueueNotify = (options: NotificationOptions & NotificationParams) => {
  // 新消息入队（记录入队时间）
  notifyQueue.push({
    options,
    enqueueTime: Date.now()
  })

  // 若未在处理队列，立即启动处理
  if (!isProcessing) {
    processQueue()
  }
}

/**
 * 处理队列：按顺序触发消息，保证间隔≥0.5秒
 */
const processQueue = () => {
  if (notifyQueue.length === 0) {
    // 队列清空，重置状态
    isProcessing = false
    return
  }

  isProcessing = true
  const currentItem = notifyQueue.shift()!
  const now = Date.now()

  // 计算当前消息需要延迟的时间：
  // 确保与上一条消息的触发时间间隔≥0.5秒
  const timeSinceLastTrigger = now - lastTriggerTime
  const delay = Math.max(0, MIN_INTERVAL - timeSinceLastTrigger)

  // 延迟触发当前消息
  setTimeout(() => {
    // 触发通知（不等待关闭，直接记录触发时间）
    ElNotification(currentItem.options)
    lastTriggerTime = Date.now() // 更新上一条触发时间

    // 立即处理下一条（下一条会自动计算间隔）
    processQueue()
  }, delay)
}

export default enqueueNotify
