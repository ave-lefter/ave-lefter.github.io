<script setup lang="ts">
import type { GetSignalV2ListResponse } from '~/api/signal'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'

defineProps<{
  signalList: Array<GetSignalV2ListResponse>
  showPop: (...args: any[]) => void
  hidePop: () => void
  quickBuyValue: string
}>()
const botStore = useBotStore()
</script>

<template>
  <div class="flex flex-col gap-12px">
    <div
      v-for="(
        {
          chain,
          logo,
          symbol,
          id,
          token,
          issue_platform,
          insider_ratio,
          signal_time,
          history_count,
          top10_ratio,
          dev_ratio,
          max_price_change,
          first_signal_time,
          mc,
          mc_cur,
          headline,
          tag,
          action_count,
          actions,
          token_create_time,
        },
        index
      ) in signalList"
      :key="id"
      class="pb-12px border-b-1px border-b-solid border-b-[--main-list-hover] cursor-pointer"
      @click="navigateTo(`/token/${token}-${chain}`)"
    >
      <div class="flex justify-between">
        <div class="flex items-center gap-8px">
          <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
            <template #default>
              <TokenImg
                token-class="w-32px h-32px"
                :row="{
                  chain,
                  logo_url: logo,
                  symbol,
                }"
              />
            </template>
            <template #content>
              <TokenImg
                token-class="w-240px h-240px [&&]:mr-0 rounded-16px"
                :row="{
                  chain,
                  logo_url: logo,
                  symbol,
                }"
              />
            </template>
          </el-tooltip>
          <div class="flex flex-col gap-4px">
            <div class="flex items-center gap-8px">
              <span
                class="font-500 color-[--main-text] text-16px cursor-pointer max-w-140px truncate"
                >{{ symbol }}</span
              >
              <div class="flex items-center gap-4px text-10px color-[--third-text]">
                <Icon
                  name="icon-park-solid:volume-notice"
                  class="text-14px color-[--primary-color]"
                />
                <span class="font-500 color-[--primary-color]"
                  >{{ history_count }}{{ $t('times') }}</span
                >
                <Icon v-copy="token" name="bxs:copy" class="clickable text-10px" />
                <a
                  class="text-10px"
                  :href="`https://x.com/search?q=($${symbol} OR ${token})&src=typed_query&f=live`"
                  target="_blank"
                >
                  <Icon name="hugeicons:search-01" />
                </a>
                <img
                  v-if="issue_platform"
                  v-tooltip="issue_platform"
                  :src="formatIconTag(issue_platform)"
                  width="10"
                  height="10"
                  class="rounded-full"
                  alt=""
                />
                <Icon v-if="headline" v-tooltip="headline" name="custom:ai" class="text-12px" />
              </div>
            </div>
            <div class="flex items-center gap-8px">
              <TimerCount
                v-if="token_create_time && Number(formatTimeFromNow(token_create_time, true)) < 60"
                :key="token_create_time"
                :timestamp="token_create_time"
                :end-time="60"
              >
                <template #default="{ seconds }">
                  <span
                    v-if="seconds < 60"
                    v-tooltip="formatDate(token_create_time, 'MM/DD HH:mm:ss')"
                    class="color-[--yellow] text-12px"
                  >
                    {{ seconds }}s
                  </span>
                  <span
                    v-else
                    v-tooltip="formatDate(token_create_time, 'MM/DD HH:mm:ss')"
                    class="color-[--third-text] text-12px"
                  >
                    {{ formatTimeFromNow(token_create_time) }}
                  </span>
                </template>
              </TimerCount>
              <div
                v-else
                v-tooltip="formatDate(token_create_time, 'MM/DD HH:mm:ss')"
                class="color-[--third-text] text-12px"
              >
                {{ formatTimeFromNow(token_create_time) }}
              </div>
              <div
                v-if="Number(top10_ratio) > 0"
                class="text-10px flex items-center gap-2px color-[--secondary-text]"
                :class="{
                  'color-[--down-color]': Number(top10_ratio) > 30,
                }"
              >
                <Icon class="text-11px" name="custom:top" />
                {{ formatNumber(top10_ratio || 0, 1) }}%
              </div>
              <div
                v-if="Number(insider_ratio) > 0"
                class="text-10px flex items-center gap-2px color-[--secondary-text]"
                :class="{
                  'color-[--down-color]': Number(insider_ratio) > 30,
                }"
              >
                <Icon class="text-11px" name="custom:insiders" />
                {{ formatNumber(insider_ratio || 0, 1) }}%
              </div>
              <div
                v-if="Number(dev_ratio) > 0.01"
                class="text-10px flex items-center gap-2px color-[--secondary-text]"
              >
                <img src="@/assets/images/dev.png" alt="" class="w-11px h-11px" />
                {{ formatNumber(dev_ratio || 0, 1) }}%
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-10px color-[--secondary-text] mb-4px">
            {{ $t('MaximumIncrease') }}
          </div>
          <div
            class="p-4px text-center rounded-tl-2 cursor-pointer rounded-br-[10px] text-[18px] leading-[24px] text-[--white] font-500 bg-[linear-gradient(73.74deg,_#8B4FDD_9.69%,_#12B886_91.69%)]"
          >
            {{ Number(max_price_change) < 1 ? '<1' : Math.ceil(Number(max_price_change)) + 'X' }}
          </div>
        </div>
      </div>
      <div class="flex justify-between mt-6px">
        <el-row class="w-210px text-12px color-[--third-text]">
          <el-col :span="8" class="text-center">
            <div class="mb-4px">
              {{ $t('firstSignal') }}
            </div>
            <TimerCount
              v-if="first_signal_time && Number(formatTimeFromNow(first_signal_time, true)) < 60"
              :key="first_signal_time"
              :timestamp="first_signal_time"
              :end-time="60"
            >
              <template #default="{ seconds }">
                <span
                  v-if="seconds < 60"
                  v-tooltip="formatDate(first_signal_time, 'MM/DD HH:mm:ss')"
                  class="color-[--yellow]"
                >
                  {{ seconds }}s
                </span>
                <span
                  v-else
                  v-tooltip="formatDate(first_signal_time, 'MM/DD HH:mm:ss')"
                  class="color-[--third-text]"
                >
                  {{ formatTimeFromNow(first_signal_time) }}
                </span>
              </template>
            </TimerCount>
            <span
              v-else
              v-tooltip="formatDate(first_signal_time, 'MM/DD HH:mm:ss')"
              class="color-[--third-text]"
            >
              {{ formatTimeFromNow(first_signal_time) }}
            </span>
          </el-col>
          <el-col :span="8" class="text-center">
            <div class="mb-4px">
              {{ $t('firstMarketCap') }}
            </div>
            <div class="color-[--main-text]">${{ formatNumber(mc, 1) }}</div>
          </el-col>
          <el-col :span="8" class="text-center">
            <div class="mb-4px">
              {{ $t('currentMarketCap') }}
            </div>
            <div
              class="flex items-center justify-center gap-6px"
              :class="{
                'color-[--down-color]': Number(mc_cur) < Number(mc),
                'color-[--up-color]': Number(mc_cur) > Number(mc),
              }"
            >
              ${{ formatNumber(mc_cur, 1) }}
              <Icon v-show="Number(mc_cur) > Number(mc)" key="1" name="custom:increase" />
              <Icon v-show="Number(mc_cur) < Number(mc)" key="2" name="custom:reduce" />
            </div>
          </el-col>
        </el-row>
        <QuickSwap
          :quickBuyValue="quickBuyValue"
          :row="signalList[index]"
          classNames="min-w-70px"
        />
      </div>
      <!-- <div v-if="headline" class="flex items-center gap-8px mt-12px">
        <Icon name="custom:ai"/>
        <div class="color-[--main-text] text-12px whitespace-nowrap overflow-hidden text-ellipsis">
          {{ headline }}
        </div>
      </div> -->
      <div
        class="mt-12px px-8px py-4px lh-14px bg-[--main-list-hover] flex items-center text-12px rounded-4px"
      >
        <img :src="formatIconTag(tag)" alt="" class="w-12px h-12px mr-4px" />
        <TimerCount
          v-if="signal_time && Number(formatTimeFromNow(signal_time, true)) < 60"
          :key="signal_time"
          :timestamp="signal_time"
          :end-time="60"
        >
          <template #default="{ seconds }">
            <div v-if="seconds < 60" class="color-[--yellow] text-12px">{{ seconds }}s</div>
            <div v-else class="color-[--secondary-text] text-12px">
              {{ dayjs(signal_time * 1000).fromNow() }}
            </div>
          </template>
        </TimerCount>
        <div v-else class="color-[--secondary-text] text-12px flex">
          {{ dayjs(signal_time * 1000).fromNow() }}
        </div>
        <div
          class="color-[--main-text] mx-4px cursor-pointer decoration-underline decoration-dotted"
          @mouseenter.stop="showPop($event, signalList[index].actions)"
          @mouseleave.stop="hidePop"
        >
          {{ action_count }}{{ $t('signalUnit') }}{{ $t(tag) }}
        </div>
        <span class="color-[--up-color]">
          ${{
            formatNumber(
              (actions || [])
                .reduce((pre, cur) => {
                  return pre.plus(Number(cur.quote_token_volume))
                }, new BigNumber(0))
                .toString(),
              2
            )
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
