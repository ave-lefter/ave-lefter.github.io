<template>
    <div class="pb-16px flex gap-7px">
        <UserAvatar icon-size="32px" class="cursor-pointer"
            :wallet_logo="{ logo: item.author.profile_pic, name: item.author.name }"
            @click="clickAvatar(item.author.twitter_url)" />
        <div class="flex flex-col gap-8px flex-1 min-w-0">
            <div class="justify-between items-center flex">
                <div class="min-w-0 flex-1">
                    <div class="gap-8px flex items-center min-w-0">
                        <span v-tooltip="item.author.name"
                            class="color-[--main-text] text-16px lh-20px min-w-0 max-w-[calc(100%-90px)] truncate cursor-pointer"
                            @click="clickAvatar(item.author.twitter_url)">{{
                                item.author.name
                            }}</span>
                        <img v-if="item.verified" :width="12" src="@/assets/images/kol.svg" alt="">
                        <TimerCount v-if="item.created_at && Number(formatTimeFromNow(item.created_at, true)) < 60"
                            :key="`${item.created_at}`" :timestamp="+item.created_at" :end-time="60">
                            <template #default="{ seconds }">
                                <span class="color-[--secondary-text] text-12px">
                                    <template v-if="seconds < 60"> {{ seconds }}s </template>
                                    <template v-else>
                                        {{ formatTimeFromNow(item.created_at) }}
                                    </template>
                                </span>
                            </template>
                        </TimerCount>
                        <span v-else v-tooltip="formatDate(item.created_at, 'YYYY-MM-DD HH:mm:ss')"
                            class="color-[--secondary-text] text-12px">
                            {{ formatTimeFromNow(item.created_at) }}
                        </span>
                    </div>
                    <div class="text-12px color-[--secondary-text]">@{{ item.author.username }}</div>
                </div>
                <div v-if="index !== -1" class="gap-8px flex items-center">
                    <div class="w-24px h-24px bg-[--main-list-hover] rounded-4px flex items-center justify-center cursor-pointer"
                        @click="item.author.follow_status === 1 ? _unfollowKol(item.author.author_id, index) : _followKol(item.author.author_id, index)">
                        <Icon :name="item.author.follow_status === 1
                            ? 'custom:twitter-collect'
                            : 'custom:twitter-uncollect'
                            " class="text-12px" />
                    </div>
                    <div class="w-24px h-24px bg-[--main-list-hover] rounded-full flex items-center justify-center">
                        <Icon :name="`custom:twitter-${item.type}`" class="text-12px" />
                    </div>
                </div>
            </div>
            <div class="relative">
                <div 
                    ref="contentEl"
                    :class="[
                        'text-14px lh-22px break-words',
                        { 'line-11': !contentExpanded && isContentOverflow }
                    ]">
                    <div
                        class="cursor-pointer"
                        @click="handleContentClick"
                        v-html="processedContent"
                    />
                </div>
                <div 
                    ref="measureEl"
                    class="text-14px lh-22px break-words absolute opacity-0 pointer-events-none"
                    style="width: 100%; top: 0; left: 0; z-index: -1;"
                    v-html="processedContent"/>
            </div>
            <div v-for="(media, mediaIndex) in item.medias?.slice?.(0,1)" :key="mediaIndex" class="relative">
                <!-- <img :src="media.media_url_https" alt="" class="max-w-full rounded-8px cursor-pointer"> -->
                <el-tooltip 
                    :ref="el => { if (el) tooltipRefs[`${mediaIndex}`] = el }"
                    popper-class="tooltip-pd-0" 
                    :show-arrow="false" 
                    placement="right"
                    :popper-options="{
                        modifiers: [
                            {
                                name: 'eventListeners',
                                options: {
                                    scroll: true,
                                    resize: true
                                }
                            }
                        ]
                    }"
                    @show="handleTooltipShow(mediaIndex)">
                    <template #default>
                        <img :src="media.media_url_https" alt="" class="w-full max-h-300px rounded-8px object-cover">
                    </template>
                    <template #content>
                        <img 
                            :src="media.media_url_https" 
                            alt="" 
                            class="max-w-50vw max-h-50vh object-cover rounded-8px"
                            @load="handleImageLoad(mediaIndex)">
                    </template>
                </el-tooltip>
                <div v-if="media.type==='video'" class="absolute top-0 left-0 w-full h-full bg-black/50 rounded-8px">
                    <Icon name="custom:play-circle-line" class="absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 text-48px text-white cursor-pointer" @click="clickVideo(item.url)"/>
                </div>
               
            </div>
            <div v-if="isContentOverflow" class="justify-between items-center flex">
                <div class="flex items-center gap-4px cursor-pointer text-12px color-[--secondary-text]">
                    <!-- <Icon name="custom:translation"/>{{ t('viewTranslation') }} -->
                </div>
                <span class="flex items-center gap-4px cursor-pointer color-[--primary-color] text-12px"
                @click="contentExpanded = !contentExpanded">
                    <Icon name="custom:angle-down" :class="contentExpanded ? 'rotate-180' : ''" />
                    {{ !contentExpanded ? t('Expand') : t('Collapse') }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup name="twitterTrackerListItem">
import { followKol, unfollowAll } from '~/api/twitter'
import { processTwitterText } from '~/utils'
const trackerStore = useTwitterTrackerStore()
const { t } = useI18n()
const botStore = useBotStore()

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

const tooltipRefs = ref({})
const contentEl = ref(null)
const measureEl = ref(null)
const contentExpanded = ref(false)
const isContentOverflow = ref(false)

// 处理后的内容，包含可点击的链接
const processedContent = computed(() => {
    return processTwitterText(props.item?.content || '')
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
})

watch(() => props.item?.content, () => {
    checkContentOverflow()
}, { immediate: true })

const clickAvatar = (twitter_url) => {
    window.open(twitter_url)
}

const _followKol = async (author_id, index) => {
    try {
        if (!botStore.accessToken) {
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

const clickVideo = (url) => {
    window.open(url)
}

const handleTooltipShow = (mediaIndex) => {
    // Tooltip 显示时，等待图片加载完成后更新位置
    nextTick(() => {
        updateTooltipPosition(mediaIndex)
    })
}

const handleImageLoad = (mediaIndex) => {
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

// 处理内容点击事件，如果点击的不是链接，则打开推文
const handleContentClick = (e) => {
    const target = e.target
    // 如果点击的是链接，不阻止默认行为，让浏览器处理
    if (target.tagName === 'A') {
        return
    }
    // 如果点击的是内容区域但不是链接，打开推文
    clickContent(props.item.url)
}
</script>