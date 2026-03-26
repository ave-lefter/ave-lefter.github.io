<script setup lang="ts">
import BigNumber from 'bignumber.js'
import insidersWhite from '@/assets/images/rugPull/insiders-white.svg'
import insidersBlack from '@/assets/images/rugPull/insiders-black.svg'
import phishingWhite from '@/assets/images/rugPull/phishing-white.svg'
import phishingBlack from '@/assets/images/rugPull/phishing-black.svg'
import cabalWhite from '@/assets/images/rugPull/cabal-white.svg'
import cabalBlack from '@/assets/images/rugPull/cabal-black.svg'
import bundleWhite from '@/assets/images/rugPull/bundle-white.svg'
import bundleBlack from '@/assets/images/rugPull/bundle-black.svg'
import DevPop from '@/pages/pump/components/devPop/index.vue'

const props = defineProps<{
  activeChain: string
  childrenData: any[]
  row: any
}>()
const themeStore = useThemeStore()
const { t } = useI18n()

function formateMin(data) {
  if (typeof data === 'string' || typeof data === 'number') {
    const value = new BigNumber(data)
    if (value.lt(0.01) && value.gt(0)) {
      return '<0.01'
    } else {
      return false
    }
  } else {
    return false
  }
}

function formatRate(val) {
  if (val == null || val === '') return '--'
  return (formateMin(val) || formatNumber(val, 1)) + '%'
}

// 跑路颜色
function getRugColor(val) {
  if (val === 0) return 'color-[--third-text]'
  if (val > 60) return 'color-[--down-color]'
  return 'color-[--main-text]'
}

const isSolana = computed(() => ['AllChains', 'solana'].includes(props.activeChain))

// 跑路是否显示（solana 链）
const runPullVisible = computed(() => isSolana.value)

// 安全图标
function getRiskIcon(row) {
  if (row.risk_level == -1 || row.risk_score >= 60) return new URL('@/assets/images/risk-gaoliang.svg', import.meta.url).href
  if (row.risk_score > 55 && row.risk_score < 60) return new URL('@/assets/images/yichang1-gaoliang.svg', import.meta.url).href
  if (row.risk_score > 0 && row.risk_score <= 55) return new URL('@/assets/images/安全.svg', import.meta.url).href
  if (row.risk_score == 0) return new URL('@/assets/images/zhuyi1.svg', import.meta.url).href
  return null
}
</script>

<template>
  <div class="flex flex-col items-end gap-4px">
    <!-- 第一行： Top10 + Dev -->
    <div class="flex gap-4px">
      <!-- Top10 持仓 -->
      <div
        class="sec-card cursor-pointer"
        :style="{
          background: Number(formatNumber(row?.holders_top10_ratio || 0, 1)) == 0 ? '' : (Number(row?.holders_top10_ratio) > 30 ? '#f6465d1a' : '#12b8861a'),
          color: Number(formatNumber(row?.holders_top10_ratio || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.holders_top10_ratio) > 30 ? '#F6465D' : '#12B886'),
        }"
      >
        <Icon
          class="text-10px shrink-0"
          name="custom:top3"
        />
        <span>{{
          (Number(row?.holders_top10_ratio || 0) < 0.01 && Number(row?.holders_top10_ratio || 0) > 0) ? '<0.01' : formatNumber(row?.holders_top10_ratio || 0, 1)
        }}%</span>
      </div>

      <!-- Dev 持仓（hover 展示主币来源） -->
      <DevPop
        class="sec-card cursor-pointer"
        :style="{
          background: Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1)) == 0 ? '' : (Number(row?.dev_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
          color: Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.dev_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886')
        }"
        :tokenId="(row?.token || row?.target_token) + '-' + row?.chain"
      >
        <template v-if="row?.max_dev_ratio !== null && row?.max_dev_ratio !== undefined && Number(row?.max_dev_ratio) !== 0 && Number(row?.dev_balance_ratio_cur) == 0">
          <Icon
            class="text-10px shrink-0 color-[--x-blue]"
            name="custom:dev-ds"
          />
          <span class="color-[--x-blue]">DS</span>
        </template>
        <template v-else>
          <Icon
            class="text-10px shrink-0"
            name="custom:dev-ds"
          />
          <span>{{formatNumber(
            Number(row?.dev_balance_ratio_cur) >= 0.1
              ? row?.dev_balance_ratio_cur || 0
              : (Number(row?.dev_balance_ratio_cur) == 0 ? '0' : '<0.1'),
            1
          )}}%</span>
        </template>
        <img
          v-if="row.dev_first_transfer_in_from_label"
          class="w-12px h-12px cursor-pointer rounded-full ml-4px"
          :src="formatIconPumpDev(row.dev_first_transfer_in_from_label)"
          alt=""
        >
        <span v-if="row?.dev_age_seconds" class="ml-4px color-[--main-text1]">{{ formatSeconds(Number(row?.dev_age_seconds || 0)) }}</span>
      </DevPop>

      <!-- 狙击 sniper_balance_ratio_cur -->
      <div
        class="sec-card"
        :style="{
          color: Number(formatNumber(row?.sniper_balance_ratio_cur || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.sniper_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
          background: Number(formatNumber(row?.sniper_balance_ratio_cur || 0, 1)) == 0 ? '' : (Number(row?.sniper_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
        }"
      >
        <Icon name="custom:gun" class="text-10px shrink-0" />
        <span>{{ formatNumber(Number(row?.sniper_balance_ratio_cur) > 0.001 ? row?.sniper_balance_ratio_cur || 0 : 0, 1) }}%</span>
      </div>
      <!-- 老鼠仓 insider_balance_ratio_cur -->
      <div
        class="sec-card"
        :style="{
          color: Number(formatNumber(row?.insider_balance_ratio_cur || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.insider_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
          background: Number(formatNumber(row?.insider_balance_ratio_cur || 0, 1)) == 0 ? '' : (Number(row?.insider_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
        }"
      >
        <img
          :src="themeStore.isDark ? insidersWhite : insidersBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatNumber(Number(row?.insider_balance_ratio_cur) > 0.001 ? row?.insider_balance_ratio_cur || 0 : 0, 1) }}%</span>
      </div>
    </div>

    <div class="flex gap-4px">
      <!-- 钓鱼 phishing_ratio -->
      <div
        class="sec-card"
        :style="{
          color: Number(formatNumber(row?.phishing_ratio || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.phishing_ratio) > 5 ? '#F6465D' : '#12B886'),
          background: Number(formatNumber(row?.phishing_ratio || 0, 1)) == 0 ? '' : (Number(row?.phishing_ratio) > 5 ? '#f6465d1a' : '#12b8861a'),
        }"
      >
        <img
          :src="themeStore.isDark ? phishingWhite : phishingBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatNumber(Number(row?.phishing_ratio) > 0.001 ? row?.phishing_ratio || 0 : 0, 1) }}%</span>
      </div>
      <!-- 捆绑 boulder_rate -->
      <div
        class="sec-card"
        :style="{
          color: Number(formatNumber(row?.boulder_rate || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.boulder_rate) > 5 ? '#F6465D' : '#12B886'),
          background: Number(formatNumber(row?.boulder_rate || 0, 1)) == 0 ? '' : (Number(row?.boulder_rate) > 5 ? '#f6465d1a' : '#12b8861a'),
        }"
      >
        <img
          :src="themeStore.isDark ? bundleWhite : bundleBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatNumber(Number(row?.boulder_rate) > 0.001 ? row?.boulder_rate || 0 : 0, 1) }}%</span>
      </div>
      <!-- 阴谋集团 cluster_ratio -->
      <div
        class="sec-card"
        :style="{
          color: Number(formatNumber(row?.cluster_ratio || 0, 1)) == 0 ? 'var(--third-text1)' : (Number(row?.cluster_ratio) > 5 ? '#F6465D' : '#12B886'),
          background: Number(formatNumber(row?.cluster_ratio || 0, 1)) == 0 ? '' : (Number(row?.cluster_ratio) > 5 ? '#f6465d1a' : '#12b8861a'),
        }"
      >
        <img
          :src="themeStore.isDark ? cabalWhite : cabalBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatNumber(Number(row?.cluster_ratio) > 0.001 ? row?.cluster_ratio || 0 : 0, 1) }}%</span>
      </div>
      <!-- 安全 risk_score -->
      <div class="sec-card">
        <img v-if="getRiskIcon(row)" :src="getRiskIcon(row)" class="w-12px h-12px" alt="" />
        <span>{{ $t('safe') }}</span>
      </div>
      <!-- 跑路（仅 solana） -->
      <div v-if="runPullVisible" class="sec-card">
        <Icon name="custom:rug" class="text-12px shrink-0" />
        <span :class="getRugColor(row.rug_rate)">{{ row.rug_rate == -1 ? $t('unKnown1') : formatRate(row.rug_rate) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sec-card {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--main-divider);
  font-size: 11px;
  line-height: 16px;
  cursor: default;
  white-space: nowrap;
}
</style>
