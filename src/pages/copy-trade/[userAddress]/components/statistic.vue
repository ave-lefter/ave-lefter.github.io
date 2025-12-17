<template>
  <div class="w-full">
    <div class="flex-start">
      <div class="flex gap-6">
        <UserAvatar
          :key="copyObj?.followAddress"
          :wallet_logo="{ url: copyObj?.followAddress, logo: copyObj?.followIconUrl }"
          :address="followAddress"
          :chain="selectChain"
          iconSize="60px"
        />
        <div>
          <div class="flex items-center mb-1.5">
            <UserRemark
              v-if="address"
              :key="followAddress"
              class="gap-1.5 text-6 leading-7.5 text-[--main-text]"
              :address="followAddress"
              :chain="selectChain"
              :remark="copyObj?.followName"
              iconEditSize="16px"
              :maxRemarkLength="15"
              @updateRemark="({ remark }) => (copyObj.followName = remark)"
            />
          </div>
          <div class="flex items-center gap-2">
            <div class="statistic-address flex gap-2.5 cursor-pointer" @click="addressClick">
              <div
                class="statistic-address-copy flex items-center justify-center px-2 py-1.75 h-6 rounded text-3 gap-1 text-[--third-text] bg-[--main-input-button-bg]"
              >
                {{ addressText }}
                <Icon
                  v-copy="followAddress"
                  name="bxs:copy"
                  class="text-2.5 clickable text-[--third-text]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1"></div>
      <el-select
        class="mr-9px"
        :style="{ width: '120px' }"
        :suffix-icon="SuffixIcon"
        v-model="selectChain"
        @change="change"
      >
        <template #prefix>
          <ChainToken :chain="selectChain" :width="16" />
        </template>
        <el-option
          v-for="{ chain: _chain } in smartChains"
          :key="_chain"
          :label="getChainInfo(_chain)?.name"
          :value="_chain"
        >
          <div class="flex-start" style="gap: 4px">
            <ChainToken :chain="_chain" :width="16" />
            {{ getChainInfo(_chain)?.name }}
          </div>
        </el-option>
      </el-select>
      <Operate v-if="botStore.evmAddress" :id="copyObj?.id" :chain="props.chain" :status="copyObj.status" @updataRow= "updataRow"/>
    </div>
    <div class="flex mt-27px gap-12px">
      <div
        class="item bg-[--secondary-bg] px-24px py-24px rounded-8px flex-1 flex flex-col items-center"
      >
        <span class="text-14px color-[--third-text] block mb-10px">{{ $t('realizedProfit') }}</span>
        <span v-if="Number(copyObj?.profitRealized)>0" class="text-18px color-[--up-color]">${{ formatNumber(copyObj?.profitRealized || 0, 2) }}</span>
        <span v-else-if="Number(copyObj?.profitRealized)<0" class="text-18px color-[--down-color]">${{ formatNumber(copyObj?.profitRealized || 0, 2) }}</span>
        <span v-else class="text-18px color-[--secondary-text]">0</span>
      </div>
      <div
        class="item bg-[--secondary-bg] px-24px py-24px rounded-8px flex-1 flex flex-col items-center"
      >
        <span class="text-14px color-[--third-text] block mb-10px">{{ $t('unrealizedProfit') }}</span>
        <span v-if="Number(copyObj?.profitUnrealized)>0" class="text-18px color-[--up-color]">${{ formatNumber(copyObj?.profitUnrealized || 0, 2) }}</span>
        <span v-else-if="Number(copyObj?.profitUnrealized)<0" class="text-18px color-[--down-color]">${{ formatNumber(copyObj?.profitUnrealized || 0, 2) }}</span>
        <span v-else class="text-18px color-[--secondary-text]">0</span>
      </div>
      <div
        class="item bg-[--secondary-bg] px-24px py-24px rounded-8px flex-1 flex flex-col items-center"
      >
        <span class="text-14px color-[--third-text] block mb-10px">{{ $t('positionsValue') }}</span>
        <span v-if="Number(copyObj?.holdingUsd)>0" class="text-18px color-[--main-text]">${{ formatNumber(copyObj?.holdingUsd || 0, 2) }}</span>
        <span v-else class="text-18px color-[--secondary-text]">0</span>
      </div>
      <div
        class="item bg-[--secondary-bg] px-24px py-24px rounded-8px flex-1 flex flex-col items-center"
      >
        <span class="text-14px color-[--third-text] block mb-10px">{{ $t('winTokenTotal') }}</span>
        <div class="text-18px color-[--secondary-text]">
          <span v-if="Number(copyObj?.winToken)>0"class="color-[--up-color]">{{ formatNumber(copyObj?.winToken || 0, 2) }}</span>
          <span v-else class="color-[--secondary-text]">0</span>
          /
          <span v-if="Number(copyObj?.totalTokenCount)>0" class="color-[--secondary-text]">{{ formatNumber(copyObj?.totalTokenCount || 0, 2) }}</span>
          <span v-else class="color-[--secondary-text]">0</span>
        </div>
      </div>
      <div
        class="item bg-[--secondary-bg] px-24px py-24px rounded-8px flex-1 flex flex-col items-center"
      >
        <span class="text-14px color-[--third-text] block mb-10px">{{ $t('lastSwapTime') }}</span>
        <span class="text-18px color-[--main-text]" v-if="Number(copyObj?.createTime) >0">
            {{ Number(copyObj?.createTime) >0? formatDate(copyObj?.createTime || 0, 'YYYY-MM-DD HH:mm') : '--' }}
            ~
            {{ Number(copyObj?.finishTime) >0? formatDate(copyObj?.finishTime || 0, 'YYYY-MM-DD HH:mm') : $t('today') }}
        </span>
        <span v-else class="text-18px color-[--secondary-text]">--</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//组件
import dayjs from 'dayjs'
import { getBalanceAnalysis, bindTwitter } from '@/api/wallet'

import UserRemark from '@/components/userRemark.vue'
import UserAvatar from '@/components/userAvatar.vue'

import ChainToken from '@/components/chainToken.vue'
import SuffixIcon from '~/components/suffixIcon.vue'
import Operate from '~/pages/copy-trade/components/operate.vue'
import { _getFollowInfoById } from '@/api/copyTrade'
import { type CopyObj } from '@/api/copyTrade'

const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  followAddress: {
    type: String,
    default: '',
  }
})
const { copyObj, copyOrder } = storeToRefs(useCopyTradeStore())
const { getFollowingInfo } = useCopyTradeStore()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { address, chain,followAddress } = toRefs(props)
const globalStore = useGlobalStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()

const { userInfo } = storeToRefs(useBotStore())

const remark = ref({
  value: '',
  isEdit: false,
  loading: false,
})
const selectChain = shallowRef('')
const balanceAnalysis = ref<Awaited<ReturnType<typeof getBalanceAnalysis>>>({
  profit: [],
  total_balance_without_risk: undefined,
})
const smartChains = computed(() => {
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  const supportFullDataChain = copyOrder.value?.copyList?.filter((i) => i.followAddress== followAddress.value)?.map(i => i.chain) || []
  if (botStore.evmAddress) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) =>
      supportFullDataChain?.includes(el.chain)
    )
    console.log('botChains', botChains)
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  return [
    {
      chain: chain.value,
    },
  ]
})
const addressText = computed(() => {
  return followAddress.value.slice(0, 4) + '...' + followAddress.value.slice(-4)
})

const selfAddress = computed(() => {
  return botStore?.evmAddress || walletStore?.address || ''
})

onMounted(async () => {
  selectChain.value = chain.value
  if (copyOrder.value?.copyList?.length == 0 || !copyOrder.value) {
    await getFollowingInfo()
    console.log('----copyOrder.value---',copyOrder.value)
    copyObj.value = copyOrder.value?.copyList?.find((i) => i.chain === selectChain.value && i.followAddress== followAddress.value)
  }
  console.log('--------------',copyObj.value?.id || route.query.id)
  if (copyObj.value?.id || route.query.id) {
    getFollowInfoById()
  }
})
async function change(val: string) {
  copyObj.value = copyOrder.value?.copyList?.find((i) => i.chain === val && i.followAddress== followAddress.value)
  console.log('------copyObj.value-----',copyObj.value)
  if (copyObj.value?.id) {
    getFollowInfoById()
  } else {
    reset()
  }
  const url = {
    name: 'copy-trade-wallet',
    params: {
      userAddress: copyObj.value.followAddress,
      chain: copyObj.value.chain,
    },
    query: {
      followAddress: copyObj.value.followAddress,
      creatorAddress: copyObj.value.creatorAddress,
      id: copyObj.value.id,
    },
  }
  navigateTo(url)
}
function getFollowInfoById() {
  const data = {
    id: copyObj.value?.id || route.query.id,
    chain: copyObj.value?.chain || route.params.chain,
  }
  _getFollowInfoById(data).then((res) => {
    copyObj.value = {
      ...res,
      lastSwap:
        res?.lastSwap !== '1970-01-01T00:00:00Z' && res?.lastSwap !== '0001-01-01T00:00:00Z'
          ? res.lastSwap
          : '0',
    }
  })
}
function updataRow() {
  getFollowInfoById()
}
function reset() {
  copyObj.value = {
    followAddress: followAddress.value,
    creatorAddress:address.value,
    totalTokenCount: 0,
    winToken: 0,
    profitRealized: '0',
    profitUnrealized: '0',
    lastSwap: '0',
    chain : selectChain.value
  }
}
// async function onGetWalletBasicInfo() {
//   const params = {
//     user_address: address.value,
//     self_address: selfAddress.value,
//     user_chain: chain.value,
//   }
//   const res = await getWalletBasicInfo(params)
//   console.log(res, 'res=>')
//   statistics.value = {
//     ...statistics.value,
//     ...(res || {}),
//   }
//   remark.value = res.remark || userInfo.value?.name
// }

async function _bindTwitter() {
  if (!verifyLogin()) {
    return
  }
  // let signature = ''
  // if (address.value && !botStore.evmAddress) {
  //   signature = await signTwitterConfirm()
  // }
  const signature = await walletStore.signMessageForFavorite()
  const data: {
    user_address: string
    user_chain: string
    origin: string
    signature?: string
    authorization?: string
  } = {
    user_address: address.value,
    user_chain: chain.value,
    origin: window.location.href,
  }
  if (botStore.accessToken) {
    data.authorization = botStore.accessToken
  }
  if (signature) {
    data.signature = signature
  }
  // loadingBind = true
  bindTwitter(data)
    .then((res) => {
      const ave_param = res?.ave_param
      const host = 'https://api.agacve.com'
      const redirect_uri = encodeURIComponent(
        `${host}/v2api/walletinfo/v2/bind_x_callback?user_chain=${data.user_chain}&ave_param=${ave_param}&user_address=${data.user_address}`
      )

      const url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=UTdHQm9Ta2twLWtlWFBEd1hpenA6MTpjaQ&scope=tweet.read users.read follows.read list.read like.read&state=random_state&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${redirect_uri}`
      window.open(url)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      // loadingBind = false
    })
}

function mergeStatistics(data: any) {}
defineExpose({
  mergeStatistics,
})

function addressClick() {
  window.open(formatExplorerUrl(chain.value, address.value, 'address'))
}
</script>
<style scoped>
.custom-switch {
  --el-switch-off-color: var(--main-input-button-bg);
  --el-switch-on-color: var(--icon-color);
}

::v-deep .el-switch__action {
  background-color: transparent;
}
::v-deep .max-w-42px {
  max-width: 200px !important;
}
</style>
