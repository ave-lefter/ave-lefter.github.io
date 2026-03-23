<template>
  <div class="p-12px text-12px">
    <div class="color-[--main-text1] mb-4px text-12px">
      <!-- {{ type == 'smart' ? $t('smarter2') : 'KOL' }} {{ $t('insidersOwned') }}
      <span class="ml-2px" :style="{ color: Number(ratio) > 5 ? '#F6465D' : '#12B886' }">
        {{
          formatNumber(Number(ratio) >= 0.1 ? ratio || 0 : Number(ratio) == 0 ? '0' : '<0.1', 2)
        }}%
      </span> -->
      {{ $t('kolSummary', {people:tableList.length, type: type == 'smart' ? $t('smarter2') : 'KOL', holders: formatNumber(holders,0), vol: '$'+formatNumber(vol,0),  ratio: formatNumber(Number(ratio) >= 0.1 ? ratio || 0 : Number(ratio) == 0 ? '0' : '<0.1', 2)+ '%'}) }}
    </div>
    <div class="w-full text-12px color-[--main-text1]">
      <!-- list -->
      <el-scrollbar :max-height="300">
        <el-skeleton v-if="loading" :rows="5" animated style="--el-skeleton-circle-size: 32px;padding: 12px">
          <template #template>
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
            <el-skeleton-item variant="p" style="width: 100%" />
          </template>
        </el-skeleton>
        <template v-else-if="!loading && tableList.length > 0">
          <div
            v-for="(item, $index) in tableList"
            :key="$index"
            class="flex items-center  py-4px rounded-4px cursor-pointer hover:bg-[--dialog-list-hover]"
            @click.stop.prevent="jumpBalance(item)"
          >
            <UserAvatar
              class="mr-8px"
              :wallet_logo="{
                logo: item.wallet_logo,
                url: item.wallet_address,
              }"
              :address="item.wallet_address"
              :chain="item.chain"
              iconSize="24px"
            />
            <div class="flex-1.5 min-w-0">
              <div class="flex items-center">
                <span class="leading-18px ellipsis text-12px color-[--main-text1]">
                  {{
                    item.remark ||
                    item.wallet_address?.slice(0, 6) + '...' + item.wallet_address?.slice(-4)
                  }}
                </span>
              </div>
            </div>
            <div class="flex-1 text-right">
              <div class="text-14px color-[--main-text1]"
                :style="{color:Number(formatNumber(item?.balance_radio || 0, 1))==0? 'var(--third-text)': 'var(--main-text1)'}"
              >
                  {{ formatNumber(Number(item.balance_radio) >= 0.1 ? item.balance_radio || 0 : Number(item.balance_radio) == 0 ? '0' : '<0.1', 2) }}%
              </div>
            </div>
          </div>
        </template>
        <ave-empty v-else class="h-200px flex items-center justify-center">
          <span class="color-[--third-text] text-12px lh-16px">{{ $t('emptyNoData') }}</span>
        </ave-empty>
      </el-scrollbar>
    </div>
  </div>
  <!-- <div
    v-if="!loading && tableList.length == 0"
    class="p-12px w-382px min-h-60px flex flex-col items-center justify-center"
  >
    <div class="text-14px font-400 color-[--third-text]">{{ $t('emptyNoData') }}</div>
  </div> -->
</template>

<script setup lang="ts">
import type { _getDevInfo } from '~/api/pump'
type DevInfo = Awaited<ReturnType<typeof _getDevInfo>>
import { type HolderRankItem } from '~/api/pump'
const props = defineProps<{
  tokenId: string
  loading: boolean
  ratio: number
  symbol: String,
  logo_url: String,
  type: string
  tableList: HolderRankItem[]
  onFetch: (tokenId: string, tagType?: number) => void
}>()

const chain = computed(() => getAddressAndChainFromId(props.tokenId)?.chain)
const token = computed(() => getAddressAndChainFromId(props.tokenId)?.address)
const holders = computed(() => {
 return props.tableList?.filter(item => Number(item.balance_usd) > 0)?.length || 0
})
const vol = computed(() => {
 return props.tableList.reduce((sum, item) => sum + Number(item.balance_usd || 0), 0)
})

const tokenDetailSStore = useTokenDetailsStore()
const route = useRoute()
function jumpBalance(row: HolderRankItem) {
  console.log('-----------wallet_address-------',row.wallet_address)
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: props.tokenId,
      symbol: props.symbol,
      logo_url:  props.logo_url,
      chain: chain.value,
      address: token.value,
      remark: row?.remark || '',
    },
    pairInfo: {
      target_token: token.value,
      token0_address: token.value,
      token0_symbol:  props.symbol,
      token1_symbol: '',
      pairAddress: '',
    },
    user_address: row.wallet_address || useBotStore().getWalletAddress(chain.value) || useWalletStore().address,
  })
}
</script>

<style scoped lang="scss"></style>
