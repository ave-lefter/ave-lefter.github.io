<template>
  <el-image
    class="token-icon"
    :class="themeStore.theme"
    :style="{
      width: `${props.width}px`,
    }"
    :src="`${s3BaseUrl}chain/${props.chain}.png`"
  >
    <template #error>
      <img :width="props.width" class="token-icon" src="/icon-default.png" >
    </template>
    <template #placeholder>
      <img :width="width" class="token-icon" src="/icon-default.png" >
    </template>
  </el-image>
</template>

<script setup lang="ts">
const configStore = useConfigStore()
const s3BaseUrl = configStore.token_logo_url
const themeStore = useThemeStore()
const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 24,
  },
})
</script>

<style scoped lang="scss">
.token-icon {
  display: flex;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
}
</style>
