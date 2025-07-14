<script setup lang="ts">
import dayjs from 'dayjs'
import { getOpenTimeList } from './hotColumusService'
import RangePopover from './rangePopover.vue'

const emit = defineEmits(['collect'])
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
  pageNO: number
  pageSize: number
}>()

const popoverVisible = shallowRef(false)
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'created_at') {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'created_at' : '',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

function getSymbol(row, shouldReverse = false) {
  const isZeroAddress = row.target_token == row.token0_address
  if (shouldReverse) {
    return isZeroAddress ? row.token1_symbol : row.token0_symbol
  }
  return isZeroAddress ? row.token0_symbol : row.token1_symbol
}
function getLogoUrl(row) {
  return row.target_token == row.token0_address ? row.token0_logo_url : row.token1_logo_url
}

const { t } = useI18n()
const openTimeList = computed(() => getOpenTimeList(t('all')))
const isFilterHighlight = shallowRef(false)

function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['created_at_max', ''], ['created_at_min', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [
      `${{ 0: 'created_at_max', 1: 'created_at_min' }[idx]}` as string,
      el ? dayjs().unix() - Number(el) * 3600 : '',
    ]
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
const globalStore = useGlobalStore()
function inBlackList(row) {
  return (
    globalStore.pumpBlackList.findIndex(
      (i) =>
        (i.address == row.token && i.type == 'ca') ||
        (i.address == row.symbol && i.type == 'keyword')
    ) !== -1
  )
}

function addOrRemoveBlackList(item: { token: string }, type: 'ca' | 'dev' | 'keyword') {
  if (globalStore.pumpBlackList.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (globalStore.pumpBlackList) {
    const findIndex = globalStore.pumpBlackList.findIndex(
      (i) => item.token == i.address && i.type == 'ca'
    )
    if (findIndex !== -1) {
      globalStore.pumpBlackList.splice(findIndex, 1)
    } else {
      globalStore.pumpBlackList.push({ address: item.token, type: type })
    }
  } else {
    globalStore.pumpBlackList = [{ address: item.token, type: type }]
  }
}

function timerCountColor(val:number) {
  if (Number(formatTimeFromNow(val,true)) < 3600 * 24) {
    return 'color-#FFA622'
  }
  return 'color-[--d-666-l-999]'
}
</script>

<template>
  <el-table-column min-width="320" fixed="left">
    <template #header>
      <div class="flex items-center gap-2px">
        <span>{{ $t('poolPair') }}</span
        >/<span>{{ $t('openTime') }}</span>
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
        <RangePopover
          v-model="popoverVisible"
          :width="300"
          :title="$t('openTime')"
          :list="openTimeList"
          :selectRangeIndex="1"
          :isFilterHighlight="isFilterHighlight"
          append="h"
          @confirm="confirm"
        />
      </div>
    </template>
    <template #default="{ row, $index }">
      <div class="[&&]:color-[--d-666-l-999] text-12px flex items-center box">
        <Icon
          v-if="inBlackList(row)"
          name="custom:key-invisible"
          class="text-12px absolute top-5px left-5px hidden icon"
          @click.self.stop="addOrRemoveBlackList(row, 'ca')"
        />
        <Icon
          v-else
          name="custom:key-visible"
          class="text-9px absolute top-5px left-5px hidden icon"
          @click.self.stop="addOrRemoveBlackList(row, 'ca')"
        />
        <span>#{{ (pageNO - 1) * pageSize + $index + 1 }}</span>
        <div class="flex items-center" @click.stop="emit('collect', $index, row)">
          <Icon
            name="material-symbols:kid-star"
            class="color-var(--d-999-l-666) text-12px cursor-pointer ml-5px mr-12px"
            :class="row.is_fav ? 'color-#ffbb19' : ''"
          />
        </div>
        <div class="flex items-center gap-8px">
          <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
            <template #default>
              <TokenImg
                :is-circle="globalStore.pumpSetting.avatar_isCircle === 'circle'"
                chain-class="w-20px h-20px"
                token-class="w-48px h-48px rounded-8px"
                :row="{
                  chain: row.chain,
                  symbol: getSymbol(row),
                  logo_url: getLogoUrl(row),
                }"
              />
            </template>
            <template #content>
              <TokenImg
                :is-circle="globalStore.pumpSetting.avatar_isCircle === 'circle'"
                chain-class="hidden"
                token-class="w-240px h-240px rounded-16px [&&]:mr-0"
                :row="{
                  chain: row.chain,
                  symbol: getSymbol(row),
                  logo_url: getLogoUrl(row),
                }"
              />
            </template>
          </el-tooltip>
          <div class="flex flex-col gap-6px">
            <div class="flex items-center lh-20px">
              <span class="text-16px color-[--d-CCC-l-333]"> {{ getSymbol(row) }}</span
              ><span class="text-10px color-[--d-666-l-999]"
                >/{{ getSymbol(row, true) }}
              </span>
              <Icon
                v-copy="row.target_token"
                name="bxs:copy"
                class="text-10px ml-8px [&&]:color-[--d-666-l-999]"
                @click.self.stop
              />
              <a
                class="ml-4px text-10px [&&]:color-[--d-666-l-999] lh-10px"
                :href="`https://x.com/search?q=($${getSymbol(row)} OR ${row.target_token})&src=typed_query&f=live`"
                target="_blank"
                @click.stop
              >
                <Icon name="hugeicons:search-01" />
              </a>
              <img
                v-if="row.issue_platform"
                v-tooltip="row.issue_platform"
                :src="formatIconTag(row.issue_platform)"
                width="10"
                height="10"
                class="rounded-full ml-4px"
                alt=""
              >
              <el-tooltip
                v-if="row?.lp_locked_percent > 0 && row?.lp_locked_percent <= 100"
                placement="top"
              >
                <template #default>
                  <el-progress
                    class="progress ml-4px"
                    type="circle"
                    :percentage="row.lp_locked_percent"
                    color="var(--primary-color)"
                    :width="14"
                    :stroke-width="1.5"
                    indeterminate
                  >
                    <Icon name="material-symbols:lock" class="color-[--d-666-l-999] text-10px" />
                  </el-progress>
                </template>
                <template #content>
                  <div v-if="row.lp_holders">LP {{ $t('holders') }}: {{ row.lp_holders }}</div>
                  <div v-if="row.lp_locked_percent > 0">
                    {{ $t('LPLocked') }}: {{ formatNumber(row.lp_locked_percent, 0) }}%
                  </div>
                  <div v-if="row.lp_lock_platform">
                    {{ $t('platform') }}: {{ row.lp_lock_platform }}
                  </div>
                  <div v-if="row.lp_locked_to">
                    {{ $t('unlockDate') }}:
                    {{ formatDate(row.lp_locked_to / 1000, 'YYYY-MM-DD') }}
                  </div>
                </template>
              </el-tooltip>
            </div>
            <div class="flex items-center lh-12px">
              <div
                v-tooltip="formatDate(row.created_at, 'MM/DD HH:mm:ss')"
                class="mr-8px text-12px"
              >
                <TimerCount
                  v-if="row.created_at && Number(formatTimeFromNow(row.created_at, true)) < 60"
                  :key="row.created_at"
                  :timestamp="row.created_at"
                  :end-time="60"
                >
                  <template #default="{ seconds }">
                    <span v-if="seconds < 60" class="color-#FFA622"> {{ seconds }}s </span>
                    <span v-else :class="timerCountColor(row.created_at)">
                      {{ formatTimeFromNow(row.created_at) }}
                    </span>
                  </template>
                </TimerCount>
                <div v-else :class="timerCountColor(row.created_at)">
                  {{ formatTimeFromNow(row.created_at) }}
                </div>
              </div>
              <div v-if="row?.medias?.length > 0" class="flex items-center gap-4px">
                <template v-for="(item, index) in row?.medias" :key="index">
                  <div v-if="item.url" v-tooltip="item.url">
                    <a :href="item.url" target="_blank" @click.stop>
                      <Icon :name="`custom:${item.icon}`" />
                    </a>
                  </div>
                </template>
              </div>
              <template v-if="row.signal_arr?.length > 0">
                <div
                  v-for="(i, index) in row.signal_arr"
                  :key="index"
                  v-tooltip="getTagTooltip(i)"
                  class="flex items-center ml-4px"
                >
                  <img
                    class="w-12px h-12px mr-5px"
                    :src="formatIconTag(i.tag)"
                    alt=""
                    onerror="this.src='/icon-default.png'"
                  >
                  <span
                    v-if="i.tag"
                    :class="i.color === 'green' ? 'color-#12B886' : 'color-#F6465D'"
                    >{{ $t(i.tag) }}</span
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-table-column>
</template>
<style scoped lang="scss">
.progress {
  :deep().el-progress__text {
    min-width: 12px;
  }
}
.hover-row {
  .icon {
    display: block;
  }
}
</style>
