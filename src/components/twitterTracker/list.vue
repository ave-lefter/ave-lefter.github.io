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
  <div v-else class="flex flex-col gap-16px">
    <div
      v-for="item in trackerStore.list"
      :key="item.id"
      class="border-b-1px border-b-solid border-b-[--border] pb-16px flex gap-7px"
    >
      <UserAvatar
        icon-size="32px"
        :wallet_logo="{ logo: item.profile_pic, name: item.author.name }"
      />
      <div class="flex flex-col gap-8px flex-1">
        <div class="justify-between items-center flex">
          <div class="min-w-0 flex-1">
            <div class="gap-8px flex items-center min-w-0">
              <span class="color-[--main-text] text-16px lh-20px min-w-0 flex-1 truncate">{{
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
        <div />
        <div />
      </div>
    </div>
  </div>
</template>
<script setup name="twitterTackerList">
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
</script>
