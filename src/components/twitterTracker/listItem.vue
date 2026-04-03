<template>
    <div class="pb-16px">
        <div class="flex flex-col gap-8px flex-1 min-w-0">
            <div v-if="[5,6].includes(Number(item.type))" class="flex  gap-8px items-center lh-none">
                <div class="flex items-center p-5px rounded-4px text-12px"
                :style="{background: map[item.type]?.bg, color: map[item.type]?.color}"
                >
                    <Icon :name="`custom:twitter-${item.type}`" class="text-10px" />
                </div>
                <div class="font-500 text-14px mt--2px" :style="{color: map[item.type]?.color}">
                    {{ map[item.type]?.label }}
                </div>
                <div class="font-400 text-12px text-[--d-666-l-959A9F]">@{{ item.author.username }}&nbsp;{{ map[item.type]?.action }}•
                    <TimerCount
                        v-if="item.action_at && Number(formatTimeFromNow(item.action_at, true)) < 60"
                        :key="`${item.action_at}`"
                        :timestamp="Math.min(+item.action_at, dayjs().unix() - 1)" :end-time="60">
                        <template #default="{ seconds }">
                            <span class="text-12px color-[--up-color]">
                                <template v-if="seconds < 60"> {{ seconds }}s </template>
                                <template v-else>
                                    {{ formatTimeFromNow(item.action_at) }}
                                </template>
                            </span>
                        </template>
                    </TimerCount>
                    <span v-else v-tooltip="formatDate(item.action_at, 'YYYY-MM-DD HH:mm:ss')"
                        class="text-12px">
                        {{ formatTimeFromNow(item.action_at) }}
                    </span>
                </div>
            </div>
            <div class="justify-between items-center flex">
                <div class="min-w-0 flex-1">
                    <div class="min-w-0 flex-1 flex items-center gap-7px">
                        <UserAvatar icon-size="32px" class="cursor-pointer"
                            :wallet_logo="{ logo: item.author.profile_pic, name: item.author.name }"
                            @click="clickAvatar(item.author.author_id)" />
                        <div class="flex-1 min-w-0">
                            <div class="gap-8px flex items-center min-w-0">
                                <span v-tooltip="item.author.name"
                                    class="color-[--main-text] text-16px lh-20px min-w-0 max-w-[calc(100%-80px)] truncate cursor-pointer"
                                    @click="clickAvatar(item.author.author_id)">{{
                                        item.author.name
                                    }}</span>
                                <img v-if="item.verified" :width="12" src="@/assets/images/kol.svg" alt="">
                                <TimerCount
                                    v-if="item.created_at && Number(formatTimeFromNow(item.created_at, true)) < 60"
                                    :key="`${item.created_at}`"
                                    :timestamp="Math.min(+item.created_at, dayjs().unix() - 1)" :end-time="60">
                                    <template #default="{ seconds }">
                                        <span class="color-[--up-color] text-12px">
                                            <template v-if="seconds < 60"> {{ seconds }}s </template>
                                            <template v-else>
                                                {{ formatTimeFromNow(item.created_at) }}
                                            </template>
                                        </span>
                                    </template>
                                </TimerCount>
                                <span v-else v-tooltip="formatDate(item.created_at, 'YYYY-MM-DD HH:mm:ss')"
                                    class="color-[--up-color] text-12px">
                                    {{ formatTimeFromNow(item.created_at) }}
                                </span>
                            </div>
                            <div class="text-12px color-[--secondary-text]">@{{ item.author.username }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="index !== -1" class="gap-8px flex items-center">
                    <div class="w-24px h-24px bg-[--main-list-hover] rounded-4px flex items-center justify-center cursor-pointer" v-tooltip="followIdArray.includes(item.author.author_id) ? t('unfollowAuthor') : t('followAuthor')"
                        @click="followIdArray.includes(item.author.author_id) ? _unfollowKol(item.author.author_id, index) : _followKol(item.author.author_id, index)">
                        <Icon :name="followIdArray.includes(item.author.author_id) ? 'custom:twitter-collect' : 'custom:twitter-uncollect'" class="text-12px" />
                    </div>
                </div>
            </div>
            <div class="relative" :class="index !== -1 ? 'ml-0px' : ''">
                <div ref="contentEl" :class="[
                    'text-14px lh-22px break-words',
                ]">
                <!-- &&(item?.quoted_tweet?.author?.username||item?.retweeted_tweet?.author?.username||item.original_type=='4') -->
                    <div v-if="[1,2,3,4].includes(Number(item.original_type))" class="text-14px lh-22px break-words flex">
                        <div class="flex items-center gap-8px">
                            <div class="flex items-center w-20px h-20px rounded-4px justify-center"
                            :style="{background: map[item.original_type]?.bg, color: map[item.original_type]?.color}"
                            >
                                <Icon :name="`custom:twitter-${item.original_type}`" class="text-13px" />
                            </div>
                            <span class="font-400 text-14px lh-22px mt--2px" :style="{color: map[item.original_type]?.color}">{{ map[item.original_type]?.label }}</span>
                        </div>
                        <!-- <span :style="{color: map[item.original_type]?.color}">{{ map[item.original_type]?.label }}</span> -->
                        <!-- <a v-if="item?.quoted_tweet?.author?.username||item?.retweeted_tweet?.author?.username" :href="`https://twitter.com/${item?.quoted_tweet?.author?.username||item?.retweeted_tweet?.author?.username}`" class="[&amp;&amp;]:color-[--primary-color] hover:underline" target="_blank" rel="noopener noreferrer">@{{ item?.quoted_tweet?.author?.username||item?.retweeted_tweet?.author?.username }}</a> -->
                    </div>
                    <div v-if="+props.item.original_type!==typeEnum.retweet" :class="[
                    { 'line-11': !contentExpanded && isContentOverflow },'my-8px'
                ]">
                        <div class="cursor-pointer w-p-box text-[--main-text1]" @click="handleContentClick" v-html="processedContent" />
                    </div>
                  
                    <div v-if="+props.item.original_type!==typeEnum.retweet" :class="index !== -1 ? 'ml-0px' : ''"
                        class="justify-between items-center flex">
                        <div class="flex items-center gap-4px cursor-pointer text-12px color-[--third-text]" @click="translationVisible=!translationVisible">
                            <template v-if="props.item.content&&showTranslation">
                                <Icon name="custom:translation" class="text-14px"/>{{ t(translationVisible ? 'viewOrigin':'viewTranslation') }}
                            </template>
                        </div>
                        <span v-if="isContentOverflow" class="flex items-center gap-4px cursor-pointer color-[--primary-color] text-12px"
                            @click="contentExpanded = !contentExpanded">
                            <Icon name="custom:angle-down" :class="contentExpanded ? 'rotate-180' : ''" />
                            {{ !contentExpanded ? t('Expand') : t('Collapse') }}
                        </span>
                    </div>
                    <template v-if="(+props.item.original_type!==typeEnum.retweet)&&translationVisible&&showTranslation">
                        <div v-if="processedContentZh" class="mt-8px bg-[--main-list-hover] px-12px py-6px rounded-4px text-[--main-text1]" v-html="processedContentZh" @click="handleContentClick"></div>
                        <el-skeleton v-else animated class="mt-8px">
                            <template #template>
                                <el-skeleton-item variant="p" style="width: 100%" />
                            </template>
                        </el-skeleton>
                    </template>
                    
                    <div v-if="item?.tokens?.filter(item=>item?.price_change_24h)?.length" class="flex flex-wrap justify-between">
                        <div v-for="token in item?.tokens?.filter(item=>item?.price_change_24h)" class="w-[calc(50%-4px)] mt-8px flex gap-4px items-center lh-none bg-[--up-bg] bg-[--down-bg] px-8px py-6px clickable rounded-4px" :class="[getBgClass(token?.price_change_24h)]" @click="navigateTo(`/token/${token?.address}-${token?.chain}`)">
                            <!-- <Icon name="i-icon-park-solid:volume-notice" class="text-12px color-[--main-text1]"></Icon>{{ token.kol_count }}{{ t('times') }} -->
                            <TokenImg :row="token" class="mr-4px" tokenClass="w-16px h-16px" chainClass="w-8px h-8px"/>
                            <div class="whitespace-nowrap text-ellipsis overflow-hidden max-w-100px mr-4px">{{ token?.symbol }}</div>
                            <span class="ml-0px" :class="getColorClass(token?.price_change_24h)">{{ addSign(token?.price_change_24h) }}{{ formatNumber(Math.abs(token?.price_change_24h), 2) }}%</span>
                        </div>
                    </div>
                </div>
                <div ref="measureEl" class="text-14px lh-22px break-words absolute opacity-0 pointer-events-none"
                    style="width: 100%; top: 0; left: 0; z-index: -1;" v-html="processedContent" />
            </div>
            <div v-for="(media, mediaIndex) in item.medias?.slice?.(0, 1)" :key="mediaIndex"
                :class="index !== -1 ? 'ml-0px' : ''" class="relative">
                <!-- <img :src="media.media_url_https" alt="" class="max-w-full rounded-8px cursor-pointer"> -->
                <el-tooltip v-if="media.type !== 'video'" :ref="el => { if (el) tooltipRefs[`${mediaIndex}`] = el }"
                    popper-class="tooltip-pd-0" :show-arrow="false" placement="right"
                    :persistent="false" :popper-options="{
                        modifiers: [
                            {
                                name: 'eventListeners',
                                options: {
                                    scroll: true,
                                    resize: true
                                }
                            }
                        ]
                    }" @show="handleTooltipShow(mediaIndex)">
                    <template #default>
                        <img :src="media.media_url_https||media.url" alt="" class="w-full max-h-300px rounded-8px object-cover">
                    </template>
                    <template #content>
                        <img :src="media.media_url_https||media.url" alt="" class="max-w-50vw max-h-50vh object-cover rounded-8px"
                            @load="handleImageLoad(mediaIndex)">
                    </template>
                </el-tooltip>
                <div v-else>
                    <!-- <video ref="videoPlayer" :poster="media.media_url_https" :src="findMediaUrl(media)" class="w-full h-full object-cover video-js vjs-default-skin" controls /> -->
                     <iframe class="w-full" style="border: none; cursor: pointer;height: auto; aspect-ratio: 16 / 9; max-height: 320px;" :srcdoc="`
                     <html>
                        <style>
                            video {
                                width: 100%;
                                height: auto;
                                aspect-ratio: 16 / 9;
                                max-height: 320px;
                            }
                            html, body {
                                margin: 0;
                                padding: 0;
                                overflow:hidden;
                            }
                        </style>
                        <meta name=&quot;referrer&quot; content=&quot;no-referrer&quot; />
                        <video poster=${media.media_url_https} src=${findMediaUrl(media)} controls 
                        />
                     </html>
                     `" frameborder="0" allowfullscreen="" referrerpolicy="no-referrer"/>
                </div>
                <!-- <div v-if="media.type === 'video'" class="absolute top-0 left-0 w-full h-full bg-black/50 rounded-8px">
                    <Icon name="custom:play-circle-line"
                        class="absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 text-48px text-white cursor-pointer"
                        @click="clickVideo(item.url)" />
                </div> -->
            </div>
        </div>
    </div>
</template>
<script setup name="twitterTrackerListItem">
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { followKol, unfollowKol } from '~/api/twitter'
import { processTwitterText } from './utils'
import { typeEnum, useTrackerTypes } from './constants'
import { _tokenSearchV3 } from '@/api/hot'
import TokenImg from '@/components/tokenImg.vue'
import { useLocalStorage } from '@vueuse/core';
const emits = defineEmits(['measureElement'])
const trackerStore = useTwitterTrackerStore()
const {map} = useTrackerTypes()
const { lang } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const botStore = useBotStore()
const pumpStore = usePumpStore()
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

const quoteColor = useLocalStorage('tw-quoteColor', '#3F80F7')
const symbolColor = useLocalStorage('tw-symbolColor', '#FFA622')
const tokenAddressColor = useLocalStorage('tw-tokenAddressColor', '#3F80F7')
const tooltipRefs = ref({})
const contentEl = ref(null)
const measureEl = ref(null)
const contentExpanded = ref(false)
const isContentOverflow = ref(false)
const followIds = useStorage('twFollowIds', [])
const translationVisible = ref(true)

const followIdArray = computed(() => {
    return followIds.value.map(el => el.author_id)
})
const showTranslation = computed(() => {
    // const {lang} = props.item || {}
    const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
    return (props.item?.[key] !== props.item.content)
    // return props.item?.[key] && 
    //     (props.item?.[key] !== props.item.content)
})
// 处理后的内容，包含可点击的链接
const processedContent = computed(() => {
    // const {lang} = props.item || {}
    let key = `content`
    const content = props.item?.[key]
    return processTwitterText(content || props.item.content,props.item?.tokens?.length&&props?.item?.tokens,{
        quoteColor:quoteColor.value,
        symbolColor:symbolColor.value,
        tokenAddressColor:tokenAddressColor.value
    })
})

const tokenList = ref([])



const processedTokenList = computed(() => {
    // const {lang} = props.item || {}
    let key = `content`
    const content = props.item?.[key]
    return processTwitterText(content)
})

// watch(() => processedTokenList.value, (val, old) => {
//     console.log('processedTokenList changed', val, old)
//     if(JSON.stringify(val) === JSON.stringify(old)) return
//     tokenList.value = []
//     if (val.length) {
//         val.forEach(el => {
//             _tokenSearchV3({
//                 query: el,
//                 self_address: useFollowStore().currentAddress,
//             }).then(res => {
//                 const token_list = res?.token_list || []
//                 console.log('token_list', res,token_list)
//                 if(token_list[0]){
//                     tokenList.value.push(token_list[0])
//                 }
//             })
//         })
//     }
// })
// 处理后的内容，包含可点击的链接
const processedContentZh = computed(() => {
    // const {lang} = props.item || {}
    const key = lang.value.includes('zh') ? 'content_zh' : 'content_en'
    const content = props.item?.[key]
    return processTwitterText(content,props.item?.tokens?.length&&props?.item?.tokens,{
        quoteColor:quoteColor.value,
        symbolColor:symbolColor.value,
        tokenAddressColor:tokenAddressColor.value
    })
})
const checkContentOverflow = () => {
    nextTick(() => {
        const el = measureEl.value || contentEl.value
        if (!el) return
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22
        const maxHeight = lineHeight * 11
        isContentOverflow.value = el.scrollHeight > maxHeight + 1
    })
}

onMounted(() => {
    checkContentOverflow()
    window.addEventListener('resize', checkContentOverflow)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkContentOverflow)
    tooltipRefs.value = {}
})

watch(() => [props.item?.content,translationVisible.value], () => {
    checkContentOverflow()
}, { immediate: true })

const twitter_author_id = inject('twitter_author_id')
const clickAvatar = (author_id) => {
    twitter_author_id.value = author_id
}

/**
 * 
 * @param {{
    video_info: {
        variants: {
            content_type: 'video/mp4';
            url: string;
            bitrate?: number;
        }
    }
}} media 
 */
const findMediaUrl = (media) => {
    return media.video_info?.variants?.find?.(v => v.content_type === 'video/mp4')?.url
}

const _followKol = async (author_id, index) => {
    try {
        if (!botStore.accessToken) {
            botStore.changeConnectVisible(true)
            return
        }
        if (followIds.value.length >= 50) {
            ElMessage.error(t('twitterMax'))
            return
        }
        await followKol(author_id)
        ElMessage.success(t('followed'))
        trackerStore.list[index].author.follow_status = 1
        followIds.value = followIds.value.concat({ author_id })
    } catch (error) {
        ElMessage.error(t('failed'))
        console.error('Error following KOL:', error)
    }
}

const _unfollowKol = async (author_id, index) => {
    try {
        await unfollowKol(author_id)
        ElMessage.success(t('cancelFollowed'))
        trackerStore.list[index].author.follow_status = 0
        followIds.value = followIds.value.filter(el => el.author_id !== author_id)
    } catch (error) {
        ElMessage.error(t('failed'))
        console.error('Error unfollowing KOL:', error)
    }
}

const handleTooltipShow = (mediaIndex) => {
    // Tooltip 显示时，等待图片加载完成后更新位置
    nextTick(() => {
        updateTooltipPosition(mediaIndex)
    })
}

const handleImageLoad = (mediaIndex) => {
    emits('measureElement')
    // 图片加载完成后更新 tooltip 位置
    nextTick(() => {
        updateTooltipPosition(mediaIndex)
    })
}

const updateTooltipPosition = (mediaIndex) => {
    const tooltipRef = tooltipRefs.value[mediaIndex]
    if (!tooltipRef) return

    // 使用 nextTick 确保 DOM 已更新
    nextTick(() => {
        // 尝试多种方式更新 tooltip 位置
        if (tooltipRef.updatePopper) {
            tooltipRef.updatePopper()
        } else if (tooltipRef.popperInstance) {
            tooltipRef.popperInstance.update()
        } else if (tooltipRef.$ && tooltipRef.$.exposed) {
            // 尝试访问内部实例
            const exposed = tooltipRef.$.exposed
            if (exposed.updatePopper) {
                exposed.updatePopper()
            }
        }

        // 通过触发 resize 事件来让 popper 重新计算位置
        // 使用 requestAnimationFrame 确保在下一帧执行
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
        })
    })
}

const clickContent = (url) => {
    window.open(url)
}
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('copy failed:', err)
  }
}

// 处理内容点击事件，如果点击的不是链接，则打开推文
const handleContentClick = async(e) => {
    const target = e.target
    // 如果点击的是链接，不阻止默认行为，让浏览器处理
    if (target.tagName === 'A') {
        return
    }
    if (target.tagName === 'SPAN') {
        if(target.innerText){
            if(target.className.includes('tw-symbol')){
                pumpStore.pumpV3[localStorage.getItem('pump_activeChain2')||'bsc'].new.pumpFilter.q = target.innerText.replace('$', '')
                navigateTo(`/`)
                return 
            }else if(target.className.includes('tw-tokenAddress')){
                console.log('handleContentClick', target.innerText)
                await copyToClipboard(target.innerText)
                useGlobalStore().dialogVisible_search = !useGlobalStore().dialogVisible_search
                return 
            }else{
                return
            }
        }
    }
    // 如果点击的是内容区域但不是链接，打开推文
    clickContent(props.item.url)
}   


</script>
