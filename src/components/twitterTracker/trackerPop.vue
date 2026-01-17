<template>
  <div
    class="w-full h-full bg-[--secondary-bg] p-12px"
    :class="{ 'pr-16px': trackerStore.isLeftFixed, 'pl-16px': trackerStore.isRightFixed }"
  >
    <Icon
      name="custom:drag2"
      class="absolute top-4px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle"
    />
    <div class="flex items-center pb-14px border-b-1px border-b-solid border-b-[--border] mb-12px">
      <div class="flex justify-between items-center">{{ t('twitterTracker') }}</div>
      <div class="flex-1 drag-handle h-20px" />
      <div class="flex items-center gap-12px">
        <Icon
          v-if="botStore.evmAddress"
          name="custom:pump-setting"
          class="color-[--secondary-text] hover:color-[--main-text] cursor-pointer text-14px"
          @click="emits('setDrawerVisible', true)"
        />
        <Icon
          name="custom:close"
          class="text-14px shrink-0 cursor-pointer color-[--main-text]"
          @click="trackerStore.visible = false"
        />
      </div>
    </div>
    <div class="flex justify-between mb-12px items-center">
      <div class="flex gap-16px">
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
      <el-checkbox
        v-if="botStore.accessToken"
        v-model="follow_only"
        size="small"
        class="[--el-checkbox-height:16px] text-12px"
        @change="getList"
      >
        {{ t('onlyFollowing') }}
      </el-checkbox>
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
              v-model="query.types"
              class="flex flex-col [--el-checkbox-height:16px] gap-12px"
            >
              <!--mb-16px border-b-solid border-b-1px border-b-[--dialog-divider] -->
              <el-checkbox
                v-for="option in checkboxOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
            <!-- <el-checkbox-group
              v-model="query.types"
              class="flex flex-col [--el-checkbox-height:16px] gap-12px"
            >
              <el-checkbox
                v-for="option in fixedCheckboxOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group> -->
            <div class="pt-16px flex items-center">
              <el-button class="min-w-0" @click="filterVisible = false">
                {{ t('cancel') }}
              </el-button>
              <el-button class="min-w-0" type="primary" @click="confirmQuery">
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
        v-model="query.token_keyword"
        class="w-160px"
        size="small"
        :placeholder="t('searchCA')"
        @input="debouncedConfirmInput"
      >
        <template #prefix>
          <Icon name="custom:search" />
        </template>
      </el-input>
    </div>
    <TwitterTrackerList :activeTab="activeTab" @startAttention="emits('setDrawerVisible', true)" />
  </div>
</template>

<script setup name="trackerPop">
import { useDebounceFn } from '@vueuse/core'
import TwitterTrackerList from './list.vue'
import { getTwitterList } from '~/api/twitter'
const emits = defineEmits(['setDrawerVisible'])
const { t } = useI18n()
const trackerStore = useTwitterTrackerStore()
const wsStore = useWSStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const activeTab = ref(1)
const filterVisible = ref(false)

const query = ref({ ...trackerStore.query })
const follow_only = ref(false)

const tabs = computed(() => [
  { label: t('hot2'), value: 1 },
  { label: t('mine'), value: 2 },
])
const checkboxOptions = computed(() => [
  { label: '全部', value: 1 },
  { label: '推文', value: 1 },
  { label: '转发', value: 2 },
  // { label: '更头像', value: 4 },
  { label: '引用', value: 3 },
  { label: '回复', value: 4 },
])
// const fixedCheckboxOptions = computed(() => [
//   { label: t('onlyCA'), value: 1 },
//   { label: t('onlyAddress'), value: 2 },
// ])
const setActiveTab = (value) => {
  activeTab.value = value
}
const confirmQuery = () => {
  trackerStore.query = {
    ...trackerStore.query,
    ...query.value,
  }
  getList()
}
const debouncedConfirmInput = useDebounceFn(confirmQuery, 300)

const getList = async () => {
  trackerStore.loading = true
  try {
    const res = await getTwitterList({
      ...query.value,
      follow_only: activeTab.value === 2 || follow_only.value,
    })
    if (res) {
      query.value.page_token = res.page_token || ''
      const newList = res.list || []
      trackerStore.finished = res.page_token ? false : true
      if (query.value.page_token || finished.value) {
        trackerStore.list = [...trackerStore.list, ...newList]
      } else {
        trackerStore.list = newList
      }
    }
  } catch (error) {
    console.error('Error fetching Twitter tracker list:', error)
  } finally {
    trackerStore.loading = false
  }
}

getList()

const tgUid = computed(() => botStore.userInfo?.tgUid)
function subscribeTwitter() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['twitter_monitor', tgUid.value],
    id: 1,
  })
}

subscribeTwitter()
watch(
  () => tgUid.value,
  () => {
    wsStore.send({
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: ['twitter_monitor'],
      id: 1,
    })
    subscribeTwitter()
  }
)
watch(
  () => wsStore.wsResult[WSEventType.TWITTER_MONITOR],
  () => {
    console.log(
      'wsStore.wsResult[WSEventType.TWITTER_MONITOR]',
      wsStore.wsResult[WSEventType.TWITTER_MONITOR]
    )
  }
)
</script>

<style scoped lang="scss"></style>
