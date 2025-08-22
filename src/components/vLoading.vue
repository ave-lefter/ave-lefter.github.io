<template>
  <div class="el-loading-spinner">
    <svg class="circular" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none"/></svg>
  </div>
</template>

<script setup lang='ts'>
defineProps({
  strokeWidth: {
    type: Number,
    default: 3
  },
  color: {
    type: String,
    default: 'var(--el-color-primary)'
  }
})
</script>

<style scoped lang="scss">
.el-loading-spinner {
  top: auto;
  margin-top: 0;
  width: auto;
  position: static;
  display: inline-flex;
  --el-loading-spinner-size: 1em;
  .path {
    stroke-width: v-bind(strokeWidth);
    stroke: v-bind(color);
  }
}

@layer{
  .el-loading-spinner{
    font-size: 20px;
  }
}

</style>
