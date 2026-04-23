import { defineStore } from 'pinia'
import { useLocalStorage ,useStorage} from '@vueuse/core'
import { getUserFavoriteGroups2} from '~/api/attention'
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
  const favAddressChain=ref('')
  const attentionDetails=shallowRef({
    group_id:0,
    is_monitored: 0
  })
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const addressGroups = useLocalStorage<{ group_id: number; name: string; show_index: number; }[]>('addressGroups', [])
  const currentAddress = computed(() =>  botStore?.evmAddress || walletStore?.address ||'')
  const favAddressPopRef=ref()
  // 自选大页面
  const updateNum11=ref(0)
  // 关注大页面
  const updateNum12=ref(0)
  // 监控大页面
  const updateNum13=ref(0)
  // 备注大页面
  const updateNum14=ref(0)
  // 关注地址悬浮框
  const updateNum2=ref(0)
  // 关注地址弹框
  const updateNum3=ref(0)
  // 自选地址弹框列表
  const updateNum4=ref(0)
  // 自选地址弹框分组
  const delTokenGroup=ref(0)

   // 关注地址弹窗表单数据持久化
  const favAddressPopFormData = useStorage('favAddressPop-formData', {
    group: 0,
    is_monitored: 1
  })
  const {t} = useI18n()
  watch(currentAddress, (val) => {
    if(!val){
      addressGroups.value = []
      favAddressPopFormData.value = {
        group: 0,
        is_monitored: 1
      }
    }
  })
  const loading = ref(false)
  const handleAddAttention = ref()
  // const handleAddAttention = ref((form: any,resetFields: () => void) => {})
  const confirmAttention = (trigger: any,chain: string, callback: (form: any)=>Promise<any>)=>{
    attentionTrigger.value = trigger
    favAddressChain.value = chain
    handleAddAttention.value = (form: any,resetFields?: () => void,stopLoading?:()=>void)=>{
      console.log('confirmAttention', form)
      callback(form).then((res) => {
          console.log('confirmAttention', res)
          if(typeof res === 'string'){
            ElMessage.warning(String(res))
          }else{
            ElMessage.success(t('attention1Success'))
          }
          stopLoading?.()
          favAddressPopVisible.value = false
          updateNum3.value++
          resetFields?.()
      }).catch((err) => {
        ElMessage.error(String(err))
      }).finally(() => {
        stopLoading?.()
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
  } as {
    group: number
    time_interval: string
    user_chain: string
    sort: string|null
    sort_dir: string|null
    keyword: string
    last_tx_time_max: string|number
    last_tx_time_min: string|number
    last_trade_time: string|number
  })
  const addressConditions2 = useStorage('addressConditions2',{
    group: 0,
    time_interval: '7d',
    user_chain: 'AllChains',
    sort: '',
    sort_dir: '',
    keyword: '',
    last_tx_time_max: '',
    last_tx_time_min: '',
    last_trade_time: ''
  } as {
    group: number
    time_interval: string
    user_chain: string
    sort: string|null
    sort_dir: string|null
    keyword: string
    last_tx_time_max: string|number
    last_tx_time_min: string|number
    last_trade_time: string|number
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
    updateNum11,
    updateNum12,
    updateNum13,
    updateNum14,
    updateNum2,
    updateNum3,
    updateNum4,
    delTokenGroup,
    loading,
    addressConditions,
    addressConditions2,
    favAddressChain,
    favAddressPopFormData
  }
})
