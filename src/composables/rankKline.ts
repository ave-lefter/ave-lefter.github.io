import type { RowClassNameGetter } from 'element-plus'
import { getFavoriteCheck } from '~/api/fav'
import { getTokenInfo } from '~/api/token'
import type { TokenInfo } from '~/api/types/token'

export function useRankKline(walletAddress:ComputedRef<string>) {
    const klineRow = ref({})
    const tokenInfo = ref<null | TokenInfo>(null)
    const collected = shallowRef(false)
    const remark = shallowRef('')
    const remark2 = shallowRef('')
    const groupId = shallowRef(0)
    const selectedGroup = shallowRef(0)

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
        const token = row.token
        const tokenId = token.token + '-' + token.chain
        // 先调用 tokenInfo 接口
        getTokenInfo(tokenId).then(res=>{
            tokenInfo.value = res
        })
        // 备注、自选、自选分组
        if(walletAddress.value){
            getTokenFavoriteCheck(tokenId,walletAddress.value)
        }
    }

    function getTokenFavoriteCheck(tokenId:string,walletAddress:string) {
        getFavoriteCheck(tokenId,walletAddress)
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
        getRowClass
    }
}