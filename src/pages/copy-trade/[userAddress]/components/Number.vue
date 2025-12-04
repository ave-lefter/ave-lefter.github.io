<template>
  <span
    :class="{
      'text-[var(--up-color)]': value > 0,
      'text-[var(--down-color)]': value < 0
    }"
  >
    {{value > 0 ? '+' : ''}}{{value < 0 ? '-' : ''}}{{signVisible ? '$' : ''}}<slot/>
  </span>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    default: 0
  },
  signVisible: Boolean
})
</script>
