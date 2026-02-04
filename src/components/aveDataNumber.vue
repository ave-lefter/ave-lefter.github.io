<template>
  <span
    v-if="value > 0 || value < 0 "
    :class="{
      'text-[var(--up-color)]': value > 0,
      'text-[var(--down-color)]': value < 0
    }"
  >
    {{value > 0 ? '+' : ''}}{{value < 0 ? '-' : ''}}{{signVisible ? '$' : ''}}<slot/>
  </span>
  <span v-else :class="classZero? classZero : 'color-[--third-text]'">0</span>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    default: 0
  },
  classZero: String,
  signVisible: Boolean
})
</script>
