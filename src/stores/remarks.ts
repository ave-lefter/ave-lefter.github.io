import { defineStore } from 'pinia'
import { useLocalforage } from '@/composables/localforage'
import { getFavUserRemarks } from '~/api/remark'
import { useBotStore } from './bot'

export const useRemarksStore = defineStore('remarks', () => {
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const self_address = computed(() =>  botStore.userInfo?.evmAddress || walletStore.address || '')
  let remarks: Ref<Array<{remark: string, user_address: string, user_chain: string, self_address: string}>> = useLocalforage(`ave_remark_${self_address.value}`, [])


  function refreshRemarkObj() {
    const obj: Record<string, string> = {}
    remarks.value.forEach((i) => {
      obj[`${i.user_address}-${i.user_chain}`] = i.remark
    })
    remarkObj.value = { ...obj }
  }

  const remarkObj: Ref<Record<string, string>> = shallowRef({})

  function updateRemark({
    user_address,
    remark,
    user_chain,
    self_address
  }: {
    user_address: string
    remark: string
    user_chain: string
    self_address: string
  }) {
    if (!user_address) return
    const arr = remarks.value.filter((i) => !(i.user_address === user_address && i.user_chain === user_chain))
    if (remark) {
      arr.unshift({
        user_address,
        remark,
        user_chain,
        self_address
      })
    }
    remarks.value = arr.map(i => ({ ...i }))
    refreshRemarkObj()
  }

  async function getRemarks() {
    if (self_address.value) {
      remarks = useLocalforage(`ave_remark_${self_address.value}`, [])
    }
    const res = await getFavUserRemarks({ address: self_address.value })
    remarks.value = res || []
    refreshRemarkObj()
  }

  watch(self_address, (val) => {
    if (!val) return
    remarks = useLocalforage(`ave_remark_${self_address.value}`, [])
    getRemarks()
  })

  // function watchSelfAddress() {
  //   watch(self_address, () => {
  //     remarks = useLocalforage(`ave_remark_${self_address.value}`, [])
  //     getRemarks()
  //   })
  // }

  function initRemarks() {
    getRemarks()
    // watchSelfAddress()
  }

  function getRemarkByAddress({
    address,
    chain
  }: {
    address: string
    chain: string
  }) {
    if (!address || !chain) return ''
    return remarkObj.value?.[`${address}-${chain}`] || ''
  }

  return {
    remarks,
    updateRemark,
    getRemarks,
    // watchSelfAddress,
    initRemarks,
    getRemarkByAddress
  }
})
