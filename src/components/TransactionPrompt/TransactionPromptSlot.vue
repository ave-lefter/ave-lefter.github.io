<template>
  <Teleport to="body">
    <Transition name="transaction-prompt-fade">
      <div
        v-if="state.type"
        :class="[
          'transaction-prompt-slot',
        ]"
      >
        <!-- 左侧头像 -->
        <div class="transaction-prompt-slot__avatar">
          <UserAvatar :address="walletStore.address" :chain="walletStore.chain" iconSize="22px" />
        </div>
        <!-- 中间主文案 -->
        <div class="transaction-prompt-slot__body">
          <div v-if="state.type === 'executing'" class="transaction-prompt-slot__line">
            <el-icon :size="12" class="transaction-prompt-slot__icon-spin">
              <Refresh />
            </el-icon>
            <span class="transaction-prompt-slot__status-text">{{ $t('transactionExecuting') }}</span>
            <span class="transaction-prompt-slot__status-value">{{ state.executingSeconds }}{{ $t('transactionSecondsUnit') }}</span>
          </div>
          <div v-else-if="state.type === 'success' && state.successPayload" class="transaction-prompt-slot__line">
            <span
              class="transaction-prompt-slot__order"
              :class="state.successPayload.isBuy ? 'transaction-prompt-slot__order--buy' : 'transaction-prompt-slot__order--sell'"
            >
              {{ formatAmount(state.successPayload.fromAmount) }}
              {{ state.successPayload.fromSymbol }}
              {{ state.successPayload.isBuy ? $t('buy') : $t('sell') }}
              <span v-if="state.successPayload.isBuy && state.successPayload.toSymbol">
                {{ state.successPayload.toSymbol }}
              </span>
              <span class="transaction-prompt-slot__from-order">- {{ $t('orderFromTo') }}</span>
            </span>
            <span class="transaction-prompt-slot__separator">·</span>
            <el-icon
              :size="12"
              :class="state.successPayload.isBuy ? 'transaction-prompt-slot__icon--up' : 'transaction-prompt-slot__icon--down'"
            >
              <CircleCheck />
            </el-icon>
            <span
              class="transaction-prompt-slot__status-text"
              :class="state.successPayload.isBuy ? 'transaction-prompt-slot__text--up' : 'transaction-prompt-slot__text--down'"
            >
              {{ state.successPayload.isBuy ? $t('successBuy') : $t('successSell') }}
            </span>
            <span class="transaction-prompt-slot__status-time">{{ $t('transactionTookSeconds', [String(state.successPayload.elapsedSec)]) }}</span>
          </div>
        </div>
        <!-- 右侧：链接 + 关闭 -->
        <div class="transaction-prompt-slot__right">
          <a
            v-if="state.type === 'success' && state.successPayload?.explorerUrl"
            :href="state.successPayload.explorerUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="transaction-prompt-slot__icon-btn"
            :title="$t('viewTransition')"
            aria-label="view-transaction"
          >
            <Icon name="custom:chart" class="transaction-prompt-slot__icon" />
          </a>
          <button type="button" class="transaction-prompt-slot__close" aria-label="close" @click="close">
            <el-icon :size="14"><Close /></el-icon>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Refresh, CircleCheck, Close } from '@element-plus/icons-vue'
import { transactionPromptState } from '@/composables/useTransactionPrompt'
import { useTransactionPrompt } from '@/composables/useTransactionPrompt'
import { formatNumber } from '@/utils/formatNumber'
import UserAvatar from '@/components/userAvatar.vue'

const state = transactionPromptState
const { close } = useTransactionPrompt()
const walletStore = useWalletStore()

function formatAmount(val: string | number | undefined): string {
  if (val === undefined || val === null) return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return String(val)
  return formatNumber(n, 4)
}
</script>

<style scoped lang="scss">
.transaction-prompt-slot {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  min-width: 360px;
  max-width: calc(100vw - 24px);
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(32, 36, 43, 0.98) 0%, rgba(27, 31, 38, 0.98) 100%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  color: var(--primary-text, #fff);

  &__avatar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  &__line {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
  }

  &__order {
    font-size: 13px;
    font-weight: 600;
  }

  &__order--buy {
    color: var(--up-color, #12b886);
  }

  &__order--sell {
    color: var(--down-color, #f6465d);
  }

  &__status-text {
    font-weight: 600;
  }

  &__status-value {
    color: var(--primary-text, #fff);
  }

  &__status-time {
    color: var(--secondary-text, #80838b);
  }

  &__from-order {
    color: var(--secondary-text, #80838b);
    font-weight: 400;
  }

  &__separator {
    color: var(--secondary-text, #80838b);
  }

  &__icon-spin {
    animation: transaction-prompt-spin 1s linear infinite;
  }

  &__icon--up {
    color: var(--up-color, #12b886);
  }

  &__icon--down {
    color: var(--down-color, #f6465d);
  }

  &__text--up {
    color: var(--up-color, #12b886);
  }

  &__text--down {
    color: var(--down-color, #f6465d);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  &__icon-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: var(--primary-color, #286dff);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    &:hover {
      color: var(--primary-text, #fff);
      background: rgba(255, 255, 255, 0.14);
    }
  }

  &__icon {
    font-size: 12px;
  }

  &__close {
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--secondary-text, #80838b);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    &:hover {
      color: var(--primary-text, #fff);
    }
  }
}

@keyframes transaction-prompt-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.transaction-prompt-fade-enter-active,
.transaction-prompt-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.transaction-prompt-fade-enter-from,
.transaction-prompt-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
.transaction-prompt-fade-enter-to,
.transaction-prompt-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
