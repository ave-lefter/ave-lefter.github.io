<template>
  <el-drawer
    v-model="visible"
    append-to-body
    :with-header="false"
    :size="430"
    class="draw-right"
  >
    <div class="pop-right bg-[--d-222-l-FFF] h-100vh px-20px">
      <div
        class="content"
        style="max-width: 450px; overflow-x: hidden;overflow-y: auto;height: 100vh;"
      >
        <div class="right-container run">
          <div class="sticky">
            <div class="flex items-center justify-between">
              <span class="text-16px font-500">{{
                $t('flag_rug_pull')
              }}</span>
              <a href="" class="color-#999 text-20px" @click.stop.prevent="$emit('update:modelValue', false)">
                <!-- <i class="iconfont icon-_28-Arrows1 font-20px"></i> -->
                <Icon
                  class=" text-20px ml-5px"
                  name="custom:back"
                  color="#999"
                />
              </a>
            </div>
            <div v-if="rugPull?.all_tag_rate > 0" class="mt-20px flex items-center justify-between">
              <span class="text-14px font-500">
                {{ $t('abnormalChips') }}：{{
                  formatNumber(rugPull?.all_tag_rate || 0, 1)
                }}%
              </span>
              <el-tooltip  placement="top">
                <template #content>{{ $t('abnormalChipsTip') }}</template>
                <Icon
                  class=" text-14px ml-5px"
                  name="mi:circle-warning"
                  color="#959a9f"
                />
              </el-tooltip>
            </div>
            <el-row v-if="rugPull?.all_tag_rate > 0" :gutter="10">
              <el-col
                v-for="(item, $index) in rugPull?.rateList"
                :key="$index"
                :span="12"
                class="mt-10px"
              >
                <div class="item flex-start flex items-center justify-start">
                  <span
                    class="flex-start color-#999 text-12px"
                    style="width: 66px"
                  >
                    <img
                      style="width: 12px; margin-right: 2px"
                      :src="formatNewTags(item.icon)"
                      alt=""
                    >
                    {{
                      item?.title?.[
                        firstCharacterToupperCase(
                          language
                            ?.replace?.('zh-cn', 'Cn')
                            ?.replace?.('zh-tw', 'Tw')
                        )
                      ] || item?.En
                    }}:
                  </span>
                  <div class="flex-end flex items-center justify-end">
                    <el-progress
                      class="run-progress-bar ml-5px"
                      :percentage="item.rate || 0"
                      :stroke-width="4"
                      color="#F6465D"
                      :show-text="false"
                      style="width: 20px"
                    />
                    <span class="ml-5px text-12px">
                      {{ formatNumber(item.rate || 0, 1) }}%
                    </span>
                  </div>
                </div>
              </el-col>
            </el-row>

            <div class="mt-30px flex-between  flex items-center justify-between" style="padding-bottom: 10px">
              <span class="text-16px font-500">
                {{ $t('runPullHistory') }}：<template
                  v-if="rugPull?.rates?.total"
                >
                  <span
                    class="text-12px"
                    :style="!ruggedColor ? {} : { color: ruggedColor }"
                    >{{
                      formatNumber(rugPull?.rates?.rugged || 0, 0)
                    }}</span
                  ><span class="text-12px"
                    >/{{
                      formatNumber(rugPull?.rates?.total || 0, 0)
                    }}</span
                  >
                </template>
              </span>
              <div v-if="rugPull?.dev" class="flex-end">
                <span class="color-#999 text-12px">{{ $t('devAddress') }}：</span>
                <NuxtLink :to="`/address/${rugPull?.dev}/${chain}`" class="color-#999 text-12px underline">
                  {{ rugPull?.dev?.slice(0, 4) + '...' + rugPull?.dev?.slice(-4) }}
                </NuxtLink>
                <Icon v-copy="rugPull?.dev" name="bxs:copy" class="text-12px ml-2px cursor-pointer color-#999" @click.stop.prevent/>
              </div>
            </div>
            <div class="top">
              <span class="flex-start">{{ $t('tokenMethod') }}</span>
              <span>{{ $t('runPullTime') }}</span>
              <div class="flex items-center justify-end">
                <span>{{ $t('time') }}</span>
                <!-- <i
                  v-show="isShowDate"
                  class="iconfont icon-riqi clickable text-12px ml-3px"
                  @click.stop="isShowDate = false"
                ></i>
                <i
                  v-show="!isShowDate"
                  class="iconfont icon-countdown clickable text-12px ml-3px"
                  @click.stop="isShowDate = true"
                ></i> -->
                <Icon
                  :name="`${isShowDate?'custom:calendar':'custom:countdown'}`"
                  class="color-[--d-666-l-999] cursor-pointer ml-2px"
                  @click.self="isShowDate=!isShowDate"
                />
              </div>
              <span/>
            </div>
          </div>
          <div class="relative">
            <ul
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
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
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
                          style="
                            line-height: 24px;
                            text-align: center;
                            font-size: 16px;
                            color: #fff;
                          "
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
                          style="
                            line-height: 24px;
                            text-align: center;
                            font-size: 16px;
                            color: #fff;
                          "
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
                    >
                  </div>
                  <div @click.stop>
                    <div class="flex-start">
                      <span class="token-symbol ellipsis color-[--main-text]">
                        {{ row.Symbol }}
                      </span>
                      <!-- <i
                        class="iconfont icon-copy font_12 ml-2"
                        @click.stop.prevent
                        v-copy="row.Token"
                      ></i> -->
                      <Icon v-copy="row.Token" name="bxs:copy" class="text-12px ml-2px cursor-pointer" @click.stop.prevent/>
                      <a
                        class="media-item ml-2 font_10"
                        :href="`https://x.com/search?q=($${row.Symbol} OR ${row.token})&src=typed_query&f=live`"
                        target="_blank"
                      >
                        <i class="iconfont icon-search font_10"/>
                      </a>
                      <div
                        v-if="row?.medias?.length > 0"
                        class="media-list flex-start text-12px"
                        @click.stop
                      >
                        <template
                          v-for="(item, index) in row?.medias"
                          :key="index"
                        >
                          <div
                            v-if="item.url"
                            v-tooltip="item.url"
                            class="ml-2px"
                          >
                            <span v-if="item.name === 'QQ'" class="media-item">
                              <!-- <i class="iconfont icon-QQ text-12px"></i> -->
                              <Icon
                                :name="`custom:${item.icon}`"
                                class="text-[--d-666-l-999] h-12px w-12px"
                              />
                            </span>

                            <a
                              v-else
                              class="media-item text-12px"
                              :href="item.url"
                              target="_blank"
                            >
                              <!-- <i
                                class="iconfont text-12px"
                                :class="`icon-${item.icon}`"
                              ></i> -->
                              <Icon
                                :name="`custom:${item.icon}`"
                                class="text-[--d-666-l-999] h-12px w-12px"
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
                  {{
                    row.DevRunAwayTime - row.PublishAt > 0
                      ? formatTime(row.DevRunAwayTime - row.PublishAt)
                      : '--'
                  }}
                </span>

                <span >
                  {{
                    isShowDate
                      ? formatDate(row.PublishAt, 'YYYY-MM-DD HH:mm:ss')
                      : dayjs(row?.PublishAt * 1000).fromNow()
                  }}
                </span>
                <div class="flex-end">
                  <a
                    class="a-gray font-16"
                    href=""
                    @click.stop.prevent="goLink(row)"
                  >
                    <i class="iconfont icon-a-sol-dark font-16"/>
                  </a>
                </div>
              </li>
            </ul>
            <div
              class="text-12px tc width100 text-center"
              :style="{
                color: themeStore.theme === 'light' ? '#666' : '#999',
              }"
            >
              <span v-if="loadingRun && pageNO > 1">{{ $t('loading') }}</span>
              <span
                v-if="finished && pageNO > 1 && tableList?.length > pageSize"
                >{{ $t('noMore') }}</span
              >
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
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
// import { CountDown } from 'vant'
import BigNumber from 'bignumber.js'
import { _getRugPullList , type MediaAppendix} from '@/api/run'
import { isJSON, getAddressAndChainFromId, formatNewTags ,formatDate,formatTime } from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'
import dayjs from 'dayjs'
const {token_logo_url} = useConfigStore()
const tokenDetailStore = useTokenDetailsStore()
const props = defineProps({
  modelValue: Boolean,
  obj: {
    type: Object,
    default: () => {},
  },
})

const $emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    $emit('update:modelValue', value)
  },
})

const themeStore = useThemeStore()
const { t } = useI18n()
const isShowDate = ref(false)
const tableList = ref<any[]>([])
const pageNO = ref(1)
const pageSize = ref(20)
const loadingRun = ref(false)
const finished = ref(false)

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)


const localeStore = useLocaleStore()
const language = computed(() => {
  console.log('---localeStore?.locale------', localeStore?.locale)
  return localeStore?.locale
})

const chain = computed(() => {
  return getAddressAndChainFromId(route.params.id as string)?.chain || ''
})
const rugPull = computed(() => {
  return props.obj
})
const ruggedColor = computed(() => {
  const data = rugPull.value?.rates?.total
  if (typeof data === 'string' || typeof data === 'number') {
    const value = new BigNumber(data)
    if (value.lte(2) && value.gt(0)) {
      return false
    } else if (value.lte(10) && value.gt(2)) {
      return '#FFA622'
    } else if (value.gt(10)) {
      return '#F6465D'
    }
  }
  return false
})

watch(
  () => route.params.id,
  (val) => {
    if (val) {
      tableList.value = []
      pageNO.value = 1
      pageSize.value = 20
      loadingRun.value = false
      finished.value = false
    }
  }
)

function firstCharacterToupperCase(str: string): string {
  return str.replace(/^\S/, (match) => match.toUpperCase())
}

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

function jumpBalance() {
  const targetRoute = router.resolve({
    name: 'Balance',
    params: { chain: chain.value, userAddress: rugPull.value?.dev },
    query: { from: route.name as string },
  })
  window.open(targetRoute.href, '_blank')
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
  let obj :MediaAppendix= {}
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
  if (obj?.btok)
    arr.push({ name: 'Btok', icon: 'btok', url: formatUrl(obj.btok) })
  if (obj?.qq) arr.push({ name: 'QQ', icon: 'qq', url: obj.qq })
  if (obj?.telegram)
    arr.push({ name: 'Telegram', icon: 'tg', url: formatUrl(obj.telegram) })
  if (obj?.twitter)
    arr.push({
      name: 'Twitter',
      icon: 'twitter',
      url: formatUrl(obj.twitter),
    })
  return arr
}
async function getRugPullList() {
  if(!visible.value) return
  if (loadingRun.value) return
  loadingRun.value = true
  try {
    const data = {
      token_id: id.value,
      pageNO: pageNO.value,
      pageSize: pageSize.value,
    }
    const res = await _getRugPullList(data)
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
          i?.PublishAt !== '1970-01-01T00:00:00Z' &&
          i?.PublishAt !== '0001-01-01T00:00:00Z'
            ? new Date(i.PublishAt).getTime() / 1000
            : 0,
      })) || []

    tableList.value.push(...list)
    if (list.length < pageSize.value) {
      finished.value = true
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

onMounted(() => {
  getRugPullList()
})
</script>
<style lang="scss" scoped>
.run {
  color: var(--custom-font-1-color);
  font-family: PingFang SC;
  .top {
    // background: var(--custom-table-th-bg-color);
    color: var(--d-666-l-999);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0px 8px;
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
      flex: 2.5;
      white-space: nowrap;
    }
    > :nth-child(2) {
      flex: 1;
      text-align: right;
      white-space: nowrap;
    }
    > :nth-child(3) {
      flex: 1.5;
      text-align: right;
    }
    > :nth-child(4) {
      width: 20px;
      text-align: right;
    }
  }
  .content {
    padding-bottom: 10px;
    color: #959a9f;
    // font-weight: 400;
    font-size: 11px;
    > .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > :nth-child(n) {
        // display: flex;
        // flex-direction: column;
        // align-items: flex-end;
        // justify-content: center;
        // color: var(--custom-text-2-color);
        padding: 12px 0px;
        &:first-child {
          // align-items: flex-start;
        }
        &:last-child {
          padding-right: 0px;
        }
      }
      > :nth-child(1) {
        flex: 2.5;
      }
      > :nth-child(2) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(3) {
        flex: 1.5;
        text-align: right;
      }
      > :nth-child(4) {
        width: 20px;
        text-align: right;
      }
      cursor: pointer;
      &:hover {
        background-color: var(--custom-table-hover-bg-color);
      }
    }
    .green {
      color: #12b886;
    }
    .red {
      color: #ff646d;
    }
    .color-add {
      color: #65c4ed;
    }
    .color-remove {
      color: #ef6de2;
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
.icon-copy {
  color: var(--custom-text-2-color);
}
.pop-right {
  background: var(--d-222-l-FFF);
  .right-container {
    padding-top: 0;
    border-radius: 0;
    background: var(--d-222-l-FFF);;
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
  background: var(--d-222-l-FFF);
  z-index: 2;
}
</style>
