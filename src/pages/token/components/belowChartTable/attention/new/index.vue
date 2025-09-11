<template>
  <div>
    <List
      ref="holdersRef"
      :tableList="holderList"
      :loading="loadingAttention"
      :searchOriginKeyword="searchOriginKeyword"
      :searchOriginType="searchOriginType"
      :isAttention="isAttention"
      @handleSortChange="handleSortChange"
      @filterAddress="filterAddress"
      @filterOriginAddress="filterOriginAddress"
    />
  </div>
</template>

<script setup lang="ts">
import { _getAttentionList, type HolderStat } from '@/api/follow'
import { searchAddressHolder } from '@/api/holders'
import List from '../../holders/new/list.vue'
const props = defineProps({
  currentActiveTab: {
    type: String,
    default: 'Transactions'
  }
})
const route = useRoute()
const loadingAttention = shallowRef(false)
const isAttention = shallowRef(true)
const attentionList = ref<HolderStat[]>([])
const sort = shallowRef<{ sort_by?: string; order?: string }>({ sort_by: '', order: '' })
const searchOriginKeyword = shallowRef('')
const searchOriginType = shallowRef('')
const searchKeyword = shallowRef('')
const filterList = ref<any[]>([])
const globalStore = useGlobalStore()
const id = computed(() => {
  return route.params?.id as string
})
const holderList = computed(() => {
  const base = searchKeyword.value ? (filterList.value || []) : (attentionList.value || [])
  if (searchOriginKeyword.value) {
    if (searchOriginType.value == 'sol') {
      return base?.filter(i => i.sol_first_transfer_in_from == searchOriginKeyword.value) || []
    } else {
      return base?.filter(i => i.token_first_transfer_in_from == searchOriginKeyword.value) || []
    }
  }
  return base || []
})
watch(() => globalStore.headFollowsNum.all, () => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionList()
  }
})
watch(id, () => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionList()
  }
})
watch(() => useFollowStore().currentAddress, (val) => {
  if (val) {
    if (props.currentActiveTab == 'Attention') {
      getAttentionList()
    }
  } else {
    attentionList.value = []
  }
})
onActivated(() => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionList()
  }
})

function getAttentionList(sortObj?: { sort_by: string; order: string }) {
  if (!useFollowStore().currentAddress) {
    return
  }
  const sort1 = {
    sort_by: sortObj?.sort_by,
    order: sortObj?.order,
  }
  const params = {
    token_id: id.value,
    self_address: useFollowStore().currentAddress,
    ...sort1,
  }
  sort.value = sort1
  // if (this.searchKeyword) {
  //   return
  // }
  loadingAttention.value = true
  _getAttentionList(params)
    .then((res) => {
      const list = res?.holderStats || []
      attentionList.value = list || []
      console.log('--------getAttentionList---------', list)
    })
    .catch(() => {
      attentionList.value = []
    })
    .finally(() => {
      loadingAttention.value = false
    })
}

function handleSortChange(obj: { prop: string; order: string }) {
    getAttentionList({ sort_by: obj.prop, order: obj.order?.replace('ending', '') })
}
function filterAddress(keyword: string) {
  searchKeyword.value = keyword || ''
  if (!searchKeyword.value) {
    getAttentionList(sort.value as any)
    return
  }
  const params = {
    token_id: id.value,
    self_address: useFollowStore().currentAddress,
    keyword: searchKeyword.value,
  }
  loadingAttention.value = true
  searchAddressHolder(params)
    .then((res) => {
      filterList.value = Array.isArray(res) ? res : []
    })
    .catch(() => {
      filterList.value = []
    })
    .finally(() => {
      loadingAttention.value = false
    })
}
function filterOriginAddress(row:{ address: string, type: string }) {
  if (searchOriginKeyword.value) {
    searchOriginKeyword.value = ''
    searchOriginType.value = ''
  } else {
    searchOriginKeyword.value = row.address || ''
    searchOriginType.value = row.type || ''
  }
}


</script>

<style scoped></style>
