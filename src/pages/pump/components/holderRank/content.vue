<template>
  <div class="p-12px text-12px">
    <div class="flex">
      <span
        v-for="tab in tabs"
        :key="tab.key"
        class="px-12px py-2px rounded-4px text-12px border-none color-[--secondary-text] bg-[--dialog-tab-active-bg] mr-8px cursor-pointer"
        :class="
          activeTab === tab.key
            ? 'bg-#3B82F6 text-white'
            : 'bg-[--dialog-tab-active-bg] color-[--secondary-text]'
        "
        @click="onTabChange(tab.key)"
      >
        {{ tab.label }}
      </span>
    </div>

    <div class="w-full text-12px text-white mt-12px">
      <!-- header -->
      <div class="flex justify-between text-12px color-[--secondary-text]">
        <div class="flex-1">{{ $t('tOPSameAddress') }}</div>
        <div class="w-120px text-right">{{ $t('tokenValue') }}</div>
      </div>
      <!-- list -->
      <el-scrollbar :height="300">
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
            class="flex items-center py-6px mt-8px hover:bg-#141414 rounded-8px"
          >
            <UserAvatar
              class="mr-8px"
              :wallet_logo="{
                logo: item.wallet_logo,
                url: item.wallet_address,
              }"
              :address="item.wallet_address"
              :chain="item.chain"
              iconSize="32px"
            />
            <div class="flex-1.5 min-w-0">
              <div class="flex items-center">
                <span class="leading-18px ellipsis text-14px">
                  {{
                    item.remark ||
                    item.wallet_address?.slice(0, 6) + '...' + item.wallet_address?.slice(-4)
                  }}
                </span>
                <Icon
                  v-copy="item.wallet_address"
                  name="bxs:copy"
                  class="text-12px clickable text-[--third-text] ml-4px"
                />
              </div>
              <span
                class="px-4px py-1px rounded-4px bg-[--dialog-tab-active-bg] color-[--third-text] text-10px leading-16px inline-flex items-center"
              >
                <template v-if="item.tag_type === 30">
                  <Icon
                    v-copy="item.wallet_address"
                    name="custom:smart-plain"
                    class="text-10px mr-2px"
                  />聪明钱
                </template>
                <template v-else-if="item.tag_type === 31">
                  <Icon v-copy="item.wallet_address" name="custom:kol2" class="text-10px mr-2px" />KOL
                </template>
                <template v-else-if="item.tag_type === -100">
                  <Icon
                    v-copy="item.wallet_address"
                    name="custom:smart-plain"
                    class="text-10px mr-2px"
                  />关注地址</template
                >
              </span>
            </div>
            <div class="flex-1 text-right">
              <div class="text-14px color-[--main-text]">
                ${{ formatNumber(item?.balance_usd || 0, 2) }}
              </div>
              <div class="text-12px color-[--secondary-text] leading-14px">
                <ave-data-number :value="item.balance_radio" :signVisible="false">
                  {{ formatNumber(Math.abs(Number(item.balance_radio || 0)), 2) }}%
                </ave-data-number>
              </div>
            </div>
          </div>
        </template>
        <ave-empty v-else="!loading && tableList.length === 0" class="pt-100px">
          <span class="color-[--third-text] text-12px lh-16px mt-10px">{{ $t('emptyNoData') }}</span>
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
import { type HolderRankItem } from '~/api/pump'
import { useDevPop } from './utils'
const props = defineProps<{
  tokenId: string
  loading: boolean
  tableList: HolderRankItem[]
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
