<script setup lang="ts">
import BlackList from '~/pages/pump/blackList.vue'
import PlatformSelect from './platformSelect.vue'
import Setting from '~/pages/pump/setting.vue'

defineProps({
  scrollHeight: {
    type: Number,
    default: 0,
  },
  isLarge: {
    type: Boolean,
    default: false,
  },
})
const pumpStore = usePumpStore()
const {t} = useI18n()
const tabList = computed(() => {
  return [
    {
      label: t('new1'),
      value: 'pump_in_new',
    },
    {
      label: t('soon'),
      value: 'pump_in_almost',
    },
    {
      label: t('graduated'),
      value: 'pump_out_new',
    },
  ]
})
const activeTab = ref('pump_in_new')
const setActiveTab = (value: string) => {
  activeTab.value = value
}
</script>

<template>
  <div class="w-full h-full bg-[--d-111-l-FFF] p-12px">
    <div class="flex justify-between mb-16px">
      <PlatformSelect />
      <div class="flex items-center">
        <Setting :chain="pumpStore.activeChain">
          <template #default="{ visible }">
            <div
              v-tooltip="$t('customize')"
              class="flex items-center gap-4px mr-8px text-12px bg-[--d-222-l-F2F2F2] color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] px-4px py-2px rounded-4px cursor-pointer"
            >
              <Icon name="custom:customized" class="text-13px" />
              <Icon
                :name="visible ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
                class="text-16px"
              />
            </div>
          </template>
        </Setting>
        <BlackList reference-class="text-12px" buttonClass="w-20px h-20px! p-0! justify-center!" />
        <Icon
          name="custom:close"
          class="text-14px shrink-0 cursor-pointer color-[--d-FFF-l-333]"
          @click.self="pumpStore.visible = false"
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-8px">
        <span
          v-for="(item, index) in tabList"
          :key="index"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-4px py-2px rounded-4px cursor-pointer ${
            activeTab === item.value ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]' : ''
          }`"
          @click="setActiveTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <div class="flex items-center gap-8px">
        123
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
