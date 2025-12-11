<template>
  <div>
    <el-calendar>
      <template #header="{ date }">
        <div class="flex justify-between w-full mb-12px">
          <div class="flex items-center gap-4px text-12px h-16px">
            {{
              localeStore.locale === 'zh-cn'
                ? date.replaceAll(' ', '')
                : dayjs(date).format('MMM YYYY')
            }}
            <Icon class="color-[--third-text]" name="custom:calendar2" />
            <!-- custom:chart -->
          </div>
          <div class="text-12px">当月总盈亏: +$283K</div>
        </div>
      </template>
      <template #date-cell="{ data: { type, date } }">
        <template v-if="type === 'current-month'">
          <div class="text-center h-full" :class="getColor(Math.random() * 3000).bg">
            <span class="text-12px color-[--third-text] lh-14px">{{
              dayjs(date).format('DD')
            }}</span>
            <div class="text-12px lh-14px mt-2px" :class="getColor(Math.random() * 3000).color">
              {{ addSign(Math.random()) }}${{ formatNumber(Math.abs(Math.random() * 3000), 1) }}
            </div>
          </div>
        </template>
        <span v-else />
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const localeStore = useLocaleStore()
const getColor = (value) => {
  if (value === 0) {
    return {
      bg: 'bg-#12B88608',
      color: 'color-[--third-text]',
    }
  } else if (value < 0) {
    return {
      bg: 'bg-#F6465D1A',
      color: 'color-[--down-color]',
    }
  } else if (value > 2000) {
    return {
      bg: 'bg-#FFA6221A',
      color: 'color-[--yellow]',
    }
  } else {
    return {
      bg: 'bg-#12B8861A',
      color: 'color-[--up-color]',
    }
  }
}
</script>

<style scoped lang="scss">
:global(.el-calendar__header) {
  padding: 0;
  border-bottom: 0 none;
}
:global(.el-calendar__body) {
  padding: 0;
}

:global(.el-calendar-table tr td) {
  border: 0 none !important;
}

:global(.el-calendar-table .el-calendar-day) {
  height: 44px;
  padding: 2px;
  --el-calendar-selected-bg-color: transparent;
}

:global(.el-calendar-table .is-selected) {
  --el-calendar-selected-bg-color: transparent;
}

:global(.el-calendar-table thead th) {
  padding: 0;
  padding-bottom: 11px;
  font-size: 12px;
  line-height: 20px;
  color: var(--third-text);
}
</style>
