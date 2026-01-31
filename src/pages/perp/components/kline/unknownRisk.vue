<template>
  <div v-if="!price" class="time">
    <div v-if="opening_at > 0" class="text-center">
      <span class="color-[--d-F5F5F5-l-111] text-14px mb-12px block">{{
        $t('countdown2Opening')
      }}</span>
      <TimerCount :key="opening_at" :timestamp="opening_at" :end-time="0" @done="done">
        <template #default="{ formattedData }">
          <div class="color-[--d-F5F5F5-l-111] text-28px flex items-center">
            <div class="bg-[--d-151A22-l-E8F1FF] px-16px py-8px radius-8px mr-6px text-center">
              <span class="">{{ (formattedData.days < 10 ? '0' : '') + formattedData.days }}</span>
              <span class="text-12px mt-4px color-[--d-8CA0C3-l-566275] block">D</span>
            </div>
            <div class="bg-[--d-151A22-l-E8F1FF] px-16px py-8px radius-8px mr-6px text-center">
              <span>{{ (formattedData.hours < 10 ? '0' : '') + formattedData.hours }}</span>
              <span class="text-12px mt-4px color-[--d-8CA0C3-l-566275] block">H</span>
            </div>
            <div class="bg-[--d-151A22-l-E8F1FF] px-16px py-8px radius-8px mr-6px text-center">
              <span>{{ (formattedData.minutes < 10 ? '0' : '') + formattedData.minutes }}</span>
              <span class="text-12px mt-4px color-[--d-8CA0C3-l-566275] block">M</span>
            </div>
            <div class="bg-[--d-151A22-l-E8F1FF] px-16px py-8px radius-8px mr-6px text-center">
              <span>{{ (formattedData.seconds < 10 ? '0' : '') + formattedData.seconds }}</span>
              <span class="text-12px mt-4px color-[--d-8CA0C3-l-566275] block">S</span>
            </div>
          </div>
        </template>
      </TimerCount>
    </div>
    <div v-else class="flex items-center bg-[--d-151A22-l-E8F1FF] py-8px px-24px radius-4px">
      <span class="color-[--d-8CA0C3-l-566275] text-36px">{{ $t('unknownRisk') }}</span>
    </div>
  </div>
</template>

<script setup>
const  props = defineProps({
  isRank: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['refresh'])
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const price = computed(() => {
  return tokenStore.price
})
const opening_at = computed(() => {
  return tokenStore.token?.opening_at || 0
})
function done() {
  emit('refresh')
}
</script>

<style lang="scss" scoped>
.time {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
  height: 100%;
  background: var(--d-111-l-FFF);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
