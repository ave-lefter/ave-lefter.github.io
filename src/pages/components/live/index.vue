<template>
  <el-scrollbar
    ref="scrollbar"
    :height="scrollHeight"
    class="hidden-scrollbar px-15px"
    @scroll="onScroll"
  >
    <div class="pumplive" v-if="pumpLiveList?.length > 0">
      <!-- <div class="contain"> -->
      <div
        class="item rounded-8px cursor-pointer"
        v-for="(item, $index) in pumpLiveList"
        :key="$index"
        @click="jump(item)"
      >
        <div class="relative w-full pump-live-bg clickable flex items-center justify-center">
          <el-image
            v-if="item?.thumbnail"
            fit="contain"
            class="w-100% h-168px rounded-8px bg-[--main-input-button-bg] border border-solid-1px border-[--main-input-button-bg]"
            :src="item.thumbnail"
            alt=""
            srcset=""
          />
          <img
            v-else
            class="rounded-8px bg-[--main-input-button-bg] border border-solid-1px border-[--main-input-button-bg]"
            src="~/assets/images/pump.png"
            width="100%"
            height="100"
            alt=""
            srcset=""
          />
          <span
            v-if="item.is_currently_live"
            class="bg-[--pump-green] color-#000 rounded-4px py-2px px-8px text-14px font-500 absolute bottom-8px left-8px"
            >LIVE</span
          >
          <!-- <a
              :href="item.detail_url"
              target="_blank"
              class="w-100% h-168px icon-live flex items-center justify-center absolute inset-0 bg-#000000 bg-opacity-30"
            >
              <Icon name="ri:video-on-line" class="text-30px color-#55D592" />
            </a> -->
        </div>
        <div class="flex-between mt-12px">
          <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
            <template #default>
              <el-image
                fit="cover"
                class="rd-50% w-24px h-24px"
                :src="getSymbolDefaultIcon(item)"
                alt=""
                srcset=""
              >
                <template #placeholder>
                  <img :src="getChainDefaultIcon(item.chain, item.symbol)" class="token-icon w-24px text-16px color-#fff"/>
                </template>
                <template #error>
                  <img :src="getChainDefaultIcon(item.chain, item.symbol)" class="token-icon w-24px text-16px color-#fff"/>
                </template>
              </el-image>
            </template>
            <template #content>
              <el-image
                fit="cover"
                class="rd-8px w-240px h-240px"
                :src="getSymbolDefaultIcon(item)"
                alt=""
                srcset=""
              >
                <template #placeholder>
                  <img :src="getChainDefaultIcon(item.chain, item.symbol)" class="token-icon w-228px text-16px color-#fff"/>
                </template>
                <template #error>
                  <img :src="getChainDefaultIcon(item.chain, item.symbol)" class="token-icon w-228px text-16px color-#fff" />
                </template>
              </el-image>
            </template>
          </el-tooltip>
          <span class="ml-6px text-14px font-500 color-[--main-text]">{{ item.symbol }}</span>
          <span class="flex-1"></span>
          <div class="text-12px color-[--third-text]">
            <span class="color">MC</span>
            <span class="color-[--pump-green] ml-5px"
              >${{ formatNumber(item.usd_market_cap || 0, 2) }}</span
            >
          </div>
        </div>

        <div
          class="color-[--third-text] text-12px mt-15px break-words desc"
          style="line-height: 1.4"
        >
          {{ item.description }}
        </div>
        <div class="color-[--third-text] text-12px mt-15px flex-start">
          <Icon class="mr-5px text-16px" name="custom:reply" />
          {{ formatNumber(item.reply_count || 0, 0) }}
          <Icon class="ml-16px mr-5px text-16px" name="custom:time-line" />
          {{ dayjs(item.created_timestamp).locale('en').fromNow() }}
        </div>
        <div class="flex-between mt-12px items-center">
          <a
            class="mr-10px hover:opacity-70 leading-16px"
            :href="item.detail_url"
            target="_blank"
            @click.stop
          >
            <Icon class="color-[--pump-green] text-16px" name="custom:link" />
          </a>
          <div v-if="item?.medias?.length > 0" class="flex items-center gap-10px color-[--third-text]">
            <template v-for="(i, index) in item?.medias" :key="index">
              <XPopup
                v-if="i.icon === 'twitter'"
                :tokenId="(item.token + '-' + item.chain) as string"
                :type="item.twitter_type as 1 | 2 | 3 | undefined"
              >
                <a class="flex items-center" :href="i.url" target="_blank" @click.stop>
                  <XIcon
                    v-if="[1, 2, 3].includes(item.twitter_type)"
                    :type="item.twitter_type as 1 | 2 | 3 | undefined"
                  />
                  <Icon v-else :name="`custom:${i.icon}`" />
                </a>
              </XPopup>
              <div v-else-if="i.url" v-tooltip="i.url">
                <a class="flex items-center" :href="i.url" target="_blank" @click.stop>
                  <Icon :name="`custom:${i.icon}`" />
                </a>
              </div>
            </template>
          </div>

          <span class="flex-1"></span>
          <QuickSwap
            v-if="globalStore?.rankCommon?.quickVisible"
            :quickBuyValue="globalStore?.rankCommon?.quickBuyValue"
            :row="item"
          />
        </div>
      </div>
      <!-- </div> -->
    </div>
    <ave-empty
      v-if="(!pumpLiveList || pumpLiveList?.length === 0) && !loadingPumpList"
      class="mt-200px"
    />
    <template v-else>
      <div v-if="loadingPumpList" class="text-center py-4 text-12px color-[--third-text]">
        {{ $t('loading') }}
      </div>
      <div v-else-if="noMore" class="text-center py-4 text-12px color-[--third-text]">
        {{ $t('noMore') }}
      </div>
    </template>
  </el-scrollbar>
</template>

<script setup lang="ts">
import XIcon from '~/components/xPopup/xIcon.vue'
import { type pumpLiveObj, getPumpLiveList } from '@/api/pumpLive'
import { useWindowSize, useThrottleFn } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { formatNumber } from '@/utils/formatNumber'
const { t } = useI18n()
const pumpLiveList = ref<pumpLiveObj[]>([])
const quickBuyValue = shallowRef('0.01')
const loadingPumpList = shallowRef(false)
const noMore = ref(false)
const { height } = useWindowSize()
const globalStore = useGlobalStore()
const page_no = shallowRef(1)
const page_size = shallowRef(20)
const scrollbar = useTemplateRef('scrollbar')
const activeChain = useStorage('rankChain', 'AllChains')
const router = useRouter()
const scrollHeight = computed(() => {
  return 990
})
watch(
  () => globalStore.pumpLiveSort,
  () => {
    page_no.value = 1
    pumpLiveList.value = []
    _getPumpLiveList()
  },
  { deep: true }
)
onActivated(() => {
  page_no.value = 1
  pumpLiveList.value = []
  _getPumpLiveList()
})
function _getPumpLiveList() {
  if (loadingPumpList.value || noMore.value) return
  loadingPumpList.value = true
  const params = {
    chain: activeChain.value == 'AllChains' ? '' : activeChain.value,
    category: 'pumplive',
    page_no: page_no.value,
    page_size: page_size.value,
    sort: globalStore.pumpLiveSort.sort,
    sort_dir: globalStore.pumpLiveSort.sort_dir,
  }
  getPumpLiveList(params)
    .then((res) => {
      const list = Array.isArray(res) ? res?.map((i) => ({ ...i, medias: getMedias(i) })) : []
      if (list.length > 0) {
        page_no.value++
        pumpLiveList.value = pumpLiveList.value?.concat(list)
      }
      if (list.length < page_size.value) {
        noMore.value = true
      }
    })
    .catch((err) => {
      pumpLiveList.value = []
    })
    .finally(() => {
      loadingPumpList.value = false
    })
}
function getMedias(obj: { website: string; btok: string; telegram: string; twitter: string }) {
  const arr = []
  if (obj?.twitter)
    arr.push({
      name: 'Twitter',
      icon: 'twitter',
      url: formatUrl(obj.twitter),
    })
  if (obj?.website)
    arr.push({
      name: t('website'),
      icon: 'web',
      url: formatUrl(obj.website),
    })
  if (obj?.btok) arr.push({ name: 'Btok', icon: 'btok', url: formatUrl(obj.btok) })
  // if (obj?.qq) arr.push({ name: 'QQ', icon: 'qq', url: obj.qq })
  if (obj?.telegram) arr.push({ name: 'Telegram', icon: 'tg', url: formatUrl(obj.telegram) })
  return arr
}
const onScroll = useThrottleFn(
  ({ scrollTop }: { scrollTop: number }) => {
    const wrap = scrollbar.value?.wrapRef
    if (!wrap || loadingPumpList.value || noMore.value) return
    const reachedBottom = wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 2
    if (reachedBottom) {
      _getPumpLiveList()
    }
  },
  1000,
  true,
  false
)
function jump(row: pumpLiveObj) {
  const routeData = router.resolve({
    name: 'token-id',
    params: { id: row.token + '-' + row.chain },
  })
  window.open(routeData.href, '_blank')
}
</script>
<style lang="scss" scoped>
.pumplive {
  padding: 16px;
  background: var(--secondary-bg);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  justify-items: center;
  align-items: center;
  grid-gap: 10px;
  overflow: hidden;
  width: 100%;
  overflow: hidden;
  // .contain {
  // column-count: 6;
  // column-gap: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .item {
    position: relative;
    z-index: 2;
    max-width: 100%;
    box-sizing: border-box;
    // border: 1px solid #55d592;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    margin-bottom: 16px;
    overflow: hidden;
    height: 326px;
    width: 300px;
    transition: transform 0.15s ease;
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    // border: 1px solid var(--border);
    &:hover {
      transform: scale(1.06);
    }
    .desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 显示 2 行 */
      overflow: hidden;
      width: 100%;
      height: 34px;
      overflow: hidden;
    }
  }
  // }
}
</style>
