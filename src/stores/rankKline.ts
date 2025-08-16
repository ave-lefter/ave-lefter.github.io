import type { RowClassNameGetter } from 'element-plus'
import { getFavoriteCheck, getUserFavoriteGroups, type GetUserFavoriteGroupsResponse } from '~/api/fav'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import type { TokenInfo, TokenInfoExtra } from '~/api/types/token'

export const useRankKlineStore = defineStore('rankKline',()=>{
    // ref
    const klineRow = ref({})
    const tokenInfo = ref<null | TokenInfo>(null)
    const tokenInfoExtra = ref<null | TokenInfoExtra>(null)
    const userFavoriteGroups = shallowRef<GetUserFavoriteGroupsResponse[]>([])
    const collected = shallowRef(false)
    const remark = shallowRef('')
    const remark2 = shallowRef('')
    const groupId = shallowRef(0)
    const selectedGroup = shallowRef(0)
    const walletStore = useWalletStore()
    const botStore = useBotStore()
    // computed
    const walletAddress = computed(() => {
      return botStore.evmAddress || walletStore.address
    })

    function toggleKline(row,columns) {
        if(klineRow.value.id === row.id){
            klineRow.value = {}
            columns[0].fixed='left'
            columns[columns.length-1].fixed='right'
        } else {
            klineRow.value = row
            columns[0].fixed = ''
            columns[columns.length-1].fixed=''
            getData(row)
        }
    }

    function getData(row) {
        const tokenId = row.token + '-' + row.chain
        // 先调用 tokenInfo 接口
        getTokenInfo(tokenId).then(res=>{
            tokenInfo.value = res
        })
        getTokenInfoExtra(tokenId).then(res=>{
            tokenInfoExtra.value = res
        })
        // 备注、自选、自选分组
        if(walletAddress.value){
            getTokenFavoriteCheck(tokenId)
            getTokenUserFavoriteGroups()
        }
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
        selectedGroup
    }
})