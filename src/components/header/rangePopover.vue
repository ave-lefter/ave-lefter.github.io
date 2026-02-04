<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  width: number
  title: string
  list: { text: string; value: string }[]
  selectRangeIndex: 0 | 1
  isFilterHighlight: boolean
  append?: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])
const popoverVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const rangeArr = ref<[string, string]>(['', ''])
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
:persistent="false"
    placement="bottom"
    title=""
    :width="width"
    trigger="click"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        class="text-10px clickable ml-5px"
        :class="isFilterHighlight ? 'color-[--d-999-l-666]' : ''"
        @click.stop
      />
    </template>
    <template #default>
      <div class="text-12px font-400 color-[--d-999-l-666]">
        {{ title }}
      </div>
      <ul class="mt-10px">
        <li v-for="(item, index) in list" :key="index">
          <a
            href="javascript:;"
            class="flex items-center justify-center text-12px leading-16px font-400 border border-solid border-[--d-333-l-F5F5F5] px-15px py-8px text-center mb-10px rounded-4px"
            :class="
              item.value === rangeArr[selectRangeIndex]
                ? 'border-[--d-F5F5F5-l-333] bg-[--d-333-l-F5F5F5]'
                : ''
            "
            @click.stop.prevent="onSelect(item)"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
      <div class="mt-20px flex">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="themeStore.isDark ? '#333' : '#F2F2F2'"
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
