<template>
  <div class="pop-right color-[--main-text]">
    <div class="content" style="overflow-x: hidden; overflow-y: auto">
      <div class="right-container run">
        <div class="relative">
          <div v-if="tableList.length > 0" class="top" >
            <span class="flex-start">{{ $t('tokenMethod') }}</span>
            <span>迁移</span>
            <span>{{ $t('runPullTime') }}</span>
            <div class="flex items-center justify-end">
              <span>{{ $t('time') }}</span>
            </div>
          </div>
          <el-scrollbar class="list">
            <ul
              v-if="tableList.length > 0"
              v-infinite-scroll="getRugPullList"
              :infinite-scroll-disabled="loadingRun || finished"
              :infinite-scroll-distance="500"
              :infinite-scroll-delay="10"
              :infinite-scroll-immediate="true"
              class="content"
            >
              <li
                v-for="(row, $index) in tableList"
                :key="$index"
                class="flex"
                @click.stop="tableRowClick(row)"
              >
                <div
                  class="token-info table-item_d"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  @click.stop.prevent="tableRowClick(row)"
                >
                  <div class="icon-token-container" style="margin-right: 10px">
                    <el-image
                      class="token-icon w-24px h-24px rounded-100%"
                      :src="getSymbolDefaultIcon(row)"
                    >
                      <template #error>
                        <div
                          class="token-icon"
                          style="line-height: 24px; text-align: center; font-size: 16px; color: #fff"
                          :style="{
                            background: getChainDefaultIconColor(row?.Chain),
                          }"
                        >
                          {{ row.Symbol?.slice(0, 1)?.toUpperCase?.() || '' }}
                        </div>
                      </template>
                      <template #placeholder>
                        <div
                          class="token-icon"
                          style="line-height: 24px; text-align: center; font-size: 16px; color: #fff"
                          :style="{
                            background: getChainDefaultIconColor(row?.Chain),
                          }"
                        >
                          {{ row.symbol?.slice(0, 1)?.toUpperCase?.() || '' }}
                        </div>
                      </template>
                    </el-image>
                    <img
                      v-if="row?.network || row?.Chain"
                      class="icon-svg icon-symbol"
                      :src="`${token_logo_url}chain/${row.Chain}.png`"
                      :width="10"
                      alt=""
                      onerror="this.src='/icon-default.png'"
                      srcset=""
                    />
                  </div>
                  <div @click.stop>
                    <div class="flex-start">
                      <span class="token-symbol ellipsis color-[--main-text]">
                        {{ row.Symbol }}
                      </span>
                      <Icon
                        v-copy="row.Token"
                        name="bxs:copy"
                        class="text-12px ml-2px cursor-pointer color-[--third-text]"
                        @click.stop.prevent
                      />
                      <a
                        class="media-item ml-2px text-10px"
                        :href="`https://x.com/search?q=($${row.Symbol} OR ${row.token})&src=typed_query&f=live`"
                        target="_blank"
                      >
                        <i class="iconfont icon-search text-10px" />
                      </a>
                      <div
                        v-if="row?.medias?.length > 0"
                        class="media-list flex-start text-12px"
                        @click.stop
                      >
                        <template v-for="(item, index) in row?.medias" :key="index">
                          <div v-if="item.url" v-tooltip="item.url" class="ml-2px">
                            <span v-if="item.name === 'QQ'" class="media-item">
                              <!-- <i class="iconfont icon-QQ text-12px"></i> -->
                              <Icon
                                :name="`custom:${item.icon}`"
                                class="text-[--third-text] h-12px w-12px"
                              />
                            </span>

                            <a v-else class="media-item text-12px" :href="item.url" target="_blank">
                              <!-- <i
                                  class="iconfont text-12px"
                                  :class="`icon-${item.icon}`"
                                ></i> -->
                              <Icon
                                :name="`custom:${item.icon}`"
                                class="text-[--third-text] h-12px w-12px"
                              />
                            </a>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="font-1 mt-2px flex-start" style="min-width: 110%">
                      <span
                        class="mini font-10"
                        :style="{ color: filterType(row.RunAwayType).color }"
                      >
                        {{ filterType(row.RunAwayType).text }}
                      </span>
                    </div>
                  </div>
                </div>
                <span>
                  <Icon v-if="1" name="material-symbols:check-circle-outline" class="text-[14px] text-[--signal-green]" />
                  <Icon v-if="0" name="material-symbols:x-circle-outline" class="text-[14px] text-[--signal-red]" />
                </span>
                <!-- //跑路时长 -->
                <span>
                  {{
                    row.DevRunAwayTime - row.PublishAt > 0
                      ? formatTime(row.DevRunAwayTime - row.PublishAt)
                      : '--'
                  }}
                </span>

                <span>
                  {{
                    dayjs(row?.PublishAt * 1000).fromNow()
                  }}
                </span>
                <div class="flex-end">
                  <a class="a-gray" href="" @click.stop.prevent="goLink(row)">
                    <i class="iconfont icon-a-sol-dark" />
                  </a>
                </div>
              </li>
            </ul>
          </el-scrollbar>
          <div class="text-12px loadingMore width100 text-center color-[--third-text]">
            <span v-if="loadingRun && pageNO > 1">{{ $t('loading') }}</span>
            <span v-if="showFinished && pageNO > 1 && tableList?.length > pageSize">{{
              $t('noMore')
            }}</span>
          </div>
          <el-empty
            v-if="(!tableList || tableList?.length === 0) && !loadingRun"
            :image-size="100"
            :image="themeStore.theme === 'light' ? emptyWhite : emptyDark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
import { _getDevList, type MediaAppendix } from '@/api/run'
import {
  isJSON,
  formatTime,
} from '@/utils/index'
// import { formatNumber } from '@/utils/formatNumber'
import dayjs from 'dayjs'
const { token_logo_url } = useConfigStore()

// const tokenStore = useTokenStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const tableList = ref<any[]>([{}])
const pageNO = ref(1)
const pageSize = ref(5)
const loadingRun = ref(false)
const finished = ref(false)
const showFinished = ref(false)
let finishedTimer: NodeJS.Timeout | null = null

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

watch(
  () => route.params.id,
  (val: any) => {
    if (val) {
      tableList.value = []
      pageNO.value = 1
      pageSize.value = 5
      loadingRun.value = false
      finished.value = false
      showFinished.value = false
      if (finishedTimer) clearTimeout(finishedTimer)
      getRugPullList()
    }
  }
)

function filterType(type: string) {
  const obj: Record<string, any> = {
    shitcoin: {
      text: t('shitcoin'),
      color: '#F6465D',
    },
    unknown: {
      text: t('unKnown'),
      color: '#F6465D',
    },
  }
  return obj[type] || ''
}

function goLink(item: any) {
  window.open((router as any).formatExplorerUrl(item.chain, item.token))
}

function tableRowClick(item: any) {
  router.push({ name: 'Token', params: { id: `${item.Token}-${item.chain}` } })
}

function formatUrl(url: string) {
  if (!url) {
    return ''
  }
  // if (/^http(s?):\/\//.test(url)) {
  //   return url
  // }
  if (url?.includes('://')) {
    return url
  }
  return 'https://' + url
}
function getMedias(appendix: string) {
  if (!appendix) return []
  let obj: MediaAppendix = {}
  if (typeof appendix === 'string' && isJSON(appendix)) {
    obj = JSON.parse(appendix)
  } else if (typeof appendix === 'object') {
    obj = appendix
  }
  const arr = []
  if (obj?.website)
    arr.push({
      name: t('website'),
      icon: 'web',
      url: formatUrl(obj.website),
    })
  if (obj?.btok) arr.push({ name: 'Btok', icon: 'btok', url: formatUrl(obj.btok) })
  if (obj?.qq) arr.push({ name: 'QQ', icon: 'qq', url: obj.qq })
  if (obj?.telegram) arr.push({ name: 'Telegram', icon: 'tg', url: formatUrl(obj.telegram) })
  if (obj?.twitter)
    arr.push({
      name: 'Twitter',
      icon: 'twitter',
      url: formatUrl(obj.twitter),
    })
  return arr
}
async function getRugPullList() {
  if (loadingRun.value) return
  loadingRun.value = true
  try {
    const data = {
      token_id: id.value,
      pageNO: pageNO.value,
      pageSize: pageSize.value,
    }
    const res = await _getDevList(data)
    if (pageNO.value === 1) tableList.value = []

    const list =
      res?.dev_stats?.map((i: any) => ({
        ...i,
        chain: i.Chain,
        symbol: i.Symbol,
        token: i.Token,
        logo_url: i.LogoURL || '',
        medias: getMedias(i.Appendix),
        DevRunAwayTime:
          i?.DevRunAwayTime !== '1970-01-01T00:00:00Z' &&
          i?.DevRunAwayTime !== '0001-01-01T00:00:00Z'
            ? new Date(i.DevRunAwayTime).getTime() / 1000
            : 0,
        PublishAt:
          i?.PublishAt !== '1970-01-01T00:00:00Z' && i?.PublishAt !== '0001-01-01T00:00:00Z'
            ? new Date(i.PublishAt).getTime() / 1000
            : 0,
      })) || []

    tableList.value.push(...list)
    if (list.length < pageSize.value) {
      finished.value = true
      showFinished.value = true
      // 3秒后自动隐藏
      if (finishedTimer) clearTimeout(finishedTimer)
      finishedTimer = setTimeout(() => {
        showFinished.value = false
      }, 3000)
    } else {
      pageNO.value++
    }
  } catch (err) {
    console.error(err)
    finished.value = true
  } finally {
    loadingRun.value = false
  }
}
</script>
<style lang="scss" scoped>
.run {
  .loadingMore{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .top {
    // background: var(--custom-table-th-bg-color);
    color: var(--third-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0px 0px;
    font-size: 12px;
    > :nth-child(n) {
      padding: 0 0px;
      &:first-child {
        padding-left: 0;
        // align-items: flex-start;
      }
      &:last-child {
        padding-right: 0;
      }
    }
    > :nth-child(1) {
      flex: 1.5;
      white-space: nowrap;
    }
    > :nth-child(2) {
      flex: 1;
      text-align: right;
      white-space: nowrap;
    }
    > :nth-child(3) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(4) {
      flex: 1;
      text-align: right;
    }
  }
  .list {
    height: calc(100vh - 815px);
    overflow: auto;
  }
  // color: var(--custom-font-1-color);
  font-family: PingFang SC;
  .content {
    color: var(--secondary-text);
    // font-weight: 400;
    font-size: 11px;
    > .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      > :nth-child(n) {
        // display: flex;
        // flex-direction: column;
        // align-items: flex-end;
        // justify-content: center;
        // color: var(--custom-text-2-color);
        padding: 12px 0px;
        &:last-child {
          padding-right: 0px;
        }
      }
      > :nth-child(1) {
        flex: 1.5;
      }
      > :nth-child(2) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(3) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(4) {
        flex: 1;
        text-align: right;
      }
      &:hover {
        background-color: var(--custom-table-hover-bg-color);
      }
    }
    .unit {
      margin-left: 5px;
      color: var(--custom-text-2-1-color);
    }
  }
  .text-underline {
    text-decoration: underline;
  }
}
.token-info {
  display: flex;
  .icon-token-container {
    position: relative;
    margin-right: 4px;
    .icon-symbol {
      position: absolute;
      left: 15px;
      top: 15px;
    }
  }
}
.pop-right {
  .right-container {
    padding-top: 0;
    border-radius: 0;
    // background: var(--d-222-l-FFF);
    min-height: auto;
    // overflow-y: scroll;
    // overflow-x: hidden;
  }
}
.ellipsis {
  max-width: 60px;
}
.sticky {
  position: sticky;
  top: 0px;
  padding-top: 20px;
  background: var(--dialog-bg);
  z-index: 2;
}
.run-progress-bar {
  :deep() .el-progress-bar__outer {
    --el-border-color-lighter: var(--dialog-divider);
  }
}
</style>
