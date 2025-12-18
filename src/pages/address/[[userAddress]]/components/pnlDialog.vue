<template>
  <el-dialog v-model="visible" append-to-body width="722px">
    <template #header>
      <div class="text-14px lh-20px color-[--main-text]">
        {{ t('pnlCalendar') }}
      </div>
      <div class="flex items-center gap-4px absolute left-0 right-0 top-20px justify-center">
        <Icon
          name="material-symbols:arrow-back-ios-new-rounded"
          class="cursor-pointer"
          @click="handlePrevMonth"
        />
        <span>{{ dayjs(selectedDate).format('YYYY-MM') }}</span>
        <Icon
          name="material-symbols:arrow-forward-ios"
          class="cursor-pointer"
          :class="{
            'cursor-not-allowed': nextDisabled,
          }"
          @click="handleNextMonth"
        />
      </div>
    </template>
    <!-- 当月总盈亏 -->
    <div class="text-12px mb-12px" :class="getColorClass(summary.month_total_profit)">
      {{ addSign(summary.month_total_profit) }}${{
        formatNumber(Math.abs(summary.month_total_profit), 1)
      }}
    </div>
    <div class="flex gap-2px mb-12px">
      <div class="h-4px rounded-2px bg-[--up-color]" :style="`width:${percent.profit}%`" />
      <div class="h-4px rounded-2px bg-[--down-color]" :style="`width:${percent.loss}%`" />
    </div>
    <div class="flex justify-between text-12px lh-16px mb-4px color-[--third-text] mb-24px">
      <div>
        <span class="color-[--up-color] text-12px">{{ summary.win_days_count }} </span>/
        <span class="color-[--up-color] text-12px">
          ${{ formatNumber(summary.total_profit_on_win_days, 1) }}
        </span>
      </div>
      <div>
        <span class="color-[--down-color] text-12px"> {{ summary.loss_days_count }} </span>/
        <span class="color-[--down-color] text-12px">
          ${{ formatNumber(Math.abs(summary.total_profit_on_loss_days), 1) }}
        </span>
      </div>
    </div>
    <el-calendar class="[&&]:[--el-calendar-cell-width:64px]" :range="range">
      <template #header>
        <span />
      </template>
      <template #date-cell="{ data: { date } }">
        <template v-if="dayjs(date).isSame(dayjs(selectedDate), 'month')">
          <div
            class="text-center h-full flex items-center flex-col justify-center"
            :class="[props.getColor(getPnl(date)).bg, getPnl(date) !== 0 ? 'cursor-pointer' : '']"
            @click="clickDay(date, $event)"
          >
            <span class="text-12px color-[--third-text] lh-14px">{{
              dayjs(date).format('DD')
            }}</span>
            <div class="text-12px lh-14px mt-2px" :class="props.getColor(getPnl(date)).color">
              {{ addSign(getPnl(date)) }}${{ formatNumber(Math.abs(getPnl(date)), 1) }}
            </div>
          </div>
        </template>
        <span v-else />
      </template>
    </el-calendar>
    <div class="mt-12px flex items-center justify-between">
      <div class="flex gap-16px text-12px">
        <span v-if="isCurrentMonth"
          >{{ t('currentStreak') }}:{{ summary.current_win_streak }}d</span
        >
        <span>{{ t('maxStreak') }}:{{ summary.max_consecutive_win_days }}d</span>
      </div>
      <div class="flex items-center gap-4px">
        <img height="26" src="~/assets/images/avedex_mobile_logo.png" />
        <div class="flex items-end gap-5px">
          <Icon name="custom:ave-ai" class="color-[--d-FFF-l-000] text-14px" />
        </div>
      </div>
    </div>
    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      trigger="click"
      :visible="popVisible"
      virtual-triggering
      :width="'auto'"
      append-to-body
      popper-style="--el-popover-bg-color: var(--tooltip);--el-bg-color-overlay:var(--tooltip)"
    >
      <div v-html="props.formatterTooltip({ value: dateMapToPnl[tooltipDate] })" />
    </el-popover>
  </el-dialog>
</template>
<script setup>
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { getProfitCalendar } from '~/api/wallet'

const visible = defineModel('visible')
const props = defineProps({
  getColor: {
    type: Function,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  userChain: {
    type: String,
    required: true,
  },
  formatterTooltip: {
    type: Function,
    required: true,
  },
})
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const dateMapToPnl = ref({})
const summary = ref({})
const buttonRef = ref(null)
const popVisible = ref(false)
const tooltipDate = ref('')
const { t } = useI18n()

const isCurrentMonth = computed(() => {
  return selectedDate.value === dayjs().format('YYYY-MM-DD')
})

const nextDisabled = computed(() => {
  return (
    dayjs(selectedDate.value).startOf('M').isAfter(dayjs().startOf('M')) ||
    dayjs(selectedDate.value).startOf('M').isSame(dayjs().startOf('M'))
  )
})

const range = computed(() => {
  return [
    dayjs(selectedDate.value).startOf('month').toDate(),
    dayjs(selectedDate.value).endOf('month').toDate(),
  ]
})

const percent = computed(() => {
  const { total_profit_on_win_days, total_profit_on_loss_days } = summary.value
  const total = new BigNumber(total_profit_on_win_days).plus(Math.abs(total_profit_on_loss_days))
  const profit = formatNumber(
    new BigNumber(total_profit_on_win_days).div(total).multipliedBy(100).toString(),
    1
  )
  const loss = formatNumber(
    new BigNumber(Math.abs(total_profit_on_loss_days)).div(total).multipliedBy(100).toString(),
    1
  )
  return {
    profit: +profit,
    loss: +loss,
  }
})

const getPnl = (date) => {
  return dateMapToPnl.value[dayjs(date).format('YYYY-MM-DD')]?.profit || 0
}
const _getProfitCalendar = async () => {
  const res = await getProfitCalendar({
    user_address: props.userAddress,
    user_chain: props.userChain,
    date: selectedDate.value,
  })
  ;(res.days || []).forEach((item) => {
    dateMapToPnl.value[item.date] = item
  })
  summary.value = res.summary || {}
}

watch(
  () => visible.value,
  (val) => {
    if (val) {
      _getProfitCalendar()
    }
  }
)

const handlePrevMonth = () => {
  selectedDate.value = dayjs(selectedDate.value).subtract(1, 'month').format('YYYY-MM-DD')
  _getProfitCalendar()
}
const handleNextMonth = () => {
  if (nextDisabled.value) {
    return
  }
  selectedDate.value = dayjs(selectedDate.value).add(1, 'month').format('YYYY-MM-DD')
  _getProfitCalendar()
}

const clickDay = (date, $event) => {
  const pnl = getPnl(date)
  popVisible.value = false
  if (pnl !== 0) {
    buttonRef.value = $event.currentTarget
    popVisible.value = true
    tooltipDate.value = dayjs(date).format('YYYY-MM-DD')
  }
}

const onClickOutside = (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target)) {
    popVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
<style scoped lang="scss"></style>
