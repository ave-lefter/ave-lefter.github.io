<script setup lang="ts">
import type { Pair } from '~/api/types/token'
import XIcon from '~/components/xPopup/xIcon.vue'

const {t} = useI18n()
const themeStore = useThemeStore()
const loadingGroupEdit = ref(false)
const {token,pair,klineRow,twitterType,collected,editableGroup,currentGroup,selectedGroup,userFavoriteGroups,groupId,editableRemark,remark,remark2,tokenInfoExtra} = storeToRefs(useRankKlineStore())
const medias = computed(() => {
  return getMedias(token.value?.appendix,t)
})

function getTags(i: Pair) {
  type Signal = {
    tag: string
    color: string
    n: string
    timestamp: number
  }
  type Normal = {
    tag: string
    color: string
    showText?: boolean
  }
  let signal_arr: Array<Signal> = []
  let normal_tag: Array<Normal> = []
  let normal_str: Array<string> = []
  if (i?.dynamic_tag) {
    const tag_arr = JSON.parse(i?.dynamic_tag) || []
    const signal_str = tag_arr?.filter((i: string) => i?.startsWith('signal'))
    signal_arr = signal_str?.map((y: string) => ({
      tag:
        y?.split('-')[5] &&
        (y?.split('-')[1] == 'whale_sell' || y?.split('-')[1] == 'whale_buy')
          ? `${y?.split('-')[1]}_trump`
          : y?.split('-')[1],
      color: y?.split('-')[2],
      n: y?.split('-')[3],
      timestamp: y?.split('-')[4],
    }))
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    const kol_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^kol_.*$', 'gi').test(el.tag)
        ) == index
    )
    const dev_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^dev_.*$', 'gi').test(el.tag)
        ) == index
    )
    const smarter_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^smarter_.*$', 'gi').test(el?.tag)
        ) == index
    )
    const whale_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^whale_.*$', 'gi').test(el.tag)
        ) == index
    )
    const other_arr = signal_arr?.filter(
      (el) => !new RegExp('^dev_|kol_|smarter_|whale_.*$', 'gi').test(el.tag)
    )
    signal_arr = kol_arr
      ?.concat(dev_arr)
      ?.concat(smarter_arr)
      ?.concat(whale_arr)
      ?.concat(other_arr)
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    normal_str = tag_arr.filter((i: string) => !i?.startsWith('signal'))
  }
  // if (i?.tag) {
  //   const tag = i.tag?.split(',') || []
  //   const tag1 = tag.filter((i) => i !== 'pump' && i !== 'moonshot') || []
  //   normal_str = tag1.concat(normal_str)
  // }
  normal_tag =
    normal_str?.map((i) => ({
      tag: i,
      color: 'green',
      showText: false,
    })) || []
  const is_rug_pull =
    signal_arr?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag)) ||
    normal_tag?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag))
  const is_shit_coins =
    signal_arr?.some((i) => new RegExp('shitcoin', 'gi').test(i?.tag)) ||
    normal_tag?.some((i) => new RegExp('shitcoin', 'gi').test(i.tag))
  if ((i?.risk_score ?? 0) >= 100 && i?.chain == 'solana') {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_dangerous',
        color: 'red',
        showText: true,
      },
    ]
  } else if (is_rug_pull) {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_rug_pull',
        color: 'red',
        showText: true,
      },
    ]
  } else if (is_shit_coins) {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_shit_coins',
        color: 'red',
        showText: true,
      },
    ]
  }

  if (token?.value?.tag) {
    const tagti = token?.value?.tag?.split(',') || []
    const tag_t = tagti?.filter((i) => i !== '' && i !== 'newcommunity')
    const tag_t1: Array<Normal> = tag_t?.map((i) => ({
      tag: i,
      color: 'green',
      showText: false,
    }))
    normal_tag = tag_t1.concat(normal_tag)
  }
  const extra_tag = token?.value?.tag?.split(',') || []
  const newcommunity = extra_tag?.includes?.('newcommunity')
  // if(extra_tag?.length >0){
  //   extra_tag = extra_tag?.map(i => ({
  //     tag: i,
  //     color: 'green',
  //     showText: false
  //   }))
  //   if (normal_tag?.length > 0) {
  //     normal_tag = normal_tag?.concat(extra_tag)
  //   } else {
  //     normal_tag = extra_tag
  //   }
  // }
  if (token?.value?.cto_flag == 1 || newcommunity) {
    normal_tag.unshift({
      tag: 'cto_flag',
      color: 'green',
      showText: false,
    })
  }
  return {
    normal_tag,
    signal_arr,
  }
}

function handleReset() {
  if (editableGroup.value) {
    editableGroup.value = false
    selectedGroup.value = groupId.value
  }
  if (editableRemark.value) {
    editableRemark.value = false
    remark2.value = remark.value
  }
}
</script>

<template>
   <div class="flex items-center color-[--d-566275-l-8CA0C3] px-16px py-12px">
    <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
        <template #default>
          <TokenImg
            chain-class="w-20px h-20px"
            :token-class="`w-40px h-40px`"
            :row="{
              chain: token?.chain || 'solana',
              symbol: token?.symbol || '',
              logo_url: token?.logo_url||'',
            }"
          />
        </template>
        <template #content>
          <TokenImg
            chain-class="hidden"
            :token-class="`w-240px h-240px [&&]:mr-0 rounded-16px`"
            :row="{
              chain: token?.chain || 'solana',
              symbol: token?.symbol || '',
              logo_url: token?.logo_url||'',
            }"
          />
        </template>
      </el-tooltip>
      <div class="ml-8px">
        <div class="flex items-center">
          <span
            class="text-16px leading-[1.25] color-[--d-F5F5F5-l-333] font-500"
            >{{ token?.symbol }}</span
          >
          <span class="ml-8px text-12px font-500 mr-8px">{{
            token?.name
          }}</span>
          <div class="flex items-center justify-start">
            <img v-if="(token?.risk_level??0) < 0" class="bg-btn" src="@/assets/images/fengxian.png" :width="12">
            <div v-if="medias?.length > 0" class="flex text-20px">
              <div v-for="(item, index) in medias" :key="index">
                <template v-if="item.url">
                  <span
                    v-if="item.name === 'QQ'"
                    v-tooltip="item.url"
                    class="bg-btn"
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </span>
                  <XPopup v-else-if="item.icon === 'twitter'" :tokenId="klineRow.id" :type="twitterType">
                    <a
                      :href="item.url"
                      target="_blank"
                      class="bg-btn"
                      @click.stop
                    >
                      <XIcon
                        v-if="[1, 2, 3].includes(twitterType)"
                        :type="twitterType"
                        class="text-12px"
                      />
                      <Icon
                        v-else
                        :name="`custom:${item.icon}`"
                        class="text-[--d-666-l-999] text-12px"
                      />
                    </a>
                  </XPopup>

                  <a
                    v-else
                    v-tooltip="item.url"
                    :href="item.url"
                    target="_blank"
                    class="bg-btn"
                    @click.stop
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </a>
                </template>
              </div>
            </div>
            <a
              class="media-item bg-btn"
              :href="`https://x.com/search?q=($${token?.symbol} OR ${token?.token})&src=typed_query&f=live`"
              target="_blank"
            >
              <Icon
                class="text-[--d-666-l-999] h-16px w-10px"
                name="custom:search"
              />
            </a>
            <template v-if="pair && getTags(pair)?.normal_tag?.length > 0">
              <div
                v-for="(i, index) in getTags(pair)?.normal_tag"
                :key="index"
                class="bg-btn flex h-16px tag-btn"
              >
                <img
                  v-tooltip="$t(`${i.tag}`)"
                  class="cursor-pointer h-100%"
                  :src="formatIconTag(i.tag)"
                  onerror="this.src='/icon-default.png'"
                  lazy
                >
                <span
                  v-if="i?.showText"
                  :style="{
                    color: i?.color == 'green' ? upColor[0] : downColor[0],
                  }"
                  class="text-10px mr-4px"
                >
                  {{ $t(i?.tag) }}
                </span>
              </div>
            </template>
            <img
              v-if="token?.launchpad"
              v-tooltip="token.launchpad"
              class="rounded-100% bg-btn cursor-pointer"
              :src="formatIconTag(token.launchpad)"
              alt=""
              :width="12"
              style="border-radius: 100%"
            >
          </div>
          <el-popover
            v-if="collected"
            v-model:visible="editableGroup"
            placement="bottom"
            title=""
            :width="200"
            trigger="click"
          >
            <template #reference>
              <a class="flex-start bg-btn" href="" @click.stop.prevent>
                <Icon
                  class="text-[--d-666-l-999] text-12px"
                  name="custom:groups"
                />
                <span class="ml-2px ellipsis block" style="max-width: 140px">
                  {{ currentGroup }}
                </span>
              </a>
            </template>
            <template #default>
              <div class="filter-box">
                <span>{{ $t('editGroup') }}</span>
                <div class="flex mt-10px">
                  <el-select
                    v-model="selectedGroup"
                    :placeholder="$t('pleaseSelectGroup')"
                    :teleported="false"
                  >
                    <el-option :label="$t('defaultGroup')" :value="0" />
                    <el-option
                      v-for="item in userFavoriteGroups"
                      :key="item.group_id"
                      :label="item.name"
                      :value="item.group_id"
                    />
                  </el-select>
                </div>
                <div class="mt-20px flex-center">
                  <el-button
                    :key="themeStore.theme"
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    color="var(--border)"
                    @click.stop="handleReset()"
                  >
                    {{ $t('cancel') }}
                  </el-button>
                  <el-button
                    v-loading="loadingGroupEdit"
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    type="primary"
                    @click.stop="confirmSwitchGroup"
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
          <el-popover
            v-if="collected"
            v-model:visible="editableRemark"
            placement="bottom"
            popper-class="chains-table-filter"
            title=""
            :width="200"
            trigger="click"
          >
            <template #reference>
              <a class="w-zu flex-start bg-btn" href="" @click.stop.prevent>
                <Icon
                  class="text-[--d-666-l-999] text-12px"
                  name="custom:remark"
                />
                <span class="ml-2px ellipsis block" style="max-width: 140px">{{
                  remark
                }}</span>
              </a>
            </template>
            <template #default>
              <div class="filter-box">
                <span>{{ $t('editRemark') }}</span>
                <div class="flex mt-10px">
                  <el-input
                    v-model.trim="remark2"
                    :placeholder="remark"
                    clearable
                  />
                </div>
                <div class="mt-20px flex-center">
                  <el-button
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      margin-left: auto;
                      --el-button-font-weight: 400;
                    "
                    :color="themeStore.isDark ? '#f2f2f2' : '#333333'"
                    @click.stop="handleReset()"
                  >
                    {{ $t('cancel') }}
                  </el-button>
                  <el-button
                    class="flex-1"
                    size="default"
                    :color="themeStore.isDark ? '#222222' : '#f5f5f5'"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    @click.stop="confirmEditRemark(id, remark2)"
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="text-12px flex items-center mt-4px">
          <a
            v-if="token?.token !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'"
            class="hover:color-[--d-F5F5F5-l-333] leading-12px font-500"
            :href="formatExplorerUrl(token?.chain as string, token?.token as string)"
            target="_blank"
          >
            {{
              token?.token?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3')
            }}
          </a>
          <Icon
            v-copy="token?.token"
            name="bxs:copy"
            class="ml-5px clickable"
          />
          <span
            v-if="pair"
            v-tooltip="formatDate(pair?.created_at)"
            class="ml-5px hover:color-[--d-F5F5F5-l-333] leading-12px font-400 mr-8px"
            >
            {{ formatTimeFromNow(pair?.created_at) }}
            </span>
          <div
            v-if="(tokenInfoExtra?.buy_tax??0) > 0 || (tokenInfoExtra?.sell_tax??0) > 0"
            class="flex-start bg-btn"
          >
            <span>{{ $t('tax') }}:</span>
            <span
            v-if="(tokenInfoExtra?.buy_tax??0) > 0"
              class="text-12px"
              :style="{ color: upColor[0] }"
            >
              {{ formatNumber(tokenInfoExtra?.buy_tax ||0, 1) }}%
            </span>
            <span
              v-if="(tokenInfoExtra?.sell_tax??0) > 0"
              class="text-12px ml-4px"
              :style="{ color: downColor[0] }"
            >
              {{ formatNumber(tokenInfoExtra?.sell_tax ||0, 1) }}%
            </span>
          </div>
          <template v-if="pair && getTags(pair)?.signal_arr?.length > 0">
            <div
              v-for="(i, index) in getTags(pair)?.signal_arr?.slice(0, 3)"
              :key="index"
              v-tooltip="
                getTagTooltip(i) +
                (i.tag == 'smarter_buy' || i.tag == 'smarter_sell'
                  ? `（${$t('amountU')}>$10)`
                  : '')
              "
              class="flex bg-btn signal pointer mr-4px text-10px"
            >
              <el-image
                class="h-10px"
                :src="formatIconTag(i.tag)"
                lazy
              >
                <template #error>
                  <img
                    class="h-16px"
                    src="/icon-default.png"
                  >
                </template>
                <template #placeholder>
                  <img
                    class="h-16px"
                    src="/icon-default.png"
                  >
                </template>
              </el-image>
              <div
                v-if="
                  (i?.tag == 'smarter_buy' || i?.tag == 'smarter_sell') &&
                  ((pair?.smart_money_buy_count_24h ?? 0) > 0 ||
                    (pair?.smart_money_sell_count_24h ?? 0 > 0))
                "
                class="ml-2px"
                style="color: #959a9f"
              >
                <span
                  :style="{
                    color:
                      (pair?.smart_money_buy_count_24h ?? 0) > 0
                        ? upColor[0]
                        : '',
                  }"
                >
                  {{
                    formatNumber(pair?.smart_money_buy_count_24h || 0, 0)
                  }} </span
                >/<span
                  :style="{
                    color:
                      (pair?.smart_money_sell_count_24h ?? 0) > 0
                        ? downColor[0]
                        : '',
                  }"
                >
                  {{ formatNumber(pair?.smart_money_sell_count_24h || 0, 0) }}
                </span>
              </div>
              <span
                class="ml-2px"
                :style="{
                  color: i.color == 'green' ? upColor[0] : downColor[0],
                }"
              >
                <template v-if="i.tag">
                  <template v-if="new RegExp('_buy.*$', 'gi').test(i.tag)">
                    {{ $t('buy') }}
                  </template>
                  <template
                    v-else-if="new RegExp('_sell.*$', 'gi').test(i.tag)"
                  >
                    {{ $t('sell') }}
                  </template>
                  <template v-else>
                    {{ $t(i.tag) }}
                  </template>
                </template>
              </span>
            </div>
          </template>
          <div
            v-if="
              pair &&
              getTags(pair)?.signal_arr?.findIndex(
                (i) => i?.tag === 'smarter_buy'
              ) == -1 &&
              getTags(pair)?.signal_arr?.findIndex(
                (i) => i?.tag == 'smarter_sell'
              ) == -1 &&
              ((pair?.smart_money_buy_count_24h ?? 0) > 0 ||
                (pair?.smart_money_sell_count_24h ?? 0) > 0)
            "
            v-tooltip="
              getTagTooltip({
                smart_money_buy_count_24h: pair?.smart_money_buy_count_24h || 0,
                smart_money_sell_count_24h:
                  pair?.smart_money_sell_count_24h || 0,
              })
            "
            class="minor flex-end color-text-2 signal cursor-pointer mr-4px bg-btn text-10px"
          >
            <Icon
              class="text-[--d-666-l-999] h-12px w-12px mr-2px"
              name="custom:smart"
            />
            <span class="mr-2px text-10px">{{ $t('smarter') }}</span>
            <span
              :style="{
                color:
                  (pair?.smart_money_buy_count_24h ?? 0) > 0
                    ? upColor[0]
                    : 'var(--custom-text-3-color)',
              }"
            >
              {{ formatNumber(pair?.smart_money_buy_count_24h || 0, 0) }} </span
            >/<span
              :style="{
                color:
                  (pair?.smart_money_sell_count_24h ?? 0) > 0
                    ? downColor[0]
                    : 'var(--custom-text-3-color)',
              }"
            >
              {{ formatNumber(pair?.smart_money_sell_count_24h || 0, 0) }}
            </span>
          </div>
        </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.bg-btn {
  --uno: bg-[--d-151A22-l-E8F1FF] rounded-2px mr-4px flex items-center
    justify-center h-16px min-w-16px p-2px;
}
</style>
