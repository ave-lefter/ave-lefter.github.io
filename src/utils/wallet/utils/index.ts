import { BrowserProvider, JsonRpcProvider, type Eip1193Provider } from 'ethers'
import { Contract } from 'ethcall'
import { SwapContracts, SwapContracts1, SwapContracts2, SwapContracts3, FeeAddress, FeeAddress1, FeeChainsRegExp } from './constants'
import { ElMessageBox, ElMessage } from '#imports'
export { Provider as MultiProvider } from 'ethcall'

export function getProvider(chain: string) {
  const chainInfo = getChainInfo(chain)
  if (chainInfo?.vm_type !== 'evm') {
    return {
      _provider: null,
      chainInfo: chainInfo
    }
  }
  // if (chain === 'tron') {
  //   return {
  //     _provider: window.tronWeb,
  //     chainInfo: chainInfo
  //   }
  // }
  // if (chain === 'sui') {
  //   return {
  //     _provider: null,
  //     chainInfo: chainInfo
  //   }
  // }

  const walletStore = useWalletStore()
  const chainId = Number.isNaN(Number(chainInfo.chain_id)) ? undefined : chainInfo.chain_id
  let _provider
  if (walletStore.provider && chain === walletStore.chain) {
    _provider = new BrowserProvider((walletStore.provider || (window as any)?.ethereum) as Eip1193Provider)
  } else {
    const rpcUrl = chainInfo?.rpc_url || ''
    _provider = new JsonRpcProvider(rpcUrl, chainId)
  }
  return {_provider, chainInfo}
}

export async function getSigner() {
  const walletStore = useWalletStore()
  if (!walletStore.provider || !isEvmChain(walletStore.chain)) {
    return null
  }
  return  new BrowserProvider((walletStore.provider || (window as any)?.ethereum) as Eip1193Provider).getSigner()
}


export class MultiContract extends Contract {
  constructor(address: string, abi: string[]) {
    const newAbi = abiToJson(abi)
    super(address, newAbi)
    this.callStatic = {}
    const functions = newAbi.filter((x) => x.type === 'function')
    functions.forEach((i: any) => {
      this.callStatic[i.name] = function (...params: any) {
        return {
          ...i,
          contract: {
            address: address
          },
          params
        }
      }
    })
  }
}

export function getSwapContract(chain: string, user = useWalletStore().address) {
  if (!user) {
    return SwapContracts[chain]
  }
  const last = user.slice(-1)
  const nums = '0123456789abcdef'
  const n = 4
  const numsArr = new Array(n).fill(undefined).map((i, k) => {
    const pre = k > 1 ? `.{${k}}` : k === 1 ? '.' : ''
    const next = k < n - 2 ? `.{${n - k - 1}}` : k === n - 2 ? '.' : ''
    const s = nums.replace(new RegExp(`${pre}(.)${next}`, 'ig'), '$1')
    return new RegExp(`[${s}]`, 'i')
  })
  const swapArr = [SwapContracts, SwapContracts1, SwapContracts2, SwapContracts3]
  for (let i = 0; i < numsArr.length; i++) {
    if (numsArr[i].test(last)) {
      return swapArr[i][chain] || SwapContracts[chain]
    }
  }
  return SwapContracts[chain]
}

function getStrJSON(str: string) {
  const index = str.indexOf('error={')
  const lastIndex = str.lastIndexOf(', method=')
  const JSONStr = str.substring(index + 6, lastIndex)
  return isJSON(JSONStr) ? JSON.parse(JSONStr) : str
}

function handleSwapError(err: any, msg: string) {
  return (
    err?.data?.message?.includes?.(msg) ||
    (err?.message && err?.message?.includes?.(msg))
  )
}

export function handleError(err: any, type = '') {
  console.log('err', err)
  const { $i18n } = useNuxtApp()
  if (err?.message?.includes('User denied request signature')) {
    ElMessageBox.alert($i18n.t('hasRejected'), $i18n.t('tips'), {
      confirmButtonText: $i18n.t('okay'),
    })
    return
  }
  if (type === 'solana') {
    const msg =
      typeof err === 'string' ? err : err?.data?.message || err?.message
    if (msg?.includes('0x1771') || msg?.includes('0x1e')) {
      ElMessageBox.alert($i18n.t('solanaError'), $i18n.t('tips'), {
        confirmButtonText: $i18n.t('okay')
      })
      return
    } else if (msg?.includes('Swap fail')) {
      ElMessageBox.alert($i18n.t('swapFail'), $i18n.t('tips'), {
        confirmButtonText: $i18n.t('okay')
      })
      return
    } else if (msg?.includes('0x28') || msg?.includes('0x1')) {
      ElMessageBox.alert(
        $i18n.t('insufficentFunds'),
        $i18n.t('tips'),
        {
          confirmButtonText: $i18n.t('okay')
        }
      )
      return
    } else if (
      /Attempt to debit an account but found no record of a prior credit/i.test(
        msg
      )
    ) {
      ElMessageBox.alert(
        $i18n.t('insufficentGasSOL'),
        $i18n.t('tips'),
        {
          confirmButtonText: $i18n.t('okay')
        }
      )
      return
    } else if (/insufficient funds for rent/i.test(msg)) {
      ElMessageBox.alert(
        $i18n.t('insufficentFundsSol'),
        $i18n.t('tips'),
        {
          confirmButtonText: $i18n.t('okay')
        }
      )
      return
    } else {
      ElMessageBox.alert(msg, $i18n.t('tips'), {
        confirmButtonText: $i18n.t('okay')
      })
      return
    }
  }

  if (err?.code === 'networkError') {
    ElMessage.error($i18n.t('networkIsUnstable'))
    return
  }
  if (err?.code === 'UNPREDICTABLE_GAS_LIMIT' && !err?.data) {
    const newErr = getStrJSON(err?.message)
    if (typeof newErr === 'object') {
      err = newErr
    }
  }
  const unknownError =
    type === 'swap'
      ? $i18n.t('swapUnknownError')
      : $i18n.t('unknownError')
  if (err?.code === 'noMatchingRoute') {
    ElMessageBox.alert($i18n.t('noMatchingRoute'), $i18n.t('tips'), {
      confirmButtonText: $i18n.t('okay')
    })
  } else if (
    err?.code === 4001 ||
    err?.message === 'Canceled' ||
    err?.message === 'Cancel' ||
    err === 'cancel' ||
    err === 'Confirmation declined by user' ||
    (err?.message || err) === 'User rejected the request' ||
    new RegExp(/user reject/i).test(err?.message || err)
  ) {
    ElMessageBox.alert($i18n.t('hasRejected'), $i18n.t('tips'), {
      confirmButtonText: $i18n.t('okay')
    })
  } else if (err?.message === 'ave-error') {
    ElMessage.error($i18n.t('tradeFail'))
  } else if (
    err?.code === -32602 ||
    (err?.message && err?.message?.includes?.('-32602'))
  ) {
    ElMessageBox.alert(
      $i18n.t('parametersInvalid'),
      $i18n.t('tips'),
      {
        confirmButtonText: $i18n.t('okay')
      }
    )
  } else if (
    (err?.code === -32603 && err?.data) ||
    (err?.message && err?.message?.includes?.('-32603')) ||
    (err?.message && !err?.code)
  ) {
    const walletStore = useWalletStore()
    const mainName = getChainInfo(walletStore.chain).main_name || ''
    const errorMsg: Record<string, string> = {
      INSUFFICIENT_OUTPUT_AMOUNT: $i18n.t('insufficientSlippage'),
      EXCESSIVE_INPUT_AMOUNT: $i18n.t('insufficientSlippage'),
      INVALID_PATH: $i18n.t('invalidPath'),
      IDENTICAL_ADDRESSES: $i18n.t('twoTokensCannotBeTheSame'),
      ZERO_ADDRESS: $i18n.t('cannotHave0Address'),
      EXPIRED: $i18n.t('expired'),
      INSUFFICIENT_LIQUIDITY: $i18n.t('insufficientLiquidity'),
      'ds-math-sub-underflow': $i18n.t('insufficientLiquidity'),
      'subtraction overflow': $i18n.t('insufficientLiquidity'),
      ': K': 'fee on transfer failed',
      ETH_TRANSFER_FAILED: `${
        mainName || 'ETH'
      } transfer failed`,
      'user reject this request': 'user reject this request',
    }
    const isSwapError = Object.keys(errorMsg).find((i) =>
      handleSwapError(err, i)
    )
    if (isSwapError) {
      ElMessageBox.alert(errorMsg[isSwapError], $i18n.t('tips'), {
        confirmButtonText: $i18n.t('okay')
      })
    } else {
      ElMessage.error(unknownError)
    }
  } else if (err?.code) {
    console.log(err?.message)
    ElMessage.error(unknownError)
  } else if (err?.message) {
    console.log(err?.message)
    ElMessage.error(unknownError)
  } else {
    console.log(err)
    if (err && typeof err === 'string') {
      ElMessage.error(err)
    } else {
      ElMessage.error(unknownError)
    }
  }
}

export function getFeeAddress(user = useWalletStore().address) {
  if (!user) {
    return FeeAddress
  }
  const last = user.slice(-1)
  const oddReg = /[02468ace]/i
  if (oddReg.test(last)) {
    return FeeAddress
  }
  return FeeAddress1
}

export function formatFee(res: { to_rebate_address: string; platform_fee: number; total_rebate: number; to_rebate: number }, chain: string) {
  if (!FeeChainsRegExp.test(chain)) {
    return {
      feeRate: 50,
      receiveRate: 0,
      referrer: res.to_rebate_address || '',
    }
  }
  if (/bsc|core|arbitrum/.test(chain)) {
    const platformFee = res.platform_fee ?? 50
    const totalRebate = (res?.total_rebate / 2) || 20
    const toRebate = (res?.to_rebate / 2) || 0
    const feeRate = Math.trunc(
      (platformFee * (100 - totalRebate + toRebate)) / 100
    )
    const receiveRate = Math.trunc(
      (10000 * toRebate) / (100 - totalRebate + toRebate)
    )
    const feeInfo = {
      feeRate:
        res.to_rebate_address === getFeeAddress() ? platformFee : feeRate,
      receiveRate: res.to_rebate_address === getFeeAddress() ? 0 : receiveRate,
      referrer: res.to_rebate_address || '',
    }
    return feeInfo
  }
  const platformFee = res.platform_fee ?? 50
  const totalRebate = res.total_rebate ?? 40
  const toRebate = res.to_rebate ?? 0
  const feeRate = Math.trunc(
    (platformFee * (100 - totalRebate + toRebate)) / 100
  )
  const receiveRate = Math.trunc(
    (10000 * toRebate) / (100 - totalRebate + toRebate)
  )
  const feeInfo = {
    feeRate: res.to_rebate_address === getFeeAddress() ? platformFee : feeRate,
    receiveRate: res.to_rebate_address === getFeeAddress() ? 0 : receiveRate,
    referrer: res.to_rebate_address || '',
  }
  return feeInfo
}

export async function getGasPrice(chain: string) {
  if (!isEvmChain(chain)) {
    return 0
  }
  const { _provider } = getProvider(chain)
  return _provider?.getFeeData().then(res => {
    if (res) {
      // gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
      return new BigNumber(res.gasPrice || 0).toNumber()
    }
    return 0
  }).catch(async() => {
    return 0
  })
}
