<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  width: number
  title: string
  list: { text: string; value: string }[]
  selectRangeIndex: 0 | 1
  isFilterHighlight: boolean
  append?: string
  sortKey?:string
}>()

const globalStore = useGlobalStore()
const emit = defineEmits(['update:modelValue', 'confirm'])
const popoverVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const setupFilter = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
const defaultRangeArr = computed(()=>{
  const arr = [setupFilter?.[`${props.sortKey}_min`] || '', setupFilter?.[`${props.sortKey}_max`] || '']
  if(props.sortKey === 'created_at'){
    return arr.reverse()
  }
  return arr
})
const rangeArr = ref<[string, string]>(defaultRangeArr.value)

watch(()=>{
  const newFilter = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
  return [newFilter?.[`${props.sortKey}_min`], newFilter?.[`${props.sortKey}_max`]]
},([minVal,maxVal])=>{
  // if(minVal){
    rangeArr.value[1] = minVal
  // }
  // if(maxVal){
    rangeArr.value[0] = maxVal
  // }
  emit('confirm',rangeArr.value)
})
function confirm(params?: [string, string]) {
  if (!params) {
    rangeArr.value = ['', '']
  }
  emit('confirm', params)
}
const themeStore = useThemeStore()
function onSelect(item: { text: string; value: string }) {
  if (!item.value) {
    rangeArr.value[0] = ''
    rangeArr.value[1] = ''
  } else {
    rangeArr.value[props.selectRangeIndex] = item.value
  }
}
</script>

<template>
  <el-popover
    v-model:visible="popoverVisible"
    placement="bottom"
    title=""
    :width="width"
    trigger="click"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        class="text-10px cursor-pointer"
        :class="isFilterHighlight ? 'color-[--secondary-text]' : ''"
      />
    </template>
    <template #default>
      <div class="text-12px font-400 color-[--secondary-text]">
        {{ title }}
      </div>
      <ul class="mt-10px">
        <li v-for="(item, index) in list" :key="index">
          <a
            href="javascript:;"
            class="flex items-center justify-center text-12px leading-16px font-400 border border-solid px-15px py-8px text-center mb-10px rounded-4px"
            :class="
              item.value === rangeArr[selectRangeIndex]
                ? 'border-[--primary-color] [&&]:color-[--primary-color] bg-[--border]'
                : 'border-[--border] color-[--main-text]'
            "
            @click.stop.prevent="onSelect(item)"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
      <div class="flex items-center mt-10px [--el-font-size-base:12px]">
        <el-input
          v-model.trim.number="rangeArr[0]"
          clearable
          type="text"
          :placeholder="$t('min3')"
          style="--el-input-border-color:var(--border);"
          @input="(value) => (rangeArr[0] = value.replace(/\-|[^\d.]/g, ''))"
        >
          <template v-if="append" #suffix>{{ append }}</template>
        </el-input>
        <span class="ml-10px mr-10px text-12px color-[--main-text]">~</span>
        <el-input
          v-model.trim.number="rangeArr[1]"
          clearable
          type="text"
           :placeholder="$t('max')"
           style="--el-input-border-color:var(--border)"
          @input="(value) => (rangeArr[1] = value.replace(/\-|[^\d.]/g, ''))"
        >
          <template v-if="append" #suffix>{{ append }}</template>
        </el-input>
      </div>
      <div class="mt-20px flex">
        <el-button
          class="h-30px flex-1 m-l-auto"
          @click="confirm()"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" class="h-30px flex-1 m-l-auto" @click="confirm(rangeArr)">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-popover>
</template>
