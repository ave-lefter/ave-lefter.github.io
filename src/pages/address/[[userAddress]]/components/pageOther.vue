<template>
  <div class="h-full w-full flex flex-col min-h-90vh">
    <div
      v-if="address"
      class="top1 bg-custom-primary-lighter-0 px-15px pt-20px pb-10px flex items-center justify-start text-custom-font-1"
    >
      <div class="item flex items-center">
        <!-- <svg class="icon icon-svg" aria-hidden="true">
          <use :xlink:href="$store.state.mode==='light'? '#icon-dizhi2':'#icon-dizhi'"/>
        </svg> -->
        <TokenImg
          :row="{
            logo_url: `${s3BaseUrl}chain/${chain}.png`,
            chain: chain,
            symbol: chain,
          }"
          token-class="w-10 h-10"
        />
        <div class="ml-2 flex flex-col justify-items-start gap-1">
          <div v-copy="address" class="flex cursor-pointer">
            <div
              class="flex items-center justify-center px-2 py-1.75 h-6 rounded text-3 gap-1 bg-[--main-input-button-bg] color-[--main-text]"
            >
              {{ address.slice(0, 6) + '...' + address.slice(-4) }}
              <Icon name="bxs:copy" class="text-2.5 clickable text-[--third-text]" />
            </div>
          </div>
          <span class="text-[12px] color-[--third-text]">{{ $t('address') }}</span>
        </div>
      </div>
      <div class="item flex items-center ml-136px">
        <TokenImg
          :row="{
            logo_url: '', //row.logo_url ? `${s3BaseUrl}${row.logo_url}`:'',
            chain: chain,
            symbol: '$',
          }"
          token-class="w-10 h-10"
        />
        <div class="ml-2 flex flex-col justify-items-start gap-1">
          <span class="text-12px color-[--main-text]">
            $ {{ formatNumberS(userTotalBalance, 3) || '-.-' }}
          </span>
          <span class="text-12px color-[--third-text]">{{ $t('totalBalance') }}</span>
        </div>
      </div>
    </div>
    <Balance/>
  </div>
</template>

<script setup>
import Balance from './balance/index.vue'
const configStore = useConfigStore()
const s3BaseUrl = configStore.token_logo_url

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
const userTotalBalance = ref(0)
const receiveValue = (value) => {
  userTotalBalance.value= value
}
provide('receiveValue', receiveValue)
</script>

<style></style>
