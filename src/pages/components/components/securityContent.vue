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

const props = defineProps<{
  activeChain: string
  childrenData: any[]
  row: any
}>()
const themeStore = useThemeStore()
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

const { t } = useI18n()
function getProgressData(row) {
  return [
    {
      icon: themeStore.isDark ? insidersWhite : insidersBlack,
      label: t('insiders'),
      rate: row.rat_rate,
    },
    {
      icon: themeStore.isDark ? phishingWhite : phishingBlack,
      label: t('phishing1'),
      rate: row.phishing_rate,
    },
    {
      icon: themeStore.isDark ? cabalWhite : cabalBlack,
      label: t('cabal'),
      rate: row.cluster_rate,
    },
    {
      icon: themeStore.isDark ? bundleWhite : bundleBlack,
      label: t('bundle1'),
      rate: row.boulder_rate,
    },
  ]
}

function ruggedColor(row) {
  const data = row.rugged
  if (typeof data === 'string' || typeof data === 'number') {
    const value = new BigNumber(data)
    if (value.lte(2) && value.gt(0)) {
      // 0< x <=2
      return ''
    } else if (value.lte(10) && value.gt(2)) {
      // 2< x <=10
      return 'color-[--yellow]'
    } else if (value.gt(10)) {
      return 'color-[--down-color]'
    } else {
      return ''
    }
  } else {
    return ''
  }
}

const runPullVisible = computed(() => {
  const { activeChain } = props
  return (
    ['AllChains', 'solana'].includes(activeChain)  &&
    props.childrenData[1]?.isVisible
  )
})

function getRugColor(val) {
  if(val === 0){
    return 'color-[--third-text]'
  } else if(val > 60){
    return 'color-[--down-color]'
  }
  return 'color-[--main-text]'
}
</script>

<template>
  <div>
    <div v-if="childrenData[0]?.isVisible" class="flex items-center justify-end gap-4px h-18px">
      <img
        v-if="row.risk_level == -1 || row.risk_score >= 60"
        class="w-16px h-16px"
        src="@/assets/images/risk-gaoliang.svg"
        alt=""
      >
      <img
        v-else-if="row.risk_score > 55 && row.risk_score < 60"
        class="w-16px h-16px"
        src="@/assets/images/yichang1-gaoliang.svg"
        alt=""
      >
      <img
        v-else-if="row.risk_score > 0 && row.risk_score <= 55"
        class="w-16px h-16px"
        src="@/assets/images/安全.svg"
        alt=""
      >
      <img
        v-else-if="row.risk_score == 0"
        class="w-16px h-16px"
        src="@/assets/images/zhuyi1.svg"
        alt=""
      >
      {{ $t('safe') }}
    </div>
    <el-popover v-if="runPullVisible" :width="247">
      <template #reference>
        <div
          class="flex items-center justify-end h-20px gap-4px mt-10px"
          :class="getRugColor(row.rug_rate)"
        >
          <Icon name="custom:rug" class="text-12px" />
          {{ row.rug_rate == -1 ? $t('unKnown1') : formatNumber(row.rug_rate || 0, 2) + '%' }}
        </div>
      </template>
      <template #default>
        <el-row align="middle" class="mb-16px">
          <el-col :span="24">
            <div class="lh-20px color-[--secondary-text]">
              <span>{{ $t('abnormalChips') }}&nbsp;:&nbsp;</span>
              <span />
              <span
                >{{ formateMin(row.all_tag_rate) || formatNumber(row.all_tag_rate || 0, 1) }}%</span
              >
            </div>
          </el-col>
        </el-row>
        <template v-for="(item, index) in getProgressData(row)" :key="item.label + index">
          <el-row align="middle" class="lh-16px mb-16px">
            <el-col :span="12">
              <div class="flex items-center">
                <img :src="item.icon" alt="" width="14" height="14" style="margin-right: 2px" >
                <span class="color-[--main-text] text-12px">{{ item.label }}:</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="flex items-center">
                <el-progress
                  :percentage="item.rate || 0"
                  :stroke-width="4"
                  color="[--down-color]"
                  :show-text="false"
                  style="width: 70px"
                />
                <span class="text-12px ml-10px">
                  {{ formateMin(item.rate) || formatNumber(item.rate || 0, 1) }}%
                </span>
              </div>
            </el-col>
          </el-row>
        </template>
        <div v-if="row.total" class="flex items-center color-[--secondary-text]">
          {{ $t('runPullHistory') }}&nbsp;:&nbsp;<span>
            <span :class="ruggedColor(row)">{{ formatNumber(row.rugged || 0, 0) }}</span
            >/{{ formatNumber(row.total || 0, 0) }}
          </span>
          <!-- <Icon name="ri:error-warning-line" class="ml-4px"/> -->
        </div>
      </template>
    </el-popover>
  </div>
</template>
