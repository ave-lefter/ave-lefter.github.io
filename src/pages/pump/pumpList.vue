<template>
  <div class="mt-20px">
    <el-scrollbar v-loading="loading" height="calc(100vh - 180px)">
      <ul class="pump-item_list" v-if="tableList?.length >0">
        <li
          v-for="row in tableList"
          :id="row?.target_token + '-' + row?.chain"
          :ref="setBtnRef"
          :key="row?.pair + '-' + row?.chain"
          class="pump-item_item relative"
          @click.stop="tableRowClick(row)"
          @contextmenu="handleContextMenu($event, row)"
          @mouseenter="showPopover(row)"
          @mouseleave="showPop = false"
        >
          <div>
            <Icon  v-if="pumpBlackList?.findIndex(i=> i.address == row.token || i.address == row.symbol) !==-1"  name="custom:key-invisible" class="text-8px eye" @click.stop="addOrRemoveBlaclList(row,'ca')"/>
            <Icon v-else name="custom:key-visible" class="text-8px eye" @click.stop="addOrRemoveBlaclList(row,'ca')"/>
            <div class="token-logo">
              <el-image class="token-icon" :src="getSymbolDefaultIcon(row, pumpSetting.avatar_isCircle=='rect'? 'rect' :'circle')" :style="{ 'border-radius': pumpSetting.avatar_isCircle=='circle' ? '100%' : '0'}">
                <template #error>
                  <img
                    class="token-icon h-32px text-16px color-#fff"
                    :src="getChainDefaultIcon(row.chain, row.symbol)"
                  />
                </template>
                <template #placeholder>
                  <img
                    class="token-icon h-32px text-16px color-#fff"
                    :src="getChainDefaultIcon(row.chain, row.symbol)"
                  />
                </template>
              </el-image>
              <Progress
                v-if="!isOut"
                class="token-progress"
                :class="pumpSetting.Progress_isCircle=='horizontal' ? 'horizontal' :'circle'"
                :progress="row.progress"
              />
              <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
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
                      />
                    </template>
                    <template #placeholder>
                      <img
                        class="token-icon h-228px w-228px text-16px color-#fff"
                        :src="getChainDefaultIcon(row.chain, row.symbol)"
                      />
                    </template>
                  </el-image>
                </template>
                <a
                  :href="`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                    getSymbolDefaultIcon(row)
                  )}`"
                  target="_blank"
                  class="token-mark clickable"
                  :style="{
                    background: isDark
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(255, 255, 255, 0.5)',
                  }"
                  @click.stop
                >
                  <Icon
                    class="text-16px text-[var(--d-999-l-666)]"
                    name="ep:search"
                  />
                </a>
              </el-tooltip>
              <el-image
                v-if="row.amm"
                class="mr-5px rounded-100% bg-[--d-1A1A1A-l-FFF] px-2px py-2px"
                style="
                  position: absolute;
                  width: 18px;
                  height: 18px;
                  bottom: 0;
                  right: 0;
                "
                :src="`${token_logo_url}swap/${row.amm}.jpeg`"
              />
            </div>
            <div
              class="time"
              :class="pumpSetting.Progress_isCircle=='horizontal'? 'mt-15px': 'mt-5px'"
              :style="{
                color:
                  Number(
                    formatTimeFromNow(row?.created_at || row?.time, true)
                  ) <= 600
                    ? '#FFA622'
                    : '',
              }"
            >
              <template v-if="!(row?.created_at || row?.time)"> - </template>
              <template
                v-else-if="
                  Number(
                    formatTimeFromNow(row?.created_at || row?.time, true)
                  ) >= 60
                "
              >
                {{ formatTimeFromNow(row?.created_at || row?.time) }}
              </template>
              <!-- <van-count-down v-else-if="(row?.created_at || row?.time) && formatTimeFromNow(row?.created_at || row?.time, true) < 60"  :time="(60 - formatTimeFromNow(row?.created_at || row?.time, true)) * 1000" style="--van-count-down-text-color: currentColor" :key="row?.created_at || row?.time" :millisecond="false">
                <template #default="{ total }">
                  <template v-if="total > 0">
                    {{ Math.floor(( 60 * 1000 - total) / 1000) }} s
                  </template>
                  <template v-else>
                    {{ formatTimeFromNow(row?.created_at || row?.time) }}
                  </template>
                </template>
              </van-count-down> -->
              <TimerCount
                v-else-if="(row?.created_at || row?.time) && Number(formatTimeFromNow(row?.created_at || row?.time, true) ) < 60"
                :key="`${row.created_at}`"
                :timestamp="row.created_at"
                :end-time="60"
              >
                <template #default="{ seconds }">
                  <span class="color-#FFA622">
                    <template v-if="seconds < 60">
                      {{ seconds }}s
                    </template>
                    <template v-else>
                      {{ formatTimeFromNow(row.created_at) }}
                    </template>
                  </span>
                </template>
              </TimerCount>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex-start">
              <span class="text-18px font-500 mr-5px">{{ row.symbol }}</span>
              <Icon
                v-copy="row.token"
                name="bxs:copy"
                class="text-10px ml-2px cursor-pointer color-[--d-666-l-999] ml-4px"
                @click.stop.prevent
              />
              <template v-if="row.normal_tag?.length > 0">
                <template v-for="(i, index) in row.normal_tag" :key="index">
                  <el-image
                    v-tooltip="$t(`${i.tag}`)"
                    class="token-icon-tag"
                    :src="formatIconTag(i.tag)"
                    lazy
                  >
                    <template #error>
                      <img class="token-icon-tag" src="/icon-default.png" />
                    </template>
                    <template #placeholder>
                      <img class="token-icon-tag" src="/icon-default.png" />
                    </template>
                  </el-image>
                  <span
                    v-if="i?.showText"
                    :style="{
                      color: i?.color == 'green' ? '#12b886' : '#F6465D',
                    }"
                    class="text-12px ml-3"
                    >{{ $t(i?.tag) }}
                  </span>
                </template>
              </template>
              <template v-if="row.signal_arr?.length > 0">
                <div
                  v-for="(i, index) in row.signal_arr"
                  :key="index"
                  v-tooltip="getTagTooltip(i)"
                  class="flex text-12px"
                >
                  <el-image
                    class="token-icon-signal-tag"
                    :src="formatIconTag(i.tag)"
                    lazy
                  >
                    <template #error>
                      <img
                        class="token-icon-signal-tag"
                        src="/icon-default.png"
                      />
                    </template>
                    <template #placeholder>
                      <img
                        class="token-icon-signal-tag"
                        src="/icon-default.png"
                      />
                    </template>
                  </el-image>
                  <div
                    v-if="
                      (i.tag == 'smarter_buy' || i.tag == 'smarter_sell') &&
                      (row?.smart_money_buy_count_24h > 0 ||
                        row?.smart_money_sell_count_24h > 0)
                    "
                    class="ml-2"
                    style="color: #959a9f"
                  >
                    <span
                      :style="{
                        color:
                          row?.smart_money_buy_count_24h > 0
                            ? upColor[0]
                            : 'var(--custom-text-3-color)',
                      }"
                    >
                      {{ formatNumber(row?.smart_money_buy_count_24h || 0, 0) }}
                    </span>
                    /
                    <span
                      :style="{
                        color:
                          row?.smart_money_sell_count_24h > 0
                            ? '#F6465D'
                            : 'var(--custom-text-3-color)',
                      }"
                    >
                      {{
                        formatNumber(row?.smart_money_sell_count_24h || 0, 0)
                      }}
                    </span>
                  </div>
                  <span
                    class="ml-2"
                    :style="{
                      color: i.color == 'green' ? upColor[0] : '#f6465d',
                    }"
                  >
                    <template v-if="i.tag">{{ $t(i.tag) }}</template>
                  </span>
                </div>
              </template>
              <div
                style="margin-left: auto; flex-wrap: wrap"
                class="flex-end text-12px"
              >
                <!-- <div class="mr-5 color-text-4">Liq</div>
                <div class="text-12px color-text-10">{{ formatNumber((row?.target_token === row?.token0_address ? row?.reserve1 : row?.reserve0) || 0, { decimals: 1 }) }} {{ row?.target_token === row?.token0_address ? row?.token1_symbol : row?.token0_symbol }}</div>
                <div class="color-[--d-666-l-999]"  style="margin: 0 2px;">|</div> -->
                <div class="mr-5px color-[--d-666-l-999]" :style="{ 'font-size': pumpSetting.fontSize_mc }">MC</div>
                <span
                :style="{ 'font-size': pumpSetting.fontSize_mc }"
                  :class="
                    !row.market_cap ? 'color-[--d-666-l-999]' : 'color-#FFA622'
                  "
                  >${{ formatNumber(row.market_cap || 0, 2) }}</span
                >
                <div
                  :style="{ color: isDark ? '#333333' : '#d9d9d9' }"
                  style="margin: 0 2px"
                >
                  |
                </div>
                <div class="mr-5px color-[--d-666-l-999]">V</div>
                <div
                  :class="
                    !row?.volume_u_24h
                      ? 'color-[--d-666-l-999]'
                      : 'color-[--d-999-l-666]'
                  "
                >
                  ${{ formatNumber(row?.volume_u_24h || 0, 2) }}
                </div>
                <div
                  :style="{ color: isDark ? '#333333' : '#d9d9d9' }"
                  style="margin: 0 2px"
                >
                  |
                </div>
                <div class="mr-5px color-[--d-666-l-999]">Txs</div>
                <div
                  :class="
                    !row?.tx_24h_count
                      ? 'color-[--d-666-l-999]'
                      : 'color-[--d-999-l-666]'
                  "
                >
                  {{ formatNumber(row?.tx_24h_count || 0, 2) }}
                </div>
                <div
                  :style="{ color: isDark ? '#333333' : '#d9d9d9' }"
                  style="margin: 0 2px"
                >
                  |
                </div>
                <div class="mr-5px color-[--d-666-l-999]">H</div>
                <div v-if="row?.holders > 800" style="color: #ffa622">
                  {{ formatNumber(row.holders || 0, 2) }}
                </div>
                <div
                  v-else
                  :class="
                    row?.holders > 4
                      ? 'color-[--d-666-l-999]'
                      : 'color-[--d-999-l-666]'
                  "
                >
                  {{ formatNumber(row.holders || 0, 2) }}
                </div>
              </div>
            </div>

            <div class="flex-start text-12px mt-10px">
              <!-- <span v-if="!isOut" style="color: #FFA622">{{ formatNumber(row?.progress || 0,1) }}%</span> -->
              <template v-if="row.tag_arr?.length > 0">
                <template v-for="(i, index) in row.tag_arr" :key="index">
                  <el-image
                    v-tooltip="$t(`${i}`)"
                    class="token-icon-tag"
                    :src="formatIconTag(i)"
                    lazy
                  >
                    <template #error>
                      <img class="token-icon-tag" src="/icon-default.png" />
                    </template>
                    <template #placeholder>
                      <img class="token-icon-tag" src="/icon-default.png" />
                    </template>
                  </el-image>
                  <span
                    v-if="i?.showText"
                    :style="{
                      color: i?.color == 'green' ? '#12b886' : '#F6465D',
                    }"
                    class="text-12px ml-3"
                    >{{ $t(i?.tag) }}
                  </span>
                </template>
              </template>
              <div v-if="row?.medias?.length > 0" class="flex text-10px ml-5px">
                <div
                  v-for="(item, $index) in row?.medias"
                  :key="$index"
                  class="tag-btn"
                >
                  <template v-if="item.url">
                    <span
                      v-if="item.name === 'QQ'"
                      v-tooltip="item.url"
                      class="bg-btn mr-8px"
                    >
                      <Icon
                        :name="`custom:${item.icon}`"
                        class="text-[--d-666-l-999] h-10px"
                      />
                    </span>
                    <a
                      v-else
                      v-tooltip="item.url"
                      :href="item.url"
                      target="_blank"
                      class="bg-btn mr-8px"
                      @click.stop
                    >
                      <Icon
                        :name="`custom:${item.icon}`"
                        class="text-[--d-666-l-999] h-10px"
                      />
                    </a>
                  </template>
                </div>
              </div>
              <a
                class="media-item bg-btn"
                :href="`https://x.com/search?q=($${row?.symbol} OR ${row?.token})&src=typed_query&f=live`"
                target="_blank"
              >
                <Icon
                  class="text-[--d-666-l-999] h-16px w-10px"
                  name="ep:search"
                />
              </a>
              <div
                v-show="Number(row?.rug_rate) > 0"
                v-tooltip="$t('rug_rate_tips')"
                class="flex mr-5px ml-14px items-center bg-btn"
                :style="{
                  color: row?.rug_rate > 60 ? '#F6465D' : 'var(--d-999-l-666)',
                }"
              >
                <Icon
                  class="iconfont icon-rug mr-2px text-10px vertical-middle"
                  name="custom:rug"
                  :style="{
                    color:
                      row?.rug_rate > 60 ? '#F6465D' : 'var(--d-666-l-999)',
                  }"
                />
                <span>{{
                  row.rug_rate == -1
                    ? $t('unKnown1')
                    : formatNumber(row?.rug_rate || 0, 2) + '%'
                }}</span>
              </div>
            </div>
            <div class="flex-start mt-10px text-12px" style="width: 100%">
              <div
                v-show="Number(row?.holders_top10_ratio) > 0.1"
                v-tooltip="$t('holders_top10_ratio_tips')"
                class="flex-start mr-5px bg-btn"
              >
                <Icon
                  class="iconfont icon-TOP text-10px mr-2px"
                  name="custom:top"
                  :style="{
                    color:
                      Number(row?.holders_top10_ratio) > 30
                        ? '#F6465D'
                        : 'var(--d-666-l-999)',
                  }"
                />
                <span
                  :style="{
                    color:
                      Number(row?.holders_top10_ratio) > 30
                        ? '#F6465D'
                        : 'var(--d-999-l-666)',
                  }"
                  >{{ formatNumber(row?.holders_top10_ratio || 0, 1) }}%</span
                >
              </div>
              <div
                v-show="Number(row?.dev_balance_ratio_cur) > 0.1"
                v-tooltip="$t('dev_balance_ratio_cur_tips')"
                class="flex mr-5px bg-btn"
              >
                <img src="@/assets/images/pump/dev.png" class="mr-2px h-10px" />
                <span
                  :style="{
                    color:
                      Number(row?.dev_balance_ratio_cur) > 10
                        ? '#F6465D'
                        : 'var(--d-999-l-666)',
                  }"
                  >{{ formatNumber(row?.dev_balance_ratio_cur || 0, 2) }}%</span
                >
              </div>
              <div
                v-show="Number(row?.insider_balance_ratio_cur) > 0.1"
                v-tooltip="$t('insider_balance_ratio_cur_tips')"
                class="flex mr-5px bg-btn"
              >
                <Icon
                  class="iconfont icon-laoshucang text-10px mr-2px"
                  name="custom:insiders"
                  :style="{
                    color:
                      Number(row?.insider_balance_ratio_cur) > 10
                        ? '#D741E3'
                        : 'var(--d-666-l-999)',
                  }"
                />
                <span
                  :style="{
                    color:
                      Number(row?.insider_balance_ratio_cur) > 10
                        ? '#F6465D'
                        : 'var(--d-999-l-666)',
                  }"
                  >{{
                    formatNumber(row?.insider_balance_ratio_cur || 0, 2)
                  }}%</span
                >
              </div>
              <div
                v-show="
                  Number(row?.sniper_balance_ratio_cur) > 0.1 &&
                  row?.signal_arr?.length == 0 &&
                  row?.smart_money_buy_count_24h +
                    row?.smart_money_sell_count_24h ==
                    0
                "
                v-tooltip="$t('sniper_balance_ratio_cur_tips')"
                class="flex mr-5px bg-btn"
              >
                <Icon
                  class="iconfont icon-gun text-10px mr-2px"
                  name="custom:gun"
                  :style="{
                    color:
                      Number(row?.sniper_balance_ratio_cur) > 30
                        ? '#1296DB'
                        : 'var(--d-666-l-999)',
                  }"
                />
                <span
                  >{{
                    formatNumber(row?.sniper_balance_ratio_cur || 0, 2)
                  }}%</span
                >
              </div>
              <div class="flex-1" />

              <div
                v-if="row?.state === 'migrating'"
                style="
                  margin-left: auto;
                  color: #ffa622;
                  background: #ffa6221a;
                  font-size: 12px;
                  font-weight: 400;
                  border-radius: 4px;
                  padding: 6px 8px;
                  display: flex;
                  align-items: center;
                "
              >
                <img
                  src="@/assets/images/pump/migrating.svg"
                  height="12"
                  class="mr-5px"
                  alt=""
                  srcset=""
                />
                <span>Migrating...</span>
              </div>
              <QuickSwap :quickBuyValue="quickBuyValue" :row="row" :size="pumpSetting.size_swap"/>
            </div>
          </div>
        </li>
      </ul>
      <AveEmpty class="mt-200px" v-else/>
    </el-scrollbar>
    <el-popover
      v-model:visible="showPop"
      :virtual-ref="currentBtnRef"
      virtual-triggering
      trigger="hover"
      placement="top"
      popper-class="text-center"
    >

      {{ $t('progress') }}:{{ formatNumber(selected,2)}}%
    </el-popover>

  </div>
</template>

<script setup lang="ts">
import Progress from './progress.vue'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatTimeFromNow,
  formatIconTag,
} from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'
import { upColor } from '@/utils/constants'
import { Icon } from '#components'
import type { PumpObj } from '@/api/types/pump'
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
})


const showPop = ref(false)
const selected = ref('')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
const { tableList, quickBuyValue, isPaused, loading, isOut } = toRefs(props)
const router = useRouter()
const { token_logo_url } = useConfigStore()
const globalStore = useGlobalStore()
const { isDark, pumpSetting, pumpBlackList } = storeToRefs(globalStore)


const allowRightClick = ref(false)


function handleContextMenu(e: MouseEvent, row: { target_token: string, chain: string }) {
  if (pumpSetting.value.isRight) {
    e.preventDefault()
    const url = router.resolve({
      name: 'token-id',
      params: { id: row.target_token + '-' + row.chain }
    }).href
    window.open(url, '_blank')
  }
}

function tableRowClick(row: { target_token: string, chain: string }) {
    router.push({
    name: 'token-id',
    params: { id: row.target_token + '-' + row.chain  }
  })
}
function addOrRemoveBlaclList(item: {token: string},type:  'ca' | 'dev' | 'keyword') {
  if (pumpBlackList.value) {
    const findIndex = pumpBlackList.value?.findIndex(
      (i) => item.token == i.address
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
  }

}
function showPopover(item: {progress: string, id: string}) {
  if (!isOut.value) {
    selected.value = item.progress
    currentBtnRef.value = btnRefs.value[item.id] || null
    showPop.value = true
  }
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
    padding: 20px;
    &:hover {
      background-color: var(--d-1A1A1A-l-F2F2F2);
    .eye{
        color:#959A9F;
        visibility: visible;
    }
    }
    .eye{
      position: absolute;
      visibility: hidden;
      left: 5px;
      top: 5px;
      color:var(--d-666-l-999)
    }
  }
  .token-logo {
    margin-right: 12px;
    width: 64px;
    height: 64px;
    position: relative;
    display: flex;
    align-items: center;
    .token-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--custom-bg-6-color);
      display: flex;
      align-items: center;
      justify-content: center;
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
        margin-top: 5px;
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
      opacity: 1;
      .iconfont {
        color: var(--a-text-2-color);
        font-weight: 800;
        font-size: 24px;
      }
    }
  }
  .token-icon-signal-tag {
    max-width: 12px;
    max-height: 12px;
    font-size: 10px;
    margin-left: 4px;
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
  --uno: bg-[--d-1A1A1A-l-F2F2F2] rounded-2px mr-4px flex items-center
    justify-center h-16px min-w-16px p-2px;
}
.time {
  color: #959a9f;
  text-align: center;
}
</style>
