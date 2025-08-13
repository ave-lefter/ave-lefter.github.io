<template>
  <div class="mt-20px mb-30px">
    <el-scrollbar v-loading="loading" :height="scrollHeight">
      <ul v-if="tableList?.length > 0" class="pump-item_list">
        <li
          v-for="row in tableList"
          :id="row?.target_token + '-' + row?.chain"
          :key="row?.pair + '-' + row?.chain"
          :ref="setBtnRef"
          class="pump-item_item relative"
          @click.stop="tableRowClick(row)"
          @contextmenu="handleContextMenu($event, row)"
          @mouseenter="showPopover(row)"
          @mouseleave="showPop = false"
        >
          <div class="flex-between w-full">
            <div class="flex-start items-start">
              <div class="mr-12px relative">
                <div class="black-container ">
                  <span class="bg-[--d-000-l-FFF] px-2px py-2px color-[--d-566275-l-8CA0C3] block hover:color-[--d-8CA0C3-l-566275] w-16px h-16px flex items-center justify-center">
                    <Icon
                    v-if="
                      pumpBlackList?.findIndex(
                        (i) =>
                          (i.address == row.token && i.type == 'ca') ||
                          (i.address == row.symbol && i.type == 'keyword')
                      ) !== -1
                    "
                    name="custom:key-invisible"
                    class="text-12px"
                    @click.stop="addOrRemoveBlaclList(row, 'ca')"
                  />
                  <Icon
                    v-else
                    name="custom:key-visible"
                    class="text-12px"
                    @click.stop="addOrRemoveBlaclList(row, 'ca')"
                  />
                  </span>
                  <span class="bg-[--d-000-l-FFF] px-2px py-2px color-[--d-566275-l-8CA0C3] block mt-5px hover:color-[--d-8CA0C3-l-566275] w-16px h-16px flex items-center justify-center">
                    <Icon
                    v-if="
                      pumpBlackList?.findIndex(
                        (i) =>(i.address == row.token && i.type == 'dev')
                      ) !== -1
                    "
                    name="custom:dev-invisible"
                    class="text-12px"
                    @click.stop="addOrRemoveBlaclList(row, 'dev')"
                  />
                  <Icon
                    v-else
                    name="custom:dev"
                    class="text-12px"
                    @click.stop="addOrRemoveBlaclList(row, 'dev')"
                  />
                  </span>

                </div>
                <div class="token-logo">
                  <el-image
                    class="token-icon"
                    :class="{ small: pumpSetting.Progress_isCircle == 'horizontal' }"
                    :src="
                      getSymbolDefaultIcon(
                        row,
                        pumpSetting.avatar_isCircle == 'rect' ? 'rect' : 'circle'
                      )
                    "
                    :style="{
                      'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '0',
                    }"
                  >
                    <template #error>
                      <img
                        class="token-icon h-32px text-16px color-#fff"
                        :src="getChainDefaultIcon(row.chain, row.symbol)"
                      >
                    </template>
                    <template #placeholder>
                      <img
                        class="token-icon h-32px text-16px color-#fff"
                        :src="getChainDefaultIcon(row.chain, row.symbol)"
                      >
                    </template>
                  </el-image>
                  <Progress
                    class="token-progress"
                    :color="getPumpColor(row.issue_platform)"
                    :class="pumpSetting.Progress_isCircle == 'horizontal' ? 'horizontal' : 'circle'"
                    :progress="row.progress"
                  />
                  <el-tooltip
                    popper-class="tooltip-pd-0"
                    placement="bottom-start"
                    :show-arrow="false"
                  >
                    <template #content>
                      <el-image
                        class="token-icon h-228px w-228px items-center"
                        :src="getSymbolDefaultIcon(row)"
                        preview-teleported
                      >
                        <template #error>
                          <img
                            class="token-icon h-228px w-228px text-16px color-#fff"
                            :src="getChainDefaultIcon(row.chain, row.symbol)"
                          >
                        </template>
                        <template #placeholder>
                          <img
                            class="token-icon h-228px w-228px text-16px color-#fff"
                            :src="getChainDefaultIcon(row.chain, row.symbol)"
                          >
                        </template>
                      </el-image>
                    </template>
                    <a
                      :href="`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                        getSymbolDefaultIcon(row)
                      )}`"
                      target="_blank"
                      class="token-mark clickable "
                      @click.stop
                    >
                      <Icon class="text-16px text-#fff" name="custom:search" />
                    </a>
                  </el-tooltip>
                  <el-image
                    v-if="row.amm"
                    v-tooltip="row.amm"
                    class="mr-5px rounded-100% bg-[--d-151A22-l-E8F1FF] chain border border-[#55D592] border-solid border-[1px]"
                    :style="{
                      'border-color': getPumpColor(row.issue_platform)
                    }"
                    style="
                      position: absolute;
                      width: 14px;
                      height: 14px;
                      bottom: -7px;
                      right: -10px;
                    "
                    :src="`${token_logo_url}swap/${row.amm}.jpeg`"
                  />

                  <el-image
                    v-if="row.issue_platform && isOut"
                    v-tooltip="row.issue_platform"
                    class="ml-5px rounded-100% bg-[--d-151A22-l-E8F1FF] chain border border-[#55D592] border-solid border-[1px]"
                    style="position: absolute; width: 14px; height: 14px; bottom: -7px; left: -10px"
                    :style="{
                      'border-color': getPumpColor(row.issue_platform)
                    }"
                    :src="formatIconTag(row.issue_platform)"
                  />
                  <Icon
                    v-if="row.issue_platform && isOut"
                    class="color-#4FD58F"
                    name="line-md:pause-to-play-filled-transition"
                    style="position: absolute; bottom: -7px; left: 20px; font-size: 16px"
                  />
                </div>
                <div
                  v-tooltip="formatDate(row?.created_at || row?.time)"
                  class="time"
                  :class="pumpSetting.Progress_isCircle == 'horizontal' ? 'mt-20px' : 'mt-10px'"
                  :style="{
                    color:
                      Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
                        ? '#FFA622'
                        : '#12B886',
                  }"
                >
                  <template v-if="!(row?.created_at || row?.time)"> - </template>
                  <template
                    v-else-if="Number(formatTimeFromNow(row?.created_at || row?.time, true)) >= 60"
                  >
                    {{ formatCountdown(Number(row?.created_at)  * 1000 || Number(row?.time) * 1000) }}
                  </template>
                  <TimerCount
                    v-else-if="
                      (row?.created_at || row?.time) &&
                      Number(formatTimeFromNow(row?.created_at || row?.time, true)) < 60
                    "
                    :key="`${row.created_at}`"
                    :timestamp="row.created_at"
                    :end-time="60"
                  >
                    <template #default="{ seconds }">
                      <span class="color-#FFA622">
                        <template v-if="seconds < 60"> {{ seconds }}s </template>
                        <template v-else>
                          {{ formatTimeFromNow(row.created_at) }}
                        </template>
                      </span>
                    </template>
                  </TimerCount>
                </div>
              </div>
              <div>
                <div class="flex-start">
                  <span class="text-18px font-500 mr-5px symbol-ellipsis ellipsis-auto block">{{
                    row.symbol
                  }}</span>
                  <span
                    v-if="pumpSetting?.define?.some((i) => i === 'name')"
                    class="name text-10px font-500 mr-5px color-[--d-566275-l-8CA0C3] symbol-ellipsis ellipsis-auto block"
                    >{{ row.name }}</span
                  >
                  <a
                    v-if="
                      summaryList(
                        lang == 'zh-cn' || lang == 'zh-tw'
                          ? row?.summary_cn || ''
                          : row?.summary || ''
                      )?.length
                    "
                    v-tooltip.raw="{
                      content: buildTooltipContent(
                        lang == 'zh-cn' || lang == 'zh-tw'
                          ? row?.summary_cn || ''
                          : row?.summary || ''
                      ),
                      props: {
                        placement: 'top-start',
                      },
                    }"
                    class="media-item clickable"
                  >
                    <Icon name="custom:ai" class="text-14px" />
                  </a>
                </div>

                <div class="flex-start text-12px mt-0px">
                  <span class="color-[--d-566275-l-8CA0C3]">{{
                    row.token?.slice(0, 4) + '...' + row.token?.slice(-4)
                  }}</span>
                  <Icon
                    v-copy="row.token"
                    name="bxs:copy"
                    class="text-12px cursor-pointer color-[--d-566275-l-8CA0C3] ml-4px"
                    @click.stop.prevent
                  />
                  <div class="color-#252B34"  style="margin: 0 8px;">|</div>
                  <div
                    v-if="
                      row?.medias?.length > 0 && pumpSetting?.define?.some((i) => i === 'media')
                    "
                    class="flex text-12px"
                  >
                    <div v-for="(item, $index) in row?.medias" :key="$index" >
                      <template v-if="item.url">
                        <span v-if="item.name === 'QQ'" v-tooltip="item.url" class="mr-8px">
                          <Icon
                            :name="`custom:${item.icon}`"
                            class="text-[--d-8CA0C3-l-566275] h-12px"
                          />
                        </span>
                        <XPopup
                          v-else-if="item.icon === 'twitter'"
                          :tokenId="(row.token + '-' + row.chain) as string"
                          :type="row.twitter_type"
                        >
                          <a :href="item.url" target="_blank"  class="mr-8px h-12px block leading-12px" @click.stop>
                            <XIcon
                              v-if="[1, 2, 3].includes(row.twitter_type)"
                              :type="row.twitter_type"
                              class="text-12px"
                            />
                            <Icon
                              v-else
                              :name="`custom:${item.icon}`"
                              class="text-[--d-8CA0C3-l-566275] text-12px"
                            />
                          </a>
                        </XPopup>
                        <a
                          v-else
                          v-tooltip="item.url"
                          :href="item.url"
                          target="_blank"
                          class="  h-12px mr-8px block leading-12px"
                          @click.stop
                        >
                          <Icon
                            :name="`custom:${item.icon}`"
                            class="text-[--d-8CA0C3-l-566275] h-12px"
                          />
                        </a>
                      </template>
                    </div>
                  </div>
                  <a
                    class="media-item h-12px  block leading-12px"
                    :href="`https://x.com/search?q=($${row?.symbol} OR ${row?.token})&src=typed_query&f=live`"
                    target="_blank"
                  >
                    <Icon class="text-[--d-8CA0C3-l-566275] h-12px w-12px" name="custom:search" />
                  </a>
                  <div class="color-#252B34"  style="margin: 0 8px">|</div>
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'holder')"
                    v-tooltip="$t(`holders`)"
                    class="flex mr-8px items-center"
                  >
                    <Icon
                      class="iconfont icon-rug mr-4px text-14px vertical-middle color-[--d-566275-l-8CA0C3]"
                      name="custom:holders"
                    />
                    <span class="color-[--d-F5F5F5-l-111]">{{
                      formatNumber(row?.holders || 0, 2)
                    }}</span>
                  </div>
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'markers')"
                    v-tooltip.raw="{
                      content: `<div class='max-w-[400px]'>${$t('buy1')}/${$t('sell1')} <span class='color-#12B886'>${formatNumber(row?.buyers_24h || 0, 2)}</span>/<span class='color-#F6465D'>${formatNumber(row?.sellers_24h || 0, 2)}</span></div>`,
                      props: {
                        placement: 'top-start',
                      },
                    }"
                    class="flex mr-8px items-center"
                  >
                    <Icon
                      class="iconfont icon-rug mr-4px text-14px vertical-middle color-[--d-566275-l-8CA0C3]"
                      name="custom:wallets"
                    />
                    <span class="color-[--d-F5F5F5-l-111]">{{
                      formatNumber(row?.makers_24h || 0, 2)
                    }}</span>
                  </div>

                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'kol')"
                    v-tooltip="`KOL`"
                    class="flex mr-8px items-center"
                  >
                    <Icon
                      class="iconfont icon-rug mr-4px text-14px vertical-middle color-[--d-566275-l-8CA0C3]"
                      name="custom:kol"
                    />
                    <span class="color-[--d-F5F5F5-l-111]">{{
                      formatNumber(row?.kol_tag_count || 0, 2)
                    }}</span>
                  </div>

                  <!-- <div
                v-show="pumpSetting?.define?.some(i=> i=== 'migraged')"
                v-tooltip="$t('migraged')"
                class="flex mr-5px items-center bg-btn"
              >
                <Icon
                  class="iconfont icon-rug mr-2px text-10px vertical-middle color-[--d-666-l-999]"
                  name="custom:migraged"
                />
                <span class="color-[--d-999-l-666]">0</span>
              </div> -->
                </div>
                <div class="flex-start text-12px mt-16px">
                  <div
                  v-show="pumpSetting?.define?.some((i) => i === 'top')"
                  class="flex-start mr-8px bg-btn"
                  @mouseover.stop="e => showBubbleTooltip(row,e)"
                  >
                    <Icon
                      class="iconfont icon-TOP text-12px mr-4px"
                      name="custom:top"
                      :style="{
                        color: Number(row?.holders_top10_ratio) > 30 ? '#F6465D' : '#12B886',
                      }"
                    />
                    <span
                      :style="{
                        color: Number(row?.holders_top10_ratio) > 30 ? '#F6465D' : '#12B886',
                      }"
                      >{{
                        formatNumber(
                          Number(row?.holders_top10_ratio) > 0.001
                            ? row?.holders_top10_ratio || 0
                            : 0,
                          1
                        )
                      }}%</span
                    >
                  </div>
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'dev')"
                    v-tooltip="$t('dev_balance_ratio_cur_tips')"
                    class="flex mr-8px bg-btn"
                  >
                    <Icon
                      class="iconfont icon-TOP text-12px mr-4px"
                      name="custom:dev"
                      :style="{
                        color: Number(row?.dev_balance_ratio_cur) > 10 ? '#F6465D' : '#12B886',
                      }"
                    />
                    <span
                      :style="{
                        color: Number(row?.dev_balance_ratio_cur) > 10 ? '#F6465D' : '#12B886',
                      }"
                      >{{
                        formatNumber(
                          Number(row?.dev_balance_ratio_cur) > 0.001
                            ? row?.dev_balance_ratio_cur || 0
                            : 0,
                          2
                        )
                      }}%</span
                    >
                  </div>
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'insider')"
                    v-tooltip="$t('insider_balance_ratio_cur_tips')"
                    class="flex mr-8px bg-btn"
                  >
                    <Icon
                      class="iconfont icon-laoshucang text-12px mr-4px"
                      name="custom:insiders"
                      :style="{
                        color: Number(row?.insider_balance_ratio_cur) > 10 ? '#F6465D' : '#12B886',
                      }"
                    />
                    <span
                      :style="{
                        color: Number(row?.insider_balance_ratio_cur) > 10 ? '#F6465D' : '#12B886',
                      }"
                      >{{
                        formatNumber(
                          Number(row?.insider_balance_ratio_cur) > 0.001
                            ? row?.insider_balance_ratio_cur || 0
                            : 0,
                          2
                        )
                      }}%</span
                    >
                  </div>
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'sniper')"
                    v-tooltip="$t('snipers')"
                    class="flex mr-8px bg-btn"
                    :style="{
                      color: Number(row?.sniper_count) > 30 ? '#F6465D' : '#12B886',
                    }"
                  >
                    <Icon class="iconfont icon-gun text-12px mr-4px" name="custom:gun" />
                    <span>{{
                      formatNumber(
                        Number(row?.sniper_count) > 0.001 ? row?.sniper_count || 0 : 0,
                        2
                      )
                    }}</span>
                  </div>
                  <!-- <div
                    v-show="pumpSetting?.define?.some((i) => i === 'cabal')"
                    v-tooltip="$t('cabal')"
                    class="flex mr-8px bg-btn"
                  >
                    <img
                      v-if="Number(row?.cabal_tag_count) > 0"
                      class="mr-4px"
                      src="@/assets/images/cabal.svg"
                      :width="11"
                      alt=""
                    >
                    <img
                      v-else
                      class="mr-4px"
                      :src="`${token_logo_url}address_portrait/Cabal11.png`"
                      :width="11"
                      alt=""
                    >
                    <span class="color-[--d-999-l-666]">{{
                      formatNumber(
                        Number(row?.cabal_tag_count) > 0.001 ? row?.cabal_tag_count || 0 : 0,
                        2
                      )
                    }}</span>
                  </div> -->
                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'rug')"
                    v-tooltip="$t('rug_rate_tips')"
                    class="flex mr-5px items-center bg-btn"
                    :style="{
                      color: row?.rug_rate > 60 ? '#F6465D' : '#12B886',
                    }"
                  >
                    <Icon
                      class="iconfont icon-rug mr-2px text-12px vertical-middle"
                      name="custom:rug"
                      :style="{
                        color: row?.rug_rate > 60 ? '#F6465D' : '#12B886',
                      }"
                    />
                    <span>{{
                      row.rug_rate == -1
                        ? $t('unKnown1')
                        : formatNumber(row?.rug_rate || 0, 2) + '%'
                    }}</span>
                  </div>

                  <div
                    v-show="pumpSetting?.define?.some((i) => i === 'smart')"
                    v-tooltip="$t('smarter')"
                    class="flex mr-5px items-center bg-btn"
                    :style="{
                      color: Number(row?.smart_wallet_tag_count || 0) > 0 ? '#F6465D' : '#12B886',
                    }"
                  >
                    <Icon
                      class="iconfont icon-rug mr-2px text-12px vertical-middle"
                      name="custom:wallet"
                    />
                    <span>{{ formatNumber(row?.smart_wallet_tag_count || 0, 2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pump-right">
              <div
                v-if="
                  (isSoon && row.progress > 90) || pumpSetting?.define?.some((i) => i === 'mcap')
                "
                class="flex-end text-12px mt-5px mb-5px"
              >
                <template v-if="isSoon && row.progress > 90">
                  <el-image
                    v-if="row.issue_platform"
                    v-tooltip="row.issue_platform"
                    class="w-20px rounded-100% bg-[--d-1A1A1A-l-FFF] chain mr-9px"
                    :src="formatIconTag(row.issue_platform)"
                  />
                  <ArrowAnimation />
                  <el-image
                    v-if="row.amm"
                    v-tooltip="row.amm"
                    class="w-20px ml-9px rounded-100% bg-[--d-1A1A1A-l-FFF] chain"
                    :src="`${token_logo_url}swap/${row.amm}.jpeg`"
                  />
                </template>
                <template v-else>
                  <template v-if="pumpSetting?.define?.some((i) => i === 'mcap')">
                    <div
                      class="color-[--d-566275-l-8CA0C3] mr-5px"
                      :style="{ 'font-size': pumpSetting.fontSize_mc }"
                    >
                      MC
                    </div>
                    <span
                      class="mr-5px color-#FFA622"
                      :style="{ 'font-size': pumpSetting.fontSize_mc }"
                      >${{ formatNumber(row.market_cap || 0, 2) }}</span
                    >
                  </template>
                </template>
              </div>
              <div
                v-if="
                  pumpSetting?.define?.some((i) => i === 'vol') ||
                  pumpSetting?.define?.some((i) => i === 'txs')
                "
                class="flex-end text-12px mb-15px"
              >
                <template v-if="pumpSetting?.define?.some((i) => i === 'vol')">
                  <div class="mr-5px color-[--d-566275-l-8CA0C3]">V</div>
                  <div class="mr-5px color-[--d-F5F5F5-l-111]">
                    ${{ formatNumber(row?.volume_u_24h || 0, 2) }}
                  </div>
                </template>
                <template v-if="pumpSetting?.define?.some((i) => i === 'txs')">
                  <div class="mr-5px color-[--d-566275-l-8CA0C3]">Txs</div>
                  <div class="mr-5px color-[--d-F5F5F5-l-111]">
                    {{ formatNumber(row?.tx_24h_count || 0, 2) }}
                  </div>
                </template>
              </div>
              <div class="btns-swap flex-end">
                <div
                  v-if="row?.state === 'migrating'"
                  style="
                    margin-left: auto;
                    color: #ffa622;
                    background: #ffa6221a;
                    font-size: 12px;
                    font-weight: 400;
                    border-radius: 4px;
                    padding: 9px 8px;
                    display: flex;
                    margin-right: 5px;
                    align-items: center;
                  "
                >
                  <img
                    src="@/assets/images/pump/migrating.svg"
                    height="12"
                    class="mr-5px"
                    alt=""
                    srcset=""
                  >
                  <span>Migrating...</span>
                </div>
                <QuickSwap
                  :quickBuyValue="quickBuyValue"
                  :row="row"
                  :size="pumpSetting.size_swap"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <AveEmpty v-if="tableList?.length == 0 && !loading" class="mt-200px" />
    </el-scrollbar>
    <el-popover
      v-model:visible="showPop"
      :virtual-ref="currentBtnRef"
      virtual-triggering
      trigger="manual"
      placement="top"
      popper-class="text-center new-popover"
    >
      <span class="color-#12B886">
        <template v-if="isOut">
          {{ selected }}
        </template>
        <template v-else> {{ $t('progress') }}:{{ formatNumber(selected, 2) }}% </template>
      </span>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import Progress from './progress.vue'
import ArrowAnimation from './arrowAnimation.vue'
import { useWindowSize } from '@vueuse/core'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatTimeFromNow,
  formatIconTag,
} from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'
import { Icon } from '#components'
import type { PumpObj } from '@/api/types/pump'
import XIcon from '~/components/xPopup/xIcon.vue'
const props = defineProps({
  tableList: {
    type: Array<PumpObj>,
    default: () => [],
  },
  quickBuyValue: {
    type: String,
    default: () => '',
  },
  isPaused: {
    type: Boolean,
    default: () => false,
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  isOut: {
    type: Boolean,
    default: () => false,
  },
  isSoon: {
    type: Boolean,
    default: () => false,
  },
  scrollHeight:{
    type:[String,Number],
    default:'calc(100vh - 215px)'
  }
})

// const { width } = useWindowSize()
const showPop = ref(false)
const selected = ref('')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
const { tableList, quickBuyValue, loading, isOut, isSoon } = toRefs(props)
const router = useRouter()
const { token_logo_url } = useConfigStore()
const globalStore = useGlobalStore()
const { pumpSetting, pumpBlackList, lang } = storeToRefs(globalStore)
const { t } = useI18n()
const { $createTooltip } = useNuxtApp()
const $tooltip = $createTooltip('bubble--tooltip')
onUnmounted(() => {
  $tooltip?.hide?.()
})
function handleContextMenu(e: MouseEvent, row: { target_token: string; chain: string }) {
  if (pumpSetting.value.isRight) {
    e.preventDefault()
    const url = router.resolve({
      name: 'token-id',
      params: { id: row.target_token + '-' + row.chain },
    }).href
    window.open(url, '_blank')
  }
}

function tableRowClick(row: { target_token: string; chain: string }) {
  router.push({
    name: 'token-id',
    params: { id: row.target_token + '-' + row.chain },
  })
}
function addOrRemoveBlaclList(item: { token: string }, type: 'ca' | 'dev' | 'keyword') {
  if (pumpBlackList.value?.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (pumpBlackList.value) {
    const findIndex = pumpBlackList.value?.findIndex(
      (i) => item.token == i.address && i.type == type
    )
    if (findIndex !== -1) {
      pumpBlackList.value.splice(findIndex, 1)
    } else {
      pumpBlackList.value.push({ address: item.token, type: type })
    }
  } else {
    pumpBlackList.value = [{ address: item.token, type: type }]
  }
}

function setBtnRef(el: HTMLElement | null) {
  if (el && el?.id) {
    btnRefs.value[el?.id] = el
    // console.log('-------el?.id----',el?.id)
  }
}
function showPopover(item: { progress: number; id: string; issue_platform: string }) {
  // if (!isOut.value) {
  // console.log('-----[item.id--',item.id)
  selected.value = isOut.value ? item.issue_platform || '' : String(item.progress || '')
  currentBtnRef.value = btnRefs.value[item.id] || null
  // console.log('-----currentBtnRef.value ---',currentBtnRef.value )
  showPop.value = true
  // }
}

function summaryList(summary: string): string[] {
  return summary?.match(/\d\.[^0-9]*/g) || []
}

function buildTooltipContent(summary: string): string {
  const items = summaryList(summary)
  return items?.length > 0
    ? `
    <div class="max-w-[400px]">
      ${items.map((item) => `<div>${item}</div>`).join('')}
    </div>
  `
    : ''
}
function showBubbleTooltip(row:PumpObj, e:MouseEvent) {
  $tooltip.show({
      content: `<iframe
                  style='width:400px; height:400px;  border:none; overflow: hidden;'
                  src='https://app.insightx.network/bubblemaps/${row.chain === 'bsc' ? 56 : row.chain}/${row.target_token}'
                  allow='clipboard-write'
                ></iframe>`,
      target: e.target as HTMLElement,
      props: {
        showArrow: false,
        rawContent: true,
        placement: 'bottom',
        trigger: 'hover',
        'popper-class': 'x--tooltip',
        'onUpdate:visible': (v: boolean) => {
          if (v) return
          $tooltip.hide()
        }
      }
    })
}
</script>

<style lang="scss" scoped>
.pump-item_list {
  font-size: 12px;
  .color-text-4 {
    color: var(--custom-text-4-color);
  }
  .color-text-10 {
    color: var(--a-text-10-color);
  }
  .pump-item_item {
    min-height: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--a-text-1-color);
    padding: 20px 12px;
    border-bottom: 1px solid var(--d-151A22-l-E8F1FF);
    &:hover {
      background-color: var(--d-151A22-l-E8F1FF);
      .black-container {
        color: #959a9f;
        visibility: visible;
      }
      .pump-right {
        box-shadow: none;
        background-color: var(--d-151A22-l-E8F1FF);
      }
    }
    .black-container {
      position: absolute;
      visibility: hidden;
      left: -8px;
      top: -10px;
      color: var(--d-666-l-999);
      z-index: 1;
    }
  }
  .token-logo {
    // margin-right: 12px;
    // width: 64px;
    // height: 64px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .token-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--custom-bg-6-color);
      display: flex;
      align-items: center;
      justify-content: center;
      &.small {
        width: 50px;
        height: 50px;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .token-progress {
      &.circle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 72px;
        height: 72px;
        transform: translate(-50%, -50%) rotate(-90deg);
      }

      &.horizontal {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 72px;
        height: 2px;
        transform: translate(-50%, -50%);
        margin-top: 10px;
      }
    }
    &:hover .token-mark {
      display: flex;
      visibility: visible;
    }
    .token-mark {
      position: absolute;
      visibility: hidden;
      justify-content: center;
      align-items: center;
      inset: 0;
      // border-radius: 50%;
      &:hover {
        background:#00000099;
        .iconify {
          color: #f5f5f5;
          opacity: 1;
        }
      }
      opacity: 1;
      .iconify {
        // color: var(--a-text-2-color);
        // font-weight: 800;
        // font-size: 24px;
      }
    }
  }
  .token-icon-signal-tag {
    max-width: 12px;
    max-height: 12px;
    font-size: 10px;
    width: 12px;
  }
  .token-icon-tag {
    max-width: 14px;
    max-height: 14px;
    font-size: 10px;
    margin-left: 2px;
    width: 12px;
  }
  .table-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 0;
    min-height: calc(100vh - 200px);
    color: var(--a-text-2-color);
  }
}
.bg-btn {
  --uno:  rounded-2px mr-4px flex items-center justify-center h-20px
    min-w-16px p-2px;
    border: 0.5px solid var(--d-151A22-l-E8F1FF)
}
.time {
  color: #959a9f;
  text-align: center;
}
.chain {
  .el-image__inner {
    border-radius: 100%;
  }
}
@media (max-width: 1920px) and (min-width: 1024px) {
  .pump-right {
    box-shadow: -2px 0px 4px 0px #00000099;
    background: #0b0d12;
    position: absolute;
    right: 0;
    padding: 15px 12px;
  }
}
@media (max-width: 1920px) {
  .symbol-ellipsis {
    max-width: 100px;
  }
}
@media (min-width: 1920px) {
  .symbol-ellipsis {
    max-width: 200px;
  }
}
.ellipsis-auto {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>