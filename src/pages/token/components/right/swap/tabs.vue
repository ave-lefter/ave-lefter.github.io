<template>
  <div class="tabs">
    <button v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: item.value === activeTab, [`tab-${item.value}`]: true }" type="button" :disabled="getChainInfo(walletStore?.chain || '')?.vm_type !== 'evm' && !SupportChains.includes(walletStore?.chain || '')" @click="switchTab(item.value as TabItem)">
      <span>{{ item.name }}</span>
    </button>
  </div>
</template>

<script setup lang='ts'>
const walletStore = useWalletStore()
const { t } = useI18n()
type TabItem = 0 | 1 | 'liquidity'
defineProps({
  activeTab: {
    type:  Number as PropType<TabItem>,
    default: 0
  }
})
const emit = defineEmits(['update:activeTab'])

const SupportChains = ['sui', 'solana', 'tron']

const tabs = computed(() => {
  return [
    {
      name: t('buy'),
      value: 0
    },
    {
      name: t('sell'),
      value: 1
    },
    // {
    //   name: t('addLiquidity'),
    //   value: 'liquidity'
    // }
  ]
})

function switchTab(val: TabItem) {
  emit('update:activeTab', val)
}
</script>

<style scoped lang="scss">
  .tabs {
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px;
    .tab-item {
      border: 1px solid var(--d-333-l-F5F5F5);
      display: flex;
      padding: 7px 0;
      justify-content: center;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      background: transparent;
      // border: none;
      cursor: pointer;
      color: var(--d-999-l-666);
      & + .tab-item {
        margin-left: 10px;
      }
      &.active {
        border-color: transparent;
        &.tab-0 {
          background: rgba($color: #12B886, $alpha: 0.1);
          color: #12B886;
        }
        &.tab-1 {
          background: rgba($color: #F6465D, $alpha: 0.1);
          color: #F6465D;
        }
        &.tab-liquidity {
          background: rgba($color: #3F80F7, $alpha: 0.1);
          color: var(--primary-color);
        }
      }
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .iconfont {
        margin-right: 3px;
      }
    }
  }
</style>
