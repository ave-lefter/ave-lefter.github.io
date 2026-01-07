import { useRemarksStore } from '~/stores/remarks'

export function getFavUserRemarks(params: {
  address: string
  pageNO?: number
  pageSize?: number
}) {
  if (!params?.address) {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/fav_remarks/v1/remarks', {
    method: 'get',
    query: params
  })
}

// 修改钱包备注
export function updateWhaleRemark(data: {
  user_address: string
  remark: string
  user_chain: string
  self_address: string
}) {
  const { $api } = useNuxtApp()
  const { updateRemark } = useRemarksStore()
  return $api('/v2api/walletinfo/v1/remark', {
    method: 'post',
    body: data
  }).then(async res => {
    updateRemark(data)
    return res
  })
}