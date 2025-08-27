<template>
  <div class="flex items-center px-20px">
    <el-scrollbar ref="scrollbar" class="scrollbar-container">
      <div class="flex items-center gap-8px text-12px mt-15px mb-8px">
        <button class="h-24px flex items-center item-chain-btn clickable" :class="{ 'active': !chain }" @click.stop="setChain('', 0)">
          <Icon name="custom:chain" class="text-12px mr-4px" />
          <span class="break-keep whitespace-nowrap">{{ t('allChain') }}</span>
        </button>
        <button v-for="(item, index) in chains" :key="item" class="h-24px flex items-center item-chain-btn clickable"  :class="{ 'active': chain === item }" @click.stop="setChain(item, index + 1)">
          <img :src="`${configStore.token_logo_url}chain/${item}.png`" class="rd-50% w-12px mr-4px" width="12" lazy alt="">
          <span class="break-keep whitespace-nowrap">{{ getChainInfo(item)?.name }}</span>
        </button>
      </div>
    </el-scrollbar>
    <button class="h-24px flex items-center item-chain-btn clickable color-[--d-CCC-l-333]! op-100! text-12px ml-8px mt-15px mb-8px" @click.stop="visible = true">
      <Icon name="custom:add-icon" class="text-12px mr-4px" />
      <span class="break-keep whitespace-nowrap">{{ t('addChain') }}</span>
    </button>
  </div>
  <DialogFilterChain v-model="visible" v-model:favChains="chains" @selectChain="_chain => setChain(_chain)" />

</template>

<script setup lang='ts'>
import { useLocalStorage } from '@vueuse/core'
import DialogFilterChain from './dialogFilterChain.vue'
defineProps({
  chain: { type: String, default: '' },
})

const emit = defineEmits(['update:chain'])


const { t } = useI18n()
const configStore = useConfigStore()
const chains = useLocalStorage<string[]>('search_chains', ['solana', 'bsc', 'eth', 'base'])
const visible = ref(false)

const scrollbar = useTemplateRef('scrollbar')

function setChain(chain: string, _index?: number) {
  let index = _index || 0
  if (!_index) {
    index = chains.value.indexOf(chain)
    if (index === -1) {
      index = 0
    }
  }
  emit('update:chain', chain)
  scrollbar.value?.setScrollLeft(index * 88 - 360)
}


</script>

<style scoped lang="scss">
  .item-chain-btn {
    color: var(--d-F5F5F5-l-333);
    background: var(--d-333-l-F2F2F2);
    border: none;
    padding: 5px 8px;
    border-radius: 4px;
    opacity: 0.5;
    line-height: 1;
    &.active {
      opacity: 1;
    }
  }
  .scrollbar-container :deep(.el-scrollbar__wrap) {
    scroll-behavior: smooth;
  }

</style>
