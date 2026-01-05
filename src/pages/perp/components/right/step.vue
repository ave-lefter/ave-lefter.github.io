<template>
  <div
    class="flex items-center justify-between bg-[--dialog-divider] rounded-4px px-5 h-12 w-full select-none step"
  >
    <!-- 减号按钮 -->
    <button
      class="color-[--main-text] transition-transform duration-100 cursor-pointer  flex items-center justify-center active:scale-90"
      :class="minDisabled && 'opacity-30 cursor-not-allowed'"
      @mousedown="start('minus')"
      @mouseup="stop"
      @mouseleave="stop"
      @touchstart.prevent="start('minus')"
      @touchend="stop"
    >
    <Icon name="majesticons:minus"  class="text-24px"/>
    </button>
    <span class="flex-1"/>
    <!--可输入的数字 -->

    <input
      name="step"
      class="w-60px bg-transparent outline-none text-center border-none text-18px"
      :value="inputValue"
      @input="onInput"
      @blur="onBlur"
    >X
    <span class="flex-1"/>
    <!-- 加号按钮 -->
    <button
      class="color-[--main-text] transition-transform duration-100 cursor-pointer flex items-center justify-center active:scale-90 "
      :class="maxDisabled && 'opacity-30 cursor-not-allowed'"
      @mousedown="start('plus')"
      @mouseup="stop"
      @mouseleave="stop"
      @touchstart.prevent="start('plus')"
      @touchend="stop"
    >
    <Icon name="majesticons:plus"  class="text-24px"/>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  longPressSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: Infinity,
  step: 1,
  longPressSpeed: 120
})

const emits = defineEmits<{
  'update:modelValue': [number],
  'change': [number],
}>()

// 输入框的本地值
const inputValue = ref(String(props.modelValue))

watch(
  () => props.modelValue,
  (v) => {
    inputValue.value = String(v)
  }
)

// 是否禁用按钮
const minDisabled = computed(() => props.modelValue <= props.min!)
const maxDisabled = computed(() => props.modelValue >= props.max!)

function update(v: number) {
  emits('update:modelValue', v)
}

// 点击加减
function minus() {
  if (minDisabled.value) return
  update(props.modelValue - props.step)
}

function plus() {
  if (maxDisabled.value) return
  update(props.modelValue + props.step)
}

let timer: any = null

// 长按
function start(type: 'plus' | 'minus') {
  type === 'minus' ? minus() : plus()

  stop()

  timer = setInterval(() => {
    type === 'minus' ? minus() : plus()
  }, props.longPressSpeed)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 输入监听（只允许数字）
function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/[^\d]/g, '')

  // 如果最大值是 0~9 的一位数
  if (props.max < 10) {
    val = val.slice(0, 1) // 限制只能一位
  }

  // 阻止最终结果超过 max（关键逻辑）
  if (Number(val) > props.max) {
    val = inputValue.value // 回退成上一次合法值
  }
  const num = Number(val)
  inputValue.value = val
  target.value = val // 关键：同步回到输入框，不然 UI 显示不及时
  emits('change', num)
}

// 失焦后校验 + 同步
function onBlur() {
  let num = Number(inputValue.value)

  // 范围限制
  if (num) {
    if (num < props.min!) num = props.min!
    if (num > props.max!) num = props.max!
  }
  update(num)
  emits('change', num)
}
</script>

<style scoped lang="scss">
.step{
  &:focus-within{
    border: 1px solid var(--main-text);
  }
}
button {
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bolder;
}
</style>
