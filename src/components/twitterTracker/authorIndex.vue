<template>
    <div class="w-full h-full bg-[--secondary-bg] p-12px"
        :class="{ 'pr-16px': trackerStore.isLeftFixed, 'pl-16px': trackerStore.isRightFixed }">
        <Icon name="custom:drag2"
            class="absolute top-4px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle" />
        <div class="flex items-center pb-14px border-b-1px border-b-solid border-b-[--border] mb-12px">
            <div class="flex justify-between items-center gap-16px mb-16px">
                <Icon name="material-symbols:arrow-back-ios-new-rounded" class="cursor-pointer"
                    @click="twitter_author_id = ''" />{{ t('home') }}
            </div>
            <div class="flex-1 drag-handle h-20px" />
            <div class="flex items-center gap-12px">
                <Icon name="custom:close" class="text-14px shrink-0 cursor-pointer color-[--main-text]"
                    @click="trackerStore.visible = false" />
            </div>
        </div>
        <div>
            <div class="flex justify-between items-center">
                <div class="min-w-0 flex-1 flex items-center gap-7px">
                    <UserAvatar icon-size="48px" class="cursor-pointer"
                        :wallet_logo="{ logo: profile.profile_pic, name: profile.name }" />
                    <div class="flex-1 min-w-0">
                        <div class="gap-8px flex items-center min-w-0">
                            <span v-tooltip="profile.name"
                                class="color-[--main-text] text-16px lh-20px min-w-0 max-w-[calc(100%-80px)] truncate cursor-pointer"
                                @click="clickAvatar(profile.author_id)">{{
                                    profile.name
                                }}</span>
                            <img v-if="profile.verified" :width="12" src="@/assets/images/kol.svg" alt="">
                        </div>
                        <div class="text-12px color-[--secondary-text]">@{{ profile.username }}</div>
                    </div>
                </div>
                <div class="w-24px h-24px rounded-4px bg-[--main-list-hover] flex items-center justify-center cursor-pointer" @click="jumpToTwitter(profile.twitter_url)">
                    <Icon name="custom:twitter" />
                </div>
            </div>
        </div>
        <div class="my-16px h-1px bg-[--dialog]" />
        <div ref="parent" class="overflow-y-auto" style="height:calc(100% - 120px)">
            <div :style="{
                height: `${totalSize}px`,
                width: '100%',
                position: 'relative'
            }">
                <div v-for="virtualRow in virtualItems" :key="String(virtualRow.key)" :style="{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`
                }">
                    <div :ref="(el) => virtualizer.measureElement(el)" :data-index="virtualRow.index"
                        class="border-b-1px border-b-solid border-b-[--border]">
                        <ListItem :item="getItem(virtualRow)" :index="virtualRow.index"
                            @measureElement="virtualizer.measureElement(el)" />
                        <div v-if="['2', '3', '4'].includes(getItem(virtualRow).type) && (getItem(virtualRow).retweeted_tweet || getItem(virtualRow).quoted_tweet || getItem(virtualRow).replied_tweet)"
                            class="border-1px border-solid border-[--dialog-divider] rounded-8px px-12px pt-16px ml-40px mb-16px">
                            <ListItem
                                :item="getItem(virtualRow).retweeted_tweet || getItem(virtualRow).quoted_tweet || getItem(virtualRow).replied_tweet"
                                :index="-1" @measureElement="virtualizer.measureElement(el)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup name="authorIndex">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { getKolProfile, getTwitterByAuthor } from '~/api/twitter'
import ListItem from './listItem.vue'

const { t } = useI18n()
const trackerStore = useTwitterTrackerStore()
const twitter_author_id = inject('twitter_author_id')
const profile = ref({})
const listStatus = ref({
    loading: false,
    finished: false,
    page_token: '',
})
const list = shallowRef([])
const parentRef = useTemplateRef('parent')
const virtualizer = useVirtualizer(
    computed(() => ({
        count: list.value.length,
        getScrollElement: () => parentRef.value,
        estimateSize: () => 200,
        overscan: 5,
        gap: 16
    }))
)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

const getItem = (virtualRow) => {
    return list.value[virtualRow.index] || {}
}
async function kolProfile() {
    const res = await getKolProfile(twitter_author_id.value)
    profile.value = res
}

kolProfile()

const getList = async () => {
    listStatus.value.loading = true
    try {
        const res = await getTwitterByAuthor(twitter_author_id.value,listStatus.value.page_token)
        listStatus.value.page_token = res.page_token || ''
        const newList = res.list || []
        listStatus.value.finished = res.page_token ? false : true
        if (listStatus.value.page_token || listStatus.value.finished) {
            list.value = [...list.value, ...newList]
        } else {
            list.value = newList
        }
        triggerRef(list)
    } catch (error) {
        console.error('Error fetching Twitter tracker list:', error)
    } finally {
        listStatus.value.loading = false
    }
}

getList()

const jumpToTwitter = url => window.open(url)
</script>