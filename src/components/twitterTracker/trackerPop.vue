<template>
  <div
    class="w-full h-full bg-[--secondary-bg] p-12px"
    :class="{ 'pr-16px': trackerStore.isLeftFixed, 'pl-16px': trackerStore.isRightFixed }"
  >
    <Icon
      name="custom:drag2"
      class="absolute top-4px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle"
    />
    <div
      class="flex justify-between items-center pb-14px border-b-1px border-b-solid border-b-[--border] mb-12px"
    >
      <div class="flex justify-between items-center">{{ t('twitterTracker') }}</div>
      <div class="flex items-center gap-12px">
        <Icon
          name="custom:pump-setting"
          class="color-[--secondary-text] hover:color-[--main-text] cursor-pointer text-14px"
        />
        <Icon
          name="custom:close"
          class="text-14px shrink-0 cursor-pointer color-[--main-text]"
          @click.self="trackerStore.visible = false"
        />
      </div>
    </div>
    <div class="flex gap-16px mb-12px">
      <span
        v-for="el in tabs"
        :key="el.value"
        :class="[
          'text-14px cursor-pointer',
          activeTab === el.value ? 'color-[--main-text]' : 'color-[--secondary-text]',
        ]"
        @click="setActiveTab(el.value)"
      >
        {{ el.label }}
      </span>
    </div>
    <div class="flex justify-between items-center mb-14px">
      <div class="flex items-center gap-8px color-[--secondary-text]">
        <el-popover
          v-model:visible="filterVisible"
          placement="bottom-end"
          trigger="click"
          :width="164"
        >
          <template #reference>
            <Icon name="custom:filter" class="text-12px cursor-pointer" />
          </template>
          <template #default>
            <el-checkbox-group
              v-model="trackerStore.query.aaaaaa"
              class="flex flex-col [--el-checkbox-height:16px] gap-12px pb-16px mb-16px border-b-solid border-b-1px border-b-[--dialog-divider]"
            >
              <el-checkbox
                v-for="option in checkboxOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group
              v-model="trackerStore.query.bbbbb"
              class="flex flex-col [--el-checkbox-height:16px] gap-12px"
            >
              <el-checkbox
                v-for="option in fixedCheckboxOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
            <div class="pt-16px flex items-center">
              <el-button>
                {{ t('cancel') }}
              </el-button>
              <el-button type="primary">
                {{ t('confirm') }}
              </el-button>
            </div>
          </template>
        </el-popover>
        <Icon
          :name="globalStore.audioSettings.audio.twitter ? 'custom:ad' : 'custom:admute'"
          class="mr-4px cursor-pointer"
          @click="globalStore.audioSettings.active = 'audio'"
        />
      </div>
      <el-input
        v-model="trackerStore.query.keyword"
        class="w-160px"
        size="small"
        :placeholder="t('searchCA')"
      >
        <template #prefix>
          <Icon name="custom:search" />
        </template>
      </el-input>
    </div>
    <TwitterTrackerList />
  </div>
</template>

<script setup name="trackerPop">
import TwitterTrackerList from './list.vue'
const { t } = useI18n()
const trackerStore = useTwitterTrackerStore()
const globalStore = useGlobalStore()

const activeTab = ref(1)
const filterVisible = ref(false)
const tabs = computed(() => [
  { label: t('hot2'), value: 1 },
  { label: t('mine'), value: 2 },
])
const checkboxOptions = computed(() => [
  { label: '全部', value: 1 },
  { label: '推文', value: 2 },
  { label: '转发', value: 3 },
  { label: '更头像', value: 4 },
  { label: '引用', value: 5 },
  { label: '回复', value: 6 },
])
const fixedCheckboxOptions = computed(() => [
  { label: t('onlyCA'), value: 1 },
  { label: t('onlyAddress'), value: 2 },
])
const setActiveTab = (value) => {
  activeTab.value = value
}
</script>

<style scoped lang="scss"></style>
