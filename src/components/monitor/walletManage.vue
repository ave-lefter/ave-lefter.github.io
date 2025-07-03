<template>
  <div>
    <div class="flex justify-between items-center gap-8px h-54px">
      <el-select v-model="selectGroupId"  :mode="mode" @click.stop @change="(val) => filterGroup(val, row)">
        <el-option :key="0" :value="0" :label="$t('defaultGroup')"/>
        <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
      </el-select>
      <el-button :ref="(ref)=>addButtonRef=ref"  style="height: 32px;color: var(--d-999-l-222) !important; padding: 8px 10px !important;" :color="isDark?'#333':'#F2F2F2'" :dark="isDark" @click="()=>addFavAddressVisible=true" >
        <Icon name="ic:baseline-person-add-alt-1" class="text-12px  mr-5px"/>
        {{ $t('addWallet') }}
      </el-button>
      <el-button  :color="isDark?'#333':'#F2F2F2'" style="height: 32px;color: var(--d-999-l-222) !important;padding: 8px 10px !important; margin-left: 0px;" @click.stop.prevent="showBatchAddressDetails=true" :dark="isDark" >
        <Icon name="mingcute:new-folder-fill" class="text-12px"/>
        {{ $t('bulkImport') }}
      </el-button> 
    </div>
    <div v-loading="loading" class="text-12px m-table" element-loading-background="transparent">
      <AveTable
        ref="aveTableRef"
        rowKey="id"
        fixed
        :data="dataSource"
        :showFooter="!!footText"
        :footText="footText"
        :columns="columns"
        :headerHeight="36"
        :rowHeight="40"
       
        headerClass="bg-transparent"
        :style="{
          height:props.scrollHeight-50+'px',
          // height:'500px',
          '--el-table-border':'1px solid #333'
        }"
        row-class='cursor-pointer group'
        :rowEventHandlers="{
        onClick: tableRowClick
        }"
        @endReached="loadMore"
        >
          <template #header-wallet>
            <span>{{ $t('wallet') }}</span>
          </template>
          <template #cell-wallet="{ row }">
            <UserAvatar :key="row.user_address+row.user_chain" class="mr-10px" :wallet_logo="row.wallet_logo" :address="row.user_address" :chain="row.user_chain" iconSize="24px" />
            <div>
              <!-- :formatAddress="(address) =>address?.slice(0, 4) + '...' + address?.slice(-4)" -->
            <UserRemark :key="row.user_address+row.user_chain"  :remark="row.remark" :address="row.user_address" :chain="row.user_chain" addressClass="token-symbol ellipsis" addressStyle="max-width: 60px;font-size: 14px;color:var(--d-EAECEF-l-333)" iconEditColor="#999" iconEditSize="10px" showAddressTitle  @updateRemark="({remark}) => row.remark = remark"/>
            </div>
         </template>
         <template #header-group>
            <span>{{ $t('addrGroup') }}</span>
          </template>
          <template #cell-group="{ row }">
             <el-select v-model="row.group_id" size="small" @click.stop @change="(val) => getRowGroupChange(val, row)">
              <el-option :key="0" :value="0" :label="$t('defaultGroup')"/>
              <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
            </el-select>
          </template>
          <template #header-chain>
            <span>{{ $t('chain') }}</span>
            <el-popover v-model:visible="visible" popper-style="width: 120px;min-width: 120px;" trigger="click">
              <template #reference>
                  <Icon
                    id="custom-filter"
                    name="custom:filter"
                    :style="{
                      color: conditions.user_chain!=='AllChains' ? 'var(--d-F5F5F5-l-333)' : 'var(--custom-font-8-color)'
                    }"
                    class="text-10px cursor-pointer ml-2px"
                  />
              </template>
              <ul>
                <li v-for="item in chainOptions" :key="item.value" class="hover:bg-[--d-333-l-F2F2F2] h-26px! flex! items-center! font-500! text-14px! lh-20px! clickable" @click.stop="conditions.user_chain=item.value;visible=false">
                  <img :src="`${token_logo_url}chain/${item?.id}.png`" class="rd-50% mr-4px" width="16" lazy alt="">
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </el-popover>
          </template>
          <template #cell-chain="{ row }">
            <span class="text-12px">{{ row.user_chain }}</span>
          </template>
          <template #header-operate>
            <span>{{ $t('operate') }}</span>
          </template>
          <template #cell-operate="{ row }">
            <div class="flex justify-end items-center" @click.stop>
              <!-- <div class=" color-#666 flex-end mr-2px">
                <Icon name="material-symbols-light:notifications-rounded" class="text-15px"/> 
                <span>{{ $t('enableMonitor') }}</span>
              </div> -->
              <div class="flex items-center mr-12px cursor-pointer color-[#666] group-hover:color-[var(--d-F2F2F2-l-333)]"
                @click="">
                <Icon name="custom:monitor-icon" class="text-16px mr-2px" />
                <span
                  class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out">
                  {{ row?.is_monitored === 1 ? t('pause') : t('openMonitor') }}
                </span>
              </div>
              <Icon name="bx:bxs-trash-alt" class="text-13px color-#666" />
            </div>
         </template>
          <!-- <template #footer>
            <div
              class="flex items-center"
              style="
                justify-content: center;
                height: 100%;
                background-color: var(--el-color-primary-light-7);
              "
            >
              Display a message in the footer
            </div>
          </template> -->
      </AveTable>
    </div>
     <addFavAddressPop :visible="addFavAddressVisible" :buttonRef="addButtonRef" @onConfirm="()=>addFavAddressVisible=false"/>
  </div>
</template>

<script setup lang="ts">
import { getAttentionPageList, changeFavoriteGroupName2, addFavoriteGroup2, removeFavoriteGroup2, moveFavoriteGroup2, deleteAttention ,getHistoryMonitor} from '~/api/attention'
import { defaultPaginationParams, downColor, upColor } from '@/utils/constants'
import { throttle } from 'lodash-es'
const { t } = useI18n()
const $router = useRouter()
const { addressGroups } = storeToRefs(useFollowStore())
const props=defineProps({
  scrollHeight:{
    type:Number,
    default:500
  },
})
const { mode, isDark,token_logo_url } = storeToRefs(useGlobalStore())
const chainOptions=ref([
  {label: t('allChain'),value:'AllChains',id:'allChains'},
  {label:'Solana',value:'solana',id:'solana'},
  {label:'Bsc',value:'bsc',id:'bsc'},
])
const addFavAddressVisible = ref(false)
const visible = ref(false)
const addButtonRef = ref()
const selectGroupId=ref(0)
const {currentAddress ,showBatchAddressDetails} = storeToRefs(useFollowStore())
const conditions = reactive({
  group: 0,
  activeTab: '7d',
  isMonitor: false,
  user_chain: 'AllChains',
  sort: '',
  sort_dir: '',
  keyword: '',
  last_tx_time_max: '',
  last_tx_time_min: '',
  last_trade_time: ''
} as {
  group: number
  activeTab: string
  isMonitor: boolean
  user_chain: string
  sort: string|null
  sort_dir: string|null
  keyword: string
  last_tx_time_max: string|number
  last_tx_time_min: string|number
  last_trade_time: string|number
})
const dataSource=ref([] as Array<any>)
const loading=ref(false)
const pageData = ref({
  total: 10,
  page: 1,
  pageSize: 20
})
const paginationParams = ref({...defaultPaginationParams,pageSize: 20})
const footText = computed(() => {
  if(paginationParams.value.loaded){
    return t('loading')
  }else if(paginationParams.value.finished){
    return t('noMore')
  }else{
    return ''
  }
})
onMounted(() => {
  console.log('mounted walletManage',props)
  init()
})
function init(){
  getTableList()
}
function filterGroup(val: number, row: any) {
  console.log('=>(favoriteTable.vue:58) filterGroup', val, row)
  conditions.group=val
}
function loadMore(remainDistance:number){
  console.log('loadMore remainDistance', remainDistance, paginationParams.value)
  if ((remainDistance <= 20) && !(paginationParams.value.loaded || paginationParams.value.finished)) {
    getTableList()
  }
}
watch([() => conditions], () => {
   paginationParams.value={...defaultPaginationParams,pageSize: 20}
   getTableList()
},{deep: true})
const getTableList = throttle(function() {
  if(paginationParams.value.pageNO===1)loading.value = true
  if (paginationParams.value.loaded) return
  paginationParams.value.loaded = true
  const pageNO = paginationParams.value.pageNO
  const pageSize = paginationParams.value.pageSize
  getAttentionPageList({...conditions, pageNO, pageSize}).then((res) => {
    const data=res?.data||[] 
    if (Array.isArray(data) && data?.length > 0) {
      if(pageNO === 1) {
        dataSource.value = data.map((i:any) => {
          return {
            ...i,
            group_id:conditions.group,
          }
        })
        loading.value = false
      }else{
        dataSource.value = [...dataSource.value].concat(data.filter?.(i => dataSource.value?.every?.(j => j.index !== `${i.user_address}-${i.user_chain}`))
            ?.map(i => ({
              ...i, index: `${i.user_address}-${i.user_chain}`, group_id:conditions.group,
            })))
        }
      paginationParams.value.finished = data?.length < pageSize
      if (!paginationParams.value.finished) {
        paginationParams.value.pageNO++
      }
    }else{
      if(pageNO === 1) {
        dataSource.value = []
      }
      paginationParams.value.finished = true
    }
  }).finally(() => { 
    setTimeout(() => {
      loading.value = false
      paginationParams.value.loaded = false
    }, 200)
  })
}, 500)
const getRowGroupChange = async (val: number, row: any) => {
  await moveFavoriteGroup2({user_chain:row.user_chain, user_address:row.user_address, group:val})
  getTableList()
}
function tableRowClick(row: { user_address: string; user_chain: string }) {
  // $router.push({
  //   name: 'Balance',
  //   params: { userAddress: row.wallet_address, chain: row.chain },
  // })

  $router.push({
    path: `/address/${row.user_address}/${row.user_chain}`,
  })
}
const columns = computed(() => {
  return [
    {
      title: t('wallet'),
      dataKey: 'wallet',
      key: 'wallet',
      align: 'left',
      minWidth: 125,
    },
    {
      title: t('addrGroup'),
      dataKey: 'group',
      key: 'group',
      minWidth: 90,
      align: 'right',
    },
    {
      title: t('chain'),
      dataKey: 'chain',
      key: 'chain',
      align: 'right',
      minWidth: 55,
    },
    {
      title: t('operate'),
      dataKey: 'operate',
      key: 'operate',
      align: 'right',
      minWidth: 80,
    }]
})

</script>

<style scoped lang="scss">
:deep() .el-table {
  --el-table-text-color:var(--d-FFF-l-333);
  --el-table-header-bg-color:transparent;
}
</style>

