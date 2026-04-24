<template>
  <div class="w-full h-full bg-[--secondary-bg] p-12px"
    :class="{ 'pr-16px': trackerStore.isLeftFixed, 'pl-16px': trackerStore.isRightFixed }">
    <Icon name="custom:drag2" class="absolute top-4px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle" />
    <div class="flex items-center pb-14px border-b-1px border-b-solid border-b-[--border] mb-12px">
      <div :class="`flex justify-between items-center mr-16px clickable ${activeParentTab===1?'color-[--main-text]':'color-[--secondary-text]'}`" @click="activeParentTab=1">{{ t('twitterTracker') }}</div>
      <div :class="`flex justify-between items-center clickable ${activeParentTab===2?'color-[--main-text]':'color-[--secondary-text]'}`" @click="activeParentTab=2">{{ t('twitterTracker2') }}</div>
      <div class="flex-1 drag-handle h-20px" />
      <div class="flex items-center gap-12px">
        <Icon v-if="botStore.evmAddress&&activeParentTab===1" name="custom:pump-setting"
          class="color-[--secondary-text] hover:color-[--main-text] cursor-pointer text-14px"
          @click="emits('setDrawerVisible', true)" />
        <Icon name="custom:close" class="text-14px shrink-0 cursor-pointer color-[--main-text]"
          @click="trackerStore.visible = false" />
      </div>
    </div>
    <template v-if="activeParentTab===1">  
      <div class="flex justify-between mb-12px items-center">
        <div class="flex items-center gap-16px">
          <span v-for="el in tabs" :key="el.value" :class="[
            'text-14px cursor-pointer',
            activeTab === el.value ? 'color-[--main-text]' : 'color-[--secondary-text]',
          ]" @click="setActiveTab(el.value)">
            {{ el.label }}
          </span>
           <div class="flex items-center gap-8px color-[--secondary-text] ml--8px ">
          <el-popover v-model:visible="filterVisible" placement="bottom-end" trigger="click" :width="268"
            :persistent="false">
            <template #reference>
              <Icon name="custom:filter" class="text-12px cursor-pointer text-[--primary-color]" />
            </template>
            <template #default>
              <div class="flex w-full flex-wrap w-full w-typeFilter border-b-1px border-b-solid border-b-[--dialog-divider] pb-4px">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" class="[--el-checkbox-height:16px] mb-12px"
                  @change="handleCheckAllChange">
                  {{ t('all') }}
                </el-checkbox>
                <el-checkbox-group v-model="query.types" class="flex [--el-checkbox-height:16px] w-full flex-wrap"
                  @change="handleCheckedChange">
                  <!--mb-16px border-b-solid border-b-1px border-b-[--dialog-divider] -->
                  <el-checkbox v-for="option in checkboxOptions" :key="option.value" :value="option.value" class="w-50% mr-0! mb-12px">
                    <div class="flex items-center gap-4px">
                      <div class="flex items-center py-5px px-4px rounded-4px text-12px w-20px h-20px"
                      :style="{background: map[option?.value]?.bg, color: map[option?.value]?.color}"
                      >
                        <Icon :name="`custom:twitter-${option?.value}`" class="text-13px" />
                      </div>
                      {{ map[option?.value]?.label }}
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <el-checkbox-group
                v-model="query.types"
                class="flex flex-col [--el-checkbox-height:16px] gap-12px mt-16px"
              >
                <el-checkbox
                  v-for="option in fixedCheckboxOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="pt-16px flex items-center gap-10px">
                <el-button class="flex-1" @click="filterVisible = false">
                  {{ t('cancel') }}
                </el-button>
                <el-button class="flex-1" type="primary" @click="confirmQuery">
                  {{ t('confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
          <!-- <Icon class="cursor-pointer" :ref="!isMine ?'audioButtonRef':'audioButtonRef1'"
                :name="(isMine ?globalStore.audioSettings.audio.twitterForMe : globalStore.audioSettings.audio.twitter) ? 'custom:ad' : 'custom:admute'" /> -->
          <Icon v-if="!isMine" class="cursor-pointer text-[--third-text]" ref="audioButtonRef" :name="(globalStore.audioSettings.audio.twitter) ? 'custom:ad' : 'custom:admute'" ></Icon>
          <Icon v-else class="cursor-pointer text-[--third-text]" ref="audioButtonRef1" :name="(globalStore.audioSettings.audio.twitterForMe) ? 'custom:ad' : 'custom:admute'" ></Icon>
          <el-dropdown
            :persistent="false"
            trigger="click"
            popper-class="dropdown-lang"
            placement="bottom-end"
            class="w-auto"
            @command="langStore.setLanguage"
          >
            <Icon name="material-symbols:language" class="text-16px text-[--third-text] cursor-pointer " v-tooltip="$t('languageSetting')"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, $index) in locales"
                  :key="$index"
                  :command="item?.code"
                  :class="{ active: langStore.locale == item.code }"
                >
                  {{ item?.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <Icon name="custom:hashtag" class="text-[--third-text] cursor-pointer " @click="dialogVisible=true" v-tooltip="$t('custom')"></Icon>
          <Icon v-show="trackerStore.isPaused" name="custom:stop"/>
          <!-- <el-dropdown :persistent="false" trigger="click">
              <div class="w-24px h-24px bg-[--main-list-hover] flex items-center justify-center rounded-4px cursor-pointer"><Icon name="material-symbols:language"/></div>
              <template #dropdown>
                <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                </el-dropdown-menu>
              </template>
          </el-dropdown> -->
        </div>
        </div>
        <el-input v-model="query.token_keyword" style="--el-input-bg-color:var(--main-list-hover);--el-input-height:26px;"
          class="w-120px" size="small"  :placeholder="t('searchCA')" @input="debouncedConfirmInput">
          <template #prefix>
            <Icon name="custom:search" />
          </template>
        </el-input>
      </div>
      <TwitterTrackerList :isMine="isMine"  @endReached="debouncedGetList" @startAttention="emits('setDrawerVisible', true)" />
    </template>
    <template v-else-if="activeParentTab===2">
      <div class="flex justify-between mb-12px items-center">
        <div class="flex items-center gap-8px">
          <Icon class="cursor-pointer color-[--secondary-text]" ref="audioButtonRef2"
              :name="globalStore.audioSettings.audio.news ? 'custom:ad' : 'custom:admute'" />
          <Icon v-show="isPaused2" name="custom:stop"/>
        </div>
        <el-checkbox class="[--el-checkbox-height:14px]"  v-model="onlyTitle" :label="t('onlyTitle')"/>
      </div>
     <NewsList v-if="shouldRenderChild" :total="total2" :dataSource="dataSource2" @endReached="debouncedGetList2" :onlyTitle="onlyTitle"  @stop="val => isPaused2 = val"/>
    </template>
    <div v-else>null</div>
    <AudioPopover v-if="audioButtonRef" :buttonRef="audioButtonRef" type="twitter"/>
    <AudioPopover v-if="audioButtonRef1" :buttonRef="audioButtonRef1" type="twitterForMe"/>
    <AudioPopover v-if="audioButtonRef2" :buttonRef="audioButtonRef2" type="news"/>
    <audio ref="twitterAudio" controls style="display: none" :src="getAudioUrl(globalStore.audioSettings.audio.twitter)"
      :volume="+globalStore.audioSettings.audio.volume / 100 || 0.5" />
    <audio ref="twitterAudio1" controls style="display: none" :src="getAudioUrl(globalStore.audioSettings.audio.twitterForMe)"
      :volume="+globalStore.audioSettings.audio.volume / 100 || 0.5" />
    <audio ref="newsAudio" controls style="display: none" :src="getAudioUrl(globalStore.audioSettings.audio.news)"
      :volume="+globalStore.audioSettings.audio.volume / 100 || 0.5" />
    <CustomSettingsDialog v-model="dialogVisible"></CustomSettingsDialog>
  </div>
</template>

<script setup name="trackerPop">
import { useDebounceFn, useStorage } from '@vueuse/core'
import TwitterTrackerList from './list.vue'
import NewsList from './newsList.vue'
import useNews from './useNews'
import { getAllFollowIds, getTwitterList } from '~/api/twitter'
import { useV2WSStore } from '~/stores/v2ws'
import { useTrackerTypes } from './constants'
import CustomSettingsDialog from './customSettingsDialog'
const emits = defineEmits(['setDrawerVisible'])
const { t } = useI18n()
const newsAudio = useTemplateRef('newsAudio')
const { locales } = useI18n()
const {map} = useTrackerTypes()
const langStore = useLocaleStore()
const trackerStore = useTwitterTrackerStore()
const v2WsStore = useV2WSStore()
const globalStore = useGlobalStore()
const {lang} = storeToRefs(useGlobalStore())
const botStore = useBotStore()
const activeTab = ref(1)
const activeParentTab = ref(1)
const filterVisible = ref(false)
const audioVisible = ref(false)
// const isPaused = trackerStore.isPaused
const isPaused2 = ref(false)
const wsCacheArr = shallowRef([])
const audioButtonRef = ref()
const audioButtonRef1 = ref()
const audioButtonRef2 = ref()
const twitterAudio = useTemplateRef('twitterAudio')
const twitterAudio1 = useTemplateRef('twitterAudio1')
const followIds = useStorage('twFollowIds', [])
const dialogVisible=shallowRef(false)
const {dataSource: dataSource2, getList:getList2,total:total2} = useNews({newsAudio,activeParentTab,isPaused:isPaused2})
const query = ref({ ...trackerStore.query })
// defineProps({
//   scrollHeight: {
//     type: Number,
//     default: 0,
//   },
// })
// const follow_only = ref(false)
const onlyTitle = shallowRef(false)


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
const {arr:checkboxOptions} = useTrackerTypes()
const isMine = computed(() => {
  return activeTab.value === TAB_TYPE.MINE
})
const fixedCheckboxOptions = computed(() => [
  { label: t('onlyCA'), value: -1 },
])
const checkAll = ref(query.value.types.filter(el=>el>0).length === checkboxOptions.value.length)
const isIndeterminate = ref(false)
const handleCheckAllChange = () => {
  const types=query.value.types.filter(el=>el>0)
  const must_contains_ca= query.value.types.includes(-1)
  query.value.types = checkAll.value ? [...checkboxOptions.value.map(i => i.value),...(must_contains_ca?[-1]:[])] : (must_contains_ca?[-1]:[])

  isIndeterminate.value = types.length > 0 && types.length < checkboxOptions.value.length
}
const handleCheckedChange = (val) => {
  const checkedCount = val.filter(el=>el>0).length
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
watch(() => botStore.accessToken, val => {
  if (val && isMine.value) {
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
  if(query.value.types.filter(el=>el>0).length === 0) {
    ElMessage.error(t('trackerTypeRequired'))
    return 
  }
  filterVisible.value = false
  reset()
  trackerStore.query = {
    ...trackerStore.query,
    ...query.value,
  }
  getList()
}
const debouncedConfirmInput = useDebounceFn(confirmQuery, 300)

const getList = async () => {
  // const _follow_only = isMine.value || follow_only.value
  const _activeTab = activeTab.value
  if (isMine.value && !botStore.accessToken) {
    return
  }
  if(trackerStore.loading || trackerStore.finished) return
  trackerStore.loading = true
  const types=query.value.types.filter(el=>el>0).join(',')
  try {
    const res = await getTwitterList({
      ...query.value,
      follow_only: isMine.value,
      types,
      must_contains_ca: query.value.types.includes(-1),
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

const debouncedGetList = useDebounceFn(getList, 100)

const debouncedGetList2 = useDebounceFn(getList2, 100)

onMounted(() => {
  getList()
})
const twitterHandler = async (val) => {
  if (query.value.types.includes(+val.type) && !query.value.token_keyword) {
    if (isMine.value && !followAuthorIds.value.includes(val.author?.author_id)) {
      return
    }
    if((query.value.types.includes(-1)&&!val?.tokens?.length)){
      return 
    }
    // 判断是否已经存在该推特
    const index = trackerStore.list.findIndex(el => el.tweet_id === val.tweet_id)
    val.follow_status = followAuthorIds.value.includes(val.author?.author_id) ? 1 : 0
    if (index!==-1) {
      trackerStore.list[index] = val
      return
    }
    if(trackerStore.isPaused || ((activeParentTab.value !== 1) || (!trackerStore.visible&&activeParentTab.value===1))) {
      trackerStore.unReader++
      wsCacheArr.value.unshift(val)
      wsCacheArr.value = wsCacheArr.value.slice(0,100)
    } else {
      trackerStore.list.unshift(val)
      if (trackerStore.list.length > 100) {
        trackerStore.list.pop()
      }
    }

    // console.log('trackerStore.list',trackerStore.list.map(el => el.content))
    const audioEl = isMine.value ? twitterAudio1.value : twitterAudio.value
    if (audioEl && globalStore.audioSettings.audio[isMine.value ? 'twitterForMe' : 'twitter']) {
      audioEl.play()
    }
  }
  if((query.value.types.includes(8)&&val?.tokens&&val?.tokens?.length>0)||!query.value.types.includes(8)) {
  }
}

function updateCache() {
  const map = new Map();
  
  wsCacheArr.value.forEach(item => {
    // 只有当 Map 中还没有这个 tweet_id 时，才设置
    // 如果已经有了，什么都不做（从而保留了前面的值）
    if (!map.has(item.tweet_id)) {
      map.set(item.tweet_id, item);
    }
  });
  
  const result = Array.from(map.values());
  trackerStore.list.unshift(...result)
  trackerStore.list = trackerStore.list.slice(0,100)
  wsCacheArr.value = []
}

watch([() => trackerStore.isPaused, () => activeParentTab.value], ([val,val2]) => {
  if (!val && val2 === 1 && wsCacheArr.value.length > 0) {
    updateCache()
  }
})

watch(
  () => v2WsStore.wsResult[WSEventV2Type.PUBLIC_TWITTER],(val)=>{
    // if((activeParentTab.value===1)&&(trackerStore.isPaused||!trackerStore.visible)){
    //   if(isMine.value&&(activeParentTab.value===1)){
    //     if(followAuthorIds.value.includes(val.author.author_id)){
    //       trackerStore.unReader++
    //     }
    //   }else{
    //     trackerStore.unReader++
    //   }
    // }
    // if(!trackerStore.visible){
    // }
    twitterHandler(val)
  }
)

watch(
  () => trackerStore.visible,(val)=>{
    if(val){
      updateCache()
      nextTick(() => {
        const scrollContainer = document.querySelector('.affix-container')
        if (scrollContainer && scrollContainer.scrollTop <= 60) {
          trackerStore.isPaused = false
        }
      })
    }else{
      trackerStore.isPaused=true
    }
    trackerStore.unReader=0
  }
)

watch(() => followAuthorIds.value, () => {
  if (isMine.value) {
    trackerStore.list = trackerStore.list.filter(el => {
      return followAuthorIds.value.includes(el.author.author_id)
    })
  }
})
const shouldRenderChild = shallowRef(true)

const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}

watch([() => lang.value.includes('zh'), () => onlyTitle.value], () => {
  reCreateChild()
})
useVisibilityChange(() => {
  trackerStore.list = []
  query.value.page_token = ''
  getList()
})
</script>

<style scoped lang="scss">
.w-typeFilter{
  :deep() .el-checkbox__label{
    padding-left: 10px;
  }
}
</style>
