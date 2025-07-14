import { defineStore } from 'pinia'
import { useLocalStorage ,useStorage} from '@vueuse/core'
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
  const attentionTrigger=ref()
  const favAddressPopVisible=ref(false)
  const attentionDetails=shallowRef({
    group_id:0,
    is_monitored: 0
  })
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const addressGroups = useLocalStorage<{ group_id: number; name: string; show_index: number; }[]>('addressGroups', [])
  const currentAddress = computed(() =>  botStore?.evmAddress || walletStore?.address ||'')
  const favAddressPopRef=ref()

  const updateNum1=ref(0)
  const updateNum2=ref(0)
  const updateNum3=ref(0)
  
  watch(currentAddress, (val) => {
    if(!val)addressGroups.value = []
  })
  const loading = ref(false)
  const handleAddAttention = ref()
  // const handleAddAttention = ref((form: any,resetFields: () => void) => {})
  const confirmAttention = (trigger: any,callback: (form: any)=>Promise<void>)=>{
    attentionTrigger.value = trigger
    handleAddAttention.value = (form: any,resetFields?: () => void,stopLoading?:()=>void)=>{
      console.log('confirmAttention', form)
      callback(form).then(() => {
          stopLoading?.()
          favAddressPopVisible.value = false
          resetFields?.()
      })
    }
    favAddressPopVisible.value = true
  }
  const addressConditions = useStorage('addressConditions',{
    group: 0,
    time_interval: '7d',
    user_chain: 'AllChains',
    sort: '',
    sort_dir: '',
    keyword: '',
    last_tx_time_max: '',
    last_tx_time_min: '',
    last_trade_time: ''
  })
  return {
    addressGroups,
    monitorVisible,
    async getUserFavoriteGroups2(data: Parameters<typeof getUserFavoriteGroups2>[0] = currentAddress.value): Promise<Awaited<ReturnType<typeof getUserFavoriteGroups2>> | undefined> {
      let res: Awaited<ReturnType<typeof getUserFavoriteGroups2>> =[]
      try {
        res = await getUserFavoriteGroups2(data)
        console.log('getUserFavoriteGroups2 res', res)
        addressGroups.value = Array.isArray(res) ? res : []
      } catch (e) {
        console.log('=>(favoriteTable.vue:19) e', e)
      } 
      return res
    },
    initAddressGroups() {
      this.getUserFavoriteGroups2(currentAddress.value)
    },
    attentionTrigger,
    attentionDetails,
    currentAddress,
    showBatchAddressDetails,
    handleAddAttention,
    confirmAttention,
    favAddressPopVisible,
    favAddressPopRef,
    updateNum1,
    updateNum2,
    updateNum3,
    loading,
    addressConditions,
  }
})
