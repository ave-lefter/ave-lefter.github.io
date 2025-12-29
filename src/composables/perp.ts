import Perp from '@/components/header/connectWallet/perp/index.vue'
import Deposit from '@/components/header/connectWallet/perp/deposit.vue'
import Withdraw from '@/components/header/connectWallet/perp/withdraw.vue'
import CreateOrder from '~/pages/perp/components/right/createOrder.vue'
import { usePerpStore } from '~/stores/perp'
import BigNumber from 'bignumber.js'
import type { PerpOrderParams } from '~/api/perp/types'
import { Warning } from '@element-plus/icons-vue'
import { markRaw } from 'vue'


export function usePerp() {
  const dialogVisible = ref(false)
  const perpStore = usePerpStore()
  const walletStore = useWalletStore()
  const botStore = useBotStore()
  const { mode } = storeToRefs(useGlobalStore())
  const { t } = useI18n()
  const perpPositions = computed(() => {
    const positions = perpStore.position || []
    const contractList = perpStore.contractList
    return positions?.map?.(i => {
      const contract = contractList.find(item => item.contractId === i.contractId)
      const price = contract?.oraclePrice || 0
      const value = new BigNumber(price || 0).times(new BigNumber(i?.openSize || 0))
      const riskTierList = contract?.riskTierList || []
      const maintenanceMarginRequirementObj = riskTierList?.find?.(j => new BigNumber(value).lte(j?.positionValueUpperBound || 0))
      const initialMarginRequirementObj = riskTierList?.find?.(j => new BigNumber(i.openValue || 0).lte(j?.positionValueUpperBound || 0))
      return {
        ...i,
        ...contract,
        maintenanceMarginRequirementObj,
        initialMarginRequirementObj
      }
    })
  })

  const prepBalance = computed(() => {
    const amount = perpStore.collateral?.[0]?.amount || 0
    const positionsAmount = perpPositions.value.reduce((prev, cur) => {
      const price = cur?.oraclePrice || 0
      let value = new BigNumber(price || 0).times(new BigNumber(cur?.openSize || 0))
      if (new BigNumber(price).isZero()) {
        value = new BigNumber(cur?.openValue || 0)
      }
      return prev.plus(value)
    }, new BigNumber(0))
    return new BigNumber(amount).plus(positionsAmount).toFixed()
  })

  const unrealizedPnl = computed(() => {
    return perpPositions.value.reduce((prev, cur) => {
      // const contract = contractList.find(item => item.contractId === cur.contractId)
      const oraclePrice = cur?.oraclePrice || 0
      const profit = Number(cur?.openValue) >= 0
        ? new BigNumber(oraclePrice).times(new BigNumber(cur?.openSize || 0).abs()).minus(new BigNumber(cur.openValue).abs())
        : new BigNumber(cur.openValue || 0).abs().minus(new BigNumber(oraclePrice).times(new BigNumber(cur.openSize).abs()))
      // const _unrealizedPnl = profit.minus(new BigNumber(cur.openFee || 0).abs()).minus(new BigNumber(cur.fundingFee || 0).abs()).toFixed()
      return prev.plus(profit)
    }, new BigNumber(0)).toFixed()
  })

  const initMarginRequirement = computed(() => {
    return perpPositions.value.reduce((prev, cur) => {
      const price = cur?.oraclePrice || 0
      const openSize = cur?.openSize || 0
      // const maintenanceMarginRate = cur.initialMarginRequirementObj?.maintenanceMarginRate || 1
      const maxLeverage = cur.initialMarginRequirementObj?.maxLeverage || 1
      const initialMarginRate = new BigNumber(1).div(maxLeverage)
      const value = new BigNumber(price || 0).times(new BigNumber(openSize))
      const _initialMarginRequirement = initialMarginRate.times(value.abs())
      return prev.plus(_initialMarginRequirement)
    }, new BigNumber(0)).toFixed()
  })

  const maintenanceMarginRequirement = computed(() => {
    return perpPositions.value.reduce((prev, cur) => {
      const price = cur?.oraclePrice || 0
      const openSize = cur?.openSize || 0
      const maintenanceMarginRate = cur.maintenanceMarginRequirementObj?.maintenanceMarginRate || 1
      const value = new BigNumber(maintenanceMarginRate).times(openSize).times(price)
      return prev.plus(value)
    }, new BigNumber(0)).abs().toFixed()
  })


  function login() {
    const $t = getGlobalT()
    if (!walletStore.address) {
      ElMessage.error($t('connectWalletFirst'))
      return
    }
    if (!walletStore.provider && walletStore.address) {
      ElMessageBox.confirm(t('watchWalletUnSupportPerp'), t('tips'), {
        type: 'warning',
        icon: markRaw(Warning),
        confirmButtonText: t('iKnown'),
        showCancelButton: false,
        customClass: `${mode.value} delete_confirm`,
      })
      return
    }
    if (walletStore.address && !isEvmChain(walletStore.chain)) {
      ElMessage.error($t('noevmWalletNotSupportedPerp'))
      return

    }
    const { $dialog } = useNuxtApp()
    dialogVisible.value = true
    $dialog.show({
      content: {
        is: Perp,
        props: {
          'onSuccess': () => {
            $dialog.hide()
          },
          getVisible: () => dialogVisible
        }
      },
      props: {
        width: '450px',
        class: 'perp-dialog',
        title: $t('loginPerpAccount'),
        'onOpened': () => {
          console.log('open')
          dialogVisible.value = true
        },
        'onClosed': () => {
          console.log('close')
          dialogVisible.value = false
        }
      }
    })
  }

  function connectAndLogin() {
    if (walletStore.address) {
      if (!perpStore.isLogin) {
        login()
      }
      return
    }
    if (botStore.evmAddress) {
      ElMessageBox.confirm(t('botUnSupportPerp'), t('tips'), {
        type: 'warning',
        icon: markRaw(Warning),
        confirmButtonText: t('iKnown'),
        showCancelButton: false,
        customClass: `${mode.value} delete_confirm`,
      })
      return
    }
    botStore.changeConnectVisible(true, 1)
    const unwatch = watch(() => walletStore.address, (res) => {
      if (res && walletStore.walletSignature?.[walletStore?.address || '']) {
        unwatch()
        if (!perpStore.isLogin) {
          login()
        }
      }
    })

    const unwatch2 = watch(() => botStore.connectVisible, (res) => {
      if (!res) {
        unwatch()
        unwatch2()
      }
    })
  }


  function deposit() {
    const { $dialog } = useNuxtApp()
    const $t = getGlobalT()
    dialogVisible.value = true
    $dialog.show({
      content: {
        is: Deposit,
        props: {
          'onSuccess': () => {
            $dialog.hide()
          },
          getVisible: () => dialogVisible
        }
      },
      props: {
        width: '450px',
        class: 'perp-dialog',
        title: $t('deposit2'),
        'onOpened': () => {
          console.log('open')
          dialogVisible.value = true
          // $dialog.updateContentProps({
          //   visible: true
          // })
        },
        'onClosed': () => {
          console.log('close')
          dialogVisible.value = false
          // $dialog.updateContentProps({
          //   visible: false
          // })
        }
      }
    })
  }

  function withdraw() {
    const { $dialog } = useNuxtApp()
    const $t = getGlobalT()
    dialogVisible.value = true
    $dialog.show({
      content: {
        is: Withdraw,
        props: {
          'onSuccess': () => {
            $dialog.hide()
          },
          getVisible: () => dialogVisible
        }
      },
      props: {
        width: '450px',
        class: 'perp-dialog',
        title: $t('withdraw'),
        'onOpened': () => {
          console.log('open')
          dialogVisible.value = true
          // $dialog.updateContentProps({
          //   visible: true
          // })
        },
        'onClosed': () => {
          console.log('close')
          dialogVisible.value = false
          // $dialog.updateContentProps({
          //   visible: false
          // })
        }
      }
    })
  }

  // const createOrderDialogTitle = ref('')
  function createPerpOrder(orderParams: PerpOrderParams) {
    return new Promise((resolve, reject) => {
      const { $dialog } = useNuxtApp()
      // const $t = getGlobalT()
      dialogVisible.value = true
      $dialog.show({
        content: {
          is: CreateOrder,
          props: {
            'onSuccess': () => {
              $dialog.hide()
              resolve(true)
            },
            'onCancel': () => {
              $dialog.hide()
              resolve(false)
            },
            getVisible: () => dialogVisible,
            orderParams
          }
        },
        props: {
          width: '450px',
          class: 'perp-dialog',
          title: '',
          'onOpened': () => {
            console.log('open')
            dialogVisible.value = true
            // $dialog.updateContentProps({
            //   visible: true
            // })
          },
          'onClosed': () => {
            console.log('close')
            dialogVisible.value = false
            // $dialog.updateContentProps({
            //   visible: false
            // })
          }
        }
      })
    })

  }

  const isCanNormalWithdrawableAmount = computed(() => {
    return walletStore.address && walletStore.provider && perpStore.isLogin && new BigNumber(perpStore.normalWithdrawableAmount || '0').gt(0)
  })

  return {
    dialogVisible,
    prepBalance,
    unrealizedPnl,
    initMarginRequirement,
    maintenanceMarginRequirement,
    isCanNormalWithdrawableAmount,
    login,
    connectAndLogin,
    deposit,
    withdraw,
    // createOrderDialogTitle,
    createPerpOrder
  }
}

