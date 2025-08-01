import { defineStore, storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import {
  sendEmailCode,
  registerEmail,
  loginEmail,
  emailCodeLogin,
  verifyRecoverCode,
  updateEmailPassword,
  googleLogin,
  resetPasswordGoogle,
  // setGoogleAuth,
  // confirmAuthSetting,
  // getUserInfoByGuid,
  bindEmailAccount,
  // getBotWallets,
} from '@/api/bot'
export const useUserStore = defineStore('user', () => {
  const walletStore = useWalletStore()
  const botStore = useBotStore()
  const {
    accessToken,
    // walletList,
    refreshToken,
    // botReqCount,
    // refreshing,
    evmAddress,
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
  } = storeToRefs(botStore)
  const { getUserInfo } = botStore
  const email = useLocalStorage('email', '')
  const authInfo = shallowRef({} as {
    guid: string
    emailAddress: string // 已绑定的email address
    authSetting: boolean //  已绑定google验证器, false -> 未绑定google验证器
    ref1Guid: string // 上游分佣绑定信息
    name: string // 钱包名
    transferStatus: boolean // 转账状态(是否在12小时冻结期)
  })
  const updateHolderNum=ref(0)
  return {
    email,
    authInfo,
    updateHolderNum,
    async sendEmailCode(data: Parameters<typeof sendEmailCode>[0]) {
      return await sendEmailCode(data)
    },
    async registerEmail(data: Parameters<typeof registerEmail>[0]) {
      const res = await registerEmail(data)
      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      evmAddress.value = res.evmAddress
      getUserInfo()
      
    },
    async loginEmail(data: Parameters<typeof loginEmail>[0]) {
      walletStore.disconnect()
      const res = await loginEmail(data)
      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      evmAddress.value = res.evmAddress
      getUserInfo()
    },
    async emailCodeLogin(data: Parameters<typeof emailCodeLogin>[0]) {
      walletStore.disconnect()
      const res = await emailCodeLogin(data)
      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      evmAddress.value = res.evmAddress
      getUserInfo()
    },
    verifyRecoverCode(data: Parameters<typeof verifyRecoverCode>[0]) {
      return verifyRecoverCode(data)
    },
    async updateEmailPassword(data: Parameters<typeof updateEmailPassword>[0]) {
      await updateEmailPassword(data)
    },
    async loginGoogle(data: Parameters<typeof googleLogin>[0]) {
      walletStore.disconnect()
      const res = await googleLogin(data)
      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      evmAddress.value = res.evmAddress
      getUserInfo()
    },
    async bindEmailAccount(data: Parameters<typeof bindEmailAccount>[0]) {
      return await bindEmailAccount(data)
    },
    async resetPasswordGoogle(data: Parameters<typeof resetPasswordGoogle>[0]) {
      await resetPasswordGoogle(data)
    },
  }
})
