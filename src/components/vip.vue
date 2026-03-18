<template>
  <div class="relative w-630px h-239px">
    <img v-if="!vip" class="w-100%" src="../assets/images/referral/v0-bg.png" alt="" srcset="">
    <img v-else-if="vip === 'vip1'" class="w-100%" src="../assets/images/referral/v1-bg.png" alt="" srcset="">
    <img v-else-if="vip === 'vip2'" class="w-100%" src="../assets/images/referral/v2-bg.png" alt="" srcset="">
    <img v-else-if="vip === 'vip3'" class="w-100%" src="../assets/images/referral/v3-bg.png" alt="" srcset="">
    <img v-else-if="vip === 'svip'" class="w-100%" src="../assets/images/referral/sv-bg.png" alt="" srcset="">
    <div class="absolute top-30px left-0 w-100%">
      <div class="text-15px w-100px text-center">{{ referralInfo?.refCode ? (vip)?.toUpperCase?.() || $t('ordinary') : $t('viewAfterLogin') }}</div>
      <div class="flex items-center color-#333066 text-center font-700 pl-30px mt-40px" :style="{color: refColor}">
        <div>
          <div class="text-45px">{{ Math.round(referralInfo?.chainRefRatio / 100) || 0 }}<span class="text-30px">%</span></div>
          <div class="text-14px font-400 mt-20px">{{ $t('chainWalletRebate') }}</div>
        </div>
        <div class="ml-70px">
          <div class="text-45px">{{ Math.round(referralInfo?.perpRefRatio / 100) || 0 }}<span class="text-30px">%</span></div>
          <div class="text-14px font-400 mt-20px">{{ $t('perpCommission') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import type { getReferralInfo } from '~/api/referral'

type ReferralInfo = Awaited<ReturnType<typeof getReferralInfo>>

const props = defineProps({
  vip: {
    type: String as PropType<'vip1' | 'vip2' | 'vip3' | 'svip' | ''>,
    default: ''
  },
  referralInfo: {
    type: Object as PropType<ReferralInfo>,
    default: () => ({})
  }
})

const refColor = computed(() => {
  return {
    vip1: '#0B3F65',
    vip2: '#333066',
    vip3: '#663F01',
    svip: '#FFE4AA',
    '': '#4F4E5B'
  }?.[props.vip] || '#4F4E5B'
})
</script>

<style>

</style>
