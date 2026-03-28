<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

const globalStore = useGlobalStore()
const { t } = useI18n()

const popoverVisible = shallowRef(false)

// Top10
const top10Arr = ref<[string, string]>([
  globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.holders_top10_ratio_min || '',
  globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.holders_top10_ratio_max || '',
])

// Dev
const devArr = ref<[string, string]>([
  globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.dev_balance_ratio_cur_min || '',
  globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.dev_balance_ratio_cur_max || '',
])

const isFilterHighlight = computed(() => {
  const f = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
  return !!(f?.holders_top10_ratio_min || f?.holders_top10_ratio_max ||
    f?.dev_balance_ratio_cur_min || f?.dev_balance_ratio_cur_max)
})

function handleReset() {
  top10Arr.value = ['', '']
  devArr.value = ['', '']
  props.setFilterForm(
    ['holders_top10_ratio_min', ''],
    ['holders_top10_ratio_max', ''],
    ['dev_balance_ratio_cur_min', ''],
    ['dev_balance_ratio_cur_max', ''],
  )
  popoverVisible.value = false
}

function handleConfirm() {
  if (devArr.value[1] && Number(devArr.value[1]) > 100) {
    ElMessage.error(t('maxGt100'))
    return
  }
  if (top10Arr.value[1] && top10Arr.value[0] && Number(top10Arr.value[1]) < Number(top10Arr.value[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  if (devArr.value[1] && devArr.value[0] && Number(devArr.value[1]) < Number(devArr.value[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  props.setFilterForm(
    ['holders_top10_ratio_min', top10Arr.value[0] || ''],
    ['holders_top10_ratio_max', top10Arr.value[1] || ''],
    ['dev_balance_ratio_cur_min', devArr.value[0] || ''],
    ['dev_balance_ratio_cur_max', devArr.value[1] || ''],
  )
  popoverVisible.value = false
}
</script>

<template>
  <div class="flex items-center justify-end gap-4px">
    <span>{{ $t('tokenInfoSecurity') }}</span>
    <el-popover
      v-model:visible="popoverVisible"
      placement="bottom"
      :width="240"
      class="hidden"
      trigger="click"
      style="display: none;"
      :persistent="false"
    >
      <template #reference>
        <Icon
          name="custom:filter"
          class="text-10px cursor-pointer"
          :class="isFilterHighlight ? 'color-[--primary-color]' : ''"
        />
      </template>
      <template #default>
        <!-- Top10 -->
        <div class="text-12px color-[--secondary-text] mb-8px">Top10 {{ $t('positions') }}(%)</div>
        <div class="flex items-center [--el-font-size-base:12px]">
          <el-input
            v-model.trim.number="top10Arr[0]"
            type="text"
            :placeholder="$t('min3')"
            style="--el-input-border-color:var(--border)"
            @input="(v) => (top10Arr[0] = v.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="mx-8px text-12px color-[--main-text]">-</span>
          <el-input
            v-model.trim.number="top10Arr[1]"
            type="text"
            :placeholder="$t('max')"
            style="--el-input-border-color:var(--border)"
            @input="(v) => (top10Arr[1] = v.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <!-- Dev -->
        <div class="text-12px color-[--secondary-text] mt-16px mb-8px">DEV {{ $t('positions') }}(%)</div>
        <div class="flex items-center [--el-font-size-base:12px]">
          <el-input
            v-model.trim.number="devArr[0]"
            type="text"
            :placeholder="$t('min3')"
            style="--el-input-border-color:var(--border)"
            @input="(v) => (devArr[0] = v.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="mx-8px text-12px color-[--main-text]">-</span>
          <el-input
            v-model.trim.number="devArr[1]"
            type="text"
            :placeholder="$t('max')"
            style="--el-input-border-color:var(--border)"
            @input="(v) => (devArr[1] = v.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <!-- 按钮 -->
        <div class="mt-20px flex gap-8px">
          <el-button class="h-30px flex-1" @click="handleReset">{{ $t('reset') }}</el-button>
          <el-button type="primary" class="h-30px flex-1" @click="handleConfirm">{{ $t('confirm') }}</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>
