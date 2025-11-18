import Perp from '@/components/header/connectWallet/perp/index.vue'
import Deposit from '@/components/header/connectWallet/perp/deposit.vue'
import Withdraw from '@/components/header/connectWallet/perp/withdraw.vue'

export function usePerp() {
  const dialogVisible = ref(false)
  function login() {
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
        title: '登录合约账户',
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

  return {
    dialogVisible,
    login,
    deposit,
    withdraw
  }
}

