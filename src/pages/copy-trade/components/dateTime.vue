<template>
  <div class="flex flex-1 items-center">
    <!-- 开始时间 -->
    <el-input-number class="flex-1" v-model="startValue" :min="0" :controls="false" style="width: 221px">
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
    <el-input-number class="flex-1" v-model="endValue" :min="0" :controls="false" style="width: 221px">
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
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
}
const { t } = useI18n()
/** 对外输出 */
export interface TimeRange {
  startValue: number | null
  startUnit: string
  endValue: number  | null
  endUnit: string
}

const emit = defineEmits<{
  (e: 'change', value: TimeRange): void
}>()

/* ---------- 状态 ---------- */
const startValue = ref(null)
const startUnit = ref('hour')

const endValue = ref(null)
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
  emit('change', { startValue: startValue.value, startUnit: startUnit.value, endValue: endValue.value, endUnit: endUnit.value })
 },
  { deep: true }
)
onMounted(() => {
  startValue.value = advancedForm.value?.tokenAgeRange?.startValue?  advancedForm.value?.tokenAgeRange?.startValue : null
  startUnit.value = advancedForm.value?.tokenAgeRange?.startUnit ? advancedForm.value?.tokenAgeRange?.startUnit : 'hour'
  endValue.value = advancedForm.value?.tokenAgeRange?.endValue? advancedForm.value?.tokenAgeRange?.endValue : null
  endUnit.value = advancedForm.value?.tokenAgeRange?.endUnit ? advancedForm.value?.tokenAgeRange?.endUnit : 'hour'
})
const reset = ()=>{
  advancedForm.value.tokenAgeRange = {
    startValue: null,
    startUnit: 'hour',
    endValue: null,
    endUnit: 'hour',
  }
  startValue.value = null
  startUnit.value = 'hour'
  endValue.value = null
  endUnit.value = 'hour'
  console.log('------1111--------',startValue.value)
}
defineExpose({ reset })
</script>

<style scoped lang="scss">
</style>
