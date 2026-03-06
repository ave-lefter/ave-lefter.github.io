<script setup lang="ts">
const props = defineProps<{
  filterParams: {
    token: string
    history_count: undefined | number
    mc_curr: undefined | number
    mc_curr_sign: string
  }
}>()
const globalStore = useGlobalStore()
const emit = defineEmits(['update:filterParams', 'onConfirm', 'onReset'])
const audioButtonRef = ref()
// const shouldAlert = computed({
//   get() {
//     return props.modelValue
//   },
//   set(value) {
//     emit('update:modelValue', value)
//   }
// })
const tempFilterParams = ref({
  token: '',
  history_count: undefined as undefined | number,
  mc_curr: undefined as undefined | number,
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
// const themeStore = useThemeStore()

const currentFilterNum = shallowRef(0)
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
onMounted(() => {
  tempFilterParams.value = {...props.filterParams}
  updateCurrentNum()
})

function updateCurrentNum() {
  currentFilterNum.value = Object.keys(tempFilterParams.value)
    .reduce((prev, curKey) => {
      if (curKey !== 'mc_curr_sign' && tempFilterParams.value[curKey as keyof typeof tempFilterParams.value]) {
        return prev + 1
      }
      return prev
    }, 0)
}
</script>

<template>
  <div class="flex items-center color-[--secondary-text]">
    <el-popover
      v-model:visible="filterVisible"
      placement="bottom-end"
      trigger="click"
      :width="308"
    >
      <template #reference>
        <div class="flex items-center gap-4px text-12px mr-8px">
          <Icon
          id="custom-filter"
          name="custom:filter"
          class="text-12px cursor-pointer"
        />
          <span v-if="currentFilterNum>0" class="w-14px h-14px rounded-2px bg-[--secondary-text] color-[--white] text-center lh-14px">{{
                currentFilterNum
          }}</span>
        </div>
      </template>
      <template #default>
        <div class="mb-12px text-16px color-[--main-text]">
          {{ $t('filter') }}
        </div>
        <div class="mb-16px flex flex-col gap-8px text-12px">
          <label class="color-[--secondary-text]">{{ $t('TokenAddress') }}</label>
          <el-input
            v-model="tempFilterParams.token"
            size="large"
            
            :placeholder="$t('searchPlaceholder')"
            class="[&&]:[--el-input-bg-color:--border] [&&]:[--el-input-border-color:--border] [&&]:[--el-input-hover-border-color:--primary-color] [&&]:text-12px"
          />
        </div>
        <div class="mb-16px flex flex-col gap-8px text-12px">
          <label class="color-[--secondary-text]">{{ $t('SignalCount') }}</label>
          <div class="flex gap-8px">
            <div
              v-for="item in [2,5,15]"
              :key="item"
              class="flex-1 cursor-pointer h-32px bg-[--border] border-solid border-1px border-[--border] text-12px color-[--main-text] flex items-center justify-center rounded-4px"
              :class="{
                'color-[--primary-color] border-color-[--primary-color]':tempFilterParams.history_count === item
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
          <label class="color-[--secondary-text]">{{ $t('CurrentMC') }}</label>
          <div class="flex gap-8px">
            <div
              v-for="(item,idx) in mcOptions"
              :key="idx"
              class="flex-1 cursor-pointer h-32px bg-[--border] border-solid border-1px border-[--border] text-12px color-[--main-text] flex items-center justify-center rounded-4px"
              :class="{
                'color-[--primary-color] border-color-[--primary-color]':tempFilterParams.mc_curr === item.value
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
    <Icon
      ref="audioButtonRef"
      :name="globalStore.audioSettings.audio.signal ? 'custom:ad':'custom:admute'"
      class="mr-4px cursor-pointer"
    />
    <!-- <el-switch
      v-model="shouldAlert"
      size="small"
      active-value="1"
      inactive-value="0"/> -->
    <AudioPopover v-if="audioButtonRef" :buttonRef="audioButtonRef" type="signal"/>
  </div>
</template>

<style scoped lang="scss">

</style>
