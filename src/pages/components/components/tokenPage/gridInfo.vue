<script setup lang="ts">
import BigNumber from 'bignumber.js'

const tokenStore = useRankKlineStore()
const checkStore = useCheckStore()

const token = computed(() => tokenStore.token)
const pair = computed(() => tokenStore.pair)
const owner = computed(() => {
  const owner = checkStore?.checkResult?.owner || token.value?.owner || ''
  return owner
})
const effectiveTotal = computed(() => {
  return new BigNumber(token.value?.total || 0)
    .minus(token.value?.burn_amount_dec || 0).toFixed()
})

function formatAddress(address: string) {
  return address.slice(0, 4) + '...' + address.slice(-4)
}
</script>
<template>
    <div class="py-12px justify-between flex flex-wrap gap-y-12px">
        <div class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <span class="color-[--d-8CA0C3-l-566275] mb-6px">{{ token?.name || '-' }}</span>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('name') }}</span>
        </div>
        <div v-if="token?.token" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <div class="flex items-center justify-center mb-6px">
                <a class="clickable [&&]:color-[--d-8CA0C3-l-566275] hover:color-[--d-F5F5F5-l-333]" style="text-decoration: none;" :href="formatExplorerUrl(token?.chain as string, token?.token as string, 'token')" target="_blank">{{
              token?.token ? formatAddress(token?.token) : '-' }}</a>
                <Icon v-copy="token?.token" name="bxs:copy" class="ml-5px clickable color-[--d-566275-l-8CA0C3]" />
            </div>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('token') }}</span>
        </div>
        <div v-if="pair" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <div class="flex items-center justify-center mb-6px">
                <a class="clickable [&&]:color-[--d-8CA0C3-l-566275] hover:color-[--d-F5F5F5-l-333]" style="text-decoration: none;" :href="formatExplorerUrl(token?.chain as string, tokenStore.pairAddress as string, 'address')" target="_blank">{{
              tokenStore.pairAddress ? formatAddress(tokenStore.pairAddress) : '-' }}</a>
                <Icon v-copy="tokenStore.pairAddress" name="bxs:copy" class="ml-5px clickable color-[--d-566275-l-8CA0C3]" />
            </div>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('pair') }}</span>
        </div>
        <div v-if="token?.total" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <span class="color-[--d-8CA0C3-l-566275] mb-6px">{{ formatNumber(tokenStore?.marketCap || 0) }}</span>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('mcap') }}</span>
        </div>
        <div v-if="checkStore.checkResult?.creator_address" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <div class="flex items-center justify-center mb-6px">
                <a class="clickable [&&]:color-[--d-8CA0C3-l-566275] hover:color-[--d-F5F5F5-l-333]" style="text-decoration: none;" :href="formatExplorerUrl(token?.chain as string, checkStore.checkResult.creator_address as string, 'address')" target="_blank">{{
              checkStore.checkResult.creator_address ? formatAddress(checkStore.checkResult.creator_address) : '-' }}</a>
                <Icon v-copy="checkStore.checkResult.creator_address" name="bxs:copy" class="ml-5px clickable color-[--d-566275-l-8CA0C3]" />
            </div>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('contractCreator') }}</span>
        </div>
        <div v-if="owner" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <div class="flex items-center justify-center mb-6px">
                <a class="clickable [&&]:color-[--d-8CA0C3-l-566275] hover:color-[--d-F5F5F5-l-333]" style="text-decoration: none;" :href="formatExplorerUrl(token?.chain as string, owner, 'address')" target="_blank">{{
              owner ? formatAddress(owner) : '-' }}</a>
                <Icon v-copy="owner" name="bxs:copy" class="ml-5px clickable color-[--d-566275-l-8CA0C3]" />
            </div>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('pair') }}</span>
        </div>
        <div v-if="tokenStore.tokenInfoExtra?.amount_24" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <span class="color-[--d-8CA0C3-l-566275] mb-6px">{{ formatNumber(tokenStore.tokenInfoExtra?.amount_24/tokenStore.circulation*100 || 0, 2) }}%</span>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('24Exchange') }}</span>
        </div>
        <div v-if="effectiveTotal" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <span class="color-[--d-8CA0C3-l-566275] mb-6px">{{ formatNumber(effectiveTotal || 0, 2) }}</span>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('totalSupply') }}</span>
        </div>
        <div v-if="tokenStore?.circulation" class="w-94px py-8px flex justify-center items-center flex-col rounded-4px bg-[--d-151A22-l-E8F1FF]">
            <span class="color-[--d-8CA0C3-l-566275] mb-6px">{{ formatNumber(tokenStore?.circulation.toFixed() || 0) }}</span>
            <span class="color-[--d-566275-l-8CA0C3]">{{ $t('circulation') }}</span>
        </div>
        <div v-if="pair" class="px-12px py-8px flex w-full justify-between bg-[--d-151A22-l-E8F1FF]">
           <span class="color-[--d-8CA0C3-l-566275]">{{ $t('createdTime') }}</span>
           <span class="color-[--d-566275-l-8CA0C3]">{{ pair?.created_at ? formatDate(pair?.created_at) : '-' }}</span>
        </div>
    </div>
</template>