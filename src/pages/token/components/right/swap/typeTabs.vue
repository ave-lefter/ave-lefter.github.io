<template>
  <el-tabs :model-value="tab" class="select-tabs" @update:model-value="emit('update:tab', $event)">
    <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value" />
  </el-tabs>
</template>

<script setup lang='ts'>
const props = defineProps({
  isOnlyMarket: {
    type: Boolean,
    default: false
  },
  tab: {
    type: Number as PropType<0 | 1 | 2>,
    default: 0
  }
})
const emit = defineEmits(['update:tab'])
const walletStore = useWalletStore()
const { t } = useI18n()
const types = computed(() => {
  if (props.isOnlyMarket) {
    return [
      {
        name: t('swapT'),
        value: 2
      }
    ]
  }
  const chain = walletStore.chain || ''
  if (chain === 'solana') {
    return [
      {
        name: t('swapT'),
        value: 2
      },
      {
        name: t('limitT'),
        value: 0
      },
    ]
  }
  return [
    {
      name: t('swapT'),
      value: 2
    },
    {
      name: t('limitT'),
      value: 0
    },
    {
      name: t('stopLimit'),
      value: 1
    }
  ]
})
</script>

<style lang="scss" scoped>
.select-tabs {
  :deep() {
    --el-border-color-light: var(--d-333-l-F5F5F5);
    .el-tabs__item {
      font-size: 12px;
      padding: 0 10px;
      font-weight: 400;
      --el-text-color-primary: var(--d-999-l-666);
      &.is-active {
        color: var(--d-F5F5F5-l-333);
      }
      &:hover {
        color: var(--d-F5F5F5-l-333);
        cursor: pointer;
      }
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__active-bar {
      height: 2px;
      background-color: var(--d-F5F5F5-l-333);
    }
    .el-tabs__nav-wrap::after {
      height: 0.5px;
    }
  }
}
</style>
