<template>
  <div class="perp-deposit">
    <el-select
      v-model="withdrawForm.token"
      placeholder="Select"
      class="mb-16px"
      size="large"
    >
      <template #prefix>
        <div class="color-[--third-text]">{{ $t('token') }}</div>
      </template>
      <template #label="{value, label}">
        <div class="inline-flex items-center vertical-middle">
          <img :src="tokens?.find?.(item => item.token === value)?.iconUrl" class="rd-50% mr-5px" width="24" lazy alt="">
          <span>{{ label || '' }}</span>
        </div>
      </template>
      <el-option
        v-for="item in tokens"
        :key="item.token"
        :label="item.token"
        :value="item.token"
        class="h-40px! flex items-center"
      >
        <img :src="item.iconUrl" class="rd-50% mr-5px" width="24" lazy alt="">
        <span>{{ item.token || '' }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="withdrawForm.chain"
      class="mb-16px"
      placeholder="Select"
      style="width: 100%;"
      size="large"
    >
      <template #prefix>
        <div class="color-[--third-text]">{{ $t('chain1') }}</div>
      </template>
      <template #label="{value, label}">
        <div class="inline-flex items-center vertical-middle">
          <img :src="chains.find(item => item.chainId === value)?.chainIconUrl" class="rd-50% mr-5px" width="24" lazy alt="">
          <span>{{ chains.find(item => item.chainId === value)?.chain || getChainInfo(value, true)?.name || label || '' }}</span>
        </div>
      </template>
      <el-option
        v-for="item in chains"
        :key="item.chainId"
        :label="item.chain"
        :value="item.chainId"
        class="h-40px! flex items-center"
      >
        <img :src="item.chainIconUrl" class="rd-50% mr-5px" width="24" lazy alt="">
        <span>{{ item.chain || '' }}</span>
      </el-option>
    </el-select>
    <div class="flex items-center justify-between mb-16px text-14px bg-[--border] h-40px rd-6px px-12px">
      <span class="color-[--third-text]">{{ $t('poolBalance') }}</span>
      <span>{{ poolBalance }} {{ withdrawForm?.token || '' }}</span>
    </div>
    <el-input v-model="withdrawForm.amount"
      class="text-right"
      inputmode="decimal" clearable placeholder="0.00"
      size="large"
      @input="value => withdrawForm.amount = value.replace(/\-|[^\d.]/g, '')">
      <template #prefix>
        <div class="color-[--third-text]">{{ $t('amount') }}</div>
      </template>
      <template #suffix>
        <button class="color-[--primary-color] border-none bg-transparent clickable text-14px" @click.stop="handleMax">{{ $t('max') }}</button>
      </template>
    </el-input>
    <div class="text-12px color-[--third-text] mt-8px text-right">
      <span>{{ $t('availableBalance') }}: </span><span>{{ balance }} {{ withdrawForm?.token || '' }}</span>
    </div>
    <!-- <div class="text-14px flex items-center justify-between mt-32px rd-4px">
      <span class="color-[--secondary-text]">到账时间</span>
      <span class="color-[--main-text]">≈ 2分钟</span>
    </div> -->
    <div v-if="withdrawForm.chain === '1'" class="text-14px flex items-center justify-between mt-16px rd-4px">
      <span class="color-[--secondary-text]">{{ $t('withdrawAmount') }}</span>
      <span class="color-[--main-text]">{{ formatNumber(withdrawForm.amount, 3) }} {{ withdrawForm?.token || '' }}</span>
    </div>
    <template v-else>
      <div class="text-14px flex items-center justify-between mt-16px rd-4px">
        <span class="color-[--secondary-text]">{{ $t('fee') }}/{{ $t('feeRate') }}</span>
        <span class="color-[--main-text]">{{ formatNumber(fee, 3) }} {{ withdrawForm?.token || '' }} / {{ formatNumber(feeRate, 3) }}%</span>
      </div>
      <div class="text-14px flex items-center justify-between mt-16px rd-4px">
        <span class="color-[--secondary-text]">{{ $t('amountReceive') }}</span>
        <span class="color-[--main-text]">{{ formatNumber(receiveAmount, 3) }} {{ withdrawForm?.token || '' }}</span>
      </div>
    </template>
    <el-button v-if="isCanWithdraw" type="primary" size="large" class="w-full text-16px h-48px rd-8px mt-20px" :loading="loading" @click.stop="handleWithdraw">{{ $t('confirmWithdrawal') }}</el-button>
    <button v-else disabled class="w-full text-16px h-48px bg-[--border] color-[--secondary-text] flex items-center justify-center border-none rd-8px mt-20px cursor-not-allowed">{{ $t('confirmWithdrawal') }}</button>
    <div v-if="withdrawForm.chain === '1'" class="mt-16px font-400">
      <div class="flex items-center color-[--main-text] text-12px mb-8px">
        <Icon name="carbon:warning-filled" class="text-14px mr-3px mb--1px" />
        <span>{{ $t('withdrawTipsTitle') }}</span>
      </div>
      <div class="text-12px color-[--secondary-text] lh-16px">{{ $t('withdrawTips') }}</div>
    </div>
    <div v-else class="mt-16px font-400">
      <div class="flex items-center color-[--main-text] text-12px mb-8px">
        <Icon name="carbon:warning-filled" class="text-14px mr-3px mb--1px" />
        <span>{{ $t('crossWithdrawIntro') }}</span>
      </div>
      <div class="text-12px color-[--secondary-text] lh-16px">{{ $t('crossWithdrawDesc') }} </div>
    </div>

  </div>
</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
import { withdraw, getCrossWithdrawSignInfo } from '~/api/perp/utils'
import BigNumber from 'bignumber.js'
import { Contract, JsonRpcProvider } from 'ethers'
import { ERC20ABI } from '~/utils/wallet/utils/abi'
const props = defineProps({
  getVisible: {
    type: Function as PropType<() => Ref<boolean>>,
    default: () => {
      return ref(false)
    }
  }
})

const emit = defineEmits(['success'])
const walletStore = useWalletStore()

const { t } = useI18n()

const withdrawForm = reactive<{
  chain: string | undefined
  token: string
  amount: string | number
}>({
  chain: '56',
  token: 'USDT',
  amount: ''
})


const balance = computed(() => {
  return BigNumber(CoreCalculator.getCollateralAvailableAmount('1000') || '0').dp(6, BigNumber.ROUND_FLOOR).toString()
})


function handleMax() {
  withdrawForm.amount = new BigNumber(balance.value).toFixed()
}


function getTokenInfo() {
  return perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === withdrawForm.chain)?.tokenList?.find(i => i.token === withdrawForm.token)
}

const poolBalanceObj = ref<{
  [key: string]: string | number
}>({})

const poolBalance = computed(() => {
  if (withdrawForm.chain == '1') {
    return '∞'
  }
  return poolBalanceObj.value?.[withdrawForm.token + '-' + withdrawForm.chain] || 0
})

async function getPoolBalance() {
  if (!withdrawForm.token || !withdrawForm.chain) return
  console.log('withdrawForm.chain', withdrawForm.chain)
  const chainInfo = perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === withdrawForm.chain)
  const tokenInfo = chainInfo?.tokenList?.find(i => i.token === withdrawForm.token)
  const decimals = tokenInfo?.decimals
  const rpcUrl = chainInfo?.appRpcUrl || getChainInfo(withdrawForm.chain, true)?.rpc_url
  const _provider = new JsonRpcProvider(rpcUrl, Number(withdrawForm.chain))
  let balance: bigint | number = BigInt(0)
  const ERC20 = new Contract(tokenInfo?.tokenAddress || '', ERC20ABI, _provider)
  balance = await ERC20.balanceOf(tokenInfo?.contractAddress)
  poolBalanceObj.value[withdrawForm.token + '-' + withdrawForm.chain]  = formatUnits(new BigNumber(balance.toString()).toFixed(0), Number(decimals))
}


const perpStore = usePerpStore()

const tokens = [
  {
    token: 'USDT',
    iconUrl: 'https://static.edgex.exchange/icons/coin/USDT.svg'
  },
  {
    token: 'USDC',
    iconUrl: 'https://static.edgex.exchange/icons/coin/USDC.svg'
  }
]

const chains = computed(() => {
  return (perpStore.metadata?.multiChain.chainList || [])?.filter(i => i.tokenList?.some(i => i.token === withdrawForm.token))
})

watch(chains, (val) => {
  if (val.length) {
    if (val?.some(i => i.chainId === withdrawForm.chain)) return
    withdrawForm.chain = val[0].chainId
  }
})

const isCanWithdraw = computed(() => {
  const amount = new BigNumber(withdrawForm.amount || 0)
  return withdrawForm.chain && withdrawForm.token && withdrawForm.amount && (perpStore.metadata?.multiChain?.chainList || [])?.some?.(i => i.chainId === withdrawForm.chain) && (poolBalance.value === '∞' || amount.lte(poolBalance.value)) && amount.lte(balance.value)
})

watch(() => withdrawForm.token, () => {
  getPoolBalance()
  _getCrossWithdrawSignInfo()
})

const fee = ref('0')
const feeRate = computed(() => {
  const chainInfo = perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === withdrawForm.chain)
  return new BigNumber(chainInfo?.feeRate || 0.00005).times(100).toFixed()
})

const receiveAmount = computed(() => {
  return BigNumber.max(BigNumber(withdrawForm.amount || 0).minus(fee.value || 0), 0).toFixed()
})
function _getCrossWithdrawSignInfo() {
  fee.value = '0'
  if (!withdrawForm.token || !withdrawForm.chain || !withdrawForm.amount) return
  const tokenInfo = getTokenInfo()
  if (!tokenInfo) return
  return getCrossWithdrawSignInfo({
    tokenAddress: tokenInfo.tokenAddress || '',
    chain: withdrawForm.chain,
    amount: new BigNumber(withdrawForm.amount).toFixed()
  }).then(res => {
    fee.value = res.fee
  })
}

watch(() => withdrawForm.amount, () => {
  _getCrossWithdrawSignInfo()
})

function init() {
  const chainList = (perpStore.metadata?.multiChain.chainList || [])
  const chain = getChainInfo(walletStore.chain)?.chain_id || chainList?.[0]?.chainId
  withdrawForm.token = 'USDT'
  if (chainList?.some(i => i.chainId === chain)) {
    withdrawForm.chain = chain
    getPoolBalance()
  } else {
    withdrawForm.chain = undefined
  }
}

watch(() => props.getVisible().value, (val) => {
  if (val) {
    init()
  }
})

watch(() => withdrawForm.chain, (val) => {
  if (val) {
    getPoolBalance()
    _getCrossWithdrawSignInfo()
    // switchEthereumChain(chain || '', walletStore.provider as any, [walletStore.address]).then((res) => {
    //   console.log('switchEthereumChain', res)
    //   getTokenBalance()
    // })
  }
})


const loading = ref(false)
async function handleWithdraw() {
  if (!isCanWithdraw.value) return
  const minWithdraw = perpStore.metadata?.multiChain?.minWithdraw || 0
  if (BigNumber(withdrawForm.amount || 0).lte(fee.value || 0)) {
    ElMessage.error(t('withdrawTooSmall'))
    return
  }
  if (new BigNumber(withdrawForm.amount || 0).lt(minWithdraw)) {
    ElMessage.error(t('minWithdraw', { amount: minWithdraw }))
    // ElNotification({
    //   title: 'Error',
    //   message: t('minDeposit', { amount: minDeposit }),
    //   type: 'error'
    // })
    return
  }
  loading.value = true
  const tokenInfo = getTokenInfo()

  const amount = (withdrawForm.amount || '0') as string
  console.log('withdraw', tokenInfo?.tokenAddress, withdrawForm.amount, amount)
  withdraw({tokenAddress: tokenInfo?.tokenAddress || '', amount, chain: withdrawForm.chain || ''}).then((res) => {
    console.log(res)
    ElNotification({ type: 'success', message:  t('withdrawSubmitted') })
    emit('success', res)
    loading.value = false
  }).catch(err => {
    loading.value = false

    handleError(err)
  })
}

onMounted(() => {
  init()
})


</script>

<style lang="scss" scoped>
.perp-deposit {
  :deep() .el-select__selection {
    text-align: right;
  }
  :deep() .el-input__inner {
    text-align: right;
  }
  :deep() .el-select.el-select .el-select__wrapper {
    font-size: 14px;
  }
}

</style>
