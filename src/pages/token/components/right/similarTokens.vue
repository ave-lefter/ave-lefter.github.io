<template>
  <div class="px-15px pb-10px pr-0 bg-[--secondary-bg]" v-if="!isEmpty">
    <div
      class="flex-start border-b border-b-solid border-[--d-151A22-l-E8F1FF] pb-12px pt-12px mr-15px mb-12px"
      @click="isExpand = !isExpand"
    >
      <span class="text-14px">同名代币</span>
      <Icon class="ml-4px" :name= " isExpand?'material-symbols:keyboard-arrow-down' : 'material-symbols:keyboard-arrow-up'" />
      <div class="flex-1"></div>
    </div>
    <div v-if="isExpand">
      <div class="flex justify-between">
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('similarTokens') }}</div>
        <div class="text-12px lh-12px color-[--third-text] mb-12px">{{ t('mcap') }}</div>
      </div>
      <div class="flex flex-col gap-8px">
        <div v-for="token in tokens" :key="token.id" class="flex items-center gap-8px cursor-pointer"
          @click="navigateTo(`/token/${token.token}-${token.chain}`)">
          <TokenImg :row="token" />
          <div class="flex-1">
            <div class=" color-[--main-text] text-12px">{{ token.symbol }}</div>
            <div v-tooltip="formatDate(token.last_trade_at, 'YYYY-MM-DD HH:mm:ss')" class="lh-12px"><span
                class="color-[--third-text] text-10px">{{ t('lastTx') }}:{{
                  formatTimeFromNow(token.last_trade_at) }}</span>
            </div>
          </div>
          <div class="text-12px text-right flex flex-col">
            <div class="lh-16px" :style="{ color: getDataColor(token.market_cap) }">${{
              formatNumber(token.market_cap, 1) }}
              </div>
            <div v-tooltip="t('createdTime') + ':' + formatDate(token.created_at, 'YYYY-MM-DD HH:mm:ss')"
              class="justify-end lh-12px color-[--third-text] text-10px">{{ formatTimeFromNow(token.created_at) }}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
  tokens: {
    type: Array,
  },
})
const { t } = useI18n()
const route = useRoute()
const globalStore = useGlobalStore()
const { pumpSetting } = storeToRefs(globalStore)
const isExpand = shallowRef(true)
const id = computed(() => route.params.id as string)
const isEmpty = computed(() => {
  return props?.tokens?.length === 0
})
function getDataColor(num: number) {
    const middleSize = pumpSetting.value.data?.mc?.middleSize ?? 0
  const minSize = pumpSetting.value.data?.mc?.minSize ?? 0
    console.log('-------',pumpSetting )
    if (Number(num) > middleSize) {
      return pumpSetting.value.data?.mc?.maxColor || ''
    } else if (Number(num) > minSize) {
      return pumpSetting.value.data?.mc?.middleColor || ''
    } else {
      return pumpSetting.value.data?.mc?.minColor || ''
    }

}

</script>

<style lang="scss" scoped></style>
