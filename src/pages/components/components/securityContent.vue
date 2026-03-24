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

// Top10 颜色
function top10Color(val) {
  if (val == null || val === 0) return 'color-[--third-text]'
  if (val >= 30) return 'color-[--yellow]'
  return ''
}

// Dev 颜色
function devColor(val) {
  if (val == null || Number(val) < 0.1) return 'color-[--secondary-text]'
  if (val > 10) return 'color-[--yellow]'
  return ''
}

function formatDev(val) {
  if (val > 0 && val < 0.1) return '<0.1'
  return formatNumber(val || 0, 1)
}


// 狙击人数颜色
function sniperColor(val) {
  if (val > 30) return 'color-[--down-color]'
  return 'color-[--secondary-text]'
}

// 占比通用颜色（>30%红色）
function rateColor(val) {
  if (val == null) return 'color-[--third-text]'
  if (val > 30) return 'color-[--down-color]'
  if (val === 0) return 'color-[--third-text]'
  return ''
}

// 跑路颜色
function getRugColor(val) {
  if (val === 0) return 'color-[--third-text]'
  if (val > 60) return 'color-[--down-color]'
  return 'color-[--main-text]'
}

// 跑路历史颜色
function ruggedColor(row) {
  const data = row.rugged
  if (typeof data === 'string' || typeof data === 'number') {
    const value = new BigNumber(data)
    if (value.lte(2) && value.gt(0)) return ''
    if (value.lte(10) && value.gt(2)) return 'color-[--yellow]'
    if (value.gt(10)) return 'color-[--down-color]'
    return ''
  }
  return ''
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
      <div class="sec-card" :class="top10Color(row.holders_top10_ratio)">
        <Icon name="custom:top3" class="text-12px shrink-0" />
        <span>{{
          row.holders_top10_ratio > 0 && row.holders_top10_ratio < 0.1
            ? '<0.1'
            : formatNumber(row.holders_top10_ratio || 0, 1)
        }}%</span>
      </div>
      <!-- Dev 持仓（hover 展示主币来源） -->
      <DevPop :tokenId="(row.token || row.target_token) + '-' + row.chain">
        <div class="sec-card cursor-pointer" :class="devColor(row.dev_balance_ratio_cur)">
          <Icon name="custom:dev-ds" class="text-12px shrink-0" />
          <span>{{ formatDev(row.dev_balance_ratio_cur) }}%</span>
        </div>
      </DevPop>
      <!-- 狙击 sniper_tx_count -->
      <div class="sec-card" :class="sniperColor(row.sniper_tx_count)">
        <Icon name="custom:gun" class="text-10px shrink-0" />
        <span>{{ formatNumber(row.sniper_balance_ratio_cur) }}%</span>
      </div>
      <!-- 老鼠仓 rat_rate -->
      <div class="sec-card" :class="rateColor(row.rat_rate)">
        <img
          :src="themeStore.isDark ? insidersWhite : insidersBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatRate(row.rat_rate) }}</span>
      </div>
    </div>

    <div class="flex gap-4px">
      <!-- 钓鱼 phishing_rate -->
      <div class="sec-card" :class="rateColor(row.phishing_rate)">
        <img
          :src="themeStore.isDark ? phishingWhite : phishingBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatRate(row.phishing_rate) }}</span>
      </div>
      <!-- 捆绑 boulder_rate -->
      <div class="sec-card" :class="rateColor(row.boulder_rate)">
        <img
          :src="themeStore.isDark ? bundleWhite : bundleBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatRate(row.boulder_rate) }}</span>
      </div>
      <!-- 阴谋集团 cluster_rate -->
      <div class="sec-card" :class="rateColor(row.cluster_rate)">
        <img
          :src="themeStore.isDark ? cabalWhite : cabalBlack"
          width="12" height="12" alt=""
          class="opacity-70"
        >
        <span>{{ formatRate(row.cluster_rate) }}</span>
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
