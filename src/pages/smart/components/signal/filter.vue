<script setup lang="ts">
import type {ISignalFilter} from '~/api/signal'

const props = defineProps<{
  filterParams: ISignalFilter
}>()
const emit = defineEmits(['update:filterParams', 'onConfirm', 'onReset'])
const tempFilterParams = ref({
  token: '',
  history_count: undefined,
  mc_curr: undefined,
  mc_curr_sign: '<'
})

const filterVisible = shallowRef(false)
watch(filterVisible, val => {
  if (val) {
    tempFilterParams.value = {...props.filterParams}
  }
})
const mcOptions = shallowRef([
  {label: '<$500K', value: 5e5},
  {label: '<$1M', value: 1e6},
  {label: '<$10M', value: 1e7},
])
const themeStore = useThemeStore()

const currentFilterNum = shallowRef(0)
onMounted(() => {
  tempFilterParams.value = {...props.filterParams}
  updateCurrentNum()
})

function onConfirm() {
  filterVisible.value = false
  emit('onConfirm', tempFilterParams.value)
  updateCurrentNum()
}

function onReset() {
  filterVisible.value = false
  emit('onReset')
  currentFilterNum.value = 0
}

function updateCurrentNum() {
  currentFilterNum.value = Object.keys(tempFilterParams.value)
    .reduce((prev, curKey: keyof ISignalFilter) => {
      if (curKey !== 'mc_curr_sign' && tempFilterParams.value[curKey]) {
        return prev + 1
      }
      return prev
    }, 0)
}
</script>

<template>
  <div class="flex items-center color-[--d-999-l-666]">
    <el-popover
      v-model:visible="filterVisible"
      placement="bottom-end"
      trigger="click"
      :width="308"
    >
      <template #reference>
        <div class="flex items-center cursor-pointer text-12px gap-4px"
             v-tooltip="$t('FilterTips')"
        >
          <Icon
            name="custom:filter"
            class="text-12px cursor-pointer"
          />
          {{ $t('filter') }}
          <span class="w-14px h-14px rounded-2px bg-[--d-333-l-F2F2F2] color-[--d-F5F5F5-l-333] text-center lh-14px">{{
              currentFilterNum
            }}</span>
        </div>
      </template>
      <template #default>
        <div class="mb-12px text-16px color-[--d-F5F5F5-l-333]">
          {{ $t('filter') }}
        </div>
        <div class="mb-16px flex flex-col gap-8px text-12px">
          <label class="color-[--d-999-l-666]">{{ $t('TokenAddress') }}</label>
          <el-input
            v-model="tempFilterParams.token"
            size="large"
            :placeholder="$t('searchPlaceholder')"
            class="[&&]:[--el-input-bg-color:--d-333-l-F2F2F2] [&&]:[--el-input-border-color:transparent] [&&]:[--el-input-hover-border-color:--primary-color] [&&]:text-12px"
          />
        </div>
        <div class="mb-16px flex flex-col gap-8px text-12px">
          <label class="color-[--d-999-l-666]">{{ $t('SignalCount') }}</label>
          <div class="flex gap-8px">
            <div
              v-for="item in [2,5,15]"
              :key="item"
              class="flex-1 cursor-pointer h-32px bg-[--d-333-l-F2F2F2] border-solid border-1px border-[--d-222-l-F2F2F2] text-12px color-[--d-F5F5F5-l-333] flex items-center justify-center rounded-4px"
              :class="{
                'color-#3f80f7 border-color-#3f80f7':tempFilterParams.history_count === item
              }"
              @click="()=>{
                if(tempFilterParams.history_count !== item){
                  tempFilterParams.history_count = item
                } else {
                  tempFilterParams.history_count = undefined
                }
              }"
            >
              >{{ item }}
            </div>
          </div>
        </div>
        <div class="mb-16px flex flex-col gap-8px text-12px">
          <label class="color-[--d-999-l-666]">{{ $t('CurrentMC') }}</label>
          <div class="flex gap-8px">
            <div
              v-for="(item,idx) in mcOptions"
              :key="idx"
              class="flex-1 cursor-pointer h-32px bg-[--d-333-l-F2F2F2] border-solid border-1px border-[--d-222-l-F2F2F2] text-12px color-[--d-F5F5F5-l-333] flex items-center justify-center rounded-4px"
              :class="{
                'color-#3f80f7 border-color-#3f80f7':tempFilterParams.mc_curr === item.value
              }"
              @click="()=>{
                if(tempFilterParams.mc_curr !== item.value){
                  tempFilterParams.mc_curr = item.value
                } else {
                   tempFilterParams.mc_curr = undefined
                }
              }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="flex">
          <el-button
            class="h-32px flex-1 m-l-auto"
            :color="themeStore.isDark ? '#333':'#F2F2F2'"
            @click="onReset"
          >
            {{ $t('reset') }}
          </el-button>
          <el-button
            type="primary"
            class="h-32px flex-1 m-l-auto"
            @click="onConfirm"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>
