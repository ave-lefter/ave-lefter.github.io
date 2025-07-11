<template>
  <div class="percent-container" :style="{'--percent-active-color': activeColor}">
    <div for="percent-radio-0" :class="{'active': activePercent === 0}"/>
    <template v-for="(item, index) in percentList" :key="index">
      <div v-if="index !== 0" class="gap"/>
      <div class="label" :class="{'active': item === activePercent}" @click.stop="handleClick(item)">
        <div class="bar"/>
        <div class="text">{{ item }}%</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  activeColor: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['change'])
const activePercent = ref<number>(0)
const percentList = [25, 50, 75, 100]
const handleClick = (value: number, noChange = false) => {
  if (value === activePercent.value) {
    activePercent.value = 0
    emit('change', 0, noChange)
  } else {
    activePercent.value = value
    emit('change', value, noChange)
  }
}

defineExpose({
  handleClick
})

</script>

<style lang="scss" scoped>
.percent-container {
  display: flex;
  font-size: 10px;
  letter-spacing: 0;
  font-weight: 400;
  margin: 10px 0;
  .gap {
    width: 8px;
  }
  .label {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    // color: #BEBEBE;
    // color: #333333;
    color: #BEBEBE;
    .bar {
      background: #F5F6F7;
      background-color: var(--percent-active-color);
      height: 8px;
      width: 100%;
      margin-bottom: 3px;
      cursor: pointer;
    }
  }
  .active ~ .label {
    .bar {
      // background-color: var(--percent-active-color);
      background: var(--d-15171C-l-F6F6F6);
    }
    // color: #BEBEBE;
    color: #555b63;
  }
}
</style>
