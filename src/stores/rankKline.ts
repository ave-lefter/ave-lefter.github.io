import { getFavoriteCheck, getUserFavoriteGroups, type GetUserFavoriteGroupsResponse } from '~/api/fav'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import type { TokenInfo, TokenInfoExtra } from '~/api/types/token'
import { getXType } from '~/api/x'
import BigNumber from 'bignumber.js'

export const useRankKlineStore = defineStore('rankKline',()=>{
    // ref
    const klineRow = ref<Record<string,any>>({})
    const tokenInfo = ref<null | TokenInfo>(null)
    const tokenInfoExtra = ref<null | TokenInfoExtra>(null)
    const userFavoriteGroups = shallowRef<GetUserFavoriteGroupsResponse[]>([])
    const collected = ref(false)
    const remark = ref('')
    const remark2 = ref('')
    const groupId = ref(0)
    const twitterType = ref<0 | 1 | 2 | 3>(0)
    const selectedGroup = ref(0)
    const editableGroup = ref(false)
    const editableRemark = ref(false)
    const walletStore = useWalletStore()
    const botStore = useBotStore()
    const {t} = useI18n()
    const tokenPrice = shallowRef(0)
    // computed
    const price = computed(() => tokenPrice.value || token.value?.current_price_usd)
    const walletAddress = computed(() => {
      return botStore.evmAddress || walletStore.address
    })
    const token = computed(()=>tokenInfo.value?.token)
    const pair = computed(()=>tokenInfo.value?.pairs?.[0])
    const currentGroup = computed(() => {
      return groupId.value == 0
        ? t('defaultGroup')
        : userFavoriteGroups.value?.find((i) => i.group_id == groupId.value)?.name
    })
    const pairAddress = computed(()=>pair.value?.pair)
    const circulation = computed(() => {
      const circulation = new BigNumber(token.value?.total || 0)
        .minus(token.value?.lock_amount_dec || 0)
        .minus(token.value?.other_amount_dec || 0)
        .minus(token.value?.burn_amount_dec || 0)
      return circulation.lt(0) ? new BigNumber(0) : circulation
    })
  
    const marketCap = computed(() => {
      return new BigNumber(price.value || 0).times(circulation.value || 0).toFixed() || '0'
    })

    function getData(row) {
        const tokenId = row.id
        // 先调用 tokenInfo 接口
        getTokenInfo(tokenId).then(res=>{
            tokenInfo.value = res
        })
        getTokenInfoExtra(tokenId).then(res=>{
            tokenInfoExtra.value = res
        })
        _getXType(tokenId)
        // 备注、自选、自选分组
        if(walletAddress.value){
            getTokenFavoriteCheck(tokenId)
            getTokenUserFavoriteGroups()
        }

        useCheckStore().getContractCheckResult(tokenId, walletAddress.value)
    }

    function _getXType(tokenId:string) {
      getXType(tokenId).then(res => {
        twitterType.value = res.type || 0
      }).catch(() => {
        twitterType.value = 0
      })
    }

    async function getTokenUserFavoriteGroups() {
        try {
          const res = await getUserFavoriteGroups(walletAddress.value)
          userFavoriteGroups.value = (res || []).filter(
            (el) => !!el.name && el.type === 'token'
          )
        } catch (e) {
          console.log('=>(favoriteTable.vue:19) e', e)
        }
      }

    function getTokenFavoriteCheck(tokenId:string) {
        getFavoriteCheck(tokenId,walletAddress.value)
          .then((res) => {
            collected.value = res?.address ? true : false
            remark.value = res?.remark || ''
            remark2.value = res?.remark || ''
            groupId.value = res?.group_id || 0
            selectedGroup.value = res?.group_id || 0
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {})
      }

    return {
        klineRow,
        tokenInfo,
        tokenInfoExtra,
        userFavoriteGroups,
        collected,
        remark,
        remark2,
        groupId,
        selectedGroup,
        token,
        pair,
        twitterType,
        currentGroup,
        editableGroup,
        editableRemark,
        pairAddress,
        tokenPrice,
        price,
        circulation,
        marketCap,
        getData
    }
})