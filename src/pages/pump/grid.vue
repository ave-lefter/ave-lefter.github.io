<template>
  <div @click.stop.prevent :key="key">
    <span class="text-12px color-[--main-text]">{{ $t('threeLayout') }}</span>
    <Draggable
      v-model="list"
      group="list"
      class="flex gap-12px items-center justify-center mt-8px"
      item-key="id"
    >
      <template #item="{ element }">
        <div
          class="border-1px border-solid border-[--border]  py-13px relative flex-1 text-center"
          :style="{
            'border-color': pumpSetting.grid[element.id].show ? '#3F80F7' : 'var(--border)',
          }"
        >
          <Icon
            name="custom:move"
            class="color-[--icon-color] text-7px cursor-pointer font-bold absolute left-[4px] top-[4px]"
          />
          <Icon
            name="custom:key-visible"
            class="color-[--icon-color] text-8px cursor-pointer font-bold absolute right-[4px] top-[4px]"
            v-if="pumpSetting.grid[element.id].show"
            @click.stop.prevent="pumpSetting.grid[element.id].show = false"
          />
          <Icon
            name="custom:key-invisible"
            class="color-[--icon-color] text-8px cursor-pointer font-bold absolute right-[4px] top-[4px]"
            v-else
            @click.stop.prevent="pumpSetting.grid[element.id].show = true"
          />
          <span
            :style="{ color: pumpSetting.grid[element.id].show ? '#3F80F7' : 'var(--third-text)' }"
            >{{ $t(element.name) }}</span>
        </div>
      </template>
    </Draggable>
    <span class="text-12px color-[--main-text mt-30px block">{{ $t('detailsAfterPurchase') }}</span>
    <div class="tabs pb-10px mt-8px">
      <button
        v-for="item in list_tabs"
        :key="item.id"
        class="flex-1 switchTab"
        :class="{ active: item.id === pumpSetting.jump  }"
        type="button"
        @click.stop="pumpSetting.jump = item.id"
      >
        <span class="text-14px">{{ item.name || '' }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'
const globalStore = useGlobalStore()
const { pumpSetting, lang } = storeToRefs(globalStore)
const { t } = useI18n()
const key = shallowRef(0)
// 可写的 computed
const list = computed({
  get: () => Object.values(pumpSetting.value?.grid || {}).sort((a, b) => a.order - b.order),
  set: (newList) => {
    newList.forEach((item, index) => {
      pumpSetting.value.grid[item.id].order = index + 1
    })
  },
})
interface TabItem {
  id: 'close' | 'open' | 'open_jump' // 限定三种枚举值
  name: string
}

const list_tabs = computed<TabItem[]>(() => {
  return [
    {
      id: 'close',
      name: t('undo'),
    },
    {
      id: 'open',
      name: t('open'),
    },
    {
      id: 'open_jump',
      name: t('jump'),
    }
  ]
})
watch(() => lang.value, (val) => {
  key.value++

})
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  button {
    border: 1px solid var(--border);
    // font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    background: transparent;
    padding: 14px;
    text-align: center;
    &.active {
      color: #3F80F7;
      border-color: #3F80F7;
    }
  }
}
</style>
