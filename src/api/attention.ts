import { ElMessage as Message } from 'element-plus'
import { getGlobalT } from '@/utils/i18nBridge'
const t = getGlobalT()
// 用户取消关注
export async function deleteAttention(body: {
  user_address: string, user_chain: string, address: string
}) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/deleteUser', {
    method: 'post',
    body,
  }).catch((err) => console.log(err))
}

// 用户添加关注
export async function addAttention(body: {
  user_address: string, user_chain: string, remark?: string, address: string
}) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/addUser', {
    method: 'post',
    body
  })
}
// req=[
//   {
//     "group_id": 3763,
//     "name": "base",
//     "show_index": -1
//   }
// ]
export function getFavoriteList2(group: number = 0, address: string = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/allAddress', {
    method: 'get',
    params: {
      address: address,
      group: group
    }
  })
}

// 组
// // get user favorite group
export function getUserFavoriteGroups2(address: string = localStorage.bot_evmAddress || localStorage.walletAddress): Promise<Array<{
  group_id: number
  name: string
  show_index: number
}>> {
  if (!address || address === 'undefined') {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api(`/v2api/fav_users/v1/user/${address}/groups`, {
    method: 'get',
  })
}
export function removeFavorite2({ user_chain, user_address, address = localStorage.bot_evmAddress || localStorage.walletAddress }: any) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/delete', {
    method: 'post',
    body: {
      address,
      user_chain,
      user_address
    }
  })
}

// update user favorite tokens group
export function moveFavoriteGroup2({ user_chain, user_address, group, address = localStorage.bot_evmAddress || localStorage.walletAddress }: any) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/move', {
    method: 'post',
    body: {
      address,
      user_chain,
      user_address,
      group
    }
  })
}

// change user favorite tokens
export function changeFavoritesIndex2({ user1_chain, user1_address, user2_chain, user2_address, group, address = localStorage.bot_evmAddress || localStorage.walletAddress }: any) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/changeIndex', {
    method: 'post',
    body: {
      address,
      group,
      user1_address,
      user2_address,
      user1_chain,
      user2_chain,
    }
  })
}

// set top favorite token
export function changeFavoritesTop2({
  user_chain, user_address, group = 0, address = localStorage.bot_evmAddress || localStorage.walletAddress
}: any) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/setTop', {
    method: 'post',
    body: {
      address: address,
      user_address,
      user_chain,
      group
    }
  })
}

// add user favorite group
export function addFavoriteGroup2(name: string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/add', {
    method: 'post',
    body: {
      address,
      name
    }
  })
}

// change group name
export function changeFavoriteGroupName2(name: string, group: number | string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/update', {
    method: 'post',
    body: {
      address,
      name,
      group
    }
  })
}

// delete group
export function removeFavoriteGroup2(group: number | string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/delete', {
    method: 'post',
    body: {
      address,
      group
    }
  })
}

export function setTopFavoriteGroup2(group: number | string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/setTop', {
    method: 'post',
    body: {
      address,
      group,
      // name
    }
  })
}

// // edit remark
// export function editTokenFavRemark(tokenId, remark, address = localStorage.bot_evmAddress||localStorage.walletAddress) {
//   return $api({
//     method: 'post',
//     url: `/v1api/v3/tokens/favorite/editRemark`,
//     body: {
//       token: tokenId,
//       remark,
//       address
//     }
//   })
// }



// update remark
export function updateWhaleRemark(body: any) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v1/remark', {
    method: 'post',
    body,
  })
}

// delete group
export function changeIndexFavoriteGroup2(group1: number | string, group2: number | string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  if (!address || address === 'undefined') {
    Message.error(t('connectWalletFirst'))
    return Promise.reject(false)
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/group/changeIndex', {
    method: 'post',
    body: {
      address,
      group1,
      group2
    }
  })
}

export function getFavUserRemarks({ address, pageNO, pageSize }: any) {
  if (!address) {
    address = (localStorage.bot_evmAddress || localStorage.walletAddress)
  }
  if (!address || address === 'undefined') {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_remarks/v1/remarks', {
    method: 'get',
    params: {
      address: address,
      pageNO: pageNO,
      pageSize: pageSize
    }
  })
}

export function getFavUserRemarks2({ address, pageNO, pageSize, user_chain, time_interval, sort_dir }: any) {
  if (!address) {
    address = (localStorage.bot_evmAddress || localStorage.walletAddress)
  }
  if (!address || address === 'undefined') {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_remarks/v1/remarks_detail', {
    method: 'get',
    params: {
      address: address,
      pageNO: pageNO,
      pageSize: pageSize,
      user_chain,
      time_interval: time_interval || '30d',
      sort_dir
    }
  })
}

// Get user monitorAddress
export function getHistoryMonitor({pageNo=1,pageSize=50}) {
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/historyMonitor',{
    method: 'get',
    params: {
      pageNo,
      pageSize
    }
  })
}






export async function getAttentionPageList({ group = 0, user_chain, sort = '', sort_dir = '', keyword = '', last_tx_time_max = '', last_tx_time_min = '', time_interval = '', pageSize = 100, pageNO = 1, address = localStorage.bot_evmAddress || localStorage.walletAddress }: any) {
  if (!address || address === 'undefined') {
    return Promise.resolve(null)
  }
  const { $api } = useNuxtApp()
  // if(store.state.bot?.cancelTokenSource){
  //   store.state.bot.cancelTokenSource.cancel('Operation canceled by the user.')
  // }
  // const CancelToken = axios.CancelToken
  // const source = CancelToken.source()
  // store.commit("setCancelTokenSource", source)
  return $api(`/v2api/fav_users/v1/allusers?address=${address}&user_chain=${user_chain}&keyword=${keyword}&sort=${sort}&sort_dir=${sort_dir}&pageSize=${pageSize}&last_tx_time_max=${last_tx_time_max}&pageNO=${pageNO}&last_tx_time_min=${last_tx_time_min}&time_interval=${time_interval}&group=${group}`, {
    method: 'get',
    // cancelToken: source.token,
  })
}

export function favUsersAddMonitor(data: any) {
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/addMonitor', {
    method: 'post',
    body: data,
  })
}


// 用户批量导入
interface BulkImportAttentionItem {
  remark?: string
  user_address: string
  user_chain: string
}

export async function bulkImportAttention(
  addressArr: BulkImportAttentionItem[],
  address: string = localStorage.bot_evmAddress || localStorage.walletAddress
): Promise<any> {
  const arr: Array<{
    address: string
    remark?: string
    user_address: string
    user_chain: string
  }> = addressArr.map((i) => {
    return {
      address: address,
      remark: i.remark,
      user_address: i.user_address,
      user_chain: i.user_chain
    }
  })
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/batch_import', {
    method: 'post',
    body: arr
  }).catch((err: any) => console.log(err))
}
// 用户批量导出
export async function bulkExportAttention(chain: string, address = localStorage.bot_evmAddress || localStorage.walletAddress) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v3/users/fav/batch_export?address=${address}&user_chain=${chain}`,{
    method: 'get',
  }).catch((err) => console.log(err))
}

/**
 * 获取零余额地址列表
 * @param {Object} params
 * @param {string} params.user_chain - 链名称 (例如: 'solana')
 * @param {string} params.address - 用户钱包地址
 * @returns {Promise}
 */
export function getZeroBalanceAddresses({user_chain, address}: { user_chain: string; address: string }): Promise<any> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/zero_bal_users',{
    method: 'get',
    params:{
      user_chain,
      address
    }
  })
}

/**
 * 批量删除零余额地址
 * @param {Object} data
 * @param {Array<string>} data.addresses - 要删除的地址数组
 * @param {string} data.user_chain - 地址所在的链
 * @returns {Promise}
 */
export function batchDeleteAddresses(body: Array<{ address: string; user_chain: string }>): Promise<any> {
   const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/batch_delete', {
    method: 'post',
    body
  })
}


export function favUsersPauseMonitor(data: any) {
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_users/v1/user/pauseMonitor', {
    method: 'post',
    body: data,
  })
}

