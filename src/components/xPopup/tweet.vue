<template>
  <div v-if="info?.content && !loading" class="color-#5E6D89 w-300px">
    <div class="p-16px">
      <div class="flex items-center">
        <img :src="props.info?.display_pic || ''" class="rd-50% mr-8px" width="48" height="48" alt="" srcset="">
        <div>
          <div class="text-16px font-500 flex items-center">
            <span class="color-#F5F5F5">{{ props.info?.name || '' }}</span>
            <img class="ml-4px" src="@/assets/images/xV.svg" height="20" alt="" srcset="">
          </div>
          <div class="color-#5E6D89 text-12px mt-3px">
            <span>@{{ props.info?.username || '' }}</span>
            <!-- <a :href="`https://x.com/intent/follow?screen_name=${props.info?.username}`" target="_blank" class="color-#009EF7 text-14px clickable ml-3px">Follow</a> -->
          </div>
        </div>
        <img class="rd-50% ml-auto" src="@/assets/images/x.svg" height="32" alt="" srcset="">
      </div>
      <div class="flex items-center color-#5E6D89 text-14px mt-8px">
        <Icon class="mr-5px" name="ri:calendar-todo-fill" />
        <span>Joined {{ dayjs(props.info?.joined_date).locale('en').format('MMM YYYY')  }}</span>
        <span class="ml-16px text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(props.info?.followers || 0 , {locale: 'en', limit: 10}) }}</span>
        <span>Followers</span>
      </div>
      <div class="my-8px" style="border-bottom: 1px solid #5E6D894D" />
      <div v-if="props.info?.content" class="break-words color-#F5F5F5 text-14px ellipsis-15" v-html="convertTextToHtml(props.info?.content)" />
      <div v-if="props.info?.content && showTranslation" class="text-12px mt-8px flex items-center clickable"  @click.stop="translationVisible = !translationVisible">
        <Icon  name="custom:translation" class="text-14px clickable" />
        <span class="ml-2px">{{ t(translationVisible ? 'viewOrigin':'viewTranslation') }}</span>
      </div>

      <template v-if="translationVisible && showTranslation">
        <div v-if="processedContentZhHtml" class="mt-8px bg-#FFFFFF08 px-12px py-6px rounded-4px color-#F5F5F5 ellipsis-15" @click.stop v-html="processedContentZhHtml"/>
        <el-skeleton v-else animated class="mt-8px">
          <template #template>
            <el-skeleton-item variant="p" style="width: 100%" />
          </template>
        </el-skeleton>
      </template>

      <el-image v-if="props.info?.media" :src="props.info?.media" class="mt-8px w-100%" alt="" srcset="" />

          <!-- Replied / quoted / retweeted tweet -->
          <div v-if="repliedInfo && repliedInfo.content" class="mt-8px border-1px border-solid border-#5E6D894D rounded-8px p-16px">
            <div class="flex items-center lh-none">
                <img :src="repliedInfo.display_pic || ''" class="rd-50% mr-8px" width="24" height="24" alt="" srcset="" >
                <div>
                  <div class="text-12px font-500 flex items-center">
                    <span class="color-#F5F5F5">{{ repliedInfo.name || '' }}</span>
                    <img class="ml-4px" src="@/assets/images/xV.svg" height="16" alt="" srcset="">
                  </div>
                  <div class="color-#5E6D89 text-12px mt-3px">
                    <span>@{{ repliedInfo.username || '' }}</span>
                  </div>
                </div>
            </div>
              <div class="text-14px color-#F5F5F5 mt-8px" v-html="convertTextToHtml(repliedInfo.content)"/>
              <div v-if="repliedShowTranslation" class="text-12px mt-8px flex items-center clickable" @click.stop="repliedTranslationVisible = !repliedTranslationVisible">
                <Icon name="custom:translation" class="text-14px" />
                <span class="ml-2px">{{ t(repliedTranslationVisible ? 'viewOrigin':'viewTranslation') }}</span>
              </div>
              <template v-if="repliedTranslationVisible && repliedShowTranslation">
                <div v-if="repliedProcessedTranslatedHtml" class="mt-8px bg-#FFFFFF08 px-12px py-6px rounded-4px color-#F5F5F5" @click.stop v-html="repliedProcessedTranslatedHtml"/>
                <el-skeleton v-else animated class="mt-8px">
                  <template #template>
                    <el-skeleton-item variant="p" style="width: 100%" />
                  </template>
                </el-skeleton>
              </template>
          </div>
      <div class="text-12px mt-12px flex items-center">
        <span>{{ $dayjs(props.info?.tweet_created).locale('en').fromNow(true) }} · {{ dayjs(props.info?.tweet_created).locale('en').format('h:mm A, MMM D, YYYY') }}</span>
        <Icon class="ml-auto text-14px" name="ri:bookmark-fill" />
        <span class="ml-2px text-14px">{{ props.info?.bookmark_count }}</span>
      </div>
      <div class="my-8px" style="border-bottom: 1px solid #5E6D894D" />
      <div class="text-14px flex items-center">
        <Icon class="text-18px color-#F45469 mr-2px" name="material-symbols:favorite" />
        <span>{{ props.info?.like_count || 0 }}</span>
        <Icon class="text-18px color-#12B886 mr-2px ml-auto" name="ri:repeat-line" />
        <span>{{ props.info?.retweet_count || 0 }}</span>
        <Icon class="text-18px color-#009EF7 mr-2px ml-auto" name="ri:chat-3-fill" />
        <span>{{ props.info?.reply_count || 0 }}</span>
      </div>
      <a :href="props.info?.twitter_url" target="_blank" class="mt-16px block">
        <button class=" clickable w-100% h-32px flex items-center justify-center color-#009EF7 bg-transparent text-14px font-500 b-1px b-solid b-#009EF733 rd-8px">Read more on X</button>
      </a>
    </div>
  </div>
  <div v-if="!loading && !props.info?.content" class="p-16px w-300px min-h-100px flex flex-col items-center justify-center">
    <div class="text-16px font-500 color-#F5F5F5">{{ $t('tweetNotFound') }}</div>
    <div class="text-14px font-500 color-#999 mt-8px">{{ $t('youCanNotSeeThisTweet') }}</div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import $dayjs from '@/utils/day'
import { formatNumber } from '@/utils/formatNumber'
import type { XType1 } from '~/api/x'
import { convertTextToHtml, needsTranslation } from './utils'
// import { getTwitterSeconds } from '@/utils/index'
// import { useNow } from '@/composables/useNow'
const globalStore = useGlobalStore()
const { lang } = storeToRefs(globalStore)
const { t } = useI18n()
const props =defineProps({
info: {
  type: Object as PropType<XType1 | null>,
  default: () => (null),
},
loading: {
  type: Boolean,
  default: false
}
})

const translationVisible = ref(true)
const repliedTranslationVisible = ref(true)

const repliedInfo = computed(() => {
  return props.info?.replied_tweet || null
})

const repliedShowTranslation = computed(() => {
  const r = repliedInfo.value
  if (!r || !r.content) return false
  const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
  const isNoSame = r?.[key] && r?.[key] !== r?.content
  return isNoSame && needsTranslation(String(r.content))
})

const repliedProcessedTranslatedHtml = computed(() => {
  const r = repliedInfo.value
  if (!r) return ''
  const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
  const content = r?.[key]
  return content ? convertTextToHtml(content) : ''
})

const showTranslation = computed(() => {
  if (!props.info?.content) return false
  const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
  const isNoSame = props.info?.[key] && props.info?.[key] !== props.info?.content
  return isNoSame && needsTranslation(String(props.info.content))
})

const processedContentZhHtml = computed(() => {
  const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
  const content = props.info?.[key]
  return content ? convertTextToHtml(content) : ''
})

// const now = useNow()
// const currentColor = computed(() => {
//     const time = now.value - new Date(props.info?.tweet_created || 0).getTime()
//     const middleSize = pumpSetting.value.data?.twitter?.middleSize ?? 0
//     const middleUnit = pumpSetting.value.data?.twitter?.middleUnit ?? 'm'
//     const minSize = pumpSetting.value.data?.twitter?.minSize ?? 0
//   const minUnit = pumpSetting.value.data?.twitter?.minUnit ?? 's'
//   if (!minSize && !middleSize) {
//     return ''
//   }
//   if (time / 1000 <= getTwitterSeconds(minSize, minUnit)) {
//     return pumpSetting.value.data?.twitter?.minColor
//   } else if (time / 1000 <= getTwitterSeconds(middleSize, middleUnit)) {
//     return pumpSetting.value.data?.twitter?.middleColor
//   } else if (time / 1000 > getTwitterSeconds(middleSize, middleUnit)) {
//     return pumpSetting.value.data?.twitter?.maxColor
//   } else {
//     return ''
//   }
// })
</script>

<style scoped lang='scss'>
.ellipsis-10 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
}

</style>
