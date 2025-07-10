<template>
  <div :style="style" :class="klass" @click="emit('click',$event)">
    <slot/>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  click: [ event: MouseEvent ]
}>()
interface Props {
  type?: 'primary' | 'success' | 'danger'
  round?: boolean
  size?: 'large' | 'default' | 'small'
  color?: string
  bgColor?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  round: true,
  size: 'default',
  color: '',
  bgColor: '',
  disabled: false
})
const style = ref<string[]>([])
const klass = ref<string[]>([])

watch(props , (val) => {
  const {type, round, size, color ,disabled ,bgColor} =val
  klass.value = ['default', type, size, !round ? 'noRound' : '', disabled ? 'disabled' : '']
  style.value = [`background-color:${bgColor}`, `color:${color}`]
} , { immediate: true })
</script>

<style lang="scss" scoped>
.default{
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  color: #3F80F7;
  background-color: #3F80F71A;
  font-family: SF Pro;
  font-weight: 400;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  border-radius: 4px;
  border: 0 none;
  &.primary{
    color: #3F80F7;
    background-color: #3F80F71A;
  }
  &.success{
    color: #12B886;
    background-color: #12B8861A;
  }
  &.danger{
    color: #F6465D;
    background-color: #F6465D1A;
  }
  &.large{
    padding-left: 12px;
    padding-right: 12px;
    font-size: 13px;
    border-radius: 6px;
    height: 24px;
  }
  &.default{
    padding-left: 8px;
    padding-right: 8px;
    font-size: 12px;
    height: 20px;
  }
  &.small{
    padding-left: 4px;
    padding-right: 4px;
    font-size: 10px;
    height: 16px;
  }
  &.noRound{
    border-radius: 0px;
  }
  &.disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }
}

</style>

