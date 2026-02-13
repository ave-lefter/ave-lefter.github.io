<script setup lang="ts">
import type { ChainKey } from '@/api/types/pump'
defineProps<{
  activeTab: 'new' | 'soon' | 'graduated',
  chain: ChainKey
}>()
const audioVisible = ref(false)
const pumpStore = usePumpStore()
</script>
<template>
  <el-popover v-model:visible="audioVisible" trigger="click" popper-class="el-select__popper" :persistent="false">
    <template #reference>
      <div
        class="bg-[--main-input-button-bg] py-5px px-8px rounded-4px mr-8px color-[--third-text] cursor-pointer  hover:color-[--d-F5F5F5-l-333] flex items-center justify-center min-h-28px"
        :class="{
          'color-[--main-text]': pumpStore.pump_notice?.[chain]?.[activeTab],
        }">
        <Icon :name="pumpStore.pump_notice?.[chain]?.[activeTab] ? 'custom:ad' : 'custom:admute'" class="text-14px" />
      </div>
    </template>
    <template #default>
      <ul class="el-scrollbar__view el-select-dropdown__list [&&]:m--12px">
        <li v-for="item in audioList" :key="item" class="el-select-dropdown__item hover:bg-[--border]"
          :class="{ 'bg-[--border]': pumpStore.pump_notice?.[chain]?.[activeTab] === item }"
          @click="pumpStore.pump_notice[chain][activeTab] = item; audioVisible = false;">
          <span class="text-12px">{{ item || $t('close') }}</span>
        </li>
      </ul>
    </template>
  </el-popover>
</template>