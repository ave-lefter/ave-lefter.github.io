<template>
  <div class="transaction-prompt">
    <!-- 交易执行中 -->
    <template v-if="type === 'executing'">
      <div class="transaction-prompt__row">
        <span class="transaction-prompt__label">{{ $t('transactionExecuting') }}</span>
        <span class="transaction-prompt__value">{{ elapsedSeconds }}{{ $t('transactionSecondsUnit') }}</span>
      </div>
    </template>

    <!-- 成功买入/卖出 + 耗时 + 区块链链接 -->
    <template v-else-if="type === 'success'">
      <div class="transaction-prompt__row transaction-prompt__success-title">
        <span :class="isBuy ? 'color-[--up-color]' : 'color-[--down-color]'">
          {{ isBuy ? $t('successBuy') : $t('successSell') }}
        </span>
      </div>
      <div class="transaction-prompt__row">
        <span class="transaction-prompt__label">{{ $t('transactionTookSeconds', [elapsedSec]) }}</span>
      </div>
      <div v-if="explorerUrl" class="transaction-prompt__row transaction-prompt__link-wrap">
        <a
          :href="explorerUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="transaction-prompt__link"
        >
          {{ $t('viewTransition') }}
        </a>
      </div>
    </template>

    <!-- 订单摘要 -->
    <template v-else-if="type === 'order'">
      <div class="transaction-prompt__row transaction-prompt__order-title">
        <span>{{ $t('orderFromTo') }}</span>
      </div>
      <div class="transaction-prompt__row transaction-prompt__order-detail">
        <span>{{ formatAmount(fromAmount) }} {{ fromSymbol }}</span>
        <span class="transaction-prompt__arrow">→</span>
        <span>{{ formatAmount(toAmount) }} {{ toSymbol }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'

defineProps<{
  type: 'executing' | 'success' | 'order'
  /** executing: 已执行秒数 */
  elapsedSeconds?: number
  /** success: 总耗时（秒） */
  elapsedSec?: number
  /** success: 是否买入 */
  isBuy?: boolean
  /** success: 区块链浏览器链接 */
  explorerUrl?: string
  /** order: 订单摘要 */
  fromSymbol?: string
  fromAmount?: string | number
  toSymbol?: string
  toAmount?: string | number
}>()

function formatAmount(val: string | number | undefined): string {
  if (val === undefined || val === null) return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return String(val)
  return formatNumber(n, 4)
}
</script>

<style scoped lang="scss">
.transaction-prompt {
  min-width: 200px;
  font-size: 12px;
  line-height: 1.5;

  &__row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__label {
    color: var(--secondary-text, #80838b);
  }

  &__value {
    color: var(--primary-text, #fff);
  }

  &__success-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__link-wrap {
    margin-top: 6px;
  }

  &__link {
    color: var(--primary-color, #286dff);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  &__order-title {
    margin-bottom: 4px;
    color: var(--secondary-text, #80838b);
  }

  &__order-detail {
    gap: 8px;
    flex-wrap: wrap;
  }

  &__arrow {
    color: var(--secondary-text, #80838b);
  }
}
</style>
