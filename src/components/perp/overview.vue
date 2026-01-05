<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { boxopen, profit, ranking, totalPoints } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const { t } = useI18n()
const perpStore = usePerpStore()
const walletStore = useWalletStore()
const { deposit, withdraw, connectAndLogin } = usePerp()
const loading = ref(false)
const score = ref({
  isPermission: 0,
  myPoint: 0,
  points: 0,
})

const totalAssets = computed(() => perpStore.totalAssets)
const getTotalAssets = async () => {
  try {
    loading.value = true
    const res = await profit()
    perpStore.totalAssets = res || {}
  } finally {
    loading.value = false
  }
}

const getScore = async () => {
  const res = await ranking()
  score.value = res || {
    ...score.value,
    isPermission: 0,
    myPoint: 0,
  }
}

const getTotalPoints = async () => {
  const res = await totalPoints()
  score.value.points = res.points || 0
}

const receiveScore = async () => {
  try {
    await boxopen()
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  }
}


onMounted(() => {
  getTotalAssets()
  getScore()
  getTotalPoints()
})
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg]">
    <div class="flex justify-between mb-24px">
      <span class="text-24px lh-30px color-[--main-text] font-500">{{ t('totalAssets') }}</span>
      <div v-if="perpStore.isLogin">
        <el-button
          class="w-100px h-32px m-l-auto [--el-font-size-base:12px]"
          type="primary"
          size="small"
          @click="deposit"
        >
          {{ t('deposit') }}
        </el-button>
        <el-button
          class="w-100px h-32px [&&]:m-l-8px [--el-font-size-base:12px]"
          style="--el-button-active-border-color: transparent"
          size="small"
          @click="withdraw"
        >
          {{ t('withdraw') }}
        </el-button>
      </div>
      <template v-else>
        <el-button v-if="!walletStore.address" type="primary" @click="connectAndLogin">{{ $t('connectWallet') }}</el-button>
        <el-button v-if="walletStore.address && !perpStore.isLogin" type="primary" @click="connectAndLogin">{{ $t('loginPerpAccount') }}</el-button>
      </template>

    </div>
    <div>
      <div class="flex items-center gap-8px mb-8px">
        <span class="text-24px lh-30px color-[--main-text] font-500"
          >${{
            formatNumber(totalAssets.totalEquity, {
              limit: 20,
              decimals: 2,
            })
          }}</span
        >
        <Icon
          class="color-[--primary-color] cursor-pointer text-15px"
          :class="{ 'my-loading': loading }"
          name="custom:refresh"
          @click="getTotalAssets"
        />
      </div>
      <div class="flex items-center gap-8px">
        <span class="text-12px lh-16px color-[--secondary-text]">{{ t('todayPnl') }}</span>
        <span class="text-12px lh-16px" :class="getColorClass(totalAssets.profit)"
          >{{
            formatNumber(totalAssets.profit, {
              limit: 20,
              decimals: 2,
            })
          }}
          USDT</span
        >
        <span class="text-12px lh-16px" :class="getColorClass(totalAssets.profit)"
          >({{
            formatNumber(+totalAssets.profitRate * 100, {
              limit: 20,
              decimals: 2,
            })
          }}%)</span
        >
      </div>
      <el-divider class="[--el-border-color:--main-divider]" />
      <div class="flex items-center justify-between mb-16px">
        <div class="mr-60px">
          <label class="text-12px lh-18px color-[--secondary-text]">{{ t('totalVolume') }}</label>
          <div class="text-18px lh-24px color-[--main-text] font-500">
            ${{
              formatNumber(totalAssets.totalTransaction, {
                limit: 20,
                decimals: 2,
              })
            }}
          </div>
        </div>
        <div>
          <label class="text-12px lh-18px color-[--secondary-text]">{{ t('score2') }}</label>
          <div>
            <span class="text-18px lh-24px font-500" :class="getColorClass(score.myPoint)"
              >{{ addSign(score.myPoint) }}{{ score.myPoint }}</span
            >
            <span class="text-14px ml-8px lh-24px color-[--third-text]"
              >{{ t('thisWeek') }} {{ addSign(score.myPoint) }}+{{ score.myPoint }}</span
            >
          </div>
        </div>
        <!-- <el-button
          type="primary"
          size="small"
          class="w-56px [--el-font-size-base:12px]"
          @click="receiveScore"
          >{{ t('receive') }}</el-button
        > -->
      </div>
      <div class="flex items-center justify-between mb-16px">
        <span class="text-12px lh-18px color-[--secondary-text]">{{ t('todayVolume') }}</span>
        <span class="text-14px lh-18px color-[--main-text] font-500"
          >${{
            formatNumber(totalAssets.transaction, {
              limit: 20,
              decimals: 2,
            })
          }}</span
        >
      </div>
      <div class="flex items-center justify-between mb-16px">
        <span class="text-12px lh-18px color-[--secondary-text]">{{ t('totalPnl') }}</span>
        <span
          class="text-14px lh-18px"
          :class="+totalAssets.totalProfit < 0 ? 'color-[--down-color]' : 'color-[--up-color]'"
          >{{ addSign(+totalAssets.totalProfit) }}${{
            formatNumber(Math.abs(+totalAssets.totalProfit), {
              limit: 20,
              decimals: 2,
            })
          }}</span
        >
      </div>
      <div class="flex items-center justify-between">
        <span class="text-12px lh-18px color-[--secondary-text]">{{ t('maxDrawdown') }}</span>
        <span class="text-14px lh-18px color-[--main-text]">{{
          totalAssets.maxDrawdown === '-1'
            ? '--'
            : BigNumber(totalAssets.maxDrawdown).multipliedBy(100).toFixed(2) + '%'
        }}</span>
      </div>
    </div>
  </div>
</template>
<style scooped lang="scss">
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.my-loading {
  animation: loading 1s linear infinite;
}
</style>
