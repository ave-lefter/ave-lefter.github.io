<template>
  <div class="p-12px text-12px">
    <div class="color-[--main-text]">
      {{ getFilter(type) }}&nbsp;{{ $t('insidersOwned') }}
      <span class="ml-2px" :style="{ color: Number(ratio) > 5 ? '#F6465D' : '#12B886' }">
        {{
          formatNumber(Number(ratio) >= 0.001 ? ratio || 0 : (Number(ratio) == 0 ? '0' : '< 0.001'), 1)
        }}%
      </span>
    </div>
    <div class="w-full text-12px text-[--main-text] mt-12px">
      <!-- header -->
      <div class="grid grid-cols-[2fr_1fr_1fr_1fr] text-12px color-[--secondary-text]">
        <div>{{ $t('address') }}</div>
        <div class="text-right">{{ $t('positions') }}</div>
        <div class="text-right">{{ $t('buy') }}/{{ $t('sell') }}</div>
        <div class="text-right">{{ $t('totalProfit') }}</div>
      </div>
      <!-- list -->
      <el-scrollbar :max-height="300">
        <el-skeleton
          v-if="loading"
          :rows="5"
          animated
          style="--el-skeleton-circle-size: 32px; padding: 12px"
        >
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
            class="grid grid-cols-[2fr_1fr_1fr_1fr] items-center mt-8px rounded-8px"
          >
            <!-- 地址 -->
            <div class="flex items-center min-w-0">
              <UserAvatar
                class="mr-8px"
                :wallet_logo="{
                  logo: item.logo_url,
                  url: item.account_address,
                }"
                :address="item.account_address"
                :chain="chain"
                iconSize="32px"
              />

              <div class="min-w-0">
                <div class="flex items-center">
                  <span class="ellipsis text-14px">
                    {{
                      item.remark ||
                      item.account_address?.slice(0, 6) + '...' + item.account_address?.slice(-4)
                    }}
                  </span>
                </div>
                <span
                  class="color-[--third-text] text-12px leading-16px inline-flex items-center"
                >
                    <span class="l text-12px">
                    {{
                      item.account_address?.slice(0, 6) + '...' + item.account_address?.slice(-4)
                    }}
                  </span>

                  <Icon
                    v-copy="item.account_address"
                    name="bxs:copy"
                    class="text-12px clickable text-[--third-text] ml-4px"
                  />
                </span>
              </div>
            </div>

            <!-- 持仓 -->
            <div class="text-right">
              <div v-if="Number(item?.balance_usd || 0) > 0" class="text-12px color-[--main-text]">
                ${{ formatNumber(item?.balance_usd || 0, 2) }}
              </div>
              <div v-else class="text-12px color-[--third-text]">
                {{ $t('sellAl') }}
              </div>
              <div class="text-10px color-[--secondary-text]">
                  {{ formatNumber(Math.abs(Number(item.balance_ratio || 0)), 2) }}%
              </div>
            </div>

            <!-- 买入 / 卖出 -->
            <div class="text-right">
              <div class="text-12px color-[--up-color]">
                ${{ formatNumber(item?.total_purchase_usd || 0, 2) }}
              </div>

              <div class="text-12px color-[--down-color]">
                ${{ formatNumber(item?.total_sold_usd || 0, 2) }}
              </div>
            </div>

            <!-- 总收益 -->
            <div class="text-right">
              <div class="text-12px color-[--main-text]">
                <ave-data-number :value="item.total_profit" :signVisible="true">
                  {{ formatNumber( Math.abs(Number(item?.total_profit || 0)|| 0), 2) }}
                </ave-data-number>
              </div>

              <div class="text-10px color-[--secondary-text]">
                  {{ formatNumber(Math.abs(Number(item.total_profit_ratio || 0)), 2) }}%

              </div>
            </div>
          </div>
        </template>
        <ave-empty v-else="!loading && tableList.length === 0" class="pt-50px pb-50px">
          <span class="color-[--third-text] text-12px lh-16px mt-10px">{{
            $t('emptyNoData')
          }}</span>
        </ave-empty>
      </el-scrollbar>
    </div>
  </div>
  <!-- <div
    v-if="!loading && !tableList?.length"
    class="p-12px w-200px min-h-60px flex flex-col items-center justify-center"
  >
    <div class="text-14px font-400 color-[--third-text]">{{ $t('emptyNoData') }}</div>
  </div> -->
</template>

<script setup lang="ts">
import { type TagsRatioHoverItem } from '@/api/token'
import { useDevPop } from './utils'
const props = defineProps<{
  tokenId: string
  loading: boolean
  ratio: number
  type: number
  tableList: TagsRatioHoverItem[]
  onFetch: (tokenId: string, tagType?: number) => void
}>()
const botStore = useBotStore()
const walletStore = useWalletStore()
const { getHolderRank } = useDevPop()
const { t } = useI18n()
const chain = computed(() => getAddressAndChainFromId(props.tokenId)?.chain)

const activeTab = ref(0)

const tabs = computed(() => {
  const hasAddress = !!(botStore?.evmAddress || walletStore?.address)
  return [
    { key: 0, label: t('all') },
    ...(hasAddress ? [{ key: -100, label: t('followAddress') }] : []),
    { key: 30, label: t('smarter2') },
    { key: 31, label: 'KOL' },
  ]
})
const filterMap = {
  16: t('insiders'),
  19: t('sniper2'),
  30: t('smarter2'),
  31: 'KOL',
  35: t('Cabal'),
  36: t('Bundle'),

} as const

function getFilter(type: number) {
  const key = filterMap[type as keyof typeof filterMap]
  return key ? key : ''
}

function onTabChange(tagType: number) {
  if (!props.tokenId) return
  activeTab.value = tagType
  props.onFetch(props.tokenId, tagType)
}
</script>

<style scoped lang="scss">
.el-button.el-button--primary:hover {
  --el-button-hover-text-color: var(--white);
  --el-button-hover-bg-color: var(--primary-button-hover);
  --el-button-hover-border-color: var(--primary-button-hover);
}
</style>
