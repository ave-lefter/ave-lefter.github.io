<template>
  <AveEmpty v-if="isMine && !botStore.evmAddress">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button
      type="primary"
      class="text-12px w-266px h-40px"
      @click="botStore.changeConnectVisible(true)"
    >
      {{ t('connectWallet') }}
    </el-button>
  </AveEmpty>
  <div v-else-if="isMine && isEmpty" class="flex flex-col items-center pt-60px">
    <Icon name="custom:twitter-empty" class="text-61px mb-12px" />
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('twitterEmpty') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px" @click="emits('startAttention')">
      {{ t('attention') }}
    </el-button>
  </div>
 <el-scrollbar v-else height="calc(100% - 120px)">
  <div class="flex flex-col gap-16px">
    <div
      v-for="(item,index) in trackerStore.list"
      :key="item.id"
      class="border-b-1px border-b-solid border-b-[--border] pb-16px flex gap-7px"
    >
      <UserAvatar
        icon-size="32px"
        :wallet_logo="{ logo: item.profile_pic, name: item.author.name }"
      />
      <div class="flex flex-col gap-8px flex-1 min-w-0">
        <div class="justify-between items-center flex">
          <div class="min-w-0 flex-1">
            <div class="gap-8px flex items-center min-w-0">
              <span v-tooltip="item.author.name" class="color-[--main-text] text-16px lh-20px min-w-0 max-w-[calc(100%-90px)] truncate">{{
                item.author.name
              }}</span>
              <TimerCount
                v-if="item.created_at && Number(formatTimeFromNow(item.created_at, true)) < 60"
                :key="`${item.created_at}`"
                :timestamp="item.created_at"
                :end-time="60"
                class="text-12px"
              >
                <template #default="{ seconds }">
                  <span class="color-[--secondary-text] text-12px">
                    <template v-if="seconds < 60"> {{ seconds }}s </template>
                    <template v-else>
                      {{ formatTimeFromNow(item.created_at) }}
                    </template>
                  </span>
                </template>
              </TimerCount>
              <span
                v-else
                v-tooltip="formatDate(item.created_at, 'YYYY-MM-DD HH:mm:ss')"
                class="color-[--secondary-text] text-12px"
              >
                {{ formatTimeFromNow(item.created_at) }}
              </span>
            </div>
            <div class="text-12px color-[--secondary-text]">@{{ item.author.username }}</div>
          </div>
          <div class="gap-8px flex items-center">
            <div
              class="w-24px h-24px bg-[--main-list-hover] rounded-4px flex items-center justify-center cursor-pointer"
              @click="item.author.follow_status === 1 ? _unfollowKol(item.author.author_id, index) : _followKol(item.author.author_id, index)"
            >
              <Icon
                :name="
                  item.author.follow_status === 1
                    ? 'custom:twitter-collect'
                    : 'custom:twitter-uncollect'
                "
                class="text-12px"
              />
            </div>
            <div
              class="w-24px h-24px bg-[--main-list-hover] rounded-full flex items-center justify-center"
            >
              <Icon :name="`custom:twitter-${item.type}`" class="text-12px" />
            </div>
          </div>
        </div>
        <div v-show="!item.hide" class="text-14px lh-22px break-words">
          {{ item.content }}
        </div>
        <div class="justify-between items-center flex">
          <div class="flex items-center gap-4px cursor-pointer text-12px color-[--secondary-text]">
            <!-- <Icon name="custom:translation"/>{{ t('viewTranslation') }} -->
          </div>
          <span class="flex items-center gap-4px cursor-pointer color-[--primary-color] text-12px" @click="item.hide = !item.hide"><Icon name="custom:angle-down" :class="item.hide ? '' : 'rotate-180'"/>
            {{ item.hide?t('Expand') :t('Collapse') }}
          </span>
        </div>
      </div>
    </div>
  </div>
 </el-scrollbar>
</template>
<script setup name="twitterTackerList">
import { followKol, unfollowAll } from '~/api/twitter'

const { t } = useI18n()
const emits = defineEmits(['startAttention'])
const props = defineProps({
  activeTab: {
    type: Number,
    default: 1,
  },
})
const botStore = useBotStore()
const trackerStore = useTwitterTrackerStore()
const isEmpty = computed(() => trackerStore.list.length === 0)
const isMine = computed(() => props.activeTab === 2)

const _followKol = async (author_id, index) => {
  try {
    if(!botStore.accessToken){
      botStore.changeConnectVisible(true)
      return
    }
    await followKol(author_id)
    ElMessage.success(t('followed'))
    trackerStore.list[index].author.follow_status = 1
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error following KOL:', error)
  }
}

const _unfollowKol = async (author_id, index) => {
  try {
    await unfollowAll(author_id)
    ElMessage.success(t('cancelFollowed'))
    trackerStore.list[index].author.follow_status = 0
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error unfollowing KOL:', error)
  }
}
</script>
<style scoped lang="scss">
  :deep(.el-scrollbar__thumb){
    display: none;
  }
</style>
