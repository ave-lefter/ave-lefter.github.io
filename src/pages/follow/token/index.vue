<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { cloneDeep } from 'lodash-es'
import { VueDraggableNext } from 'vue-draggable-next'
import { formatNumber2 } from '~/utils/formatNumber'
import { getChainDefaultIcon } from '~/utils'
import ArcProgress from '~/components/arcProgress.vue'
import { getNewFavoriteList, getUserFavoriteGroups, removeFavorite, removeFavoriteGroup, addFavoriteGroup, changeFavoriteGroupName, moveFavoriteGroup, editTokenFavRemark, getGroupChangeIndex, batchDeleteFavorite } from '~/api/fav'
import { WSEventType } from '~/utils/constants'
import type { TableInstance } from 'element-plus'

let sortParam:any={}

let timeoutId: any = null;
const tableRef = ref<TableInstance | null>(null)
const {userFavoriteGroups} = storeToRefs(useGlobalStore())
const {updateNum11,updateNum4,delTokenGroup} = storeToRefs(useFollowStore())
const {isDark,zone} = storeToRefs(useGlobalStore())
const botStore = useBotStore()
const walletStore = useWalletStore()
const configStore = useConfigStore()
const priceV2Store = usePriceV2Store()
const wsStore = useWSStore()
const router = useRouter()
const { t } = useI18n()
const activeTab = ref(0)
const tabsGroup = ref<any[]>([])
const allTabsGroup=computed(()=>{
  return  [
      {
        value: 0,
        label: t('defaultGroup'),
      },
      ...(userFavoriteGroups.value.map(i => ({...i,label:i.name,value:i.group_id}))||[])
    ]
})
// const allTabsGroup = computed(() => {
//   return [
//     { label: t('defaultGroup'), value: 0 },
//     ...tabsGroup.value
//   ]
// })
const moveList = ref<any[]>([])
const moveValue = ref('')

const addGroupInputRef = ref()
const addGroupPopoverRef = ref()
const editGroupPopoverRef = ref()
const moveGroupPopoverRef = ref()
const groupValue = ref('')
const editId = ref<number | undefined>(undefined)

const remarkValue = ref('')
const visibleShow = ref(false)
const coords = ref({ x: 0, y: 0 })
const virtualRef = ref({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: coords.value.y,
    left: coords.value.x,
    bottom: coords.value.y,
    right: coords.value.x,
  }),
  get clientWidth() {
    return 0
  },
  get clientHeight() {
    return 0
  },
})
const rowData = ref<any>({})

const loading = ref(false)
const pageData = ref({
  total: 0,
  page: 1,
  pageSize: 100
})
const tableList = ref<any[]>([])
const { mode } = storeToRefs(useGlobalStore())

const addressValue = computed(() => {
  return botStore.evmAddress || walletStore.address
})


// 12-16 批量取消
watch(() => userFavoriteGroups.value, (val) => {
  tabsGroup.value = val.map((item) => ({
    ...item,
    label: item.name,
    value: item.group_id
  }))
},{immediate: true})

const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})
const favHover=ref(false)

const checkedList=ref(<any[]>[])
const handleSelectionChange = (val: any[]) => {
  console.log('handleSelectionChange', val)
  checkedList.value=val.map(i => i?.token+'-' + i?.chain)
}

const batchDelete=async ()=>{
  await ElMessageBox.confirm(t('removeTokenTips'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    customClass:'w-320px p-16px inputPop',
    cancelButtonClass:'w-140px h-30px',
    confirmButtonClass:'w-140px h-30px ml-8px!',
    dangerouslyUseHTMLString: true,
  })
  console.log('batchDelete', checkedList.value)
  batchDeleteFavorite({
    address: botStore.evmAddress || walletStore.address,
    token_ids: checkedList.value
  }).then(() => {
    ElMessage.success(t('success'))
    updateNum11.value++
    pageData.value.page = 1
    getList()
    tableRef.value!.clearSelection()
    checkedList.value = []
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}
const handlerMouseoverFavHover=()=>{
  favHover.value=true
  clearTimeout(timeoutId);
}

const handlerMouseoutFavHover=()=>{
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    favHover.value = false; // 3 秒后将 favHover 设置为 false
    console.log('favHover set to false');
  }, 3000);
}

onActivated(() => {
  console.log('onDeactivated')
  favHover.value = false;
  checkedList.value = []
  tableRef.value!.clearSelection()
  clearTimeout(timeoutId);
  if (!botStore.evmAddress && !walletStore.address) return
  setActiveTab(activeTab.value)
  // reCreateChild()-
})
watch(() => walletStore.walletSignature[walletStore.address], (newValue) => {
  if (newValue) {
    getList()
    // getGroupList()
  }
})

watch(() => botStore.evmAddress, (newVal) => {
  if (newVal) {
    getList()
    // getGroupList()
  } else {
    tableList.value = []
    tabsGroup.value = []
  }
})

watch(() => walletStore.address, (newVal) => {
  if (newVal) {
    getList()
    // getGroupList()
  } else {
    tableList.value = []
    tabsGroup.value = []
  }
})

// 监听 WebSocket 价格更新
watch(() => wsStore.wsResult[WSEventType.PRICEV2], (priceData) => {
  if (!priceData?.prices || !tableList.value.length) return

  // 更新表格数据中的价格信息
  tableList.value = tableList.value.map(token => {
    const priceUpdate = priceData.prices.find((p: any) =>
      p.token === token.token && p.chain === token.chain
    )

    if (priceUpdate) {
      const newPrice = priceUpdate.uprice
      return {
        ...token,
        current_price_usd: newPrice,
        price_change_24h: priceUpdate.price_change_v2,
        price_change: priceUpdate.price_change,
        pool_circulating_supply: (token.total - token.lock_amount - token.burn_amount - token.other_amount) * newPrice
      }
    }
    return token
  })
}, { deep: true })

// 选择分组
const setActiveTab = (val: number) => {
  activeTab.value = val
  pageData.value.page = 1
  getList()
  tableRef.value!.clearSelection()
  checkedList.value = []
}

// 删除分组
const handleDeleteGroup = async (groupId: number) => {
  await ElMessageBox.confirm(t('removeFavGroupTips'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    dangerouslyUseHTMLString: true,
    customClass: '',
  })
  await removeFavoriteGroup(groupId, addressValue.value)
  ElMessage.success(t('success'))
  useGlobalStore().getUserFavoriteGroups(walletAddress.value)
  delTokenGroup.value = groupId
}

// 添加分组
const handleAddGroup = async () => {
  if (!groupValue.value.trim()) return ElMessage.error(t('enterGroupName'))
  if (groupValue.value.length > 20) return ElMessage.error(t('maximum10characters'))
  if (tabsGroup.value.some(item => item.label === groupValue.value)) return ElMessage.error(t('groupExistT'))
  await addFavoriteGroup(groupValue.value, addressValue.value)
  ElMessage.success(t('success'))
  addGroupPopoverRef.value?.hide()
  useGlobalStore().getUserFavoriteGroups(walletAddress.value)
}

// 重命名分组
const handleUpdateGroup = (item: any) => {
  editId.value = item.value
  groupValue.value = item.label
}

const editHide = () => {
  editId.value = undefined
  groupValue.value = ''
}

// 确认编辑
const handleUpdateGroupConfirm = async (item: any, index: number) => {
  if (!groupValue.value.trim()) return ElMessage.error(t('enterGroupName'))
  if (groupValue.value.length > 20) return ElMessage.error(t('maximum10characters'))
  try {
    await changeFavoriteGroupName(groupValue.value, item.value, addressValue.value)
    ElMessage.success(t('success'))
    editGroupPopoverRef.value[index]?.hide()
    useGlobalStore().getUserFavoriteGroups(walletAddress.value)
  } catch (err) {
    console.log(err)
    // ElMessage.error(err)
  }
}

// 处理移动分组
const handleMoveGroup = () => {
  moveList.value = cloneDeep(tabsGroup.value)
}

// 移动分组确认
const handleMoveGroupConfirm = async () => {
  console.log(moveList.value)
  const loading = ElLoading.service()
  try {
    moveGroupPopoverRef.value?.hide()
    await getGroupChangeIndex({
      address: addressValue.value,
      group: moveList.value.map((item) => item.group_id)
    })
    loading.close()
    tabsGroup.value = cloneDeep(moveList.value)
    useGlobalStore().getUserFavoriteGroups(walletAddress.value)
    ElMessage.success(t('success'))
  } catch (err) {
    loading.close()
    console.log(err)
  }
}

const handleRemarkShow = (row: any, event: any) => {
  const rect = event.currentTarget.getBoundingClientRect()
  coords.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
  visibleShow.value = true
  rowData.value = row
  remarkValue.value = row.remark || ''
}
// 备注
const handleRemarkGroup = async (row: any) => {
  // if (!remarkValue.value.trim()) return ElMessage.error(t('enterRemark'))
  if (remarkValue.value.length > 50) return ElMessage.error(t('remarkError'))
  const tokenId = row.token + '-' + row.chain
  await editTokenFavRemark(tokenId, remarkValue.value, addressValue.value)
  ElMessage.success(t('success'))
  visibleShow.value = false
  getList()
}

const tableRowClick = (row: any) => {
  const containsSpecialString = row?.token
    ? ['inscription', ':', '('].some(str => row.token.includes(str))
    : false

  if (
    row.chain === 'brc20' ||
    row.chain === 'runes' ||
    containsSpecialString
  ) {
    router.push(`/brc/${row.token}-${row.chain}?from=/follow/token`)
  } else {
    router.push(`/token/${row.token}-${row.chain}?from=/follow/token`)
  }
}

// 处理表格排序
const handleSortChange = ({ prop, order }: any) => {
  sortParam={ prop, order }
  if (prop) {
    if (order === 'ascending') {
      tableList.value = tableList.value.toSorted((a, b) => a[prop] - b[prop])
    } else if (order === 'descending') {
      tableList.value = tableList.value.toSorted((a, b) => b[prop] - a[prop])
    } else {
      getList()
    }
  }
}

// 取消收藏
const collect = (row: any) => {
  loading.value = true
  removeFavorite(`${row.token}-${row.chain}`, addressValue.value)
    .then(() => {
      getList()
      // const newList = checkedList.value.filter((item) => item !== `${row.token}-${row.chain}`)
      // checkedList.value = newList
      tableRef.value?.toggleRowSelection(row,false)
      updateNum11.value++
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const getRowGroupChange = async (val: number, row: any) => {
  const tokenId = row.token + '-' + row.chain
  await moveFavoriteGroup(tokenId, val, addressValue.value)
  updateNum11.value++
  getList()
}

// 获取列表
const getList = async () => {
  loading.value = true
  const res: any = await getNewFavoriteList({
    address: addressValue.value,
    group: activeTab.value,
    pageNO: pageData.value.page,
    pageSize: pageData.value.pageSize
  })

  const tableData =
    (res.data &&
      res.data?.map((i: any) => ({
        id: `${i.token}-${i.chain}`,
        ...i,
        price_change_24h:i.price_change_v2||i.price_change||0,
        price_change:i.price_change||0,
        pool_circulating_supply: (i.total - i.lock_amount - i.burn_amount - i.other_amount) * i.current_price_usd,
        group_id: activeTab.value,
      }))) ||
    []
  pageData.value.total = res.total
  tableList.value = tableData

  // 设置价格订阅
  const tokenIds = tableData.map(item => item.id)
  if(sortParam.prop&&sortParam.order){
    handleSortChange(sortParam)
  }
  priceV2Store.setMultiPriceParams('favorite', tokenIds)
  priceV2Store.sendPriceWs()

  loading.value = false
}

watch(()=>zone.value,(val)=>{
  if(sortParam.prop&&sortParam.order){
    sortParam.prop=(val==='24h'? 'price_change_24h' :'price_change')
    handleSortChange(sortParam)
  }
})

watch(()=>updateNum4.value,()=>{
  console.log('updateNum4.value',updateNum4.value)
  setActiveTab(activeTab.value)
})

watch(
  () => delTokenGroup.value,
  (val) => {
    if(val==activeTab.value){
      setActiveTab(0)
    }
  }
)

// 获取分组列表
const getGroupList = async () => {
  const res = await getUserFavoriteGroups(addressValue.value)
  tabsGroup.value = (res || []).filter(el => !!el.name).map((item) => ({
    ...item,
    label: item.name,
    value: item.group_id
  }))
}

onMounted(() => {
  if (!botStore.evmAddress && !walletStore.address) return
  getList()
  // getGroupList()
})

// 组件销毁时清理订阅
onBeforeUnmount(() => {
  priceV2Store.setMultiPriceParams('favorite', [])
  priceV2Store.sendPriceWs()
})
</script>

<template>
  <div class="flex-1 h-[calc(100%-76px)] flex flex-col relative">
    <!-- <ul v-if="botStore.evmAddress || walletStore.address" class="w-operate">
      <li :class="`btn btn1 ${(checkedList.length&&'warning')}`" @click="batchDelete">{{ $t('batchDelete') }}{{checkedList.length?`(${checkedList.length})`:''}}</li>
    </ul> -->
    <div v-if="botStore.evmAddress || walletStore.address"
      class="flex items-center px-16px mt-12px gap-8px overflow-x-auto scrollbar-hide">
      <div v-for="(item, index) in allTabsGroup" :key="item.value"
        class="cursor-pointer text-12px color-[--third-text] bg-[--main-input-button-bg] px-8px h-28px rounded-4px shrink-0 flex items-center"
        :class="[activeTab === item.value && 'bg-[#3F80F7] color-[#F5F5F5]']"
        @click="setActiveTab(item.value)">
        {{ item.label }}
        <el-popover trigger="click" @hide="editHide" ref="editGroupPopoverRef" :width="editId ? 250 : 100"
          popper-style="min-width: 86px;padding: 10px 0;">
          <template #reference>
            <Icon @click.stop v-if="item.value > 0" name="custom:set-up" class="text-12px ml-2px" />
          </template>
          <div>
            <div v-if="!editId">
              <div class="flex items-center cursor-pointer hover:bg-[--d-333-l-FFF] px-10px py-5px"
                @click.stop="handleUpdateGroup(item)">
                <Icon name="fe:edit" class="color-[--d-666-l-999] text-16px" />
                <view class="ml-4px text-12px text-[--d-F5F5F5-l-333]">{{ t('rename') }}</view>
              </div>
              <div class="flex items-center cursor-pointer hover:bg-[--d-333-l-FFF] px-10px py-5px"
                @click.stop="handleDeleteGroup(item.value)">
                <Icon name="bx:bxs-trash-alt" class="text-16px color-[--d-666-l-999]" />
                <view class="ml-4px text-12px text-[--d-F5F5F5-l-333]">{{ t('delete') }}</view>
              </div>
            </div>
            <div v-else class="px-15px">
              <div>{{ t('rename') }}</div>
              <el-input v-model="groupValue" :placeholder="t('enterGroupName')" class="mt-8px w-100%" />
              <div class="flex items-center justify-between mt-12px gap-12px">
                <!-- <div @click="editGroupPopoverRef[index]?.hide()"
                  class="flex-1 text-center cursor-pointer text-14px color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2] px-12px py-8px rounded-4px">
                  {{ t('cancel') }}
                </div> -->
                <el-button class="flex-1" :color="!isDark?'#D9E8FF' : '#1F242C'" @click.stop.prevent="editGroupPopoverRef[index]?.hide()">{{ $t('cancel') }}</el-button>
                <div @click="handleUpdateGroupConfirm(item, index)"
                  class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
                  {{ t('confirm') }}
                </div>
              </div>
            </div>
          </div>
        </el-popover>
      </div>

      <el-popover trigger="click" @show="addGroupInputRef.focus()" @hide="groupValue = ''" ref="addGroupPopoverRef"
        :width="250">
        <template #reference>
          <!-- 新增 -->
          <div @click="editId = undefined"
            class="cursor-pointer text-12px bg-[--main-input-button-bg] color-[--secondary-text] px-8px h-28px rounded-4px shrink-0 flex items-center">
            <Icon name="custom:add-icon" class="text-12px mr-2px" />
            {{ t('newGroup') }}
          </div>
        </template>
        <div>
          <div>{{ t('newGroup') }}</div>
          <el-input ref="addGroupInputRef" v-model="groupValue" :placeholder="t('enterGroupName')"
            class="mt-8px w-100%" />
          <div class="flex items-center justify-between mt-12px gap-12px">
            <!-- <div @click="addGroupPopoverRef?.hide()"
              class="flex-1 text-center cursor-pointer text-14px color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2] px-12px py-8px rounded-4px">
              {{ t('cancel') }}
            </div> -->
            <el-button class="flex-1" :color="!isDark?'#D9E8FF' : '#1F242C'" @click.stop.prevent="addGroupPopoverRef?.hide()">{{ $t('cancel') }}</el-button>
            <div @click="handleAddGroup()"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
              {{ t('confirm') }}
            </div>
          </div>
        </div>
      </el-popover>
      <el-popover v-if="tabsGroup.length" trigger="click" @hide="moveValue = ''" ref="moveGroupPopoverRef" :width="250">
        <template #reference>
          <div @click="handleMoveGroup"
            class="cursor-pointer text-12px bg-[--main-input-button-bg] color-[--secondary-text] px-8px h-28px rounded-4px shrink-0 flex items-center">
            <Icon name="custom:list-icon" class="text-12px mr-2px" />
            {{ t('groupManage') }}
          </div>
        </template>
        <div>
          <div class="mb-8px">{{ t('groupManage') }}</div>
          <!-- <el-input v-model="moveValue" class="mt-8px" :placeholder="t('searchGroup')" /> -->
          <el-scrollbar wrap-class="max-h-[400px]">
            <VueDraggableNext v-model="moveList" :sort="true" ghost-class="ghost" :animation="300">
              <div class="py-12px px-8px flex justify-between items-center hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-move"
                v-for="item in moveList.filter(item => item.label.includes(moveValue))" :key="item.value">
                {{ item.label }}
                <Icon name="custom:move-icon" class="text-16px shrink-0 ml-5px" />
              </div>
            </VueDraggableNext>
          </el-scrollbar>
          <div class="flex items-center justify-between mt-12px gap-12px">
            <!-- <div @click="moveGroupPopoverRef?.hide()"
              class="flex-1 text-center cursor-pointer text-14px color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2] px-12px py-8px rounded-4px">
              {{ t('cancel') }}
            </div> -->
            <el-button class="flex-1" :color="!isDark?'#D9E8FF' : '#1F242C'" @click.stop.prevent="moveGroupPopoverRef?.hide()">{{ $t('cancel') }}</el-button>
            <div @click="handleMoveGroupConfirm"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
              {{ t('confirm') }}
            </div>
          </div>
        </div>
      </el-popover>
    </div>
    <!-- {{favHover}}
    {{checkedList.length}} -->
    <div class="w-100% mt-12px flex-1 overflow-hidden">
      <el-table ref="tableRef"
 v-loading="loading" :height="pageData.total > 50 ? 'calc(100% - 72px)' : '100%'" :data="tableList" fit
        @sort-change="handleSortChange" @row-click="tableRowClick" @selection-change="handleSelectionChange" :row-key="(row:any)=>`${row.token}-${row.chain}`">
        <template #empty>
          <div v-if="botStore.evmAddress || walletStore.address">
            <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
              <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
              <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
              <span>{{ t('emptyNoData') }}</span>
            </div>
            <span v-else />
          </div>
          <AveEmpty v-else>
            <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
            <el-button type="primary" class="mt-10px" @click="botStore.$patch({
              connectVisible: true
            })">
              {{ $t('connectWallet') }}
            </el-button>
          </AveEmpty>
        </template>
        <el-table-column v-if="favHover||checkedList.length" type="selection" width="22" fixed="left" reserve-selection/>
        <el-table-column :label="t('poolPair')" min-width="160" show-overflow-tooltip>
          <template #header>
            <div v-if="favHover||checkedList.length" :class="`batchDel mr-8px ${(checkedList.length&&'warning')}`" @click="batchDelete">{{ $t('batchDelete') }}{{checkedList.length?`(${checkedList.length})`:''}}</div>
            <span>{{ t('poolPair') }}</span>
          </template>
          <template #default="{ row, $index }">
            <NuxtLink :to="`/token/${row.token}-${row.chain}`" @click.stop.prevent>
              <div class="flex items-center">
                <span class="text-[--third-text] text-10px mr-5px">
                  #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
                </span>
                <Icon v-if="addressValue" name="material-symbols:kid-star"
                  class="color-var(--d-999-l-666) h-16px w-16px clickable shrink-0 color-#ffbb19"
                  @click.stop.prevent="collect(row)" @mouseover="handlerMouseoverFavHover" @mouseout="handlerMouseoutFavHover" />
                <div class="relative ml-3px">
                  <el-image class="w-32px h-32px rounded-full mt-6px" :src="getSymbolDefaultIcon({
                    chain: row?.chain,
                    symbol: row.symbol,
                    logo_url: row.logo_url
                  })" lazy>
                    <template #error>
                      <img class="w-32px h-32px rounded-full" :src="getChainDefaultIcon(row?.chain, row.symbol)" />
                    </template>
                    <template #placeholder>
                      <img class="w-32px h-32px rounded-full" :src="getChainDefaultIcon(row?.chain, row.symbol)" />
                    </template>
                  </el-image>
                  <img v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-3px rounded-[50%]"
                    :src="`${configStore.token_logo_url}chain/${row?.chain}.png`" alt=""
                    onerror="this.src='/icon-default.png'" srcset="" />
                </div>
                <div class="ml-8px flex flex-col lh-none justify-between h-32px">
                  <div class="flex items-center">
                    <span class="text-13px text-[--main-text]">{{ row.symbol }}</span>
                    <div class="text-12px text-[--third-text] ml-4px">
                      {{ `[*${row?.token?.slice(-6)}]` }}
                    </div>
                    <Icon @click.stop.prevent v-copy="row?.token" name="bxs:copy"
                      class="ml-4px clickable text-[--third-text] text-12px" />

                    <a class="ml-4px flex items-center"
                      :href="`https://x.com/search?q=(${row?.symbol}OR${row?.token})&src=typed_query&f=live`"
                      target="_blank" @click.stop>
                      <Icon class="text-[--third-text] h-12px w-12px text-12px" name="custom:search" />
                    </a>
                    <img
                      v-if="row.issue_platform"
                      v-tooltip="row.issue_platform"
                      class="ml-4px w-10px h-10px"
                      :src="formatIconTag(row.issue_platform)"
                      alt=""
                    >
                  </div>
                  <div class="flex items-center">
                    <!-- <span class="text-[--d-CCC-l-999]">({{ '*' + row.token?.slice(-4) }})</span> -->
                    <div
                      class="text-[#3f80f7] border-[0.5px] border-solid border-[#3f80f7] box-border rounded-4px bg-transparent text-10px px-4px max-w-[60px] h-16px flex items-center truncate"
                      :title="row.remark" v-if="row.remark">{{ row.remark }}</div>
                    <!-- 备注 -->
                    <div class="flex items-center" ref="buttonRef" @click.stop.prevent='handleRemarkShow(row, $event)'>
                      <Icon class="text-[--third-text] w-12px h-12px ml-4px" name="custom:remark" />
                    </div>
                    <a class="flex items-center" v-if="row?.twitter" v-tooltip="row?.twitter" :href="row?.twitter"
                      target="_blank" @click.stop>
                      <Icon :name="`custom:twitter`" class="text-[--third-text] h-14px w-14px ml-4px" />
                    </a>
                    <a class="flex items-center" v-if="row?.telegram" v-tooltip="row?.telegram" :href="row?.telegram"
                      target="_blank" @click.stop>
                      <Icon :name="`custom:tg`" class="text-[--third-text] h-14px w-14px ml-4px" />
                    </a>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column :label="t('holders')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="holders" align="right">
          <template #default="{ row }">
            <span>
              {{ row.holders }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('price')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="current_price_usd" align="right">
          <template #default="{ row }">
            <span v-html="'$' + formatNumber2(row.current_price_usd)"></span>
          </template>
        </el-table-column>
        <el-table-column :label="t('marketCap')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="pool_circulating_supply" align="right">
          <template #default="{ row }">
            ${{ formatNumber2(row.pool_circulating_supply || 0, 2, 4, 10 ** 4) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Chg')+'%'" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          :prop="zone==='24h'?'price_change_24h':'price_change'" align="right">
          <template #default="{ row }">
            <span v-if="Number((zone==='24h'? row.price_change_24h :row.price_change)|| 0) > 0" class="text-[#12b886]">
              +{{ formatNumber2((zone==='24h'? row.price_change_24h :row.price_change) || 0, 2) }}%
            </span>
            <span v-else-if="Number((zone==='24h'? row.price_change_24h :row.price_change) || 0) == 0" class="text-[#848E9C]">
              0%
            </span>
            <span v-else class="text-[#ff646d]">{{ formatNumber2((zone==='24h'? row.price_change_24h :row.price_change) || 0, 2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('riskScore')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="risk_score" align="right">
          <template #default="{ row }">
            <router-link :to="{ path: `/check/${row.token}-${row.chain}` }" @click.stop>
              <ArcProgress :progress="Number(row.risk_score / 100) || 0" :width="40" :thickness="2" :big="false"
                :height="20" :textHeight="15" :end="true" fontSize="12px" class="arc-progress"></ArcProgress>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="t('24Volume')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="tx_volume_u_24h" align="right">
          <template #default="{ row }">
            ${{ formatNumber2(row?.tx_volume_u_24h || 0, 2, 4, 10 ** 4) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('24TxAddress')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
          prop="tx_count_24h" align="right">
          <template #default="{ row }">
            {{ formatNumber2(row?.tx_count_24h || 0, 2, 4, 10 ** 4) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('tokenGroup')" align="right" width="170">
          <template #default="{ row }">
            <el-select v-model="row.group_id" placement="bottom-end" style="width: 100px;"
              popper-class="follow-select-popper" filterable :persistent="false" class="[&&]:[--el-text-color-regular:var(--secondary-text)] [&&]:[--el-input-icon-color:var(--secondary-text)]"
              @click.stop @change="(val) => getRowGroupChange(val, row)">
              <el-option v-for="item in allTabsGroup" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="h-72px flex justify-end items-center" v-if="pageData.total > 1"
        v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize" layout="prev, pager, next, ->"
        :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" hide-on-single-page @change="getList" />
    </div>

    <el-popover :visible="visibleShow" :virtual-ref="virtualRef" virtual-triggering trigger="click" :width="250">
      <div>
        <div>{{ t('editRemark') }}</div>
        <el-input v-model="remarkValue"  maxlength="50" show-word-limit :placeholder="t('enterRemark')"
          class="mt-8px w-100%" />
        <div class="flex items-center justify-between mt-12px gap-12px">
          <!-- <div @click="visibleShow = false"
            class="flex-1 text-center cursor-pointer text-14px color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2] px-12px py-8px rounded-4px">
            {{ t('cancel') }}
          </div> -->
           <el-button class="flex-1" :color="!isDark?'#D9E8FF' : '#1F242C'" @click.stop.prevent="visibleShow = false">{{ $t('cancel') }}</el-button>
          <div @click="handleRemarkGroup(rowData)"
            class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
            {{ t('confirm') }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss">
.follow-select-popper {
  /* background: var(--d-222-l-FFF) !important; */

  .el-select-dropdown {
    /* background: var(--d-222-l-FFF); */
  }

  .el-select__wrapper {
    /* background: var(--d-222-l-FFF); */
  }

  .el-select-dropdown__item.is-hovering {
    /* background: var(--d-333-l-f5f7fa); */
  }

  .el-popper__arrow::before {
    /* background: var(--d-222-l-FFF) !important; */
    /* display: none; */
  }
}
</style>

<style lang="scss" scoped>
.w-operate{
  position: absolute;
  top: -35px;
  right: 0;
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 12px;
  padding-right: 16px;
  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li :deep() .el-checkbox__input{
    margin-top: 2px;
  }
  li.btn {
    display: flex;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    background-color: var(--main-input-button-bg);
    justify-content: center;
    align-items: center;
    color: var(--secondary-text);
    border-radius: 4px;
    &.btn1{
      height: 28px;
      line-height: 28px;
    }
    &.warning{
      background-color: #F6465D1A;
      color: var(--down-color);
    }
    &.active {
      color: #f5f5f5;
      background-color: var(--d-333-l-0A0B0C);
    }
  }
}
.batchDel{
  display: inline-block;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  background-color: var(--main-input-button-bg);
  justify-content: center;
  align-items: center;
  color: var(--secondary-text);
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  &.warning{
    background-color: #F6465D1A;
    color: var(--down-color);
  }
}

:deep(.el-table .sort-caret) {
  border: solid 4px transparent;
}

:deep(.el-table .caret-wrapper) {
  height: 10px;
}

:deep(.el-table.el-table thead .el-table__cell) {
  height: 40px;
  font-size: 12px !important;
}

:deep(.el-table .cell) {
  padding: 0 16px;
}

:deep(.el-pagination) {
  justify-content: center;

  button {
    border: 1px solid var(--d-333-l-00008);
    border-radius: 50%;
  }

  ul {
    margin: 0 16px;
  }
}

:deep(.el-pager li.is-active) {
  background: #3F80F7;
  color: #fff;
}

:deep(.el-pager li) {
  border-radius: 6px;
}

:deep(.el-table .caret-wrapper) {
  width: 16px;
}

:deep(.el-table) {
  /* --el-table-row-hover-bg-color: var(--d-1A1A1A-l-fafafa); */
  --el-table-text-color: var(--secondary-text);
}
:deep() .el-select.el-select{
  --el-fill-color-blank:var(--tab-active-bg)
}
</style>
