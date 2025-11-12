<script setup lang="ts">
import { profit, ranking, totalPoints, type ProfitResponse } from '~/api/perp'

const {t} = useI18n()
const totalAssets = ref<ProfitResponse>({} as ProfitResponse)
const loading = ref(false)
const score = ref({
  isPermission:0,
  myPoint:0,
  points:0
})

const getTotalAssets = async ()=>{
  try{
    loading.value = true
    const res = await profit()
    totalAssets.value = res || {}  
  } finally{
    loading.value = false
  }
}

const getScore = async ()=>{
  const res = await ranking()
  score.value = res || {
    ...score.value,
    isPermission:0,
    myPoint:0,
  }
}

const getTotalPoints = async ()=>{
  const res = await totalPoints()
  score.value.points = res.points || 0
}

onMounted(()=>{
  getTotalAssets()
  getScore()
  getTotalPoints()
})
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg]">
    <div class="flex justify-between mb-24px">
      <span class="text-24px lh-30px color-[--main-text] font-500">{{ t('totalAssets') }}</span>
      <div>
        <el-button class="w-100px h-32px m-l-auto [--el-font-size-base:12px]" type="primary" size="small">
          {{ t('deposit') }}
        </el-button>
        <el-button class="w-100px h-32px [&&]:m-l-8px [--el-font-size-base:12px]" size="small">
          {{ t('withdraw') }}
        </el-button>
      </div>
    </div>
    <div>
      <div class="flex items-center gap-8px mb-8px">
        <span class="text-24px lh-30px color-[--main-text] font-500">${{formatNumber(totalAssets.totalEquity,{
          limit:20,
          decimals:2
        })}}</span>
        <Icon class="color-[--primary-color] cursor-pointer text-15px" :class="{'my-loading':loading}" name="custom:refresh"
        @click="getTotalAssets"
        />
      </div>
      <div class="flex items-center gap-8px">
        <span class="text-12px lh-16px color-[--secondary-text]">{{ t('todayPnl') }}</span>
        <span class="text-12px lh-16px color-[--main-text]">{{formatNumber(totalAssets.profit,{
          limit:20,
          decimals:2
        })}} USDT</span>
        <span class="text-12px lh-16px color-[--secondary-text]">({{formatNumber(+totalAssets.profitRate*100,{
          limit:20,
          decimals:2
        })}}%)</span>
    </div>
    <el-divider class="[--el-border-color:--main-divider]"/>
    <div class="flex items-center justify-between mb-16px">
      <div class="mr-60px">
        <label class="text-12px lh-18px color-[--secondary-text]">{{ t('totalVolume') }}</label>
        <div class="text-18px lh-24px color-[--main-text] font-500">
          ${{formatNumber(totalAssets.totalTransaction,{
            limit:20,
            decimals:2
          })}}
        </div>
      </div>
      <div>
        <label class="text-12px lh-18px color-[--secondary-text]">{{ t('score2') }}</label>
        <div>
          <span class="text-18px lh-24px color-[--up-color] font-500">+{{score.myPoint}}</span>
          <span class="text-14px ml-8px lh-24px color-[--third-text]">本周 +{{score.myPoint}}</span>
        </div>
      </div>
      <el-button :disabled="!score.isPermission" type="primary" size="small" class="w-56px  [--el-font-size-base:12px]">{{ t('receive') }}</el-button>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('todayVolume') }}</span>
      <span class="text-14px lh-18px color-[--main-text] font-500">${{formatNumber(totalAssets.transaction,{
        limit:20,
        decimals:2
      })}}</span>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('totalPnl') }}</span>
      <span class="text-14px lh-18px"
      :class="+totalAssets.totalProfit < 0 ? 'color-[--down-color]' : 'color-[--up-color]'"
      >{{addSign(+totalAssets.totalProfit)}}${{formatNumber(Math.abs(+totalAssets.totalProfit),{
        limit:20,
        decimals:2
      })}}</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-12px lh-18px color-[--secondary-text]">{{ t('maxDrawdown') }}</span>
      <span class="text-14px lh-18px color-[--main-text]">{{
        totalAssets.maxDrawdown === '-1' ? '--' : totalAssets.maxDrawdown
        }}</span>
    </div>
  </div>
</div>
</template>
<style scooped lang="scss">
@keyframes loading {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
.my-loading{
  animation: loading 1s linear infinite;
}
</style>