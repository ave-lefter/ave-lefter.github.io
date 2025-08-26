<script setup lang="ts">
const {isDark} = storeToRefs(useThemeStore())
const props = defineProps({
  visible: Boolean,
  modelValue: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:visible', 'confirm', 'reset'])

const computedVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})
const filterArray = ref<(undefined | number)[]>([])
const isActive = computed(() => props.modelValue.filter(el => !!el).length > 0)

function onBlur(index: number) {
  const min = Number(filterArray.value[0])
  const max = Number(filterArray.value[1])
  const isMaxLessThanMin = max <= min
  if (index === 0 && isMaxLessThanMin) {
    filterArray.value[0] = undefined
  } else if (index === 1 && isMaxLessThanMin) {
    filterArray.value[1] = undefined
  }
}
</script>

<template>
  <el-popover
    v-model:visible="computedVisible"
    placement="bottom"
    :width="350"
    trigger="click"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        :class="`${isActive?'color-[--secondary-text]':'color-[--third-text]'} cursor-pointer text-10px`"
      />
    </template>
    <template #default>
      <div class="text-12px font-400">
        {{ $t('amountU') }}($)
      </div>
      <div class="flex mt-10px">
        <el-button
          v-for="(item,idx) in [10,100,200]"
          :key="idx"
          plain
          size="default"
          class="flex-1 h-30px font-400"
          @click.stop="filterArray[0]=item;filterArray[1]=undefined"
        >
          ≥{{ item }}
        </el-button>
      </div>
      <div class="flex mt-10px">
        <el-input-number
          v-model="filterArray[0]"
          :min="0" :controls="false"
          :placeholder="$t('minor')" clearable
          required
          @blur="onBlur(0)"
        />
        <span class="ml-10px mr-10px">~</span>
        <el-input-number
          v-model="filterArray[1]"
          :min="0" :controls="false"
          :placeholder="$t('max1')" clearable
          required
          @blur="onBlur(1)"
        />
      </div>
      <div class="flex mt-10px">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="isDark ? '#333':'#F2F2F2'"
          @click="filterArray.length=0;emit('confirm')"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button
          type="primary"
          class="h-30px flex-1 m-l-auto"
          @click="emit('confirm',filterArray.slice())"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>

</style>
