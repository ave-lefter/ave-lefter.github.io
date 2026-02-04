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
      <!-- <el-checkbox
        v-if="botStore.accessToken && !isMine"
        v-model="follow_only"
        size="small"
        class="[&.el-checkbox.el-checkbox--small]:h-16px text-12px"
        @change="confirmQuery"
      >
        {{ t('onlyFollowing') }}
      </el-checkbox> -->
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
            <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                class="[--el-checkbox-height:16px] mb-12px"
                @change="handleCheckAllChange"
            >
                {{t('all')}}
            </el-checkbox>
            <el-checkbox-group
              v-model="query.types"
              class="flex flex-col [--el-checkbox-height:16px] gap-12px"
              @change="handleCheckedChange"
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
      <!-- <el-input
      v-model="query.token_keyword"
        style="--el-input-bg-color:var(--main-list-hover);--el-input-height:26px;"
        class="w-160px"
        size="small"
        clearable
        :placeholder="t('searchCA')"
        @input="debouncedConfirmInput"
      >
        <template #prefix>
          <Icon name="custom:search" />
        </template>
      </el-input> -->
    </div>
    <TwitterTrackerList :isMine="isMine" @endReached="getList" @startAttention="emits('setDrawerVisible', true)" />
    <audio
      ref="twitterAudio" controls style="display: none"
      :src="getAudioUrl(globalStore.audioSettings.audio.twitter)"
      :volume="+globalStore.audioSettings.audio.volume/100 || 0.5"
    />
  </div>
</template>

<script setup name="trackerPop">
import { useStorage } from '@vueuse/core'
import TwitterTrackerList from './list.vue'
import { getAllFollowIds, getTwitterList } from '~/api/twitter'
import { useV2WSStore } from '~/stores/v2ws'
const emits = defineEmits(['setDrawerVisible'])
const { t } = useI18n()
const trackerStore = useTwitterTrackerStore()
const v2WsStore = useV2WSStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const activeTab = ref(1)
const filterVisible = ref(false)

const twitterAudio = useTemplateRef('twitterAudio')
const followIds = useStorage('twFollowIds', [])
const query = ref({ ...trackerStore.query })
defineProps({
  scrollHeight: {
    type: Number,
    default: 0,
  },
})
// const follow_only = ref(false)
const TAB_TYPE = {
  HOT: 1,
  MINE: 2,
}
const followAuthorIds = computed(() => {
  return followIds.value.map(el => el.author_id)
})
const tabs = computed(() => [
  { label: t('hot2'), value: TAB_TYPE.HOT },
  { label: t('mine'), value: TAB_TYPE.MINE },
])
const checkboxOptions = computed(() => [
  { label: t('tweet'), value: 1 },
  { label: t('retweet'), value: 3 },
  { label: t('quote'), value: 2 },
  { label: t('reply'), value: 4 },
])
const isMine = computed(() => {
  return activeTab.value === TAB_TYPE.MINE
})
// const fixedCheckboxOptions = computed(() => [
//   { label: t('onlyCA'), value: 1 },
//   { label: t('onlyAddress'), value: 2 },
// ])
const checkAll = ref(query.value.types.length === checkboxOptions.value.length)
const isIndeterminate = ref(false)
const handleCheckAllChange = () => {
  query.value.types = checkAll.value ? checkboxOptions.value.map(i => i.value) : []
  isIndeterminate.value = query.value.types.length > 0 && query.value.types.length < checkboxOptions.value.length
}
const handleCheckedChange = (val) => {
  const checkedCount = val.length
  checkAll.value = checkedCount === checkboxOptions.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkboxOptions.value.length
}
const reset = () => {
  query.value.page_token = ''
  trackerStore.finished = false
  trackerStore.list = []
}
const setActiveTab = (value) => {
  activeTab.value = value
  reset()
  getList()
}

const _getAllFollowIds = async () => {
  const res = await getAllFollowIds()
  followIds.value = res.authors || []
}
watch(()=>botStore.accessToken,val=>{
  if(val && isMine.value){
    reset()
    getList()
  }
  if (val) {
    _getAllFollowIds()
  }
})
if (botStore.accessToken) {
  _getAllFollowIds()
}

const confirmQuery = () => {
  filterVisible.value = false
  reset()
  trackerStore.query = {
    ...trackerStore.query,
    ...query.value,
  }
  getList()
}
// const debouncedConfirmInput = useDebounceFn(confirmQuery, 300)

const getList = async () => {
  // const _follow_only = isMine.value || follow_only.value
  const _activeTab = activeTab.value
  if(isMine.value && !botStore.accessToken){
   return
  }
  trackerStore.loading = true
  try {
    const res = await getTwitterList({
      ...query.value,
      follow_only:isMine.value,
      types: query.value.types.join(','),
    })
    if (res && activeTab.value === _activeTab) {
      query.value.page_token = res.page_token || ''
      const newList = res.list || []
      trackerStore.finished = res.page_token ? false : true
      if (query.value.page_token || trackerStore.finished) {
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

function subscribePublicTwitter(method) {
  v2WsStore.send({
    jsonrpc: '2.0',
    method,
    params: ['public_twitter', 'hot'],
    id: 1,
  })
}

subscribePublicTwitter('subscribe')

const twitterHandler = async(val) => {
  if (query.value.types.includes(+val.type)) {
    if (isMine.value && !followAuthorIds.value.includes(val.author_id)) {
      return
    }
    val.follow_status = followAuthorIds.value.includes(val.author_id) ? 1 : 0
    trackerStore.list.unshift(val)
    if (trackerStore.list.length > 100) {
      trackerStore.list.pop()
    }
    if (twitterAudio.value && globalStore.audioSettings.audio.twitter) {
      twitterAudio.value.play()
    }
  }
}
watch(
  () => v2WsStore.wsResult[WSEventV2Type.PUBLIC_TWITTER],
  twitterHandler
)

watch(()=>followAuthorIds.value,()=>{
  if(isMine.value){
    trackerStore.list = trackerStore.list.filter(el=>{
      return followAuthorIds.value.includes(el.author.author_id)
    })
  }
})

useVisibilityChange(()=>{
  trackerStore.list = []
  query.value.page_token = ''
  getList()
})
</script>

<style scoped lang="scss"></style>
