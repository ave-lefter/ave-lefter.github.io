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
          <div class="flex gap-8px">
            <span
              v-for="(item, $index) in tabs"
              :key="$index"
              class="py-4px text-12px px-8px rounded-4px bg-[--main-input-button-bg] color-[--secondary-text] flex items-center justify-center cursor-pointer"
              :class="{ active: activeTab == item.id }"
              @click.stop.prevent="handleTabChange(item.id)"
            >
              {{ item.name }}
            </span>
          </div>
          <span>{{ $t('time') }}</span>
        </div>
        <div class="flex-between py-8px" v-for="(item, $index) in filterData">
          <div class="flex-start">
            <Icon v-if="item.status == 'create'" name="majesticons:plus-circle"  class="text-12px color-[--signal-green]" />
            <Icon v-else-if="item.status == 'delete'" name="majesticons:minus-circle"  class="text-12px color-[--signal-red]" />
            <Icon v-else-if="item.status == 'import'" name="mingcute:new-folder-fill"class="text-12px color-[--primary-color]" />
            <span class="ml-4px">{{ getType(item.status || '') }}</span>
            <span class="ml-9px">{{ item.name || 'Wallet '+ item.evmAddress?.slice(-4)}}</span>
            <Icon
              v-copy="item?.evmAddress"
              name="bxs:copy"
              class="ml-5px mb--1px clickable color-[--third-text]"
              @click.stop
            />
          </div>
          <span>{{ formatDate(item?.updateTime, 'YYYY/MM/DD HH:mm:ss') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Records } from '@/api/botManage'
const { showBotRecord } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const props = defineProps({
  tableData: {
    type: Array as PropType<Records[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
 const activeTab = ref('all')
const tabs = computed(() => ([
  { id: 'all', name: t('all') },
  { id: 'import', name: t('importWallet') },
  { id: 'create', name: t('create') },
  {id: 'delete', name: t('delete')}
]))
const filterData = computed(() => {
  const list = [...props.tableData]
  if (activeTab.value == 'all') {
    return list
  }
  return list?.filter(i=> i.status == activeTab.value)

})
function getType(type: 'import' | 'create' | 'delete') {
  const obj = {
    import: t('importWallet'),
    create: t('createWallet'),
    delete: t('walletRemove'),
  }
  return obj[type] || ''
}
function handleTabChange(id: string) {
  activeTab.value = id
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
.active {
  background: #3f80f7;
  color: #f5f5f5;
}
</style>
