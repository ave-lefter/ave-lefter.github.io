<template>
  <div class="relative">
    <div class="select-container clickable" @click.stop="selectRef?.focus?.()">
      <span>{{ expiredTimeName }}</span>
      <Icon class="clickable text-12px color-#999 ml-5px" name="solar:alt-arrow-down-bold" />
    </div>
    <el-select
      ref="selectRef"
      v-model="expiredTime1"
      placeholder="Select"
      size="small"
      style="width: 80px;opacity: 0;position: absolute;right: 0;top: 50%; transform: translateY(-50%);"
    >
      <el-option
        v-for="item in actions"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script setup lang="ts">

const { t } = useI18n()
const props = defineProps({
  expiredTime: {
    type: [Number, null] as PropType<number | null>,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'update:expiredTime'])

// const dialogVisible = ref(false)

const selectRef = useTemplateRef('selectRef')

const actions = computed(() => {
  const list = [
    { name: t('never'), value: '' },
    { name: t('10min'), value: 10 * 60 },
    { name: t('1h'), value: 60 * 60 },
    { name: t('1d'), value: 24 * 60 * 60 },
    { name: t('3d'), value: 3 * 24 * 60 * 60 },
    { name: t('7d'), value: 7 * 24 * 60 * 60 },
    // { name: this.$t('15d'), value: 15 * 24 * 60 * 60 },
  ]
  return list.map(i => {
    if (i.value === props.expiredTime) {
      return {
        ...i,
        color: '#286DFF '
      }
    }
    return i
  })
})

const expiredTimeName = computed(() => {
  return actions.value.find(i => i.value === (props.expiredTime === null ? '' : props.expiredTime))?.name
})

const expiredTime1 = computed({
  get() {
    return props.expiredTime === null ? '' : props.expiredTime
  },
  set(value) {
    emit('update:expiredTime', value === '' ? null : value)
  }
})

// function onSelect(item) {
//   emit('update:expiredTime', item.value)
//   dialogVisible.value = false
// }

</script>
<style lang="scss" scoped>
.select-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  letter-spacing: 0;
  // position: absolute;
  // right: 0;
  // top: 0;
  // z-index: -1;
}
.select-token {
  display: flex;
  align-items: center;

  &:active {
    opacity: 0.5;
  }
}
</style>
