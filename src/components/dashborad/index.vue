<template>
  <div class="bg-[--main-bg] rounded-8px p-12px min-w-[360px]">
    <!-- 标题和时间选择 -->
    <div class="header flex items-center justify-between mb-10px">
      <div class="flex items-center gap-8px">
        <div class="w-8px h-8px rounded-full bg-[--up-color]"></div>
        <span class="text-14px color-[--main-text] font-500">{{ t('marketNavigation') }}</span>
        <div class="time-tabs flex items-center">
          <span v-for="item in chainTab" :key="item"
            class="cursor-pointer px-4px py-4px rounded-4px transition-all flex items-center justify-center"
            :class="activeChain === item ? 'color-[--main-text] bg-[--main-list-hover]' : 'color-[--secondary-text]'"
            @click="activeChain = item">
            <img :src="`${configStore.token_logo_url}chain/${item}.png`" class="rd-50%" width="16" lazy alt="" />
          </span>
        </div>
      </div>
      <div class="time-tabs flex items-center gap-6px text-12px">
        <span v-for="item in timeTabs" :key="item" class="cursor-pointer px-8px py-4px rounded-4px transition-all"
          :class="activeTime === item ? 'color-[--main-text] bg-[--main-list-hover]' : 'color-[--secondary-text]'"
          @click="activeTime = item">
          {{ item }}
        </span>
      </div>
    </div>

    <!-- 总交易数和交易人数 -->
    <div class="stats-row flex items-center gap-8px mb-14px">
      <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-12px">
        <div class="text-12px color-[--secondary-text] mb-8px">{{ t('totalTransactions') }}</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4px">
            <svg width="12" height="14" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H2.4V11.4H0V6ZM8.4 3.6H10.8V11.4H8.4V3.6ZM4.2 0H6.6V11.4H4.2V0Z" fill="var(--main-text)" />
            </svg>
            <span class="text-18px font-600 color-[--main-text]">
              {{ currentTimeData ? formatNumberS(currentTimeData.order_cnt || '0') : '0' }}
            </span>
          </div>
          <span v-if="currentTimeData" class="text-12px"
            :class="getChangeClass(currentTimeData.order_cnt_period || '0')">
            {{ getChangeText(currentTimeData.order_cnt_period || '0') }}
          </span>
        </div>
      </div>
      <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-12px">
        <div class="text-12px color-[--secondary-text] mb-8px">{{ t('traderCount') }}</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4px">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.59998 3.8H7.39998V9.2H5.59998V11H4.39998V9.2H2.59998V3.8H4.39998V2H5.59998V3.8ZM11.6 6.8H13.4V12.2H11.6V14H10.4V12.2H8.59998V6.8H10.4V5H11.6V6.8Z"
                fill="var(--main-text)" />
            </svg>
            <span class="text-18px font-600 color-[--main-text]">
              {{ currentTimeData ? formatNumberS(currentTimeData.trader_cnt || '0') : '0' }}
            </span>
          </div>
          <span v-if="currentTimeData" class="text-12px"
            :class="getChangeClass(currentTimeData.trader_cnt_period || '0')">
            {{ getChangeText(currentTimeData.trader_cnt_period || '0') }}
          </span>
        </div>
      </div>
    </div>

    <!-- 24h 成交额进度条 -->
    <div class="volume-bar mb-14px">
      <div class="flex items-center justify-between mb-8px text-12px">
        <span class="color-[--secondary-text]">{{ t('24hVolume') }}</span>
        <div class="flex items-center gap-4px">
          <span class="color-[--main-text] font-600">
            {{ currentTimeData ? formatNumberS((parseFloat(currentTimeData.buy_volume || '0') +
              parseFloat(currentTimeData.sell_volume || '0')).toString()) : '$0' }}
          </span>
          <span v-if="currentTimeData" class="text-12px"
            :class="getChangeClass(getAverageChange(currentTimeData.buy_volume_period || '0', currentTimeData.sell_volume_period || '0'))">
            {{ getChangeText(getAverageChange(currentTimeData.buy_volume_period || '0',
              currentTimeData.sell_volume_period || '0')) }}
          </span>
        </div>
      </div>
      <div class="progress-bar relative h-8px rounded-4px overflow-hidden bg-[--main-bg]">
        <div class="absolute left-0 top-0 h-full bg-[--up-color]" :style="`width: ${getBuySellRatio().buyWidth}%`">
        </div>
        <div class="absolute right-0 top-0 h-full bg-[--down-color]" :style="`width: ${getBuySellRatio().sellWidth}%`">
        </div>
      </div>
      <div class="flex items-center justify-between mt-4px text-12px">
        <span class="color-[--up-color]">
          {{ currentTimeData ? formatNumberS(currentTimeData.buy_cnt || '0') + ' / ' +
            formatNumberS(currentTimeData.buy_volume || '0', 2) : '0 / $0' }}
        </span>
        <span class="color-[--down-color]">
          {{ currentTimeData ? formatNumberS(currentTimeData.sell_cnt || '0') + ' / ' +
            formatNumberS(currentTimeData.sell_volume || '0', 2) : '0 / $0' }}
        </span>
      </div>
    </div>

    <!-- 代币统计 -->
    <div class="token-stats mb-14px">
      <div class="flex items-center gap-4px mb-4px">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.5332 10.1338C14.5332 12.1221 11.5785 13.7333 7.93359 13.7334C4.35354 13.7334 1.43876 12.1793 1.33594 10.2402L1.33301 10.1338V8.93359C1.33301 10.922 4.28859 12.5342 7.93359 12.5342C11.5785 12.5341 14.5332 10.9219 14.5332 8.93359V10.1338ZM14.5996 8C14.5996 9.98839 11.645 11.6006 8 11.6006C4.4198 11.6006 1.50592 10.0456 1.40332 8.10645L1.40039 8V6.80078C1.40071 8.78903 4.3552 10.4004 8 10.4004C11.6448 10.4004 14.5993 8.78903 14.5996 6.80078V8ZM8 2C11.645 2.00001 14.5996 3.61219 14.5996 5.60059C14.5995 7.58892 11.6449 9.20018 8 9.2002C4.35508 9.2002 1.40052 7.58893 1.40039 5.60059C1.40039 3.61219 4.355 2 8 2Z"
            fill="var(--main-text)" />
        </svg>
        <span class="text-14px color-[--main-text] font-500">{{ t('tokenStats') }}</span>
      </div>
      <div class="flex items-center gap-8px">
        <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-10px">
          <div class="text-12px color-[--secondary-text] mb-8px">{{ t('created') }}</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4px">
              <Icon name="mdi:rocket-launch" class="text-16px color-[--main-text]" />
              <span class="text-16px font-600 color-[--main-text]">
                {{ currentTimeData ? formatNumberS(currentTimeData.new_pair || '0') : '0' }}
              </span>
            </div>
            <span v-if="currentTimeData" class="text-12px"
              :class="getChangeClass(currentTimeData.new_pair_period || '0')">
              {{ getChangeText(currentTimeData.new_pair_period || '0') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶级发射平台 -->
    <div class="top-platforms">
      <div class="text-12px color-[--secondary-text] mb-4px">{{ t('topPlatforms') }}</div>
      <div class="flex items-center gap-8px">
        <div v-for="platform in platforms" :key="platform.name"
          class="flex gap-8px w-[130px] border border-solid border-[var(--border)] rounded-8px px-6px py-8px">
          <div class="flex items-center">
            <div class="w-34px h-34px rounded-full bg-[--main-bg] flex-center"
              :style="{ border: `1px solid ${platform.color}` }">
              <img :src="platform.icon" width="22" height="22" fit="contain" />
            </div>
          </div>
          <div>
            <div class="text-14px font-600" :style="{ color: platform.color }">{{ platform.amount }}</div>
            <div class="text-12px -mt-1px" :class="platform.change > 0 ? 'color-[--up-color]' : 'color-[--down-color]'">
              {{ platform.change > 0 ? '+' : '' }}{{ platform.change }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDashboardData, type DashboardDataResponse, type DashboardStatItem } from '@/api/market'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const configStore = useConfigStore()
const timeTabs = ['5m', '1h', '6h', '24h']
const chainTab = ['solana', 'bsc'];
const activeTime = ref('24h')
const activeChain = ref('bsc')
const currentTimeData = ref<DashboardStatItem | null>(null)
const dashboardData = ref<DashboardDataResponse | null>(null)
const platforms = ref([])
const getChangeClass = (value: string): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  return num >= 0 ? 'color-[--up-color]' : 'color-[--down-color]'
}

const getChangeText = (value: string): string => {
  const num = parseFloat(value).toFixed(2)
  if (isNaN(num)) return ''
  return `${num >= 0 ? '+' : ''}${num}%`
}

const getAverageChange = (value1: string, value2: string): string => {
  const num1 = parseFloat(value1)
  const num2 = parseFloat(value2)

  if (isNaN(num1) || isNaN(num2)) return '0'

  return ((num1 + num2) / 2).toString()
}

const getBuySellRatio = () => {
  if (!currentTimeData.value) {
    return { buyWidth: 58, sellWidth: 42 } // 默认比例
  }

  const buyCnt = parseInt(currentTimeData.value.buy_cnt || '0')
  const sellCnt = parseInt(currentTimeData.value.sell_cnt || '0')

  if (buyCnt === 0 && sellCnt === 0) {
    return { buyWidth: 50, sellWidth: 50 } // 如果都没有，则各占50%
  }

  const total = buyCnt + sellCnt
  const buyWidth = Math.round((buyCnt / total) * 100)
  const sellWidth = 100 - buyWidth

  return { buyWidth, sellWidth }
}

const _getDashboardData = async () => {
  try {
    const res = await getDashboardData()
    dashboardData.value = res
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

const updateCurrentTimeData = () => {

  if (!dashboardData.value) return
  const timePeriod = activeTime.value.toLowerCase()
  // 获取钱包store和链信息，如果没有连接钱包则使用默认值
  // 根据链类型确定平台标识
  const platform = activeChain.value === 'bsc' ? 'bsc_fourmemev2' : 'solana_pump'
  const key = `${timePeriod}_${platform}`
  // 尝试查找匹配的数据
  if (dashboardData.value[key]) {
    const value = dashboardData.value[key]
    console.log(key, JSON.stringify(value))
    currentTimeData.value = value

    if (activeChain.value === 'bsc') {
      platforms.value = [
        {
          name: 'fourmeme',
          icon: `${configStore.token_logo_url}signals/four.meme.png`,
          color: '#50E98F',
          amount: formatNumberS(value.buy_volume),
          change: value.buy_volume_period
        },
      ]
    } else {
      platforms.value = [
        {
          name: 'pump',
          icon: `${configStore.token_logo_url}signals/pump.fun.png`,
          color: '#10b981',
          amount: formatNumberS(value.buy_volume),
          change: value.buy_volume_period
        },
      ]
    }
  }
}

// 初始化时获取数据
onMounted(() => {
  _getDashboardData().then(() => {
    updateCurrentTimeData()
  })
})

// 监听时间选项变化
watch(() => activeTime.value, () => {
  _getDashboardData().then(() => {
    updateCurrentTimeData()
  })
})

// 监听钱包链变化
watch(() => activeChain.value, () => {
  updateCurrentTimeData()
})
</script>
