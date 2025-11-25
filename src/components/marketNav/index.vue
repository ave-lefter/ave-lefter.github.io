<template>
  <div class="bg-[--main-bg] rounded-8px p-12px min-w-[360px]">
    <!-- 标题和时间选择 -->
    <div class="header flex items-center justify-between mb-10px">
      <div class="flex items-center gap-8px">
        <div class="w-8px h-8px rounded-full bg-[--primary-color]"></div>
        <span class="text-14px color-[--main-text] font-500">市场 导航</span>
      </div>
      <div class="time-tabs flex items-center gap-12px text-12px">
        <span
          v-for="item in timeTabs"
          :key="item"
          class="cursor-pointer px-8px py-4px rounded-4px transition-all"
          :class="activeTime === item ? 'color-[--main-text] bg-[--main-list-hover]' : 'color-[--secondary-text]'"
          @click="activeTime = item"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- 总交易数和交易人数 -->
    <div class="stats-row flex items-center gap-8px mb-14px">
      <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-12px">
        <div class="text-12px color-[--secondary-text] mb-8px">总交易数</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4px">
            <Icon name="mdi:chart-bar" class="text-16px color-[--main-text]" />
            <span class="text-18px font-600 color-[--main-text]">7M</span>
          </div>
          <span class="text-12px color-[--up-color]">+3.61%</span>
        </div>
      </div>
      <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-12px">
        <div class="text-12px color-[--secondary-text] mb-8px">交易人数</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4px">
            <Icon name="mdi:account-group" class="text-16px color-[--main-text]" />
            <span class="text-18px font-600 color-[--main-text]">59.2K</span>
          </div>
          <span class="text-12px color-[--down-color]">-3.61%</span>
        </div>
      </div>
    </div>

    <!-- 24h 成交额进度条 -->
    <div class="volume-bar mb-14px">
      <div class="flex items-center justify-between mb-8px text-12px">
        <span class="color-[--secondary-text]">24h 成交额</span>
        <div class="flex items-center gap-4px">
          <span class="color-[--main-text] font-600">$4B</span>
          <span class="color-[--down-color]">-0.61%</span>
        </div>
      </div>
      <div class="progress-bar relative h-8px rounded-4px overflow-hidden bg-[--main-bg]">
        <div class="absolute left-0 top-0 h-full bg-[--up-color]" style="width: 58%"></div>
        <div class="absolute right-0 top-0 h-full bg-[--down-color]" style="width: 42%"></div>
      </div>
      <div class="flex items-center justify-between mt-4px text-12px">
        <span class="color-[--up-color]">2.78M / $2B</span>
        <span class="color-[--down-color]">1.8M / $2B</span>
      </div>
    </div>

    <!-- 代币统计 -->
    <div class="token-stats mb-14px">
      <div class="flex items-center gap-4px mb-4px">
        <Icon name="mdi:layers-triple" class="text-16px color-[--main-text]" />
        <span class="text-14px color-[--main-text] font-500">代币统计</span>
      </div>
      <div class="flex items-center gap-8px">
        <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-10px">
          <div class="text-12px color-[--secondary-text] mb-8px">创建</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4px">
              <Icon name="mdi:rocket-launch" class="text-16px color-[--main-text]" />
              <span class="text-16px font-600 color-[--main-text]">7M</span>
            </div>
            <span class="text-12px color-[--up-color]">+3.61%</span>
          </div>
        </div>
        <div class="stat-item flex-1 border border-solid border-[var(--border)] rounded-8px p-10px">
          <div class="text-12px color-[--secondary-text] mb-8px">已迁移</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4px">
              <Icon name="mdi:swap-horizontal" class="text-16px color-[--main-text]" />
              <span class="text-16px font-600 color-[--main-text]">59.2K</span>
            </div>
            <span class="text-12px color-[--down-color]">-3.61%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶级发射平台 -->
    <div class="top-platforms mb-14px">
      <div class="text-12px color-[--secondary-text] mb-4px">顶级发射平台</div>
      <div class="flex items-center gap-8px">
        <div v-for="platform in platforms" :key="platform.name" class="flex gap-8px w-[120px] border border-solid border-[var(--border)] rounded-8px px-6px py-8px">
          <div class="flex items-center">
            <div class="w-34px h-34px rounded-full flex-center" :style="{ backgroundColor: platform.color }">
              <Icon :name="platform.icon" class="text-14px text-white" />
            </div>
          </div>
          <div>
            <div class="text-14px font-600 color-[--main-text]">{{ platform.amount }}</div>
            <div class="text-12px -mt-1px" :class="platform.change > 0 ? 'color-[--up-color]' : 'color-[--down-color]'">
              {{ platform.change > 0 ? '+' : '' }}{{ platform.change }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶级协议 -->
    <div class="top-protocols">
      <div class="text-12px color-[--secondary-text] mb-4px">顶级协议</div>
      <div class="flex items-center gap-8px">
        <div v-for="protocol in protocols" :key="protocol.name" class="flex gap-8px w-[120px] border border-solid border-[var(--border)] rounded-8px px-6px py-8px">
          <div class="flex items-center">
            <div class="w-34px h-34px rounded-full flex-center" :style="{ backgroundColor: protocol.color }">
              <Icon :name="protocol.icon" class="text-14px text-white" />
            </div>
          </div>
          <div>
            <div class="text-14px font-600 color-[--main-text] mb-2px">{{ protocol.amount }}</div>
            <div class="text-12px -mt-1px" :class="protocol.change > 0 ? 'color-[--up-color]' : 'color-[--down-color]'">
              {{ protocol.change > 0 ? '+' : '' }}{{ protocol.change }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const timeTabs = ['5m', '1h', '6h', '24h']
const activeTime = ref('5m')

const platforms = [
  {
    name: 'pump.fun',
    icon: 'mdi:rocket-launch',
    color: '#10b981',
    amount: '$219.2M',
    change: 3.61
  },
  {
    name: 'moonshot',
    icon: 'mdi:moon-waxing-crescent',
    color: '#f59e0b',
    amount: '$219.2M',
    change: 3.61
  },
  {
    name: 'four.meme',
    icon: 'mdi:numeric-4-circle',
    color: '#10b981',
    amount: '$219.2M',
    change: -3.61
  }
]

const protocols = [
  {
    name: 'raydium',
    icon: 'mdi:swap-horizontal',
    color: '#6366f1',
    amount: '$219.2M',
    change: 3.61
  },
  {
    name: 'meteora',
    icon: 'mdi:meteor',
    color: '#8b5cf6',
    amount: '$219.2M',
    change: -3.61
  }
]
</script>
