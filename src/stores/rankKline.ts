import type { RowClassNameGetter } from 'element-plus'
import { getFavoriteCheck, getUserFavoriteGroups, type GetUserFavoriteGroupsResponse } from '~/api/fav'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import type { TokenInfo, TokenInfoExtra } from '~/api/types/token'
import { getXType } from '~/api/x'

export const useRankKlineStore = defineStore('rankKline',()=>{
    // ref
    const klineRow = ref({})
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
    // computed
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

    function toggleKline(row,rowIndex,columns,listData) {
        const klineIndex = listData.findIndex(el => el.isKline)
        if(klineRow.value.id === row.id){
            klineRow.value = {}
            columns[0].fixed='left'
            columns[columns.length-1].fixed='right'
        } else {
            listData.splice(rowIndex,1,{
              isKline:true
            })
            klineRow.value = row
            columns[0].fixed = ''
            columns[columns.length-1].fixed=''
            getData(row)
        }
    }

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
    }

    function _getXType(tokenId:string) {
      getXType(tokenId).then(res => {
        twitterType.value = res.type || 0
        console.log('twitterType', twitterType.value)
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

    function getRowClass({rowData}:Parameters<RowClassNameGetter<any>>[0]) {
        const commonClass = 'color-[--d-CCC-l-333] cursor-pointer [&&]:[--el-table-border:1px_solid_var(--d-1A1A1A-l-F2F2F2)]'
        if(klineRow.value.id && rowData.id !== klineRow.value.id){
            return 'row-disabled '+commonClass
        } else {
            return commonClass
        }
        
    }

    return {
        klineRow,
        toggleKline,
        getRowClass,
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
        editableRemark
    }
})