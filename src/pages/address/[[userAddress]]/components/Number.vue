<template>
  <span
    :class="{
      'text-[var(--color-teal-300)]': value > 0,
      'text-[var(--color-red-500)]': value < 0
    }"
  >
    {{value > 0 ? '+' : ''}}{{value < 0 ? '-' : ''}}{{signVisible ? '$' : ''}}<slot></slot>
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
