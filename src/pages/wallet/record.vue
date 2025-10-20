<template>
  <div v-if="showBotRecord" class="pop-right" @click="showBotRecord = false">
    <div
      v-show="showBotRecord"
      class="content"
      style="flex: 1; max-width: 450px; overflow-y: auto; overflow-x: hidden"
      @click.stop.prevent
    >
      <div class="tabs">
        <div>{{ $t('operateHistory') }}</div>
        <Icon
          name="line-md:close"
          class="text-20px color-[--main-text]"
          @click="showBotRecord = false"
        />
      </div>

      <div class="part mt-24px">
        <div class="flex-between mb-5px">
          <span>{{ $t('operation') }}</span>
          <span>{{ $t('time') }}</span>
        </div>
        <div class="flex-between py-8px" v-for="(item, $index) in tableData">
          <div>
            {{ getType(item.status || '') }}
            <span class="ml-9px">{{ item.name || 'Wallet '+ item.evmAddress?.slice(-4)}}</span>
            <Icon
              v-copy="item?.evmAddress"
              name="bxs:copy"
              class="ml-5px mb--1px clickable color-[--third-text]"
              @click.stop
            />
          </div>
          <span>{{ formatDate(item?.updateTime, 'MM/DD HH:mm:ss') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Records } from '@/api/botManage'
const { showBotRecord } = storeToRefs(useGlobalStore())
const { t } = useI18n()
defineProps({
  tableData: {
    type: Array as PropType<Records[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
function getType(type: 'import' | 'create' | 'delete') {
  const obj = {
    import: t('importWallet'),
    create: t('createWallet'),
    delete: t('walletRemove'),
  }
  return obj[type] || ''
}
</script>

<style lang="scss" scoped>
.pop-right {
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 3012;
  background: #00000099;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
  .right-container {
    background: var(--d-222-l-FFF);
    border-radius: 10px 0 0 10px;
    padding: 24px 20px;
    min-height: 100vh;
  }
}
.pop-right {
  position: fixed;
  .content {
    background-color: var(--dialog-bg);
    padding: 20px 20px;
    .tabs {
      position: relative;
      margin-bottom: 20px;
      display: flex;
      .tab {
        cursor: pointer;
        margin-right: 32px;
        color: var(--third-text);
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        &.active {
          color: var(--main-text);
        }
      }
      .iconify {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .part {
      font-size: 12px;
      color: var(--secondary-text);
    }
  }
}
</style>
