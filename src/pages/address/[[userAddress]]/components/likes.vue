<template>
  <div>
    <div class="flex items-center gap-4px mb-12px">
      {{ $t('preferredTokenMarketCap') }}
      <Icon v-tooltip="$t('preferedTips')" name="custom:infomation-line" />
    </div>
    <div class="text-24px font-700 lh-30px color-[--main-text] mb-24px">{{ mostLikeText }}</div>
    <div class="flex justify-between text-14px mb-12px">
      {{ $t('mCap') }}
      <span>{{ $t('buyFrequency') }}</span>
    </div>
    <div
      v-for="item in list"
      :key="item.label"
      class="flex items-center justify-between h-20px mb-8px"
    >
      <div class="color-[--secondary-text] text-14px w-108px lh-20px">{{ item.label }}</div>
      <el-progress
        class="flex-1 [&&]:[--el-border-color-lighter:#12B8860D]"
        :percentage="item.percent"
        :show-text="false"
        :color="getCssVariable('--up-color')"
      />
      <div class="w-57px text-right color-[--main-text]">{{ item.count }}</div>
    </div>
  </div>
</template>
<script setup>
import { marketcap_analysis } from '~/api/wallet'

const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  chain: {
    type: String,
    default: '',
  },
})
const list = ref([
  { label: '＜$100K', key: 'under_100k_count' },
  { label: '$100K ~ $1M', key: 'between_100k_1m_count' },
  { label: '$1M ~ $10M', key: 'between_1m_10m_count' },
  { label: '$10M ~ $80M', key: 'between_10m_80m_count' },
  { label: '$80M ~ $100M', key: 'between_80m_100m_count' },
  { label: '＞$100M', key: 'over_100m_count' },
])
const mostLikeText = ref('')

const _marketcap_analysis = async () => {
  try {
    const res = await marketcap_analysis({
      user_address: props.address,
      user_chain: props.chain,
    })
    let maxCount = 0
    let maxText = ''
    list.value.forEach((el) => {
      el.count = res[el.key]
      el.percent = (el.count / res.total_tokens) * 100
      if (el.count > maxCount) {
        maxText = el.label
        maxCount = el.count
      }
    })
    mostLikeText.value = maxText
  } catch (error) {
    console.log('error', error)
  }
}

_marketcap_analysis()

watch(
  () => [props.address, props.chain],
  () => {
    _marketcap_analysis()
  }
)
</script>
<style scoped lang="scss">
:global(.el-progress-bar__outer) {
  border-radius: 0;
}
:global(.el-progress-bar__inner) {
  border-radius: 0;
}
</style>
