<template>
  <div class="w-walletManage">
    <div class="flex flex-between items-center gap-8px h-48px">
      <div ref="selectWrapperRef" class="wallet-manage-select-wrapper" :style="{ width: selectWrapperWidth + 'px' }">
        <el-select v-model="selectGroupId" style="--el-fill-color-blank:var(--dialog-list-hover); width: 100%;" class="[&&]:[--el-text-color-regular:--d-E0E0E0-l-333]" :persistent="false" :mode="mode" @click.stop @change="(val) => filterGroup(val)" size="small">
          <el-option :key="0" :value="0" :label="$t('defaultGroup')" class="[&&]:h-20px [&&]:lh-20px [&&]:text-12px"/>
          <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id"  class="[&&]:h-20px [&&]:lh-20px [&&]:text-12px"/>
        </el-select>
      </div>
      <div class="flex items-center gap-8px">
        <el-button ref="addButtonRef1" class="dialog-button"  style="height: 24px; padding: 4px 8px !important;font-size: 12px; color:var(--d-E0E0E0-l-333);--el-button-border-color:var(--third-text);--el-button-hover-border-color:var(--third-text)" size="small">
          <!-- <Icon name="ic:baseline-person-add-alt-1" class="text-12px  mr-5px"/> -->
          {{ $t('add') }}
        </el-button>
        <el-button class="dialog-button" style="height: 24px;padding: 4px 8px !important; margin-left: 0px;font-size: 12px; color:var(--d-E0E0E0-l-333);--el-button-border-color:var(--third-text);--el-button-hover-border-color:var(--third-text)" @click.stop.prevent="showBatchAddressDetails=true" size="small">
          <!-- <Icon name="mingcute:new-folder-fill" class="text-12px mr-5px"/> -->
          {{ $t('bulkImport') }}
        </el-button>
      </div>
    </div>
    <div v-loading="loading" class="text-12px m-table" element-loading-background="transparent">
      <!-- @scroll="onScroll" -->
      <AveTable
        ref="aveTableRef"
        rowKey="index"
        fixed
        :data="monitorList1"
        :showFooter="showFooter"
        :footText="footText"
        :columns="columns"
        :headerHeight="36"
        :rowHeight="44"

        headerClass="bg-transparent"
        :style="{
          height:props.scrollHeight-50+'px',
          // height:'500px',
          // '--el-table-border':'1px solid #333',
          '--el-table-bg-color':'transparent',
          'overflow':'visible',
          paddingBottom:(showFooter&&footText)?'20px':'0px'
        }"
        row-class='cursor-pointer group'
        :rowEventHandlers="{
        onClick: ({rowData}:RowEventHandlerParams) => tableRowClick(rowData)}"
        @endReached="loadMore"
        >
          <template #header-wallet>
            <div class="flex items-center gap-2px">
              <span>{{ $t('wallet') }}/<span class="cursor-pointer" :class="{ 'color-[--main-text]': lastTxSort }" @click="handleLastTxSortClick">{{ $t('lastTx') }}</span></span>
              <HeadSort :default-sort="lastTxSort" @sort-change="handleLastTxSort" />
            </div>
          </template>
          <template #cell-wallet="{ row, $index }">
            <UserAvatar :key="row.user_address+row.user_chain" class="mr-10px" :wallet_logo="row.wallet_logo" :address="row.user_address" :chain="row.user_chain" iconSize="24px" />
            <div>
              <UserRemark :key="row.user_address+row.user_chain"  :remark="row.remark" :address="row.user_address" :chain="row.user_chain" addressClass="token-symbol ellipsis" addressStyle="max-width: 60px;font-size: 13px;color:var(--d-E0E0E0-l-333)" iconEditColor="var(--third-text)" iconEditSize="10px" showAddressTitle/>
              <div :style="{
                color:
                  Number(formatTimeFromNow(row?.last_tx_time, true)) <= 600? '#FFA622': 'var(--third-text)',
              }">
                <span v-if="!row?.last_tx_time"  class="text-11px">-</span>
                <TimerCount v-else-if="
                  Number(formatTimeFromNow(row?.last_tx_time, true)) < 60
                " :key="`${row.last_tx_time}${$index}`" :timestamp="row.last_tx_time" :end-time="60">
                  <template #default="{ seconds }">
                    <span class="color-#FFA622 text-11px">
                      <template v-if="seconds < 60">
                        {{ seconds }}s
                      </template>
                      <template v-else>
                        {{ formatTimeFromNow(row.last_tx_time) }}
                      </template>
                    </span>
                  </template>
                </TimerCount>
                <div v-else class="text-11px">
                  {{ formatTimeFromNow(row.last_tx_time) }}
                </div>
              </div>
            </div>
          </template>
         <!-- <template #header-group>
            <span>{{ $t('group') }}</span>
          </template>
          <template #cell-group="{ row }">
             <el-select v-model="row.group_id" size="small" :suffix-icon="SuffixIcon" :persistent="false" filterable popper-class="w-addrGroup" class="[&&]:[--el-text-color-regular:--d-E0E0E0-l-333] [&&]:[--el-fill-color-blank:--dialog-list-hover]" @click.stop @change="(val) => getRowGroupChange(val, row)">
              <el-option :key="0" :value="0" :label="$t('defaultGroup')" filterable class="[&&]:h-20px [&&]:lh-20px [&&]:text-12px"/>
              <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" class="[&&]:h-20px [&&]:lh-20px [&&]:text-12px"/>
            </el-select>
          </template> -->
          <!-- <template #header-chain>
            <span>{{ $t('chain') }}</span>
            <el-popover v-model:visible="visible" popper-style="width: 133px;min-width: 133px;" trigger="click">
              <template #reference>
                  <Icon
                    id="custom-filter"
                    name="custom:filter"
                    :style="{
                      color: conditions.user_chain!=='AllChains' ? 'var(--secondary-text)' : 'var(--third-text)'
                    }"
                    class="text-10px cursor-pointer ml-2px"
                  />
              </template>
              <ul>
                <li v-for="item in chainOptions" :key="item.value" class="rounded-2px hover:bg-[--dialog-list-hover] h-26px! flex! items-center! font-500! text-14px! lh-20px! clickable px-8px py-5px" @click.stop="conditions.user_chain=item.value;user_chain=item.value;visible=false">
                  <Icon v-if="item.value=='AllChains'" name="icon-park-outline:link-one" class="text-15px mr-4px rd-50%"/>
                  <img v-else :src="`${token_logo_url}chain/${item?.id}.png`" class="rd-50% mr-4px" width="16" lazy alt="">
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </el-popover>
          </template> -->
          <template #header-group>
            <div class="flex items-center gap-2px">
              <Icon :name="`custom:${!AmountU ? 'amount2' : 'price2'}`"  :class="`color-[--third-text] cursor-pointer text-10px mr-4px`"
                @click.self.stop="AmountU = !AmountU" />
              <span 
                class="cursor-pointer" 
                :class="{ 'color-[--main-text]': balanceSort }"
                @click="handleBalanceSortClick"
              >
                {{ $t('balance1') }}
              </span>
              <HeadSort :default-sort="balanceSort" @sort-change="handleBalanceSort" />
            </div>
          </template>
          <template #cell-group="{ row }">
            <template v-if="!AmountU">
              <div v-if="row?.main_token_balance_amount > 0" :class="!row?.main_token_balance_amount ? 'color-[--third-text]' : ''" class="flex items-center justify-end">
                <img :src="`${token_logo_url}chain/${row.user_chain}.png`" class="rd-50% inline-block mr-2px" width="14" height="14" lazy alt="">{{ formatNumber2(row?.main_token_balance_amount || 0, 2) }}&nbsp;{{row.main_token_symbol}}
              </div>
              <div v-else class="color-[--third-text] flex items-center justify-end">
                0
              </div>
            </template>
            <template v-else>
              <div v-if="row?.main_token_balance_amount > 0" :class="!row?.main_token_balance_amount ? 'color-[--third-text]' : ''" class="flex items-center justify-end">
                ${{formatNumber2(getAmountU(row), 2)}}
              </div>
              <div v-else class="color-[--third-text] flex items-center justify-end">
                $0
              </div>  
            </template>
          </template>
          <template #cell-chain="{ row }">
            <span class="text-12px">{{ getChainInfo(row.user_chain).name }}</span>
          </template>
          <template #header-operate>
            <span>{{ $t('push') }}</span>
          </template>
          <template #cell-operate="{ row ,rowIndex}">
            <div class="flex justify-end items-center" @click.stop>
              <Icon 
                :ref="(el) => groupIconRefs[rowIndex] = el" 
                name="custom:group" 
                class="text-10px mr-4px text-[--third-text] cursor-pointer"
                @click.stop="handleGroupIconClick(row, rowIndex)"
              />
           
              <div
                v-if="SupportMonitorChain.includes(row?.user_chain)"
                class="flex items-center mr-4px cursor-pointer color-[--third-text]"
                @click.stop.prevent="handleMonitor(row,rowIndex)">
                <Icon v-if="row?.is_monitored === 1" name="custom:monitor2-icon" class="text-12px mr-2px color-[--primary-color]"/>
                <Icon v-else name="custom:monitor-icon" class="text-12px mr-2px color-[--third-text]"/>
                <span
                  v-if="props.isLarge"
                  class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out">
                  {{ row?.is_monitored === 1 ? t('pause') : t('enable') }}
                </span>
              </div>
              <div v-else class="flex items-center mr-4px cursor-not-allowed">
                <Icon name="custom:monitor-icon" class="text-12px mr-2px color-[var(--d-666-l-CCC)]" />
              </div>
              <Icon name="bx:bxs-trash-alt" class="text-13px color-[--third-text]" @click.stop.prevent="handleDeleteAttention(row)"/>
            </div>
         </template>
         <template #empty>
          <div v-if="!loading" class="h-full flex flex-col items-center justify-center pt-0px">
            <img v-if="themeStore.theme==='light'" src="@/assets/images/empty-white.svg" alt="">
            <img v-else src="@/assets/images/empty-black.svg" alt="">
            <span class="mt-10px">
              {{ $t('emptyNoData') }}
            </span>
            <el-button ref="addButtonRef2" class="mt-10px" type="primary" size="small">{{ $t('emptyButtonText1') }}</el-button>
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
     <AddFavAddressPop v-if="addButtonRef1" ref="addFavAddressPopRef" :buttonRef="addButtonRef1" @onConfirm="handleConfirmAdd"/>
     <AddFavAddressPop v-if="addButtonRef2" ref="addFavAddressPopRef" :buttonRef="addButtonRef2" @onConfirm="handleConfirmAdd"/>
    <GroupSelect
      v-if="currentRowData"
      :visible="groupSelectVisible"
      :model-value="currentRowData.group_id"
      :trigger-ref="currentTriggerRef"
      :address-groups="addressGroups"
      @update:model-value="handleGroupChange"
      @update:visible="(val) => groupSelectVisible = val"
      @new-group="handleNewGroup"
    />
  </div>
</template>

<script setup lang="ts">
import { getAttentionPageList, moveFavoriteGroup2, deleteAttention ,addAttention2,addAddressMonitor,favUsersResumeMonitor,favUsersPauseMonitor,addFavoriteGroup2} from '~/api/attention'
import { defaultPaginationParams } from '@/utils/constants'
import type {RowEventHandlerParams} from 'element-plus'
import BigNumber from 'bignumber.js'
import { throttle } from 'lodash-es'
import { useStorage } from '@vueuse/core'
import SuffixIcon from '../suffixIcon.vue'
import GroupSelect from './components/groupSelect.vue'
import HeadSort from '~/components/headSort.vue'

const { t } = useI18n()
const $router = useRouter()
const props=defineProps({
  scrollHeight:{
    type:Number,
    default:500
  },
  isLarge:{
    type:Boolean,
    default:false
  },
  chain:{
    type:String,
    default:'AllChains'
  },
})
const { mode, isDark, token_logo_url } = storeToRefs(useGlobalStore())
const chainOptions=computed(()=>{
  return [
    {label: t('allChain'),value:'AllChains',id:'allChains'},
    ...SupportFullDataChain.map(el=>{
      const chainInfo = getChainInfo(el)
      return {
        label:el==='solana' ? 'SOL' : chainInfo.net_name.toUpperCase(),
        value:chainInfo.net_name,
        id:chainInfo.net_name
      }
    })
  ]
})
const aveTableRef = ref()
const visible = ref(false)
const addButtonRef1 = ref() 
const addButtonRef2 = ref() 
const addFavAddressPopRef = ref()
const selectWrapperRef = ref<HTMLElement>()
const selectWrapperWidth = ref(120)
const AmountU = useStorage('walletManageAmountU', false)
const groupIconRefs = ref<Record<string, any>>({})
const currentRowData = ref<any>(null)
const currentRowIndex = ref(0)
const currentTriggerRef = ref<any>(null)
const groupSelectVisible = ref(false)
const balanceSort = ref('')
const lastTxSort = ref('')
// 当前激活的按钮 ref（用于弹框定位）
const currentButtonRef = ref()
// const selectGroupId=ref(0)
const {selectGroupId,paginationParams,user_chain,monitorList1} = storeToRefs(useMonitorStore())
const {currentAddress ,showBatchAddressDetails, updateNum12,updateNum13,updateNum14,updateNum2,updateNum3,addressGroups,delWalletGroup} = storeToRefs(useFollowStore())

const followStore = useFollowStore()
const conditions = reactive({
  group: selectGroupId.value,
  activeTab: '7d',
  isMonitor: false,
  user_chain: props.chain || 'AllChains',
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
const botStore = useBotStore()
const themeStore = useThemeStore()
// const dataSource=ref([] as Array<any>)
const loading=ref(false)
// const pageData = ref({
//   total: 10,
//   page: 1,
//   pageSize: 50
// })
// const paginationParams = monitorStore.paginationParams
const showFooter=ref(false)
const footText = computed(() => {
  if(paginationParams.value.loaded){
    return t('loading')
  }else if(paginationParams.value.finished){
    return ''
  }else{
    return ''
  }
})
// const shouldRenderChild = shallowRef(true)

// const reCreateChild = () => {
//   shouldRenderChild.value = false
//   // 确保 DOM更新
//   nextTick(() => {
//     shouldRenderChild.value = true
//   })
// }
onMounted(() => {
  console.log('mounted walletManage',conditions)
   if(!botStore.evmAddress) return
   if(monitorList1.value.length>0) return
  init()
})
watch(() => updateNum12.value+updateNum13.value+updateNum14.value+updateNum3.value, () => {
  paginationParams.value={...defaultPaginationParams,pageSize: 50}
  if(aveTableRef.value){
    aveTableRef.value.scrollToTop(0)
  }
  getTableList()
})
watch(() => props.chain, (newChain) => {
  conditions.user_chain = newChain || 'AllChains'
  // if(aveTableRef.value) aveTableRef.value.scrollToTop(0)
  // getTableList()
})
// watch(() => monitorStore.visible, (val) => {
//   // console.log('monitorStore.visible', monitorStore.visible)
//   if(val){
//     init()
//   }
// })

function init(){
  getTableList()
}

function handleConfirmAdd(formData:any,resetFields?:() => void,stopLoading?:()=>void) {
  addAttention2({ address:botStore.evmAddress, user_chain: formData?.user_chain?.id ,user_address:formData.address,remark:formData.remark,group:formData.group_id,is_monitored:0}).then(() => {
    // init2()
    resetFields?.()
    stopLoading?.()
    addFavAddressPopRef.value?.close?.()
    paginationParams.value={...defaultPaginationParams,pageSize: 50}
    getTableList()
    updateNum2.value++
  }).catch((err) => {
    console.error(err)
  })
}
function filterGroup(val: number) {
  console.log('filterGroup', val)
  conditions.group=val
}

const handleDeleteAttention=throttle((item: any)=>{
  deleteAttention({address: currentAddress.value, user_chain: item.chain,user_address: item.user_address}).then(() => {
    ElMessage.success(t('success'))
    getTableList()
    updateNum2.value++
  }).catch((e) => {
    ElMessage.error(String(e))
  })
},1000)
const handleMonitor=throttle((row:any,index:number=0)=>{
  console.log('handleMonitor', row, index)
  if(row.is_monitored === 1) {
    const {id,user_address} = row
    // 取消监控
    const req=row.is_pause === 1?favUsersResumeMonitor:favUsersPauseMonitor
    req({
      uid: id,
      address:user_address
    }).then(() => {
      monitorList1.value[index].is_monitored = row.is_monitored===0?1:0
      // monitorList1.value[index].is_pause = row.is_pause===0?1:0
      getTableList()
      // followStore.shouldInitAddressPage={
      //   num: followStore.shouldInitAddressPage.num + 1,
      //   isSelfUpdate: false
      // }
      updateNum2.value++
      ElMessage.success(t('cancelMonitorSuccess'))
    }).catch((e) => { ElMessage.error(String(e)) })
    return
  }else{
    const {user_address,user_chain} = row
    addAddressMonitor({
      address: user_address,
      chain: user_chain,
      user_address: botStore.evmAddress,
    }).then(() => {
      monitorList1.value[index].is_monitored = row.is_monitored===0?1:0
      getTableList()
      ElMessage.success(t('openMonitorSuccess'))
      // followStore.shouldInitAddressPage={
      //   num: followStore.shouldInitAddressPage.num + 1,
      //   isSelfUpdate: false
      // }
      updateNum2.value++
    }).catch((e) => {
        ElMessage.error(String(e))
    })
  }
},1000)
function loadMore(remainDistance:number){
  console.log('loadMore remainDistance', remainDistance, paginationParams.value)
  showFooter.value=remainDistance <= 20
  if ((remainDistance <= 20) && !(paginationParams.value.loaded || paginationParams.value.finished)) {
    getTableList()
  }
}
// function onScroll(scrollParams:any) {
//   console.log('onScroll', scrollParams)
//   // showFooter.value = scrollParams.remainDistance <= 20
//   // if (scrollParams.remainDistance <= 20 && !(paginationParams.value.loaded || paginationParams.value.finished)) {
//   //   getTableList()
//   // }
// }
watch([() => conditions], () => {
   paginationParams.value={...defaultPaginationParams,pageSize: 50}
   getTableList()
},{deep: true})

watch(() => delWalletGroup.value, (val) => {
  if(val) {
    if(selectGroupId.value===val){
      selectGroupId.value=0
      conditions.group=0
      console.log('delWalletGroup', val)
    }
    // getTableList()
    // delWalletGroup.value = false
  }
})


// 通用排序处理函数
const handleSort = (
  sortField: string,
  currentSortRef: Ref<string>,
  otherSortRef: Ref<string>
) => {
  return (sort: string) => {
    // 清除其他排序
    otherSortRef.value = ''
    currentSortRef.value = sort
    
    if (!sort) {
      conditions.sort = ''
      conditions.sort_dir = ''
    } else {
      conditions.sort = sortField
      conditions.sort_dir = sort
    }
  }
}

// 通用点击文本切换排序函数
const handleSortClick = (
  currentSortRef: Ref<string>,
  sortHandler: (sort: string) => void
) => {
  return () => {
    const nextSort = { asc: '', desc: 'asc', '': 'desc' }[currentSortRef.value] || ''
    sortHandler(nextSort)
  }
}

// 余额排序
const handleBalanceSort = handleSort('main_token_balance_amount', balanceSort, lastTxSort)
const handleBalanceSortClick = handleSortClick(balanceSort, handleBalanceSort)

// 最后交易时间排序
const handleLastTxSort = handleSort('last_tx_time', lastTxSort, balanceSort)
const handleLastTxSortClick = handleSortClick(lastTxSort, handleLastTxSort)

// 监听 AmountU 变化，更新排序字段
// watch(AmountU, () => {
//   if (balanceSort.value) {
//     conditions.sort = AmountU.value ? 'total_balance' : 'main_token_balance_amount'
//     conditions.sort_dir = balanceSort.value
//   }
// })

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
        monitorList1.value = data.map((i:any) => {
          return {
            ...i,
            index: `${i.user_address}-${i.user_chain}`,
            group_id:conditions.group,
          }
        })
        loading.value = false
      }else{
        monitorList1.value = [...monitorList1.value].concat(data.filter?.(i => monitorList1.value?.every?.(j => j.index !== `${i.user_address}-${i.user_chain}`))
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
        monitorList1.value = []
      }
      paginationParams.value.finished = true
    }
  }).finally(() => {
    setTimeout(() => {
      loading.value = false
      paginationParams.value.loaded = false
      showFooter.value = false
    }, 200)
  })
}, 500)
const getRowGroupChange = async (val: number, row: any) => {
  paginationParams.value={...defaultPaginationParams,pageSize: 50}
  await moveFavoriteGroup2({user_chain:row.user_chain, user_address:row.user_address, group:val})
  updateNum2.value++
  getTableList()
}

const handleGroupIconClick = (row: any, rowIndex: number) => {
  // 如果点击的是同一行，切换显示状态
  if (currentRowData.value?.index === row.index) {
    groupSelectVisible.value = !groupSelectVisible.value
    return
  }
  
  // 切换到新行
  currentRowData.value = row
  currentRowIndex.value = rowIndex
  currentTriggerRef.value = groupIconRefs.value[rowIndex]
  groupSelectVisible.value = true
}

const handleGroupChange = async (groupId: number) => {
  if (!currentRowData.value) return
  
  try {
    paginationParams.value = { ...defaultPaginationParams, pageSize: 50 }
    await moveFavoriteGroup2({
      user_chain: currentRowData.value.user_chain,
      user_address: currentRowData.value.user_address,
      group: groupId
    })
    
    ElMessage.success(t('success'))
    updateNum2.value++
    getTableList()
  } catch (error) {
    ElMessage.error(String(error))
  }
}

const handleNewGroup = async (name: string) => {
  // 检查分组名称是否已存在
  const existingGroup = addressGroups.value.find(group => group.name === name)
  
  if (existingGroup) {
    // 如果分组已存在，直接切换到该分组
    try {
      paginationParams.value = { ...defaultPaginationParams, pageSize: 50 }
      await moveFavoriteGroup2({
        user_chain: currentRowData.value.user_chain,
        user_address: currentRowData.value.user_address,
        group: existingGroup.group_id
      })
      
      ElMessage.success(t('success'))
      updateNum2.value++
      getTableList()
    } catch (error) {
      ElMessage.error(String(error))
    }
    return
  }
  
  // 如果分组不存在，创建新分组
  try {
    await addFavoriteGroup2(name)
    ElMessage.success(t('success'))
    
    // 刷新分组列表
    await followStore.getUserFavoriteGroups2()
    
    // 找到新创建的分组并切换
    const newGroup = addressGroups.value.find(group => group.name === name)
    if (newGroup) {
      paginationParams.value = { ...defaultPaginationParams, pageSize: 50 }
      await moveFavoriteGroup2({
        user_chain: currentRowData.value.user_chain,
        user_address: currentRowData.value.user_address,
        group: newGroup.group_id
      })
      
      updateNum2.value++
      getTableList()
    }
  } catch (error) {
    ElMessage.error(String(error))
  }
}

function tableRowClick(row: { user_address: string; user_chain: string }) {
  $router.push({
    path: `/address/${row.user_address}/${row.user_chain}`,
  })
}

// 计算选中值的显示文本
const getSelectedLabel = computed(() => {
  if (selectGroupId.value === 0) {
    return t('defaultGroup')
  }
  const group = addressGroups.value.find(g => g.group_id === selectGroupId.value)
  return group?.name || ''
})

// 动态计算宽度
const updateSelectWidth = () => {
  nextTick(() => {
    const text = getSelectedLabel.value
    
    // 创建临时元素测量文本宽度
    const tempSpan = document.createElement('span')
    tempSpan.style.visibility = 'hidden'
    tempSpan.style.position = 'absolute'
    tempSpan.style.whiteSpace = 'nowrap'
    tempSpan.style.fontSize = '12px'
    tempSpan.style.fontFamily = 'inherit'
    tempSpan.style.padding = '0 4px'
    tempSpan.textContent = text
    
    document.body.appendChild(tempSpan)
    const width = tempSpan.offsetWidth
    document.body.removeChild(tempSpan)
    
    // 加上箭头空间(24px)和最小宽度限制
    const calculatedWidth = Math.max(Math.min(width + 20, 120), 60)
    selectWrapperWidth.value = calculatedWidth
  })
}

// 监听选中值变化
watch(selectGroupId, () => {
  updateSelectWidth()
}, { immediate: true })

// 监听地址组变化（可能影响显示文本）
watch(addressGroups, () => {
  updateSelectWidth()
}, { deep: true })

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
    // {
    //   title: t('chain'),
    //   dataKey: 'chain',
    //   key: 'chain',
    //   align: 'right',
    //   minWidth: 55,
    // },
    {
      title: t('push'),
      dataKey: 'operate',
      key: 'operate',
      align: 'right',
      minWidth: 40,
    }]
})

function getAmountU(row: any) {
  return new BigNumber(row.main_token_balance_amount).times(row.main_token_price).toNumber()
}

</script>

<style scoped lang="scss">
:deep() .el-table {
  --el-table-text-color:var(--d-E0E0E0-l-333);
  --el-table-header-bg-color:transparent;
  .el-virtual-scrollbar{
    display: none;
  }
}

.wallet-manage-select-wrapper {
  transition: width 0.2s ease;
  flex-shrink: 0;
}
</style>

