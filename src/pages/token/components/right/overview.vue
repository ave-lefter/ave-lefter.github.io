<template>
  <div>
    <div v-if="!isRank" class="flex-between mr-15px">
      <div class="tabHeader text-14px py-12px flex flex-row gap-2 color-[--third-text]">
        <div
          v-for="item in headerTabs"
          :key="item.id"
          :class="{ on: activeTab == item.id }"
          @click.stop="activeTab = item.id"
        >
          {{ item.name }}
          <span v-if="item.id === 'devBit'">({{ totalTokens }})</span>
        </div>
      </div>
      <div v-if="activeTab == 'info'" class="tabs">
        <span
          v-for="item in tabs"
          :key="item.id"
          class="item"
          :class="{ active: item.id == active }"
          @click.stop="active = item.id"
        >
          <Icon :name="`custom:${item.icon}`" />
        </span>
      </div>
    </div>
    <div v-if="activeTab == 'info'" class="mr-15px overflow-x-hidden">
      <ul class="text-12px" :class="{ active: active == 'grid' }">
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('name') }}</span>
          <span
            class="color-[--secondary-text] ellipsis"
            :class="active == 'grid' ? 'max-w-75px' : 'max-w-200px'"
            >{{ token?.name || token?.symbol || '-' }}</span
          >
        </li>
        <li v-if="token?.token" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('token') }}</span>
          <div class="flex items-center justify-end color-[--secondary-text]">
            <a
              class="clickable color-[--secondary-text] hover:color-[--main-text]"
              style="text-decoration: none"
              :href="formatExplorerUrl(token?.chain as string, token?.token as string, 'token')"
              target="_blank"
              >{{ token?.token ? formatAddress(token?.token) : '-' }}</a
            >
            <Icon
              v-copy="token?.token"
              name="bxs:copy"
              class="ml-5px clickable color-[--third-text]"
            />
          </div>
        </li>
        <li v-if="pair" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('pair') }}</span>
          <div class="flex items-center justify-end color-[--secondary-text]">
            <a
              class="clickable color-[--secondary-text] hover:color-[--main-text] text-decoration-none"
              :href="
                formatExplorerUrl(token?.chain as string, tokenStore?.pairAddress || '', 'address')
              "
              target="_blank"
            >
              {{ formatAddress(tokenStore?.pairAddress || '') }}</a
            >
            <Icon
              v-copy="tokenStore?.pairAddress"
              name="bxs:copy"
              class="ml-5px clickable color-[--third-text]"
            />
          </div>
        </li>
        <li v-if="token?.total" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('mcap') }}</span>
          <span class="color-[--secondary-text]"
            >${{ formatNumber(tokenStore?.marketCap || 0, 2) }}</span
          >
        </li>
        <li v-if="checkStore.checkResult?.creator_address" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('contractCreator') }}</span>
          <div class="flex items-center justify-end color-[--secondary-text]">
            <a
              class="clickable color-[--secondary-text] hover:color-[--main-text] text-decoration-none"
              :href="
                formatExplorerUrl(
                  token?.chain as string,
                  checkStore.checkResult.creator_address,
                  'address'
                )
              "
              target="_blank"
            >
              {{ formatAddress(checkStore.checkResult?.creator_address || '') }}</a
            >
            <Icon
              v-copy="checkStore.checkResult.creator_address || ''"
              name="bxs:copy"
              class="ml-5px clickable color-[--third-text]"
            />
          </div>
        </li>
        <li v-if="owner" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('contractOwner') }}</span>
          <div class="flex items-center justify-end color-[--secondary-text]">
            <a
              class="clickable color-[--secondary-text] hover:color-[--main-text] text-decoration-none"
              :href="formatExplorerUrl(token?.chain as string, owner, 'address')"
              target="_blank"
            >
              {{ formatAddress(owner) }}</a
            >
            <Icon
              v-copy="checkStore?.checkResult?.owner || token?.owner || ''"
              name="bxs:copy"
              class="ml-5px clickable color-[--third-text]"
            />
          </div>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('24Exchange') }}</span>
          <span class="color-[--secondary-text]">
            <template v-if="circulation?.gt(0)">
              {{ formatNumber(exchange.toString() || 0, 2) }}%
            </template>
            <template v-else>-</template>
          </span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('totalSupply') }}</span>
          <span class="color-[--secondary-text]">{{ formatNumber(effectiveTotal || 0, 2) }}</span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('FDV') }}</span>
          <span class="color-[--secondary-text]"
            >${{ formatNumber(Number(token?.total || 0) * (tokenStore?.price || 0)) }}</span
          >
        </li>
        <!-- <li v-if="token?.total" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('circulation') }}</span>
          <span class="color-[--secondary-text]">{{ formatNumber(tokenStore?.circulation.toFixed() || 0) }}</span>
        </li> -->
        <li v-if="pair" class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('createdTime') }}</span>
          <span class="color-[--secondary-text]">{{
            pair?.created_at ? formatDate(pair?.created_at) : '-'
          }}</span>
        </li>
        <!-- <template v-for="(item, index) in medias?.slice()" :key="index">
          <template v-if="item?.url">
            <template v-if="item?.name == 'Telegram'">
              <template v-for="(i, $index) in item?.url?.split(',')" :key="$index">
                <li class="flex justify-between mb-12px">
                  <span class="color-[--third-text]">{{ $index > 0 ? item?.name + $index : item?.name }}:</span>
                  <a class="clickable color-[--secondary-text] hover:color-[--main-text] text-right line-clamp-1 max-w-200px" style="text-decoration: none;" :href="i" target="_blank">{{ i }}</a>
                </li>
              </template>
            </template>
            <li v-else class="flex justify-between mb-12px">
              <span class="color-[--third-text]">{{  item?.name }}:</span>
              <a class="clickable color-[--secondary-text] hover:color-[--main-text] text-right line-clamp-1 max-w-200px" style="text-decoration: none;" :href="item?.url" target="_blank">{{ item?.url }}</a>
            </li>
          </template>
        </template> -->
      </ul>
      <div v-if="!isRank && intro" :class="{ bg: active == 'grid' }">
        <div v-if="intro" class="text-14px mb-12px color-[--third-text]">
          {{ $t('currencyOverview') }}
        </div>
        <div class="text-12px color-[--secondary-text] token-description">
          <span v-html="showAll ? intro : intro?.slice(0, 250)" />
          <button
            v-if="intro?.length > 250"
            class="text-12px color-#3F80F7 bg-transparent outline-none border-none clickable"
            @click.stop="showAll = !showAll"
          >
            {{ !showAll ? $t('more') : $t('expand') }}
          </button>
        </div>
      </div>
      <div v-if="supportObj[chain]" class="flex-between color-[--secondary-text] text-center">
        <a
          href=""
          class="bg flex-1 color-[--secondary-text] text-14px"
          @click.stop.prevent="dialog_analysis = true"
          >{{ $t('generateTokenAnalysis') }}</a
        >
        <a
          href=""
          class="bg flex-1 color-[--secondary-text] text-14px ml-12px"
          @click.stop.prevent="dialog_bubble = true"
          >{{ $t('generateScore') }}</a
        >
      </div>
      <div v-if="!isRank" :class="{ bg: active == 'grid' }" class="mt-12px">
        <div class="text-14px color-[--third-text] flex items-center justify-start mb-12px">
          <Icon name="custom:ai" class="text-12px mr-5px" /> <span>{{ $t('aiSummary') }}</span>
        </div>
        <div class="text-12px color-[--secondary-text] token-description">
          <template v-if="!headlineArr">
            {{
              aiSummary?.summary || aiSummary?.headline
                ? aiSummary?.summary || aiSummary?.headline
                : $t('aiIsAnalyzing')
            }}
          </template>
          <template v-else>
            <div v-for="item in headlineArr" :key="item">
              {{ item }}
            </div>
          </template>
        </div>
      </div>
      <el-dialog
        v-model="dialog_bubble"
        width="50vw"
        align-center
        :height="height - 350"
        class="search-dialog"
        header-class="p-0! pl-20px! p-0!"
        :title="$t('tokenScore')"
        append-to-body
        lock-scroll
        destroy-on-close
      >
        <iframe
          class="mt-20px"
          style="width: 50vw; border: none"
          :style="{ height: height - 350 + 'px' }"
          :src="`https://app.creditlink.info/tokenScore?chain=${supportObj[chain]}&address=${tokenAddress}&model=${mode}&platform=ave.ai`"
          allow="clipboard-write"
        />
      </el-dialog>
      <el-dialog
        v-model="dialog_analysis"
        width="80vw"
        align-center
        :height="height - 350"
        class="search-dialog"
        header-class="p-0! pl-20px! p-0!"
        :title="$t('tokenAnalysis')"
        append-to-body
        lock-scroll
      >
        <iframe
          class="mt-20px"
          style="width: 80vw; border: none"
          :style="{ height: height - 350 + 'px' }"
          :src="`https://app.creditlink.info/tokenAnalyse?chain=${supportObj[chain]}&address=${tokenAddress}&model=${mode}&platform=ave.ai`"
          allow="clipboard-write"
        />
      </el-dialog>
    </div>
    <div v-else-if="activeTab == 'devBit'">
      <DevTokens />
    </div>
  </div>
</template>

<script setup lang="ts">
import { _getDevList } from '@/api/run'
import DevTokens from './DevTokens.vue'
import { formatDate, formatExplorerUrl, isJSON } from '@/utils/index'
import { useTokenStore } from '~/stores/token'
import { useWindowSize } from '@vueuse/core'
import BigNumber from 'bignumber.js'
const aiSummary = inject<Ref<{ summary: string; headline: string }>>('aiSummary')
const props = defineProps<{
  isRank?: boolean
}>()
const { height } = useWindowSize()
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const checkStore = useCheckStore()
const pair = computed(() => tokenStore.pair)
const token = computed(() => tokenStore.token)
const circulation = computed(() => tokenStore.circulation)
const tokenInfoExtra = computed(() => tokenStore.tokenInfoExtra)
const localeStore = useLocaleStore()
const { t } = useI18n()
const showAll = ref(false)
const totalTokens = ref(0)
const active = shallowRef(props.isRank ? 'col' : 'grid')
const activeTab = shallowRef('info')
const headerTabs = computed(() => {
  return [
    { id: 'info', name: t('tokenInfo') },
    { id: 'devBit', name: t('devTokens') }
  ]
})
const tabs = [
  { id: 'grid', icon: 'grid', name: 'grid' },
  { id: 'col', icon: 'col', name: 'col' },
]
const globalStore = useGlobalStore()
const { mode } = storeToRefs(globalStore)
const supportObj: Record<string, string> = {
  eth: 'ETH',
  bsc: 'BSC',
  base: 'BASE',
  solana: 'SOL',
  optimism: 'OP',
}

const route = useRoute()
const id = computed(() => route.params.id as string)

async function getRugPullList() {
  const data = {
    token_id: id.value,
    pageNO: 1,
    pageSize: 1,
  }
  const res = await _getDevList(data)
  totalTokens.value = res.total_tokens
}

watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      getRugPullList()
    }
  }
)

onMounted(() => {
  if (route.params.id) {
    getRugPullList()
  }
})

// function filterSuppportChains(chain: string) {
//   return supportObj[chain] || ''
// }
const dialog_bubble = shallowRef(false)
const dialog_analysis = shallowRef(false)

const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})
const tokenAddress = computed(() => {
  return addressAndChain.value?.address
})
const chain = computed(() => {
  return addressAndChain.value?.chain
})

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
    .minus(token.value?.lock_amount_dec || 0)
    .minus(token.value?.other_amount_dec || 0)
    .minus(token.value?.burn_amount_dec || 0).toFixed()
})
const exchange = computed(() => {
  return (
    new BigNumber(tokenInfoExtra.value?.amount_24 || 0)
      .div(circulation.value || 0)
      .multipliedBy(100) || 0
  )
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
.tabHeader {
  div {
    cursor: pointer;
  }
  .on {
    color: var(--main-text);
  }
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--main-list-hover);
  padding: 2px;
  border-radius: 4px;
  height: 24px;
  span.item {
    font-size: 12px;
    color: var(--third-text);
    cursor: pointer;
    border-radius: 2px;
    height: 22px;
    width: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    & + .item {
      margin-left: 2px;
    }
    &.active {
      color: var(--secondary-text);
      background: var(--secondary-bg);
    }
  }
}
ul {
  &.active {
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    // width: 100%;
    overflow: hidden;
    max-width: 100%;
    & > :last-child {
      grid-column: 1 / -1; /* 占满整行 */
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      & > :first-child {
        margin-top: 0px;
      }
    }
    li {
      background: var(--main-input-button-bg);
      border-radius: 4px;
      padding: 8px;
      flex-direction: column-reverse;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      & > :first-child {
        margin-top: 6px;
      }
    }
  }
}
.bg {
  background: var(--main-input-button-bg);
  border-radius: 4px;
  padding: 8px;
  margin-top: 12px;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
