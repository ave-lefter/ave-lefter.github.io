import { defineStore, storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { getFavoriteList2 ,getAttentionPageList,getUserFavoriteGroups2} from '~/api/attention'
// import {
//   sendEmailCode,
//   registerEmail,
//   loginEmail,
//   emailCodeLogin,
//   verifyRecoverCode,
//   updateEmailPassword,
//   googleLogin,
//   resetPasswordGoogle,
//   // setGoogleAuth,
//   // confirmAuthSetting,
//   // getUserInfoByGuid,
//   bindEmailAccount,
//   // getBotWallets,
// } from '@/api/bot'
export const useFollowStore = defineStore('follow', () => {
  // const {
    // accessToken,
    // walletList,
    // refreshToken,
    // botReqCount,
    // refreshing,
    // evmAddress,
    // connectVisible,
    // userInfo,
    // refreshAccessToken,
    // logout,
    // login,
    // tgLogin,
    // getWebConfig,
    // updateWebConfig,
    // isSupportChains,
    // getWalletAddress,
    // changeConnectVisible,
    // connectWalletTab,
  // } = storeToRefs(botStore)
  // const { getUserInfo } = botStore
  // const email = useLocalStorage('email', '')
  const monitorVisible = ref(false)
  const showBatchAddressDetails = ref(false)
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const addressGroups = useLocalStorage<{ group_id: number; name: string; show_index: number; }[]>('addressGroups', [])
  const currentAddress = computed(() =>  botStore?.evmAddress || walletStore?.address ||'')
  watch(currentAddress, (val) => {
    if(!val)addressGroups.value = []
  })
  return {
    addressGroups,
    monitorVisible,
    async getUserFavoriteGroups2(data: Parameters<typeof getUserFavoriteGroups2>[0] = currentAddress.value): Promise<Awaited<ReturnType<typeof getUserFavoriteGroups2>> | undefined> {
      let res: Awaited<ReturnType<typeof getUserFavoriteGroups2>> =[]
      try {
        res = await getUserFavoriteGroups2(data)
        addressGroups.value = res
      } catch (e) {
        console.log('=>(favoriteTable.vue:19) e', e)
      }
      return res
    },
    initAddressGroups() {
      this.getUserFavoriteGroups2(currentAddress.value)
    },
    currentAddress,
    showBatchAddressDetails
  }
})
