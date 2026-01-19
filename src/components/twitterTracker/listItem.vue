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
                            :key="`${item.created_at}`" :timestamp="item.created_at" :end-time="60" class="text-12px">
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
            <div v-show="!item.hide" class="text-14px lh-22px break-words">
                {{ item.content }}
            </div>
            <div v-for="(media, mediaIndex) in item.medias" :key="mediaIndex" class="relative">
                <img :src="media.media_url_https" alt="" class="max-w-full rounded-8px">
                <Icon v-if="media.type==='video'" name="custom:play-circle-line" class="absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 text-48px text-white cursor-pointer" @click="clickVideo(item.url)"/>
            </div>
            <div class="justify-between items-center flex">
                <div class="flex items-center gap-4px cursor-pointer text-12px color-[--secondary-text]">
                    <!-- <Icon name="custom:translation"/>{{ t('viewTranslation') }} -->
                </div>
                <span class="flex items-center gap-4px cursor-pointer color-[--primary-color] text-12px"
                    @click="item.hide = !item.hide">
                    <Icon name="custom:angle-down" :class="item.hide ? '' : 'rotate-180'" />
                    {{ item.hide ? t('Expand') : t('Collapse') }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup name="twitterTrackerListItem">
import { followKol, unfollowAll } from '~/api/twitter'
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
</script>