<template>
  <div class="perp-deposit">
    <div class="flex items-center color-[--yellow] text-12px mb-15px">
      <Icon name="carbon:warning-filled" class="text-14px  color-[--yellow] mr-3px mb--1px" />
      <span>{{ $t('perpDepositTips') }}</span>
    </div>
    <el-select
      v-model="depositForm.token"
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
      v-model="depositForm.chain"
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
    <el-input v-model="depositForm.amount"
      class="text-right"
      inputmode="decimal" clearable placeholder="0.00"
      size="large"
      @input="value => depositForm.amount = value.replace(/\-|[^\d.]/g, '')">
      <template #prefix>
        <div class="color-[--third-text]">{{ $t('amount') }}</div>
      </template>
      <template #suffix>
        <button class="color-[--primary-color] border-none bg-transparent clickable text-14px" @click.stop="depositForm.amount = balance">{{ $t('max') }}</button>
      </template>
    </el-input>
    <div class="text-12px color-[--third-text] mt-8px text-right">
      <span>{{ $t('availableBalance') }}: </span><span>{{ formatNumber(balance, 3) }} {{ depositForm?.token || '' }}</span>
      <span v-if="depositForm.amount && BigNumber(depositForm.amount).gt(0) && BigNumber(balance).minus(depositForm.amount || 0).gte(0)"> -> {{ formatNumber(BigNumber(balance).minus(depositForm.amount || 0).toFixed(), 6) }} {{ depositForm?.token || '' }}</span>
    </div>
    <div v-if="!isApprove && isCanDeposit" class="flex flex-col items-center justify-center text-center mt-20px">
      <div class="text-14px color-[--main-text]">{{ $t('depositApproveTips1', {chain: chainName, token: depositForm.token}) }}</div>
      <div class="text-12px color-[--secondary-text] mt-5px">{{ $t('depositApproveTips2', {chain: chainName, token: depositForm.token}) }}</div>
      <el-button type="primary" class="rd-8px mt-20px" :loading="loadingApprove" @click.stop="_approve">{{ $t('enableToken', {token: depositForm.token}) }}</el-button>
    </div>
    <div class="text-14px flex items-center justify-between mt-32px rd-4px">
      <span class="color-[--secondary-text]">{{ $t('arrivalTime') }}</span>
      <span class="color-[--main-text]">≈ 2{{ $t('minutes') }}</span>
    </div>
    <div class="text-14px flex items-center justify-between mt-16px rd-4px">
      <span class="color-[--secondary-text]">{{ $t('totalBalance1') }}</span>
      <span class="color-[--main-text] ml-auto">{{ formatNumber(prepBalance, 4) }}</span>
      <span v-if="depositForm.amount && BigNumber(depositForm.amount).gt(0) && BigNumber(prepBalance).plus(depositForm.amount || 0).gte(0)" class="color-[--main-text] ml-5px"> -> {{ formatNumber(BigNumber(prepBalance).plus(depositForm.amount || 0).toFixed(), 6) }}</span>
      <span class="ml-3px">{{ depositForm?.token || '' }}</span>
    </div>
    <el-button v-if="isApprove && isCanDeposit" type="primary" size="large" class="w-full text-16px h-48px rd-8px mt-20px" :loading="loading" @click.stop="handleDeposit">{{ $t('confirmDeposit') }}</el-button>
    <button v-else disabled class="w-full text-16px h-48px bg-[--border] color-[--secondary-text] flex items-center justify-center border-none rd-8px mt-20px cursor-not-allowed">{{ $t('confirmDeposit') }}</button>
  </div>
</template>

<script setup lang='ts'>
import { getBalance } from '~/api/swap'
import { usePerpStore } from '~/stores/perp'
import { switchEthereumChain } from '~/utils/wallet/evm'
import { allowance, approve, deposit } from '~/api/perp/utils'
import BigNumber from 'bignumber.js'
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

const depositForm = reactive<{
  chain: string | undefined
  token: string
  amount: string | number
}>({
  chain: '56',
  token: 'USDT',
  amount: ''
})

const balanceObj = ref<{
  [key: string]: string | number
}>({})

const balance = computed(() => {
  return balanceObj.value?.[depositForm.token + '-' + depositForm.chain] || 0
})

const { prepBalance } = usePerp()
const availableBalance = computed(() => {
  return BigNumber(calculateAvailableBalance('', '1000') || '0').dp(6, BigNumber.ROUND_FLOOR).toString()
})

const getTokenBalance = async() => {
  if (!depositForm.token || !depositForm.chain) return
  const tokenInfo = perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === depositForm.chain)?.tokenList?.find(i => i.token === depositForm.token)
  if (!tokenInfo) return
  return getBalance(tokenInfo.tokenAddress).then(res => {
    console.log('getMainTokenBalance', res)
    const decimals = tokenInfo?.decimals || 0
    const _balance = formatUnits(res, Number(decimals))
    balanceObj.value[depositForm.token + '-' + depositForm.chain]  = _balance
    console.log('balanceObj', balanceObj.value)
    return _balance
  })
}


const allowanceObj = ref<{
  [key: string]: string | number
}>({})

const isApprove = computed(() => {
  const _allowance = allowanceObj.value?.[depositForm.token + '-' + depositForm.chain] || 0
  return new BigNumber(_allowance).gte(depositForm.amount || 0)
})

async function getIsApprove() {
  await getAllowance()
  const _allowance = allowanceObj.value?.[depositForm.token + '-' + depositForm.chain] || 0
  return new BigNumber(_allowance).gte(depositForm.amount || 0)
}

function getTokenInfo() {
  return perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === depositForm.chain)?.tokenList?.find(i => i.token === depositForm.token)
}


function getAllowance() {
  if (!depositForm.token || !depositForm.chain) return
  const tokenInfo = perpStore.metadata?.multiChain?.chainList?.find(i => i.chainId === depositForm.chain)?.tokenList?.find(i => i.token === depositForm.token)
  if (!tokenInfo) return
  return allowance(tokenInfo.tokenAddress).then(res => {
    console.log('getMainTokenBalance', res)
    const decimals = tokenInfo?.decimals || 0
    const _allowance = formatUnits(res, Number(decimals))
    allowanceObj.value[depositForm.token + '-' + depositForm.chain]  = _allowance
    console.log('allowanceObj', allowanceObj.value)
    return _allowance
  })
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
  return (perpStore.metadata?.multiChain.chainList || [])?.filter(i => i.tokenList?.some(i => i.token === depositForm.token))
})

const chainName = computed(() => {
  return chains.value.find(item => item.chainId === depositForm.chain)?.chain || getChainInfo(depositForm.chain || '', true)?.name || ''
})

watch(() => depositForm.chain, (val) => {
  if (val) {
    depositForm.amount = ''
  }
})

watch(chains, (val) => {
  if (val.length) {
    if (val?.some(i => i.chainId === depositForm.chain)) return
    depositForm.chain = val[0].chainId
  }
})


const isCanDeposit = computed(() => {
  return depositForm.chain && depositForm.token && depositForm.amount && (perpStore.metadata?.multiChain?.chainList || [])?.some?.(i => i.chainId === depositForm.chain)
})

watch(() => depositForm.token, () => {
  getTokenBalance()
  getAllowance()
})

function init() {
  const chainList = (perpStore.metadata?.multiChain.chainList || [])
  const chain = getChainInfo(walletStore.chain)?.chain_id || chainList?.[0]?.chainId
  depositForm.token = 'USDT'
  if (chainList?.some(i => i.chainId === chain)) {
    depositForm.chain = chain
    getTokenBalance()
  } else {
    depositForm.chain = undefined
  }
  getAllowance()
}

watch(() => props.getVisible().value, (val) => {
  if (val) {
    init()
  }
})

watch(() => depositForm.chain, (val) => {
  if (val) {
    const chain = getChainInfo(val, true)?.net_name
    if (chain === walletStore.chain) return
    switchEthereumChain(chain || '', walletStore.provider as any, [walletStore.address]).then((res) => {
      console.log('switchEthereumChain', res)
      getTokenBalance()
      getAllowance()
    })
  }
})

const loadingApprove = ref(false)

async function _approve() {
  // const isApprove = await getIsApprove()
  const tokenInfo = getTokenInfo()
  loadingApprove.value = true
  const notifyDom = ElNotification({ icon: h('div', {class: 'el-loading-spinner', style: '--el-loading-spinner-size: 24px'}, [h('svg', { viewBox: '0 0 50 50', class: 'circular' }, [h('circle', { class: 'path', style: 'stroke-width: 3', cx: '25', cy: '25', r: '20', fill: 'none' })])]), message: t('approving') + '...', duration: 0 })
  approve(tokenInfo?.tokenAddress || '').then(res => {
    return res.wait()
  }).then(async res => {
    notifyDom?.close?.()
    ElNotification({ type: 'success', message:  t('approveSuccess') })
    getAllowance()
    return res
  }).catch(err => {
    notifyDom?.close?.()
    // ElNotification({ type: 'error', message: err })
    loadingApprove.value = false
    handleError(err)
  })
}

const loading = ref(false)
async function handleDeposit() {
  if (!isCanDeposit.value) return
  const minDeposit = perpStore.metadata?.multiChain?.minDeposit || 0
  // if (new BigNumber(depositForm.amount || 0).lt(minDeposit)) {
  //   ElMessage.error(t('minDeposit', { amount: minDeposit }))
  //   return
  // }
  loading.value = true
  const isApprove = await getIsApprove()
  const tokenInfo = getTokenInfo()
  if (!isApprove) {
    const notifyDom = ElNotification({ icon: h('div', {class: 'el-loading-spinner', style: '--el-loading-spinner-size: 24px'}, [h('svg', { viewBox: '0 0 50 50', class: 'circular' }, [h('circle', { class: 'path', style: 'stroke-width: 3', cx: '25', cy: '25', r: '20', fill: 'none' })])]), message: t('approving') + '...', duration: 0 })
    await approve(tokenInfo?.tokenAddress || '').then(res => {
      return res.wait()
    }).then(async res => {
      notifyDom?.close?.()
      ElNotification({ type: 'success', message:  t('approveSuccess') })
      return res
    }).catch(err => {
      notifyDom?.close?.()
      // ElNotification({ type: 'error', message: err })
      loading.value = false
      handleError(err)
      return Promise.reject(err)
    })
  }

  const amount = parseUnits(depositForm.amount || 0, tokenInfo?.decimals || 0).toFixed(0)
  deposit(tokenInfo?.tokenAddress || '', amount).then(res => {
    ElNotification({ type: 'success', message:  t('depositTxSubmitted') })
    return res.wait()
  }).then((res) => {
    console.log(res)
    ElNotification({ type: 'success', message:  t('depositComplete') })
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
