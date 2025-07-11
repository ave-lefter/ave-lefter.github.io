import {addFavoriteGroup} from '~/api/fav'

function confirmChangeName(type = 'add') {
  const {$i18n} = useNuxtApp()
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt('', $i18n.t('enterGroupName'), {
      confirmButtonText: $i18n.t('confirm1'),
      cancelButtonText: $i18n.t('cancel'),
      inputValidator: (value) => {
        if (!value) {
          reject()
          return $i18n.t('enterGroupName')
        }
        if (value?.length > 20) {
          reject()
          return $i18n.t('maximum10characters')
        }
        return true
      },
    }).then(({value}) => {
      if (type === 'add') {
        addTokenFavoriteGroup(value, resolve, reject)
      } else {
        resolve(value)
      }
    })
  })

}

function addTokenFavoriteGroup(value: string, resolve: (value: unknown) => void, reject: () => void) {
  const {evmAddress} = useBotStore()
  const {address} = useWalletStore()
  const {$i18n} = useNuxtApp()
  const loading = ElLoading.service()
  addFavoriteGroup(value, evmAddress || address).then(() => {
    ElMessage.success($i18n.t('success'))
    resolve(true)
  }).catch(err => {
    console.log(err)
    ElMessage.error($i18n.t('fail'))
    reject()
  }).finally(() => {
    loading.close()
  })
}

export {
  confirmChangeName
}
