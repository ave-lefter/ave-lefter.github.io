<template>
  <div class="w-308px color-[--main-text]">
    <div class="flex-between text-14px">
      <Icon
        name="custom:ai2"
        class="text-14px text-[--main-text]"
      />
      {{ $t('aiSummary') }}
      <span class="flex-1" />
      <el-rate
        :model-value="score"
        :max="3"
        disabled
      />
    </div>

    <template v-if="summary && summaryList(summary).length">
      <div
        v-for="(item, index) in summaryList(summary)"
        :key="index"
      >
        {{ item }}
      </div>
    </template>
    <div class="text-10px color-[--third-text]">
        {{ $t('aiSummaryTip') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  summary: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
})
function summaryList(summary: string): string[] {
  if (!summary) return []

  const regex = /\d+\.\s*[\s\S]*?(?=\d+\.|$)/g
  const matches = summary.match(regex)

  if (matches?.length) {
    return matches.map(i => i.trim())
  }

  return [summary.trim()]
}
</script>