<template>
  <div>
    <div v-if="!isRank" class="flex-between">
      <div class="text-16px py-12px color-#999">
        {{ $t('tokenInfo') }}
      </div>
      <div class="tabs">
        <span v-for="item in tabs" :key="item.id" class="item" :class="{ active: item.id == active}" @click.stop="active = item.id">
        <Icon
          :name="`custom:${item.icon}`"
        />
        </span>
      </div>
    </div>
    <ul class="text-12px mt-10px" :class="{ active: active=='grid'}">
      <li class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('name') }}</span>
        <span class="color-[--d-999-l-666] ellipsis" :class="active =='grid' ? 'max-w-75px' : 'max-w-200px'">{{ token?.name || '-' }}</span>
      </li>
      <li v-if="token?.token" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('token') }}</span>
        <div class="flex items-center justify-end color-[--d-999-l-666]">
          <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333]" style="text-decoration: none;" :href="formatExplorerUrl(token?.chain as string, token?.token as string, 'token')" target="_blank">{{
              token?.token ? formatAddress(token?.token) : '-' }}</a>
          <Icon v-copy="token?.token" name="bxs:copy" class="ml-5px clickable color-[--d-666-l-999]" />
        </div>
      </li>
      <li v-if="pair" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('pair') }}</span>
        <div class="flex items-center justify-end color-[--d-999-l-666]">
          <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] text-decoration-none"  :href="formatExplorerUrl(token?.chain as string, tokenStore?.pairAddress, 'address')" target="_blank"> {{ formatAddress(tokenStore?.pairAddress) }}</a>
          <Icon v-copy="tokenStore?.pairAddress" name="bxs:copy" class="ml-5px clickable color-[--d-666-l-999]" />
        </div>
      </li>
      <li v-if="token?.total" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('mcap') }}</span>
        <span class="color-[--d-999-l-666]">${{ formatNumber(tokenStore?.marketCap || 0) }}</span>
      </li>
      <li v-if="checkStore.checkResult?.creator_address" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('contractCreator') }}</span>
        <div class="flex items-center justify-end color-[--d-999-l-666]">
          <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] text-decoration-none"  :href="formatExplorerUrl(token?.chain as string, checkStore.checkResult.creator_address, 'address')" target="_blank"> {{ formatAddress(checkStore.checkResult?.creator_address || '') }}</a>
          <Icon v-copy="checkStore.checkResult.creator_address || ''" name="bxs:copy" class="ml-5px clickable color-[--d-666-l-999]" />
        </div>
      </li>
      <li v-if="owner" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('contractOwner') }}</span>
        <div class="flex items-center justify-end color-[--d-999-l-666]">
          <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] text-decoration-none"  :href="formatExplorerUrl(token?.chain as string, owner, 'address')" target="_blank"> {{ formatAddress(owner) }}</a>
          <Icon v-copy="checkStore?.checkResult?.owner || token?.owner || ''" name="bxs:copy" class="ml-5px clickable color-[--d-666-l-999]" />
        </div>
      </li>
      <li class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('24Exchange') }}</span>
        <span class="color-[--d-999-l-666]">
          <template v-if="circulation?.gt(0)">
            {{ formatNumber(exchange.toString() || 0, 2) }}%
          </template>
          <template v-else>-</template>
        </span>
      </li>
      <li class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('totalSupply') }}</span>
        <span class="color-[--d-999-l-666]">{{ formatNumber(effectiveTotal || 0, 2) }}</span>
      </li>
      <li class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('FDV') }}</span>
        <span class="color-[--d-999-l-666]">${{ formatNumber(Number(token?.total || 0) * (tokenStore?.price || 0))
          }}</span>
      </li>
      <!-- <li v-if="token?.total" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('circulation') }}</span>
        <span class="color-[--d-999-l-666]">{{ formatNumber(tokenStore?.circulation.toFixed() || 0) }}</span>
      </li> -->
      <li v-if="pair" class="flex justify-between mb-12px">
        <span class="color-[--d-666-l-999]">{{ $t('createdTime') }}</span>
        <span class="color-[--d-999-l-666]">{{ pair?.created_at ? formatDate(pair?.created_at) : '-' }}</span>
      </li>
      <!-- <template v-for="(item, index) in medias?.slice()" :key="index">
        <template v-if="item?.url">
          <template v-if="item?.name == 'Telegram'">
            <template v-for="(i, $index) in item?.url?.split(',')" :key="$index">
              <li class="flex justify-between mb-12px">
                <span class="color-[--d-666-l-999]">{{ $index > 0 ? item?.name + $index : item?.name }}:</span>
                <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] text-right line-clamp-1 max-w-200px" style="text-decoration: none;" :href="i" target="_blank">{{ i }}</a>
              </li>
            </template>
          </template>
          <li v-else class="flex justify-between mb-12px">
            <span class="color-[--d-666-l-999]">{{  item?.name }}:</span>
            <a class="clickable color-[--d-999-l-666] hover:color-[--d-F5F5F5-l-333] text-right line-clamp-1 max-w-200px" style="text-decoration: none;" :href="item?.url" target="_blank">{{ item?.url }}</a>
          </li>
        </template>
      </template> -->
    </ul>
    <div v-if="!isRank && intro" :class="{ bg: active=='grid'}">
      <div  v-if="intro" class="text-14px mb-12px color-[--d-666-l-999]">{{ $t('currencyOverview') }}</div>
      <div class="text-12px color-[--d-999-l-666] token-description">
        <span v-html="showAll ? intro : intro?.slice(0, 250)" />
        <button v-if="intro?.length > 250" class="text-12px color-#3F80F7 bg-transparent outline-none border-none clickable" @click.stop="showAll = !showAll" >{{ !showAll ? $t('more') : $t('expand') }}</button>
      </div>
    </div>
    <div v-if="!isRank" :class="{ bg: active=='grid'}">
      <div class="text-14px mb-2px color-[--d-666-l-999] flex-start" :class="active =='grid' ? 'mt-0px': 'mt-12px'">
        <Icon name="custom:ai" class="text-12px"/> {{ $t('aiSummary') }}
      </div>
      <div class="text-12px color-[--d-999-l-666] token-description">
         <template v-if="!headlineArr">
          {{aiSummary?.summary || aiSummary?.headline ? aiSummary?.summary || aiSummary?.headline: $t('aiIsAnalyzing')}}
         </template>
         <template v-else>
          <div v-for="item in headlineArr" :key="item">
            {{ item }}
          </div>
         </template>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { formatDate, formatExplorerUrl, isJSON } from '@/utils/index'
import { useTokenStore } from '~/stores/token'
import BigNumber from 'bignumber.js'
const aiSummary = inject<{summary: string, headline: string }>('aiSummary')
const props = defineProps<{
  isRank?:boolean
}>()
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const checkStore = useCheckStore()
const pair = computed(() => tokenStore.pair)
const token = computed(() => tokenStore.token)
const circulation = computed(() => tokenStore.circulation)
const tokenInfoExtra = computed(() => tokenStore.tokenInfoExtra)
const localeStore = useLocaleStore()
// const { t } = useI18n()
const showAll = ref(false)
const active = shallowRef(props.isRank ? 'col' : 'grid')
const tabs = [
  { id: 'grid', icon: 'grid', name: 'grid' },
  { id: 'col', icon: 'col', name: 'col' }
]

const owner = computed(() => {
  const owner = checkStore?.checkResult?.owner || token.value?.owner || ''
  return owner
})

const appendix = computed(() => {
  if (token.value?.appendix && isJSON(token.value?.appendix)) {
    return JSON.parse(token.value?.appendix)
  }
  return {}
})

const intro = computed(() => {
  const lang = localeStore.locale
  if (lang == 'zh-cn' || lang == 'zh-tw') {
    return token.value?.intro_cn || appendix?.value?.description || ''
  }
  return token.value?.intro_en || appendix?.value?.description || ''
})

const effectiveTotal = computed(() => {
  return new BigNumber(token.value?.total || 0)
    .minus(token.value?.burn_amount_dec || 0).toFixed()
})
const exchange = computed(() => {
  return new BigNumber(tokenInfoExtra.value?.amount_24 || 0)
    .div(circulation.value || 0).multipliedBy(100) || 0
})

function formatAddress(address: string) {
  return address.slice(0, 4) + '...' + address.slice(-4)
}

const headlineArr = computed(() => {
  const ai = aiSummary?.value?.summary || aiSummary?.value?.headline || ''
  return ai.match(/(\d\..*)/g)
})
// const medias = computed(() => {
//   return [
//     { name: t('website'), icon: 'web', url: appendix.value?.website },
//     { name: t('whitepaper'), icon: 'whitepaper', url: appendix.value?.whitepaper },
//     { name: 'Blog', icon: 'blog', url: appendix.value?.blog },
//     { name: 'Btok', icon: 'Btok', url: appendix.value?.btok },
//     { name: 'Discord', icon: 'discord1', url: appendix.value?.discord },
//     { name: 'Email', icon: 'email', url: appendix.value?.email },
//     { name: 'Facebook', icon: 'facebook', url: appendix.value?.facebook },
//     { name: 'Github', icon: 'github', url: appendix.value?.github },
//     { name: 'Linkedin', icon: 'linkedin', url: appendix.value?.linkedin },
//     { name: 'QQ', icon: 'QQ', url: appendix.value?.qq },
//     { name: 'Reddit', icon: 'reddit', url: appendix.value?.reddit },
//     { name: 'Slack', icon: 'slack', url: appendix.value?.slack },
//     { name: 'Telegram', icon: 'TG', url: appendix.value?.telegram },
//     { name: 'Twitter', icon: 'twitter1', url: appendix.value?.twitter },
//     { name: 'Wechat', icon: 'wechat', url: appendix.value?.wechat }
//   ]
// })

</script>

<style scoped lang="scss">
.token-description {
  font-size: 12px;
  word-break: break-word;
  line-height: 1.5;
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--d-222-l-F2F2F2);
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;
  span.item {
    font-size: 14px;
    color: var(--d-666-l-999);
    cursor: pointer;
    border-radius: 2px;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bolder;
    &+.item{
      margin-left: 2px;
    }
    &.active {
      color: var(--d-FFF-l-333);
      background: var(--d-111-l-FFF);
    }
  }
}
ul{
  &.active {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    &> :last-child {
        grid-column: 1 / -1; /* 占满整行 */

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction:row;
        &>:first-child{
          margin-top: 0px
        }
      }
    li {
      background: var(--d-222-l-F2F2F2);
      border-radius: 4px;
      padding: 8px;
      flex-direction: column-reverse;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      &>:first-child{
        margin-top: 6px
      }
    }
  }
}
.bg {
  background: var(--d-222-l-F2F2F2);
  border-radius: 4px;
  padding: 8px;
  margin-top: 12px;
}
.ellipsis{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
