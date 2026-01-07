<template>
  <div class="flex flex-1 items-center">
    <!-- 开始时间 -->
    <el-input-number class="flex-1 input-number-date" align="left" v-model="startValue" :min="0" :controls="false" style="width: 221px">
      <template #suffix>
        <el-select class="small" v-model="startUnit" :suffix-icon="SuffixIcon">
          <el-option
            v-for="(item, $index) in list"
            :key="$index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-input-number>
    <span class="gap px-4px">~</span>
    <el-input-number class="flex-1 input-number-date" align="left" v-model="endValue" :min="0" :controls="false" style="width: 221px">
      <template #suffix>
        <el-select class="small" v-model="endUnit" :suffix-icon="SuffixIcon" >
          <el-option
            v-for="(item, $index) in list"
            :key="$index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-input-number>
  </div>
</template>

<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'
const { advancedForm } = storeToRefs(useCopyTradeStore())
type TimeUnit = 'second' | 'minute' | 'hour' | 'day'
const unitMs: Record<TimeUnit, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
}
const { t } = useI18n()
/** 对外输出 */
export interface TimeRange {
  startTime: number
  endTime: number
}

const emit = defineEmits<{
  (e: 'change', value: TimeRange): void
}>()

/* ---------- 状态 ---------- */
const startValue = ref<number | null>(null)
const startUnit = ref('hour')

const endValue = ref<number | null>(null)
const endUnit = ref('hour')

/* ---------- 单位权重（用于比较） ---------- */

const unitWeight: Record<TimeUnit, number> = {
  second: 1,
  minute: 2,
  hour: 3,
  day: 4,
}

/* ---------- 输入层强约束（你要求的规则） ---------- */

const list = computed(() => [
  { value: 'second', name: t('SS') },
  { value: 'minute', name: t('min2') },
  { value: 'hour', name: t('H1') },
  { value: 'day', name: t('D') },
])
watch([startValue, startUnit, endValue, endUnit], () => {
  // 1️⃣ 数字：前 < 后
  if (unitWeight[startUnit.value] == unitWeight[endUnit.value]) {
    if (startValue.value  && endValue.value && startValue.value >= endValue.value) {
    endValue.value = startValue.value + 1
    }
  }
  // 2️⃣ 单位：前 ≤ 后
  if (unitWeight[startUnit.value] > unitWeight[endUnit.value]) {
    endUnit.value = startUnit.value
  }
  const  startTime = Number(startValue.value || 0) * (unitMs[startUnit.value] || 0)
  const endTime = Number(endValue.value || 0) * (unitMs[endUnit.value] || 0)
  emit('change', { startTime, endTime })
 },
  { deep: true }
)
watch(() => advancedForm.value?.minTokenAge, () => {
  if (advancedForm.value?.minTokenAge) {
    const { value, unit } = parseSeconds(advancedForm.value?.minTokenAge)
    startValue.value = value || null
    startUnit.value = unit || 'minute'
  } else {
    startValue.value =  null
    startUnit.value = 'minute'
  }
})
watch(()=>advancedForm.value?.maxTokenAge, () => {
  if (advancedForm.value?.maxTokenAge) {
    const { value, unit } = parseSeconds(advancedForm.value?.maxTokenAge)
    endValue.value = value || null
    endUnit.value = unit || 'minute'
  } else {
    endValue.value = null
    endUnit.value = 'minute'
  }
})
onMounted(() => {
    if (advancedForm.value?.minTokenAge) {
      const { value, unit } = parseSeconds(advancedForm.value?.minTokenAge)
      startValue.value = value || null
      startUnit.value = unit || 'minute'
    }else {
      startValue.value =  null
      startUnit.value = 'minute'
    }
    if (advancedForm.value?.maxTokenAge) {
      const { value, unit } = parseSeconds(advancedForm.value?.maxTokenAge)
      endValue.value = value || null
      endUnit.value = unit || 'minute'
    } else {
      endValue.value = null
      endUnit.value = 'minute'
    }
})
function parseSeconds(seconds: number): {
  value: number | null
  unit: TimeUnit
} {
  if (!seconds || seconds <= 0) {
    return { value: null, unit: 'minute' }
  }

  const entries = Object.entries(unitMs)
    .sort((a, b) => b[1] - a[1]) as [TimeUnit, number][]

  for (const [unit, base] of entries) {
    if (seconds % base === 0) {
      return {
        value: seconds / base,
        unit,
      }
    }
  }

  // 理论上不会走到这里，兜底
  return {
    value: seconds,
    unit: 'second',
  }
}
const reset = ()=>{
  advancedForm.value.minTokenAge = 0
  advancedForm.value.maxTokenAge = 0
  startValue.value = null
  startUnit.value = 'hour'
  endValue.value = null
  endUnit.value = 'hour'
}
defineExpose({ reset })
</script>

<style scoped lang="scss">
</style>
