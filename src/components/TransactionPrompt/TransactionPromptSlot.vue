<template>
  <Teleport to="body">
    <div class="transaction-prompt-wrapper">
      <TransitionGroup name="transaction-prompt-fade" tag="div" class="transaction-prompt-list">
        <div v-for="msg in transactionPromptList" :key="msg.id" :class="['transaction-prompt-slot']">
          <!-- 第一步：执行中 - 仅旋转 Icon + 文案 + 耗时(毫秒)，无头像、无图表 -->
          <template v-if="msg.type === 'executing'">
            <div class="transaction-prompt-slot__body">
              <div class="transaction-prompt-slot__line">
                <el-icon :size="16" class="transaction-prompt-slot__icon-spin">
                  <Loading />
                </el-icon>
                <span class="transaction-prompt-slot__status-text">{{ $t('transactionExecuting') }}</span>
                <span class="transaction-prompt-slot__status-value">{{ formatElapsedMs(msg.executingMs) }}{{
                  $t('transactionSecondsUnit') }}</span>
              </div>
            </div>
          </template>
          <!-- 第二步：成功 - 对勾 Icon + 头像 + 成功买入/卖出! 仅耗时X.XX秒 + 区块链浏览器 -->
          <template v-else-if="msg.type === 'success' && msg.successPayload">
            <el-icon :size="14"
              :class="['transaction-prompt-slot__icon-check', msg.successPayload.isBuy ? 'transaction-prompt-slot__icon--up' : 'transaction-prompt-slot__icon--down']">
              <CircleCheck />
            </el-icon>
            <div class="transaction-prompt-slot__avatar">
              <UserAvatar :address="msg.avatarAddress || walletStore.address"
                :chain="msg.avatarChain || walletStore.chain" iconSize="22px" />
            </div>
            <div class="transaction-prompt-slot__body">
              <div class="transaction-prompt-slot__line">
                <span class="transaction-prompt-slot__status-text">
                  {{ msg.successPayload.isBuy ? $t('successBuy') : $t('successSell') }}
                  <span
                    :class="msg.successPayload.isBuy ? 'transaction-prompt-slot__text--up' : 'transaction-prompt-slot__text--down'">
                    {{ $t('transactionTookSeconds', [formatElapsedMs(msg.successPayload.elapsedMs)]) }}
                  </span>
                </span>
              </div>
            </div>
          </template>
          <!-- 第三步：订单详情（仅买入）- 头像 + X BNB 买入 - 来自订单 + 区块链浏览器 -->
          <template v-else-if="msg.type === 'order' && msg.successPayload">
            <div class="transaction-prompt-slot__avatar">
              <UserAvatar :address="msg.avatarAddress || walletStore.address"
                :chain="msg.avatarChain || walletStore.chain" iconSize="22px" />
            </div>
            <div class="transaction-prompt-slot__body">
              <div class="transaction-prompt-slot__line">
                <span class="transaction-prompt-slot__order transaction-prompt-slot__order--buy">
                  {{ formatAmount(msg.successPayload.fromAmount) }}
                  {{ msg.successPayload.fromSymbol }}
                  {{ $t('buy') }}
                  <span
                    :class="msg.successPayload.isBuy ? 'transaction-prompt-slot__text--up' : 'transaction-prompt-slot__text--down'"
                    class="transaction-prompt-slot__from-order">- {{ $t('orderFromTo') }}</span>
                </span>
              </div>
            </div>
          </template>
          <!-- 右侧：区块链浏览器(成功/订单) + 关闭 -->
          <div class="transaction-prompt-slot__right">
            <a v-if="(msg.type === 'success' || msg.type === 'order') && msg.successPayload?.explorerUrl"
              :href="msg.successPayload.explorerUrl" target="_blank" rel="noopener noreferrer"
              class="transaction-prompt-slot__icon-btn" :title="$t('viewTransition')" aria-label="view-transaction">
              <Icon name="custom:mag-chart" class="transaction-prompt-slot__icon" />
            </a>
            <button type="button" class="transaction-prompt-slot__close" aria-label="close" @click="closeById(msg.id)">
              <el-icon :size="16" class="transaction-prompt-slot__icon-close">
                <Close />
              </el-icon>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Loading, CircleCheck, Close } from '@element-plus/icons-vue'
import { transactionPromptList } from '@/composables/useTransactionPrompt'
import { useTransactionPrompt } from '@/composables/useTransactionPrompt'
import { formatNumber } from '@/utils/formatNumber'
import UserAvatar from '@/components/userAvatar.vue'

const { close } = useTransactionPrompt()
const walletStore = useWalletStore()

function closeById(id: string) {
  close(id)
}

/** 毫秒转展示用字符串，如 420 → "0.42" */
function formatElapsedMs(ms: number): string {
  return (ms / 1000).toFixed(2)
}

function formatAmount(val: string | number | undefined): string {
  if (val === undefined || val === null) return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return String(val)
  return formatNumber(n, 4)
}
</script>

<style scoped lang="scss">
.transaction-prompt-wrapper {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  pointer-events: none;
}

.transaction-prompt-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.transaction-prompt-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  // min-width: 360px;
  max-width: calc(100vw - 24px);
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 12px;
  border: 1px solid var(--main-divider, #1F242C);
  background: var(--notification-bg, #222222);
  backdrop-filter: blur(6px);
  color: var(--main-text, #fff);

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
    // font-weight: 600;
  }

  &__order--buy {
    color: var(--up-color, #12b886);
  }

  &__order--sell {
    color: var(--down-color, #f6465d);
  }

  &__status-text {
    // font-weight: 600;
  }

  &__status-value {
    color: var(--main-text, #fff);
  }

  &__status-time {
    color: var(--secondary-text, #80838b);
  }

  &__from-order {
    // color: var(--secondary-text, #80838b);
    font-weight: 400;
  }

  &__separator {
    color: var(--secondary-text, #80838b);
  }

  &__icon-close {
    color: var(--third-text, #5A5E64) !important;
  }

  &__icon-spin {
    color: var(--third-text, #5A5E64) !important;
    animation: transaction-prompt-spin 1s linear infinite;
  }

  &__icon-check {
    flex-shrink: 0;
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
    // width: 24px;
    // height: 24px;
    border-radius: 50%;
    // background: rgba(255, 255, 255, 0.08);
    // color: var(--primary-color, #286dff);
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // text-decoration: none;

    &:hover {
      color: var(--primary-text, #fff);
      background: rgba(255, 255, 255, 0.14);
    }
  }

  &__icon {
    font-size: 16px;
  }

  &__close {
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--third-text, #80838b);
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
  transform: translateY(-10px);
}

.transaction-prompt-fade-enter-to,
.transaction-prompt-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.transaction-prompt-fade-move {
  transition: transform 0.2s ease;
}
</style>
