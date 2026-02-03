<script setup lang="ts">
const props = defineProps<{
  activeInterval: string
  row: any
}>()
const lowerCaseInterval = computed(() => props.activeInterval)
const volPrefix = computed(() => `volume_u_${lowerCaseInterval.value}`)
const buyPrefix = computed(() => `buy_volume_u_${lowerCaseInterval.value}`)
const sellPrefix = computed(() => `sell_volume_u_${lowerCaseInterval.value}`)
const txsPrefix = computed(() => `tx_${lowerCaseInterval.value}_count`)
const buyTxsPre = computed(() => `buys_tx_${lowerCaseInterval.value}_count`)
const sellTxsPre = computed(() => `sells_tx_${lowerCaseInterval.value}_count`)

function formatColor(val, activeInterval = lowerCaseInterval.value) {
  // 如果没有值，返回灰色
  if (!val) return 'color-[--third-text]'

  if (activeInterval === '24h') {
    if (val >= 10000000) return 'color-[--yellow]' // 黄色: >= 10M
    if (val >= 1000000) return 'color-[--main-text]' // 白色: >= 1M
    return 'color-[--secondary-text]' // 灰色: < 1M
  }

  // 其他时间区间的逻辑保持不变
  if (activeInterval === '1m') {
    if (val > 6945) return 'color-[--yellow]'
  }
  if (activeInterval === '5m') {
    if (val > 34722) return 'color-[--yellow]'
  }
  if (activeInterval === '15m') {
    if (val > 104167) return 'color-[--yellow]'
  }
  if (activeInterval === '1h') {
    if (val > 416667) return 'color-[--yellow]'
  }
  if (activeInterval === '4h') {
    if (val > 1666667) return 'color-[--yellow]'
  }

  return 'color-[--secondary-text]'
}
</script>
<template>
  <div>
    <div
      class="flex justify-end lh-18px mb-2px decorate decoration-dotted"
      :class="formatColor(row[volPrefix])"
    >
      <el-popover :width="240" :persistent="false">
        <template #reference> ${{ formatNumber(row[volPrefix] || 0, 1) }} </template>
        <template #default>
          <div class="flex justify-between color-[--third-text] text-12px lh-16px mb-8px">
            <span class="flex-1">{{ activeInterval }} {{ $t('vol') }}</span>
            <span class="flex-1 text-center">{{ $t('VolBuy') }}</span>
            <span class="flex-1 text-right">{{ $t('VolSell') }}</span>
          </div>
          <div class="py-8px mx--12px px-12px mb-16px">
            <div class="flex justify-between text-12px lh-16px mb-4px">
              <span class="color-[--secondary-text]">${{ formatNumber(row[volPrefix], 2) }}</span>
              <span class="color-[--up-color]">${{ formatNumber(row[buyPrefix], 2) }}</span>
              <span class="color-[--down-color]">${{ formatNumber(row[sellPrefix], 2) }}</span>
            </div>
            <div class="flex gap-2px">
              <div
                class="h-4px rounded-2px bg-[--up-color]"
                :style="`width:${((row[buyPrefix] / row[volPrefix]) * 100).toFixed(1)}%`"
              />
              <div
                class="h-4px rounded-2px bg-[--down-color]"
                :style="`width:${((row[sellPrefix] / row[volPrefix]) * 100).toFixed(1)}%`"
              />
            </div>
          </div>
          <div class="flex justify-between color-[--third-text] text-12px lh-16px mb-8px">
            <span class="flex-1">{{ $t('txns') }}</span>
            <span class="flex-1 text-center">{{ $t('TxnsBuy') }}</span>
            <span class="flex-1 text-right">{{ $t('TxnsSell') }}</span>
          </div>
          <div class="py-8px mx--12px px-12px">
            <div class="flex justify-between text-12px lh-16px mb-4px">
              <span class="color-[--secondary-text]">{{ formatNumber(row[txsPrefix], 2) }}</span>
              <span class="color-[--up-color]">{{ formatNumber(row[buyTxsPre], 2) }}</span>
              <span class="color-[--down-color]">{{ formatNumber(row[sellTxsPre], 2) }}</span>
            </div>
            <div class="flex gap-2px">
              <div
                class="h-4px rounded-2px bg-[--up-color]"
                :style="`width:${((row[buyTxsPre] / row[txsPrefix]) * 100).toFixed(1)}%`"
              />
              <div
                class="h-4px rounded-2px bg-[--down-color]"
                :style="`width:${((row[sellTxsPre] / row[txsPrefix]) * 100).toFixed(1)}%`"
              />
            </div>
          </div>
        </template>
      </el-popover>
    </div>

    <div class="flex justify-end color-[--third-text] text-12px lh-16px">
      {{ row[txsPrefix] > 0 ? formatNumber(row[txsPrefix], 0) : 0 }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.is-hovered {
  .decorate {
    text-decoration-line: underline;
  }
}
</style>
