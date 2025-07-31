<script setup lang="ts">
import type {GetSignalV2ListResponse} from '~/api/signal'

withDefaults(defineProps<{
  signalList?: Array<GetSignalV2ListResponse>
  quickBuyValue: string
}>(), {
  signalList() {
    return []
  },
})
const botStore = useBotStore()
</script>

<template>
  <div class="flex flex-col gap-12px">
    <div
      v-for="({chain,logo,symbol,id,token,issue_platform,mc_cur,signal_time,price_change_24h},index) in signalList"
      :key="id"
      class="pb-12px border-b-1px border-b-solid border-b-[--d-1A1A1A-l-F2F2F2] cursor-pointer"
      @click="navigateTo(`/token/${token}-${chain}`)"
    >
      <div class="flex justify-between mb-4px">
        <div class="flex items-center gap-8px">
          <TokenImg
            token-class="w-32px h-32px"
            :row="{
              chain,
              logo_url:logo,
              symbol
           }"
          />
          <div class="flex flex-col gap-4px">
            <span
                class="font-500 color-[--d-F5F5F5-l-333] text-16px cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-90px"
            >{{ symbol }}</span>
            <div class="color-[--d-666-l-999] flex items-center gap-8px">
              <Icon v-copy="token" name="bxs:copy" class="clickable text-10px"/>
              <a
                class="text-10px"
                :href="`https://x.com/search?q=($${symbol} OR ${token})&src=typed_query&f=live`"
                target="_blank"
              >
                <Icon
                  name="hugeicons:search-01"
                />
              </a>
              <img
                v-if="issue_platform"
                v-tooltip="issue_platform"
                :src="formatIconTag(issue_platform)"
                width="10"
                height="10"
                class="rounded-full"
                alt=""
              >
            </div>
          </div>
        </div>
        <div/>
        <QuickSwap
          :quickBuyValue="quickBuyValue"
          :row="signalList[index]"
          classNames="min-w-70px"
        />
      </div>
      <div class="flex justify-between">
        <div class="flex color-[--d-666-l-999] text-12px">
          {{ $t('mCap') }}
          <span class="color-[--d-F5F5F5-l-333] ml-4px">
            ${{ formatNumber(mc_cur, 1) }}
          </span>
          <span class="ml-8px">24h</span>
          <span
          class="ml-4px"    
          :class="getColorClass(price_change_24h)"
          >{{ addSign(price_change_24h) }}{{ formatNumber(Math.abs(price_change_24h), 2) }}%</span>
        </div>
        <TimerCount
          v-if="signal_time && Number(formatTimeFromNow(signal_time, true)) < 60"
          :key="signal_time" :timestamp="signal_time" :end-time="60">
          <template #default="{ seconds }">
              <span v-if="seconds < 60" v-tooltip="formatDate(signal_time,'MM/DD HH:mm:ss')" class="color-#FFA622 text-12px">
                {{ seconds }}s
              </span>
            <span v-else v-tooltip="formatDate(signal_time,'MM/DD HH:mm:ss')" class="color-[--d-999-l-666] text-12px">
                {{ formatTimeFromNow(signal_time) }}
              </span>
          </template>
        </TimerCount>
        <span v-else v-tooltip="formatDate(signal_time,'MM/DD HH:mm:ss')" class="color-[--d-999-l-666] text-12px">
            {{ formatTimeFromNow(signal_time) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
