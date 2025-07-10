<script setup lang="ts">
import { get } from 'lodash-es'
import { getOpenTimeList } from './hotColumusService'

const props = defineProps<{
  filterForm: any;
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  setFilterForm<T>(path: string, val: T): void;
  pageNO: number;
  pageSize: number;
}>()

const themeStore = useThemeStore()
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
    sort: 'created_at',
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
  return row.target_token == row.token0_address
    ? row.token0_logo_url
    : row.token1_logo_url
}

const { t } = useI18n()
const openTimeList = computed(() => getOpenTimeList(t('all')))
const rangeArr = ref<[string,string]>(['',''])
function confirm(params?:[string,string]) {
  if(!params){
    props.setFilterForm('created_at.rangeArr[0]','')
    props.setFilterForm('created_at.rangeArr[1]','')
    return
  }
  params.forEach((el,idx) => props.setFilterForm(`created_at.rangeArr[${idx}]`,el))
  popoverVisible.value = false
}
</script>

<template>
  <el-table-column :label="$t('poolPair')" min-width="300" fixed="left">
    <template #header>
      <div class="flex items-center gap-2px">
        <span>{{ $t("poolPair") }}</span
        >/<span>{{ $t("openTime") }}</span>
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
        <el-popover
          v-model="popoverVisible"
          placement="bottom"
          title=""
          :width="300"
          trigger="click"
        >
          <template #reference>
            <Icon name="custom:filter" class="text-10px cursor-pointer" />
          </template>
          <template #default>
            <div class="text-12px font-400">
              {{ $t("openTime") }}
            </div>
            <ul class="mt-10px">
              <li v-for="(item, index) in openTimeList" :key="index">
                <a
                  href="javascript:;"
                  class="flex items-center justify-center text-12px leading-16px font-400 border border-solid border-[--d-333-l-F5F5F5] px-15px py-8px text-center mb-10px rounded-4px"
                  @click.stop.prevent="
                    setFilterForm('created_at.created_interval', item.value)
                  "
                >
                  {{ item.text }}
                </a>
              </li>
            </ul>
            <div class="flex items-center mt-10px">
              <el-input
                v-model.trim.number="rangeArr[0]"
                clearable
                type="text"
                @input="
                  (value) => (rangeArr[0] = value.replace(/\-|[^\d.]/g, ''))
                "
              >
                <template #append>h</template>
              </el-input>
              <span class="ml-10px mr-10px">~</span>
              <el-input
                v-model.trim.number="rangeArr[1]"
                clearable
                type="text"
                @input="(value) => (rangeArr[1] = value.replace(/\-|[^\d.]/g, ''))"
              >
                <template #append>h</template>
              </el-input>
            </div>
            <div class="mt-20px flex">
              <el-button
                class="h-30px flex-1 m-l-auto"
                :color="themeStore.isDark ? '#333' : '#F2F2F2'"
                @click="confirm()"
              >
                {{ $t("reset") }}
              </el-button>
              <el-button
                type="primary"
                class="h-30px flex-1 m-l-auto"
                @click="confirm(rangeArr)"
              >
                {{ $t("confirm") }}
              </el-button>
            </div>
          </template>
        </el-popover>
      </div>
    </template>
    <template #default="{ row, $index }">
      <NuxtLink
        :to="`/token/${row.target_token}-${row.chain}`"
        class="color-[--d-666-l-999] text-12px flex items-center"
        @click.stop.prevent
      >
        <span>#{{ (pageNO - 1) * pageSize + $index + 1 }}</span>
        collect
        <div class="flex items-center gap-8px">
          <TokenImg
            chain-class="w-20px h-20px"
            token-class="w-48px h-48px"
            :row="{
              chain: row.chain,
              symbol: getSymbol(row),
              logo_url: getLogoUrl(row),
            }"
          />
          <div class="flex flex-col gap-6px">
            <div class="flex items-center lh-20px">
              <span class="text-16px">
                {{ getSymbol(row) }}</span
              ><span class="text-10px color-[--d-666-l-999]"
                >/
                {{ getSymbol(row, true) }}
              </span>
              <Icon
                v-copy="row.target_token"
                name="bxs:copy"
                class="text-10px ml-8px [&&]:color-[--d-666-l-999]"
                @click.self.stop
              />
              <a
                class="ml-4px text-10px [&&]:color-[--d-666-l-999]"
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
                v-if="
                  row?.lp_locked_percent > 0 && row?.lp_locked_percent <= 100
                "
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
                    <Icon
                      name="material-symbols:lock"
                      class="color-[--d-666-l-999] text-10px"
                    />
                  </el-progress>
                </template>
                <template #content>
                  <div v-if="row.lp_holders">
                    LP {{ $t("holders") }}: {{ row.lp_holders }}
                  </div>
                  <div v-if="row.lp_locked_percent > 0">
                    {{ $t("LPLocked") }}:
                    {{ formatNumber(row.lp_locked_percent, 0) }}%
                  </div>
                  <div v-if="row.lp_lock_platform">
                    {{ $t("platform") }}: {{ row.lp_lock_platform }}
                  </div>
                  <div v-if="row.lp_locked_to">
                    {{ $t("unlockDate") }}:
                    {{ formatDate(row.lp_locked_to / 1000, "YYYY-MM-DD") }}
                  </div>
                </template>
              </el-tooltip>
            </div>
            <div class="flex items-center lh-12px">
              <div
                v-tooltip="formatDate(row.created_at, 'MM/DD HH:mm:ss')"
                class="mr-8px"
              >
                <TimerCount
                  v-if="
                    row.created_at &&
                    Number(formatTimeFromNow(row.created_at, true)) < 60
                  "
                  :key="row.created_at"
                  :timestamp="row.created_at"
                  :end-time="60"
                >
                  <template #default="{ seconds }">
                    <span v-if="seconds < 60" class="color-#FFA622 text-12px">
                      {{ seconds }}s
                    </span>
                    <span v-else class="color-[--d-666-l-999] text-12px">
                      {{ formatTimeFromNow(row.created_at) }}
                    </span>
                  </template>
                </TimerCount>
                <div v-else class="color-[--d-666-l-999] text-12px">
                  {{ formatTimeFromNow(row.created_at) }}
                </div>
              </div>
              <div v-if="row?.medias?.length > 0" class="flex items-center">
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
                  class="flex items-center"
                >
                  <img
                    class="w-12px h-12px mr-5px"
                    :src="formatIconTag(i.tag)"
                    alt=""
                    onerror="this.src='/icon-default.png'"
                  >
                  <span
                    v-if="i.tag"
                    :class="
                      i.color === 'green' ? 'color-#12B886' : 'color-#F6465D'
                    "
                    >{{ $t(i.tag) }}</span
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
      </NuxtLink>
    </template>
  </el-table-column>
</template>
<style scoped lang="scss">
.progress {
  :deep().el-progress__text {
    min-width: 12px;
  }
}
</style>
