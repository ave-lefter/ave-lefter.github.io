<script setup lang="ts">
import BigNumber from 'bignumber.js'
import insiders from '@/assets/images/rugPull/insiders.svg'
import phishing from '@/assets/images/rugPull/phishing.svg'
import cabal from '@/assets/images/rugPull/cabal.svg'
import bundle from '@/assets/images/rugPull/bundle.svg'

const props = defineProps<{
  activeCategory: string
  activeChain: string
  childrenData:any[]
}>()
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
      icon: insiders,
      label: t('insiders'),
      rate: row.rat_rate,
    },
    {
      icon: phishing,
      label: t('phishing1'),
      rate: row.phishing_rate,
    },
    {
      icon: cabal,
      label: t('cabal'),
      rate: row.cluster_rate,
    },
    {
      icon: bundle,
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
      return 'color-#FFA622'
    } else if (value.gt(10)) {
      return 'color-#F6465D'
    } else {
      return ''
    }
  } else {
    return ''
  }
}

const runPullVisible = computed(() => {
  const { activeChain, activeCategory } = props
  return (
    ['AllChains', 'solana'].includes(activeChain) &&
    activeCategory === 'hot' && props.childrenData[1]?.isVisible
  )
})
</script>

<template>
  <el-table-column
    :label="$t('security')"
    :width="getTextWidth($t('security'), 50) + 55"
    align="right"
  >
    <template #default="{ row }">
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
            :class="row.rug_rate > 60 ? 'color-#F6465D' : 'color-[--d-999-l-666]'"
          >
            <Icon name="custom:rug" class="text-12px" />
            {{ row.rug_rate == -1 ? $t('unKnown1') : formatNumber(row.rug_rate || 0, 2) + '%' }}
          </div>
        </template>
        <template #default>
          <el-row align="middle" class="mb-16px">
            <el-col :span="24">
              <div class="lh-20px">
                <span>{{ $t('abnormalChips') }}&nbsp;:&nbsp;</span>
                <span />
                <span
                  >{{
                    formateMin(row.all_tag_rate) || formatNumber(row.all_tag_rate || 0, 1)
                  }}%</span
                >
              </div>
            </el-col>
          </el-row>
          <template v-for="(item, index) in getProgressData(row)" :key="item.label + index">
            <el-row align="middle" class="lh-16px mb-16px">
              <el-col :span="12">
                <div class="flex items-center">
                  <img :src="item.icon" alt="" width="14" height="14" style="margin-right: 2px" >
                  <span class="color-[--d-999-l-666]">{{ item.label }}:</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="flex items-center">
                  <el-progress
                    :percentage="item.rate || 0"
                    :stroke-width="4"
                    color="#F6465D"
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
          <div v-if="row.total" class="flex items-center color-[--d-CCC-l-333]">
            {{ $t('runPullHistory') }}&nbsp;:&nbsp;<span>
              <span :class="ruggedColor(row)">{{ formatNumber(row.rugged || 0, 0) }}</span
              >/{{ formatNumber(row.total || 0, 0) }}
            </span>
            <!-- <Icon name="ri:error-warning-line" class="ml-4px"/> -->
          </div>
        </template>
      </el-popover>
    </template>
  </el-table-column>
</template>
