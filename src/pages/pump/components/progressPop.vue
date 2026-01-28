<template>
  <div class="color-#12B886 text-14px px-5px">
    <template v-if="isOut">
      <span v-if="selected?.issue_platform" class="mr-5px">{{ selected?.issue_platform }}</span>{{ selected?.in_pump_interval== 0 ? '0s' : formatTime(selected?.in_pump_interval || 0) }}{{ $t('bidCleared') }}
    </template>
    <template v-else> {{ $t('progress') }}:{{ formatNumber(selected?.progress || 0, 2) }}% </template>
  </div>
</template>

<script setup lang='ts'>
  defineProps({
    selected: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    isOut: {
      type: Boolean,
      default: false
    }
  })
</script>

<style>

</style>
